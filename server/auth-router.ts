import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';
import * as authService from './auth-service';
import * as emailService from './email';

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        name: z.string().min(1, 'Name is required'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await authService.registerUser(input.email, input.password, input.name);
        
        // Generate and send verification email
        try {
          const verificationToken = await authService.generateVerificationToken(user.id);
          await emailService.sendEmailVerification(user.email!, user.name || 'Student', verificationToken);
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          // Don't fail registration if email fails
        }

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          message: 'Registration successful! Please check your email to verify your account.',
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Registration failed');
      }
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await authService.authenticateUser(input.email, input.password);
        
        // Create session token using the SDK
        const { sdk } = await import('./_core/sdk');
        const { COOKIE_NAME, ONE_YEAR_MS } = await import('@shared/const');
        const { getSessionCookieOptions } = await import('./_core/cookies');
        
        // Use email as openId for custom auth users if openId doesn't exist
        const openId = user.openId || `email:${user.email}`;
        
        const sessionToken = await sdk.createSessionToken(openId, {
          name: user.name || '',
          expiresInMs: ONE_YEAR_MS,
        });
        
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            openId: openId,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Login failed');
      }
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await authService.initiatePasswordReset(input.email);
        
        // Send password reset email if user exists
        if (result.resetToken && result.userId) {
          try {
            await emailService.sendPasswordResetEmail(input.email, result.resetToken);
          } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
          }
        }

        return { success: true, message: 'If an account exists with that email, a password reset link has been sent.' };
      } catch (error) {
        // Don't reveal if user exists
        return { success: true, message: 'If an account exists with that email, a password reset link has been sent.' };
      }
    }),

  /**
   * Reset password using token
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, 'Reset token is required'),
        newPassword: z.string().min(8, 'Password must be at least 8 characters'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await authService.resetPassword(input.token, input.newPassword);
        return { success: true, message: 'Password has been reset successfully' };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Password reset failed');
      }
    }),

  /**
   * Change password (when authenticated)
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await authService.changePassword(ctx.user.id, input.oldPassword, input.newPassword);
        return { success: true, message: 'Password changed successfully' };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Password change failed');
      }
    }),

  /**
   * Get current user info
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
      role: ctx.user.role,
      emailVerified: ctx.user.emailVerified,
    };
  }),

  /**
   * Verify email using token
   */
  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, 'Verification token is required'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await authService.verifyEmail(input.token);
        return { success: true, message: 'Email verified successfully' };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Email verification failed');
      }
    }),

  /**
   * Resend verification email
   */
  resendVerification: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await authService.resendVerificationEmail(input.email);
        
        if (result.verificationToken) {
          try {
            await emailService.sendEmailVerification(input.email, result.userName || 'Student', result.verificationToken);
          } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
          }
        }

        return { success: true, message: 'Verification email has been sent' };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to resend verification email');
      }
    }),
});
