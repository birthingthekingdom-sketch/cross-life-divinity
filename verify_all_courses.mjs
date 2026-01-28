import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [courses] = await connection.execute(`
  SELECT 
    c.id, 
    c.code, 
    c.title, 
    COUNT(DISTINCT l.id) as lessonCount,
    COUNT(DISTINCT q.id) as quizCount
  FROM courses c 
  LEFT JOIN lessons l ON c.id = l.courseId 
  LEFT JOIN quiz_questions q ON l.id = q.lessonId
  GROUP BY c.id, c.code, c.title
  ORDER BY c.code
`);

console.log('=== FULL COURSE AUDIT ===\n');

let incomplete = [];
let complete = [];

for (const course of courses) {
  const status = course.lessonCount > 0 && course.quizCount > 0 ? '✅' : '❌';
  const line = `${status} ${course.code}: ${course.title} - ${course.lessonCount} lessons, ${course.quizCount} quizzes`;
  console.log(line);
  
  if (course.lessonCount === 0 || course.quizCount === 0) {
    incomplete.push(course);
  } else {
    complete.push(course);
  }
}

console.log('\n=== SUMMARY ===');
console.log(`Complete courses: ${complete.length}`);
console.log(`Incomplete courses: ${incomplete.length}`);

if (incomplete.length > 0) {
  console.log('\nINCOMPLETE COURSES:');
  incomplete.forEach(c => console.log(`  - ${c.code}: ${c.title} (${c.lessonCount} lessons, ${c.quizCount} quizzes)`));
}

await connection.end();
