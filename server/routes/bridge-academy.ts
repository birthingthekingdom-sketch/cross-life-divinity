import { Router } from "express";
import type { Response } from "express";
import * as db from "../db";

const router = Router();

/**
 * GET /api/bridge-academy/student-dashboard
 * Get comprehensive student dashboard data
 */
router.get("/student-dashboard", async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dashboardData = await db.getStudentBridgeAcademyDashboard(userId);
    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

/**
 * GET /api/bridge-academy/courses
 * Get all available Bridge Academy courses
 */
router.get("/courses", async (req: any, res: Response) => {
  try {
    const courses = await db.getAvailableBridgeAcademyCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

/**
 * GET /api/bridge-academy/course/:courseId
 * Get course details with topics and student progress
 */
router.get("/course/:courseId", async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const courseId = parseInt(req.params.courseId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const courses = await db.getAvailableBridgeAcademyCourses();
    const courseData = courses.find(c => c.id === courseId);

    if (!courseData) {
      return res.status(404).json({ error: "Course not found" });
    }

    const topics = await db.getBridgeAcademyTopics(courseId);
    const progress = await db.getStudentCourseProgress(userId, courseId);

    res.json({
      course: courseData,
      topics,
      progress,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

/**
 * GET /api/bridge-academy/course/:courseId/progress
 * Get student's progress for a specific course
 */
router.get("/course/:courseId/progress", async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const courseId = parseInt(req.params.courseId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const progress = await db.getStudentCourseProgress(userId, courseId);
    const quizzes = await db.getStudentCourseQuizSubmissions(userId, courseId);
    const practiceAttempts = await db.getStudentCoursePracticeAttempts(userId, courseId);

    res.json({
      progress,
      recentQuizzes: quizzes.slice(0, 10),
      recentPractice: practiceAttempts.slice(0, 10),
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({ error: "Failed to fetch course progress" });
  }
});

/**
 * GET /api/bridge-academy/course/:courseId/quiz-results
 * Get all quiz results for a course
 */
router.get("/course/:courseId/quiz-results", async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const courseId = parseInt(req.params.courseId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const quizzes = await db.getStudentCourseQuizSubmissions(userId, courseId);
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ error: "Failed to fetch quiz results" });
  }
});

/**
 * GET /api/bridge-academy/course/:courseId/practice-attempts
 * Get all practice attempts for a course
 */
router.get("/course/:courseId/practice-attempts", async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const courseId = parseInt(req.params.courseId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const attempts = await db.getStudentCoursePracticeAttempts(userId, courseId);
    res.json(attempts);
  } catch (error) {
    console.error("Error fetching practice attempts:", error);
    res.status(500).json({ error: "Failed to fetch practice attempts" });
  }
});

export default router;
