import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [courses] = await connection.execute(`SELECT id, code, title FROM courses WHERE code = 'DIV113'`);
console.log('DIV113 Course:', courses[0]);

const [lessons] = await connection.execute(`SELECT id, title FROM lessons WHERE courseId = ?`, [courses[0].id]);
console.log('\nExisting lessons:');
lessons.forEach(l => console.log(`  ${l.id}: ${l.title}`));

await connection.end();
