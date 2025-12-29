ALTER TABLE `subscriptions` MODIFY COLUMN `status` enum('active','canceled','past_due','unpaid','suspended') NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `failedPaymentAttempts` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `lastFailedPaymentDate` timestamp;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `nextRetryDate` timestamp;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `accessSuspendedAt` timestamp;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `lastPaymentFailureReason` text;