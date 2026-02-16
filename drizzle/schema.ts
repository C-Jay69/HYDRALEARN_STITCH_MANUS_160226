import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "teacher", "admin"]).default("user").notNull(),
  hydraHeadAvatar: varchar("hydraHeadAvatar", { length: 255 }),
  xpPoints: int("xpPoints").default(0).notNull(),
  wellnessStreak: int("wellnessStreak").default(0).notNull(),
  profileCompleted: boolean("profileCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Lessons table for storing pedagogical content
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  createdById: int("createdById").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 100 }),
  ageGroup: varchar("ageGroup", { length: 50 }),
  tone: varchar("tone", { length: 50 }),
  content: json("content"),
  mediaLinks: json("mediaLinks"),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).default("beginner"),
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

// User progress tracking
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  xpEarned: int("xpEarned").default(0),
  completionPercentage: decimal("completionPercentage", { precision: 5, scale: 2 }).default("0"),
  streak: int("streak").default(0),
  lastActivityAt: timestamp("lastActivityAt").defaultNow(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

// Leaderboard for real-time ranking
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rank: int("rank"),
  totalXp: int("totalXp").default(0),
  lessonsCompleted: int("lessonsCompleted").default(0),
  currentStreak: int("currentStreak").default(0),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().onUpdateNow(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = typeof leaderboard.$inferInsert;

// Counselor's corner reports (encrypted, anonymous option)
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  isAnonymous: boolean("isAnonymous").default(false),
  reportType: varchar("reportType", { length: 100 }),
  encryptedContent: text("encryptedContent"),
  status: mysqlEnum("status", ["submitted", "reviewed", "resolved"]).default("submitted"),
  reviewedBy: int("reviewedBy"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Game sessions for multiplayer games
export const gameSessions = mysqlTable("gameSessions", {
  id: int("id").autoincrement().primaryKey(),
  gameType: varchar("gameType", { length: 100 }).notNull(),
  participants: json("participants"),
  status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active"),
  winner: int("winner"),
  scores: json("scores"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = typeof gameSessions.$inferInsert;

// User inventory for items and collectibles
export const userInventory = mysqlTable("userInventory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemId: varchar("itemId", { length: 100 }).notNull(),
  itemName: varchar("itemName", { length: 255 }).notNull(),
  itemType: varchar("itemType", { length: 100 }),
  quantity: int("quantity").default(1),
  acquiredAt: timestamp("acquiredAt").defaultNow(),
});

export type UserInventory = typeof userInventory.$inferSelect;
export type InsertUserInventory = typeof userInventory.$inferInsert;

// Notifications
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  type: varchar("type", { length: 50 }),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
