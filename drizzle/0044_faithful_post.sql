DROP TABLE `bridge_academy_practice_answers`;--> statement-breakpoint
DROP TABLE `bridge_academy_practice_attempts`;--> statement-breakpoint
DROP TABLE `bridge_academy_practice_questions`;--> statement-breakpoint
DROP TABLE `bridge_academy_practice_test_answers`;--> statement-breakpoint
DROP TABLE `bridge_academy_practice_tests`;--> statement-breakpoint
DROP TABLE `bridge_academy_readiness_assessments`;--> statement-breakpoint
DROP TABLE `bridge_academy_student_difficulty_profiles`;--> statement-breakpoint
DROP TABLE `bridge_academy_study_schedule_reminders`;--> statement-breakpoint
DROP TABLE `bridge_academy_study_schedules`;--> statement-breakpoint
DROP TABLE `bridge_academy_study_session_logs`;--> statement-breakpoint
DROP TABLE `course_previews`;--> statement-breakpoint
DROP TABLE `email_templates`;--> statement-breakpoint
DROP TABLE `id_submissions`;--> statement-breakpoint
DROP TABLE `preview_conversions`;--> statement-breakpoint
DROP TABLE `preview_events`;--> statement-breakpoint
DROP TABLE `preview_quiz_attempts`;--> statement-breakpoint
DROP TABLE `preview_tracking`;--> statement-breakpoint
DROP TABLE `qr_code_scans`;--> statement-breakpoint
DROP TABLE `qr_codes`;--> statement-breakpoint
DROP TABLE `webinar_attendance`;--> statement-breakpoint
DROP TABLE `webinar_notifications`;--> statement-breakpoint
DROP TABLE `webinar_registrations`;--> statement-breakpoint
ALTER TABLE `course_enrollments` DROP COLUMN `idVerificationCompletedAt`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `courseType`;