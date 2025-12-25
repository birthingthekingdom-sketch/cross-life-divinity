/**
 * Welcome Email Template for New Students
 * Sent immediately after enrollment
 */

export function generateWelcomeEmail(studentName: string, enrolledCourses: string[]): { subject: string; html: string } {
  const coursesListHtml = enrolledCourses
    .map(course => `<li style="margin-bottom: 8px; color: #333;">${course}</li>`)
    .join('');

  const subject = `Welcome to Cross Life School of Divinity, ${studentName}!`;

  const html = `
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
  `;

  return { subject, html };
}
