CREATE TABLE `bridge_academy_practice_test_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`questionId` int NOT NULL,
	`topicId` int NOT NULL,
	`userAnswer` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`timeSpentSeconds` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_practice_test_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_practice_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`testNumber` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`score` int NOT NULL,
	`percentage` int NOT NULL,
	`timeSpentSeconds` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_practice_tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_readiness_assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`score` int NOT NULL,
	`percentage` int NOT NULL,
	`recommendedPlan` enum('4week','8week','12week') NOT NULL,
	`readinessLevel` enum('beginner','intermediate','advanced') NOT NULL,
	`strengths` text,
	`weaknesses` text,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_readiness_assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_study_schedule_reminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scheduleId` int NOT NULL,
	`reminderType` enum('daily','weekly') NOT NULL,
	`reminderTime` varchar(5) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_study_schedule_reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_study_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`planDuration` enum('4week','8week','12week') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_study_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_study_session_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scheduleId` int NOT NULL,
	`topicId` int NOT NULL,
	`sessionDate` timestamp NOT NULL,
	`durationMinutes` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_study_session_logs_id` PRIMARY KEY(`id`)
);
