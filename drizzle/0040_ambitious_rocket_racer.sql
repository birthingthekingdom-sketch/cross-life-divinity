CREATE TABLE `course_previews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`previewLessonId` int NOT NULL,
	`studyGuideUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_previews_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_previews_courseId_unique` UNIQUE(`courseId`)
);
--> statement-breakpoint
CREATE TABLE `preview_quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`lessonId` int NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `preview_quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webinar_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`webinarId` int NOT NULL,
	`registeredAt` timestamp NOT NULL DEFAULT (now()),
	`attended` boolean NOT NULL DEFAULT false,
	`attendedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webinar_registrations_id` PRIMARY KEY(`id`)
);
