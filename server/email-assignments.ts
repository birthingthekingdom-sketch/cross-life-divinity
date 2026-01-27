import nodemailer from 'nodemailer';
import { ENV } from './_core/env';
import { getEmailConfig } from './email';

async function getTransporter() {
  const emailConfig = getEmailConfig();
  if (!emailConfig) {
    console.warn('[Email] Email not configured');
    return null;
  }

  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });
}

// Assignment Graded Notification
export async function sendAssignmentGradedEmail(
  to: string,
  studentName: string,
  courseTitle: string,
  lessonTitle: string,
  grade: number,
  feedback: string
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const gradeColor = grade >= 90 ? '#16a34a' : grade >= 80 ? '#2563eb' : grade >= 70 ? '#eab308' : '#dc2626';
  const gradeLabel = grade >= 90 ? 'Excellent!' : grade >= 80 ? 'Great Work!' : grade >= 70 ? 'Good Job!' : 'Keep Improving';

  try {
    await transporter.sendMail({
      from: getEmailConfig()!.user,
      to,
      subject: `Assignment Graded: ${lessonTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">📝 Your Assignment Has Been Graded</h2>
          <p>Dear ${studentName},</p>
          <p>Your assignment for <strong>${lessonTitle}</strong> in <strong>${courseTitle}</strong> has been graded.</p>
          
          <div style="background-color: #eff6ff; padding: 24px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">Your Grade</p>
            <p style="margin: 8px 0 0 0; font-size: 48px; font-weight: bold; color: ${gradeColor};">${grade}</p>
            <p style="margin: 8px 0 0 0; font-size: 18px; color: ${gradeColor};">${gradeLabel}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #1e40af;">Instructor Feedback:</p>
            <p style="margin: 12px 0 0 0; line-height: 1.6; white-space: pre-wrap;">${feedback}</p>
          </div>
          
          <p>Review your grade and feedback in detail on your dashboard.</p>
          
          <p style="margin-top: 30px;">
            <a href="${ENV.baseUrl}/progress" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View My Progress
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Keep up the great work!<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send assignment graded email:', error);
    return false;
  }
}

// Peer Review Assigned Notification
export async function sendPeerReviewAssignedEmail(
  to: string,
  studentName: string,
  courseTitle: string,
  lessonTitle: string
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: getEmailConfig()!.user,
      to,
      subject: `Peer Review Assignment: ${lessonTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">👥 You've Been Assigned a Peer Review</h2>
          <p>Dear ${studentName},</p>
          <p>You have been assigned to review a classmate's assignment for:</p>
          
          <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Course:</strong> ${courseTitle}</p>
            <p style="margin: 8px 0 0 0;"><strong>Lesson:</strong> ${lessonTitle}</p>
          </div>
          
          <p>Peer review is an important part of collaborative learning. Please provide constructive feedback to help your classmate improve.</p>
          
          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #eab308;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">Review Guidelines:</p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #92400e;">
              <li>Be constructive and respectful</li>
              <li>Provide specific examples</li>
              <li>Highlight both strengths and areas for improvement</li>
              <li>Minimum 50 characters for each comment section</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">
            <a href="${ENV.baseUrl}/peer-reviews" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Complete Peer Review
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Thank you for contributing to our learning community!<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send peer review assigned email:', error);
    return false;
  }
}

// Peer Feedback Received Notification
export async function sendPeerFeedbackReceivedEmail(
  to: string,
  studentName: string,
  courseTitle: string,
  lessonTitle: string,
  averageRating: number
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const ratingStars = '⭐'.repeat(Math.round(averageRating));

  try {
    await transporter.sendMail({
      from: getEmailConfig()!.user,
      to,
      subject: `Peer Feedback Received: ${lessonTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">💬 You've Received Peer Feedback</h2>
          <p>Dear ${studentName},</p>
          <p>Your classmates have reviewed your assignment for <strong>${lessonTitle}</strong> in <strong>${courseTitle}</strong>.</p>
          
          <div style="background-color: #eff6ff; padding: 24px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">Average Peer Rating</p>
            <p style="margin: 12px 0; font-size: 36px;">${ratingStars}</p>
            <p style="margin: 0; font-size: 18px; color: #1e40af; font-weight: bold;">${averageRating.toFixed(1)} / 5.0</p>
          </div>
          
          <p>Your peers have provided valuable feedback to help you improve. Take time to review their comments and consider their suggestions for your future work.</p>
          
          <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 0; font-weight: bold; color: #166534;">💡 Tip:</p>
            <p style="margin: 8px 0 0 0; color: #166534;">Use this feedback to revise and resubmit your assignment for a better grade!</p>
          </div>
          
          <p style="margin-top: 30px;">
            <a href="${ENV.baseUrl}/progress" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Feedback
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Keep learning and growing!<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send peer feedback received email:', error);
    return false;
  }
}

// Assignment Resubmission Notification (for instructor)
export async function sendAssignmentResubmittedEmail(
  to: string,
  instructorName: string,
  studentName: string,
  courseTitle: string,
  lessonTitle: string,
  versionNumber: number
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: getEmailConfig()!.user,
      to,
      subject: `Assignment Resubmitted: ${studentName} - ${lessonTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">🔄 Assignment Resubmitted</h2>
          <p>Hello ${instructorName},</p>
          <p>A student has resubmitted their assignment for review:</p>
          
          <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Student:</strong> ${studentName}</p>
            <p style="margin: 8px 0 0 0;"><strong>Course:</strong> ${courseTitle}</p>
            <p style="margin: 8px 0 0 0;"><strong>Lesson:</strong> ${lessonTitle}</p>
            <p style="margin: 8px 0 0 0;"><strong>Version:</strong> ${versionNumber}</p>
          </div>
          
          <p>The student has revised their work based on feedback. Please review the new submission.</p>
          
          <p style="margin-top: 30px;">
            <a href="${ENV.baseUrl}/admin/grading" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Submission
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Cross Life School of Divinity<br>
            Admin Notification System
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send assignment resubmitted email:', error);
    return false;
  }
}
