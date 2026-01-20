import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get all courses with lesson and quiz counts
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

console.log('=== FULL COURSE AUDIT (23 Courses) ===\n');

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
  console.log('\n❌ INCOMPLETE COURSES:');
  incomplete.forEach(c => console.log(`  - ${c.code}: ${c.title} (${c.lessonCount} lessons, ${c.quizCount} quizzes)`));
}

// Detailed breakdown for DIV112 and DIV113
console.log('\n=== DETAILED: DIV112 Christology ===');
const [div112] = await connection.execute(`SELECT id FROM courses WHERE code = 'DIV112'`);
if (div112.length > 0) {
  const [lessons112] = await connection.execute(`
    SELECT l.id, l.title, l.lessonOrder, COUNT(q.id) as quizCount 
    FROM lessons l 
    LEFT JOIN quiz_questions q ON l.id = q.lessonId 
    WHERE l.courseId = ? 
    GROUP BY l.id, l.title, l.lessonOrder
    ORDER BY l.lessonOrder
  `, [div112[0].id]);
  lessons112.forEach(l => console.log(`  Lesson ${l.lessonOrder}: ${l.title} - ${l.quizCount} quizzes`));
} else {
  console.log('  DIV112 NOT FOUND!');
}

console.log('\n=== DETAILED: DIV113 Contemporary Theological Issues ===');
const [div113] = await connection.execute(`SELECT id FROM courses WHERE code = 'DIV113'`);
if (div113.length > 0) {
  const [lessons113] = await connection.execute(`
    SELECT l.id, l.title, l.lessonOrder, COUNT(q.id) as quizCount 
    FROM lessons l 
    LEFT JOIN quiz_questions q ON l.id = q.lessonId 
    WHERE l.courseId = ? 
    GROUP BY l.id, l.title, l.lessonOrder
    ORDER BY l.lessonOrder
  `, [div113[0].id]);
  lessons113.forEach(l => console.log(`  Lesson ${l.lessonOrder}: ${l.title} - ${l.quizCount} quizzes`));
} else {
  console.log('  DIV113 NOT FOUND!');
}

await connection.end();
