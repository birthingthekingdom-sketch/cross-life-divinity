import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get Chaplaincy course
const courses = await connection.query('SELECT id, code, title FROM courses WHERE code = "CHAP101"');
console.log('Chaplaincy Course:', courses[0][0]);

// Get lessons for Chaplaincy
const lessons = await connection.query('SELECT id, courseId, title FROM lessons WHERE courseId = ?', [courses[0][0].id]);
console.log('\nChaplaincy Lessons (' + lessons[0].length + ' total):');
lessons[0].forEach((lesson, i) => {
  console.log(`${i + 1}. ${lesson.title} (ID: ${lesson.id})`);
});

console.log('\n✅ Access Chaplaincy Lessons at:');
console.log('URL: /course/' + courses[0][0].id);
console.log('Full Link: https://crosslifeschoolofdivinity.org/course/' + courses[0][0].id);

connection.end();
