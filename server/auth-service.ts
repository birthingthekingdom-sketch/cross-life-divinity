import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import * as db from './db';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Register a new user with email and password
 */
export async function registerUser(email: string, password: string, name: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  
  // Check if user already exists
  const existingUser = await dbInstance.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with email already verified
  const result = await dbInstance.insert(users).values({
    email,
    password: hashedPassword,
    name,
    loginMethod: 'email',
    role: 'user',
    emailVerified: true, // Auto-verify all new users
  });

  const userId = Number(result[0].insertId);
  
  // Fetch and return the created user
  const newUser = await dbInstance.select().from(users).where(eq(users.id, userId)).limit(1);
  return newUser[0];
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  
  // Find user by email
  const userResult = await dbInstance.select().from(users).where(eq(users.email, email)).limit(1);
  if (userResult.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = userResult[0];

  // Verify password
  if (!user.password) {
    throw new Error('User does not have a password set');
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Update last signed in
  await dbInstance.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Initiate password reset flow
 */
export async function initiatePasswordReset(email: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  
  // Find user by email
  const userResult = await dbInstance.select().from(users).where(eq(users.email, email)).limit(1);
  if (userResult.length === 0) {
    // Don't reveal if user exists
    return { success: true };
  }

  const user = userResult[0];

  // Generate reset token
  const resetToken = generateResetToken();
  const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  // Save token to database
  await dbInstance.update(users).set({
    passwordResetToken: resetToken,
    passwordResetExpiry: resetExpiry,
  }).where(eq(users.id, user.id));

  return { success: true, resetToken, userId: user.id };
}

/**
 * Reset password using token
 */
export async function resetPassword(token: string, newPassword: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  const { sql } = await import('drizzle-orm');
  
  // Find user by reset token
  const userResult = await dbInstance.select().from(users).where(eq(users.passwordResetToken, token)).limit(1);
  if (userResult.length === 0) {
    throw new Error('Invalid or expired reset token');
  }

  const user = userResult[0];

  // Check if token is expired
  if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
    throw new Error('Reset token has expired');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await dbInstance.update(users).set({
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpiry: null,
  }).where(eq(users.id, user.id));

  return { success: true };
}

/**
 * Change user password (when authenticated)
 */
export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  
  // Get user
  const userResult = await dbInstance.select().from(users).where(eq(users.id, userId)).limit(1);
  if (userResult.length === 0) {
    throw new Error('User not found');
  }

  const user = userResult[0];

  // Verify old password
  if (!user.password) {
    throw new Error('User does not have a password set');
  }

  const isValid = await verifyPassword(oldPassword, user.password);
  if (!isValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await dbInstance.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));

  return { success: true };
}

/**
 * Generate email verification token and update user
 */
export async function generateVerificationToken(userId: number): Promise<string> {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  
  const verificationToken = generateResetToken(); // Reuse token generation
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24); // 24 hour expiry

  await dbInstance.update(users)
    .set({
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: expiryDate,
    })
    .where(eq(users.id, userId));

  return verificationToken;
}

/**
 * Verify email using token
 */
export async function verifyEmail(token: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  
  // Find user by verification token
  const userResult = await dbInstance.select().from(users)
    .where(eq(users.emailVerificationToken, token))
    .limit(1);

  if (userResult.length === 0) {
    throw new Error('Invalid or expired verification token');
  }

  const user = userResult[0];

  // Check if token has expired
  if (user.emailVerificationExpiry && new Date() > user.emailVerificationExpiry) {
    throw new Error('Verification token has expired');
  }

  // Mark email as verified
  await dbInstance.update(users)
    .set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    })
    .where(eq(users.id, user.id));

  return user;
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new Error('Database not available');

  const { users } = await import('../drizzle/schema');
  
  // Find user by email
  const userResult = await dbInstance.select().from(users).where(eq(users.email, email)).limit(1);
  if (userResult.length === 0) {
    throw new Error('User not found');
  }

  const user = userResult[0];

  // Check if already verified
  if (user.emailVerified) {
    throw new Error('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = await generateVerificationToken(user.id);

  return {
    verificationToken,
    userName: user.name,
  };
}
