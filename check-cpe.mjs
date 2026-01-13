import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [courses] = await conn.query(
  'SELECT id, code, title, description FROM courses WHERE description LIKE "%CPE%" OR description LIKE "%CPD%" OR description LIKE "%certificate%" LIMIT 20'
);
console.log('Courses with CPE/CPD references:');
if (courses.length === 0) {
  console.log('No courses found with CPE/CPD references');
} else {
  courses.forEach(c => {
    const desc = c.description ? c.description.substring(0, 100) : 'No description';
    console.log(`${c.code}: ${desc}...`);
  });
}
await conn.end();
