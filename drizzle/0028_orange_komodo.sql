CREATE TABLE `id_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`idType` enum('driver_license','state_id','passport') NOT NULL,
	`status` enum('pending','approved','rejected','resubmit_requested') NOT NULL DEFAULT 'pending',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`reviewedBy` int,
	`rejectionReason` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `id_submissions_id` PRIMARY KEY(`id`)
);
