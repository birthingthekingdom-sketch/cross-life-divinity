import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { courses, lessons, quizQuestions, accessCodes } from "./drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const coursesData = [
  {
    code: "DIV101",
    title: "Evangelism & Outreach",
    description: "Learn effective methods for sharing the Gospel and reaching your community with the message of Christ.",
    colorTheme: "#1a365d",
    totalLessons: 8,
    displayOrder: 1
  },
  {
    code: "DIV102",
    title: "Prayer & Intercession",
    description: "Develop a powerful prayer life and learn the principles of effective intercession.",
    colorTheme: "#4a044e",
    totalLessons: 6,
    displayOrder: 2
  },
  {
    code: "DIV103",
    title: "Church History",
    description: "Explore the rich history of the Christian church from its founding to the present day.",
    colorTheme: "#065f46",
    totalLessons: 10,
    displayOrder: 3
  },
  {
    code: "DIV104",
    title: "Spiritual Gifts",
    description: "Discover and develop your spiritual gifts for effective ministry and service.",
    colorTheme: "#7c2d12",
    totalLessons: 7,
    displayOrder: 4
  },
  {
    code: "DIV105",
    title: "Christian Apologetics",
    description: "Learn to defend your faith with reason, evidence, and biblical truth.",
    colorTheme: "#3730a3",
    totalLessons: 9,
    displayOrder: 5
  },
  {
    code: "DIV106",
    title: "Discipleship & Mentoring",
    description: "Master the art of making disciples and mentoring others in their faith journey.",
    colorTheme: "#0f766e",
    totalLessons: 8,
    displayOrder: 6
  },
  {
    code: "DIV107",
    title: "Worship & Liturgy",
    description: "Understanding the theology and practice of Christian worship across traditions.",
    colorTheme: "#713f12",
    totalLessons: 6,
    displayOrder: 7
  }
];

const lessonsData = [
  // DIV101 - Evangelism & Outreach
  {
    courseCode: "DIV101",
    lessons: [
      {
        title: "Introduction to Evangelism",
        content: "# Introduction to Evangelism\n\nEvangelism is the proclamation of the Christian gospel with the intent to spread the message and teachings of Jesus Christ. This foundational lesson explores the biblical mandate for evangelism and its importance in the life of every believer.\n\n## Key Concepts\n\n### The Great Commission\n\nJesus commanded His disciples in Matthew 28:19-20: \"Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.\"\n\n### Personal Testimony\n\nYour personal story of faith is one of the most powerful tools in evangelism. It's authentic, relatable, and undeniable.\n\n### The Gospel Message\n\nAt its core, the gospel is the good news that:\n- All have sinned and fall short of God's glory (Romans 3:23)\n- The wages of sin is death (Romans 6:23)\n- God loves us and sent His Son to die for our sins (John 3:16)\n- Through faith in Christ, we can have eternal life (Ephesians 2:8-9)\n\n## Practical Application\n\n1. **Pray** for opportunities to share your faith\n2. **Listen** to others and understand their spiritual journey\n3. **Share** your testimony with authenticity and love\n4. **Trust** the Holy Spirit to work in hearts\n\n## Reflection Questions\n\n- When did you first hear the gospel?\n- Who shared it with you?\n- How has your life changed since accepting Christ?",
        lessonOrder: 1
      },
      {
        title: "Understanding Your Audience",
        content: "# Understanding Your Audience\n\nEffective evangelism requires understanding the people you're trying to reach. Different audiences require different approaches while maintaining the same core message.\n\n## Cultural Context\n\nPaul wrote in 1 Corinthians 9:22: \"I have become all things to all people so that by all possible means I might save some.\" This doesn't mean compromising the gospel, but rather presenting it in ways that resonate with different cultures and backgrounds.\n\n## Common Barriers\n\n### Intellectual Barriers\n- Questions about science and faith\n- Historical reliability of Scripture\n- Problem of evil and suffering\n\n### Emotional Barriers\n- Past hurt from churches or Christians\n- Fear of lifestyle changes\n- Sense of unworthiness\n\n### Cultural Barriers\n- Different worldviews\n- Religious background\n- Social and family pressures\n\n## Bridge-Building Strategies\n\n1. **Ask Questions**: Understand where people are coming from\n2. **Find Common Ground**: Start with shared values\n3. **Show Genuine Care**: People don't care what you know until they know you care\n4. **Be Patient**: Conversion is a journey, not always a single moment",
        lessonOrder: 2
      }
    ]
  },
  // DIV102 - Prayer & Intercession
  {
    courseCode: "DIV102",
    lessons: [
      {
        title: "Foundations of Prayer",
        content: "# Foundations of Prayer\n\nPrayer is communication with God—the foundation of our relationship with Him. It's not just asking for things, but engaging in intimate conversation with our Creator.\n\n## What is Prayer?\n\nPrayer encompasses:\n- **Adoration**: Praising God for who He is\n- **Confession**: Admitting our sins and seeking forgiveness\n- **Thanksgiving**: Expressing gratitude for God's blessings\n- **Supplication**: Making requests for ourselves and others\n\n## Biblical Models of Prayer\n\n### The Lord's Prayer (Matthew 6:9-13)\n\nJesus taught His disciples to pray:\n- Honoring God's name\n- Seeking God's kingdom\n- Trusting God for daily needs\n- Seeking and extending forgiveness\n- Requesting spiritual protection\n\n### Jesus' Prayer Life\n\nJesus regularly withdrew to pray (Luke 5:16). If the Son of God needed dedicated prayer time, how much more do we?\n\n## Developing a Prayer Life\n\n1. **Set aside specific time** for prayer daily\n2. **Find a quiet place** free from distractions\n3. **Keep a prayer journal** to track requests and answers\n4. **Pray Scripture** back to God\n5. **Listen** as much as you speak",
        lessonOrder: 1
      }
    ]
  }
];

const quizData = [
  // DIV101 Lesson 1 Quiz
  {
    courseCode: "DIV101",
    lessonOrder: 1,
    questions: [
      {
        question: "What is the Great Commission?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "A command to love one another",
          "A command to make disciples of all nations",
          "A command to build churches",
          "A command to pray without ceasing"
        ]),
        correctAnswer: "A command to make disciples of all nations",
        questionOrder: 1
      },
      {
        question: "According to Romans 3:23, all have sinned and fall short of God's glory.",
        questionType: "true_false",
        options: JSON.stringify(["True", "False"]),
        correctAnswer: "True",
        questionOrder: 2
      },
      {
        question: "What are the three main components of sharing the gospel message?",
        questionType: "short_answer",
        options: null,
        correctAnswer: "Sin, salvation through Christ, and faith/repentance",
        questionOrder: 3
      }
    ]
  },
  // DIV102 Lesson 1 Quiz
  {
    courseCode: "DIV102",
    lessonOrder: 1,
    questions: [
      {
        question: "What does ACTS stand for in prayer?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Adoration, Confession, Thanksgiving, Supplication",
          "Ask, Confess, Thank, Seek",
          "Amen, Christ, Truth, Spirit",
          "Always, Continually, Thankfully, Sincerely"
        ]),
        correctAnswer: "Adoration, Confession, Thanksgiving, Supplication",
        questionOrder: 1
      },
      {
        question: "Jesus taught that we should pray in secret and God will reward us openly.",
        questionType: "true_false",
        options: JSON.stringify(["True", "False"]),
        correctAnswer: "True",
        questionOrder: 2
      }
    ]
  }
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert access code
    console.log("Creating default access code...");
    await db.insert(accessCodes).values({
      code: "CLSD2024",
      isActive: true
    });

    // Insert courses
    console.log("Inserting courses...");
    const insertedCourses = await db.insert(courses).values(coursesData).$returningId();
    
    // Create a map of course codes to IDs
    const courseMap = {};
    coursesData.forEach((course, index) => {
      courseMap[course.code] = insertedCourses[index].id;
    });

    // Insert lessons
    console.log("Inserting lessons...");
    for (const lessonSet of lessonsData) {
      const courseId = courseMap[lessonSet.courseCode];
      if (!courseId) continue;

      for (const lesson of lessonSet.lessons) {
        await db.insert(lessons).values({
          courseId,
          title: lesson.title,
          content: lesson.content,
          lessonOrder: lesson.lessonOrder
        });
      }
    }

    // Insert quiz questions
    console.log("Inserting quiz questions...");
    for (const quizSet of quizData) {
      const courseId = courseMap[quizSet.courseCode];
      if (!courseId) continue;

      // Get the lesson ID
      const courseLessons = await db.select().from(lessons)
        .where(eq(lessons.courseId, courseId));
      
      const lesson = courseLessons.find(l => l.lessonOrder === quizSet.lessonOrder);
      if (!lesson) continue;

      for (const question of quizSet.questions) {
        await db.insert(quizQuestions).values({
          lessonId: lesson.id,
          question: question.question,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          questionOrder: question.questionOrder
        });
      }
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed().catch(console.error);
