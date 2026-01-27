import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import * as db from './db';

describe('tRPC Routers', () => {
  describe('Courses', () => {
    it('should fetch all courses', async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: 'test', role: 'student' },
        req: {} as any,
        res: {} as any,
      });

      const courses = await caller.courses.list();
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
    });

    it('should fetch a single course by ID', async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: 'test', role: 'student' },
        req: {} as any,
        res: {} as any,
      });

      const courses = await caller.courses.list();
      if (courses.length > 0) {
        const course = await caller.courses.getById({ id: courses[0].id });
        expect(course).toBeDefined();
        expect(course.id).toBe(courses[0].id);
        expect(course.title).toBeDefined();
      }
    });
  });

  describe('Lessons', () => {
    it('should fetch lessons for a course', async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: 'test', role: 'student' },
        req: {} as any,
        res: {} as any,
      });

      const courses = await caller.courses.list();
      if (courses.length > 0) {
        const lessons = await caller.lessons.getByCourse({ courseId: courses[0].id });
        expect(Array.isArray(lessons)).toBe(true);
      }
    });
  });

  describe('Access Codes', () => {
    it('should validate access code format', async () => {
      const code = await db.getAccessCodeByCode('CLSD2024');
      expect(code).toBeDefined();
      if (code) {
        expect(code.code).toBe('CLSD2024');
        expect(typeof code.isActive).toBe('boolean');
      }
    });
  });

  describe('Admin Procedures', () => {
    it('should allow admin to fetch access codes', async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: 'admin', role: 'admin' },
        req: {} as any,
        res: {} as any,
      });

      const accessCodes = await caller.admin.getAccessCodes();
      expect(Array.isArray(accessCodes)).toBe(true);
    });

    it('should deny non-admin access to admin procedures', async () => {
      const caller = appRouter.createCaller({
        user: { id: 2, openId: 'student', role: 'student' },
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.getAccessCodes()).rejects.toThrow();
    });
  });

  describe('Database Functions', () => {
    it('should retrieve all courses from database', async () => {
      const courses = await db.getAllCourses();
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
      
      if (courses.length > 0) {
        const course = courses[0];
        expect(course.code).toBeDefined();
        expect(course.title).toBeDefined();
        expect(course.colorTheme).toBeDefined();
      }
    });

    it('should retrieve lessons for a course', async () => {
      const courses = await db.getAllCourses();
      if (courses.length > 0) {
        const lessons = await db.getLessonsByCourseId(courses[0].id);
        expect(Array.isArray(lessons)).toBe(true);
      }
    });
  });
});
