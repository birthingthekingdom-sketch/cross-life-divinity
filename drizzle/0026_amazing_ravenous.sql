CREATE TABLE `id_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`idType` enum('drivers_license','state_id','passport') NOT NULL,
	`documentUrl` text NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int NOT NULL,
	`status` enum('pending','approved','rejected','resubmit_requested') NOT NULL DEFAULT 'pending',
	`verificationNotes` text,
	`approvedAt` timestamp,
	`rejectedAt` timestamp,
	`rejectionReason` text,
	`adminId` int,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `id_submissions_id` PRIMARY KEY(`id`)
);
