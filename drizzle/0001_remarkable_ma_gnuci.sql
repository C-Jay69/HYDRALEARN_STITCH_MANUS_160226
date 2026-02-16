CREATE TABLE `gameSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameType` varchar(100) NOT NULL,
	`participants` json,
	`status` enum('active','completed','cancelled') DEFAULT 'active',
	`winner` int,
	`scores` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `gameSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rank` int,
	`totalXp` int DEFAULT 0,
	`lessonsCompleted` int DEFAULT 0,
	`currentStreak` int DEFAULT 0,
	`lastUpdatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdById` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`subject` varchar(100),
	`ageGroup` varchar(50),
	`tone` varchar(50),
	`content` json,
	`mediaLinks` json,
	`difficulty` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
	`isPublished` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`type` varchar(50),
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`isAnonymous` boolean DEFAULT false,
	`reportType` varchar(100),
	`encryptedContent` text,
	`status` enum('submitted','reviewed','resolved') DEFAULT 'submitted',
	`reviewedBy` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userInventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemId` varchar(100) NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`itemType` varchar(100),
	`quantity` int DEFAULT 1,
	`acquiredAt` timestamp DEFAULT (now()),
	CONSTRAINT `userInventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`xpEarned` int DEFAULT 0,
	`completionPercentage` decimal(5,2) DEFAULT '0',
	`streak` int DEFAULT 0,
	`lastActivityAt` timestamp DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','teacher','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `hydraHeadAvatar` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `xpPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `wellnessStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `profileCompleted` boolean DEFAULT false NOT NULL;