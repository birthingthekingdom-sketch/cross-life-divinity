import { drizzle } from 'drizzle-orm/mysql2';
import { courses, lessons } from './drizzle/schema.ts';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Course lesson data to restore
const courseLessonsToAdd = {
  'DIV102': {
    title: 'Deliverance Ministry',
    lessons: [
      { title: 'Introduction to Deliverance Ministry', content: '# Introduction to Deliverance Ministry\n\nDeliverance ministry addresses the reality of spiritual bondage that can affect believers and non-believers alike.' },
      { title: 'Spiritual Authority and Power', content: '# Spiritual Authority and Power\n\nBelievers have been given authority over demonic forces through Christ.' },
      { title: 'Identifying Spiritual Bondage', content: '# Identifying Spiritual Bondage\n\nUnderstanding how to recognize signs of spiritual bondage is essential for effective ministry.' },
      { title: 'Prayer and Intercession in Deliverance', content: '# Prayer and Intercession in Deliverance\n\nPrayer is the primary tool for deliverance ministry.' },
      { title: 'Working with Others in Deliverance', content: '# Working with Others in Deliverance\n\nDeliverance ministry often involves helping others find freedom.' },
      { title: 'Maintaining Freedom After Deliverance', content: '# Maintaining Freedom After Deliverance\n\nFreedom from bondage requires ongoing spiritual discipline and growth.' },
      { title: 'Deliverance and Healing', content: '# Deliverance and Healing\n\nDeliverance and healing often go together.' },
      { title: 'Case Studies and Practical Scenarios', content: '# Case Studies and Practical Scenarios\n\nExamining real-world examples of deliverance ministry.' },
      { title: 'Deliverance Ministry Ethics', content: '# Deliverance Ministry Ethics\n\nEthical considerations are crucial in deliverance ministry.' },
      { title: 'Advanced Deliverance Techniques', content: '# Advanced Deliverance Techniques\n\nFor those with more experience in deliverance ministry.' }
    ]
  },
  'LED202': {
    title: 'Christian Leadership',
    lessons: [
      { title: 'Biblical Foundations of Leadership', content: '# Biblical Foundations of Leadership\n\nChristian leadership is rooted in biblical principles and the example of Jesus Christ.' },
      { title: 'Developing Your Leadership Vision', content: '# Developing Your Leadership Vision\n\nEffective leaders have a clear vision for where they\'re leading.' },
      { title: 'Building and Leading Teams', content: '# Building and Leading Teams\n\nNo leader succeeds alone. This lesson covers team building and leadership.' },
      { title: 'Emotional Intelligence in Leadership', content: '# Emotional Intelligence in Leadership\n\nEmotional intelligence is crucial for effective leadership.' },
      { title: 'Decision-Making and Problem-Solving', content: '# Decision-Making and Problem-Solving\n\nLeaders must make wise decisions and solve complex problems.' },
      { title: 'Managing Change and Conflict', content: '# Managing Change and Conflict\n\nChange is inevitable, and conflict often accompanies it.' },
      { title: 'Developing Leaders', content: '# Developing Leaders\n\nOne of the most important tasks of a leader is developing other leaders.' },
      { title: 'Integrity and Ethical Leadership', content: '# Integrity and Ethical Leadership\n\nIntegrity is the foundation of trust in leadership.' },
      { title: 'Strategic Planning and Implementation', content: '# Strategic Planning and Implementation\n\nEffective leaders think strategically and execute plans effectively.' },
      { title: 'Leadership in Crisis', content: '# Leadership in Crisis\n\nCrisis reveals and tests leadership character.' }
    ]
  }
};

async function restoreLessons() {
  try {
    console.log('Starting lesson restoration...\n');
    
    for (const [courseCode, courseData] of Object.entries(courseLessonsToAdd)) {
      console.log(`Processing ${courseCode}: ${courseData.title}`);
      
      // Get the course
      const [course] = await connection.query(
        'SELECT id FROM courses WHERE code = ?',
        [courseCode]
      );
      
      if (!course || course.length === 0) {
        console.log(`  ❌ Course ${courseCode} not found`);
        continue;
      }
      
      const courseId = course[0].id;
      let lessonOrder = 1;
      
      // Add lessons
      for (const lesson of courseData.lessons) {
        await connection.query(
          'INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)',
          [courseId, lesson.title, lesson.content, lessonOrder]
        );
        console.log(`  ✓ Added lesson ${lessonOrder}: ${lesson.title}`);
        lessonOrder++;
      }
      
      // Update course totalLessons
      await connection.query(
        'UPDATE courses SET totalLessons = ? WHERE id = ?',
        [courseData.lessons.length, courseId]
      );
      
      console.log(`  ✅ Updated ${courseCode} with ${courseData.lessons.length} lessons\n`);
    }
    
    console.log('✅ All lessons restored successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

restoreLessons();
