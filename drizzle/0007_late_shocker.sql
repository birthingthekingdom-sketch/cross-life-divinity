CREATE TABLE `webinars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`meetingUrl` text NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`duration` int NOT NULL DEFAULT 60,
	`recordingUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webinars_id` PRIMARY KEY(`id`)
);
