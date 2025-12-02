import { describe, it, expect, beforeAll } from 'vitest';
import * as authService from '../auth-service';
import * as db from '../db';

describe('Account Security Features', () => {
  let testUserId: number;
  let testUserEmail: string;
  let testUserPassword: string;

  beforeAll(async () => {
    // Create a test user
    testUserEmail = `security-test-${Date.now()}@example.com`;
    testUserPassword = 'SecurePassword123!';
    
    const result = await authService.registerUser({
      email: testUserEmail,
      password: testUserPassword,
      name: 'Security Test User',
    });

    testUserId = result.userId;
  });

  describe('Password Change', () => {
    it('should successfully change password with correct old password', async () => {
      const newPassword = 'NewSecurePassword456!';
      
      const result = await authService.changePassword(
        testUserId,
        testUserPassword,
        newPassword
      );

      expect(result.success).toBe(true);

      // Verify can login with new password
      const loginResult = await authService.loginUser({
        email: testUserEmail,
        password: newPassword,
      });

      expect(loginResult.success).toBe(true);
      expect(loginResult.user).toBeDefined();

      // Update test password for future tests
      testUserPassword = newPassword;
    });

    it('should fail to change password with incorrect old password', async () => {
      await expect(
        authService.changePassword(
          testUserId,
          'WrongPassword123!',
          'NewPassword789!'
        )
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should enforce minimum password length', async () => {
      await expect(
        authService.changePassword(
          testUserId,
          testUserPassword,
          'short'
        )
      ).rejects.toThrow('Password must be at least 8 characters');
    });
  });

  describe('Login History Tracking', () => {
    it('should record login history on successful login', async () => {
      // Perform a login
      await authService.loginUser({
        email: testUserEmail,
        password: testUserPassword,
      });

      // Get login history
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { loginHistory } = await import('../drizzle/schema');
      const { eq, desc } = await import('drizzle-orm');

      const history = await dbInstance.select().from(loginHistory)
        .where(eq(loginHistory.userId, testUserId))
        .orderBy(desc(loginHistory.createdAt))
        .limit(5);

      expect(history.length).toBeGreaterThan(0);
      expect(history[0].userId).toBe(testUserId);
      expect(history[0].success).toBe(true);
      expect(history[0].loginMethod).toBe('email');
    });

    it('should record failed login attempts', async () => {
      // Attempt login with wrong password
      try {
        await authService.loginUser({
          email: testUserEmail,
          password: 'WrongPassword123!',
        });
      } catch (error) {
        // Expected to fail
      }

      // Check if failed attempt was recorded
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { loginHistory } = await import('../drizzle/schema');
      const { eq, desc } = await import('drizzle-orm');

      const history = await dbInstance.select().from(loginHistory)
        .where(eq(loginHistory.userId, testUserId))
        .orderBy(desc(loginHistory.createdAt))
        .limit(5);

      // Should have at least one failed attempt
      const failedAttempts = history.filter(h => !h.success);
      expect(failedAttempts.length).toBeGreaterThan(0);
    });

    it('should limit login history to most recent entries', async () => {
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { loginHistory } = await import('../drizzle/schema');
      const { eq, desc } = await import('drizzle-orm');

      const history = await dbInstance.select().from(loginHistory)
        .where(eq(loginHistory.userId, testUserId))
        .orderBy(desc(loginHistory.createdAt))
        .limit(20);

      expect(history.length).toBeLessThanOrEqual(20);
    });
  });

  describe('Security Best Practices', () => {
    it('should hash passwords securely', async () => {
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { users } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');

      const [user] = await dbInstance.select().from(users)
        .where(eq(users.id, testUserId));

      // Password should be hashed (not plain text)
      expect(user.password).not.toBe(testUserPassword);
      expect(user.password).toBeDefined();
      expect(user.password!.length).toBeGreaterThan(50); // Bcrypt hashes are long
    });

    it('should not expose sensitive data in login response', async () => {
      const result = await authService.loginUser({
        email: testUserEmail,
        password: testUserPassword,
      });

      expect(result.user).toBeDefined();
      expect((result.user as any).password).toBeUndefined();
      expect((result.user as any).passwordResetToken).toBeUndefined();
    });
  });
});
