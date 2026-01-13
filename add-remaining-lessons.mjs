import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const courseLessonsToAdd = {
  'DIV111': {
    title: 'Capstone Project',
    lessons: [
      { title: 'Introduction to the Capstone Project', content: '# Introduction to the Capstone Project\n\nThe Capstone Project is the culminating experience of your theological education.' },
      { title: 'Selecting Your Capstone Topic', content: '# Selecting Your Capstone Topic\n\nChoosing the right topic is crucial for a successful capstone project.' },
      { title: 'Research Methods and Resources', content: '# Research Methods and Resources\n\nEffective research is foundational to a quality capstone project.' },
      { title: 'Project Planning and Timeline', content: '# Project Planning and Timeline\n\nSuccessful projects require careful planning and management.' },
      { title: 'Writing and Documentation', content: '# Writing and Documentation\n\nClear, well-organized documentation is essential.' },
      { title: 'Integrating Theology and Practice', content: '# Integrating Theology and Practice\n\nThe capstone should demonstrate integration of theological learning and practical ministry.' },
      { title: 'Collaboration and Feedback', content: '# Collaboration and Feedback\n\nWorking with advisors and peers strengthens your project.' },
      { title: 'Presenting Your Capstone', content: '# Presenting Your Capstone\n\nEffective presentation is the final step in your capstone journey.' }
    ]
  },
  'DIV112': {
    title: 'Christology',
    lessons: [
      { title: 'Introduction to Christology', content: '# Introduction to Christology\n\nChristology is the study of the person and work of Jesus Christ.' },
      { title: 'The Incarnation', content: '# The Incarnation\n\nThe incarnation—God becoming human in Jesus Christ—is the central mystery of Christianity.' },
      { title: 'The Life and Ministry of Jesus', content: '# The Life and Ministry of Jesus\n\nUnderstanding Jesus\' earthly life and ministry is essential to Christology.' },
      { title: 'The Death and Resurrection of Christ', content: '# The Death and Resurrection of Christ\n\nThe crucifixion and resurrection are the climax of Jesus\' earthly ministry.' },
      { title: 'The Ascension and Exaltation', content: '# The Ascension and Exaltation\n\nAfter His resurrection, Jesus ascended to heaven and was exalted.' },
      { title: 'Jesus as Prophet, Priest, and King', content: '# Jesus as Prophet, Priest, and King\n\nJesus fulfills three offices in His person and work.' },
      { title: 'Christological Heresies and Orthodoxy', content: '# Christological Heresies and Orthodoxy\n\nThe church has had to defend correct understanding of Christ against various heresies.' },
      { title: 'The Second Coming of Christ', content: '# The Second Coming of Christ\n\nChristology includes Jesus\' future return and final judgment.' },
      { title: 'Christology and Soteriology', content: '# Christology and Soteriology\n\nChristology is intimately connected to soteriology (the doctrine of salvation).' },
      { title: 'Living Christology', content: '# Living Christology\n\nChristology is not merely academic but transformative.' }
    ]
  },
  'DIV113': {
    title: 'Contemporary Theological Issues',
    lessons: [
      { title: 'Introduction to Contemporary Theology', content: '# Introduction to Contemporary Theology\n\nContemporary theology addresses current challenges and questions facing the church.' },
      { title: 'Science and Faith', content: '# Science and Faith\n\nThe relationship between scientific discovery and Christian faith is a major contemporary issue.' },
      { title: 'Religious Pluralism', content: '# Religious Pluralism\n\nHow should Christians understand and relate to other religions?' },
      { title: 'Gender and Sexuality', content: '# Gender and Sexuality\n\nContemporary culture raises new questions about gender and sexuality.' },
      { title: 'Social Justice and the Gospel', content: '# Social Justice and the Gospel\n\nHow does the gospel address issues of injustice and inequality?' },
      { title: 'Secularism and Post-Christendom', content: '# Secularism and Post-Christendom\n\nChristianity in the West faces a new context of secularism.' },
      { title: 'Mental Health and Spirituality', content: '# Mental Health and Spirituality\n\nHow do mental health and spiritual health relate?' },
      { title: 'Political Theology', content: '# Political Theology\n\nHow should Christians engage with politics and government?' },
      { title: 'Prosperity Gospel and Suffering', content: '# Prosperity Gospel and Suffering\n\nHow do we understand suffering in light of God\'s goodness?' },
      { title: 'Conclusion: Doing Theology Today', content: '# Conclusion: Doing Theology Today\n\nHow do we do faithful theology in our contemporary context?' }
    ]
  }
};

async function addLessons() {
  try {
    console.log('Starting lesson addition for remaining courses...\n');
    
    for (const [courseCode, courseData] of Object.entries(courseLessonsToAdd)) {
      console.log(`Processing ${courseCode}: ${courseData.title}`);
      
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
      
      for (const lesson of courseData.lessons) {
        await connection.query(
          'INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)',
          [courseId, lesson.title, lesson.content, lessonOrder]
        );
        console.log(`  ✓ Added lesson ${lessonOrder}: ${lesson.title}`);
        lessonOrder++;
      }
      
      await connection.query(
        'UPDATE courses SET totalLessons = ? WHERE id = ?',
        [courseData.lessons.length, courseId]
      );
      
      console.log(`  ✅ Updated ${courseCode} with ${courseData.lessons.length} lessons\n`);
    }
    
    console.log('✅ All remaining lessons added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

addLessons();
