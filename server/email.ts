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
            <li>✓ You've earned your CLAC certificates</li>
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
                <li>✓ <strong>CLAC Certificates:</strong> Earn certificates upon completion</li>
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

/**
 * Enhanced Welcome Email for New Enrollments
 * Sent immediately after successful enrollment
 */
export async function sendEnhancedWelcomeEmail(
  to: string,
  studentName: string,
  enrolledCourses: string[]
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const coursesListHtml = enrolledCourses
    .map(course => `<li style="margin-bottom: 8px; color: #333;">${course}</li>`)
    .join('');

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: `Welcome to Cross Life School of Divinity, ${studentName}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
              .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
              .section { margin-bottom: 24px; }
              .section h2 { color: #1e3a8a; font-size: 20px; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
              .course-list { background-color: #f0f4ff; padding: 16px; border-left: 4px solid #3b82f6; border-radius: 4px; }
              .course-list ul { margin: 0; padding-left: 20px; }
              .cta-button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
              .cta-button:hover { background-color: #1e3a8a; }
              .footer { background-color: #f0f4ff; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 4px; margin-top: 20px; }
              .highlight { color: #3b82f6; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Cross Life School of Divinity</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Equipping Ministry Leaders for Excellence</p>
              </div>

              <div class="content">
                <p style="font-size: 16px;">Dear <span class="highlight">${studentName}</span>,</p>

                <p>We are thrilled to welcome you to the Cross Life School of Divinity community! Your commitment to deepening your theological knowledge and strengthening your ministry impact is an inspiration to us.</p>

                <div class="section">
                  <h2>Your Enrolled Courses</h2>
                  <div class="course-list">
                    <p style="margin-top: 0; color: #1e3a8a; font-weight: 600;">You now have access to:</p>
                    <ul style="margin-bottom: 0;">
                      ${coursesListHtml}
                    </ul>
                  </div>
                </div>

                <div class="section">
                  <h2>Getting Started</h2>
                  <p>Here's how to make the most of your learning experience:</p>
                  <ol style="color: #333;">
                    <li><strong>Log in to your dashboard</strong> - Access your courses anytime, anywhere at your own pace</li>
                    <li><strong>Review the course syllabus</strong> - Each course includes a detailed overview, learning objectives, and assessment requirements</li>
                    <li><strong>Start with Lesson 1</strong> - Begin your journey with our foundational content and video lectures</li>
                    <li><strong>Complete assignments</strong> - Engage with practical assignments designed to deepen your understanding</li>
                    <li><strong>Earn your certificate</strong> - Upon successful completion, you'll receive a CLAC-accredited certificate</li>
                  </ol>
                </div>

                <div class="section">
                  <h2>Key Features You Have Access To</h2>
                  <ul style="color: #333;">
                    <li><strong>Lifetime Access</strong> - Study at your own pace with no time limits</li>
                    <li><strong>Comprehensive Content</strong> - Nearly one million words of seminary-quality theological material</li>
                    <li><strong>Video Lectures</strong> - Learn from experienced theologians and ministry leaders</li>
                    <li><strong>Discussion Forums</strong> - Connect with other ministry leaders in our community</li>
                    <li><strong>CPD Certificates</strong> - Earn recognized credentials upon course completion</li>
                    <li><strong>Priority Support</strong> - Our team is here to help you succeed</li>
                  </ul>
                </div>

                <div class="section" style="background-color: #f0f4ff; padding: 20px; border-radius: 6px; text-align: center;">
                  <p style="margin-top: 0; color: #1e3a8a; font-weight: 600;">Ready to begin your learning journey?</p>
                  <a href="https://crosslifeschoolofdivinity.org/dashboard" class="cta-button">Go to Your Dashboard</a>
                </div>

                <div class="section">
                  <h2>Questions or Need Help?</h2>
                  <p>Our support team is here to assist you. Whether you have technical questions, need course recommendations, or want to discuss your learning goals, don't hesitate to reach out.</p>
                  <p><strong>Email:</strong> <a href="mailto:support@crosslifeschoolofdivinity.org" style="color: #3b82f6; text-decoration: none;">support@crosslifeschoolofdivinity.org</a></p>
                  <p><strong>Response Time:</strong> We typically respond within 24 hours during business days</p>
                </div>

                <p style="margin-top: 30px; color: #666; font-size: 14px;">We're excited to partner with you in your ministry journey. May your studies deepen your faith, sharpen your skills, and expand your impact for God's kingdom.</p>

                <p style="color: #1e3a8a; font-weight: 600;">Blessings,<br>The Cross Life School of Divinity Team</p>
              </div>

              <div class="footer">
                <p style="margin: 0;">© 2025 Cross Life School of Divinity. All rights reserved.</p>
                <p style="margin: 8px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`[Email] Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send enhanced welcome email:', error);
    return false;
  }
}

/**
 * Payment Renewal Reminder Email
 * Sent 3 days before payment due date for payment plans
 */
export async function sendPaymentReminderEmail(
  to: string,
  studentName: string,
  planType: string,
  dueDate: Date,
  amount: number,
  paymentNumber: number,
  totalPayments: number
) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const formattedDueDate = dueDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const planName = planType === 'LEARNING_PATH' ? 'Learning Path' :
                   planType === 'BUNDLE_3_COURSE' ? '3-Course Bundle' :
                   'Chaplaincy Training Program';

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to,
      subject: `Reminder: Your ${planName} Payment Due on ${formattedDueDate}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
              .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
              .payment-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .payment-details { background-color: #f0f4ff; padding: 20px; border-radius: 6px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-row:last-child { border-bottom: none; }
              .detail-label { font-weight: 600; color: #1e3a8a; }
              .detail-value { text-align: right; }
              .cta-button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
              .cta-button:hover { background-color: #1e3a8a; }
              .section { margin-bottom: 20px; }
              .section h2 { color: #1e3a8a; font-size: 18px; margin-top: 0; }
              .footer { background-color: #f0f4ff; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 4px; margin-top: 20px; }
              .highlight { color: #f59e0b; font-weight: 600; }
              .success-text { color: #059669; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Payment Reminder</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Your next payment is due soon</p>
              </div>

              <div class="content">
                <p>Hello <span class="highlight">${studentName}</span>,</p>

                <p>This is a friendly reminder that your next payment for the <span class="highlight">${planName}</span> is due on <span class="highlight">${formattedDueDate}</span>.</p>

                <div class="payment-box">
                  <p style="margin: 0; font-size: 14px; color: #92400e;">⏰ <strong>Payment Due:</strong> ${formattedDueDate}</p>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #92400e;">💳 <strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
                </div>

                <div class="payment-details">
                  <div class="detail-row">
                    <span class="detail-label">Payment Plan:</span>
                    <span class="detail-value">${planName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Payment Number:</span>
                    <span class="detail-value">${paymentNumber} of ${totalPayments}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Amount Due:</span>
                    <span class="detail-value"><strong>$${(amount / 100).toFixed(2)}</strong></span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Due Date:</span>
                    <span class="detail-value"><strong>${formattedDueDate}</strong></span>
                  </div>
                </div>

                <div class="section">
                  <h2>What Happens Next?</h2>
                  <p>Your payment will be automatically charged on the due date using the payment method on file. No action is required unless you need to update your payment information.</p>
                  <p><span class="success-text">✓ Your courses remain active</span> - You'll continue to have full access to all your enrolled courses throughout your payment plan.</p>
                </div>

                <div class="section" style="background-color: #f0f4ff; padding: 20px; border-radius: 6px; text-align: center;">
                  <p style="margin-top: 0; color: #1e3a8a; font-weight: 600;">Need to update your payment method?</p>
                  <a href="https://crosslifeschoolofdivinity.org/my-payments" class="cta-button">Manage Payment Method</a>
                </div>

                <div class="section">
                  <h2>Questions?</h2>
                  <p>If you have any questions about your payment or need to make changes to your payment plan, please contact our support team:</p>
                  <p><strong>Email:</strong> <a href="mailto:support@crosslifeschoolofdivinity.org" style="color: #3b82f6; text-decoration: none;">support@crosslifeschoolofdivinity.org</a></p>
                  <p><strong>Response Time:</strong> We typically respond within 24 hours</p>
                </div>

                <p style="margin-top: 30px; color: #666; font-size: 14px;">Thank you for your commitment to your theological education and ministry growth. We're honored to be part of your journey.</p>

                <p style="color: #1e3a8a; font-weight: 600;">Blessings,<br>The Cross Life School of Divinity Team</p>
              </div>

              <div class="footer">
                <p style="margin: 0;">© 2025 Cross Life School of Divinity. All rights reserved.</p>
                <p style="margin: 8px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`[Email] Payment reminder email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send payment reminder email:', error);
    return false;
  }
}


/**
 * Send ID submission notification to admins
 */
export async function sendIdSubmissionNotification(user: any, submission: any) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    // Get all admin emails (you may need to fetch these from your admin list)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@crosslifeschoolofdivinity.org';
    
    await transporter.sendMail({
      from: emailConfig!.user,
      to: adminEmail,
      subject: `New ID Submission from ${user.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New ID Verification Submission</h2>
          <p>A student has submitted their ID document for verification.</p>
          
          <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Student Name:</strong> ${user.name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Student Email:</strong> ${user.email}</p>
            <p style="margin: 0 0 8px 0;"><strong>ID Type:</strong> ${submission.idType.replace(/_/g, ' ').toUpperCase()}</p>
            <p style="margin: 0 0 8px 0;"><strong>File Name:</strong> ${submission.fileName}</p>
            <p style="margin: 0;"><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
          </div>
          
          <p>Please review the submitted document and approve or request resubmission as needed.</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/admin/verification" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Submission
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Cross Life School of Divinity Admin System
          </p>
        </div>
      `,
    });
    console.log(`[Email] ID submission notification sent to ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send ID submission notification:', error);
    return false;
  }
}

/**
 * Send ID approval notification to student
 */
export async function sendIdApprovalNotification(user: any) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to: user.email,
      subject: 'ID Verification Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">✓ ID Verification Approved</h2>
          <p>Dear ${user.name},</p>
          
          <p>Great news! Your ID document has been successfully verified by our admin team.</p>
          
          <div style="background-color: #ecfdf5; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <p style="margin: 0; color: #065f46;"><strong>✓ Your ID has been approved</strong></p>
            <p style="margin: 8px 0 0 0; color: #065f46; font-size: 14px;">You can now proceed with your enrollment and access all course materials.</p>
          </div>
          
          <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/dashboard" 
               style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
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
    console.log(`[Email] ID approval notification sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send ID approval notification:', error);
    return false;
  }
}

/**
 * Send ID rejection notification to student
 */
export async function sendIdRejectionNotification(user: any, rejectionReason: string) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to: user.email,
      subject: 'ID Verification - Resubmission Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">ID Verification - Resubmission Required</h2>
          <p>Dear ${user.name},</p>
          
          <p>Thank you for submitting your ID document. Unfortunately, we were unable to verify it at this time.</p>
          
          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #7f1d1d;"><strong>Reason:</strong></p>
            <p style="margin: 8px 0 0 0; color: #7f1d1d;">${rejectionReason}</p>
          </div>
          
          <p style="margin-top: 20px;">Please submit a new ID document that meets the requirements. Make sure the document is:</p>
          <ul style="color: #374151; line-height: 1.8;">
            <li>Clear and legible</li>
            <li>Not expired</li>
            <li>A government-issued ID (Driver's License, State ID, or Passport)</li>
            <li>In good condition with no damage or obstruction</li>
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/student/id-upload" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Resubmit ID
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you have questions or need assistance, please contact our support team at support@crosslifeschoolofdivinity.org
          </p>
          
          <p style="color: #1e3a8a; font-weight: 600;">Blessings,<br>Cross Life School of Divinity Team</p>
        </div>
      `,
    });
    console.log(`[Email] ID rejection notification sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send ID rejection notification:', error);
    return false;
  }
}

/**
 * Send ID resubmission request to student
 */
export async function sendIdResubmissionRequestNotification(user: any, reason: string) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: emailConfig!.user,
      to: user.email,
      subject: 'ID Verification - Please Resubmit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">ID Verification - Please Resubmit</h2>
          <p>Dear ${user.name},</p>
          
          <p>We need you to resubmit your ID document for verification. Our team has identified an issue that needs to be addressed.</p>
          
          <div style="background-color: #fffbeb; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;"><strong>Issue:</strong></p>
            <p style="margin: 8px 0 0 0; color: #92400e;">${reason}</p>
          </div>
          
          <p style="margin-top: 20px;">Please resubmit a corrected version of your ID document. Ensure that:</p>
          <ul style="color: #374151; line-height: 1.8;">
            <li>All information is clearly visible</li>
            <li>The document is not expired</li>
            <li>There are no glares or shadows obscuring details</li>
            <li>Both sides are included if applicable</li>
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="https://cross-life-divinity.manus.space/student/id-upload" 
               style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Resubmit ID
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Thank you for your patience. If you have any questions, please contact support@crosslifeschoolofdivinity.org
          </p>
          
          <p style="color: #1e3a8a; font-weight: 600;">Blessings,<br>Cross Life School of Divinity Team</p>
        </div>
      `,
    });
    console.log(`[Email] ID resubmission request sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send ID resubmission request:', error);
    return false;
  }
}
