import { Router, Request, Response } from 'express';
import { db } from '../db';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Get student's course progress
router.get('/progress', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Get all courses and student's lesson completion
    const courseProgress = await db.query.courses.findMany({
      with: {
        lessons: {
          columns: { id: true }
        }
      }
    });

    const progressData = await Promise.all(
      courseProgress.map(async (course) => {
        // Get completed lessons for this user
        const completedLessons = await db.query.lessonCompletions.findMany({
          where: and(
            eq(db.schema.lessonCompletions.userId, userId),
            eq(db.schema.lessonCompletions.courseId, course.id)
          )
        });

        const totalLessons = course.lessons.length;
        const completedCount = completedLessons.length;
        const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // Get average score from quizzes
        const quizResults = await db.query.quizResults.findMany({
          where: and(
            eq(db.schema.quizResults.userId, userId),
            eq(db.schema.quizResults.courseId, course.id)
          )
        });

        const averageScore = quizResults.length > 0
          ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
          : 0;

        return {
          courseId: course.id,
          courseName: course.name,
          completedLessons: completedCount,
          totalLessons,
          completionPercentage,
          averageScore
        };
      })
    );

    res.json(progressData);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get practice test results
router.get('/practice-tests/results', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const results = await db.query.practiceTestResults.findMany({
      where: eq(db.schema.practiceTestResults.userId, userId),
      orderBy: (results, { desc }) => [desc(results.completedAt)]
    });

    const formattedResults = results.map(r => ({
      testName: r.testName || 'Practice Test',
      score: Math.round((r.correctAnswers / r.totalQuestions) * 100),
      date: new Date(r.completedAt).toLocaleDateString()
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching practice test results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get diagnostic assessment results
router.get('/diagnostic/results', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const results = await db.query.diagnosticResults.findMany({
      where: eq(db.schema.diagnosticResults.userId, userId)
    });

    const formattedResults = results.map(r => ({
      subject: r.assessmentId, // You may want to join with assessments table
      percentage: r.percentage,
      skillGaps: r.skillGaps ? JSON.parse(r.skillGaps) : []
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching diagnostic results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student's certificates
router.get('/certificates', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const certificates = await db.query.certificates.findMany({
      where: eq(db.schema.certificates.userId, userId),
      with: {
        course: {
          columns: { name: true }
        }
      }
    });

    const formattedCerts = certificates.map(cert => ({
      id: cert.id,
      courseName: cert.course?.name || 'Course',
      certificateCode: cert.certificateCode,
      issueDate: cert.issueDate
    }));

    res.json(formattedCerts);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate certificate for completed course
router.post('/certificates/generate', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { courseId } = req.body;

    // Check if course is completed
    const courseProgress = await db.query.courses.findFirst({
      where: eq(db.schema.courses.id, courseId),
      with: {
        lessons: {
          columns: { id: true }
        }
      }
    });

    if (!courseProgress) return res.status(404).json({ error: 'Course not found' });

    const completedLessons = await db.query.lessonCompletions.findMany({
      where: and(
        eq(db.schema.lessonCompletions.userId, userId),
        eq(db.schema.lessonCompletions.courseId, courseId)
      )
    });

    const completionPercentage = (completedLessons.length / courseProgress.lessons.length) * 100;

    if (completionPercentage < 80) {
      return res.status(400).json({ error: 'Course not completed (requires 80% completion)' });
    }

    // Generate certificate code
    const certificateCode = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create certificate
    const certificate = await db.insert(db.schema.certificates).values({
      userId,
      courseId,
      certificateCode,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year validity
    });

    res.json({
      success: true,
      certificateCode,
      message: 'Certificate generated successfully'
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add practice test recommendation after lesson completion
router.post('/recommend-practice-test', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { courseId, lessonCount } = req.body;

    // Recommend practice test every 5 lessons
    if (lessonCount % 5 === 0) {
      await db.insert(db.schema.courseRecommendations).values({
        userId,
        courseId,
        recommendationType: 'practice_test',
        reason: `You've completed ${lessonCount} lessons. Time to test your knowledge!`
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding recommendation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
