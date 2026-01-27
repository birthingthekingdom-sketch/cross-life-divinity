import cron from 'node-cron';
import * as db from './db';
import * as email from './email';
import * as idVerificationScheduler from './id-verification-scheduler';
import * as webinarScheduler from './webinar-email-scheduler';

/**
 * Scheduled task to send follow-up due date reminders
 * Runs every day at 9:00 AM
 */
export function startFollowUpReminderScheduler() {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[Scheduler] Running follow-up reminder check...');
    
    try {
      const dueFollowUps = await getDueFollowUps();
      
      if (dueFollowUps.length === 0) {
        console.log('[Scheduler] No follow-ups due within 24 hours');
        return;
      }
      
      console.log(`[Scheduler] Found ${dueFollowUps.length} follow-ups due within 24 hours`);
      
      for (const followUp of dueFollowUps) {
        try {
          await email.sendFollowUpDueReminderEmail(
            followUp.adminEmail || '',
            followUp.adminName || 'Admin',
            followUp.studentName || followUp.studentEmail || '',
            followUp.title,
            followUp.dueDate!
          );
          
          console.log(`[Scheduler] Sent reminder for follow-up #${followUp.id}`);
        } catch (error) {
          console.error(`[Scheduler] Failed to send reminder for follow-up #${followUp.id}:`, error);
        }
      }
      
      console.log('[Scheduler] Follow-up reminder check completed');
    } catch (error) {
      console.error('[Scheduler] Error in follow-up reminder scheduler:', error);
    }
  });
  
  console.log('[Scheduler] Follow-up reminder scheduler started (runs daily at 9:00 AM)');

  // Run ID verification pending reminders every day at 8:00 AM (optional courtesy reminder)
  cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Running ID verification pending reminders...');
    try {
      await idVerificationScheduler.sendPendingVerificationReminders();
    } catch (error) {
      console.error('[Scheduler] Error in ID verification pending reminder scheduler:', error);
    }
  });
  console.log('[Scheduler] ID verification pending reminder scheduler started (runs daily at 8:00 AM)');

  // Run webinar 24-hour reminders every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Running webinar 24-hour reminders...');
    try {
      await webinarScheduler.sendWebinarReminders();
    } catch (error) {
      console.error('[Scheduler] Error in webinar reminder scheduler:', error);
    }
  });
  console.log('[Scheduler] Webinar 24-hour reminder scheduler started (runs daily at 8:00 AM)');

  // Run recording notification job every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Running recording notification check...');
    try {
      await webinarScheduler.sendRecordingNotifications();
    } catch (error) {
      console.error('[Scheduler] Error in recording notification scheduler:', error);
    }
  });
  console.log('[Scheduler] Recording notification scheduler started (runs hourly)');

  // NOTE: No deadline enforcement - students have immediate access and are not penalized
  // Admin contacts students directly if there are verification issues
}

/**
 * Get follow-ups that are due within the next 24 hours
 */
async function getDueFollowUps() {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error("Database not available");
  
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const { followUps, users } = await import('../drizzle/schema');
  const { eq, and, gte, lte, sql } = await import('drizzle-orm');
  
  const { alias } = await import('drizzle-orm/mysql-core');
  const studentTable = alias(users, 'student');
  const adminTable = alias(users, 'admin');
  
  const results = await dbInstance
    .select({
      id: followUps.id,
      title: followUps.title,
      dueDate: followUps.dueDate,
      studentName: studentTable.name,
      studentEmail: studentTable.email,
      adminName: adminTable.name,
      adminEmail: adminTable.email,
    })
    .from(followUps)
    .innerJoin(studentTable, eq(followUps.studentId, studentTable.id))
    .innerJoin(adminTable, eq(followUps.adminId, adminTable.id))
    .where(
      and(
        eq(followUps.status, 'pending'),
        gte(followUps.dueDate, now),
        lte(followUps.dueDate, tomorrow)
      )
    );
  
  return results;
}

/**
 * Manual trigger for testing reminders (can be called via admin API)
 */
export async function triggerFollowUpReminders() {
  console.log('[Scheduler] Manual trigger: Running follow-up reminder check...');
  
  const dueFollowUps = await getDueFollowUps();
  
  if (dueFollowUps.length === 0) {
    return { success: true, message: 'No follow-ups due within 24 hours', count: 0 };
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const followUp of dueFollowUps) {
    try {
      await email.sendFollowUpDueReminderEmail(
        followUp.adminEmail || '',
        followUp.adminName || 'Admin',
        followUp.studentName || followUp.studentEmail || '',
        followUp.title,
        followUp.dueDate!
      );
      successCount++;
    } catch (error) {
      console.error(`[Scheduler] Failed to send reminder for follow-up #${followUp.id}:`, error);
      errorCount++;
    }
  }
  
  return {
    success: true,
    message: `Sent ${successCount} reminders, ${errorCount} failed`,
    count: successCount,
    errors: errorCount
  };
}
