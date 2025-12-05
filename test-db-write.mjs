import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // Try to update
  const [result] = await connection.execute(
    "UPDATE users SET role = 'admin' WHERE email = 'birthingthekingdom@gmail.com'"
  );
  console.log('Update result:', result);
  
  // Check if it worked
  const [rows] = await connection.execute(
    "SELECT email, role FROM users WHERE email = 'birthingthekingdom@gmail.com'"
  );
  console.log('Current role:', rows[0]);
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}
