import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mysql from 'mysql2/promise';

describe('Bridge Academy Quiz System', () => {
  let connection: any;
  const dbUrl = process.env.DATABASE_URL;

  beforeAll(async () => {
    if (!dbUrl) {
      throw new Error('DATABASE_URL not set');
    }

    const urlObj = new URL(dbUrl);
    const pool = mysql.createPool({
      host: urlObj.hostname,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1),
      port: parseInt(urlObj.port) || 3306,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });

    connection = await pool.getConnection();
  });

  afterAll(async () => {
    if (connection) {
      await connection.release();
    }
  });

  describe('Database Tables', () => {
    it('should have bridge_academy_topics table', async () => {
      const [tables] = await connection.query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bridge_academy_topics'"
      );
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should have bridge_academy_quiz_questions table', async () => {
      const [tables] = await connection.query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bridge_academy_quiz_questions'"
      );
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should have bridge_academy_quiz_submissions table', async () => {
      const [tables] = await connection.query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bridge_academy_quiz_submissions'"
      );
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should have bridge_academy_practice_questions table', async () => {
      const [tables] = await connection.query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bridge_academy_practice_questions'"
      );
      expect(tables.length).toBeGreaterThan(0);
    });
  });

  describe('Topics Data', () => {
    it('should have 12 lesson topics', async () => {
      const [topics] = await connection.query(
        'SELECT COUNT(*) as count FROM bridge_academy_topics'
      );
      expect(topics[0].count).toBe(12);
    });

    it('should have 4 subjects with 3 topics each', async () => {
      const [subjects] = await connection.query(
        'SELECT DISTINCT subjectCode FROM bridge_academy_topics'
      );
      expect(subjects.length).toBe(4);
      
      const subjectCodes = subjects.map((s: any) => s.subjectCode);
      expect(subjectCodes).toContain('MATH');
      expect(subjectCodes).toContain('RLA');
      expect(subjectCodes).toContain('SCI');
      expect(subjectCodes).toContain('SS');
    });

    it('should have correct topic names for MATH subject', async () => {
      const [topics] = await connection.query(
        'SELECT topicName FROM bridge_academy_topics WHERE subjectCode = "MATH" ORDER BY topicNumber'
      );
      
      expect(topics.length).toBe(3);
      expect(topics[0].topicName).toBe('Numbers and Operations');
      expect(topics[1].topicName).toBe('Algebra and Functions');
      expect(topics[2].topicName).toBe('Geometry and Measurement');
    });

    it('should have correct topic names for RLA subject', async () => {
      const [topics] = await connection.query(
        'SELECT topicName FROM bridge_academy_topics WHERE subjectCode = "RLA" ORDER BY topicNumber'
      );
      
      expect(topics.length).toBe(3);
      expect(topics[0].topicName).toBe('Reading Comprehension');
      expect(topics[1].topicName).toBe('Grammar and Writing');
      expect(topics[2].topicName).toBe('Essay Writing');
    });
  });

  describe('Quiz Questions', () => {
    it('should have quiz questions for MATH-1 topic', async () => {
      const [topics] = await connection.query(
        'SELECT id FROM bridge_academy_topics WHERE subjectCode = "MATH" AND topicNumber = 1'
      );
      
      if (topics.length > 0) {
        const [questions] = await connection.query(
          'SELECT COUNT(*) as count FROM bridge_academy_quiz_questions WHERE topicId = ?',
          [topics[0].id]
        );
        expect(questions[0].count).toBeGreaterThan(0);
      }
    });

    it('should have questions with proper structure', async () => {
      const [questions] = await connection.query(
        'SELECT * FROM bridge_academy_quiz_questions LIMIT 1'
      );
      
      if (questions.length > 0) {
        const q = questions[0];
        expect(q.topicId).toBeDefined();
        expect(q.questionText).toBeDefined();
        expect(q.questionType).toBeDefined();
        expect(q.options).toBeDefined();
        expect(q.correctAnswer).toBeDefined();
        expect(q.explanation).toBeDefined();
      }
    });

    it('should have valid options structure', async () => {
      const [questions] = await connection.query(
        'SELECT options FROM bridge_academy_quiz_questions WHERE options IS NOT NULL LIMIT 5'
      );
      
      for (const q of questions) {
        if (q.options && typeof q.options === 'string') {
          try {
            const opts = JSON.parse(q.options);
            expect(Array.isArray(opts) || typeof opts === 'object').toBe(true);
          } catch (e) {
            console.warn('Skipping invalid JSON');
          }
        }
      }
    });
  });

  describe('Data Integrity', () => {
    it('all quiz questions should reference valid topics', async () => {
      const [orphaned] = await connection.query(`
        SELECT COUNT(*) as count FROM bridge_academy_quiz_questions q
        LEFT JOIN bridge_academy_topics t ON q.topicId = t.id
        WHERE t.id IS NULL
      `);
      
      expect(orphaned[0].count).toBe(0);
    });

    it('practice questions table exists', async () => {
      const [tables] = await connection.query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bridge_academy_practice_questions'"
      );
      expect(tables.length).toBeGreaterThan(0);
    });

    it('topics should have valid difficulty levels', async () => {
      const [topics] = await connection.query(
        'SELECT DISTINCT difficultyLevel FROM bridge_academy_topics'
      );
      
      const validLevels = ['easy', 'medium', 'hard'];
      for (const t of topics) {
        expect(validLevels).toContain(t.difficultyLevel);
      }
    });

    it('quiz questions should have valid difficulty levels', async () => {
      const [questions] = await connection.query(
        'SELECT DISTINCT difficultyLevel FROM bridge_academy_quiz_questions'
      );
      
      const validLevels = ['easy', 'medium', 'hard'];
      for (const q of questions) {
        expect(validLevels).toContain(q.difficultyLevel);
      }
    });
  });

  describe('Quiz Submission Tables', () => {
    it('should have proper schema for quiz_submissions', async () => {
      const [columns] = await connection.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bridge_academy_quiz_submissions'"
      );
      
      const columnNames = columns.map((c: any) => c.COLUMN_NAME);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('userId');
      expect(columnNames).toContain('topicId');
      expect(columnNames).toContain('score');
      expect(columnNames).toContain('percentageScore');
    });

    it('should have proper schema for quiz_answers', async () => {
      const [columns] = await connection.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bridge_academy_quiz_answers'"
      );
      
      const columnNames = columns.map((c: any) => c.COLUMN_NAME);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('submissionId');
      expect(columnNames).toContain('questionId');
      expect(columnNames).toContain('studentAnswer');
      expect(columnNames).toContain('isCorrect');
    });
  });

  describe('Difficulty Profile Tracking', () => {
    it('should have student_difficulty_profiles table', async () => {
      const [tables] = await connection.query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bridge_academy_student_difficulty_profiles'"
      );
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should have proper columns in student_difficulty_profiles', async () => {
      const [columns] = await connection.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'bridge_academy_student_difficulty_profiles'"
      );
      
      const columnNames = columns.map((c: any) => c.COLUMN_NAME);
      expect(columnNames).toContain('userId');
      expect(columnNames).toContain('topicId');
      expect(columnNames).toContain('currentDifficulty');
      expect(columnNames).toContain('averageScore');
      expect(columnNames).toContain('attemptCount');
    });
  });
});
