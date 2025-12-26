import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await connection.query("SELECT email, emailVerified, role FROM users WHERE email = 'admin@example.com'");
console.log(JSON.stringify(result[0], null, 2));
await connection.end();
