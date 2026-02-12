import { Router, Request, Response } from 'express';
import * as authService from './auth-service';
import { getSessionCookieOptions } from './_core/cookies';
import { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';
import { SignJWT } from 'jose';

const router = Router();

/**
 * Simple login endpoint that doesn't use tRPC
 * POST /api/login
 * Body: { email: string, password: string }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    console.log('[Login API] Login attempt for:', email);

    // Authenticate user
    const user = await authService.authenticateUser(email, password);
    console.log('[Login API] User authenticated:', user.id, user.email);

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const sessionToken = await new SignJWT({
      openId: user.openId,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription_tier: user.subscription_tier || 'none',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1y')
      .sign(secret);

    // Set cookie
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });

    console.log('[Login API] Session cookie set for user:', user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription_tier: user.subscription_tier || 'none',
      },
    });
  } catch (error) {
    console.error('[Login API] Error:', error);

    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

export default router;
