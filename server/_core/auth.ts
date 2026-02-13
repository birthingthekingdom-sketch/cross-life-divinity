import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { sdk } from './sdk';
import { getSessionCookieOptions } from './cookies';
import { COOKIE_NAME, ONE_YEAR_MS } from '../../shared/const';

export async function handleEmailPasswordLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let openId = user.openId;
    if (!openId) {
      openId = `email_${user.id}`;
      await db.updateUserOpenId(user.id, openId);
    }

    const sessionToken = await sdk.createSessionToken(openId, {
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.email || 'Student',
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });

    if (req.accepts('html')) {
      return res.redirect('/dashboard');
    } else {
      return res.json({ success: true, redirect: '/dashboard' });
    }
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function handleLogout(req: Request, res: Response) {
  try {
    res.clearCookie(COOKIE_NAME);
    
    if (req.accepts('html')) {
      return res.redirect('/');
    } else {
      return res.json({ success: true });
    }
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
