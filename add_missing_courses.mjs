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

async function addCourses() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Add missing theological courses
    const theologicalCourses = [
      {
        code: 'BIB101',
        title: 'Old Testament Survey',
        description: 'A comprehensive survey of the Old Testament covering the historical, poetic, and prophetic books.',
        totalLessons: 10,
        cpdHours: 20,
        price: 89,
        courseType: 'theological'
      },
      {
        code: 'BIB102',
        title: 'New Testament Survey',
        description: 'An in-depth survey of the New Testament including the Gospels, Acts, Paul\'s epistles, and the general epistles.',
        totalLessons: 10,
        cpdHours: 20,
        price: 89,
        courseType: 'theological'
      }
    ];
    
    // Add GED courses
    const gedCourses = [
      {
        code: 'GED-MATH',
        title: 'GED Mathematics',
        description: 'Comprehensive preparation for the GED Mathematics test covering algebra, geometry, and data analysis.',
        totalLessons: 12,
        cpdHours: 24,
        price: 79,
        courseType: 'ged'
      },
      {
        code: 'GED-LANG',
        title: 'GED Language Arts',
        description: 'Preparation for the GED Reasoning Through Language Arts test including reading, writing, and grammar.',
        totalLessons: 12,
        cpdHours: 24,
        price: 79,
        courseType: 'ged'
      },
      {
        code: 'GED-SCI',
        title: 'GED Science',
        description: 'Comprehensive coverage of life science, physical science, and earth science topics for the GED exam.',
        totalLessons: 10,
        cpdHours: 20,
        price: 79,
        courseType: 'ged'
      },
      {
        code: 'GED-SOCIAL',
        title: 'GED Social Studies',
        description: 'Preparation for the GED Social Studies test covering civics, history, geography, and economics.',
        totalLessons: 10,
        cpdHours: 20,
        price: 79,
        courseType: 'ged'
      }
    ];
    
    const allCourses = [...theologicalCourses, ...gedCourses];
    
    for (const course of allCourses) {
      await conn.query(
        'INSERT INTO courses (code, title, description, totalLessons, cpdHours, price, courseType) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [course.code, course.title, course.description, course.totalLessons, course.cpdHours, course.price, course.courseType]
      );
      console.log(`✅ Added: ${course.code} - ${course.title}`);
    }
    
    // Verify counts
    const [theoCount] = await conn.query(
      "SELECT COUNT(*) as count FROM courses WHERE courseType IS NULL OR courseType = '' OR courseType = 'theological'"
    );
    const [gedCount] = await conn.query(
      "SELECT COUNT(*) as count FROM courses WHERE courseType = 'ged'"
    );
    
    console.log(`\n✅ Theological courses: ${theoCount[0].count}`);
    console.log(`✅ GED courses: ${gedCount[0].count}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (conn) await conn.release();
    await pool.end();
  }
}

addCourses();
