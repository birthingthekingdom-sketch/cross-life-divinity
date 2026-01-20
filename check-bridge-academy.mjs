import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'test',
});

// Check Bridge Academy courses
const [courses] = await conn.execute(
  `SELECT id, courseCode, title, description FROM courses WHERE courseCode LIKE 'GED%' ORDER BY courseCode`
);

console.log('\n=== GED COURSES IN DATABASE ===');
courses.forEach(c => {
  console.log(`${c.courseCode}: ${c.title} (ID: ${c.id})`);
});

// Check Bridge Academy enrollments
const [enrollments] = await conn.execute(
  `SELECT id, userId, status FROM bridge_academy_enrollments LIMIT 5`
);

console.log('\n=== BRIDGE ACADEMY ENROLLMENTS (Sample) ===');
enrollments.forEach(e => {
  console.log(`User ${e.userId}: ${e.status}`);
});

conn.end();
