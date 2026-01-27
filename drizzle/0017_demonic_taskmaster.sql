CREATE TABLE `bundle_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bundleId` int NOT NULL,
	`courseId` int NOT NULL,
	`courseOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bundle_courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_bundles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(64) DEFAULT 'BookOpen',
	`colorTheme` varchar(32) DEFAULT 'blue',
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_bundles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_paths` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`goal` text,
	`duration` varchar(64),
	`level` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
	`icon` varchar(64) DEFAULT 'Map',
	`colorTheme` varchar(32) DEFAULT 'purple',
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_paths_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `path_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pathId` int NOT NULL,
	`courseId` int NOT NULL,
	`courseOrder` int NOT NULL,
	`isRequired` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `path_courses_id` PRIMARY KEY(`id`)
);
