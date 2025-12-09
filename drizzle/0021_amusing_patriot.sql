CREATE TABLE `affiliate_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`affiliateCode` varchar(50) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`referrerUrl` text,
	`landingPage` text,
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_commissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`referralId` int NOT NULL,
	`orderId` varchar(255),
	`amount` int NOT NULL,
	`type` enum('subscription','course','bundle') NOT NULL,
	`status` enum('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	`paidAt` timestamp,
	CONSTRAINT `affiliate_commissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`amount` int NOT NULL,
	`payoutMethod` enum('paypal','bank_transfer','check') NOT NULL,
	`payoutEmail` varchar(320),
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(255),
	`notes` text,
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `affiliate_payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`referralCode` varchar(50) NOT NULL,
	`status` enum('pending','converted','cancelled') NOT NULL DEFAULT 'pending',
	`referralDate` timestamp NOT NULL DEFAULT (now()),
	`conversionDate` timestamp,
	`ipAddress` varchar(45),
	`userAgent` text,
	CONSTRAINT `affiliate_referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`affiliateCode` varchar(50) NOT NULL,
	`status` enum('pending','active','suspended','inactive') NOT NULL DEFAULT 'pending',
	`subscriptionCommissionRate` int NOT NULL DEFAULT 25,
	`courseCommissionRate` int NOT NULL DEFAULT 35,
	`payoutEmail` varchar(320),
	`payoutMethod` enum('paypal','bank_transfer','check') DEFAULT 'paypal',
	`totalEarnings` int NOT NULL DEFAULT 0,
	`pendingEarnings` int NOT NULL DEFAULT 0,
	`paidEarnings` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`approvedAt` timestamp,
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_affiliateCode_unique` UNIQUE(`affiliateCode`)
);
