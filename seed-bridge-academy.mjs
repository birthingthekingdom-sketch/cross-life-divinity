import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'cross_life_divinity',
});

// Bridge Academy Courses
const courses = [
  {
    code: 'BA-RLA',
    title: 'Reasoning Through Language Arts (RLA)',
    description: 'Master reading comprehension, grammar, writing, and vocabulary for the GED test.',
    colorTheme: 'blue',
    totalLessons: 8,
    cpdHours: 40,
    displayOrder: 1,
  },
  {
    code: 'BA-MATH',
    title: 'Mathematical Reasoning',
    description: 'Learn algebra, geometry, data analysis, and problem-solving for the GED test.',
    colorTheme: 'purple',
    totalLessons: 8,
    cpdHours: 40,
    displayOrder: 2,
  },
  {
    code: 'BA-SCIENCE',
    title: 'Science',
    description: 'Explore life science, physical science, and earth science for the GED test.',
    colorTheme: 'green',
    totalLessons: 8,
    cpdHours: 40,
    displayOrder: 3,
  },
  {
    code: 'BA-SOCIAL-STUDIES',
    title: 'Social Studies',
    description: 'Study U.S. history, civics, economics, and geography for the GED test.',
    colorTheme: 'amber',
    totalLessons: 8,
    cpdHours: 40,
    displayOrder: 4,
  },
];

// Topics for each course
const topics = {
  'BA-RLA': [
    { title: 'Reading Comprehension Basics', order: 1, khanaPlaylist: 'reading-foundations' },
    { title: 'Identifying Main Ideas & Details', order: 2, khanaPlaylist: 'reading-main-idea' },
    { title: 'Inference & Context Clues', order: 3, khanaPlaylist: 'reading-inference' },
    { title: 'Grammar Fundamentals', order: 4, khanaPlaylist: 'grammar-parts-of-speech' },
    { title: 'Sentence Structure & Punctuation', order: 5, khanaPlaylist: 'grammar-sentence-structure' },
    { title: 'Writing & Editing', order: 6, khanaPlaylist: 'writing-essay' },
    { title: 'Vocabulary & Word Usage', order: 7, khanaPlaylist: 'vocabulary-academic' },
    { title: 'Extended Response Writing', order: 8, khanaPlaylist: 'writing-extended-response' },
  ],
  'BA-MATH': [
    { title: 'Number Operations & Sense', order: 1, khanaPlaylist: 'arithmetic-whole-numbers' },
    { title: 'Fractions, Decimals & Percentages', order: 2, khanaPlaylist: 'fractions-percentages' },
    { title: 'Ratios, Rates & Proportions', order: 3, khanaPlaylist: 'ratios-proportions' },
    { title: 'Algebra Foundations', order: 4, khanaPlaylist: 'algebra1-intro' },
    { title: 'Linear Equations & Graphing', order: 5, khanaPlaylist: 'algebra1-linear-equations' },
    { title: 'Geometry Basics', order: 6, khanaPlaylist: 'geometry-shapes' },
    { title: 'Data Analysis & Probability', order: 7, khanaPlaylist: 'statistics-probability' },
    { title: 'Word Problems & Applications', order: 8, khanaPlaylist: 'algebra1-word-problems' },
  ],
  'BA-SCIENCE': [
    { title: 'Life Science: Cells & Genetics', order: 1, khanaPlaylist: 'biology-cells' },
    { title: 'Life Science: Evolution & Ecology', order: 2, khanaPlaylist: 'biology-evolution' },
    { title: 'Physical Science: Energy & Motion', order: 3, khanaPlaylist: 'physics-energy' },
    { title: 'Physical Science: Waves & Sound', order: 4, khanaPlaylist: 'physics-waves' },
    { title: 'Chemistry Basics', order: 5, khanaPlaylist: 'chemistry-atoms' },
    { title: 'Earth & Space Science', order: 6, khanaPlaylist: 'earth-science' },
    { title: 'Scientific Method & Inquiry', order: 7, khanaPlaylist: 'science-method' },
    { title: 'Science Applications & Analysis', order: 8, khanaPlaylist: 'science-analysis' },
  ],
  'BA-SOCIAL-STUDIES': [
    { title: 'U.S. History: Foundations to 1865', order: 1, khanaPlaylist: 'us-history-colonial' },
    { title: 'U.S. History: 1865 to Present', order: 2, khanaPlaylist: 'us-history-modern' },
    { title: 'Civics & Government', order: 3, khanaPlaylist: 'civics-government' },
    { title: 'U.S. Constitution & Rights', order: 4, khanaPlaylist: 'civics-constitution' },
    { title: 'Economics Basics', order: 5, khanaPlaylist: 'economics-supply-demand' },
    { title: 'World Geography', order: 6, khanaPlaylist: 'geography-maps' },
    { title: 'Global History & Cultures', order: 7, khanaPlaylist: 'world-history' },
    { title: 'Social Studies Analysis & Interpretation', order: 8, khanaPlaylist: 'social-studies-analysis' },
  ],
};

try {
  console.log('🌱 Seeding Bridge Academy courses...');

  // Insert courses
  for (const course of courses) {
    const [result] = await connection.execute(
      'INSERT INTO courses (code, title, description, colorTheme, totalLessons, cpdHours, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [course.code, course.title, course.description, course.colorTheme, course.totalLessons, course.cpdHours, course.displayOrder]
    );
    
    const courseId = result.insertId;
    console.log(`✅ Created course: ${course.title} (ID: ${courseId})`);

    // Insert topics as lessons for this course
    const courseTopics = topics[course.code];
    if (courseTopics) {
      for (const topic of courseTopics) {
        const lessonContent = `
# ${topic.title}

## Khan Academy Videos
This topic covers the following Khan Academy content:
- Playlist: ${topic.khanaPlaylist}
- Watch all videos in this playlist to learn the concepts

## Key Concepts
- Understanding the fundamentals
- Practice problems
- Real-world applications

## Study Guide
Download the study guide PDF for this topic to review key concepts and practice problems.

## Quiz
After watching the Khan Academy videos, take the 10+ question quiz to test your understanding. You need 70% to pass.
        `.trim();

        const [lessonResult] = await connection.execute(
          'INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)',
          [courseId, topic.title, lessonContent, topic.order]
        );

        console.log(`  📝 Created topic: ${topic.title} (Lesson ID: ${lessonResult.insertId})`);
      }
    }
  }

  console.log('\n✅ Bridge Academy seeding complete!');
  console.log('📊 Created 4 GED subjects with 8 topics each (32 total topics)');
  
} catch (error) {
  console.error('❌ Error seeding Bridge Academy:', error);
  process.exit(1);
} finally {
  await connection.end();
}
