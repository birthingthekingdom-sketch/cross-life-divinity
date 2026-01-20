import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get THE201 course ID
const [courses] = await connection.execute(`SELECT id, code, title FROM courses WHERE code = 'THE201'`);
console.log('THE201 Course:', courses[0]);

// Get one lesson as template
const [lessons] = await connection.execute(`
  SELECT id, title, content FROM lessons 
  WHERE courseId = ? 
  LIMIT 1
`, [courses[0].id]);

console.log('\n=== LESSON TEMPLATE ===');
console.log('Title:', lessons[0].title);
console.log('Content length:', lessons[0].content?.length || 0);
console.log('\nContent preview (first 2500 chars):');
console.log(lessons[0].content?.substring(0, 2500));

// Get quiz questions for this lesson
const [quizzes] = await connection.execute(`
  SELECT id, questionText, questionType, options, correctAnswer 
  FROM quiz_questions WHERE lessonId = ? LIMIT 3
`, [lessons[0].id]);

console.log('\n=== QUIZ TEMPLATE ===');
quizzes.forEach((q, i) => {
  console.log(`\nQ${i+1}: ${q.questionText}`);
  console.log('Type:', q.questionType);
  console.log('Options:', q.options);
  console.log('Answer:', q.correctAnswer);
});

await connection.end();
