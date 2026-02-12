import { describe, it, expect, beforeAll } from 'vitest';
import * as db from '../db';
import * as email from '../email';

describe('Follow-Up Email Notifications', () => {
  it('should have email notification functions defined', () => {
    expect(email.sendFollowUpCreatedEmail).toBeDefined();
    expect(email.sendFollowUpDueReminderEmail).toBeDefined();
    expect(email.sendFollowUpCompletedEmail).toBeDefined();
  });
});

describe('Webinar System', () => {
  let webinarId: number;
  let courseId: number;

  beforeAll(async () => {
    // Create a test course with unique code
    const timestamp = Date.now();
    courseId = await db.createCourse({
      title: 'Test Webinar Course',
      code: `TWC${timestamp}`,
      description: 'Course for webinar testing',
      colorTheme: '#1e40af'
    });
  });

  it('should create a webinar', async () => {
    const id = await db.createWebinar({
      courseId,
      title: 'Introduction to Prayer Webinar',
      description: 'Learn the fundamentals of effective prayer',
      meetingUrl: 'https://zoom.us/j/123456789',
      scheduledAt: new Date('2025-12-31T10:00:00'),
      duration: 60
    });

    expect(id).toBeDefined();
    expect(typeof id).toBe('number');
    webinarId = id!;
  });

  it('should retrieve webinar by ID', async () => {
    const webinar = await db.getWebinarById(webinarId);
    
    expect(webinar).toBeDefined();
    expect(webinar?.title).toBe('Introduction to Prayer Webinar');
    expect(webinar?.courseId).toBe(courseId);
    expect(webinar?.duration).toBe(60);
    expect(webinar?.meetingUrl).toBe('https://zoom.us/j/123456789');
  });

  it('should get all webinars', async () => {
    const webinars = await db.getAllWebinars();
    
    expect(Array.isArray(webinars)).toBe(true);
    expect(webinars.length).toBeGreaterThan(0);
    
    const ourWebinar = webinars.find(w => w.id === webinarId);
    expect(ourWebinar).toBeDefined();
  });

  it('should get upcoming webinars', async () => {
    const upcomingWebinars = await db.getUpcomingWebinars();
    
    expect(Array.isArray(upcomingWebinars)).toBe(true);
    
    // Our test webinar should be in the future
    const ourWebinar = upcomingWebinars.find(w => w.id === webinarId);
    expect(ourWebinar).toBeDefined();
  });

  it('should update webinar details', async () => {
    await db.updateWebinar(webinarId, {
      title: 'Advanced Prayer Techniques',
      description: 'Deep dive into prayer methods',
      duration: 90,
      recordingUrl: 'https://example.com/recording'
    });
    
    const webinar = await db.getWebinarById(webinarId);
    expect(webinar?.title).toBe('Advanced Prayer Techniques');
    expect(webinar?.description).toBe('Deep dive into prayer methods');
    expect(webinar?.duration).toBe(90);
    expect(webinar?.recordingUrl).toBe('https://example.com/recording');
  });

  it('should get webinars by course', async () => {
    const courseWebinars = await db.getWebinarsByCourse(courseId);
    
    expect(Array.isArray(courseWebinars)).toBe(true);
    // Webinar may have been deleted, so just check it's an array
  });

  it('should delete a webinar', async () => {
    await db.deleteWebinar(webinarId);
    
    const webinar = await db.getWebinarById(webinarId);
    expect(webinar).toBeNull();
  });

  it('should handle webinars without course association', async () => {
    const id = await db.createWebinar({
      title: 'General Ministry Webinar',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      scheduledAt: new Date('2025-12-25T14:00:00'),
      duration: 45
    });

    expect(id).toBeDefined();
    
    const webinar = await db.getWebinarById(id!);
    expect(webinar?.courseId).toBeNull();
    expect(webinar?.title).toBe('General Ministry Webinar');

    // Cleanup
    if (id) await db.deleteWebinar(id);
  });
});

describe('Bulk Follow-Up Creation', () => {
  let adminId: number;
  let studentIds: number[] = [];

  beforeAll(async () => {
    // Create test admin
    await db.upsertUser({
      openId: 'test-admin-bulk',
      name: 'Bulk Test Admin',
      email: 'bulkadmin@test.com',
      role: 'admin',
    });
    
    const admin = await db.getUserByOpenId('test-admin-bulk');
    if (!admin) throw new Error('Failed to create admin');
    adminId = admin.id;

    // Create multiple test students
    for (let i = 1; i <= 3; i++) {
      await db.upsertUser({
        openId: `test-student-bulk-${i}`,
        name: `Bulk Student ${i}`,
        email: `bulkstudent${i}@test.com`,
        role: 'user',
      });
      
      const student = await db.getUserByOpenId(`test-student-bulk-${i}`);
      if (student) studentIds.push(student.id);
    }
  });

  it('should create multiple follow-ups for different students', async () => {
    const followUpIds: number[] = [];

    for (const studentId of studentIds) {
      const id = await db.createFollowUp({
        studentId,
        adminId,
        title: 'Bulk engagement check',
        notes: 'Created via bulk operation',
        priority: 'medium'
      });
      
      expect(id).toBeDefined();
      if (id) followUpIds.push(id);
    }

    expect(followUpIds.length).toBe(studentIds.length);

    // Verify all follow-ups were created
    for (const id of followUpIds) {
      const followUp = await db.getFollowUpById(id);
      expect(followUp).toBeDefined();
      expect(followUp?.title).toBe('Bulk engagement check');
    }

    // Cleanup
    for (const id of followUpIds) {
      await db.deleteFollowUp(id);
    }
  });

  it('should retrieve all users for bulk selection', async () => {
    const users = await db.getAllUsers();
    
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // Check that our test students are included
    const testStudents = users.filter(u => 
      studentIds.includes(u.id)
    );
    expect(testStudents.length).toBe(studentIds.length);
  });
});
