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
