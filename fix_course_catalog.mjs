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

// Correct course list with proper order
const correctCourses = [
  { code: 'BIB101', title: 'Old Testament Survey', order: 1 },
  { code: 'BIB102', title: 'New Testament Survey', order: 2 },
  { code: 'THE201', title: 'Systematic Theology', order: 3 },
  { code: 'BIB201', title: 'Biblical Hermeneutics', order: 4 },
  { code: 'DIV101', title: 'Understanding Prophecy', order: 5 },
  { code: 'THE301', title: 'Fundamentals of Apologetics', order: 6 },
  { code: 'DIV102', title: 'Deliverance Ministry', order: 7 },
  { code: 'MIN101', title: 'Evangelism and Discipleship', order: 8 },
  { code: 'MIN102', title: 'Discipleship Training', order: 9 },
  { code: 'SPR101', title: 'Prayer and Intercession', order: 10 },
  { code: 'LED201', title: 'Leadership', order: 11 },
  { code: 'LED202', title: 'Christian Leadership', order: 12 },
  { code: 'PAS201', title: 'Pastoral Counseling', order: 13 },
  { code: 'PAS301', title: 'Church Administration', order: 14 },
  { code: 'PAS101', title: 'Homiletics', order: 15 },
  { code: 'SPR201', title: 'Discovering Spiritual Gifts', order: 16 },
  { code: 'WOR101', title: 'Biblical Worship', order: 17 },
  { code: 'DIV111', title: 'Capstone Project', order: 18 },
  { code: 'DIV112', title: 'Christology', order: 19 },
  { code: 'DIV113', title: 'Contemporary Theological Issues', order: 20 },
];

async function fixCatalog() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('Fixing course catalog...\n');
    
    // First, get all current courses
    const [currentCourses] = await conn.query(
      "SELECT id, code, title FROM courses WHERE courseType IS NULL OR courseType = '' OR courseType = 'theological'"
    );
    
    const currentMap = new Map(currentCourses.map(c => [c.code, c]));
    
    // Courses to remove (not in correct list)
    const correctCodes = new Set(correctCourses.map(c => c.code));
    const toRemove = currentCourses.filter(c => !correctCodes.has(c.code));
    
    if (toRemove.length > 0) {
      console.log('Removing courses not in the correct list:');
      for (const course of toRemove) {
        console.log(`  - ${course.code}: ${course.title}`);
        await conn.query('DELETE FROM courses WHERE id = ?', [course.id]);
      }
      console.log();
    }
    
    // Update or create courses
    console.log('Updating/Creating courses:');
    for (const course of correctCourses) {
      const existing = currentMap.get(course.code);
      
      if (existing) {
        // Update existing course
        if (existing.title !== course.title) {
          console.log(`  ✓ Updating ${course.code}: "${existing.title}" → "${course.title}"`);
          await conn.query(
            'UPDATE courses SET title = ?, displayOrder = ? WHERE code = ?',
            [course.title, course.order, course.code]
          );
        } else {
          console.log(`  ✓ ${course.code}: ${course.title} (no changes)`);
          await conn.query(
            'UPDATE courses SET displayOrder = ? WHERE code = ?',
            [course.order, course.code]
          );
        }
      } else {
        // Create new course
        console.log(`  ✓ Creating ${course.code}: ${course.title}`);
        await conn.query(
          'INSERT INTO courses (code, title, colorTheme, displayOrder, courseType) VALUES (?, ?, ?, ?, ?)',
          [course.code, course.title, 'blue', course.order, 'theological']
        );
      }
    }
    
    console.log('\n✅ Course catalog fixed successfully!');
    
    // Show final result
    const [finalCourses] = await conn.query(
      "SELECT code, title FROM courses WHERE courseType = 'theological' ORDER BY displayOrder"
    );
    console.log('\nFinal course list:');
    finalCourses.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.title}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (conn) await conn.release();
    await pool.end();
  }
}

fixCatalog();
