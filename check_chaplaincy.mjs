import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check for Chaplaincy course
const [courses] = await connection.execute(`
  SELECT id, code, title, description, price, cpdHours 
  FROM courses 
  WHERE code LIKE '%CHAP%' OR title LIKE '%Chaplain%' OR title LIKE '%CPE%'
`);

console.log('=== CHAPLAINCY COURSE CHECK ===\n');

if (courses.length === 0) {
  console.log('❌ NO CHAPLAINCY COURSE FOUND!');
  
  // Check all course codes to see what exists
  const [allCourses] = await connection.execute(`SELECT code, title FROM courses ORDER BY code`);
  console.log('\nAll existing courses:');
  allCourses.forEach(c => console.log(`  ${c.code}: ${c.title}`));
} else {
  for (const course of courses) {
    console.log(`✅ Found: ${course.code} - ${course.title}`);
    console.log(`   Price: $${course.price}`);
    console.log(`   CPD Hours: ${course.cpdHours}`);
    console.log(`   Description: ${course.description?.substring(0, 100)}...`);
    
    // Get lessons
    const [lessons] = await connection.execute(`
      SELECT l.id, l.title, l.lessonOrder, COUNT(q.id) as quizCount 
      FROM lessons l 
      LEFT JOIN quiz_questions q ON l.id = q.lessonId 
      WHERE l.courseId = ? 
      GROUP BY l.id, l.title, l.lessonOrder
      ORDER BY l.lessonOrder
    `, [course.id]);
    
    console.log(`\n   Lessons (${lessons.length} total):`);
    lessons.forEach(l => console.log(`     ${l.lessonOrder}. ${l.title} - ${l.quizCount} quizzes`));
    
    // Total quiz count
    const totalQuizzes = lessons.reduce((sum, l) => sum + Number(l.quizCount), 0);
    console.log(`\n   Total Quizzes: ${totalQuizzes}`);
  }
}

await connection.end();
