import * as db from "./db";
import * as email from "./email";

interface InactiveStudent {
  userId: number;
  userEmail: string;
  userName: string;
  courses: Array<{
    courseId: number;
    courseTitle: string;
    courseCode: string;
    completionPercentage: number;
    lessonsCompleted: number;
    totalLessons: number;
    lastActivityAt: Date | null;
    averageScore: number;
  }>;
  daysSinceLastActivity: number;
}

/**
 * Find students who haven't accessed courses in 7+ days
 */
export async function findInactiveStudents(daysSinceLastActivity: number = 7): Promise<InactiveStudent[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastActivity);

  try {
    // Note: In production, replace with actual database queries using drizzle-orm
    // This is a placeholder that returns empty array
    const users: any[] = [];

    const inactiveStudents: InactiveStudent[] = [];

    for (const user of users) {
      // Get user's courses and progress
      // Note: In production, replace with actual database queries using drizzle-orm
      const enrollments: any[] = [];

      // Placeholder - in production, implement actual inactivity check
      // For now, return empty array
      // lastActivityDate would be checked here
    }

    return inactiveStudents;
  } catch (error) {
    console.error("[Progress Notifications] Error finding inactive students:", error);
    return [];
  }
}

/**
 * Note: The findInactiveStudents function above is a placeholder.
 * In production, implement using drizzle-orm queries to:
 * 1. Get all enrolled users
 * 2. Calculate their course progress
 * 3. Find last activity date
 * 4. Filter for 7+ days of inactivity
 */

/**
 * Generate personalized recommendations based on student progress
 */
function generateRecommendations(student: InactiveStudent): string[] {
  const recommendations: string[] = [];

  // Find the course with lowest progress
  const lowestProgressCourse = student.courses.reduce((prev, current) =>
    prev.completionPercentage < current.completionPercentage ? prev : current
  );

  // Find the course with highest average score
  const bestPerformingCourse = student.courses.reduce((prev, current) =>
    prev.averageScore > current.averageScore ? prev : current
  );

  // Generate recommendations
  if (lowestProgressCourse.completionPercentage === 0) {
    recommendations.push(
      `Get started with ${lowestProgressCourse.courseTitle} - you haven't begun yet but it's a great course!`
    );
  } else if (lowestProgressCourse.completionPercentage < 50) {
    recommendations.push(
      `You're ${lowestProgressCourse.completionPercentage}% through ${lowestProgressCourse.courseTitle}. Just ${100 - lowestProgressCourse.completionPercentage}% more to go!`
    );
  }

  if (bestPerformingCourse.averageScore >= 85) {
    recommendations.push(
      `You're excelling in ${bestPerformingCourse.courseTitle} with an average score of ${bestPerformingCourse.averageScore}%!`
    );
  }

  // Overall progress recommendation
  const totalCompletion = Math.round(
    student.courses.reduce((sum, c) => sum + c.completionPercentage, 0) / student.courses.length
  );

  if (totalCompletion < 25) {
    recommendations.push("You're just getting started! Keep building momentum with consistent study sessions.");
  } else if (totalCompletion < 50) {
    recommendations.push("You're making good progress! Continue with your current pace to reach the halfway point.");
  } else if (totalCompletion < 75) {
    recommendations.push("You're over halfway there! Push through to complete your courses and earn your certificates.");
  } else {
    recommendations.push("You're almost done! Finish strong and complete your remaining courses.");
  }

  return recommendations;
}

/**
 * Send progress notification email to inactive student
 */
export async function sendProgressNotificationEmail(student: InactiveStudent): Promise<boolean> {
  try {
    const recommendations = generateRecommendations(student);
    const coursesList = student.courses
      .map(
        (c) =>
          `<tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${c.courseTitle}</strong> (${c.courseCode})
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${c.completionPercentage}%
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${c.lessonsCompleted}/${c.totalLessons}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${c.averageScore}%
        </td>
      </tr>`
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #7c2d12 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section h2 { color: #1e3a8a; font-size: 18px; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; }
            th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #d1d5db; }
            .recommendation { background: #dbeafe; border-left: 4px solid #0284c7; padding: 12px; margin: 10px 0; border-radius: 4px; }
            .cta-button { display: inline-block; background: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>We Miss You, ${student.userName}!</h1>
              <p>It's been ${student.daysSinceLastActivity} days since your last visit</p>
            </div>

            <div class="content">
              <div class="section">
                <h2>Your Current Progress</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Completion</th>
                      <th>Lessons</th>
                      <th>Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${coursesList}
                  </tbody>
                </table>
              </div>

              <div class="section">
                <h2>📚 Personalized Recommendations</h2>
                ${recommendations.map((rec) => `<div class="recommendation">${rec}</div>`).join("")}
              </div>

              <div class="section">
                <h2>Keep Your Momentum Going!</h2>
                <p>
                  Your learning journey is important to us. By dedicating just 30 minutes a day to your courses,
                  you can make significant progress and earn your certificates.
                </p>
                <a href="https://cross-life-divinity.com/dashboard" class="cta-button">
                  Continue Learning →
                </a>
              </div>

              <div class="section">
                <h2>Need Help?</h2>
                <p>
                  If you have any questions or need support, don't hesitate to reach out to our student services team.
                  We're here to help you succeed!
                </p>
              </div>
            </div>

            <div class="footer">
              <p>Cross Life School of Divinity | Helping You Grow in Faith and Knowledge</p>
              <p>
                <a href="https://cross-life-divinity.com/unsubscribe" style="color: #6b7280; text-decoration: none;">
                  Unsubscribe from notifications
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await email.sendEmail({
      to: student.userEmail,
      subject: `${student.userName}, We Miss You! Continue Your Learning Journey`,
      html: htmlContent,
    });

    console.log(`[Progress Notifications] Email sent to ${student.userEmail}`);
    return true;
  } catch (error) {
    console.error(`[Progress Notifications] Failed to send email to ${student.userEmail}:`, error);
    return false;
  }
}

/**
 * Send progress notifications to all inactive students
 */
export async function sendProgressNotifications(daysSinceLastActivity: number = 7): Promise<{
  total: number;
  sent: number;
  failed: number;
}> {
  console.log(`[Progress Notifications] Starting notification job (${daysSinceLastActivity} days inactivity)`);

  const inactiveStudents = await findInactiveStudents(daysSinceLastActivity);
  let sent = 0;
  let failed = 0;

  for (const student of inactiveStudents) {
    const success = await sendProgressNotificationEmail(student);
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  console.log(
    `[Progress Notifications] Job complete: ${sent} sent, ${failed} failed out of ${inactiveStudents.length} students`
  );

  return {
    total: inactiveStudents.length,
    sent,
    failed,
  };
}
