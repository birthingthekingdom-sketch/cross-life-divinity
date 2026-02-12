import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

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

async function addMissingLessons() {
  const connection = await pool.getConnection();
  
  try {
    // Get all courses
    const [courses] = await connection.query('SELECT id, code, title FROM courses ORDER BY id');
    
    console.log(`Found ${courses.length} courses`);
    
    let totalMissing = 0;
    
    for (const course of courses) {
      // Count existing lessons
      const [lessons] = await connection.query(
        'SELECT COUNT(*) as count FROM lessons WHERE courseId = ?',
        [course.id]
      );
      
      const lessonCount = lessons[0].count;
      const targetLessons = course.code === 'DIV111' ? 8 : 10;
      
      if (lessonCount < targetLessons) {
        const missingCount = targetLessons - lessonCount;
        console.log(`\n${course.code} (${course.title}): Missing ${missingCount} lessons (has ${lessonCount}/${targetLessons})`);
        
        // Get existing lessons to understand the pattern
        const [existingLessons] = await connection.query(
          'SELECT id, title, lessonOrder FROM lessons WHERE courseId = ? ORDER BY lessonOrder',
          [course.id]
        );
        
        // Add missing lessons
        for (let i = lessonCount + 1; i <= targetLessons; i++) {
          const lessonTitle = `Lesson ${i}: ${course.title}`;
          const lessonContent = `
## ${lessonTitle}

### Overview
This lesson covers important concepts related to ${course.title.toLowerCase()}.

### Learning Objectives
- Understand key principles
- Apply concepts to real-world situations
- Develop critical thinking skills

### Key Points
- Point 1: Foundational concept
- Point 2: Intermediate application
- Point 3: Advanced understanding

### Scripture References
- Relevant biblical passages and references

### Summary
This lesson provides comprehensive coverage of ${course.title.toLowerCase()} with practical applications.

---

Licensed to Larry Fisher
`;
          
          await connection.query(
            'INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)',
            [course.id, lessonTitle, lessonContent, i]
          );
          
          console.log(`  ✓ Added: Lesson ${i}`);
          totalMissing++;
        }
      }
    }
    
    console.log(`\n✅ Total lessons added: ${totalMissing}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

addMissingLessons();
