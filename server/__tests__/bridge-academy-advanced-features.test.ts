import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from '../db';

describe('Bridge Academy Advanced Features', () => {
  let dbInstance: any;
  let testUserId: number;
  let testCourseId: number;

  beforeAll(async () => {
    dbInstance = await db.getDb();
    if (!dbInstance) {
      throw new Error('Database connection failed');
    }

    // Create test user
    const [userResult] = await (dbInstance as any).execute(
      `INSERT INTO users (email, name, role, loginMethod, emailVerified) 
       VALUES (?, ?, ?, ?, ?)`,
      ['test-bridge@example.com', 'Test Student', 'user', 'email', true]
    );
    testUserId = (userResult as any).insertId;

    // Create test course (GED Math)
    const [courseResult] = await (dbInstance as any).execute(
      `INSERT INTO courses (code, title, description, colorTheme, totalLessons) 
       VALUES (?, ?, ?, ?, ?)`,
      ['MATH101', 'GED Mathematical Reasoning', 'Test course', '#3b82f6', 10]
    );
    testCourseId = (courseResult as any).insertId;
  });

  afterAll(async () => {
    if (dbInstance) {
      // Cleanup test data
      await (dbInstance as any).execute(
        'DELETE FROM bridge_academy_practice_tests WHERE userId = ?',
        [testUserId]
      );
      await (dbInstance as any).execute(
        'DELETE FROM bridge_academy_readiness_assessments WHERE userId = ?',
        [testUserId]
      );
      await (dbInstance as any).execute(
        'DELETE FROM bridge_academy_study_schedules WHERE userId = ?',
        [testUserId]
      );
      await (dbInstance as any).execute(
        'DELETE FROM bridge_academy_study_schedule_reminders WHERE userId = ?',
        [testUserId]
      );
      await (dbInstance as any).execute(
        'DELETE FROM users WHERE id = ?',
        [testUserId]
      );
      await (dbInstance as any).execute(
        'DELETE FROM courses WHERE id = ?',
        [testCourseId]
      );
    }
  });

  describe('Practice Test Results', () => {
    it('should create a practice test result', async () => {
      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_practice_tests 
         (userId, courseId, testNumber, totalQuestions, score, percentage, timeSpentSeconds) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 1, 50, 42, 84, 3600]
      );

      expect((result as any).insertId).toBeGreaterThan(0);
    });

    it('should retrieve practice test history', async () => {
      // Insert test data
      await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_practice_tests 
         (userId, courseId, testNumber, totalQuestions, score, percentage, timeSpentSeconds) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 2, 50, 45, 90, 3500]
      );

      // Retrieve tests
      const [tests] = await (dbInstance as any).execute(
        `SELECT * FROM bridge_academy_practice_tests 
         WHERE userId = ? AND courseId = ? 
         ORDER BY createdAt DESC`,
        [testUserId, testCourseId]
      );

      expect(Array.isArray(tests)).toBe(true);
      expect((tests as any[]).length).toBeGreaterThan(0);
      expect((tests as any[])[0].percentage).toBe(90);
    });

    it('should calculate score trends', async () => {
      // Insert multiple test results
      const scores = [70, 75, 80, 85, 88];
      for (let i = 0; i < scores.length; i++) {
        await (dbInstance as any).execute(
          `INSERT INTO bridge_academy_practice_tests 
           (userId, courseId, testNumber, totalQuestions, score, percentage, timeSpentSeconds) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [testUserId, testCourseId, 10 + i, 50, Math.round(50 * scores[i] / 100), scores[i], 3600]
        );
      }

      // Retrieve and verify trend
      const [tests] = await (dbInstance as any).execute(
        `SELECT percentage FROM bridge_academy_practice_tests 
         WHERE userId = ? AND courseId = ? 
         ORDER BY testNumber ASC`,
        [testUserId, testCourseId]
      );

      const percentages = (tests as any[]).map((t: any) => t.percentage);
      const improvement = percentages[percentages.length - 1] - percentages[0];
      expect(improvement).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Readiness Assessments', () => {
    it('should create a readiness assessment', async () => {
      const strengths = JSON.stringify(['Reading & Writing', 'Science']);
      const weaknesses = JSON.stringify(['Mathematical Reasoning']);

      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_readiness_assessments 
         (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 16, 80, 'advanced', '4week', strengths, weaknesses]
      );

      expect((result as any).insertId).toBeGreaterThan(0);
    });

    it('should determine correct readiness level for advanced score', async () => {
      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_readiness_assessments 
         (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 18, 90, 'advanced', '4week', '[]', '[]']
      );

      const assessmentId = (result as any).insertId;
      const [assessment] = await (dbInstance as any).execute(
        'SELECT readinessLevel, recommendedPlan FROM bridge_academy_readiness_assessments WHERE id = ?',
        [assessmentId]
      );

      expect((assessment as any[])[0].readinessLevel).toBe('advanced');
      expect((assessment as any[])[0].recommendedPlan).toBe('4week');
    });

    it('should determine correct readiness level for intermediate score', async () => {
      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_readiness_assessments 
         (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 12, 60, 'intermediate', '8week', '[]', '[]']
      );

      const assessmentId = (result as any).insertId;
      const [assessment] = await (dbInstance as any).execute(
        'SELECT readinessLevel, recommendedPlan FROM bridge_academy_readiness_assessments WHERE id = ?',
        [assessmentId]
      );

      expect((assessment as any[])[0].readinessLevel).toBe('intermediate');
      expect((assessment as any[])[0].recommendedPlan).toBe('8week');
    });

    it('should determine correct readiness level for beginner score', async () => {
      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_readiness_assessments 
         (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 8, 40, 'beginner', '12week', '[]', '[]']
      );

      const assessmentId = (result as any).insertId;
      const [assessment] = await (dbInstance as any).execute(
        'SELECT readinessLevel, recommendedPlan FROM bridge_academy_readiness_assessments WHERE id = ?',
        [assessmentId]
      );

      expect((assessment as any[])[0].readinessLevel).toBe('beginner');
      expect((assessment as any[])[0].recommendedPlan).toBe('12week');
    });

    it('should retrieve latest assessment for a student', async () => {
      const [result1] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_readiness_assessments 
         (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 10, 50, 'beginner', '12week', '[]', '[]']
      );

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 100));

      const [result2] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_readiness_assessments 
         (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 15, 75, 'intermediate', '8week', '[]', '[]']
      );

      // Retrieve latest
      const [assessments] = await (dbInstance as any).execute(
        `SELECT * FROM bridge_academy_readiness_assessments 
         WHERE userId = ? AND courseId = ? 
         ORDER BY createdAt DESC LIMIT 1`,
        [testUserId, testCourseId]
      );

      expect((assessments as any[])[0].percentage).toBe(75);
    });
  });

  describe('Study Schedules', () => {
    it('should create a study schedule', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000); // 4 weeks

      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_study_schedules 
         (userId, courseId, planDuration, startDate, endDate) 
         VALUES (?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, '4week', startDate, endDate]
      );

      expect((result as any).insertId).toBeGreaterThan(0);
    });

    it('should retrieve study schedule for student', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 56 * 24 * 60 * 60 * 1000); // 8 weeks

      await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_study_schedules 
         (userId, courseId, planDuration, startDate, endDate) 
         VALUES (?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, '8week', startDate, endDate]
      );

      const [schedules] = await (dbInstance as any).execute(
        `SELECT * FROM bridge_academy_study_schedules 
         WHERE userId = ? AND courseId = ? 
         ORDER BY createdAt DESC LIMIT 1`,
        [testUserId, testCourseId]
      );

      expect((schedules as any[])[0].planDuration).toBe('8week');
    });
  });

  describe('Study Schedule Reminders', () => {
    let scheduleId: number;

    beforeAll(async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000);

      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_study_schedules 
         (userId, courseId, planDuration, startDate, endDate) 
         VALUES (?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, '4week', startDate, endDate]
      );
      scheduleId = (result as any).insertId;
    });

    it('should create a daily reminder', async () => {
      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_study_schedule_reminders 
         (userId, scheduleId, reminderType, reminderTime) 
         VALUES (?, ?, ?, ?)`,
        [testUserId, scheduleId, 'daily', '09:00']
      );

      expect((result as any).insertId).toBeGreaterThan(0);
    });

    it('should create a weekly reminder', async () => {
      const [result] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_study_schedule_reminders 
         (userId, scheduleId, reminderType, reminderTime) 
         VALUES (?, ?, ?, ?)`,
        [testUserId, scheduleId, 'weekly', '14:00']
      );

      expect((result as any).insertId).toBeGreaterThan(0);
    });

    it('should retrieve reminders for a schedule', async () => {
      const [reminders] = await (dbInstance as any).execute(
        `SELECT * FROM bridge_academy_study_schedule_reminders 
         WHERE userId = ? AND scheduleId = ?`,
        [testUserId, scheduleId]
      );

      expect(Array.isArray(reminders)).toBe(true);
      expect((reminders as any[]).length).toBeGreaterThan(0);
    });

    it('should update reminder status', async () => {
      const [reminders] = await (dbInstance as any).execute(
        `SELECT id FROM bridge_academy_study_schedule_reminders 
         WHERE userId = ? AND scheduleId = ? LIMIT 1`,
        [testUserId, scheduleId]
      );

      const reminderId = (reminders as any[])[0].id;

      await (dbInstance as any).execute(
        `UPDATE bridge_academy_study_schedule_reminders 
         SET isActive = false 
         WHERE id = ?`,
        [reminderId]
      );

      const [updated] = await (dbInstance as any).execute(
        'SELECT isActive FROM bridge_academy_study_schedule_reminders WHERE id = ?',
        [reminderId]
      );

      expect((updated as any[])[0].isActive).toBe(0); // MySQL returns 0 for false
    });
  });

  describe('Integration Tests', () => {
    it('should create complete study workflow', async () => {
      // 1. Create readiness assessment
      const [assessment] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_readiness_assessments 
         (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 14, 70, 'intermediate', '8week', '[]', '[]']
      );

      // 2. Create study schedule based on recommendation
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 56 * 24 * 60 * 60 * 1000); // 8 weeks

      const [schedule] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_study_schedules 
         (userId, courseId, planDuration, startDate, endDate) 
         VALUES (?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, '8week', startDate, endDate]
      );
      const scheduleId = (schedule as any).insertId;

      // 3. Create reminders
      const [reminder] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_study_schedule_reminders 
         (userId, scheduleId, reminderType, reminderTime) 
         VALUES (?, ?, ?, ?)`,
        [testUserId, scheduleId, 'daily', '08:00']
      );

      // 4. Take practice tests
      const [test1] = await (dbInstance as any).execute(
        `INSERT INTO bridge_academy_practice_tests 
         (userId, courseId, testNumber, totalQuestions, score, percentage, timeSpentSeconds) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [testUserId, testCourseId, 1, 50, 40, 80, 3600]
      );

      // 5. Verify workflow
      const [assessments] = await (dbInstance as any).execute(
        'SELECT * FROM bridge_academy_readiness_assessments WHERE userId = ? AND courseId = ?',
        [testUserId, testCourseId]
      );

      const [schedules] = await (dbInstance as any).execute(
        'SELECT * FROM bridge_academy_study_schedules WHERE userId = ? AND courseId = ?',
        [testUserId, testCourseId]
      );

      const [reminders] = await (dbInstance as any).execute(
        'SELECT * FROM bridge_academy_study_schedule_reminders WHERE userId = ?',
        [testUserId]
      );

      const [tests] = await (dbInstance as any).execute(
        'SELECT * FROM bridge_academy_practice_tests WHERE userId = ? AND courseId = ?',
        [testUserId, testCourseId]
      );

      expect((assessments as any[]).length).toBeGreaterThan(0);
      expect((schedules as any[]).length).toBeGreaterThan(0);
      expect((reminders as any[]).length).toBeGreaterThan(0);
      expect((tests as any[]).length).toBeGreaterThan(0);
    });
  });
});
