import { Router, Request, Response } from 'express';
import * as db from './db';
import { generateBridgeAcademyDiploma, generateBridgeAcademyTranscript, generateSubjectCertificate } from './bridge-academy-diploma-generator';

const router = Router();

/**
 * Generate Bridge Academy Diploma PDF
 * GET /api/bridge-academy/diploma/:certificateId
 */
router.get('/diploma/:certificateId', async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const dbInstance = await db.getDb();

    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Fetch certificate using raw query
    const [certificate] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_certificates WHERE id = ?',
      [parseInt(certificateId)]
    );

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Fetch user
    const user = await db.getUserById(certificate.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch transcripts
    const [transcripts] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_transcripts WHERE certificateId = ?',
      [certificate.id]
    );

    const subjects = (transcripts as any[]).map((t: any) => ({
      courseCode: t.courseCode,
      courseName: t.courseName,
      score: t.averageScore,
      completionDate: t.completionDate,
      topicsCompleted: t.topicsCompleted,
      totalTopics: t.totalTopics,
    }));

    await generateBridgeAcademyDiploma({
      studentName: user.name || 'Student',
      certificateNumber: certificate.certificateNumber,
      verificationToken: certificate.verificationToken,
      completionDate: certificate.completionDate,
      averageScore: certificate.averageScore,
      subjects,
      schoolName: 'Cross Life School of Divinity',
    }, res);
  } catch (error) {
    console.error('Error generating diploma:', error);
    res.status(500).json({ error: 'Failed to generate diploma' });
  }
});

/**
 * Generate Bridge Academy Transcript PDF
 * GET /api/bridge-academy/transcript/:certificateId
 */
router.get('/transcript/:certificateId', async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const dbInstance = await db.getDb();

    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Fetch certificate
    const [certificate] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_certificates WHERE id = ?',
      [parseInt(certificateId)]
    );

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Fetch user
    const user = await db.getUserById(certificate.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch transcripts
    const [transcripts] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_transcripts WHERE certificateId = ?',
      [certificate.id]
    );

    const subjects = (transcripts as any[]).map((t: any) => ({
      courseCode: t.courseCode,
      courseName: t.courseName,
      score: t.averageScore,
      completionDate: t.completionDate,
      topicsCompleted: t.topicsCompleted,
      totalTopics: t.totalTopics,
    }));

    await generateBridgeAcademyTranscript({
      studentName: user.name || 'Student',
      certificateNumber: certificate.certificateNumber,
      completionDate: certificate.completionDate,
      averageScore: certificate.averageScore,
      subjects,
      schoolName: 'Cross Life School of Divinity',
    }, res);
  } catch (error) {
    console.error('Error generating transcript:', error);
    res.status(500).json({ error: 'Failed to generate transcript' });
  }
});

/**
 * Generate Subject Certificate PDF
 * GET /api/bridge-academy/subject-certificate/:certificateId
 */
router.get('/subject-certificate/:certificateId', async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const dbInstance = await db.getDb();

    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Fetch subject certificate
    const [certificate] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_subject_certificates WHERE id = ?',
      [parseInt(certificateId)]
    );

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Fetch user
    const user = await db.getUserById(certificate.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await generateSubjectCertificate({
      studentName: user.name || 'Student',
      courseCode: certificate.courseCode,
      courseName: certificate.courseName,
      score: certificate.score,
      certificateNumber: certificate.certificateNumber,
      verificationToken: certificate.verificationToken,
      completionDate: certificate.completionDate,
      schoolName: 'Cross Life School of Divinity',
    }, res);
  } catch (error) {
    console.error('Error generating subject certificate:', error);
    res.status(500).json({ error: 'Failed to generate subject certificate' });
  }
});

/**
 * Get all diplomas and certificates for a user
 * GET /api/bridge-academy/my-diplomas
 */
router.get('/my-diplomas', async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Fetch all Bridge Academy certificates for user
    const [certificates] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_certificates WHERE userId = ? ORDER BY issuedAt DESC',
      [userId]
    );

    // Fetch all subject certificates for user
    const [subjectCertificates] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_subject_certificates WHERE userId = ? ORDER BY issuedAt DESC',
      [userId]
    );

    res.json({
      diplomas: (certificates as any[]).map((c: any) => ({
        id: c.id,
        certificateNumber: c.certificateNumber,
        verificationToken: c.verificationToken,
        completionDate: c.completionDate,
        averageScore: c.averageScore,
        issuedAt: c.issuedAt,
      })),
      subjectCertificates: (subjectCertificates as any[]).map((c: any) => ({
        id: c.id,
        courseCode: c.courseCode,
        courseName: c.courseName,
        certificateNumber: c.certificateNumber,
        score: c.score,
        completionDate: c.completionDate,
        issuedAt: c.issuedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching diplomas:', error);
    res.status(500).json({ error: 'Failed to fetch diplomas' });
  }
});

/**
 * Verify a Bridge Academy certificate
 * GET /api/bridge-academy/verify/:token
 */
router.get('/verify/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const dbInstance = await db.getDb();

    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Check diploma certificate
    const [diplomas] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_certificates WHERE verificationToken = ?',
      [token]
    );

    if ((diplomas as any[]).length > 0) {
      const certificate = (diplomas as any[])[0];
      const user = await db.getUserById(certificate.userId);

      return res.json({
        type: 'diploma',
        valid: true,
        studentName: user?.name || 'Student',
        certificateNumber: certificate.certificateNumber,
        completionDate: certificate.completionDate,
        averageScore: certificate.averageScore,
        issuedAt: certificate.issuedAt,
      });
    }

    // Check subject certificate
    const [subjects] = await (dbInstance as any).execute(
      'SELECT * FROM bridge_academy_subject_certificates WHERE verificationToken = ?',
      [token]
    );

    if ((subjects as any[]).length > 0) {
      const certificate = (subjects as any[])[0];
      const user = await db.getUserById(certificate.userId);

      return res.json({
        type: 'subject',
        valid: true,
        studentName: user?.name || 'Student',
        courseCode: certificate.courseCode,
        courseName: certificate.courseName,
        certificateNumber: certificate.certificateNumber,
        score: certificate.score,
        completionDate: certificate.completionDate,
        issuedAt: certificate.issuedAt,
      });
    }

    res.status(404).json({ valid: false, error: 'Certificate not found' });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

export default router;

/**
 * Create Practice Test Result
 * POST /api/bridge-academy/practice-tests
 */
router.post('/practice-tests', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { courseId, testNumber, totalQuestions, score, percentage, timeSpentSeconds, answers } = req.body;

    if (!courseId || !testNumber || !totalQuestions || score === undefined || !percentage || !timeSpentSeconds) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Create practice test record
    const [result] = await (dbInstance as any).execute(
      `INSERT INTO bridge_academy_practice_tests 
       (userId, courseId, testNumber, totalQuestions, score, percentage, timeSpentSeconds) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, courseId, testNumber, totalQuestions, score, percentage, timeSpentSeconds]
    );

    const testId = (result as any).insertId;

    // Store individual answers if provided
    if (answers && Array.isArray(answers)) {
      for (const answer of answers) {
        await (dbInstance as any).execute(
          `INSERT INTO bridge_academy_practice_test_answers 
           (testId, questionId, topicId, userAnswer, isCorrect, timeSpentSeconds) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [testId, answer.questionId, answer.topicId, answer.userAnswer, answer.isCorrect, answer.timeSpentSeconds || 0]
        );
      }
    }

    res.json({ success: true, testId, message: 'Practice test saved successfully' });
  } catch (error) {
    console.error('Error saving practice test:', error);
    res.status(500).json({ error: 'Failed to save practice test' });
  }
});

/**
 * Get Practice Test History for Student
 * GET /api/bridge-academy/practice-tests/:courseId
 */
router.get('/practice-tests/:courseId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { courseId } = req.params;

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [tests] = await (dbInstance as any).execute(
      `SELECT * FROM bridge_academy_practice_tests 
       WHERE userId = ? AND courseId = ? 
       ORDER BY createdAt DESC`,
      [userId, parseInt(courseId)]
    );

    res.json({ success: true, tests });
  } catch (error) {
    console.error('Error fetching practice tests:', error);
    res.status(500).json({ error: 'Failed to fetch practice tests' });
  }
});

/**
 * Get Practice Test Analytics (Score Trends)
 * GET /api/bridge-academy/practice-tests-analytics/:courseId
 */
router.get('/practice-tests-analytics/:courseId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { courseId } = req.params;

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [tests] = await (dbInstance as any).execute(
      `SELECT id, testNumber, score, percentage, timeSpentSeconds, createdAt 
       FROM bridge_academy_practice_tests 
       WHERE userId = ? AND courseId = ? 
       ORDER BY testNumber ASC`,
      [userId, parseInt(courseId)]
    );

    // Calculate analytics
    const testList = tests as any[];
    const averageScore = testList.length > 0 
      ? Math.round(testList.reduce((sum, t) => sum + t.percentage, 0) / testList.length) 
      : 0;
    
    const bestScore = testList.length > 0 
      ? Math.max(...testList.map(t => t.percentage)) 
      : 0;
    
    const improvementTrend = testList.length > 1 
      ? testList[testList.length - 1].percentage - testList[0].percentage 
      : 0;

    res.json({ 
      success: true, 
      tests: testList,
      analytics: {
        totalTests: testList.length,
        averageScore,
        bestScore,
        improvementTrend,
        lastTestDate: testList.length > 0 ? testList[testList.length - 1].createdAt : null
      }
    });
  } catch (error) {
    console.error('Error fetching practice test analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * Create Readiness Assessment
 * POST /api/bridge-academy/readiness-assessments
 */
router.post('/readiness-assessments', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { courseId, score, percentage, strengths, weaknesses } = req.body;

    if (!courseId || score === undefined || !percentage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine readiness level and recommended plan based on score
    let readinessLevel: string;
    let recommendedPlan: string;

    if (percentage >= 80) {
      readinessLevel = 'advanced';
      recommendedPlan = '4week';
    } else if (percentage >= 60) {
      readinessLevel = 'intermediate';
      recommendedPlan = '8week';
    } else {
      readinessLevel = 'beginner';
      recommendedPlan = '12week';
    }

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [result] = await (dbInstance as any).execute(
      `INSERT INTO bridge_academy_readiness_assessments 
       (userId, courseId, score, percentage, readinessLevel, recommendedPlan, strengths, weaknesses) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        courseId, 
        score, 
        percentage, 
        readinessLevel, 
        recommendedPlan,
        JSON.stringify(strengths || []),
        JSON.stringify(weaknesses || [])
      ]
    );

    res.json({ 
      success: true, 
      assessmentId: (result as any).insertId,
      readinessLevel,
      recommendedPlan,
      message: 'Readiness assessment saved successfully'
    });
  } catch (error) {
    console.error('Error saving readiness assessment:', error);
    res.status(500).json({ error: 'Failed to save readiness assessment' });
  }
});

/**
 * Get Latest Readiness Assessment
 * GET /api/bridge-academy/readiness-assessments/:courseId
 */
router.get('/readiness-assessments/:courseId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { courseId } = req.params;

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [assessments] = await (dbInstance as any).execute(
      `SELECT * FROM bridge_academy_readiness_assessments 
       WHERE userId = ? AND courseId = ? 
       ORDER BY createdAt DESC 
       LIMIT 1`,
      [userId, parseInt(courseId)]
    );

    if (!assessments || (assessments as any[]).length === 0) {
      return res.json({ success: true, assessment: null });
    }

    const assessment = (assessments as any[])[0];
    assessment.strengths = JSON.parse(assessment.strengths || '[]');
    assessment.weaknesses = JSON.parse(assessment.weaknesses || '[]');

    res.json({ success: true, assessment });
  } catch (error) {
    console.error('Error fetching readiness assessment:', error);
    res.status(500).json({ error: 'Failed to fetch readiness assessment' });
  }
});

/**
 * Create Study Schedule
 * POST /api/bridge-academy/study-schedules
 */
router.post('/study-schedules', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { courseId, planDuration, startDate, endDate } = req.body;

    if (!courseId || !planDuration || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [result] = await (dbInstance as any).execute(
      `INSERT INTO bridge_academy_study_schedules 
       (userId, courseId, planDuration, startDate, endDate) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, courseId, planDuration, new Date(startDate), new Date(endDate)]
    );

    res.json({ 
      success: true, 
      scheduleId: (result as any).insertId,
      message: 'Study schedule created successfully'
    });
  } catch (error) {
    console.error('Error creating study schedule:', error);
    res.status(500).json({ error: 'Failed to create study schedule' });
  }
});

/**
 * Get Study Schedule
 * GET /api/bridge-academy/study-schedules/:courseId
 */
router.get('/study-schedules/:courseId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { courseId } = req.params;

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [schedules] = await (dbInstance as any).execute(
      `SELECT * FROM bridge_academy_study_schedules 
       WHERE userId = ? AND courseId = ? 
       ORDER BY createdAt DESC 
       LIMIT 1`,
      [userId, parseInt(courseId)]
    );

    if (!schedules || (schedules as any[]).length === 0) {
      return res.json({ success: true, schedule: null });
    }

    res.json({ success: true, schedule: (schedules as any[])[0] });
  } catch (error) {
    console.error('Error fetching study schedule:', error);
    res.status(500).json({ error: 'Failed to fetch study schedule' });
  }
});

/**
 * Create Study Schedule Reminder
 * POST /api/bridge-academy/study-schedule-reminders
 */
router.post('/study-schedule-reminders', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { scheduleId, reminderType, reminderTime } = req.body;

    if (!scheduleId || !reminderType || !reminderTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [result] = await (dbInstance as any).execute(
      `INSERT INTO bridge_academy_study_schedule_reminders 
       (userId, scheduleId, reminderType, reminderTime) 
       VALUES (?, ?, ?, ?)`,
      [userId, scheduleId, reminderType, reminderTime]
    );

    res.json({ 
      success: true, 
      reminderId: (result as any).insertId,
      message: 'Study reminder created successfully'
    });
  } catch (error) {
    console.error('Error creating study reminder:', error);
    res.status(500).json({ error: 'Failed to create study reminder' });
  }
});

/**
 * Get Study Schedule Reminders
 * GET /api/bridge-academy/study-schedule-reminders/:scheduleId
 */
router.get('/study-schedule-reminders/:scheduleId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { scheduleId } = req.params;

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const [reminders] = await (dbInstance as any).execute(
      `SELECT * FROM bridge_academy_study_schedule_reminders 
       WHERE userId = ? AND scheduleId = ?`,
      [userId, parseInt(scheduleId)]
    );

    res.json({ success: true, reminders });
  } catch (error) {
    console.error('Error fetching study reminders:', error);
    res.status(500).json({ error: 'Failed to fetch study reminders' });
  }
});

/**
 * Update Study Schedule Reminder
 * PUT /api/bridge-academy/study-schedule-reminders/:reminderId
 */
router.put('/study-schedule-reminders/:reminderId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { reminderId } = req.params;
    const { isActive, reminderType, reminderTime } = req.body;

    const dbInstance = await db.getDb();
    if (!dbInstance) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (isActive !== undefined) {
      updates.push('isActive = ?');
      values.push(isActive);
    }
    if (reminderType) {
      updates.push('reminderType = ?');
      values.push(reminderType);
    }
    if (reminderTime) {
      updates.push('reminderTime = ?');
      values.push(reminderTime);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(userId);
    values.push(parseInt(reminderId));

    await (dbInstance as any).execute(
      `UPDATE bridge_academy_study_schedule_reminders 
       SET ${updates.join(', ')} 
       WHERE userId = ? AND id = ?`,
      values
    );

    res.json({ success: true, message: 'Reminder updated successfully' });
  } catch (error) {
    console.error('Error updating study reminder:', error);
    res.status(500).json({ error: 'Failed to update study reminder' });
  }
});
