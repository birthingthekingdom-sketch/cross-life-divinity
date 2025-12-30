import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('//')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'clsd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const bridgeAcademyCourses = [
  {
    code: 'GED-RLA',
    title: 'Reasoning Through Language Arts',
    description: 'Master reading comprehension, grammar, writing, and vocabulary for the GED test. This course covers all essential language arts skills needed for GED success.',
    colorTheme: 'blue',
    totalLessons: 8,
    cpdHours: 0,
    displayOrder: 1,
  },
  {
    code: 'GED-MATH',
    title: 'Mathematical Reasoning',
    description: 'Learn algebra, geometry, data analysis, and problem-solving for the GED test. Master all mathematical concepts required for GED success.',
    colorTheme: 'purple',
    totalLessons: 8,
    cpdHours: 0,
    displayOrder: 2,
  },
  {
    code: 'GED-SCI',
    title: 'Science',
    description: 'Explore life science, physical science, and earth science for the GED test. Understand biological, physical, and earth science concepts.',
    colorTheme: 'green',
    totalLessons: 8,
    cpdHours: 0,
    displayOrder: 3,
  },
  {
    code: 'GED-SS',
    title: 'Social Studies',
    description: 'Study U.S. history, civics, economics, and geography for the GED test. Master all social studies content for GED success.',
    colorTheme: 'amber',
    totalLessons: 8,
    cpdHours: 0,
    displayOrder: 4,
  },
];

const bridgeAcademyTopics = {
  'GED-RLA': [
    { title: 'Reading Comprehension', order: 1 },
    { title: 'Grammar & Punctuation', order: 2 },
    { title: 'Writing Skills', order: 3 },
    { title: 'Vocabulary', order: 4 },
    { title: 'Main Ideas & Details', order: 5 },
    { title: 'Inference & Analysis', order: 6 },
    { title: 'Editing & Revision', order: 7 },
    { title: 'Essay Writing', order: 8 },
  ],
  'GED-MATH': [
    { title: 'Algebra Basics', order: 1 },
    { title: 'Geometry', order: 2 },
    { title: 'Data Analysis', order: 3 },
    { title: 'Word Problems', order: 4 },
    { title: 'Equations & Inequalities', order: 5 },
    { title: 'Functions', order: 6 },
    { title: 'Statistics & Probability', order: 7 },
    { title: 'Number Sense', order: 8 },
  ],
  'GED-SCI': [
    { title: 'Biology & Genetics', order: 1 },
    { title: 'Physics & Chemistry', order: 2 },
    { title: 'Earth Science', order: 3 },
    { title: 'Scientific Method', order: 4 },
    { title: 'Energy & Motion', order: 5 },
    { title: 'Ecosystems', order: 6 },
    { title: 'Human Body', order: 7 },
    { title: 'Space & Universe', order: 8 },
  ],
  'GED-SS': [
    { title: 'U.S. History', order: 1 },
    { title: 'Civics & Government', order: 2 },
    { title: 'Economics', order: 3 },
    { title: 'Geography', order: 4 },
    { title: 'Founding Documents', order: 5 },
    { title: 'World History', order: 6 },
    { title: 'Social Movements', order: 7 },
    { title: 'Citizenship', order: 8 },
  ],
};

async function seedBridgeAcademy() {
  const connection = await pool.getConnection();

  try {
    console.log('🎓 Seeding Bridge Academy courses...');

    // Insert courses
    for (const course of bridgeAcademyCourses) {
      const [existing] = await connection.query(
        'SELECT id FROM courses WHERE code = ?',
        [course.code]
      );

      if (existing.length === 0) {
        const [result] = await connection.query(
          'INSERT INTO courses (code, title, description, colorTheme, totalLessons, cpdHours, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [course.code, course.title, course.description, course.colorTheme, course.totalLessons, course.cpdHours, course.displayOrder]
        );
        console.log(`✅ Created course: ${course.title} (ID: ${result.insertId})`);

        // Insert lessons (topics) for this course
        const courseId = result.insertId;
        const topics = bridgeAcademyTopics[course.code] || [];

        for (const topic of topics) {
          const lessonContent = `
# ${topic.title}

## Overview
This lesson covers the essential concepts of ${topic.title.toLowerCase()} for GED preparation.

## Learning Objectives
- Understand key concepts of ${topic.title.toLowerCase()}
- Apply knowledge to GED practice questions
- Master essential skills for test success

## Key Concepts
- Core principles and definitions
- Important formulas and rules
- Common problem types

## Practice
Complete the quiz questions to test your understanding. You must score 70% or higher to pass.

## Resources
- Khan Academy videos (linked in quiz section)
- Study guides and worksheets
- Additional practice problems
          `.trim();

          await connection.query(
            'INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)',
            [courseId, topic.title, lessonContent, topic.order]
          );
        }
      } else {
        console.log(`⏭️  Course already exists: ${course.title}`);
      }
    }

    console.log('✅ Bridge Academy courses seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding Bridge Academy:', error);
    throw error;
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedBridgeAcademy().catch(console.error);
