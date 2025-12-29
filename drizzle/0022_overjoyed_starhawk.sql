ALTER TABLE `affiliates` MODIFY COLUMN `status` enum('pending','active','suspended','inactive','rejected') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `affiliates` ADD `organizationName` varchar(255);--> statement-breakpoint
ALTER TABLE `affiliates` ADD `organizationType` enum('church','ministry','nonprofit','individual','other');--> statement-breakpoint
ALTER TABLE `affiliates` ADD `website` varchar(500);--> statement-breakpoint
ALTER TABLE `affiliates` ADD `description` text;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `expectedReferrals` varchar(255);--> statement-breakpoint
ALTER TABLE `affiliates` ADD `paymentDetails` text;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `rejectionReason` text;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `suspensionReason` text;