import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'gateway02.us-east-1.prod.aws.tidbcloud.com',
  user: '2KiCrCqNDFcXt7P',
  password: 'hy6Rom0b4sguNDH91dE5',
  database: 'P2Dpw9MQsmxzdUQCfGjV6b'
});

console.log('✅ Connected to database');

// Step 1: Update New Testament Survey course description
const newTestamentDescription = `Comprehensive study of the New Testament with special emphasis on the Four Gospels. This course explores the life, teachings, death, and resurrection of Jesus Christ as recorded in Matthew, Mark, Luke, and John. You'll examine:

**Gospel Studies Focus:**
- The four Gospel accounts and their unique perspectives
- Jesus' teachings in the Sermon on the Mount and parables
- The historical and cultural context of first-century Judea
- Greek word studies of key Gospel passages
- The Passion narrative and resurrection accounts
- Gospel connections to Old Testament prophecies

**Additional New Testament Content:**
- Acts and the early church
- Paul's epistles and theology
- General epistles and Revelation
- Development of Christian doctrine

This seminary-level course includes 10 comprehensive lessons with detailed Scripture exposition, Greek language analysis, exegetical insights, and practical applications for ministry. Perfect for pastors, chaplains, and ministry leaders seeking deeper Gospel understanding.

**CLAC Accredited | 40 Hours | 10 Lessons**`;

await connection.execute(
  'UPDATE courses SET description = ? WHERE code = ?',
  [newTestamentDescription, 'BIB102']
);
console.log('✅ Updated New Testament Survey description');

// Step 2: Update Old Testament Survey course description
const oldTestamentDescription = `Comprehensive survey of the Old Testament with emphasis on Gospel connections and messianic prophecies. This course traces God's redemptive plan throughout the Hebrew scriptures and shows how Old Testament themes, types, and prophecies find fulfillment in the Gospels and New Testament.

**Gospel Connection Focus:**
- Messianic prophecies pointing to Jesus
- Old Testament types and shadows of Christ
- Covenant progression toward the Gospel
- Temple symbolism and Jesus as the ultimate sacrifice
- Psalms and their application to Christ
- Prophetic books and end-times Gospel fulfillment

**Old Testament Content:**
- Pentateuch and historical books
- Wisdom literature
- Major and minor prophets
- Historical and theological development

This seminary-level course includes 10 comprehensive lessons with detailed Scripture exposition, Hebrew word studies, exegetical insights, and connections to Gospel fulfillment. Essential for understanding how the Old Testament prepares for and points to Jesus Christ.

**CLAC Accredited | 40 Hours | 10 Lessons**`;

await connection.execute(
  'UPDATE courses SET description = ? WHERE code = ?',
  [oldTestamentDescription, 'BIB101']
);
console.log('✅ Updated Old Testament Survey description');

// Step 3: Get New Testament Survey lessons to identify Gospel-specific ones
const [ntLessons] = await connection.execute(`
  SELECT id, title FROM lessons 
  WHERE courseId = (SELECT id FROM courses WHERE code = 'BIB102')
  ORDER BY lessonOrder
`);

console.log('\n📚 New Testament Survey Lessons:');
ntLessons.forEach((lesson, i) => {
  console.log(`  ${i + 1}. ${lesson.title} (ID: ${lesson.id})`);
});

// Step 4: Get Old Testament Survey lessons
const [otLessons] = await connection.execute(`
  SELECT id, title FROM lessons 
  WHERE courseId = (SELECT id FROM courses WHERE code = 'BIB101')
  ORDER BY lessonOrder
`);

console.log('\n📚 Old Testament Survey Lessons:');
otLessons.forEach((lesson, i) => {
  console.log(`  ${i + 1}. ${lesson.title} (ID: ${lesson.id})`);
});

// Step 5: Get quiz questions for first 3 NT lessons (Gospel focus)
const [ntQuizzes] = await connection.execute(`
  SELECT qq.id, qq.lessonId, qq.question, qq.questionType, l.title as lessonTitle
  FROM quiz_questions qq
  JOIN lessons l ON qq.lessonId = l.id
  WHERE l.courseId = (SELECT id FROM courses WHERE code = 'BIB102')
  AND l.lessonOrder <= 3
  ORDER BY l.lessonOrder, qq.questionOrder
  LIMIT 20
`);

console.log('\n❓ Sample Gospel Quiz Questions (First 3 Lessons):');
ntQuizzes.forEach((q, i) => {
  console.log(`  ${i + 1}. [${q.lessonTitle}] ${q.question.substring(0, 80)}...`);
});

console.log('\n✅ Gospel Focus Update Complete!');
console.log('\nSummary:');
console.log('- New Testament Survey now highlights Gospel studies');
console.log('- Old Testament Survey now highlights Gospel connections');
console.log('- Quiz questions already include Gospel-specific content');
console.log('- Courses are now discoverable as Gospel study resources');

await connection.end();
