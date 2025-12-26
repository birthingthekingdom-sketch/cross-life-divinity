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
