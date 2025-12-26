import { describe, it, expect, beforeAll } from 'vitest';
import * as db from '../db';

describe('Follow-Up System', () => {
  let adminId: number;
  let studentId: number;
  let followUpId: number;

  beforeAll(async () => {
    // Create test users
    await db.upsertUser({
      openId: 'test-admin-followup',
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'admin',
    });
    
    await db.upsertUser({
      openId: 'test-student-followup',
      name: 'Test Student',
      email: 'student@test.com',
      role: 'user',
    });

    const admin = await db.getUserByOpenId('test-admin-followup');
    const student = await db.getUserByOpenId('test-student-followup');
    
    if (!admin || !student) {
      throw new Error('Failed to create test users');
    }
    
    adminId = admin.id;
    studentId = student.id;
  });

  it('should create a follow-up', async () => {
    const id = await db.createFollowUp({
      studentId,
      adminId,
      title: 'Check course progress',
      notes: 'Student has not logged in for 2 weeks',
      priority: 'high',
      dueDate: new Date('2025-12-31'),
    });

    expect(id).toBeDefined();
    expect(typeof id).toBe('number');
    followUpId = id!;
  });

  it('should retrieve follow-up by ID', async () => {
    const followUp = await db.getFollowUpById(followUpId);
    
    expect(followUp).toBeDefined();
    expect(followUp?.title).toBe('Check course progress');
    expect(followUp?.studentId).toBe(studentId);
    expect(followUp?.adminId).toBe(adminId);
    expect(followUp?.priority).toBe('high');
    expect(followUp?.status).toBe('pending');
  });

  it('should get all follow-ups', async () => {
    const followUps = await db.getAllFollowUps();
    
    expect(Array.isArray(followUps)).toBe(true);
    expect(followUps.length).toBeGreaterThan(0);
    
    const ourFollowUp = followUps.find(f => f.id === followUpId);
    expect(ourFollowUp).toBeDefined();
    expect(ourFollowUp?.studentName).toBe('Test Student');
  });

  it('should get follow-ups by student', async () => {
    const followUps = await db.getFollowUpsByStudent(studentId);
    
    expect(Array.isArray(followUps)).toBe(true);
    expect(followUps.length).toBeGreaterThan(0);
    expect(followUps.every(f => f.studentId === studentId)).toBe(true);
  });

  it('should get follow-ups by status', async () => {
    const pendingFollowUps = await db.getFollowUpsByStatus('pending');
    
    expect(Array.isArray(pendingFollowUps)).toBe(true);
    const ourFollowUp = pendingFollowUps.find(f => f.id === followUpId);
    expect(ourFollowUp).toBeDefined();
    expect(ourFollowUp?.status).toBe('pending');
  });

  it('should update follow-up status to completed', async () => {
    await db.updateFollowUpStatus(followUpId, 'completed');
    
    const followUp = await db.getFollowUpById(followUpId);
    expect(followUp?.status).toBe('completed');
    expect(followUp?.completedAt).toBeDefined();
  });

  it('should update follow-up details', async () => {
    await db.updateFollowUp(followUpId, {
      title: 'Updated title',
      notes: 'Updated notes',
      priority: 'low',
    });
    
    const followUp = await db.getFollowUpById(followUpId);
    expect(followUp?.title).toBe('Updated title');
    expect(followUp?.notes).toBe('Updated notes');
    expect(followUp?.priority).toBe('low');
  });

  it('should update status to cancelled', async () => {
    await db.updateFollowUpStatus(followUpId, 'cancelled');
    
    const followUp = await db.getFollowUpById(followUpId);
    expect(followUp?.status).toBe('cancelled');
  });

  it('should delete a follow-up', async () => {
    await db.deleteFollowUp(followUpId);
    
    const followUp = await db.getFollowUpById(followUpId);
    expect(followUp).toBeNull();
  });

  it('should handle multiple follow-ups for same student', async () => {
    const id1 = await db.createFollowUp({
      studentId,
      adminId,
      title: 'Follow-up 1',
      priority: 'low',
    });

    const id2 = await db.createFollowUp({
      studentId,
      adminId,
      title: 'Follow-up 2',
      priority: 'medium',
    });

    const studentFollowUps = await db.getFollowUpsByStudent(studentId);
    expect(studentFollowUps.length).toBeGreaterThanOrEqual(2);

    // Cleanup
    if (id1) await db.deleteFollowUp(id1);
    if (id2) await db.deleteFollowUp(id2);
  });
});
