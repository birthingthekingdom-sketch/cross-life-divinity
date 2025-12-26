CREATE TABLE `assignment_grades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`grade` int NOT NULL,
	`feedback` text NOT NULL,
	`rubricScores` text,
	`gradedBy` int NOT NULL,
	`gradedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assignment_grades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignment_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`fileUrl` text NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`notes` text,
	`status` enum('submitted','graded','returned') NOT NULL DEFAULT 'submitted',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignment_submissions_id` PRIMARY KEY(`id`)
);
