import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import { courses, lessons } from "./drizzle/schema.ts";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("📖 Importing New Testament Survey Lessons...\n");

try {
  // Get the New Testament Survey course
  const [ntCourse] = await db.select().from(courses).where(eq(courses.code, "NEW_TESTAMENT_SURVEY"));
  
  if (!ntCourse) {
    console.error("❌ New Testament Survey course not found!");
    process.exit(1);
  }
  
  console.log(`✅ Found course: ${ntCourse.title} (ID: ${ntCourse.id})\n`);
  
  // Read the full lesson file
  const fullContent = readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8");
  
  // Split into individual lessons
  const lessonSections = fullContent.split(/## Lesson \d+:/);
  
  // Remove the header section
  lessonSections.shift();
  
  const newTestamentLessons = [
    {
      title: "Introduction to the New Testament Canon and Historical Context",
      content: "# Introduction to the New Testament Canon and Historical Context\n\n" + lessonSections[0].split("---")[0].trim(),
      lessonOrder: 1
    },
    {
      title: "The Synoptic Gospels - Matthew, Mark, and Luke",
      content: "# The Synoptic Gospels - Matthew, Mark, and Luke\n\n" + lessonSections[1].split("---")[0].trim(),
      lessonOrder: 2
    },
    {
      title: "The Gospel According to John - The Theological Gospel",
      content: "# The Gospel According to John - The Theological Gospel\n\n" + lessonSections[2].split("---")[0].trim(),
      lessonOrder: 3
    },
    {
      title: "The Acts of the Apostles - The Church's Mission Empowered by the Holy Spirit",
      content: "# The Acts of the Apostles - The Church's Mission Empowered by the Holy Spirit\n\n" + lessonSections[3].split("---")[0].trim(),
      lessonOrder: 4
    },
    {
      title: "Pauline Theology - The Apostle to the Gentiles",
      content: "# Pauline Theology - The Apostle to the Gentiles\n\n" + lessonSections[4].split("---")[0].trim(),
      lessonOrder: 5
    },
    {
      title: "Romans - The Gospel of God's Righteousness",
      content: "# Romans - The Gospel of God's Righteousness\n\n" + lessonSections[5].split("---")[0].trim(),
      lessonOrder: 6
    },
    {
      title: "The Corinthian Correspondence - Addressing Church Dysfunction",
      content: "# The Corinthian Correspondence - Addressing Church Dysfunction\n\n" + lessonSections[6].split("---")[0].trim(),
      lessonOrder: 7
    },
    {
      title: "The Prison Epistles - Ephesians, Philippians, Colossians, Philemon",
      content: "# The Prison Epistles - Ephesians, Philippians, Colossians, Philemon\n\n" + lessonSections[7].split("---")[0].trim(),
      lessonOrder: 8
    },
    {
      title: "The Pastoral Epistles and Hebrews",
      content: "# The Pastoral Epistles and Hebrews\n\n" + lessonSections[8].split("---")[0].trim(),
      lessonOrder: 9
    },
    {
      title: "The General Epistles and Revelation",
      content: "# The General Epistles and Revelation\n\n" + lessonSections[9].split("## Conclusion:")[0].trim(),
      lessonOrder: 10
    }
  ];
  
  // Delete existing lessons for this course
  await db.delete(lessons).where(eq(lessons.courseId, ntCourse.id));
  console.log("🗑️  Cleared existing lessons\n");
  
  // Insert new lessons
  for (const lesson of newTestamentLessons) {
    await db.insert(lessons).values({
      courseId: ntCourse.id,
      title: lesson.title,
      content: lesson.content,
      lessonOrder: lesson.lessonOrder
    });
    
    console.log(`  ✅ Lesson ${lesson.lessonOrder}: ${lesson.title}`);
  }
  
  // Update course total lessons count
  await db.update(courses)
    .set({ totalLessons: newTestamentLessons.length })
    .where(eq(courses.id, ntCourse.id));
  
  console.log(`\n✅ Successfully imported ${newTestamentLessons.length} lessons for New Testament Survey!`);
  console.log(`📊 Course totalLessons updated to ${newTestamentLessons.length}\n`);
  
} catch (error) {
  console.error("❌ Error importing lessons:", error);
  throw error;
} finally {
  await connection.end();
}
