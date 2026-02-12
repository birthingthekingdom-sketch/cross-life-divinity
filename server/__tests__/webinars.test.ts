import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as webinarsDb from '../webinars';
import { getDb } from '../db';
import { webinars, webinarRegistrations } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Webinars Database Functions', () => {
  let db: any;
  let testWebinarId: number;
  let testUserId = 1; // Assuming user 1 exists

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database not available');
  });

  afterAll(async () => {
    // Cleanup: delete test data
    if (testWebinarId) {
      await db.delete(webinarRegistrations).where(eq(webinarRegistrations.webinarId, testWebinarId));
      await db.delete(webinars).where(eq(webinars.id, testWebinarId));
    }
  });

  describe('createWebinar', () => {
    it('should create a new webinar', async () => {
      const webinarData = {
        courseId: null,
        title: 'Test Webinar: Introduction to Theology',
        description: 'A comprehensive introduction to theological concepts',
        meetingUrl: 'https://zoom.us/j/123456789',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 90,
        recordingUrl: null,
        isActive: true,
      };

      const webinar = await webinarsDb.createWebinar(webinarData);
      
      expect(webinar).toBeDefined();
      expect(webinar?.title).toBe(webinarData.title);
      expect(webinar?.duration).toBe(90);
      expect(webinar?.isActive).toBe(true);
      
      if (webinar) testWebinarId = webinar.id;
    });
  });

  describe('getWebinarById', () => {
    it('should retrieve a webinar by ID', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      const webinar = await webinarsDb.getWebinarById(testWebinarId);
      
      expect(webinar).toBeDefined();
      expect(webinar?.id).toBe(testWebinarId);
      expect(webinar?.title).toContain('Test Webinar');
    });

    it('should return null for non-existent webinar', async () => {
      const webinar = await webinarsDb.getWebinarById(99999);
      expect(webinar).toBeNull();
    });
  });

  describe('getWebinars', () => {
    it('should retrieve all active webinars', async () => {
      const webinars = await webinarsDb.getWebinars({ isActive: true });
      
      expect(Array.isArray(webinars)).toBe(true);
      expect(webinars.length).toBeGreaterThan(0);
    });

    it('should filter upcoming webinars', async () => {
      const webinars = await webinarsDb.getWebinars({ upcomingOnly: true });
      
      expect(Array.isArray(webinars)).toBe(true);
      webinars.forEach(w => {
        expect(w.scheduledAt.getTime()).toBeGreaterThan(Date.now());
      });
    });
  });

  describe('updateWebinar', () => {
    it('should update webinar details', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      const updatedWebinar = await webinarsDb.updateWebinar(testWebinarId, {
        title: 'Updated Test Webinar',
        duration: 120,
      });

      expect(updatedWebinar).toBeDefined();
      expect(updatedWebinar?.title).toBe('Updated Test Webinar');
      expect(updatedWebinar?.duration).toBe(120);
    });
  });

  describe('registerForWebinar', () => {
    it('should register user for webinar', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      const registration = await webinarsDb.registerForWebinar(testUserId, testWebinarId);
      
      expect(registration).toBeDefined();
      expect(registration?.userId).toBe(testUserId);
      expect(registration?.webinarId).toBe(testWebinarId);
      expect(registration?.attended).toBe(false);
    });

    it('should not allow duplicate registration', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      try {
        await webinarsDb.registerForWebinar(testUserId, testWebinarId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('Already registered');
      }
    });
  });

  describe('getUserWebinars', () => {
    it('should retrieve user registered webinars', async () => {
      const userWebinars = await webinarsDb.getUserWebinars(testUserId, false);
      
      expect(Array.isArray(userWebinars)).toBe(true);
      expect(userWebinars.length).toBeGreaterThan(0);
    });
  });

  describe('getWebinarRegistrations', () => {
    it('should retrieve all registrations for a webinar', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      const registrations = await webinarsDb.getWebinarRegistrations(testWebinarId);
      
      expect(Array.isArray(registrations)).toBe(true);
      expect(registrations.length).toBeGreaterThan(0);
      expect(registrations[0].webinarId).toBe(testWebinarId);
    });
  });

  describe('markWebinarAttendance', () => {
    it('should mark user as attended', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      const registrations = await webinarsDb.getWebinarRegistrations(testWebinarId);
      const registration = registrations[0];

      const updated = await webinarsDb.markWebinarAttendance(registration.id, true);
      
      expect(updated).toBeDefined();
      expect(updated?.attended).toBe(true);
      expect(updated?.attendedAt).toBeDefined();
    });
  });

  describe('getWebinarAttendanceStats', () => {
    it('should calculate attendance statistics', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      const stats = await webinarsDb.getWebinarAttendanceStats(testWebinarId);
      
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.attended).toBeGreaterThanOrEqual(0);
      expect(stats.noShow).toBeGreaterThanOrEqual(0);
      expect(stats.attendanceRate).toBeGreaterThanOrEqual(0);
      expect(stats.attendanceRate).toBeLessThanOrEqual(100);
    });
  });

  describe('unregisterFromWebinar', () => {
    it('should unregister user from webinar', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      // First verify registration exists
      let registrations = await webinarsDb.getWebinarRegistrations(testWebinarId);
      const initialCount = registrations.length;

      // Unregister
      await webinarsDb.unregisterFromWebinar(testUserId, testWebinarId);

      // Verify unregistration
      registrations = await webinarsDb.getWebinarRegistrations(testWebinarId);
      expect(registrations.length).toBe(initialCount - 1);
    });
  });

  describe('deleteWebinar', () => {
    it('should delete a webinar', async () => {
      if (!testWebinarId) {
        throw new Error('No test webinar ID available');
      }

      await webinarsDb.deleteWebinar(testWebinarId);

      const webinar = await webinarsDb.getWebinarById(testWebinarId);
      expect(webinar).toBeNull();
    });
  });
});
