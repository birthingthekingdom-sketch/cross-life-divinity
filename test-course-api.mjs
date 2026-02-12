import { db } from './server/db.ts';

async function testCourseQuery() {
  try {
    console.log('Testing getCourseById for CHAP101 (ID: 240001)...');
    const course = await db.getCourseById(240001);
    console.log('Course data:', JSON.stringify(course, null, 2));
    
    if (!course) {
      console.error('❌ Course not found!');
    } else {
      console.log('✅ Course found successfully');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
  process.exit(0);
}

testCourseQuery();
