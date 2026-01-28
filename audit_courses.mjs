import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
SELECT 
  c.code,
  c.title,
  COUNT(DISTINCT l.id) as lessons,
  COUNT(DISTINCT q.id) as quizzes
FROM courses c
LEFT JOIN lessons l ON l.courseId = c.id
LEFT JOIN quiz_questions q ON q.lessonId = l.id
GROUP BY c.id, c.code, c.title
ORDER BY lessons ASC, c.code
`);

console.log('COURSE AUDIT REPORT');
console.log('==================');
rows.forEach(r => {
  const status = r.lessons === 0 ? '❌ MISSING' : (r.quizzes === 0 ? '⚠️ NO QUIZZES' : '✓');
  console.log(`${status} ${r.code}: ${r.title} - ${r.lessons} lessons, ${r.quizzes} quizzes`);
});

await connection.end();
