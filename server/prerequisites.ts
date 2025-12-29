import * as db from './db';
import { sql } from 'drizzle-orm';

/**
 * Check if a user has completed all prerequisites for a course
 */
export async function checkPrerequisites(userId: number, courseId: number): Promise<{
  canEnroll: boolean;
  missingPrerequisites: Array<{ id: number; title: string }>;
}> {
  const dbConn = await db.getDb();
  if (!dbConn) {
    throw new Error('Database not available');
  }

  // Get all prerequisites for the course
  const prerequisitesResult: any = await dbConn.execute(
    sql`SELECT c.id, c.title
        FROM course_prerequisites cp
        JOIN courses c ON cp.prerequisiteCourseId = c.id
        WHERE cp.courseId = ${courseId} AND cp.required = true`
  );

  const prerequisites = Array.isArray(prerequisitesResult) 
    ? prerequisitesResult 
    : prerequisitesResult.rows || [];

  if (prerequisites.length === 0) {
    // No prerequisites, can enroll
    return { canEnroll: true, missingPrerequisites: [] };
  }

  // Check which prerequisites the user has completed
  const missingPrerequisites = [];
  
  for (const prereq of prerequisites) {
    const completedResult: any = await dbConn.execute(
      sql`SELECT ce.id
          FROM course_enrollments ce
          WHERE ce.userId = ${userId} 
            AND ce.courseId = ${prereq.id}
            AND ce.completed = true`
    );

    const completed = Array.isArray(completedResult) 
      ? completedResult.length > 0
      : (completedResult.rows || []).length > 0;

    if (!completed) {
      missingPrerequisites.push({
        id: prereq.id,
        title: prereq.title
      });
    }
  }

  return {
    canEnroll: missingPrerequisites.length === 0,
    missingPrerequisites
  };
}

/**
 * Get all prerequisites for a course
 */
export async function getCoursePrerequisites(courseId: number): Promise<Array<{ id: number; title: string; required: boolean }>> {
  const dbConn = await db.getDb();
  if (!dbConn) {
    throw new Error('Database not available');
  }

  const result: any = await dbConn.execute(
    sql`SELECT c.id, c.title, cp.required
        FROM course_prerequisites cp
        JOIN courses c ON cp.prerequisiteCourseId = c.id
        WHERE cp.courseId = ${courseId}
        ORDER BY c.title`
  );

  return Array.isArray(result) ? result : result.rows || [];
}
