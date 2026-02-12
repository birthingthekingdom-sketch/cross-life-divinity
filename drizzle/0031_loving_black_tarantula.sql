DROP TABLE `id_submissions`;--> statement-breakpoint
DROP TABLE `pending_written_answers`;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `status` enum('active','canceled','past_due','unpaid') NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `failedPaymentAttempts`;--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `lastFailedPaymentDate`;--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `nextRetryDate`;--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `accessSuspendedAt`;--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `lastPaymentFailureReason`;