CREATE TABLE `forum_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topicId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forum_replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`isPinned` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forum_topics_id` PRIMARY KEY(`id`)
);
