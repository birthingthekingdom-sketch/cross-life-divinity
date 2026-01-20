import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cross_life_divinity'
});

const [courses] = await connection.query(`
  SELECT 
    c.id,
    c.courseCode,
    c.title,
    COUNT(DISTINCT l.id) as lesson_count,
    COUNT(DISTINCT q.id) as quiz_count
  FROM courses c
  LEFT JOIN lessons l ON c.id = l.courseId
  LEFT JOIN quiz_questions q ON l.id = q.lessonId
  GROUP BY c.id, c.courseCode, c.title
  ORDER BY c.courseCode
`);

console.log('=== COMPREHENSIVE COURSE AUDIT ===\n');
console.log(`Total Courses: ${courses.length}\n`);

let totalLessons = 0;
let totalQuizzes = 0;

for (const course of courses) {
  totalLessons += course.lesson_count;
  totalQuizzes += course.quiz_count;
  
  const status = course.lesson_count > 0 && course.quiz_count > 0 ? '✅' : '❌';
  console.log(`${status} ${course.courseCode}: ${course.title}`);
  console.log(`   Lessons: ${course.lesson_count} | Quizzes: ${course.quiz_count}`);
  console.log();
}

console.log(`\n=== TOTALS ===`);
console.log(`Total Lessons: ${totalLessons}`);
console.log(`Total Quiz Questions: ${totalQuizzes}`);

await connection.end();
