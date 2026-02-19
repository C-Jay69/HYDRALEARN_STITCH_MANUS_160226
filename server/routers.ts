import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

// Teacher-only procedure
const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "teacher" && ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User procedures
  user: router({
    profile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user!.id);
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        hydraHeadAvatar: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const updatedUser = await db.updateUserProfile(ctx.user!.id, input);
        return {
          success: true,
          user: updatedUser,
        } as const;
      }),
  }),

  // Lesson procedures
  lesson: router({
    list: publicProcedure.query(async () => {
      return await db.getPublishedLessons();
    }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonById(input.id);
      }),
    create: teacherProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        subject: z.string(),
        ageGroup: z.string(),
        tone: z.string(),
        content: z.any().optional(),
        mediaLinks: z.array(z.string()).optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createLesson({
          createdById: ctx.user!.id,
          ...input,
        });
      }),
    generateWithAI: teacherProcedure
      .input(z.object({
        subject: z.string(),
        ageGroup: z.string(),
        tone: z.string(),
        topic: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const prompt = `Create an engaging educational lesson for ${input.ageGroup} year olds about "${input.topic}" in ${input.subject}. 
        Use a ${input.tone} tone. Include learning objectives, key concepts, activities, and assessment methods.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert educational content creator. Generate structured lesson plans.",
            },
            {
              role: "user",
              content: prompt,
            },
          ] as any,
        });

        const content = response.choices[0]?.message.content;

        return await db.createLesson({
          createdById: ctx.user!.id,
          title: `${input.topic} - ${input.subject}`,
          subject: input.subject,
          ageGroup: input.ageGroup,
          tone: input.tone,
          content: { lessonContent: content },
          difficulty: "intermediate",
          isPublished: false,
        });
      }),
  }),

  // Progress procedures
  progress: router({
    getUserProgress: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProgress(ctx.user!.id);
    }),
    updateProgress: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        xpEarned: z.number().optional(),
        completionPercentage: z.number().optional(),
        streak: z.number().optional(),
        completed: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { lessonId, ...data } = input;
        return await db.updateUserProgress(ctx.user!.id, lessonId, data);
      }),
  }),

  // Leaderboard procedures
  leaderboard: router({
    getTop: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await db.getLeaderboard(input.limit);
      }),
    getUserRank: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getUserLeaderboardRank(input.userId);
      }),
  }),

  // Reports procedures (Counselor's Corner)
  report: router({
    create: protectedProcedure
      .input(z.object({
        reportType: z.string(),
        encryptedContent: z.string(),
        isAnonymous: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createReport({
          userId: input.isAnonymous ? null : ctx.user!.id,
          ...input,
        });
      }),
    list: adminProcedure
      .input(z.object({ status: z.string().optional() }))
      .query(async ({ input }) => {
        return await db.getReports({ status: input.status });
      }),
    updateStatus: adminProcedure
      .input(z.object({
        reportId: z.number(),
        status: z.enum(["submitted", "reviewed", "resolved"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.updateReportStatus(
          input.reportId,
          input.status,
          ctx.user!.id,
          input.notes
        );
      }),
  }),

  // Game procedures
  game: router({
    startSession: protectedProcedure
      .input(z.object({
        gameType: z.string(),
        participants: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        return await db.createGameSession({
          gameType: input.gameType,
          participants: input.participants,
          status: "active",
        });
      }),
    endSession: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        winner: z.number().optional(),
        scores: z.record(z.string(), z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateGameSession(input.sessionId, {
          status: "completed",
          winner: input.winner,
          scores: input.scores,
          completedAt: new Date(),
        });
      }),
  }),

  // Inventory procedures
  inventory: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserInventory(ctx.user!.id);
    }),
    addItem: protectedProcedure
      .input(z.object({
        itemId: z.string(),
        itemName: z.string(),
        itemType: z.string(),
        quantity: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.addInventoryItem(ctx.user!.id, input);
      }),
  }),

  // Notification procedures
  notification: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user!.id);
    }),
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.markNotificationAsRead(input.notificationId);
      }),
  }),

  // AI procedures
  ai: router({
    generateActivity: teacherProcedure
      .input(z.object({
        subject: z.string(),
        topic: z.string(),
        ageGroup: z.string(),
        activityType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const prompt = `Create a ${input.activityType} activity for ${input.ageGroup} year olds about "${input.topic}" in ${input.subject}.
        Make it engaging and educational. Include clear instructions and expected outcomes.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert educator creating engaging classroom activities.",
            },
            {
              role: "user",
              content: prompt,
            },
          ] as any,
        });

        return {
          activity: response.choices[0]?.message.content,
        };
      }),
    chatWithSidekick: protectedProcedure
      .input(z.object({
        message: z.string(),
        context: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const systemPrompt = `You are HydraLearn Sidekick, an AI tutor helping students learn. 
        Be encouraging, clear, and adapt to their learning level. 
        ${input.context ? `Context: ${input.context}` : ""}`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: input.message,
            },
          ] as any,
        });

        return {
          response: response.choices[0]?.message.content,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
