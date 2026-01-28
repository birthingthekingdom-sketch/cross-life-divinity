import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get BIB201 course ID
const [courses] = await connection.execute(`SELECT id, code, title FROM courses WHERE code = 'BIB201'`);
console.log('Found BIB201:', courses);

if (courses.length > 0) {
  const courseId = courses[0].id;
  
  // Get lessons for this course
  const [lessons] = await connection.execute(`SELECT id FROM lessons WHERE courseId = ?`, [courseId]);
  console.log(`Found ${lessons.length} lessons`);
  
  // Delete quiz questions for these lessons
  for (const lesson of lessons) {
    await connection.execute(`DELETE FROM quiz_questions WHERE lessonId = ?`, [lesson.id]);
  }
  console.log('Deleted quiz questions');
  
  // Delete lessons
  await connection.execute(`DELETE FROM lessons WHERE courseId = ?`, [courseId]);
  console.log('Deleted lessons');
  
  // Delete course enrollments
  await connection.execute(`DELETE FROM course_enrollments WHERE courseId = ?`, [courseId]);
  console.log('Deleted enrollments');
  
  // Delete the course
  await connection.execute(`DELETE FROM courses WHERE id = ?`, [courseId]);
  console.log('Deleted BIB201 course');
}

// Verify remaining hermeneutics courses
const [remaining] = await connection.execute(`SELECT code, title FROM courses WHERE title LIKE '%Hermeneutics%'`);
console.log('\nRemaining Hermeneutics courses:', remaining);

await connection.end();
