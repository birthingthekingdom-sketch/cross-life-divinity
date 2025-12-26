import * as db from "./db";
import * as email from "./email";

/**
 * Send notification to all admins when written answers are pending
 */
export async function notifyAdminsOfPendingAnswers(
  studentId: number,
  courseId: number,
  lessonId: number,
  pendingCount: number
) {
  try {
    const student = await db.getUserById(studentId);
    const course = await db.getCourseById(courseId);
    const lesson = await db.getLessonById(lessonId);
    
    if (!student || !course || !lesson) {
      console.warn("[PendingAnswersNotification] Missing student, course, or lesson data");
      return;
    }
    
    // Get all admin users
    const allUsers = await db.getAllUsers();
    const admins = allUsers.filter(u => u.role === 'admin' && u.email);
    
    // Send notification to each admin
    for (const admin of admins) {
      if (admin.email) {
        await email.sendPendingWrittenAnswersNotification(
          admin.email,
          student.name || 'Student',
          course.title,
          lesson.title,
          pendingCount
        );
      }
    }
    
    console.log(`[PendingAnswersNotification] Sent notifications to ${admins.length} admins`);
  } catch (error) {
    console.error("[PendingAnswersNotification] Failed to notify admins:", error);
  }
}
