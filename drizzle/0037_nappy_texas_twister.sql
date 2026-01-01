ALTER TABLE `course_enrollments` ADD `idVerificationDeadlineAt` timestamp;--> statement-breakpoint
ALTER TABLE `course_enrollments` ADD `idVerificationCompletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `course_enrollments` ADD `accessSuspendedAt` timestamp;