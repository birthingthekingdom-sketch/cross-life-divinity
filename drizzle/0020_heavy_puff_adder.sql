CREATE TABLE `email_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`smtpHost` varchar(255) NOT NULL,
	`smtpPort` int NOT NULL,
	`smtpUser` varchar(255) NOT NULL,
	`smtpPassword` varchar(255) NOT NULL,
	`fromEmail` varchar(320) NOT NULL,
	`fromName` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_settings_id` PRIMARY KEY(`id`)
);
