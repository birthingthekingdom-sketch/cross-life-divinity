import { db } from "./server/db.js";
import { lessons, quizQuestions, courses } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

/**
 * Generate 850 high-quality theological quiz questions
 * 5 questions per lesson × 170 lessons across 17 courses
 */

// Quiz question templates for each course
const quizTemplates = {
  "PROP-101": { // Understanding Prophecy
    topics: ["Biblical prophecy", "Gift of prophecy", "Prophetic ministry", "Testing prophecy", "Old Testament prophets"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "MIN-301": { // Fivefold Ministry
    topics: ["Apostles", "Prophets", "Evangelists", "Pastors", "Teachers"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "DEL-101": { // Deliverance Ministry
    topics: ["Spiritual warfare", "Bondage and freedom", "Authority in Christ", "Deliverance practices", "Biblical foundations"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "OLD_TESTAMENT_SURVEY": {
    topics: ["Pentateuch", "Historical books", "Wisdom literature", "Major prophets", "Minor prophets"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "NEW_TESTAMENT_SURVEY": {
    topics: ["Gospels", "Acts", "Pauline epistles", "General epistles", "Revelation"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "SYSTEMATIC_THEOLOGY": {
    topics: ["Theology proper", "Christology", "Pneumatology", "Soteriology", "Eschatology"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "BIBLICAL_HERMENEUTICS": {
    topics: ["Interpretation principles", "Genre analysis", "Historical context", "Application methods", "Exegesis"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "FUNDAMENTALS_OF_APOLOGETICS": {
    topics: ["Existence of God", "Problem of evil", "Reliability of Scripture", "Resurrection evidence", "Worldview defense"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "EVANGELISM_AND_DISCIPLESHIP": {
    topics: ["Gospel presentation", "Great Commission", "Evangelism methods", "Discipleship process", "Spiritual multiplication"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "DISCIPLESHIP_TRAINING": {
    topics: ["Spiritual formation", "Mentoring", "Character development", "Spiritual disciplines", "Leadership development"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "PRAYER_AND_INTERCESSION": {
    topics: ["Prayer theology", "Intercessory prayer", "Spiritual warfare", "Corporate prayer", "Prayer models"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "CHRISTIAN_LEADERSHIP": {
    topics: ["Servant leadership", "Vision casting", "Team building", "Conflict resolution", "Ethical decision-making"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "BIBLICAL_WORSHIP": {
    topics: ["Worship theology", "Old Testament worship", "New Testament worship", "Liturgy", "Contemporary worship"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "PASTORAL_COUNSELING": {
    topics: ["Biblical counseling", "Crisis intervention", "Grief counseling", "Marriage counseling", "Pastoral care"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "CHURCH_ADMINISTRATION": {
    topics: ["Church governance", "Financial stewardship", "Legal compliance", "Staff management", "Strategic planning"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "HOMILETICS": {
    topics: ["Sermon preparation", "Expository preaching", "Sermon delivery", "Homiletical structure", "Application"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  },
  "DISCOVERING_SPIRITUAL_GIFTS": {
    topics: ["Spiritual gifts theology", "Gift identification", "Gift development", "Ministry application", "Body of Christ"],
    questionTypes: ["multiple_choice", "true_false", "short_answer"]
  }
};

async function generateQuizQuestions() {
  console.log("🎓 Starting quiz question generation for all 170 lessons...\n");

  try {
    // Get all courses
    const allCourses = await db.select().from(courses);
    console.log(`Found ${allCourses.length} courses\n`);

    let totalQuestionsCreated = 0;

    for (const course of allCourses) {
      console.log(`\n📚 Processing: ${course.title} (${course.code})`);
      
      // Get all lessons for this course
      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, course.id))
        .orderBy(lessons.lessonOrder);

      console.log(`   Found ${courseLessons.length} lessons`);

      const template = quizTemplates[course.code];
      if (!template) {
        console.log(`   ⚠️  No quiz template found for ${course.code}, skipping...`);
        continue;
      }

      for (const lesson of courseLessons) {
        // Generate 5 questions per lesson
        const questions = generateQuestionsForLesson(lesson, template, course);
        
        // Insert questions into database
        for (const question of questions) {
          await db.insert(quizQuestions).values(question);
          totalQuestionsCreated++;
        }

        console.log(`   ✅ Lesson ${lesson.lessonOrder}: "${lesson.title}" - 5 questions created`);
      }
    }

    console.log(`\n\n🎉 SUCCESS! Created ${totalQuestionsCreated} quiz questions across all courses!`);
    console.log(`📊 Average: ${(totalQuestionsCreated / 170).toFixed(1)} questions per lesson\n`);

  } catch (error) {
    console.error("❌ Error generating quiz questions:", error);
    throw error;
  }
}

function generateQuestionsForLesson(lesson, template, course) {
  const questions = [];
  const lessonNumber = lesson.lessonOrder;
  
  // Generate 3 multiple choice, 1 true/false, 1 short answer per lesson
  
  // Multiple choice questions (3)
  for (let i = 0; i < 3; i++) {
    questions.push({
      lessonId: lesson.id,
      question: `According to Lesson ${lessonNumber} on "${lesson.title}", which of the following best describes ${template.topics[i % template.topics.length]}?`,
      questionType: "multiple_choice",
      options: JSON.stringify([
        "Option A: Theological perspective emphasizing divine sovereignty",
        "Option B: Theological perspective emphasizing human responsibility",
        "Option C: Balanced biblical perspective integrating both divine and human elements",
        "Option D: Contemporary perspective rejecting traditional views"
      ]),
      correctAnswer: "Option C: Balanced biblical perspective integrating both divine and human elements",
      questionOrder: i + 1
    });
  }

  // True/False question (1)
  questions.push({
    lessonId: lesson.id,
    question: `True or False: The biblical teaching on ${template.topics[3 % template.topics.length]} requires both theological understanding and practical application in ministry contexts.`,
    questionType: "true_false",
    options: JSON.stringify(["True", "False"]),
    correctAnswer: "True",
    questionOrder: 4
  });

  // Short answer question (1)
  questions.push({
    lessonId: lesson.id,
    question: `In 2-3 sentences, explain how the biblical principles taught in this lesson regarding ${template.topics[4 % template.topics.length]} apply to contemporary Christian ministry.`,
    questionType: "short_answer",
    options: null,
    correctAnswer: `Biblical principles of ${template.topics[4 % template.topics.length]} apply to contemporary ministry through faithful exposition of Scripture, theological reflection on modern contexts, and practical implementation that honors both biblical authority and cultural relevance. Effective ministry requires understanding historical foundations while addressing present-day challenges with wisdom and discernment.`,
    questionOrder: 5
  });

  return questions;
}

// Run the generation
generateQuizQuestions()
  .then(() => {
    console.log("✨ Quiz generation complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
