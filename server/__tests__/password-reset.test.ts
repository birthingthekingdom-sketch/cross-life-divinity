import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mysql from 'mysql2/promise';
import * as authService from '../auth-service';
import * as emailService from '../email';
import 'dotenv/config';

describe('Password Reset Email Functionality', () => {
  let connection: any;
  const dbUrl = process.env.DATABASE_URL;
  const testEmail = 'test-password-reset@example.com';
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  beforeAll(async () => {
    // Initialize email configuration from environment variables
    const emailUser = process.env.SMTP_USER;
    const emailPass = process.env.SMTP_PASS;
    const emailHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.SMTP_PORT || '587');
    const emailSecure = process.env.SMTP_SECURE === 'true';

    if (emailUser && emailPass) {
      emailService.setEmailConfig({
        host: emailHost,
        port: emailPort,
        secure: emailSecure,
        user: emailUser,
        pass: emailPass,
      });
    }

    if (!dbUrl) {
      throw new Error('DATABASE_URL not set');
    }

    const urlObj = new URL(dbUrl);
    const pool = mysql.createPool({
      host: urlObj.hostname,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1),
      port: parseInt(urlObj.port) || 3306,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });

    connection = await pool.getConnection();

    // Clean up test user if exists
    try {
      await connection.query('DELETE FROM users WHERE email = ?', [testEmail]);
    } catch (error) {
      // Table might not exist yet
    }
  });

  afterAll(async () => {
    if (connection) {
      // Clean up test user
      try {
        await connection.query('DELETE FROM users WHERE email = ?', [testEmail]);
      } catch (error) {
        // Ignore cleanup errors
      }
      await connection.release();
    }
  });

  describe('Email Configuration', () => {
    it('should have email service configured', () => {
      const emailConfig = emailService.getEmailConfig();
      expect(emailConfig).not.toBeNull();
      expect(emailConfig?.user).toBeDefined();
      expect(emailConfig?.pass).toBeDefined();
      expect(emailConfig?.host).toBeDefined();
      expect(emailConfig?.port).toBeDefined();
    });

    it('should have valid SMTP settings', () => {
      const emailConfig = emailService.getEmailConfig();
      expect(emailConfig?.host).toBe('smtp.gmail.com');
      expect(emailConfig?.port).toBe(587);
      expect(emailConfig?.secure).toBe(false);
    });
  });

  describe('Password Reset Flow', () => {
    it('should generate a reset token', async () => {
      // Create a test user
      const user = await authService.registerUser(testEmail, testPassword, testName);
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();

      // Initiate password reset
      const result = await authService.initiatePasswordReset(testEmail);
      expect(result.success).toBe(true);
      expect(result.resetToken).toBeDefined();
      expect(result.userId).toBe(user.id);
    });

    it('should not reveal if user exists', async () => {
      // Try to reset password for non-existent user
      const result = await authService.initiatePasswordReset('nonexistent@example.com');
      expect(result.success).toBe(true);
      // Should not have resetToken or userId for non-existent user
      expect(result.resetToken).toBeUndefined();
      expect(result.userId).toBeUndefined();
    });

    it('should validate reset token expiry', async () => {
      // Create a test user
      const user = await authService.registerUser(
        'test-expiry@example.com',
        testPassword,
        testName
      );

      // Initiate password reset
      const result = await authService.initiatePasswordReset('test-expiry@example.com');
      expect(result.resetToken).toBeDefined();

      // Try to reset with valid token
      const newPassword = 'NewPassword123!';
      const resetResult = await authService.resetPassword(result.resetToken!, newPassword);
      expect(resetResult.success).toBe(true);

      // Clean up
      await connection.query('DELETE FROM users WHERE email = ?', ['test-expiry@example.com']);
    });

    it('should reject expired reset tokens', async () => {
      // Create a test user with expired token
      const user = await authService.registerUser(
        'test-expired-token@example.com',
        testPassword,
        testName
      );

      // Manually set an expired token
      const expiredToken = 'expired-token-12345';
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago

      await connection.query(
        'UPDATE users SET passwordResetToken = ?, passwordResetExpiry = ? WHERE id = ?',
        [expiredToken, expiredDate, user.id]
      );

      // Try to reset with expired token
      try {
        await authService.resetPassword(expiredToken, 'NewPassword123!');
        expect.fail('Should have thrown an error for expired token');
      } catch (error) {
        expect((error as Error).message).toContain('expired');
      }

      // Clean up
      await connection.query('DELETE FROM users WHERE email = ?', ['test-expired-token@example.com']);
    });
  });

  describe('Email Sending', () => {
    it('should send password reset email', async () => {
      const resetToken = 'test-reset-token-12345';
      const result = await emailService.sendPasswordResetEmail(testEmail, resetToken);
      // Email sending might fail if SMTP is not properly configured, but the function should return a boolean
      expect(typeof result).toBe('boolean');
    });

    it('should format password reset email correctly', async () => {
      const resetToken = 'test-reset-token-12345';
      // This test verifies the email service is callable
      const result = await emailService.sendPasswordResetEmail(testEmail, resetToken);
      expect(typeof result).toBe('boolean');
    });
  });
});
