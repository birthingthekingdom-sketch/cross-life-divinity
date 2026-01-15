import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get all practice tests
router.get('/api/practice-tests', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT pt.id, pt.title, pt.description, pt.totalQuestions, pt.timeLimit, pt.courseId
      FROM practiceTests pt
      ORDER BY pt.courseId, pt.id
    `);
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching practice tests:', error);
    res.status(500).json({ error: 'Failed to fetch practice tests' });
  }
});

// Get practice test by ID
router.get('/api/practice-tests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT id, title, description, totalQuestions, timeLimit, courseId
      FROM practiceTests
      WHERE id = ?
    `, [id]);
    
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Practice test not found' });
    }
    
    res.json(result[0][0]);
  } catch (error) {
    console.error('Error fetching practice test:', error);
    res.status(500).json({ error: 'Failed to fetch practice test' });
  }
});

// Get questions for a practice test
router.get('/api/practice-tests/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT id, questionText, questionType, options, correctAnswer, explanation
      FROM practiceTestQuestions
      WHERE practiceTestId = ?
      ORDER BY id
    `, [id]);
    
    // Parse JSON options
    const questions = result[0].map((q: any) => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Save practice test result
router.post('/api/practice-tests/results', async (req, res) => {
  try {
    const { practiceTestId, score, totalQuestions, percentage } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await db.query(`
      INSERT INTO practiceTestResults (userId, practiceTestId, score, totalQuestions, percentage)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, practiceTestId, score, totalQuestions, percentage]);

    res.json({ success: true, resultId: result[0].insertId });
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ error: 'Failed to save test result' });
  }
});

// Get user's practice test results
router.get('/api/practice-tests/user/results', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await db.query(`
      SELECT ptr.id, ptr.score, ptr.totalQuestions, ptr.percentage, ptr.completedAt, pt.title
      FROM practiceTestResults ptr
      JOIN practiceTests pt ON ptr.practiceTestId = pt.id
      WHERE ptr.userId = ?
      ORDER BY ptr.completedAt DESC
    `, [userId]);

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
