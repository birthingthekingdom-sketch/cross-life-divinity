import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [courses] = await connection.execute(`
  SELECT c.id, c.code, c.title, COUNT(l.id) as lessonCount 
  FROM courses c 
  LEFT JOIN lessons l ON c.id = l.courseId 
  WHERE c.code LIKE 'GED%' 
  GROUP BY c.id, c.code, c.title
`);

console.log('GED Courses:');
for (const course of courses) {
  console.log(`  ${course.code}: ${course.title} - ${course.lessonCount} lessons (ID: ${course.id})`);
  
  const [lessons] = await connection.execute(`SELECT id, title FROM lessons WHERE courseId = ? ORDER BY lessonOrder`, [course.id]);
  for (const lesson of lessons) {
    const [quizzes] = await connection.execute(`SELECT COUNT(*) as count FROM quiz_questions WHERE lessonId = ?`, [lesson.id]);
    console.log(`    - ${lesson.title} (ID: ${lesson.id}, quizzes: ${quizzes[0].count})`);
  }
}

await connection.end();
