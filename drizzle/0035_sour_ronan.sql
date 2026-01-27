CREATE TABLE `bridge_academy_practice_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attemptId` int NOT NULL,
	`questionId` int NOT NULL,
	`userAnswer` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_practice_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_practice_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topicId` int NOT NULL,
	`courseId` int NOT NULL,
	`attemptNumber` int NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`percentage` int NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_practice_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_practice_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topicId` int NOT NULL,
	`question` text NOT NULL,
	`questionType` enum('multiple_choice','true_false','short_answer') NOT NULL,
	`options` text,
	`correctAnswer` text NOT NULL,
	`explanation` text,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`variationGroup` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_practice_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_student_difficulty_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topicId` int NOT NULL,
	`courseId` int NOT NULL,
	`currentDifficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'easy',
	`averageScore` int NOT NULL DEFAULT 0,
	`attemptCount` int NOT NULL DEFAULT 0,
	`bestScore` int NOT NULL DEFAULT 0,
	`improvementTrend` int DEFAULT 0,
	`lastAttemptAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_student_difficulty_profiles_id` PRIMARY KEY(`id`)
);
