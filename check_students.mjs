import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [users] = await connection.execute(
  `SELECT id, email, name, role, createdAt FROM users ORDER BY createdAt DESC LIMIT 10`
);

console.log("Recent users:");
users.forEach(u => {
  console.log(`- ${u.email} | Role: ${u.role} | Name: ${u.name}`);
});

await connection.end();
