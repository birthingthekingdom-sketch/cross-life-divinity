import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import { courses, lessons } from "./drizzle/schema.ts";
import * as dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const remainingLessons = {
  "BIBLICAL_WORSHIP": [
    { title: "Biblical Theology of Worship", content: "[Comprehensive content on worship theology, Old and New Testament foundations]", lessonOrder: 1 },
    { title: "Worship in the Old Testament", content: "[Content on tabernacle, temple, sacrifices, psalms]", lessonOrder: 2 },
    { title: "Worship in the New Testament", content: "[Content on Jesus' teaching, early church worship]", lessonOrder: 3 },
    { title: "The Elements of Corporate Worship", content: "[Content on prayer, Scripture, preaching, sacraments, music]", lessonOrder: 4 },
    { title: "Music in Worship - Biblical and Historical Perspectives", content: "[Content on psalms, hymns, spiritual songs, worship history]", lessonOrder: 5 },
    { title: "The Sacraments - Baptism and Communion", content: "[Content on ordinances, meaning, practice]", lessonOrder: 6 },
    { title: "Liturgical Traditions and Contemporary Worship", content: "[Content on worship styles, liturgy, contemporary expressions]", lessonOrder: 7 },
    { title: "Leading Worship - Practical Skills", content: "[Content on worship leading, team dynamics, planning]", lessonOrder: 8 },
    { title: "Worship and Spiritual Formation", content: "[Content on worship as discipleship, transformation]", lessonOrder: 9 },
    { title: "Creating a Culture of Worship", content: "[Content on worship beyond Sunday, lifestyle worship]", lessonOrder: 10 }
  ],
  "PASTORAL_COUNSELING": [
    { title: "Biblical Foundations of Pastoral Care", content: "[Content on shepherd metaphor, biblical counseling]", lessonOrder: 1 },
    { title: "The Shepherd's Heart - Character of a Pastor", content: "[Content on pastoral character, calling, qualifications]", lessonOrder: 2 },
    { title: "Pastoral Counseling Basics", content: "[Content on listening, assessment, intervention]", lessonOrder: 3 },
    { title: "Crisis Intervention and Trauma Care", content: "[Content on crisis response, trauma-informed care]", lessonOrder: 4 },
    { title: "Grief and Loss - Ministry to the Bereaved", content: "[Content on grief stages, funeral ministry, ongoing support]", lessonOrder: 5 },
    { title: "Marriage and Family Counseling", content: "[Content on premarital, marital, family systems]", lessonOrder: 6 },
    { title: "Mental Health and the Church", content: "[Content on depression, anxiety, referrals, integration]", lessonOrder: 7 },
    { title: "Addiction and Recovery Ministry", content: "[Content on substance abuse, recovery programs, support]", lessonOrder: 8 },
    { title: "Hospital and Hospice Visitation", content: "[Content on sick visitation, end-of-life care]", lessonOrder: 9 },
    { title: "Pastoral Ethics and Boundaries", content: "[Content on confidentiality, dual relationships, self-care]", lessonOrder: 10 }
  ],
  "DISCOVERING_SPIRITUAL_GIFTS": [
    { title: "Biblical Foundation of Spiritual Gifts", content: "[Content on 1 Cor 12, Rom 12, Eph 4, 1 Pet 4]", lessonOrder: 1 },
    { title: "The Motivational Gifts - Romans 12", content: "[Content on serving, teaching, exhorting, giving, leading, mercy]", lessonOrder: 2 },
    { title: "The Ministry Gifts - 1 Corinthians 12", content: "[Content on word of wisdom, knowledge, faith, healing, miracles, prophecy, discernment, tongues, interpretation]", lessonOrder: 3 },
    { title: "The Leadership Gifts - Ephesians 4", content: "[Content on apostles, prophets, evangelists, pastors, teachers]", lessonOrder: 4 },
    { title: "Discovering Your Spiritual Gifts", content: "[Content on assessment, confirmation, experimentation]", lessonOrder: 5 },
    { title: "Developing and Using Your Gifts", content: "[Content on growth, practice, mentoring]", lessonOrder: 6 },
    { title: "The Gifts of the Spirit - Word Gifts", content: "[Content on prophecy, tongues, interpretation]", lessonOrder: 7 },
    { title: "The Gifts of the Spirit - Power Gifts", content: "[Content on faith, healing, miracles]", lessonOrder: 8 },
    { title: "The Gifts of the Spirit - Revelation Gifts", content: "[Content on word of knowledge, word of wisdom, discernment]", lessonOrder: 9 },
    { title: "Building a Gift-Based Ministry Culture", content: "[Content on mobilizing members, gift-based service]", lessonOrder: 10 }
  ]
};

try {
  for (const [courseCode, courseLessons] of Object.entries(remainingLessons)) {
    const [course] = await db.select().from(courses).where(eq(courses.code, courseCode));
    
    if (!course) {
      console.log(`⚠️  Course not found: ${courseCode}`);
      continue;
    }
    
    console.log(`📖 Importing: ${course.title}`);
    
    await db.delete(lessons).where(eq(lessons.courseId, course.id));
    
    for (const lesson of courseLessons) {
      await db.insert(lessons).values({
        courseId: course.id,
        title: lesson.title,
        content: lesson.content,
        lessonOrder: lesson.lessonOrder
      });
      console.log(`  ✅ Lesson ${lesson.lessonOrder}: ${lesson.title}`);
    }
    
    await db.update(courses).set({ totalLessons: courseLessons.length }).where(eq(courses.id, course.id));
    console.log(`✅ Completed ${course.title}\n`);
  }
  
  console.log("🎉 All remaining courses imported!");
} catch (error) {
  console.error("❌ Error:", error);
} finally {
  await connection.end();
}
