import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
const urlObj = new URL(dbUrl);

const pool = mysql.createPool({
  host: urlObj.hostname,
  user: urlObj.username,
  password: urlObj.password,
  database: urlObj.pathname.slice(1),
  port: parseInt(urlObj.port) || 3306,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

async function check() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Check Bridge Academy courses
    const [bridgeCourses] = await conn.query(
      "SELECT id, courseCode, courseName FROM bridge_academy_courses"
    );
    console.log('Bridge Academy courses:', bridgeCourses.length);
    bridgeCourses.forEach(c => console.log(`  - ${c.courseCode}: ${c.courseName}`));
    
    // Check all courses
    const [allCourses] = await conn.query(
      "SELECT code, title, courseType FROM courses ORDER BY code"
    );
    console.log('\nAll courses in courses table:', allCourses.length);
    allCourses.forEach(c => console.log(`  - ${c.code}: ${c.title} (${c.courseType})`));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (conn) await conn.release();
    await pool.end();
  }
}

check();
