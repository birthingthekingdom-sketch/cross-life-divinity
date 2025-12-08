import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import { courses, lessons } from "./drizzle/schema.ts";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🗄️  Seeding Cross Life School of Divinity database...\n");

// All 17 courses with proper structure
const coursesData = [
  {
    code: "PROP-101",
    title: "Understanding Prophecy",
    description: "The study of the office and the gift of prophecy, and its role in the life of the believer and the church.",
    colorTheme: "#1e40af",
    totalLessons: 10,
    displayOrder: 1,
    cpdHours: 20
  },
  {
    code: "MIN-301",
    title: "The Fivefold Ministry",
    description: "Understanding the five ministry roles of Apostle, Prophet, Evangelist, Pastor, and Teacher as outlined in Ephesians 4:11.",
    colorTheme: "#7c2d12",
    totalLessons: 10,
    displayOrder: 2,
    cpdHours: 20
  },
  {
    code: "DEL-101",
    title: "Deliverance Ministry",
    description: "Understanding deliverance and its necessity for living a life of freedom in Christ.",
    colorTheme: "#065f46",
    totalLessons: 10,
    displayOrder: 3,
    cpdHours: 20
  },
  {
    code: "OLD_TESTAMENT_SURVEY",
    title: "Old Testament Survey",
    description: "This comprehensive course provides an in-depth exploration of the Old Testament, examining its historical, literary, and theological dimensions.",
    colorTheme: "#6b21a8",
    totalLessons: 10,
    displayOrder: 4,
    cpdHours: 30
  },
  {
    code: "NEW_TESTAMENT_SURVEY",
    title: "New Testament Survey",
    description: "This rigorous course examines the New Testament canon through historical-critical and theological lenses.",
    colorTheme: "#be123c",
    totalLessons: 10,
    displayOrder: 5,
    cpdHours: 30
  },
  {
    code: "SYSTEMATIC_THEOLOGY",
    title: "Systematic Theology",
    description: "This foundational course offers a comprehensive study of Christian doctrine organized by major theological loci.",
    colorTheme: "#0369a1",
    totalLessons: 10,
    displayOrder: 6,
    cpdHours: 40
  },
  {
    code: "BIBLICAL_HERMENEUTICS",
    title: "Biblical Hermeneutics",
    description: "This essential course trains students in the art and science of biblical interpretation.",
    colorTheme: "#a16207",
    totalLessons: 10,
    displayOrder: 7,
    cpdHours: 25
  },
  {
    code: "FUNDAMENTALS_OF_APOLOGETICS",
    title: "Fundamentals of Apologetics",
    description: "This intellectually rigorous course equips students to defend the Christian faith through reasoned arguments.",
    colorTheme: "#4338ca",
    totalLessons: 10,
    displayOrder: 8,
    cpdHours: 25
  },
  {
    code: "EVANGELISM_AND_DISCIPLESHIP",
    title: "Evangelism and Discipleship",
    description: "This practical theology course explores biblical foundations and effective strategies for sharing the gospel.",
    colorTheme: "#15803d",
    totalLessons: 10,
    displayOrder: 9,
    cpdHours: 20
  },
  {
    code: "DISCIPLESHIP_TRAINING",
    title: "Discipleship Training",
    description: "This transformative course provides a comprehensive framework for spiritual formation and leadership development.",
    colorTheme: "#0f766e",
    totalLessons: 10,
    displayOrder: 10,
    cpdHours: 25
  },
  {
    code: "PRAYER_AND_INTERCESSION",
    title: "Prayer and Intercession",
    description: "This spiritually formative course delves into the theology and practice of prayer as the foundation of Christian life.",
    colorTheme: "#7e22ce",
    totalLessons: 10,
    displayOrder: 11,
    cpdHours: 20
  },
  {
    code: "CHRISTIAN_LEADERSHIP",
    title: "Christian Leadership",
    description: "This comprehensive course examines biblical principles and contemporary best practices for effective Christian leadership.",
    colorTheme: "#b91c1c",
    totalLessons: 10,
    displayOrder: 12,
    cpdHours: 30
  },
  {
    code: "WORSHIP_AND_LITURGY",
    title: "Worship and Liturgy",
    description: "This theologically grounded course explores the nature, purpose, and practice of Christian worship.",
    colorTheme: "#0891b2",
    totalLessons: 10,
    displayOrder: 13,
    cpdHours: 20
  },
  {
    code: "PASTORAL_CARE_AND_COUNSELING",
    title: "Pastoral Care and Counseling",
    description: "This integrative course prepares students for the pastoral care and counseling dimensions of ministry.",
    colorTheme: "#059669",
    totalLessons: 10,
    displayOrder: 14,
    cpdHours: 30
  },
  {
    code: "CHURCH_ADMINISTRATION",
    title: "Church Administration",
    description: "This practical course equips ministry leaders with essential skills for effective church management.",
    colorTheme: "#ea580c",
    totalLessons: 10,
    displayOrder: 15,
    cpdHours: 25
  },
  {
    code: "HOMILETICS",
    title: "Homiletics",
    description: "This essential course trains students in the art and craft of biblical preaching.",
    colorTheme: "#dc2626",
    totalLessons: 10,
    displayOrder: 16,
    cpdHours: 30
  },
  {
    code: "SPIRITUAL_GIFTS",
    title: "Spiritual Gifts",
    description: "This empowering course provides a comprehensive exploration of spiritual gifts and their role in the church.",
    colorTheme: "#9333ea",
    totalLessons: 10,
    displayOrder: 17,
    cpdHours: 20
  }
];

// New Testament Survey - Complete 10 lessons
const newTestamentLessons = [
  {
    title: "Introduction to the New Testament Canon and Historical Context",
    content: readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 2:")[0].replace("# New Testament Survey - Complete Seminary-Quality Lessons\n\n", "").replace("## Lesson 1: ", "# "),
    lessonOrder: 1
  },
  {
    title: "The Synoptic Gospels - Matthew, Mark, and Luke",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 2: ")[1].split("## Lesson 3:")[0],
    lessonOrder: 2
  },
  {
    title: "The Gospel According to John - The Theological Gospel",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 3: ")[1].split("## Lesson 4:")[0],
    lessonOrder: 3
  },
  {
    title: "The Acts of the Apostles - The Church's Mission Empowered by the Holy Spirit",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 4: ")[1].split("## Lesson 5:")[0],
    lessonOrder: 4
  },
  {
    title: "Pauline Theology - The Apostle to the Gentiles",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 5: ")[1].split("## Lesson 6:")[0],
    lessonOrder: 5
  },
  {
    title: "Romans - The Gospel of God's Righteousness",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 6: ")[1].split("## Lesson 7:")[0],
    lessonOrder: 6
  },
  {
    title: "The Corinthian Correspondence - Addressing Church Dysfunction",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 7: ")[1].split("## Lesson 8:")[0],
    lessonOrder: 7
  },
  {
    title: "The Prison Epistles - Ephesians, Philippians, Colossians, Philemon",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 8: ")[1].split("## Lesson 9:")[0],
    lessonOrder: 8
  },
  {
    title: "The Pastoral Epistles and Hebrews",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 9: ")[1].split("## Lesson 10:")[0],
    lessonOrder: 9
  },
  {
    title: "The General Epistles and Revelation",
    content: "# " + readFileSync("/home/ubuntu/new-testament-lessons.md", "utf-8").split("## Lesson 10: ")[1].split("## Conclusion:")[0],
    lessonOrder: 10
  }
];

try {
  // Step 1: Insert all courses
  console.log("📚 Creating 17 courses...");
  const insertedCourses = [];
  
  for (const course of coursesData) {
    const [result] = await db.insert(courses).values({
      code: course.code,
      title: course.title,
      description: course.description,
      colorTheme: course.colorTheme,
      totalLessons: course.totalLessons,
      displayOrder: course.displayOrder,
      cpdHours: course.cpdHours
    });
    
    insertedCourses.push({
      id: result.insertId,
      code: course.code,
      title: course.title
    });
    
    console.log(`  ✅ ${course.code}: ${course.title}`);
  }
  
  console.log(`\n✅ Created ${insertedCourses.length} courses\n`);
  
  // Step 2: Insert New Testament Survey lessons
  console.log("📖 Importing New Testament Survey lessons...");
  
  const ntCourse = insertedCourses.find(c => c.code === "NEW_TESTAMENT_SURVEY");
  
  if (ntCourse) {
    for (const lesson of newTestamentLessons) {
      await db.insert(lessons).values({
        courseId: ntCourse.id,
        title: lesson.title,
        content: lesson.content,
        lessonOrder: lesson.lessonOrder
      });
      
      console.log(`  ✅ Lesson ${lesson.lessonOrder}: ${lesson.title.substring(0, 60)}...`);
    }
    
    console.log(`\n✅ Imported ${newTestamentLessons.length} lessons for New Testament Survey\n`);
  }
  
  console.log("🎓 Database seeding complete!");
  console.log("\n📊 Summary:");
  console.log(`   • ${insertedCourses.length} courses created`);
  console.log(`   • ${newTestamentLessons.length} New Testament lessons imported`);
  console.log(`   • ${16 * 10} lessons remaining (16 courses × 10 lessons each)`);
  console.log("\n✨ Next step: Create lessons for remaining 16 courses\n");
  
} catch (error) {
  console.error("❌ Error seeding database:", error);
  throw error;
} finally {
  await connection.end();
}
