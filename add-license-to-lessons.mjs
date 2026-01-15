#!/usr/bin/env node

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { lessons } from "./drizzle/schema.ts";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function addLicenseToLessons() {
  let pool;
  try {
    pool = mysql.createPool({
      ...config,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    const db = drizzle(pool, { mode: 'default' });

    console.log("📝 Adding license information to lessons...");

    // Get all lessons
    const allLessons = await db.select().from(lessons);
    
    console.log(`Found ${allLessons.length} lessons`);

    // Update each lesson to add license to the end of content
    let updated = 0;
    for (const lesson of allLessons) {
      // Check if license is already in the content
      if (!lesson.content.includes("Licensed to Larry Fisher")) {
        const updatedContent = lesson.content + "\n\n---\n\n**Licensed to Larry Fisher**";
        
        // Update using raw SQL since we can't modify schema
        await pool.query(
          "UPDATE lessons SET content = ? WHERE id = ?",
          [updatedContent, lesson.id]
        );
        updated++;
        console.log(`✅ Updated lesson ${lesson.id}: "${lesson.title}"`);
      }
    }

    console.log(`\n✅ License information added to ${updated} lessons`);
    if (pool) await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding license information:", error);
    if (pool) await pool.end();
    process.exit(1);
  }
}

addLicenseToLessons();
