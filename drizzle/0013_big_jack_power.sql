CREATE TABLE `peer_review_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`peerReviewId` int NOT NULL,
	`strengthsComment` text NOT NULL,
	`improvementComment` text NOT NULL,
	`theologicalDepthRating` int NOT NULL,
	`contentQualityRating` int NOT NULL,
	`writingQualityRating` int NOT NULL,
	`overallComment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `peer_review_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `peer_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`reviewerId` int NOT NULL,
	`status` enum('pending','completed') NOT NULL DEFAULT 'pending',
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `peer_reviews_id` PRIMARY KEY(`id`)
);
