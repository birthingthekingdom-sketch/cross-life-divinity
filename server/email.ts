import nodemailer from 'nodemailer';
import { ENV } from './_core/env';

interface EmailConfig {
  host: string; // smtp.gmail.com for Gmail
  port: number; // 587 for Gmail
  secure: boolean; // false for port 587
  user: string; // Your Gmail address
  pass: string; // Gmail App Password (not regular password)
}

let emailConfig: EmailConfig | null = null;

export function setEmailConfig(config: EmailConfig) {
  emailConfig = config;
}

export function getEmailConfig(): EmailConfig | null {
  return emailConfig;
}

async function getTransporter() {
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

export async function sendWelcomeEmail(to: string, studentName: string, courseTitles: string[]) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const courseList = courseTitles.map(title => `• ${title}`).join('\n');

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: 'Welcome to Cross Life School of Divinity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Welcome to Cross Life School of Divinity!</h2>
          <p>Dear ${studentName},</p>
          <p>Thank you for enrolling in our courses. We're excited to have you on this spiritual journey!</p>
          
          <h3 style="color: #1e40af;">Your Enrolled Courses:</h3>
          <p style="white-space: pre-line; line-height: 1.8;">${courseList}</p>
          
          <p>You can access your courses anytime by logging into your student dashboard.</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Blessings,<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send welcome email:', error);
    return false;
  }
}

export async function sendCertificateEmail(to: string, studentName: string, courseTitle: string, certificateNumber: string) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: `Congratulations! You've completed ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">🎓 Congratulations, ${studentName}!</h2>
          <p>We're thrilled to inform you that you have successfully completed:</p>
          
          <h3 style="color: #1e40af; background-color: #eff6ff; padding: 16px; border-radius: 8px; text-align: center;">
            ${courseTitle}
          </h3>
          
          <p>Your certificate is ready! You can download it from your dashboard.</p>
          
          <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Download Certificate
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            May God continue to bless your ministry,<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send certificate email:', error);
    return false;
  }
}

export async function sendCourseReminderEmail(to: string, studentName: string, courseTitle: string, lessonsRemaining: number) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: `Continue your journey in ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Keep Going, ${studentName}!</h2>
          <p>We noticed you haven't completed your course yet:</p>
          
          <h3 style="color: #1e40af;">${courseTitle}</h3>
          
          <p>You have <strong>${lessonsRemaining} lesson${lessonsRemaining > 1 ? 's' : ''}</strong> remaining.</p>
          
          <p>Don't let your progress go to waste! Continue your spiritual growth today.</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Continue Learning
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Blessings,<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send reminder email:', error);
    return false;
  }
}
