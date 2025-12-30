CREATE TABLE `bridge_academy_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateNumber` varchar(50) NOT NULL,
	`verificationToken` varchar(64) NOT NULL,
	`completionDate` timestamp NOT NULL,
	`averageScore` int NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `bridge_academy_certificates_certificateNumber_unique` UNIQUE(`certificateNumber`),
	CONSTRAINT `bridge_academy_certificates_verificationToken_unique` UNIQUE(`verificationToken`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeSubscriptionId` varchar(255),
	`status` enum('active','canceled','past_due','unpaid') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_enrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `bridge_academy_enrollments_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`topicsCompleted` int NOT NULL DEFAULT 0,
	`totalTopics` int NOT NULL,
	`averageScore` int NOT NULL DEFAULT 0,
	`lastActivityAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_quiz_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`questionId` int NOT NULL,
	`userAnswer` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_quiz_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topicId` int NOT NULL,
	`question` text NOT NULL,
	`questionType` enum('multiple_choice','true_false','short_answer') NOT NULL,
	`options` text,
	`correctAnswer` text NOT NULL,
	`explanation` text,
	`questionOrder` int NOT NULL,
	`difficulty` enum('easy','medium','hard') DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_quiz_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topicId` int NOT NULL,
	`courseId` int NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`percentage` int NOT NULL,
	`passed` boolean NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_quiz_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`topicOrder` int NOT NULL,
	`khanaAcademyPlaylistId` varchar(255),
	`khanaAcademyVideoIds` text,
	`studyGuideUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bridge_academy_topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referral_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`referralId` int NOT NULL,
	`creditAmount` int NOT NULL,
	`creditType` enum('referrer_bonus','referred_bonus') NOT NULL,
	`status` enum('pending','available','applied','expired') NOT NULL DEFAULT 'available',
	`appliedToOrderId` varchar(255),
	`appliedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referral_credits_id` PRIMARY KEY(`id`)
);
