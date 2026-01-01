import { getDb } from './db';
import { courseEnrollments, users, idSubmissions } from '../drizzle/schema';
import { eq, and, isNull, lte } from 'drizzle-orm';
import * as emailNotifications from './email-notifications';

/**
 * Send courtesy reminders to students that their ID verification is still pending
 * This is informational only - no deadlines or penalties apply
 * Called daily at 8 AM (optional - can be disabled if not needed)
 */
export async function sendPendingVerificationReminders() {
  try {
    const database = await getDb();
    if (!database) {
      console.error('Database not available for pending verification reminders');
      return;
    }

    // Get pending ID submissions that are 48+ hours old
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const pendingSubmissions = await database
      .select()
      .from(idSubmissions)
      .where(
        and(
          eq(idSubmissions.status, 'pending'),
          lte(idSubmissions.submittedAt, fortyEightHoursAgo)
        )
      );

    let remindersSent = 0;

    for (const submission of pendingSubmissions) {
      try {
        const user = await database
          .select()
          .from(users)
          .where(eq(users.id, submission.userId))
          .limit(1);

        if (user.length > 0) {
          // Send courtesy reminder that verification is still pending
          await emailNotifications.sendIdVerificationReminderEmail(
            submission.userId,
            null // No deadline - just informational
          );
          remindersSent++;
        }
      } catch (error) {
        console.error(`Failed to send reminder to user ${submission.userId}:`, error);
      }
    }

    console.log(`[ID Verification Scheduler] Sent ${remindersSent} pending verification reminders`);
  } catch (error) {
    console.error('Error sending pending verification reminders:', error);
  }
}

/**
 * NOTE: The new workflow does NOT enforce deadlines or suspend access
 * Students have immediate access to courses upon enrollment
 * Admin has 72 hours to review ID verification, but no automatic penalties apply
 * If admin finds issues, they contact the student directly via email
 */
