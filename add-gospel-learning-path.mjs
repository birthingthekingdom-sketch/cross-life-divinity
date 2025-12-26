import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'gateway02.us-east-1.prod.aws.tidbcloud.com',
  user: '2KiCrCqNDFcXt7P.root',
  password: 'hy6Rom0b4sguNDH91dE5',
  database: 'P2Dpw9MQsmxzdUQCfGjV6b',
  ssl: {
    rejectUnauthorized: true
  }
});

console.log('✅ Connected to database');

// Step 1: Get the course IDs for the Gospel path
const [courses] = await connection.execute(`
  SELECT id, code, title FROM courses 
  WHERE code IN ('BIB101', 'BIB102', 'BIB103')
  ORDER BY code
`);

console.log('\n📚 Courses found for Gospel Path:');
courses.forEach(course => {
  console.log(`  - ${course.code}: ${course.title} (ID: ${course.id})`);
});

if (courses.length < 2) {
  console.log('\n⚠️  Need at least 2 courses for a learning path');
  const [allCourses] = await connection.execute(`
    SELECT id, code, title FROM courses ORDER BY code LIMIT 20
  `);
  console.log('\nAvailable courses:');
  allCourses.forEach(c => {
    console.log(`  - ${c.code}: ${c.title}`);
  });
  await connection.end();
  process.exit(1);
}

// Step 2: Create the Gospel Studies learning path
const gospelPathData = {
  title: 'Gospel Studies Intensive',
  description: `Master the Four Gospels and their theological significance. This comprehensive learning path combines Old Testament foundations with intensive New Testament Gospel study, equipping you with deep biblical knowledge and practical ministry insights.

**What You'll Learn:**
- The four Gospel accounts (Matthew, Mark, Luke, John) and their unique perspectives
- Jesus' life, teachings, death, and resurrection
- Historical and cultural context of first-century Judea
- Greek word studies and exegetical analysis
- Old Testament prophecies fulfilled in the Gospels
- Practical applications for ministry and personal faith

**Course Sequence:**
1. **Biblical Hermeneutics** - Learn how to study Scripture effectively
2. **Old Testament Survey** - Understand Gospel connections and messianic prophecies
3. **New Testament Survey** - Comprehensive Gospel study with Greek analysis

**Ideal For:**
- Pastors and ministry leaders
- Chaplains and spiritual care providers
- Theology students
- Anyone seeking deeper Gospel understanding

**Completion Time:** 4-6 months
**Total CLAC Hours:** 120 hours
**Difficulty Level:** Intermediate to Advanced`,
  displayOrder: 1,
  colorTheme: 'gold'
};

// Insert the learning path
const [result] = await connection.execute(
  'INSERT INTO learning_paths (title, description, displayOrder, colorTheme) VALUES (?, ?, ?, ?)',
  [gospelPathData.title, gospelPathData.description, gospelPathData.displayOrder, gospelPathData.colorTheme]
);

const pathId = result.insertId;
console.log(`\n✅ Created Gospel Studies learning path (ID: ${pathId})`);

// Step 3: Link courses to the learning path in correct order
const courseOrder = [
  { courseId: courses.find(c => c.code === 'BIB103')?.id, order: 1, required: true },  // Hermeneutics
  { courseId: courses.find(c => c.code === 'BIB101')?.id, order: 2, required: true },  // OT Survey
  { courseId: courses.find(c => c.code === 'BIB102')?.id, order: 3, required: true }   // NT Survey
];

for (const course of courseOrder) {
  if (course.courseId) {
    await connection.execute(
      'INSERT INTO learning_path_courses (pathId, courseId, courseOrder, isRequired) VALUES (?, ?, ?, ?)',
      [pathId, course.courseId, course.order, course.required ? 1 : 0]
    );
    console.log(`  ✅ Added course order ${course.order} to path`);
  }
}

// Step 4: Get the updated path with courses
const [pathDetails] = await connection.execute(`
  SELECT lpc.courseOrder, c.code, c.title, c.cpdHours
  FROM learning_path_courses lpc
  JOIN courses c ON lpc.courseId = c.id
  WHERE lpc.pathId = ?
  ORDER BY lpc.courseOrder
`, [pathId]);

console.log(`\n📖 Gospel Studies Learning Path Structure:`);
pathDetails.forEach(course => {
  console.log(`  ${course.courseOrder}. ${course.code} - ${course.title} (${course.cpdHours} hours)`);
});

const totalHours = pathDetails.reduce((sum, c) => sum + c.cpdHours, 0);
console.log(`\n✅ Total CLAC Hours: ${totalHours}`);

console.log('\n🎯 Gospel Studies Learning Path Successfully Created!');
console.log('\nPath Details:');
console.log('- Title: Gospel Studies Intensive');
console.log('- Duration: 4-6 months');
console.log('- Level: Intermediate to Advanced');
console.log('- Total Hours: 120 CLAC hours');
console.log('- Courses: 3 (Hermeneutics → OT Survey → NT Survey)');

await connection.end();
