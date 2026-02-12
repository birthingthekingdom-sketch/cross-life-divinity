import mysql from 'mysql2/promise';

async function populateLearningPaths() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const connection = await mysql.createConnection(dbUrl);

  try {
    // Get all courses
    const [courses] = await connection.execute('SELECT id, title FROM courses ORDER BY id');
    console.log('\nAvailable courses:');
    courses.forEach(c => console.log(`  ${c.id}: ${c.title}`));

    // Get learning paths
    const [paths] = await connection.execute('SELECT id, name, level FROM learning_paths ORDER BY level');
    console.log('\nLearning paths:');
    paths.forEach(p => console.log(`  ${p.id}: ${p.name} (${p.level})`));

    // Clear existing associations
    await connection.execute('DELETE FROM path_courses');
    console.log('\nCleared existing learning path associations');

    // Define course mappings based on titles
    const pathMappings = {
      'beginner': [
        'Old Testament Survey',
        'New Testament Survey',
        'Biblical Hermeneutics',
        'Fundamentals of Apologetics',
        'Evangelism and Discipleship',
        'Discipleship Training'
      ],
      'intermediate': [
        'Christian Leadership',
        'The Fivefold Ministry',
        'Prayer and Intercession',
        'Church Administration'
      ],
      'advanced': [
        'Systematic Theology',
        'Old Testament Survey',
        'New Testament Survey',
        'Deliverance Ministry',
        'Understanding Prophecy',
        'Homiletics'
      ]
    };

    // Insert associations for each path
    for (const path of paths) {
      const courseNames = pathMappings[path.level];
      if (!courseNames) {
        console.log(`\nNo mapping found for ${path.level} path`);
        continue;
      }

      console.log(`\nAdding courses to ${path.name}:`);
      let orderIndex = 1;

      for (const courseName of courseNames) {
        const course = courses.find(c => c.title === courseName);
        if (course) {
          await connection.execute(
            'INSERT INTO path_courses (pathId, courseId, courseOrder, isRequired) VALUES (?, ?, ?, 1)',
            [path.id, course.id, orderIndex]
          );
          console.log(`  ✓ Added: ${course.title} (order ${orderIndex})`);
          orderIndex++;
        } else {
          console.log(`  ✗ Course not found: ${courseName}`);
        }
      }
    }

    // Verify results
    console.log('\n=== Verification ===');
    const [results] = await connection.execute(`
      SELECT lp.name as path_name, COUNT(pc.courseId) as course_count
      FROM learning_paths lp
      LEFT JOIN path_courses pc ON lp.id = pc.pathId
      GROUP BY lp.id, lp.name
      ORDER BY lp.level
    `);
    
    results.forEach(r => {
      console.log(`${r.path_name}: ${r.course_count} courses`);
    });

    console.log('\n✅ Learning path associations populated successfully!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

populateLearningPaths();
