import { Router, Request, Response } from 'express';
import { db } from '../db';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

// Get leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const { filter = 'all' } = req.query;

    let leaderboard = await db.query.leaderboardData.findMany({
      orderBy: (lb, { desc }) => [desc(lb.totalPoints)],
      limit: 100
    });

    // Add rank
    leaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      userRank: index + 1
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user stats
router.get('/user/stats', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Get user streak and points
    const streak = await db.query.userStreaks.findFirst({
      where: eq(db.schema.userStreaks.userId, userId)
    });

    // Get user achievements
    const achievements = await db.query.userAchievements.findMany({
      where: eq(db.schema.userAchievements.userId, userId),
      with: {
        achievement: true
      }
    });

    // Get user rank
    const leaderboard = await db.query.leaderboardData.findMany({
      orderBy: (lb, { desc }) => [desc(lb.totalPoints)]
    });

    const userEntry = leaderboard.find(entry => entry.userId === userId);
    const rank = leaderboard.findIndex(entry => entry.userId === userId) + 1;

    res.json({
      totalPoints: streak?.totalPoints || 0,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      achievements: achievements.map(ua => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        badgeIcon: ua.achievement.badgeIcon,
        pointsReward: ua.achievement.pointsReward,
        unlockedAt: ua.unlockedAt
      })),
      rank
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Award points and check achievements
router.post('/award-points', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { points, activityType } = req.body;

    // Update user streak and points
    let streak = await db.query.userStreaks.findFirst({
      where: eq(db.schema.userStreaks.userId, userId)
    });

    if (!streak) {
      await db.insert(db.schema.userStreaks).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: new Date(),
        totalPoints: points
      });
    } else {
      const today = new Date().toDateString();
      const lastActivity = streak.lastActivityDate?.toDateString();
      const isConsecutive = lastActivity === today || 
        (new Date(streak.lastActivityDate).getTime() + 24 * 60 * 60 * 1000 > Date.now());

      const newStreak = isConsecutive ? streak.currentStreak + 1 : 1;
      const newLongestStreak = Math.max(newStreak, streak.longestStreak);

      await db.update(db.schema.userStreaks)
        .set({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: new Date(),
          totalPoints: (streak.totalPoints || 0) + points
        })
        .where(eq(db.schema.userStreaks.userId, userId));
    }

    // Check for achievements
    const achievementsToCheck = [
      { type: 'first_lesson', achievementId: 1 },
      { type: 'test_taker', achievementId: 7 },
      { type: 'practice_master', achievementId: 3 },
      { type: 'perfect_score', achievementId: 4 }
    ];

    for (const achievement of achievementsToCheck) {
      if (achievement.type === activityType) {
        // Check if user already has this achievement
        const existing = await db.query.userAchievements.findFirst({
          where: and(
            eq(db.schema.userAchievements.userId, userId),
            eq(db.schema.userAchievements.achievementId, achievement.achievementId)
          )
        });

        if (!existing) {
          await db.insert(db.schema.userAchievements).values({
            userId,
            achievementId: achievement.achievementId,
            unlockedAt: new Date()
          });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all achievements
router.get('/achievements', async (req: Request, res: Response) => {
  try {
    const achievements = await db.query.achievements.findMany();
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
