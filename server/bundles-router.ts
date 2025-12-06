import { z } from "zod";
import { sql } from "drizzle-orm";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as bundlesDb from "./bundles-db";
import * as db from "./db";

export const bundlesRouter = router({
  // ============ Course Bundles ============
  
  createBundle: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      colorTheme: z.string().optional(),
      displayOrder: z.number().optional(),
      courseIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      const bundleId = await bundlesDb.createBundle({
        name: input.name,
        description: input.description,
        icon: input.icon,
        colorTheme: input.colorTheme,
        displayOrder: input.displayOrder,
      });

      // Add courses to bundle if provided
      if (input.courseIds && input.courseIds.length > 0) {
        for (let i = 0; i < input.courseIds.length; i++) {
          await bundlesDb.addCourseToBundle(bundleId, input.courseIds[i], i);
        }
      }

      return { bundleId };
    }),

  getAllBundles: publicProcedure.query(async () => {
    const bundles = await bundlesDb.getAllBundles();
    
    // Get courses for each bundle
    const bundlesWithCourses = await Promise.all(
      bundles.map(async (bundle) => {
        const bundleCourses = await bundlesDb.getBundleCourses(bundle.id);
        const courseIds = bundleCourses.map(bc => bc.courseId);
        const courses = await Promise.all(
          courseIds.map(id => db.getCourseById(id))
        );
        return {
          ...bundle,
          courses: courses.filter(c => c !== undefined),
        };
      })
    );

    return bundlesWithCourses;
  }),

  getActiveBundles: publicProcedure.query(async () => {
    const bundles = await bundlesDb.getActiveBundles();
    
    // Get courses for each bundle
    const bundlesWithCourses = await Promise.all(
      bundles.map(async (bundle) => {
        const bundleCourses = await bundlesDb.getBundleCourses(bundle.id);
        const courseIds = bundleCourses.map(bc => bc.courseId);
        const courses = await Promise.all(
          courseIds.map(id => db.getCourseById(id))
        );
        return {
          ...bundle,
          courses: courses.filter(c => c !== undefined),
        };
      })
    );

    return bundlesWithCourses;
  }),

  getBundleById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const bundle = await bundlesDb.getBundleById(input.id);
      if (!bundle) return null;

      const bundleCourses = await bundlesDb.getBundleCourses(input.id);
      const courseIds = bundleCourses.map(bc => bc.courseId);
      const courses = await Promise.all(
        courseIds.map(id => db.getCourseById(id))
      );

      return {
        ...bundle,
        courses: courses.filter(c => c !== undefined),
      };
    }),

  updateBundle: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      colorTheme: z.string().optional(),
      displayOrder: z.number().optional(),
      isActive: z.boolean().optional(),
      courseIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, courseIds, ...updateData } = input;
      
      await bundlesDb.updateBundle(id, updateData);

      // Update courses if provided
      if (courseIds) {
        // Remove all existing courses
        const existingCourses = await bundlesDb.getBundleCourses(id);
        for (const bc of existingCourses) {
          await bundlesDb.removeCourseFromBundle(id, bc.courseId);
        }

        // Add new courses
        for (let i = 0; i < courseIds.length; i++) {
          await bundlesDb.addCourseToBundle(id, courseIds[i], i);
        }
      }

      return { success: true };
    }),

  deleteBundle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await bundlesDb.deleteBundle(input.id);
      return { success: true };
    }),

  // ============ Learning Paths ============

  createLearningPath: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      goal: z.string().optional(),
      duration: z.string().optional(),
      level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      icon: z.string().optional(),
      colorTheme: z.string().optional(),
      displayOrder: z.number().optional(),
      courses: z.array(z.object({
        courseId: z.number(),
        courseOrder: z.number(),
        isRequired: z.boolean(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const pathId = await bundlesDb.createLearningPath({
        name: input.name,
        description: input.description,
        goal: input.goal,
        duration: input.duration,
        level: input.level,
        icon: input.icon,
        colorTheme: input.colorTheme,
        displayOrder: input.displayOrder,
      });

      // Add courses to path if provided
      if (input.courses && input.courses.length > 0) {
        for (const course of input.courses) {
          await bundlesDb.addCourseToPath(
            pathId,
            course.courseId,
            course.courseOrder,
            course.isRequired
          );
        }
      }

      return { pathId };
    }),

  getAllLearningPaths: publicProcedure.query(async () => {
    const paths = await bundlesDb.getAllLearningPaths();
    
    // Get courses for each path
    const pathsWithCourses = await Promise.all(
      paths.map(async (path) => {
        const pathCourses = await bundlesDb.getPathCourses(path.id);
        const coursesData = await Promise.all(
          pathCourses.map(async (pc) => {
            const course = await db.getCourseById(pc.courseId);
            return course ? {
              ...course,
              courseOrder: pc.courseOrder,
              isRequired: pc.isRequired,
            } : null;
          })
        );
        return {
          ...path,
          courses: coursesData.filter(c => c !== null),
        };
      })
    );

    return pathsWithCourses;
  }),

  getActiveLearningPaths: publicProcedure.query(async () => {
    const paths = await bundlesDb.getActiveLearningPaths();
    
    // Get courses for each path
    const pathsWithCourses = await Promise.all(
      paths.map(async (path) => {
        const pathCourses = await bundlesDb.getPathCourses(path.id);
        const coursesData = await Promise.all(
          pathCourses.map(async (pc) => {
            const course = await db.getCourseById(pc.courseId);
            return course ? {
              ...course,
              courseOrder: pc.courseOrder,
              isRequired: pc.isRequired,
            } : null;
          })
        );
        return {
          ...path,
          courses: coursesData.filter(c => c !== null),
        };
      })
    );

    return pathsWithCourses;
  }),

  getLearningPathById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const path = await bundlesDb.getLearningPathById(input.id);
      if (!path) return null;

      const pathCourses = await bundlesDb.getPathCourses(input.id);
      const coursesData = await Promise.all(
        pathCourses.map(async (pc) => {
          const course = await db.getCourseById(pc.courseId);
          return course ? {
            ...course,
            courseOrder: pc.courseOrder,
            isRequired: pc.isRequired,
          } : null;
        })
      );

      return {
        ...path,
        courses: coursesData.filter(c => c !== null),
      };
    }),

  updateLearningPath: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      goal: z.string().optional(),
      duration: z.string().optional(),
      level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      icon: z.string().optional(),
      colorTheme: z.string().optional(),
      displayOrder: z.number().optional(),
      isActive: z.boolean().optional(),
      courses: z.array(z.object({
        courseId: z.number(),
        courseOrder: z.number(),
        isRequired: z.boolean(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, courses, ...updateData } = input;
      
      await bundlesDb.updateLearningPath(id, updateData);

      // Update courses if provided
      if (courses) {
        // Remove all existing courses
        const existingCourses = await bundlesDb.getPathCourses(id);
        for (const pc of existingCourses) {
          await bundlesDb.removeCourseFromPath(id, pc.courseId);
        }

        // Add new courses
        for (const course of courses) {
          await bundlesDb.addCourseToPath(
            id,
            course.courseId,
            course.courseOrder,
            course.isRequired
          );
        }
      }

      return { success: true };
    }),

  deleteLearningPath: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await bundlesDb.deleteLearningPath(input.id);
      return { success: true };
    }),

  // ============ Learning Path Enrollment ============

  enrollInPath: protectedProcedure
    .input(z.object({ learningPathId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");
      await dbConn.execute(
        sql`INSERT INTO learning_path_enrollments (userId, learningPathId, isActive) 
            VALUES (${ctx.user.id}, ${input.learningPathId}, true)
            ON DUPLICATE KEY UPDATE isActive = true, enrolledAt = CURRENT_TIMESTAMP`
      );
      return { success: true };
    }),

  unenrollFromPath: protectedProcedure
    .input(z.object({ learningPathId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");
      await dbConn.execute(
        sql`UPDATE learning_path_enrollments 
            SET isActive = false 
            WHERE userId = ${ctx.user.id} AND learningPathId = ${input.learningPathId}`
      );
      return { success: true };
    }),

  getMyEnrolledPaths: protectedProcedure
    .query(async ({ ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");
      const enrollments: any = await dbConn.execute(
        sql`SELECT lpe.*, lp.name, lp.description, lp.level, lp.duration, lp.goal
            FROM learning_path_enrollments lpe
            JOIN learning_paths lp ON lpe.learningPathId = lp.id
            WHERE lpe.userId = ${ctx.user.id} AND lpe.isActive = true AND lp.isActive = true
            ORDER BY lpe.enrolledAt DESC`
      );
      return Array.isArray(enrollments) ? enrollments : (enrollments.rows || []);
    }),

  checkPathEnrollment: protectedProcedure
    .input(z.object({ learningPathId: z.number() }))
    .query(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");
      const result: any = await dbConn.execute(
        sql`SELECT * FROM learning_path_enrollments 
            WHERE userId = ${ctx.user.id} 
            AND learningPathId = ${input.learningPathId} 
            AND isActive = true`
      );
      const rows = Array.isArray(result) ? result : (result.rows || []);
      return { enrolled: rows.length > 0 };
    }),
});
