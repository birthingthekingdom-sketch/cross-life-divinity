import { db } from './server/db.ts';
import { courses, lessons } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const gedCourses = await db.query.courses.findMany({
  where: eq(courses.courseType, 'ged'),
  with: {
    lessons: true
  }
});

console.log('Bridge Academy GED Courses:\n');
for (const course of gedCourses) {
  console.log(`${course.code}: ${course.title}`);
  console.log(`  Description: ${course.description || 'N/A'}`);
  console.log(`  Lessons: ${course.lessons.length}`);
  console.log(`  Price: $${(course.price / 100).toFixed(2)}`);
  console.log('');
}
