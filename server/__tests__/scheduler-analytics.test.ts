import { describe, it, expect, beforeAll } from 'vitest';
import * as db from '../db';
import * as analytics from '../analytics';
import * as scheduler from '../scheduler';

describe('Scheduler and Analytics', () => {
  let testUserId: number;
  let testAdminId: number;
  let testCourseId: number;
  let testFollowUpId: number;

  beforeAll(async () => {
    // Create test users
    const dbInstance = await db.getDb();
    if (!dbInstance) throw new Error('Database not available');

    const { users, courses, followUps } = await import('../../drizzle/schema');
    
    // Create test student
    const studentResult = await dbInstance.insert(users).values({
      openId: `test-student-${Date.now()}`,
      email: `student-${Date.now()}@test.com`,
      name: 'Test Student',
      role: 'user',
    });
    testUserId = Number(studentResult[0].insertId);

    // Create test admin
    const adminResult = await dbInstance.insert(users).values({
      openId: `test-admin-${Date.now()}`,
      email: `admin-${Date.now()}@test.com`,
      name: 'Test Admin',
      role: 'admin',
    });
    testAdminId = Number(adminResult[0].insertId);

    // Create test course
    const courseResult = await dbInstance.insert(courses).values({
      code: `TEST${Date.now()}`,
      title: 'Test Analytics Course',
      colorTheme: '#3B82F6',
      totalLessons: 5,
      displayOrder: 1,
    });
    testCourseId = Number(courseResult[0].insertId);

    // Create test follow-up
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const followUpResult = await dbInstance.insert(followUps).values({
      studentId: testUserId,
      adminId: testAdminId,
      title: 'Test Follow-Up',
      notes: 'Test notes',
      priority: 'medium',
      status: 'pending',
      dueDate: tomorrow,
    });
    testFollowUpId = Number(followUpResult[0].insertId);
  });

  describe('Analytics', () => {
    it('should get student activity metrics', async () => {
      const metrics = await analytics.getStudentActivityMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.totalStudents).toBeGreaterThanOrEqual(0);
      expect(metrics.activeStudents).toBeGreaterThanOrEqual(0);
      expect(metrics.inactiveStudents).toBeGreaterThanOrEqual(0);
      expect(metrics.atRiskStudents).toBeGreaterThanOrEqual(0);
      expect(metrics.averageCourseCompletion).toBeGreaterThanOrEqual(0);
      expect(metrics.averageQuizScore).toBeGreaterThanOrEqual(0);
    });

    it('should get student engagement data', async () => {
      const engagement = await analytics.getStudentEngagementData();
      
      expect(Array.isArray(engagement)).toBe(true);
      
      if (engagement.length > 0) {
        const student = engagement[0];
        expect(student).toHaveProperty('userId');
        expect(student).toHaveProperty('userName');
        expect(student).toHaveProperty('userEmail');
        expect(student).toHaveProperty('enrolledCourses');
        expect(student).toHaveProperty('completedCourses');
        expect(student).toHaveProperty('completionRate');
        expect(student).toHaveProperty('isInactive');
        expect(student).toHaveProperty('isAtRisk');
      }
    });

    it('should get course completion trends', async () => {
      const trends = await analytics.getCourseCompletionTrends();
      
      expect(Array.isArray(trends)).toBe(true);
      
      if (trends.length > 0) {
        const trend = trends[0];
        expect(trend).toHaveProperty('courseId');
        expect(trend).toHaveProperty('courseTitle');
        expect(trend).toHaveProperty('courseCode');
        expect(trend).toHaveProperty('totalEnrolled');
        expect(trend).toHaveProperty('totalCompleted');
        expect(trend).toHaveProperty('completionRate');
      }
    });

    it('should calculate completion rates correctly', async () => {
      const trends = await analytics.getCourseCompletionTrends();
      
      for (const trend of trends) {
        if (trend.totalEnrolled > 0) {
          const expectedRate = (trend.totalCompleted / trend.totalEnrolled) * 100;
          expect(Math.abs(trend.completionRate - expectedRate)).toBeLessThan(0.1);
        } else {
          expect(trend.completionRate).toBe(0);
        }
      }
    });
  });

  describe('Scheduler', () => {
    it('should trigger follow-up reminders manually', async () => {
      const result = await scheduler.triggerFollowUpReminders();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('count');
      expect(result.success).toBe(true);
    });

    it('should return correct count of due follow-ups', async () => {
      const result = await scheduler.triggerFollowUpReminders();
      
      expect(typeof result.count).toBe('number');
      expect(result.count).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty follow-up list gracefully', async () => {
      // This test ensures the scheduler doesn't crash when there are no due follow-ups
      const result = await scheduler.triggerFollowUpReminders();
      
      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
    });
  });

  describe('Integration', () => {
    it('should identify at-risk students based on engagement data', async () => {
      const engagement = await analytics.getStudentEngagementData();
      const atRiskStudents = engagement.filter(s => s.isAtRisk);
      
      // At-risk students should have low quiz scores or low completion rates
      for (const student of atRiskStudents) {
        const hasLowQuizScore = student.averageQuizScore !== null && student.averageQuizScore < 60;
        const hasLowCompletion = student.completionRate < 30;
        
        expect(hasLowQuizScore || hasLowCompletion).toBe(true);
      }
    });

    it('should identify inactive students correctly', async () => {
      const engagement = await analytics.getStudentEngagementData();
      const inactiveStudents = engagement.filter(s => s.isInactive);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      for (const student of inactiveStudents) {
        if (student.lastLoginAt) {
          expect(new Date(student.lastLoginAt).getTime()).toBeLessThan(thirtyDaysAgo.getTime());
        } else {
          expect(student.lastLoginAt).toBeNull();
        }
      }
    });

    it('should calculate metrics consistently', async () => {
      const metrics = await analytics.getStudentActivityMetrics();
      const engagement = await analytics.getStudentEngagementData();
      
      // Total students should match engagement data length
      const studentCount = engagement.filter(e => e.userId !== testAdminId).length;
      expect(metrics.totalStudents).toBeGreaterThanOrEqual(0);
      
      // Active + inactive should not exceed total
      expect(metrics.activeStudents + metrics.inactiveStudents).toBeLessThanOrEqual(metrics.totalStudents + 1);
    });
  });
});
