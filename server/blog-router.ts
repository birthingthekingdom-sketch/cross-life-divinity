import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as blog from "./blog";
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const blogRouter = router({
  // Public procedures
  getPublishedPosts: publicProcedure
    .input(z.object({
      categoryId: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await blog.getPublishedBlogPosts(input?.categoryId);
    }),

  getPostBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input }) => {
      const post = await blog.getBlogPostBySlug(input.slug);
      if (!post || post.status !== 'published') {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog post not found' });
      }
      return post;
    }),

  getCategories: publicProcedure
    .query(async () => {
      return await blog.getAllBlogCategories();
    }),

  // Admin procedures
  getAllPosts: adminProcedure
    .input(z.object({
      status: z.enum(['draft', 'published', 'archived']).optional(),
      categoryId: z.number().optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await blog.getAllBlogPosts(input);
    }),

  getPostById: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const post = await blog.getBlogPostById(input.id);
      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog post not found' });
      }
      return post;
    }),

  createPost: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      content: z.string().min(1),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      categoryId: z.number().optional(),
      status: z.enum(['draft', 'published', 'archived']).default('draft'),
    }))
    .mutation(async ({ ctx, input }) => {
      return await blog.createBlogPost({
        ...input,
        authorId: ctx.user.id,
        publishedAt: input.status === 'published' ? new Date() : undefined,
      });
    }),

  updatePost: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      categoryId: z.number().optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      // If changing to published status, set publishedAt
      const updateData: any = { ...data };
      if (data.status === 'published') {
        updateData.publishedAt = new Date();
      }
      
      await blog.updateBlogPost(id, updateData);
      return { success: true };
    }),

  deletePost: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await blog.deleteBlogPost(input.id);
      return { success: true };
    }),

  createCategory: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await blog.createBlogCategory(input.name, input.slug, input.description);
    }),
});
