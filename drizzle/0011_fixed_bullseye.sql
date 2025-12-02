CREATE TABLE `login_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`loginMethod` varchar(64) DEFAULT 'email',
	`success` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `login_history_id` PRIMARY KEY(`id`)
);
