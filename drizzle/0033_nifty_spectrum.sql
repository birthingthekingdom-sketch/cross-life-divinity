CREATE TABLE `bridge_academy_subject_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`courseName` varchar(255) NOT NULL,
	`courseCode` varchar(32) NOT NULL,
	`certificateNumber` varchar(50) NOT NULL,
	`verificationToken` varchar(64) NOT NULL,
	`score` int NOT NULL,
	`completionDate` timestamp NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_subject_certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `bridge_academy_subject_certificates_certificateNumber_unique` UNIQUE(`certificateNumber`),
	CONSTRAINT `bridge_academy_subject_certificates_verificationToken_unique` UNIQUE(`verificationToken`)
);
--> statement-breakpoint
CREATE TABLE `bridge_academy_transcripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateId` int NOT NULL,
	`courseId` int NOT NULL,
	`courseName` varchar(255) NOT NULL,
	`courseCode` varchar(32) NOT NULL,
	`topicsCompleted` int NOT NULL,
	`totalTopics` int NOT NULL,
	`averageScore` int NOT NULL,
	`completionDate` timestamp NOT NULL,
	`studyHours` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bridge_academy_transcripts_id` PRIMARY KEY(`id`)
);
