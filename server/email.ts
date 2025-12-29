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

// Follow-Up Email Notifications
export async function sendFollowUpCreatedEmail(
  adminEmail: string,
  adminName: string,
  studentName: string,
  followUpTitle: string,
  dueDate?: Date
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const dueDateText = dueDate 
    ? `<p><strong>Due Date:</strong> ${dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>`
    : '';

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to: adminEmail,
      subject: `Follow-Up Created: ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">📋 New Follow-Up Created</h2>
          <p>Hello ${adminName},</p>
          <p>A new follow-up has been created for student engagement tracking:</p>
          
          <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Student:</strong> ${studentName}</p>
            <p style="margin: 8px 0 0 0;"><strong>Task:</strong> ${followUpTitle}</p>
            ${dueDateText}
          </div>
          
          <p>Please follow up with this student to ensure continued engagement.</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/admin/follow-ups" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Follow-Ups
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
    console.error('[Email] Failed to send follow-up created email:', error);
    return false;
  }
}

export async function sendFollowUpDueReminderEmail(
  adminEmail: string,
  adminName: string,
  studentName: string,
  followUpTitle: string,
  dueDate: Date
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to: adminEmail,
      subject: `⏰ Follow-Up Due: ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⏰ Follow-Up Due Reminder</h2>
          <p>Hello ${adminName},</p>
          <p>This is a reminder that a follow-up task is due soon:</p>
          
          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 0;"><strong>Student:</strong> ${studentName}</p>
            <p style="margin: 8px 0 0 0;"><strong>Task:</strong> ${followUpTitle}</p>
            <p style="margin: 8px 0 0 0;"><strong>Due Date:</strong> ${dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <p>Please complete this follow-up to maintain student engagement.</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/admin/follow-ups" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Follow-Ups
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
    console.error('[Email] Failed to send follow-up due reminder email:', error);
    return false;
  }
}

export async function sendFollowUpCompletedEmail(
  adminEmail: string,
  adminName: string,
  studentName: string,
  followUpTitle: string
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to: adminEmail,
      subject: `✅ Follow-Up Completed: ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">✅ Follow-Up Completed</h2>
          <p>Hello ${adminName},</p>
          <p>A follow-up task has been marked as completed:</p>
          
          <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 0;"><strong>Student:</strong> ${studentName}</p>
            <p style="margin: 8px 0 0 0;"><strong>Task:</strong> ${followUpTitle}</p>
            <p style="margin: 8px 0 0 0;"><strong>Status:</strong> Completed</p>
          </div>
          
          <p>Great work on maintaining student engagement!</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/admin/follow-ups" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View All Follow-Ups
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
    console.error('[Email] Failed to send follow-up completed email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const resetUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: 'Password Reset Request - Cross Life School of Divinity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Password Reset Request</h2>
          <p>You requested to reset your password for Cross Life School of Divinity.</p>
          <p>Click the button below to reset your password:</p>
          <p style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </p>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <br/>
          <p>Blessings,<br/>Cross Life School of Divinity Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send password reset email:', error);
    return false;
  }
}

export async function sendEmailVerification(email: string, name: string, verificationToken: string) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const verificationUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to: email,
      subject: 'Verify Your Email - Cross Life School of Divinity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Welcome, ${name}!</h2>
          <p>Thank you for registering with Cross Life School of Divinity.</p>
          <p>To complete your registration and access your courses, please verify your email address by clicking the button below:</p>
          <p style="margin: 30px 0; text-align: center;">
            <a href="${verificationUrl}" style="background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
          </p>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;"><strong>This link will expire in 24 hours.</strong></p>
          <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
          <br/>
          <p>Blessings,<br/>Cross Life School of Divinity Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send email verification:', error);
    return false;
  }
}



// Payment Plan Email Functions

export async function sendPaymentPlanEnrollmentEmail(
  to: string,
  studentName: string,
  planType: string,
  totalAmount: number,
  monthlyAmount: number,
  months: number,
  firstPaymentDate: Date
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const planName = planType.replace(/_/g, ' ');
  
  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: 'Payment Plan Enrollment Confirmation - Cross Life School of Divinity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Payment Plan Enrollment Confirmed!</h2>
          <p>Dear ${studentName},</p>
          <p>Thank you for enrolling in the <strong>${planName}</strong> through our Cross Life Tuition Assistance program.</p>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Payment Plan Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Program:</strong></td>
                <td style="padding: 8px 0;">${planName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px 0;">$${totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Monthly Payment:</strong></td>
                <td style="padding: 8px 0;">$${monthlyAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Number of Payments:</strong></td>
                <td style="padding: 8px 0;">${months} months</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>First Payment:</strong></td>
                <td style="padding: 8px 0;">${firstPaymentDate.toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Interest Rate:</strong></td>
                <td style="padding: 8px 0; color: #16a34a;"><strong>0% - Interest Free!</strong></td>
              </tr>
            </table>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul style="line-height: 1.8;">
            <li>Your first payment of $${monthlyAmount.toFixed(2)} has been processed</li>
            <li>You now have immediate access to all course materials</li>
            <li>Monthly payments will be automatically charged on the same day each month</li>
            <li>You can pay off early at any time without penalty</li>
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/my-payments" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Payment History
            </a>
          </p>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 14px;">
            <strong>Important Reminders:</strong><br>
            • No refunds after 7 days from enrollment<br>
            • Missed payments will pause course access until current<br>
            • Contact support for any payment questions
          </p>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Blessings on your learning journey,<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send payment plan enrollment email:', error);
    return false;
  }
}

export async function sendMonthlyPaymentReceiptEmail(
  to: string,
  studentName: string,
  planType: string,
  paymentAmount: number,
  paymentDate: Date,
  paymentsRemaining: number,
  nextPaymentDate: Date
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const planName = planType.replace(/_/g, ' ');
  
  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: 'Payment Receipt - Cross Life School of Divinity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Payment Received - Thank You!</h2>
          <p>Dear ${studentName},</p>
          <p>Your monthly payment has been successfully processed.</p>
          
          <div style="background-color: #eff6ff; border-left: 4px solid #1e40af; padding: 16px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Payment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Program:</strong></td>
                <td style="padding: 8px 0;">${planName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payment Amount:</strong></td>
                <td style="padding: 8px 0;">$${paymentAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payment Date:</strong></td>
                <td style="padding: 8px 0;">${paymentDate.toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payments Remaining:</strong></td>
                <td style="padding: 8px 0;">${paymentsRemaining} ${paymentsRemaining === 1 ? 'payment' : 'payments'}</td>
              </tr>
              ${paymentsRemaining > 0 ? `
              <tr>
                <td style="padding: 8px 0;"><strong>Next Payment Due:</strong></td>
                <td style="padding: 8px 0;">${nextPaymentDate.toLocaleDateString()}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          ${paymentsRemaining === 0 ? `
          <div style="background-color: #f0fdf4; border: 2px solid #16a34a; padding: 16px; margin: 20px 0; text-align: center;">
            <h3 style="color: #16a34a; margin-top: 0;">🎉 Congratulations!</h3>
            <p style="font-size: 16px; margin: 0;">You've completed your payment plan! Your course access remains active forever.</p>
          </div>
          ` : ''}
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/my-payments" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Payment History
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Questions about your payment? Contact our support team anytime.
          </p>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Blessings,<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send monthly payment receipt email:', error);
    return false;
  }
}

export async function sendFailedPaymentNotificationEmail(
  to: string,
  studentName: string,
  planType: string,
  paymentAmount: number,
  failureReason: string
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const planName = planType.replace(/_/g, ' ');
  
  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: 'Payment Failed - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Payment Failed - Action Required</h2>
          <p>Dear ${studentName},</p>
          <p>We were unable to process your monthly payment for the <strong>${planName}</strong>.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Payment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Program:</strong></td>
                <td style="padding: 8px 0;">${planName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payment Amount:</strong></td>
                <td style="padding: 8px 0;">$${paymentAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Reason:</strong></td>
                <td style="padding: 8px 0;">${failureReason}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fffbeb; border: 1px solid #fbbf24; padding: 16px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Important:</strong> Your course access has been paused until payment is current.</p>
          </div>
          
          <p><strong>What to do next:</strong></p>
          <ol style="line-height: 1.8;">
            <li>Check that your payment method is valid and has sufficient funds</li>
            <li>Update your payment method if needed</li>
            <li>Contact your bank if you believe this is an error</li>
            <li>Reach out to our support team for assistance</li>
          </ol>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/my-payments" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Update Payment Method
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Need help? Contact us at studio6817@yahoo.com or (312) 300-3295
          </p>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send failed payment notification email:', error);
    return false;
  }
}

export async function sendPaymentPlanCompletionEmail(
  to: string,
  studentName: string,
  planType: string,
  totalPaid: number
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const planName = planType.replace(/_/g, ' ');
  
  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: 'Payment Plan Complete - Congratulations!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 30px 0;">
            <h1 style="color: #16a34a; font-size: 32px; margin: 0;">🎉 Congratulations!</h1>
            <h2 style="color: #1e40af; margin-top: 10px;">Payment Plan Complete</h2>
          </div>
          
          <p>Dear ${studentName},</p>
          <p>We're thrilled to inform you that you've successfully completed your payment plan for the <strong>${planName}</strong>!</p>
          
          <div style="background-color: #f0fdf4; border: 2px solid #16a34a; padding: 20px; margin: 30px 0; text-align: center;">
            <p style="font-size: 18px; margin: 0;"><strong>Total Paid:</strong></p>
            <p style="font-size: 32px; color: #16a34a; font-weight: bold; margin: 10px 0;">$${totalPaid.toFixed(2)}</p>
            <p style="font-size: 14px; color: #16a34a; margin: 0;">✓ 0% Interest - You saved money!</p>
          </div>
          
          <p><strong>What this means for you:</strong></p>
          <ul style="line-height: 1.8;">
            <li>✓ Your course access remains active <strong>forever</strong></li>
            <li>✓ No more monthly payments</li>
            <li>✓ You've earned your CPD certificates</li>
            <li>✓ You can continue learning at your own pace</li>
          </ul>
          
          <div style="background-color: #eff6ff; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <h3 style="color: #1e40af; margin-top: 0;">Continue Your Journey</h3>
            <p>Interested in expanding your theological education? Check out our other programs:</p>
            <ul>
              <li>Additional Learning Paths</li>
              <li>Chaplaincy Training Certification</li>
              <li>Individual Course Purchases</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/pricing" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Explore More Courses
            </a>
          </p>
          
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Thank you for being part of the Cross Life School of Divinity community. Your dedication to theological education inspires us!
          </p>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Blessings,<br>
            Cross Life School of Divinity Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send payment plan completion email:', error);
    return false;
  }
}

// Full Payment Receipt Email (for one-time purchases)
export async function sendFullPaymentReceiptEmail(
  to: string,
  studentName: string,
  planType: string,
  amount: number,
  paymentDate: Date,
  transactionId: string
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const planName = planType.replace(/_/g, ' ');
  const formattedDate = paymentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: `Payment Receipt - ${planName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 30px 0; background-color: #1e40af; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✓ Payment Successful</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase!</p>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <p>Dear ${studentName},</p>
            <p>Your payment has been successfully processed. You now have <strong>lifetime access</strong> to your courses!</p>
            
            <div style="background-color: white; border: 2px solid #e5e7eb; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <h3 style="color: #1e40af; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Payment Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Program:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">${planName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Amount Paid:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #16a34a; font-size: 20px;">$${amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Payment Date:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Transaction ID:</td>
                  <td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Payment Method:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">One-Time Payment</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #eff6ff; padding: 20px; margin: 30px 0; border-radius: 8px; border-left: 4px solid #1e40af;">
              <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
              <ul style="line-height: 1.8; margin: 10px 0;">
                <li>✓ <strong>Immediate Access:</strong> Your courses are ready to start</li>
                <li>✓ <strong>Lifetime Access:</strong> No expiration, learn at your pace</li>
                <li>✓ <strong>CPD Certificates:</strong> Earn certificates upon completion</li>
                <li>✓ <strong>Full Support:</strong> Access to discussion forums and support</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://cross-life-divinity.manus.space/dashboard" 
                 style="background-color: #1e40af; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                Start Learning Now →
              </a>
            </div>
            
            <div style="background-color: white; padding: 20px; margin: 30px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Need Help?</strong><br>
                If you have any questions about your purchase or courses, contact us at 
                <a href="mailto:studio6817@yahoo.com" style="color: #1e40af;">studio6817@yahoo.com</a> 
                or call <a href="tel:+13123003295" style="color: #1e40af;">(312) 300-3295</a>
              </p>
            </div>
            
            <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              This is an automated receipt for your records. Please save this email for your records.
            </p>
            
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Blessings on your theological journey,<br>
              <strong>Cross Life School of Divinity Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f3f4f6; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Cross Life School of Divinity</p>
            <p style="margin: 5px 0 0 0;">Seminary-Level Theological Education</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send full payment receipt email:', error);
    return false;
  }
}
