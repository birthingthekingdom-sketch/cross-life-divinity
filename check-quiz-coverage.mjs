import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { bridgeAcademyCourses, bridgeAcademyPracticeQuestions, bridgeAcademyQuizQuestions } from './drizzle/schema.js';
import { eq, count } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

async function checkQuizCoverage() {
  const courses = await db.select().from(bridgeAcademyCourses).limit(50);
  
  console.log('Total courses:', courses.length);
  console.log('\n--- Course Quiz Coverage ---\n');
  
  let totalPracticeQuestions = 0;
  let totalQuizQuestions = 0;
  let coursesWithPractice = 0;
  let coursesWithQuiz = 0;
  
  for (const course of courses) {
    const practiceResult = await db.select({ count: count() }).from(bridgeAcademyPracticeQuestions).where(eq(bridgeAcademyPracticeQuestions.courseId, course.id));
    const quizResult = await db.select({ count: count() }).from(bridgeAcademyQuizQuestions).where(eq(bridgeAcademyQuizQuestions.courseId, course.id));
    
    const practiceCount = practiceResult[0]?.count || 0;
    const quizCount = quizResult[0]?.count || 0;
    
    if (practiceCount > 0) coursesWithPractice++;
    if (quizCount > 0) coursesWithQuiz++;
    
    totalPracticeQuestions += practiceCount;
    totalQuizQuestions += quizCount;
    
    console.log(`Course: ${course.title} (ID: ${course.id})`);
    console.log(`  - Practice Questions: ${practiceCount}`);
    console.log(`  - Quiz Questions: ${quizCount}`);
    console.log('');
  }
  
  console.log('\n--- SUMMARY ---');
  console.log(`Total Courses: ${courses.length}`);
  console.log(`Courses with Practice Questions: ${coursesWithPractice}`);
  console.log(`Courses with Quiz Questions: ${coursesWithQuiz}`);
  console.log(`Total Practice Questions: ${totalPracticeQuestions}`);
  console.log(`Total Quiz Questions: ${totalQuizQuestions}`);
}

checkQuizCoverage().catch(console.error);
