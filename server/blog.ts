import { getDb } from "./db";
// import { blogPosts, blogCategories, users } from "../drizzle/schema";
import { users } from "../drizzle/schema";
import { eq, desc, and, like } from "drizzle-orm";

export async function createBlogCategory(name: string, slug: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [category] = await db.insert(blogCategories).values({
    name,
    slug,
    description,
  });
  return category;
}

export async function getAllBlogCategories() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(blogCategories);
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: number;
  categoryId?: number;
  status?: "draft" | "published" | "archived";
  publishedAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [post] = await db.insert(blogPosts).values({
    ...data,
    status: data.status || "draft",
    publishedAt: data.status === "published" ? data.publishedAt || new Date() : null,
  });
  return post;
}

export async function updateBlogPost(
  id: number,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featuredImage?: string;
    categoryId?: number;
    status?: "draft" | "published" | "archived";
    publishedAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [post] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      content: blogPosts.content,
      excerpt: blogPosts.excerpt,
      featuredImage: blogPosts.featuredImage,
      authorId: blogPosts.authorId,
      authorName: users.name,
      categoryId: blogPosts.categoryId,
      categoryName: blogCategories.name,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(eq(blogPosts.id, id));
  
  return post;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [post] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      content: blogPosts.content,
      excerpt: blogPosts.excerpt,
      featuredImage: blogPosts.featuredImage,
      authorId: blogPosts.authorId,
      authorName: users.name,
      categoryId: blogPosts.categoryId,
      categoryName: blogCategories.name,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(eq(blogPosts.slug, slug));
  
  return post;
}

export async function getAllBlogPosts(filters?: {
  status?: "draft" | "published" | "archived";
  categoryId?: number;
  search?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let query = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      content: blogPosts.content,
      excerpt: blogPosts.excerpt,
      featuredImage: blogPosts.featuredImage,
      authorId: blogPosts.authorId,
      authorName: users.name,
      categoryId: blogPosts.categoryId,
      categoryName: blogCategories.name,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .orderBy(desc(blogPosts.publishedAt));

  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(blogPosts.status, filters.status));
  }
  
  if (filters?.categoryId) {
    conditions.push(eq(blogPosts.categoryId, filters.categoryId));
  }
  
  if (filters?.search) {
    conditions.push(like(blogPosts.title, `%${filters.search}%`));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await query;
}

export async function getPublishedBlogPosts(categoryId?: number) {
  return await getAllBlogPosts({
    status: "published",
    categoryId,
  });
}
