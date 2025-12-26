import * as db from './db';

export interface StudentActivityMetrics {
  totalStudents: number;
  activeStudents: number; // Logged in within last 7 days
  inactiveStudents: number; // No login in last 30 days
  atRiskStudents: number; // Low quiz scores or incomplete courses
  averageCourseCompletion: number;
  averageQuizScore: number;
}

export interface StudentEngagementData {
  userId: number;
  userName: string;
  userEmail: string;
  lastLoginAt: Date | null;
  daysSinceLogin: number | null;
  enrolledCourses: number;
  completedCourses: number;
  completionRate: number;
  averageQuizScore: number | null;
  totalQuizzesTaken: number;
  isInactive: boolean;
  isAtRisk: boolean;
}

export interface CourseCompletionTrend {
  courseId: number;
  courseTitle: string;
  courseCode: string;
  totalEnrolled: number;
  totalCompleted: number;
  completionRate: number;
  averageQuizScore: number | null;
}

/**
 * Get overall student activity metrics
 */
export async function getStudentActivityMetrics(): Promise<StudentActivityMetrics> {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error("Database not available");
  
  const { users, studentProgress, quizSubmissions } = await import('../drizzle/schema');
  const { eq, and, gte, sql, count } = await import('drizzle-orm');
  
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Total students (non-admin users)
  const totalStudentsResult = await dbInstance
    .select({ count: count() })
    .from(users)
    .where(eq(users.role, 'user'));
  const totalStudents = totalStudentsResult[0]?.count || 0;
  
  // Active students (logged in within 7 days)
  const activeStudentsResult = await dbInstance
    .select({ count: count() })
    .from(users)
    .where(
      and(
        eq(users.role, 'user'),
        gte(users.lastSignedIn, sevenDaysAgo)
      )
    );
  const activeStudents = activeStudentsResult[0]?.count || 0;
  
  // Inactive students (no login in 30 days or never logged in)
  const inactiveStudentsResult = await dbInstance
    .select({ count: count() })
    .from(users)
    .where(
      and(
        eq(users.role, 'user'),
        sql`(${users.lastSignedIn} < ${thirtyDaysAgo} OR ${users.lastSignedIn} IS NULL)`
      )
    );
  const inactiveStudents = inactiveStudentsResult[0]?.count || 0;
  
  // Average course completion rate
  const completionData = await dbInstance
    .select({
      totalProgress: count(),
      completedProgress: sql<number>`SUM(CASE WHEN ${studentProgress.completed} = 1 THEN 1 ELSE 0 END)`
    })
    .from(studentProgress);
  
  const totalProgress = completionData[0]?.totalProgress || 0;
  const completedProgress = Number(completionData[0]?.completedProgress) || 0;
  const averageCourseCompletion = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;
  
  // Average quiz score
  const quizData = await dbInstance
    .select({
      avgScore: sql<number>`AVG(CAST(${quizSubmissions.score} AS DECIMAL) / CAST(${quizSubmissions.totalQuestions} AS DECIMAL) * 100)`
    })
    .from(quizSubmissions);
  
  const averageQuizScore = Number(quizData[0]?.avgScore) || 0;
  
  // At-risk students (low quiz scores < 60% or low completion < 30%)
  const atRiskCount = await getAtRiskStudentsCount();
  
  return {
    totalStudents,
    activeStudents,
    inactiveStudents,
    atRiskStudents: atRiskCount,
    averageCourseCompletion: Math.round(averageCourseCompletion * 10) / 10,
    averageQuizScore: Math.round(averageQuizScore * 10) / 10,
  };
}

/**
 * Get detailed engagement data for all students
 */
export async function getStudentEngagementData(): Promise<StudentEngagementData[]> {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error("Database not available");
  
  const { users, courseEnrollments, studentProgress, quizSubmissions, courses } = await import('../drizzle/schema');
  const { eq, sql, and } = await import('drizzle-orm');
  
  const allUsers = await dbInstance
    .select()
    .from(users)
    .where(eq(users.role, 'user'));
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const engagementData: StudentEngagementData[] = [];
  
  for (const user of allUsers) {
    // Get enrolled courses
    const userEnrollments = await dbInstance
      .select({ courseId: courseEnrollments.courseId })
      .from(courseEnrollments)
      .where(eq(courseEnrollments.userId, user.id));
    
    const enrolledCourses = userEnrollments.length;
    
    // Get completed courses
    let completedCourses = 0;
    for (const enrollment of userEnrollments) {
      const courseLessons = await dbInstance
        .select({ id: sql<number>`id` })
        .from(sql`lessons`)
        .where(sql`courseId = ${enrollment.courseId}`);
      
      const completedLessons = await dbInstance
        .select({ count: sql<number>`COUNT(*)` })
        .from(studentProgress)
        .where(
          and(
            eq(studentProgress.userId, user.id),
            eq(studentProgress.courseId, enrollment.courseId),
            eq(studentProgress.completed, true)
          )
        );
      
      if (courseLessons.length > 0 && completedLessons[0]?.count === courseLessons.length) {
        completedCourses++;
      }
    }
    
    // Get average quiz score
    const quizScores = await dbInstance
      .select({
        avgScore: sql<number>`AVG(CAST(${quizSubmissions.score} AS DECIMAL) / CAST(${quizSubmissions.totalQuestions} AS DECIMAL) * 100)`
      })
      .from(quizSubmissions)
      .where(eq(quizSubmissions.userId, user.id));
    
    const averageQuizScore = quizScores[0]?.avgScore ? Number(quizScores[0].avgScore) : null;
    
    // Get total quizzes taken
    const quizCount = await dbInstance
      .select({ count: sql<number>`COUNT(*)` })
      .from(quizSubmissions)
      .where(eq(quizSubmissions.userId, user.id));
    
    const totalQuizzesTaken = Number(quizCount[0]?.count) || 0;
    
    // Calculate days since last login
    const daysSinceLogin = user.lastSignedIn 
      ? Math.floor((now.getTime() - new Date(user.lastSignedIn).getTime()) / (24 * 60 * 60 * 1000))
      : null;
    
    // Determine if inactive
    const isInactive = !user.lastSignedIn || new Date(user.lastSignedIn) < thirtyDaysAgo;
    
    // Determine if at-risk
    const completionRate = enrolledCourses > 0 ? (completedCourses / enrolledCourses) * 100 : 0;
    const isAtRisk = (averageQuizScore !== null && averageQuizScore < 60) || completionRate < 30;
    
    engagementData.push({
      userId: user.id,
      userName: user.name || '',
      userEmail: user.email || '',
      lastLoginAt: user.lastSignedIn,
      daysSinceLogin,
      enrolledCourses,
      completedCourses,
      completionRate: Math.round(completionRate * 10) / 10,
      averageQuizScore: averageQuizScore ? Math.round(averageQuizScore * 10) / 10 : null,
      totalQuizzesTaken,
      isInactive,
      isAtRisk,
    });
  }
  
  return engagementData;
}

/**
 * Get course completion trends
 */
export async function getCourseCompletionTrends(): Promise<CourseCompletionTrend[]> {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error("Database not available");
  
  const { courses, courseEnrollments, studentProgress, quizSubmissions } = await import('../drizzle/schema');
  const { eq, sql } = await import('drizzle-orm');
  
  const allCourses = await dbInstance.select().from(courses);
  const trends: CourseCompletionTrend[] = [];
  
  for (const course of allCourses) {
    // Total enrolled
    const enrolled = await dbInstance
      .select({ count: sql<number>`COUNT(*)` })
      .from(courseEnrollments)
      .where(eq(courseEnrollments.courseId, course.id));
    
    const totalEnrolled = Number(enrolled[0]?.count) || 0;
    
    // Get course lessons
    const courseLessons = await dbInstance
      .select({ id: sql<number>`id` })
      .from(sql`lessons`)
      .where(sql`courseId = ${course.id}`);
    
    const totalLessons = courseLessons.length;
    
    // Count students who completed all lessons
    let totalCompleted = 0;
    if (totalLessons > 0) {
      const enrolledUsers = await dbInstance
        .select({ userId: courseEnrollments.userId })
        .from(courseEnrollments)
        .where(eq(courseEnrollments.courseId, course.id));
      
      for (const { userId } of enrolledUsers) {
        const completed = await dbInstance
          .select({ count: sql<number>`COUNT(*)` })
          .from(studentProgress)
          .where(
            sql`${studentProgress.userId} = ${userId} AND ${studentProgress.courseId} = ${course.id} AND ${studentProgress.completed} = 1`
          );
        
        if (Number(completed[0]?.count) === totalLessons) {
          totalCompleted++;
        }
      }
    }
    
    // Average quiz score for this course
    const quizScores = await dbInstance
      .select({
        avgScore: sql<number>`AVG(CAST(${quizSubmissions.score} AS DECIMAL) / CAST(${quizSubmissions.totalQuestions} AS DECIMAL) * 100)`
      })
      .from(quizSubmissions)
      .innerJoin(sql`lessons`, sql`${quizSubmissions.lessonId} = lessons.id`)
      .where(sql`lessons.courseId = ${course.id}`);
    
    const averageQuizScore = quizScores[0]?.avgScore ? Number(quizScores[0].avgScore) : null;
    
    const completionRate = totalEnrolled > 0 ? (totalCompleted / totalEnrolled) * 100 : 0;
    
    trends.push({
      courseId: course.id,
      courseTitle: course.title,
      courseCode: course.code,
      totalEnrolled,
      totalCompleted,
      completionRate: Math.round(completionRate * 10) / 10,
      averageQuizScore: averageQuizScore ? Math.round(averageQuizScore * 10) / 10 : null,
    });
  }
  
  return trends;
}

/**
 * Helper: Count at-risk students
 */
async function getAtRiskStudentsCount(): Promise<number> {
  const engagement = await getStudentEngagementData();
  return engagement.filter(s => s.isAtRisk).length;
}
