ALTER TABLE `certificates` ADD `verificationToken` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` ADD `cpdHours` int NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `cpdHours` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_verificationToken_unique` UNIQUE(`verificationToken`);