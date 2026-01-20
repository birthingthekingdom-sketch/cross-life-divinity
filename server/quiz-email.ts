import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendQuizResultEmail(
  studentEmail: string,
  studentName: string,
  courseName: string,
  lessonName: string,
  score: number,
  totalQuestions: number,
  passed: boolean
) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let recommendation = '';
  if (passed) {
    if (percentage >= 90) {
      recommendation = 'Excellent work! You have mastered this topic. Consider moving on to the next lesson.';
    } else if (percentage >= 80) {
      recommendation = 'Great job! You have a solid understanding of this topic. You\'re ready to move forward.';
    } else {
      recommendation = 'Good effort! You passed this quiz. Review any weak areas before moving to the next lesson.';
    }
  } else {
    if (percentage >= 60) {
      recommendation = 'You\'re close! Review the material and try again. Focus on the questions you missed.';
    } else {
      recommendation = 'Keep practicing! Review the lesson material carefully and attempt the quiz again when ready.';
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .score-box { background: ${passed ? '#d4edda' : '#f8d7da'}; border: 1px solid ${passed ? '#c3e6cb' : '#f5c6cb'}; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .score-number { font-size: 36px; font-weight: bold; color: ${passed ? '#155724' : '#721c24'}; }
          .recommendation { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quiz Result: ${lessonName}</h1>
            <p>${courseName}</p>
          </div>
          
          <div class="content">
            <p>Hi ${studentName},</p>
            
            <p>You just completed a quiz for <strong>${lessonName}</strong> in <strong>${courseName}</strong>. Here are your results:</p>
            
            <div class="score-box">
              <div class="score-number">${percentage}%</div>
              <p>You scored <strong>${score} out of ${totalQuestions}</strong> questions correctly.</p>
              <p><strong>${passed ? '✓ PASSED' : '✗ NEEDS REVIEW'}</strong> (Passing score: 70%)</p>
            </div>
            
            <div class="recommendation">
              <strong>📚 Recommendation:</strong><br>
              ${recommendation}
            </div>
            
            <p>Keep up the great work! Your consistent effort will lead to success on the GED exam.</p>
            
            <a href="${process.env.VITE_APP_URL}/bridge-academy" class="button">Continue Learning</a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999;">
              This is an automated message from Cross Life School of Divinity Bridge Academy. Please do not reply to this email.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 Cross Life School of Divinity. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: studentEmail,
      subject: `Quiz Result: ${lessonName} - ${percentage}%`,
      html: htmlContent,
    });
    console.log(`Quiz result email sent to ${studentEmail}`);
  } catch (error) {
    console.error('Failed to send quiz result email:', error);
  }
}
