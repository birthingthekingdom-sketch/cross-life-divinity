CREATE TABLE `pending_written_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizSubmissionId` int NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`courseId` int NOT NULL,
	`questionId` int NOT NULL,
	`questionText` text NOT NULL,
	`studentAnswer` text NOT NULL,
	`status` enum('pending','graded','skipped') NOT NULL DEFAULT 'pending',
	`adminScore` int,
	`adminFeedback` text,
	`gradedAt` timestamp,
	`gradedBy` int,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pending_written_answers_id` PRIMARY KEY(`id`)
);
