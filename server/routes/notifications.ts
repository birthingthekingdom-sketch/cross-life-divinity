import { Router, Request, Response } from 'express';
import {
  sendPracticeTestRecommendation,
  sendCertificateNotification,
  sendMilestoneNotification,
  sendStreakReminder,
  sendWelcomeEmail
} from '../services/emailService';
import { db } from '../db';
import { eq } from 'drizzle-orm';

const router = Router();

// Send practice test recommendation
router.post('/send-practice-test-recommendation', async (req: Request, res: Response) => {
  try {
    const { userId, courseName } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(db.schema.users.id, userId)
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await sendPracticeTestRecommendation(user.email, user.name, courseName);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending practice test recommendation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send certificate notification
router.post('/send-certificate', async (req: Request, res: Response) => {
  try {
    const { userId, courseName, certificateCode } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(db.schema.users.id, userId)
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await sendCertificateNotification(user.email, user.name, courseName, certificateCode);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending certificate notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send milestone notification
router.post('/send-milestone', async (req: Request, res: Response) => {
  try {
    const { userId, milestone, points } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(db.schema.users.id, userId)
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await sendMilestoneNotification(user.email, user.name, milestone, points);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending milestone notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send streak reminder
router.post('/send-streak-reminder', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(db.schema.users.id, userId)
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const streak = await db.query.userStreaks.findFirst({
      where: eq(db.schema.userStreaks.userId, userId)
    });

    if (streak) {
      await sendStreakReminder(user.email, user.name, streak.currentStreak);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending streak reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send welcome email
router.post('/send-welcome', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await db.query.users.findFirst({
      where: eq(db.schema.users.id, userId)
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await sendWelcomeEmail(user.email, user.name);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
