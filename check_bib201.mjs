import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check for BIB201 or any course with code containing 201
const [courses] = await connection.execute(`SELECT id, code, title FROM courses WHERE code LIKE '%201%' OR title LIKE '%Hermeneutics%'`);
console.log('Courses with 201 or Hermeneutics:', courses);

// Get total course count
const [count] = await connection.execute(`SELECT COUNT(*) as total FROM courses`);
console.log('Total courses:', count[0].total);

await connection.end();
