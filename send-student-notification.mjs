import mysql from 'mysql2/promise';

const message = `
Important Update: Cross Life School of Divinity Platform Maintenance

Dear Student,

I'm writing to update you on a temporary issue affecting the Cross Life School of Divinity online learning platform.

WHAT'S HAPPENING:
We've identified a technical issue that temporarily affected access to course content, lessons, and quizzes on our platform. We sincerely apologize for any inconvenience this may have caused.

WHAT WE'RE DOING:
Our technical team has identified the root cause and is working with our hosting provider to restore full functionality. We expect the platform to be fully operational within the next 24-48 hours.

WHAT THIS MEANS FOR YOU:
- Your student account and enrollment are secure and unaffected
- All your course progress and data is being preserved
- You will have full access to all your enrolled courses once the restoration is complete
- There is no action required on your part

NEXT STEPS:
1. We will send you a confirmation email as soon as the platform is fully restored
2. You can then log back in and resume your courses immediately
3. If you have any questions in the meantime, please don't hesitate to reach out

We truly appreciate your patience and understanding as we work through this technical issue. Your education is our priority, and we're committed to providing you with a reliable learning platform.

Thank you for your continued trust in Cross Life School of Divinity.
`;

async function sendNotifications() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME
    });

    // Get all legitimate student accounts
    const [students] = await conn.execute(
      `SELECT id, email, name FROM users 
       WHERE role = 'user' 
       AND email NOT LIKE '%test%' 
       AND email NOT LIKE '%@example.com' 
       AND email != 'studio6817@yahoo.com'
       ORDER BY createdAt DESC`
    );

    console.log(`Found ${students.length} students to notify`);

    // Send notification to each student
    let sent = 0;
    for (const student of students) {
      try {
        await conn.execute(
          `INSERT INTO notifications (userId, title, message, type, createdAt, isRead)
           VALUES (?, ?, ?, ?, NOW(), 0)`,
          [student.id, 'Platform Maintenance Update', message, 'maintenance']
        );
        console.log(`✓ Notification sent to ${student.email}`);
        sent++;
      } catch (e) {
        console.log(`✗ Failed to send to ${student.email}: ${e.message}`);
      }
    }

    console.log(`\nSummary: ${sent}/${students.length} notifications sent successfully`);
    await conn.end();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

sendNotifications();
