CREATE TABLE `follow_ups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`adminId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`notes` text,
	`status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`dueDate` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `follow_ups_id` PRIMARY KEY(`id`)
);
