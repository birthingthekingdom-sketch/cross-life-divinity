import { getDb } from './db';
import { courseEnrollments, users } from '../drizzle/schema';
import { eq, and, isNull, lte } from 'drizzle-orm';
import * as emailNotifications from './email-notifications';

/**
 * Send reminder emails for students approaching the 7-day deadline
 * Called daily at 8 AM
 */
export async function sendDeadlineReminders() {
  try {
    const database = await getDb();
    if (!database) {
      console.error('Database not available for deadline reminders');
      return;
    }

    const now = new Date();
    const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const sixDaysLater = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

    // Get enrollments that are 5-6 days old (approaching deadline)
    const enrollments = await database
      .select()
      .from(courseEnrollments)
      .where(
        and(
          isNull(courseEnrollments.idVerificationCompletedAt),
          isNull(courseEnrollments.accessSuspendedAt),
          lte(courseEnrollments.enrolledAt, fiveDaysLater)
        )
      );

    let remindersSent = 0;

    for (const enrollment of enrollments) {
      const enrolledAt = new Date(enrollment.enrolledAt);
      const daysOld = Math.floor((now.getTime() - enrolledAt.getTime()) / (24 * 60 * 60 * 1000));

      // Send reminder on day 5 and day 6
      if (daysOld === 5 || daysOld === 6) {
        try {
          const user = await database
            .select()
            .from(users)
            .where(eq(users.id, enrollment.userId))
            .limit(1);

          if (user.length > 0) {
            const daysRemaining = 7 - daysOld;
            await emailNotifications.sendIdVerificationReminderEmail(
              enrollment.userId,
              daysRemaining
            );
            remindersSent++;
          }
        } catch (error) {
          console.error(`Failed to send reminder to user ${enrollment.userId}:`, error);
        }
      }
    }

    console.log(`[ID Verification Scheduler] Sent ${remindersSent} deadline reminder emails`);
  } catch (error) {
    console.error('Error sending deadline reminders:', error);
  }
}

/**
 * Suspend access for students who have passed the 7-day deadline without verification
 * Called daily at 9 AM
 */
export async function enforceDeadlines() {
  try {
    const database = await getDb();
    if (!database) {
      console.error('Database not available for deadline enforcement');
      return;
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get enrollments that are past the 7-day deadline
    const enrollments = await database
      .select()
      .from(courseEnrollments)
      .where(
        and(
          isNull(courseEnrollments.idVerificationCompletedAt),
          isNull(courseEnrollments.accessSuspendedAt),
          lte(courseEnrollments.enrolledAt, sevenDaysAgo)
        )
      );

    let suspendedCount = 0;

    for (const enrollment of enrollments) {
      try {
        // Suspend access
        await database
          .update(courseEnrollments)
          .set({
            accessSuspendedAt: now,
          })
          .where(eq(courseEnrollments.id, enrollment.id));

        // Send suspension email
        try {
          await emailNotifications.sendAccessSuspensionEmail(enrollment.userId);
        } catch (error) {
          console.error(`Failed to send suspension email to user ${enrollment.userId}:`, error);
        }

        suspendedCount++;
      } catch (error) {
        console.error(`Failed to suspend access for enrollment ${enrollment.id}:`, error);
      }
    }

    console.log(`[ID Verification Scheduler] Suspended access for ${suspendedCount} overdue enrollments`);
  } catch (error) {
    console.error('Error enforcing deadlines:', error);
  }
}
