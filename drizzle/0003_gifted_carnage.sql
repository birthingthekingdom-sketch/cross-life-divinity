CREATE TABLE `access_code_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accessCodeId` int NOT NULL,
	`courseId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `access_code_courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`accessCodeId` int NOT NULL,
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_enrollments_id` PRIMARY KEY(`id`)
);
