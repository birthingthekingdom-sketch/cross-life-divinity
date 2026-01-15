import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATABASE_URL
const dbUrl = process.env.DATABASE_URL || '';
const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/);
const [, user, password, host, database] = urlMatch || ['', 'root', '', 'localhost', 'test'];

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

async function removeDuplicateLessons() {
  const connection = await pool.getConnection();
  
  try {
    // Get all courses
    const [courses] = await connection.query('SELECT id, code, title FROM courses ORDER BY id');
    
    console.log(`Processing ${courses.length} courses to remove duplicates...\n`);
    
    let totalRemoved = 0;
    
    for (const course of courses) {
      // Get lesson count
      const [countResult] = await connection.query(
        'SELECT COUNT(*) as count FROM lessons WHERE courseId = ?',
        [course.id]
      );
      
      const lessonCount = countResult[0].count;
      const targetLessons = course.code === 'DIV111' ? 8 : 10;
      
      if (lessonCount > targetLessons) {
        const excessCount = lessonCount - targetLessons;
        console.log(`${course.code}: Removing ${excessCount} duplicate lessons (${lessonCount} → ${targetLessons})`);
        
        // Get IDs of lessons to keep (first N lessons ordered by lessonOrder)
        const [keepIds] = await connection.query(
          `SELECT id FROM lessons WHERE courseId = ? ORDER BY lessonOrder LIMIT ?`,
          [course.id, targetLessons]
        );
        
        const keepIdList = keepIds.map(r => r.id);
        
        // Delete all other lessons
        if (keepIdList.length > 0) {
          const placeholders = keepIdList.map(() => '?').join(',');
          await connection.query(
            `DELETE FROM lessons WHERE courseId = ? AND id NOT IN (${placeholders})`,
            [course.id, ...keepIdList]
          );
          
          totalRemoved += excessCount;
          console.log(`  ✓ Removed ${excessCount} duplicates\n`);
        }
      }
    }
    
    console.log(`\n✅ Total duplicate lessons removed: ${totalRemoved}`);
    
    // Verify final state
    const [finalCheck] = await connection.query(
      `SELECT c.code, COUNT(l.id) as lesson_count FROM courses c LEFT JOIN lessons l ON c.id = l.courseId GROUP BY c.id, c.code ORDER BY c.id`
    );
    
    console.log('\nFinal lesson counts by course:');
    for (const row of finalCheck) {
      console.log(`  ${row.code}: ${row.lesson_count} lessons`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

removeDuplicateLessons();
