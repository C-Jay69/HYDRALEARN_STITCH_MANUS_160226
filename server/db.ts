import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql, { type Pool } from "mysql2/promise";
import { InsertUser, users, lessons, userProgress, leaderboard, reports, gameSessions, userInventory, notifications } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      if (!_pool) {
        _pool = mysql.createPool({
          uri: ENV.databaseUrl,
        });
      }
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: { name?: string; hydraHeadAvatar?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Partial<InsertUser> = {};

  if (typeof data.name === "string") {
    updateData.name = data.name;
  }

  if (typeof data.hydraHeadAvatar === "string") {
    updateData.hydraHeadAvatar = data.hydraHeadAvatar;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  await db.update(users).set(updateData).where(eq(users.id, userId));
  return await getUserById(userId);
}

// Lesson queries
export async function createLesson(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(lessons).values(data);
  return result;
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPublishedLessons() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(lessons).where(eq(lessons.isPublished, true));
}

export async function getLessonsByCreator(creatorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(lessons).where(eq(lessons.createdById, creatorId));
}

// User progress queries
export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

export async function updateUserProgress(userId: number, lessonId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
    .limit(1);

  if (existing.length > 0) {
    return await db
      .update(userProgress)
      .set(data)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
  } else {
    return await db.insert(userProgress).values({
      userId,
      lessonId,
      ...data,
    });
  }
}

// Leaderboard queries
export async function getLeaderboard(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(leaderboard).orderBy(desc(leaderboard.totalXp)).limit(limit);
}

export async function getUserLeaderboardRank(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(leaderboard).where(eq(leaderboard.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateLeaderboard(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(leaderboard).where(eq(leaderboard.userId, userId)).limit(1);

  if (existing.length > 0) {
    return await db.update(leaderboard).set(data).where(eq(leaderboard.userId, userId));
  } else {
    return await db.insert(leaderboard).values({
      userId,
      ...data,
    });
  }
}

// Reports queries
export async function createReport(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(reports).values(data);
}

export async function getReports(filters?: any) {
  const db = await getDb();
  if (!db) return [];

  if (filters?.status) {
    return await db.select().from(reports).where(eq(reports.status, filters.status));
  }

  return await db.select().from(reports);
}

export async function updateReportStatus(reportId: number, status: string, reviewedBy?: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const data: any = { status };
  if (reviewedBy) data.reviewedBy = reviewedBy;
  if (notes) data.notes = notes;

  return await db.update(reports).set(data).where(eq(reports.id, reportId));
}

// Game sessions queries
export async function createGameSession(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(gameSessions).values(data);
}

export async function getGameSession(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(gameSessions).where(eq(gameSessions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateGameSession(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(gameSessions).set(data).where(eq(gameSessions.id, id));
}

// User inventory queries
export async function getUserInventory(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userInventory).where(eq(userInventory.userId, userId));
}

export async function addInventoryItem(userId: number, itemData: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(userInventory).values({
    userId,
    ...itemData,
  });
}

// Notifications queries
export async function createNotification(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(notifications).values({
    userId,
    ...data,
  });
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}
