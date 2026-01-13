import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      ...options
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendPracticeTestRecommendation(
  email: string,
  userName: string,
  courseName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">Time to Test Your Knowledge! 📚</h2>
      <p>Hi ${userName},</p>
      <p>You've been making great progress in <strong>${courseName}</strong>! You've completed several lessons, and now it's a perfect time to test your knowledge with a practice test.</p>
      <p>Practice tests help you:</p>
      <ul>
        <li>Identify areas where you need more practice</li>
        <li>Get familiar with the GED test format</li>
        <li>Build confidence before the actual exam</li>
        <li>Earn achievement badges and points!</li>
      </ul>
      <a href="${process.env.VITE_APP_URL}/practice-tests" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Take a Practice Test</a>
      <p>Keep up the great work!</p>
      <p>Best regards,<br/>Cross Life School of Divinity - Bridge Academy</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `${courseName} - Time for a Practice Test!`,
    html
  });
}

export async function sendCertificateNotification(
  email: string,
  userName: string,
  courseName: string,
  certificateCode: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">🎓 Congratulations! You've Earned a Certificate!</h2>
      <p>Hi ${userName},</p>
      <p>Excellent work! You have successfully completed the <strong>${courseName}</strong> course!</p>
      <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0;">
        <p><strong>Certificate Code:</strong> ${certificateCode}</p>
        <p>This code can be used to verify your achievement.</p>
      </div>
      <a href="${process.env.VITE_APP_URL}/certificates" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Download Your Certificate</a>
      <p>Share your achievement with your network and continue your learning journey with us!</p>
      <p>Best regards,<br/>Cross Life School of Divinity - Bridge Academy</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Certificate Awarded: ${courseName}`,
    html
  });
}

export async function sendMilestoneNotification(
  email: string,
  userName: string,
  milestone: string,
  points: number
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">🎉 Milestone Achieved!</h2>
      <p>Hi ${userName},</p>
      <p>Congratulations! You've achieved a new milestone: <strong>${milestone}</strong></p>
      <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0;">
        <p><strong>+${points} Points Earned!</strong></p>
        <p>Check your leaderboard to see your updated ranking.</p>
      </div>
      <a href="${process.env.VITE_APP_URL}/leaderboard" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">View Leaderboard</a>
      <p>Keep pushing towards your goals!</p>
      <p>Best regards,<br/>Cross Life School of Divinity - Bridge Academy</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Milestone Achieved: ${milestone}`,
    html
  });
}

export async function sendStreakReminder(
  email: string,
  userName: string,
  currentStreak: number
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">🔥 Keep Your Streak Alive!</h2>
      <p>Hi ${userName},</p>
      <p>You have an impressive <strong>${currentStreak}-day learning streak</strong> going! Don't break it now!</p>
      <p>Complete a lesson today to keep your streak alive and earn bonus points.</p>
      <a href="${process.env.VITE_APP_URL}/my-courses" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Continue Learning</a>
      <p>You're doing amazing! 💪</p>
      <p>Best regards,<br/>Cross Life School of Divinity - Bridge Academy</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Keep Your ${currentStreak}-Day Streak Alive!`,
    html
  });
}

export async function sendWelcomeEmail(
  email: string,
  userName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">Welcome to Bridge Academy! 🎓</h2>
      <p>Hi ${userName},</p>
      <p>Welcome to Cross Life School of Divinity's Bridge Academy! We're excited to have you join our learning community.</p>
      <p>Here's what you can do now:</p>
      <ul>
        <li><strong>Explore Courses:</strong> Choose from 4 comprehensive GED preparation courses</li>
        <li><strong>Start Learning:</strong> Complete lessons and build your knowledge</li>
        <li><strong>Take Practice Tests:</strong> Test your skills with full-length practice exams</li>
        <li><strong>Earn Achievements:</strong> Unlock badges and climb the leaderboard</li>
        <li><strong>Get Certified:</strong> Earn professional certificates upon course completion</li>
      </ul>
      <a href="${process.env.VITE_APP_URL}/my-courses" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Get Started Now</a>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Happy learning!<br/>Cross Life School of Divinity - Bridge Academy</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to Bridge Academy!',
    html
  });
}
