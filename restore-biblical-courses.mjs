import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { courses } from "./drizzle/schema.ts";
import * as dotenv from "dotenv";

dotenv.config();

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

const biblicalCourses = [
  {
    code: "BIB101",
    title: "Old Testament Survey",
    description: "A comprehensive overview of the Old Testament, exploring its historical context, major themes, and key figures. Learn about the formation of Israel, the law, prophecy, and God's covenant relationship with His people.",
    colorTheme: "#8B4513",
    totalLessons: 12,
    displayOrder: 8
  },
  {
    code: "BIB102",
    title: "New Testament Survey",
    description: "An in-depth study of the New Testament, covering the life and teachings of Jesus, the early church, Paul's epistles, and the book of Revelation. Understand the fulfillment of Old Testament prophecies and the foundation of Christian faith.",
    colorTheme: "#4169E1",
    totalLessons: 12,
    displayOrder: 9
  }
];

async function restoreCourses() {
  try {
    console.log("Restoring biblical courses...");
    
    for (const course of biblicalCourses) {
      // Check if course already exists
      const existing = await db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.code, course.code)
      });
      
      if (!existing) {
        await db.insert(courses).values(course);
        console.log(`✅ Added ${course.code}: ${course.title}`);
      } else {
        console.log(`⏭️  ${course.code} already exists`);
      }
    }
    
    console.log("✅ Biblical courses restored successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error restoring courses:", error);
    process.exit(1);
  }
}

restoreCourses();
