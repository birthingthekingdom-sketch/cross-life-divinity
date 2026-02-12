import { getDb } from "./db";
import { chatSessions, chatMessages } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function createChatSession(data: {
  visitorName?: string;
  visitorEmail?: string;
  userId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [session] = await db.insert(chatSessions).values({
    visitorName: data.visitorName,
    visitorEmail: data.visitorEmail,
    userId: data.userId,
    status: "active",
  });
  
  return session;
}

export async function getChatSession(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [session] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.id, id));
  
  return session;
}

export async function getAllChatSessions(status?: "active" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  let query = db.select().from(chatSessions).orderBy(desc(chatSessions.updatedAt));
  
  if (status) {
    query = query.where(eq(chatSessions.status, status)) as any;
  }
  
  return await query;
}

export async function closeChatSession(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(chatSessions).set({ status: "closed" }).where(eq(chatSessions.id, id));
}

export async function createChatMessage(data: {
  sessionId: number;
  senderId?: number;
  senderType: "visitor" | "admin";
  message: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [message] = await db.insert(chatMessages).values(data);
  
  // Update session's updatedAt timestamp
  await db.update(chatSessions)
    .set({ updatedAt: new Date() })
    .where(eq(chatSessions.id, data.sessionId));
  
  return message;
}

export async function getChatMessages(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.createdAt);
}
