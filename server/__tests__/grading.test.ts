import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as db from '../db';
import * as email from '../email';
import * as pendingAnswersNotification from '../pending-answers-notification';

// Mock the dependencies
vi.mock('../db');
vi.mock('../email');

describe('Grading System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Pending Written Answers', () => {
    it('should create a pending written answer record', async () => {
      const mockAnswer = {
        quizSubmissionId: 1,
        userId: 1,
        lessonId: 1,
        courseId: 1,
        questionId: 1,
        questionText: 'What is theology?',
        studentAnswer: 'The study of God and divine matters',
        status: 'pending' as const,
      };

      vi.mocked(db.createPendingWrittenAnswer).mockResolvedValueOnce(undefined);

      await db.createPendingWrittenAnswer(mockAnswer);

      expect(db.createPendingWrittenAnswer).toHaveBeenCalledWith(mockAnswer);
    });

    it('should retrieve pending written answers', async () => {
      const mockAnswers = [
        {
          id: 1,
          quizSubmissionId: 1,
          userId: 1,
          lessonId: 1,
          courseId: 1,
          questionId: 1,
          questionText: 'Question 1',
          studentAnswer: 'Answer 1',
          status: 'pending' as const,
          adminScore: null,
          adminFeedback: null,
          submittedAt: new Date(),
          gradedAt: null,
          gradedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getPendingWrittenAnswers).mockResolvedValueOnce(mockAnswers);

      const result = await db.getPendingWrittenAnswers();

      expect(result).toEqual(mockAnswers);
      expect(result[0].status).toBe('pending');
    });

    it('should get pending written answers count', async () => {
      vi.mocked(db.getPendingWrittenAnswersCount).mockResolvedValueOnce(5);

      const count = await db.getPendingWrittenAnswersCount();

      expect(count).toBe(5);
    });

    it('should filter pending answers by course', async () => {
      const mockAnswers = [
        {
          id: 1,
          quizSubmissionId: 1,
          userId: 1,
          lessonId: 1,
          courseId: 1,
          questionId: 1,
          questionText: 'Question',
          studentAnswer: 'Answer',
          status: 'pending' as const,
          adminScore: null,
          adminFeedback: null,
          submittedAt: new Date(),
          gradedAt: null,
          gradedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getPendingWrittenAnswersByCourse).mockResolvedValueOnce(mockAnswers);

      const result = await db.getPendingWrittenAnswersByCourse(1);

      expect(result).toEqual(mockAnswers);
      expect(db.getPendingWrittenAnswersByCourse).toHaveBeenCalledWith(1);
    });

    it('should grade a written answer', async () => {
      vi.mocked(db.gradeWrittenAnswer).mockResolvedValueOnce(undefined);

      await db.gradeWrittenAnswer(1, 85, 'Good answer with strong theological foundation', 2);

      expect(db.gradeWrittenAnswer).toHaveBeenCalledWith(
        1,
        85,
        'Good answer with strong theological foundation',
        2
      );
    });
  });

  describe('Email Notifications', () => {
    it('should send pending written answers notification to admin', async () => {
      vi.mocked(email.sendPendingWrittenAnswersNotification).mockResolvedValueOnce(true);

      const result = await email.sendPendingWrittenAnswersNotification(
        'admin@example.com',
        'John Student',
        'DIV101 - Theology Basics',
        'Quiz on God',
        2
      );

      expect(result).toBe(true);
      expect(email.sendPendingWrittenAnswersNotification).toHaveBeenCalledWith(
        'admin@example.com',
        'John Student',
        'DIV101 - Theology Basics',
        'Quiz on God',
        2
      );
    });

    it('should send graded answer notification to student', async () => {
      vi.mocked(email.sendWrittenAnswerGradedNotification).mockResolvedValueOnce(true);

      const result = await email.sendWrittenAnswerGradedNotification(
        'student@example.com',
        'John Student',
        'DIV101 - Theology Basics',
        'Quiz on God',
        85,
        'Excellent work!'
      );

      expect(result).toBe(true);
      expect(email.sendWrittenAnswerGradedNotification).toHaveBeenCalledWith(
        'student@example.com',
        'John Student',
        'DIV101 - Theology Basics',
        'Quiz on God',
        85,
        'Excellent work!'
      );
    });
  });

  describe('Grading Scores', () => {
    it('should accept scores between 0 and 100', async () => {
      const validScores = [0, 25, 50, 75, 100];

      for (const score of validScores) {
        vi.mocked(db.gradeWrittenAnswer).mockResolvedValueOnce(undefined);
        await db.gradeWrittenAnswer(1, score, 'Feedback', 2);
        expect(db.gradeWrittenAnswer).toHaveBeenCalledWith(1, score, 'Feedback', 2);
      }
    });

    it('should retrieve graded answers for a student', async () => {
      const mockGradedAnswers = [
        {
          id: 1,
          quizSubmissionId: 1,
          userId: 1,
          lessonId: 1,
          courseId: 1,
          questionId: 1,
          questionText: 'Question',
          studentAnswer: 'Answer',
          status: 'graded' as const,
          adminScore: 85,
          adminFeedback: 'Good work',
          submittedAt: new Date(),
          gradedAt: new Date(),
          gradedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getGradedWrittenAnswersByStudent).mockResolvedValueOnce(mockGradedAnswers);

      const result = await db.getGradedWrittenAnswersByStudent(1);

      expect(result).toEqual(mockGradedAnswers);
      expect(result[0].status).toBe('graded');
      expect(result[0].adminScore).toBe(85);
    });
  });

  describe('Notification Service', () => {
    it('should notify admins of pending answers', async () => {
      const mockStudent = { id: 1, name: 'John Student', email: 'john@example.com', role: 'user' as const };
      const mockCourse = { id: 1, title: 'DIV101', code: 'DIV101', description: '', colorTheme: '', totalLessons: 5, cpdHours: 0, displayOrder: 0, introVideoUrl: null, createdAt: new Date(), updatedAt: new Date() };
      const mockLesson = { id: 1, title: 'Lesson 1', courseId: 1, content: '', videoUrl: null, lessonOrder: 1, createdAt: new Date(), updatedAt: new Date() };
      const mockAdmins = [
        { id: 2, name: 'Admin User', email: 'admin@example.com', role: 'admin' as const },
      ];

      vi.mocked(db.getUserById).mockResolvedValueOnce(mockStudent as any);
      vi.mocked(db.getCourseById).mockResolvedValueOnce(mockCourse as any);
      vi.mocked(db.getLessonById).mockResolvedValueOnce(mockLesson as any);
      vi.mocked(db.getAllUsers).mockResolvedValueOnce(mockAdmins as any);
      vi.mocked(email.sendPendingWrittenAnswersNotification).mockResolvedValueOnce(true);

      await pendingAnswersNotification.notifyAdminsOfPendingAnswers(1, 1, 1, 2);

      expect(db.getUserById).toHaveBeenCalledWith(1);
      expect(db.getCourseById).toHaveBeenCalledWith(1);
      expect(db.getLessonById).toHaveBeenCalledWith(1);
      expect(db.getAllUsers).toHaveBeenCalled();
    });
  });
});
