import * as db from './db';
import { sql } from 'drizzle-orm';
import { sendWeeklyProgressEmail, sendAssignmentDeadlineEmail } from './email-notifications';
import cron from 'node-cron';

/**
 * Send weekly progress summaries to all active students
 * Should be scheduled to run every Sunday at 9 AM
 */
export async function sendWeeklyProgressSummaries() {
  console.log('[Scheduled Job] Starting weekly progress summary emails...');
  
  try {
    const dbConn = await db.getDb();
    if (!dbConn) {
      console.error('[Scheduled Job] Database not available');
      return;
    }

    // Get all users with email preferences enabled for progress summaries
    const result: any = await dbConn.execute(
      sql`SELECT u.id, u.email, u.name
          FROM users u
          LEFT JOIN email_preferences ep ON u.id = ep.userId
          WHERE (ep.progressSummaries IS NULL OR ep.progressSummaries = true)
          AND u.email IS NOT NULL`
    );

    const users = Array.isArray(result) ? result : result.rows || [];
    console.log(`[Scheduled Job] Found ${users.length} users for progress summaries`);

    let successCount = 0;
    let failureCount = 0;

    for (const user of users) {
      try {
        // Get user's enrollments
        const enrollmentsResult: any = await dbConn.execute(
          sql`SELECT ce.courseId, c.title
              FROM course_enrollments ce
              JOIN courses c ON ce.courseId = c.id
              WHERE ce.userId = ${user.id}`
        );

        const enrollments = Array.isArray(enrollmentsResult) ? enrollmentsResult : enrollmentsResult.rows || [];

        if (enrollments.length > 0) {
          // Get progress for each course
          const courseProgress = [];
          for (const enrollment of enrollments) {
            const progressResult: any = await dbConn.execute(
              sql`SELECT 
                    COUNT(DISTINCT lp.lessonId) as completedLessons,
                    c.totalLessons
                  FROM courses c
                  LEFT JOIN lesson_progress lp ON lp.userId = ${user.id} 
                    AND lp.courseId = c.id AND lp.completed = true
                  WHERE c.id = ${enrollment.courseId}
                  GROUP BY c.id, c.totalLessons`
            );

            const progress = Array.isArray(progressResult) ? progressResult[0] : progressResult.rows?.[0];
            if (progress) {
              courseProgress.push({
                courseName: enrollment.title,
                completed: Number(progress.completedLessons || 0),
                total: Number(progress.totalLessons || 0),
              });
            }
          }

          // Calculate weekly stats
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const weeklyStatsResult: any = await dbConn.execute(
            sql`SELECT 
                  COUNT(DISTINCT lp.lessonId) as lessonsCompleted,
                  COUNT(DISTINCT qa.quizId) as quizzesTaken,
                  AVG(qa.score) as avgScore
                FROM lesson_progress lp
                LEFT JOIN quiz_attempts qa ON qa.userId = lp.userId AND qa.attemptedAt >= ${weekAgo.toISOString()}
                WHERE lp.userId = ${user.id} AND lp.completedAt >= ${weekAgo.toISOString()}`
          );
          
          const weeklyStats = Array.isArray(weeklyStatsResult) ? weeklyStatsResult[0] : weeklyStatsResult.rows?.[0];
          
          // Send email
          await sendWeeklyProgressEmail(
            user.id,
            Number(weeklyStats?.lessonsCompleted || 0),
            Number(weeklyStats?.quizzesTaken || 0),
            Math.round(Number(weeklyStats?.avgScore || 0)),
            courseProgress.map(cp => cp.courseName)
          );
          successCount++;
        }
      } catch (error) {
        console.error(`[Scheduled Job] Failed to send progress summary to user ${user.id}:`, error);
        failureCount++;
      }
    }

    console.log(`[Scheduled Job] Weekly progress summaries complete: ${successCount} sent, ${failureCount} failed`);
  } catch (error) {
    console.error('[Scheduled Job] Error in sendWeeklyProgressSummaries:', error);
  }
}

/**
 * Send assignment deadline reminders for assignments due in 3 days
 * Should be scheduled to run daily at 8 AM
 */
export async function sendAssignmentDeadlineReminders() {
  console.log('[Scheduled Job] Starting assignment deadline reminder emails...');
  
  try {
    const dbConn = await db.getDb();
    if (!dbConn) {
      console.error('[Scheduled Job] Database not available');
      return;
    }

    // Get assignments due in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(23, 59, 59, 999);

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    const result: any = await dbConn.execute(
      sql`SELECT 
            a.id as assignmentId,
            a.title as assignmentTitle,
            a.dueDate,
            l.title as lessonTitle,
            c.id as courseId,
            c.title as courseTitle,
            ce.userId
          FROM assignments a
          JOIN lessons l ON a.lessonId = l.id
          JOIN courses c ON l.courseId = c.id
          JOIN course_enrollments ce ON c.id = ce.courseId
          LEFT JOIN assignment_submissions asub ON a.id = asub.assignmentId AND asub.userId = ce.userId
          LEFT JOIN email_preferences ep ON ce.userId = ep.userId
          WHERE a.dueDate >= ${twoDaysFromNow.toISOString()}
            AND a.dueDate <= ${threeDaysFromNow.toISOString()}
            AND asub.id IS NULL
            AND (ep.assignmentDeadlines IS NULL OR ep.assignmentDeadlines = true)`
    );

    const assignments = Array.isArray(result) ? result : result.rows || [];
    console.log(`[Scheduled Job] Found ${assignments.length} assignment deadline reminders to send`);

    let successCount = 0;
    let failureCount = 0;

    for (const assignment of assignments) {
      try {
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        await sendAssignmentDeadlineEmail(
          assignment.userId,
          assignment.courseTitle,
          assignment.lessonTitle,
          dueDate,
          daysUntilDue
        );
        successCount++;
      } catch (error) {
        console.error(`[Scheduled Job] Failed to send deadline reminder for assignment ${assignment.assignmentId}:`, error);
        failureCount++;
      }
    }

    console.log(`[Scheduled Job] Assignment deadline reminders complete: ${successCount} sent, ${failureCount} failed`);
  } catch (error) {
    console.error('[Scheduled Job] Error in sendAssignmentDeadlineReminders:', error);
  }
}

// Register scheduled jobs
export function registerScheduledEmailJobs() {
  // Weekly progress summaries - Every Sunday at 9 AM
  cron.schedule('0 9 * * 0', async () => {
    console.log('[Scheduler] Running weekly progress summaries...');
    await sendWeeklyProgressSummaries();
  });
  
  // Assignment deadline reminders - Every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Running assignment deadline reminders...');
    await sendAssignmentDeadlineReminders();
  });
  
  console.log('[Scheduler] Registered scheduled email jobs (weekly summaries: Sun 9AM, deadline reminders: daily 8AM)');
}


/**
 * Send study schedule reminders to Bridge Academy students
 * Runs daily at configured reminder times
 */
export async function sendStudyScheduleReminders() {
  console.log('[Scheduled Job] Starting study schedule reminders...');
  
  try {
    const dbConn = await db.getDb();
    if (!dbConn) {
      console.error('[Scheduled Job] Database not available');
      return;
    }
    
    const { sql: sqlQuery } = await import('drizzle-orm');

    // Get all active study schedule reminders
    const remindersResult: any = await dbConn.execute(
      sqlQuery`SELECT 
            ssr.id,
            ssr.userId,
            ssr.scheduleId,
            ssr.reminderType,
            ssr.reminderTime,
            u.email,
            u.name,
            ss.courseId,
            c.title as courseName,
            ss.planDuration
          FROM bridge_academy_study_schedule_reminders ssr
          JOIN bridge_academy_study_schedules ss ON ssr.scheduleId = ss.id
          JOIN users u ON ssr.userId = u.id
          JOIN courses c ON ss.courseId = c.id
          WHERE ssr.isActive = true`
    );

    const reminders = Array.isArray(remindersResult) ? remindersResult : remindersResult.rows || [];
    console.log(`[Scheduled Job] Found ${reminders.length} active study reminders`);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    let sentCount = 0;

    for (const reminder of reminders) {
      try {
        // Check if it's time to send this reminder
        const shouldSend = checkReminderTime(reminder.reminderType, reminder.reminderTime, currentTime);
        
        if (!shouldSend) {
          continue;
        }

        // Check if reminder was already sent today
        const lastSentDate = reminder.lastSentAt ? new Date(reminder.lastSentAt).toDateString() : null;
        const todayDate = new Date().toDateString();
        
        if (lastSentDate === todayDate) {
          console.log(`[Scheduled Job] Reminder #${reminder.id} already sent today, skipping`);
          continue;
        }

        // Send reminder email
        await sendStudyReminderEmail(
          reminder.email,
          reminder.name,
          reminder.courseName,
          reminder.planDuration,
          reminder.reminderType
        );

        // Update lastSentAt timestamp
        await dbConn.execute(
          sql`UPDATE bridge_academy_study_schedule_reminders 
              SET lastSentAt = NOW() 
              WHERE id = ${reminder.id}`
        );

        console.log(`[Scheduled Job] Sent study reminder #${reminder.id} to ${reminder.email}`);
        sentCount++;
      } catch (error) {
        console.error(`[Scheduled Job] Failed to send reminder #${reminder.id}:`, error);
      }
    }

    console.log(`[Scheduled Job] Study schedule reminders completed (sent ${sentCount}/${reminders.length})`);
  } catch (error) {
    console.error('[Scheduled Job] Error in study schedule reminder job:', error);
  }
}

/**
 * Check if it's time to send a reminder based on type and configured time
 */
function checkReminderTime(reminderType: string, reminderTime: string, currentTime: string): boolean {
  // For daily reminders, check if current time matches reminder time (within 1 minute window)
  if (reminderType === 'daily') {
    const [remindHour, remindMinute] = reminderTime.split(':').map(Number);
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    
    // Send if within 1 minute window
    return remindHour === currentHour && Math.abs(currentMinute - remindMinute) <= 1;
  }
  
  // For weekly reminders, check day of week and time
  if (reminderType === 'weekly') {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Send on Monday at configured time
    if (dayOfWeek === 1) {
      const [remindHour, remindMinute] = reminderTime.split(':').map(Number);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      return remindHour === currentHour && Math.abs(currentMinute - remindMinute) <= 1;
    }
  }
  
  return false;
}

/**
 * Send study reminder email to student
 */
async function sendStudyReminderEmail(
  email: string,
  name: string,
  courseName: string,
  planDuration: string,
  reminderType: string
): Promise<void> {
  const planLabel = planDuration === '4week' ? '4-week' : planDuration === '8week' ? '8-week' : '12-week';
  const frequencyLabel = reminderType === 'daily' ? 'daily' : 'weekly';
  
  const subject = `Time to Study: ${courseName} - Bridge Academy`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Time to Study!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your scheduled study session is coming up</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px 20px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${name},</p>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
          This is your ${frequencyLabel} reminder to continue your ${planLabel} study plan for <strong>${courseName}</strong>. 
          Consistent study sessions are key to your success on the GED exam!
        </p>
        
        <div style="background: white; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1e3a8a;">Study Tips:</h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
            <li style="margin: 5px 0;">Find a quiet, comfortable study space</li>
            <li style="margin: 5px 0;">Take breaks every 25-30 minutes</li>
            <li style="margin: 5px 0;">Review practice questions from previous sessions</li>
            <li style="margin: 5px 0;">Focus on your weak areas first</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.VITE_APP_URL || 'https://cross-life-divinity.manus.space'}/bridge-academy/student-dashboard" 
             style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
        
        <p style="margin: 20px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.6;">
          You're receiving this email because you have an active study schedule with Bridge Academy. 
          To manage your reminder preferences, visit your dashboard settings.
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8;">
        <p style="margin: 0;">Cross Life School of Divinity - Bridge Academy</p>
        <p style="margin: 5px 0 0 0;">Preparing you for GED success</p>
      </div>
    </div>
  `;
  
  // Queue email notification using existing email service
  const emailNotifications = await import('./email-notifications');
  await emailNotifications.queueEmailNotification({
    userId: 0, // System notification
    type: 'progress_summary', // Using existing type
    subject,
    content: htmlContent,
    metadata: {
      recipientEmail: email,
      reminderType: reminderType
    }
  });
}

/**
 * Register all Bridge Academy scheduled jobs
 */
export function registerBridgeAcademyScheduledJobs() {
  // Run study schedule reminders every minute (checks will determine if email should be sent)
  cron.schedule('* * * * *', async () => {
    try {
      await sendStudyScheduleReminders();
    } catch (error) {
      console.error('[Scheduler] Error in study schedule reminders:', error);
    }
  });
  
  console.log('[Scheduler] Bridge Academy study schedule reminders registered (checks every minute)');
}
