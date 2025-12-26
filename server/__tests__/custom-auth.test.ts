import { describe, it, expect, beforeAll } from 'vitest';
import * as authService from '../auth-service';
import * as db from '../db';
import { eq } from 'drizzle-orm';

describe('Custom Authentication System', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123';
  const testName = 'Test User';
  let testUserId: number;
  let resetToken: string;

  describe('Password Hashing', () => {
    it('should hash passwords securely', async () => {
      const password = 'MySecurePassword123';
      const hash = await authService.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should verify correct passwords', async () => {
      const password = 'MySecurePassword123';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'MySecurePassword123';
      const hash = await authService.hashPassword(password);
      const isValid = await authService.verifyPassword('WrongPassword', hash);
      
      expect(isValid).toBe(false);
    });
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const user = await authService.registerUser(testEmail, testPassword, testName);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.name).toBe(testName);
      expect(user.role).toBe('user');
      expect(user.loginMethod).toBe('email');
      expect(user.password).toBeDefined();
      
      testUserId = user.id;
    });

    it('should not allow duplicate email registration', async () => {
      await expect(
        authService.registerUser(testEmail, testPassword, 'Another Name')
      ).rejects.toThrow('User with this email already exists');
    });

    it('should hash password during registration', async () => {
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { users } = await import('../../drizzle/schema');
      const userResult = await dbInstance.select().from(users).where(eq(users.id, testUserId)).limit(1);
      const user = userResult[0];

      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(testPassword);
      expect(user.password!.length).toBeGreaterThan(20);
    });
  });

  describe('User Authentication', () => {
    it('should authenticate user with correct credentials', async () => {
      const user = await authService.authenticateUser(testEmail, testPassword);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.name).toBe(testName);
      expect(user.id).toBe(testUserId);
      expect((user as any).password).toBeUndefined(); // Password should not be returned
    });

    it('should reject authentication with wrong password', async () => {
      await expect(
        authService.authenticateUser(testEmail, 'WrongPassword123')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject authentication with non-existent email', async () => {
      await expect(
        authService.authenticateUser('nonexistent@example.com', testPassword)
      ).rejects.toThrow('Invalid email or password');
    });

    it('should update lastSignedIn timestamp on successful login', async () => {
      const beforeLogin = new Date();
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      
      await authService.authenticateUser(testEmail, testPassword);
      
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { users } = await import('../../drizzle/schema');
      const userResult = await dbInstance.select().from(users).where(eq(users.id, testUserId)).limit(1);
      const user = userResult[0];

      expect(user.lastSignedIn).toBeDefined();
      expect(user.lastSignedIn!.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());
    });
  });

  describe('Password Reset Flow', () => {
    it('should generate reset token', () => {
      const token1 = authService.generateResetToken();
      const token2 = authService.generateResetToken();
      
      expect(token1).toBeDefined();
      expect(token1.length).toBeGreaterThan(20);
      expect(token1).not.toBe(token2); // Tokens should be unique
    });

    it('should initiate password reset for existing user', async () => {
      const result = await authService.initiatePasswordReset(testEmail);
      
      expect(result.success).toBe(true);
      expect(result.resetToken).toBeDefined();
      expect(result.userId).toBe(testUserId);
      
      resetToken = result.resetToken!;
    });

    it('should not reveal if user does not exist', async () => {
      const result = await authService.initiatePasswordReset('nonexistent@example.com');
      
      expect(result.success).toBe(true);
      expect(result.resetToken).toBeUndefined();
    });

    it('should store reset token in database', async () => {
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { users } = await import('../../drizzle/schema');
      const userResult = await dbInstance.select().from(users).where(eq(users.id, testUserId)).limit(1);
      const user = userResult[0];

      expect(user.passwordResetToken).toBe(resetToken);
      expect(user.passwordResetExpiry).toBeDefined();
      expect(user.passwordResetExpiry!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should reset password with valid token', async () => {
      const newPassword = 'NewSecurePassword456';
      const result = await authService.resetPassword(resetToken, newPassword);
      
      expect(result.success).toBe(true);
      
      // Verify new password works
      const user = await authService.authenticateUser(testEmail, newPassword);
      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
    });

    it('should clear reset token after successful reset', async () => {
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { users } = await import('../../drizzle/schema');
      const userResult = await dbInstance.select().from(users).where(eq(users.id, testUserId)).limit(1);
      const user = userResult[0];

      expect(user.passwordResetToken).toBeNull();
      expect(user.passwordResetExpiry).toBeNull();
    });

    it('should reject invalid reset token', async () => {
      await expect(
        authService.resetPassword('invalid-token-123', 'NewPassword789')
      ).rejects.toThrow('Invalid or expired reset token');
    });

    it('should reject expired reset token', async () => {
      // Create a new reset token
      const result = await authService.initiatePasswordReset(testEmail);
      const token = result.resetToken!;
      
      // Manually expire the token in database
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const { users } = await import('../../drizzle/schema');
      await dbInstance.update(users).set({
        passwordResetExpiry: new Date(Date.now() - 1000), // Expired 1 second ago
      }).where(eq(users.id, testUserId));

      await expect(
        authService.resetPassword(token, 'NewPassword789')
      ).rejects.toThrow('Reset token has expired');
    });
  });

  describe('Password Change', () => {
    const currentPassword = 'NewSecurePassword456';
    const newPassword = 'AnotherPassword789';

    it('should change password with correct old password', async () => {
      const result = await authService.changePassword(testUserId, currentPassword, newPassword);
      
      expect(result.success).toBe(true);
      
      // Verify new password works
      const user = await authService.authenticateUser(testEmail, newPassword);
      expect(user).toBeDefined();
    });

    it('should reject password change with incorrect old password', async () => {
      await expect(
        authService.changePassword(testUserId, 'WrongOldPassword', 'NewPassword123')
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should reject password change for non-existent user', async () => {
      await expect(
        authService.changePassword(999999, newPassword, 'NewPassword123')
      ).rejects.toThrow('User not found');
    });
  });

  describe('Security', () => {
    it('should not return password in authentication response', async () => {
      const user = await authService.authenticateUser(testEmail, 'AnotherPassword789');
      
      expect((user as any).password).toBeUndefined();
    });

    it('should generate unique reset tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(authService.generateResetToken());
      }
      
      expect(tokens.size).toBe(100); // All tokens should be unique
    });
  });
});
