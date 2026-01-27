import * as db from './db';
import { sql } from 'drizzle-orm';
import * as prerequisites from './prerequisites';

interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  reason: string;
  priority: number;
  colorTheme: string;
}

/**
 * Generate personalized course recommendations for a user
 */
export async function getCourseRecommendations(userId: number): Promise<RecommendedCourse[]> {
  const dbConn = await db.getDb();
  if (!dbConn) {
    throw new Error('Database not available');
  }

  const recommendations: RecommendedCourse[] = [];

  // Get user's enrolled courses
  const enrolledCourses = await db.getEnrolledCourses(userId);
  const enrolledCourseIds = enrolledCourses.map(c => c.id);

  // Get all courses
  const allCourses = await db.getAllCourses();

  // Get user's enrolled learning paths
  const enrolledPathsResult: any = await dbConn.execute(
    sql`SELECT learningPathId FROM learning_path_enrollments 
        WHERE userId = ${userId} AND isActive = true`
  );
  const enrolledPaths = Array.isArray(enrolledPathsResult) 
    ? enrolledPathsResult 
    : enrolledPathsResult.rows || [];

  // Calculate completed courses
  const completedCourseIds: number[] = [];
  for (const course of enrolledCourses) {
    const courseProgress = await db.getUserProgress(userId, course.id);
    const completed = courseProgress.filter((p: any) => p.completed);
    if (courseProgress.length === course.totalLessons && course.totalLessons > 0) {
      completedCourseIds.push(course.id);
    }
  }

  // 1. Recommend next course in enrolled learning paths (highest priority)
  for (const pathEnrollment of enrolledPaths) {
    // Skip if learningPathId is undefined
    if (!pathEnrollment.learningPathId) continue;
    
    const pathCoursesResult: any = await dbConn.execute(
      sql`SELECT c.*, lpc.orderIndex
          FROM learning_path_courses lpc
          JOIN courses c ON lpc.courseId = c.id
          WHERE lpc.pathId = ${pathEnrollment.learningPathId}
          ORDER BY lpc.orderIndex`
    );
    const pathCourses = Array.isArray(pathCoursesResult) 
      ? pathCoursesResult 
      : pathCoursesResult.rows || [];

    // Find first incomplete course in path
    for (const course of pathCourses) {
      if (!enrolledCourseIds.includes(course.id)) {
        // Check prerequisites
        const prereqCheck = await prerequisites.checkPrerequisites(userId, course.id);
        if (prereqCheck.canEnroll) {
          recommendations.push({
            id: course.id,
            title: course.title,
            description: course.description || '',
            reason: 'Next in your enrolled learning path',
            priority: 10,
            colorTheme: course.colorTheme || '#3b82f6',
          });
          break; // Only recommend one per path
        }
      }
    }
  }

  // 2. Recommend courses that unlock after completing prerequisites (medium priority)
  for (const completedId of completedCourseIds) {
    const dependentCoursesResult: any = await dbConn.execute(
      sql`SELECT c.* FROM course_prerequisites cp
          JOIN courses c ON cp.courseId = c.id
          WHERE cp.prerequisiteCourseId = ${completedId}`
    );
    const dependentCourses = Array.isArray(dependentCoursesResult) 
      ? dependentCoursesResult 
      : dependentCoursesResult.rows || [];

    for (const course of dependentCourses) {
      if (!enrolledCourseIds.includes(course.id)) {
        const prereqCheck = await prerequisites.checkPrerequisites(userId, course.id);
        if (prereqCheck.canEnroll) {
          recommendations.push({
            id: course.id,
            title: course.title,
            description: course.description || '',
            reason: `Unlocked after completing your recent course`,
            priority: 7,
            colorTheme: course.colorTheme || '#3b82f6',
          });
        }
      }
    }
  }

  // 3. Recommend popular courses (low priority)
  const popularCoursesResult: any = await dbConn.execute(
    sql`SELECT c.*, COUNT(ce.id) as enrollment_count
        FROM courses c
        LEFT JOIN course_enrollments ce ON c.id = ce.courseId
        GROUP BY c.id
        ORDER BY enrollment_count DESC
        LIMIT 5`
  );
  const popularCourses = Array.isArray(popularCoursesResult) 
    ? popularCoursesResult 
    : popularCoursesResult.rows || [];

  for (const course of popularCourses) {
    if (!enrolledCourseIds.includes(course.id)) {
      const prereqCheck = await prerequisites.checkPrerequisites(userId, course.id);
      if (prereqCheck.canEnroll) {
        recommendations.push({
          id: course.id,
          title: course.title,
          description: course.description || '',
          reason: 'Popular among students',
          priority: 3,
          colorTheme: course.colorTheme || '#3b82f6',
        });
      }
    }
  }

  // 4. Recommend beginner courses if user has few enrollments (low priority)
  if (enrolledCourses.length < 3) {
    const beginnerCoursesResult: any = await dbConn.execute(
      sql`SELECT c.* FROM courses c
          LEFT JOIN course_prerequisites cp ON c.id = cp.courseId
          WHERE cp.id IS NULL
          LIMIT 3`
    );
    const beginnerCourses = Array.isArray(beginnerCoursesResult) 
      ? beginnerCoursesResult 
      : beginnerCoursesResult.rows || [];

    for (const course of beginnerCourses) {
      if (!enrolledCourseIds.includes(course.id)) {
        recommendations.push({
          id: course.id,
          title: course.title,
          description: course.description || '',
          reason: 'Great for beginners',
          priority: 5,
          colorTheme: course.colorTheme || '#3b82f6',
        });
      }
    }
  }

  // Remove duplicates and sort by priority
  const uniqueRecommendations = recommendations.reduce((acc, current) => {
    const exists = acc.find(item => item.id === current.id);
    if (!exists) {
      acc.push(current);
    } else if (current.priority > exists.priority) {
      // Replace with higher priority recommendation
      const index = acc.findIndex(item => item.id === current.id);
      acc[index] = current;
    }
    return acc;
  }, [] as RecommendedCourse[]);

  return uniqueRecommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5); // Return top 5 recommendations
}
