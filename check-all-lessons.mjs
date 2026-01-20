import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Count total lessons
const [total] = await connection.execute('SELECT COUNT(*) as count FROM lessons');
console.log(`\n📊 Total lessons in database: ${total[0].count}`);

// Count lessons by course
const [byCourse] = await connection.execute(`
  SELECT c.code, c.title, COUNT(l.id) as lessonCount 
  FROM courses c 
  LEFT JOIN lessons l ON c.id = l.courseId 
  GROUP BY c.id 
  ORDER BY lessonCount DESC
`);

console.log('\n📚 Lessons by course:');
byCourse.forEach(row => {
  console.log(`   ${row.code}: ${row.title} - ${row.lessonCount} lessons`);
});

// Check if there are any lessons with courseId = 840001 (Chaplaincy)
const [chapLessons] = await connection.execute(
  'SELECT COUNT(*) as count FROM lessons WHERE courseId = 840001'
);
console.log(`\n🔍 Chaplaincy (courseId 840001) has ${chapLessons[0].count} lessons`);

await connection.end();
