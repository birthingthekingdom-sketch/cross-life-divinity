import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get Chaplaincy course
const [courses] = await connection.execute(
  'SELECT id, code, title FROM courses WHERE code = ?',
  ['CHAP101']
);

if (courses.length === 0) {
  console.log('Chaplaincy course not found');
  process.exit(1);
}

const courseId = courses[0].id;
console.log(`\n✅ Chaplaincy Course Found:`);
console.log(`   ID: ${courseId}`);
console.log(`   Code: ${courses[0].code}`);
console.log(`   Title: ${courses[0].title}`);

// Get all lessons
const [lessons] = await connection.execute(
  'SELECT id, title, content FROM lessons WHERE courseId = ? ORDER BY lessonOrder',
  [courseId]
);

console.log(`\n📚 Total Lessons: ${lessons.length}`);
console.log('\n' + '='.repeat(80));

lessons.forEach((lesson, index) => {
  console.log(`\n📖 Lesson ${index + 1}: ${lesson.title}`);
  console.log(`   ID: ${lesson.id}`);
  
  // Show first 200 chars of content
  const preview = lesson.content.substring(0, 200).replace(/\n/g, ' ');
  console.log(`   Content Preview: ${preview}...`);
  
  // Check for key topics
  const content = lesson.content.toLowerCase();
  const topics = {
    'CISM': content.includes('cism') || content.includes('critical incident stress'),
    'Spiritual First Aid': content.includes('spiritual first aid') || content.includes('first aid'),
    'Pastoral Care': content.includes('pastoral care') || content.includes('counseling'),
    'Ethics': content.includes('ethics') || content.includes('confidentiality'),
    'Cultural Competency': content.includes('cultural') || content.includes('interfaith'),
    'Self-Care': content.includes('self-care') || content.includes('resilience'),
  };
  
  const found = Object.entries(topics).filter(([_, v]) => v).map(([k]) => k);
  if (found.length > 0) {
    console.log(`   ✓ Topics: ${found.join(', ')}`);
  }
});

await connection.end();
