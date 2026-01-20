import { createConnection } from 'mysql2/promise';

const connection = await createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Get all courses
const [courses] = await connection.query(`
  SELECT id, code, title, description, price, courseType 
  FROM courses 
  ORDER BY code
`);

console.log(`\n=== COURSE AUDIT REPORT ===\n`);
console.log(`Total Courses: ${courses.length}\n`);

for (const course of courses) {
  // Get lesson count for this course
  const [lessons] = await connection.query(`
    SELECT COUNT(*) as count FROM lessons WHERE courseId = ?
  `, [course.id]);
  
  const lessonCount = lessons[0].count;
  
  console.log(`${course.code} - ${course.title}`);
  console.log(`  ID: ${course.id}`);
  console.log(`  Type: ${course.courseType}`);
  console.log(`  Price: $${course.price}`);
  console.log(`  Lessons: ${lessonCount}`);
  console.log(`  Description: ${course.description ? course.description.substring(0, 80) + '...' : 'MISSING'}`);
  console.log('');
}

await connection.end();
