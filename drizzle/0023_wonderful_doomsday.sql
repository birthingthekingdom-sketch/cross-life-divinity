ALTER TABLE `courses` ADD `price` int DEFAULT 89 NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `requiresBackgroundCheck` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `backgroundCheckFee` int DEFAULT 0 NOT NULL;