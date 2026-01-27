CREATE TABLE `free_trials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trialType` enum('bridge_academy','subscription','learning_path','bundle') NOT NULL,
	`courseId` int,
	`bundleId` int,
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`autoChargeDate` timestamp NOT NULL,
	`status` enum('active','cancelled','converted_to_paid','expired') NOT NULL DEFAULT 'active',
	`cancelledAt` timestamp,
	`chargedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `free_trials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trial_content_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trialId` int NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int,
	`quizId` int,
	`contentType` enum('lesson','quiz','assignment') NOT NULL,
	`accessedAt` timestamp NOT NULL DEFAULT (now()),
	`copyAttempted` boolean NOT NULL DEFAULT false,
	`screenshotAttempted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `trial_content_access_id` PRIMARY KEY(`id`)
);
