import { GED_LANG_QUIZZES } from './add_ged_lang_quizzes.mjs';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0] || 'cross_life',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function insertLangQuizzes() {
  const connection = await pool.getConnection();
  try {
    // Get GED-RLA course and lessons
    const [courses] = await connection.query(
      'SELECT id FROM courses WHERE code = ?',
      ['GED-RLA']
    );
    
    if (courses.length === 0) {
      console.log('GED-RLA course not found');
      return;
    }
    
    const courseId = courses[0].id;
    console.log(`Found GED-RLA course with ID: ${courseId}`);
    
    // Get all lessons for GED-RLA
    const [lessons] = await connection.query(
      'SELECT id, title FROM lessons WHERE courseId = ? ORDER BY id',
      [courseId]
    );
    
    console.log(`Found ${lessons.length} lessons for GED-RLA:`);
    lessons.forEach(l => console.log(`  - Lesson ${l.id}: ${l.title}`));
    
    // Insert quiz questions
    let totalInserted = 0;
    for (const lesson of lessons) {
      const questions = GED_LANG_QUIZZES[lesson.id] || [];
      console.log(`\nInserting ${questions.length} questions for lesson ${lesson.id}`);
      
      for (const q of questions) {
        await connection.query(
          'INSERT INTO quiz_questions (lessonId, question, options, correctAnswer) VALUES (?, ?, ?, ?)',
          [
            lesson.id,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer
          ]
        );
        totalInserted++;
      }
    }
    
    console.log(`\n✅ Successfully inserted ${totalInserted} Language Arts quiz questions!`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

insertLangQuizzes();
