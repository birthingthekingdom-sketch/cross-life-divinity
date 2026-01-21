import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/cross-life-divinity/.env' });

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [courses] = await connection.execute('SELECT id, code, title FROM courses WHERE code LIKE "GED%"');
console.log('GED Courses:', courses);

for (const course of courses) {
  const [lessons] = await connection.execute(
    'SELECT id, title, lessonOrder FROM lessons WHERE courseId = ? ORDER BY lessonOrder',
    [course.id]
  );
  console.log(`\n${course.code} (${course.title}) - ${lessons.length} lessons:`);
  lessons.forEach(l => console.log(`  ${l.lessonOrder}. [${l.id}] ${l.title}`));
}

await connection.end();
