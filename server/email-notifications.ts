import * as db from "./db";
import nodemailer from 'nodemailer';
import { getEmailConfig } from "./email";
import { sql } from "drizzle-orm";

export type EmailNotificationType =
  | "enrollment"
  | "lesson_completion"
  | "certificate"
  | "assignment_deadline"
  | "progress_summary"
  | "forum_reply";

interface EmailNotification {
  userId: number;
  type: EmailNotificationType;
  subject: string;
  content: string;
  metadata?: any;
}

/**
 * Queue an email notification to be sent
 */
export async function queueEmailNotification(notification: EmailNotification): Promise<void> {
  const dbConn = await db.getDb();
  if (!dbConn) throw new Error("Database not available");

  // Check user preferences
  const prefs: any = await dbConn.execute(
    sql`SELECT * FROM email_preferences WHERE userId = ${notification.userId}`
  );
  const preferences = Array.isArray(prefs) ? prefs[0] : prefs.rows?.[0];

  // Check if user has this type of email enabled
  const prefKey = `${notification.type}Emails`.replace(/_/g, "");
  if (preferences && preferences[prefKey] === false) {
    console.log(`Email notification skipped for user ${notification.userId} - preference disabled`);
    return;
  }

  // Queue the notification
  await dbConn.execute(
    sql`INSERT INTO email_notifications (userId, type, subject, content, metadata, status)
        VALUES (${notification.userId}, ${notification.type}, ${notification.subject}, 
                ${notification.content}, ${JSON.stringify(notification.metadata || {})}, 'pending')`
  );
}

/**
 * Send enrollment confirmation email
 */
export async function sendEnrollmentEmail(
  userId: number,
  courseTitle: string,
  courseId: number
): Promise<void> {
  const user = await db.getUserById(userId);
  if (!user || !user.email) return;

  const subject = `Welcome to ${courseTitle}!`;
  const content = `
    <h2>Enrollment Confirmed</h2>
    <p>Dear ${user.name || "Student"},</p>
    <p>You have successfully enrolled in <strong>${courseTitle}</strong>.</p>
    <p>You can start your learning journey by accessing the course materials in your dashboard.</p>
    <p><a href="${process.env.VITE_APP_URL || "https://crosslife.manus.space"}/course/${courseId}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Learning</a></p>
    <p>Best regards,<br>Cross Life School of Divinity</p>
  `;

  await queueEmailNotification({
    userId,
    type: "enrollment",
    subject,
    content,
    metadata: { courseId, courseTitle },
  });

  // Send immediately
  try {
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      console.warn("Email not configured, skipping send");
      return;
    }
    
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
    
    await transporter.sendMail({
      from: emailConfig.user,
      to: user.email,
      subject,
      html: content,
    });
    
    // Mark as sent
    const dbConn = await db.getDb();
    if (dbConn) {
      await dbConn.execute(
        sql`UPDATE email_notifications 
            SET status = 'sent', sentAt = NOW() 
            WHERE userId = ${userId} AND type = 'enrollment' 
            AND status = 'pending'
            ORDER BY createdAt DESC LIMIT 1`
      );
    }
  } catch (error) {
    console.error("Failed to send enrollment email:", error);
  }
}

/**
 * Send lesson completion milestone email
 */
export async function sendLessonCompletionEmail(
  userId: number,
  courseTitle: string,
  lessonTitle: string,
  completedCount: number,
  totalCount: number
): Promise<void> {
  const user = await db.getUserById(userId);
  if (!user || !user.email) return;

  const percentage = Math.round((completedCount / totalCount) * 100);
  const subject = `Lesson Completed: ${lessonTitle}`;
  const content = `
    <h2>Great Progress!</h2>
    <p>Dear ${user.name || "Student"},</p>
    <p>Congratulations on completing <strong>${lessonTitle}</strong> in ${courseTitle}!</p>
    <p>You've now completed ${completedCount} out of ${totalCount} lessons (${percentage}%).</p>
    ${percentage === 100 ? `<p><strong>🎉 You've completed the entire course! Generate your certificate now.</strong></p>` : `<p>Keep up the great work!</p>`}
    <p>Best regards,<br>Cross Life School of Divinity</p>
  `;

  await queueEmailNotification({
    userId,
    type: "lesson_completion",
    subject,
    content,
    metadata: { courseTitle, lessonTitle, completedCount, totalCount },
  });

  // Send immediately
  try {
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      console.warn("Email not configured, skipping send");
      return;
    }
    
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
    
    await transporter.sendMail({
      from: emailConfig.user,
      to: user.email,
      subject,
      html: content,
    });
  } catch (error) {
    console.error("Failed to send lesson completion email:", error);
  }
}

/**
 * Send certificate generation email
 */
export async function sendCertificateEmail(
  userId: number,
  courseTitle: string,
  certificateNumber: string,
  certificateUrl: string
): Promise<void> {
  const user = await db.getUserById(userId);
  if (!user || !user.email) return;

  const subject = `Your Certificate is Ready: ${courseTitle}`;
  const content = `
    <h2>🎓 Certificate Issued!</h2>
    <p>Dear ${user.name || "Student"},</p>
    <p>Congratulations! Your certificate for <strong>${courseTitle}</strong> has been generated.</p>
    <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
    <p><a href="${certificateUrl}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Certificate</a></p>
    <p>You can download and share your certificate from your dashboard.</p>
    <p>Best regards,<br>Cross Life School of Divinity</p>
  `;

  await queueEmailNotification({
    userId,
    type: "certificate",
    subject,
    content,
    metadata: { courseTitle, certificateNumber },
  });

  // Send immediately
  try {
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      console.warn("Email not configured, skipping send");
      return;
    }
    
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
    
    await transporter.sendMail({
      from: emailConfig.user,
      to: user.email,
      subject,
      html: content,
    });
  } catch (error) {
    console.error("Failed to send certificate email:", error);
  }
}

/**
 * Send assignment deadline reminder email
 */
export async function sendAssignmentDeadlineEmail(
  userId: number,
  courseTitle: string,
  lessonTitle: string,
  dueDate: Date,
  daysUntilDue: number
): Promise<void> {
  const user = await db.getUserById(userId);
  if (!user || !user.email) return;

  const subject = `Assignment Due ${daysUntilDue === 0 ? "Today" : `in ${daysUntilDue} Days`}: ${lessonTitle}`;
  const content = `
    <h2>Assignment Reminder</h2>
    <p>Dear ${user.name || "Student"},</p>
    <p>This is a reminder that your assignment for <strong>${lessonTitle}</strong> in ${courseTitle} is due ${daysUntilDue === 0 ? "today" : `in ${daysUntilDue} days`}.</p>
    <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
    <p>Make sure to submit your assignment before the deadline to receive full credit.</p>
    <p>Best regards,<br>Cross Life School of Divinity</p>
  `;

  await queueEmailNotification({
    userId,
    type: "assignment_deadline",
    subject,
    content,
    metadata: { courseTitle, lessonTitle, dueDate: dueDate.toISOString(), daysUntilDue },
  });

  // Send immediately
  try {
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      console.warn("Email not configured, skipping send");
      return;
    }
    
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
    
    await transporter.sendMail({
      from: emailConfig.user,
      to: user.email,
      subject,
      html: content,
    });
  } catch (error) {
    console.error("Failed to send assignment deadline email:", error);
  }
}

/**
 * Send weekly progress summary email
 */
export async function sendWeeklyProgressEmail(
  userId: number,
  lessonsCompleted: number,
  quizzesTaken: number,
  avgQuizScore: number,
  coursesInProgress: string[]
): Promise<void> {
  const user = await db.getUserById(userId);
  if (!user || !user.email) return;

  const subject = "Your Weekly Progress Summary";
  const content = `
    <h2>Weekly Progress Report</h2>
    <p>Dear ${user.name || "Student"},</p>
    <p>Here's a summary of your learning activity this week:</p>
    <ul>
      <li><strong>Lessons Completed:</strong> ${lessonsCompleted}</li>
      <li><strong>Quizzes Taken:</strong> ${quizzesTaken}</li>
      <li><strong>Average Quiz Score:</strong> ${avgQuizScore}%</li>
    </ul>
    ${coursesInProgress.length > 0 ? `
      <p><strong>Courses in Progress:</strong></p>
      <ul>
        ${coursesInProgress.map(course => `<li>${course}</li>`).join("")}
      </ul>
    ` : ""}
    <p>Keep up the great work! Consistent learning leads to lasting results.</p>
    <p>Best regards,<br>Cross Life School of Divinity</p>
  `;

  await queueEmailNotification({
    userId,
    type: "progress_summary",
    subject,
    content,
    metadata: { lessonsCompleted, quizzesTaken, avgQuizScore, coursesInProgress },
  });

  // Send immediately
  try {
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      console.warn("Email not configured, skipping send");
      return;
    }
    
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
    
    await transporter.sendMail({
      from: emailConfig.user,
      to: user.email,
      subject,
      html: content,
    });
  } catch (error) {
    console.error("Failed to send weekly progress email:", error);
  }
}

/**
 * Send forum reply notification email
 */
export async function sendForumReplyEmail(
  userId: number,
  topicTitle: string,
  replyAuthor: string,
  replyContent: string,
  topicId: number
): Promise<void> {
  const user = await db.getUserById(userId);
  if (!user || !user.email) return;

  const subject = `New Reply: ${topicTitle}`;
  const content = `
    <h2>New Forum Reply</h2>
    <p>Dear ${user.name || "Student"},</p>
    <p><strong>${replyAuthor}</strong> replied to your topic: <strong>${topicTitle}</strong></p>
    <blockquote style="border-left: 4px solid #4F46E5; padding-left: 16px; margin: 16px 0; color: #666;">
      ${replyContent.substring(0, 200)}${replyContent.length > 200 ? "..." : ""}
    </blockquote>
    <p><a href="${process.env.VITE_APP_URL || "https://crosslife.manus.space"}/forum/topic/${topicId}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Reply</a></p>
    <p>Best regards,<br>Cross Life School of Divinity</p>
  `;

  await queueEmailNotification({
    userId,
    type: "forum_reply",
    subject,
    content,
    metadata: { topicTitle, replyAuthor, topicId },
  });

  // Send immediately
  try {
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      console.warn("Email not configured, skipping send");
      return;
    }
    
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
    
    await transporter.sendMail({
      from: emailConfig.user,
      to: user.email,
      subject,
      html: content,
    });
  } catch (error) {
    console.error("Failed to send forum reply email:", error);
  }
}

/**
 * Get user email preferences
 */
export async function getUserEmailPreferences(userId: number): Promise<any> {
  const dbConn = await db.getDb();
  if (!dbConn) throw new Error("Database not available");

  const result: any = await dbConn.execute(
    sql`SELECT * FROM email_preferences WHERE userId = ${userId}`
  );
  const prefs = Array.isArray(result) ? result[0] : result.rows?.[0];

  // Return default preferences if none exist
  if (!prefs) {
    return {
      enrollmentEmails: true,
      lessonCompletionEmails: true,
      certificateEmails: true,
      assignmentDeadlineEmails: true,
      progressSummaryEmails: true,
      forumReplyEmails: true,
    };
  }

  return prefs;
}

/**
 * Update user email preferences
 */
export async function updateEmailPreferences(
  userId: number,
  preferences: Partial<{
    enrollmentEmails: boolean;
    lessonCompletionEmails: boolean;
    certificateEmails: boolean;
    assignmentDeadlineEmails: boolean;
    progressSummaryEmails: boolean;
    forumReplyEmails: boolean;
  }>
): Promise<void> {
  const dbConn = await db.getDb();
  if (!dbConn) throw new Error("Database not available");

  // Check if preferences exist
  const existing: any = await dbConn.execute(
    sql`SELECT * FROM email_preferences WHERE userId = ${userId}`
  );
  const hasPrefs = (Array.isArray(existing) ? existing : existing.rows || []).length > 0;

  if (hasPrefs) {
    // Update existing preferences
    const updates = Object.entries(preferences)
      .map(([key, value]) => `${key} = ${value ? 1 : 0}`)
      .join(", ");
    
    await dbConn.execute(
      sql.raw(`UPDATE email_preferences SET ${updates} WHERE userId = ${userId}`)
    );
  } else {
    // Insert new preferences
    await dbConn.execute(
      sql`INSERT INTO email_preferences (userId, enrollmentEmails, lessonCompletionEmails, 
          certificateEmails, assignmentDeadlineEmails, progressSummaryEmails, forumReplyEmails)
          VALUES (${userId}, ${preferences.enrollmentEmails ?? true}, 
                  ${preferences.lessonCompletionEmails ?? true}, ${preferences.certificateEmails ?? true},
                  ${preferences.assignmentDeadlineEmails ?? true}, ${preferences.progressSummaryEmails ?? true},
                  ${preferences.forumReplyEmails ?? true})`
    );
  }
}

/**
 * Send ID approval email to student
 */
export async function sendIdApprovalEmail(userId: number): Promise<void> {
  try {
    const user = await db.getUserById(userId);
    if (!user || !user.email) {
      console.warn(`Cannot send ID approval email: user ${userId} not found or has no email`);
      return;
    }

    const config = getEmailConfig();
    if (!config) {
      console.warn("Email configuration not available");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const subject = "ID Verification Approved - Welcome to Cross Life School of Divinity";
    const html = `
      <h2>ID Verification Approved</h2>
      <p>Dear ${user.name || 'Student'},</p>
      <p>Great news! Your ID has been successfully verified and approved. Your enrollment is now complete.</p>
      <p>You can now:</p>
      <ul>
        <li>Access all your enrolled courses</li>
        <li>Download course materials</li>
        <li>Submit assignments and take quizzes</li>
        <li>Earn your CLAC certificate upon completion</li>
      </ul>
      <p>Welcome to the Cross Life School of Divinity community!</p>
      <p>Best regards,<br/>The Cross Life School of Divinity Team</p>
    `;

    await transporter.sendMail({
      from: config.user,
      to: user.email,
      subject,
      html,
    });

    console.log(`ID approval email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send ID approval email:", error);
  }
}

/**
 * Send ID rejection email to student
 */
export async function sendIdRejectionEmail(
  userId: number,
  rejectionReason: string
): Promise<void> {
  try {
    const user = await db.getUserById(userId);
    if (!user || !user.email) {
      console.warn(`Cannot send ID rejection email: user ${userId} not found or has no email`);
      return;
    }

    const config = getEmailConfig();
    if (!config) {
      console.warn("Email configuration not available");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const subject = "ID Verification - Resubmission Required";
    const html = `
      <h2>ID Verification - Resubmission Required</h2>
      <p>Dear ${user.name || 'Student'},</p>
      <p>We received your ID submission, but we were unable to verify it at this time.</p>
      <p><strong>Reason:</strong> ${rejectionReason}</p>
      <p>Please resubmit a clear, legible copy of your government-issued ID. Make sure:</p>
      <ul>
        <li>The entire ID is visible in the image</li>
        <li>All text is clear and readable</li>
        <li>The file format is JPG, PNG, or PDF</li>
        <li>The file size is under 10MB</li>
      </ul>
      <p>You can resubmit your ID anytime from your enrollment dashboard.</p>
      <p>If you have questions, please contact our support team.</p>
      <p>Best regards,<br/>The Cross Life School of Divinity Team</p>
    `;

    await transporter.sendMail({
      from: config.user,
      to: user.email,
      subject,
      html,
    });

    console.log(`ID rejection email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send ID rejection email:", error);
  }
}


/**
 * Send ID verification reminder email
 */
export async function sendIdVerificationReminderEmail(
  userId: number,
  daysRemaining: number
): Promise<void> {
  try {
    const user = await db.getUserById(userId);
    if (!user || !user.email) {
      console.warn(`Cannot send ID verification reminder: user ${userId} not found or has no email`);
      return;
    }

    const config = getEmailConfig();
    if (!config) {
      console.warn("Email configuration not available");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const subject = `Reminder: Complete Your ID Verification (${daysRemaining} days left)`;
    const html = `
      <h2>ID Verification Reminder</h2>
      <p>Dear ${user.name || 'Student'},</p>
      <p>This is a friendly reminder that you have <strong>${daysRemaining} days remaining</strong> to complete your ID verification.</p>
      <p>After 7 days from your enrollment, your course access will be suspended until you complete ID verification.</p>
      <p>To complete your ID verification:</p>
      <ol>
        <li>Log in to your student dashboard</li>
        <li>Click on "Complete ID Verification"</li>
        <li>Upload a clear photo of your government-issued ID</li>
        <li>Our team will review and approve your ID within 24-48 hours</li>
      </ol>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br/>The Cross Life School of Divinity Team</p>
    `;

    await transporter.sendMail({
      from: config.user,
      to: user.email,
      subject,
      html,
    });

    console.log(`ID verification reminder email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send ID verification reminder email:", error);
  }
}

/**
 * Send access suspension email
 */
export async function sendAccessSuspensionEmail(userId: number): Promise<void> {
  try {
    const user = await db.getUserById(userId);
    if (!user || !user.email) {
      console.warn(`Cannot send access suspension email: user ${userId} not found or has no email`);
      return;
    }

    const config = getEmailConfig();
    if (!config) {
      console.warn("Email configuration not available");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const subject = "Course Access Suspended - ID Verification Required";
    const html = `
      <h2>Course Access Suspended</h2>
      <p>Dear ${user.name || 'Student'},</p>
      <p>Your course access has been suspended because your 7-day grace period for ID verification has ended.</p>
      <p><strong>What happened:</strong> You enrolled in a course but did not complete ID verification within 7 days.</p>
      <p><strong>What you need to do:</strong> Complete your ID verification to regain access to your courses.</p>
      <p>To restore your access:</p>
      <ol>
        <li>Log in to your student dashboard</li>
        <li>Click on "Complete ID Verification"</li>
        <li>Upload a clear photo of your government-issued ID (driver's license, passport, or state ID)</li>
        <li>Our team will review and approve your ID within 24-48 hours</li>
        <li>Your course access will be restored immediately upon approval</li>
      </ol>
      <p>If you have any questions or need assistance, please contact our support team.</p>
      <p>Best regards,<br/>The Cross Life School of Divinity Team</p>
    `;

    await transporter.sendMail({
      from: config.user,
      to: user.email,
      subject,
      html,
    });

    console.log(`Access suspension email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send access suspension email:", error);
  }
}
