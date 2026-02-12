import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [courses] = await connection.execute(
  `SELECT id, code, title FROM courses WHERE code = 'CHAP101'`
);

console.log("CHAP101 course:");
courses.forEach(c => {
  console.log(`ID: ${c.id}, Code: ${c.code}, Title: ${c.title}`);
});

await connection.end();
