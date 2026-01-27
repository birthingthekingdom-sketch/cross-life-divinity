CREATE TABLE `plagiarism_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`similarityScore` int NOT NULL,
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`reportData` text,
	`checkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plagiarism_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `lessons` ADD `assignmentDueDate` timestamp;