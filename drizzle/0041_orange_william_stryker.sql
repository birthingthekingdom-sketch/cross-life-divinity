CREATE TABLE `preview_conversions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`userId` int NOT NULL,
	`previewedAt` timestamp NOT NULL,
	`enrolledAt` timestamp NOT NULL,
	`previewDuration` int NOT NULL DEFAULT 0,
	`quizAttempts` int NOT NULL DEFAULT 0,
	`conversionDays` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `preview_conversions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `preview_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`userId` int,
	`eventType` enum('view','quiz_attempt','lesson_view','study_guide_download') NOT NULL,
	`sessionId` varchar(64),
	`duration` int NOT NULL DEFAULT 0,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `preview_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webinar_attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webinarId` int NOT NULL,
	`userId` int NOT NULL,
	`status` enum('registered','attended','no_show','excused') NOT NULL DEFAULT 'registered',
	`markedAt` timestamp,
	`markedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webinar_attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webinar_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webinarId` int NOT NULL,
	`userId` int NOT NULL,
	`notificationType` enum('reminder_24h','reminder_1h','recording_available') NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webinar_notifications_id` PRIMARY KEY(`id`)
);
