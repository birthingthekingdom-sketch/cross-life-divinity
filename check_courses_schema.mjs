import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [columns] = await connection.execute(`DESCRIBE courses`);
console.log('Courses table columns:');
columns.forEach(c => console.log(`  ${c.Field} - ${c.Type}`));
await connection.end();
