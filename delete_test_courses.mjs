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

async function cleanup() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Find test courses
    const [testCourses] = await conn.query(
      "SELECT id, code, title FROM courses WHERE code LIKE 'TEST%' OR code LIKE 'TWC%' OR code LIKE 'CSV%' OR title LIKE '%Test%'"
    );
    
    console.log('Test courses found:', testCourses.length);
    testCourses.forEach(c => console.log(`  - ${c.code}: ${c.title}`));
    
    // Delete test courses
    for (const course of testCourses) {
      await conn.query('DELETE FROM course_enrollments WHERE courseId = ?', [course.id]);
      await conn.query('DELETE FROM lessons WHERE courseId = ?', [course.id]);
      await conn.query('DELETE FROM courses WHERE id = ?', [course.id]);
      console.log(`✅ Deleted: ${course.code}`);
    }
    
    // Check theological courses
    const [theoCourses] = await conn.query(
      "SELECT COUNT(*) as count FROM courses WHERE courseType = 'theological' OR courseType IS NULL OR courseType = ''"
    );
    console.log('\nTheological courses:', theoCourses[0].count);
    
    // Check GED courses
    const [gedCourses] = await conn.query(
      "SELECT id, code, title, courseType FROM courses WHERE courseType = 'ged' OR code LIKE 'GED%'"
    );
    console.log('GED courses found:', gedCourses.length);
    gedCourses.forEach(c => console.log(`  - ${c.code}: ${c.title} (type: ${c.courseType})`));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (conn) await conn.end();
    await pool.end();
  }
}

cleanup();
