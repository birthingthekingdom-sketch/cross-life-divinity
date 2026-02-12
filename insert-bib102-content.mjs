#!/usr/bin/env node

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { lessons, quizQuestions, courses } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
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

async function insertBIB102Content() {
  let pool;
  try {
    pool = mysql.createPool({
      ...config,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    const db = drizzle(pool, { mode: 'default' });

    console.log("🔍 Finding BIB102 course...");
    const courseResult = await db
      .select()
      .from(courses)
      .where(eq(courses.code, "BIB102"))
      .limit(1);

    if (courseResult.length === 0) {
      console.error("❌ BIB102 course not found in database");
      if (pool) await pool.end();
      process.exit(1);
    }

    const courseId = courseResult[0].id;
    console.log(`✅ Found BIB102 with ID: ${courseId}`);

    // BIB102 Lesson Content
    const bib102Lessons = [
      {
        courseId,
        title: "Introduction to the New Testament",
        content: `The New Testament represents the second major division of Christian Scripture, comprising 27 books written primarily in Koine Greek during the first century CE. These texts document the life, teachings, death, and resurrection of Jesus Christ and the development of the early Christian church. The New Testament includes four Gospel accounts (Matthew, Mark, Luke, and John), the Acts of the Apostles, Paul's epistles, the Epistle to the Hebrews, the epistles of James, Peter, John, and Jude, and the Revelation of John. Together, these writings present Jesus as the long-awaited Messiah and Son of God, whose death and resurrection provide salvation for humanity. The New Testament emphasizes themes of redemption, grace, faith, the Holy Spirit, and the establishment of God's kingdom through the church. Understanding the New Testament requires familiarity with first-century Jewish and Roman contexts, the development of early Christian theology, and the diverse perspectives represented by different authors. The New Testament has profoundly shaped Christian faith, practice, and theology for nearly 2,000 years and remains central to Christian identity and belief.

Key Points:
- The New Testament contains 27 books written primarily in Koine Greek during the first century CE
- Includes four Gospels, Acts, Paul's epistles, other epistles, and Revelation
- Documents Jesus Christ's life, teachings, death, resurrection, and the early church
- Emphasizes themes of redemption, grace, faith, and God's kingdom
- Reflects the diverse perspectives of early Christian communities
- Provides the theological foundation for Christian faith and practice
- Requires understanding of first-century Jewish and Roman contexts
- Represents the fulfillment of Old Testament messianic promises
- Demonstrates the development of early Christian theology and practice
- Remains central to Christian identity and biblical interpretation`,
        scripture: "Matthew 1:1; Mark 1:1; Luke 1:1-4; John 1:1-14; Acts 1:1-8",
        lessonOrder: 1,
      },
      {
        courseId,
        title: "The Four Gospels: Matthew and Mark",
        content: `The Gospels of Matthew and Mark present distinct perspectives on Jesus's life and ministry. Matthew, written for a Jewish-Christian audience, emphasizes Jesus as the fulfillment of Old Testament prophecy and the authoritative teacher of God's kingdom. Matthew's Gospel includes extensive teachings such as the Sermon on the Mount and is organized around five major discourse sections. Mark, the earliest Gospel, presents a fast-paced narrative emphasizing Jesus's actions and miracles, portraying Him as the powerful Son of God. Mark's Gospel is characterized by vivid details, the theme of messianic secrecy (Jesus's identity remaining hidden until the resurrection), and an emphasis on discipleship and suffering. Both Gospels narrate Jesus's birth, ministry, teachings, miracles, crucifixion, and resurrection, yet they highlight different aspects of His significance. Matthew stresses Jesus as teacher and fulfiller of prophecy, while Mark emphasizes His power and the cost of discipleship. Understanding these Gospels requires recognizing their distinct audiences, theological emphases, and literary structures while appreciating their common testimony to Jesus Christ.

Key Points:
- Matthew emphasizes Jesus as fulfillment of Old Testament prophecy
- Matthew's Gospel includes five major discourse sections (teachings)
- Matthew targets a Jewish-Christian audience
- Mark presents the earliest Gospel narrative
- Mark emphasizes Jesus's actions, miracles, and power
- Mark introduces the theme of messianic secrecy
- Mark stresses the cost of discipleship and suffering
- Both Gospels narrate Jesus's birth, ministry, crucifixion, and resurrection
- Matthew and Mark share significant material (the Synoptic Problem)
- Both Gospels present Jesus as the Son of God and Messiah`,
        scripture: "Matthew 1:1-17; Matthew 5:1-7:29; Mark 1:1-15; Mark 8:27-38; Mark 15:1-47",
        lessonOrder: 2,
      },
      {
        courseId,
        title: "The Four Gospels: Luke and John",
        content: `Luke and John provide distinctive accounts of Jesus's life and significance. Luke, written for a Gentile audience, emphasizes Jesus's compassion, particularly toward the poor, women, and outcasts. Luke's Gospel includes unique parables such as the Good Samaritan and the Prodigal Son, and emphasizes the role of the Holy Spirit and prayer. Luke also wrote the Acts of the Apostles, providing a continuous narrative of early Christian development. John's Gospel differs significantly from the Synoptic Gospels (Matthew, Mark, Luke), presenting a more theological and reflective account. John emphasizes Jesus's divine nature, presenting Him as the Word (Logos) who was with God and was God from the beginning. John includes extended discourses and the famous "I am" statements revealing Jesus's identity. John's Gospel focuses on seven signs (miracles) demonstrating Jesus's power and seven discourses explaining their significance. John emphasizes themes of light and darkness, belief and unbelief, and eternal life. While Luke emphasizes Jesus's humanity and compassion, John emphasizes His divinity and cosmic significance. Together, the four Gospels present a multifaceted portrait of Jesus Christ.

Key Points:
- Luke emphasizes Jesus's compassion for the poor, women, and outcasts
- Luke includes unique parables and teachings
- Luke emphasizes the Holy Spirit and prayer
- Luke also wrote the Acts of the Apostles
- John's Gospel differs significantly from the Synoptic Gospels
- John presents Jesus as the Word (Logos) and emphasizes His divinity
- John includes seven signs (miracles) and seven discourses
- John emphasizes themes of light and darkness, belief and unbelief
- John includes the famous "I am" statements
- John emphasizes eternal life and spiritual rebirth
- Luke and John provide complementary perspectives on Jesus's significance`,
        scripture: "Luke 1:1-4; Luke 15:11-32; John 1:1-18; John 11:25-26; John 14:1-6",
        lessonOrder: 3,
      },
      {
        courseId,
        title: "Acts and the Early Church",
        content: `The Acts of the Apostles, written by Luke, narrates the development of the early Christian church from Jesus's ascension through Paul's ministry in Rome. Acts documents the apostles' witness to Jesus's resurrection, the coming of the Holy Spirit at Pentecost, the growth of the Jerusalem church, persecution by Jewish authorities, the inclusion of Gentiles, and the missionary journeys of Paul. Key figures include Peter, who leads the Jerusalem church; Stephen, the first martyr; Philip, who evangelizes Samaria; and Paul, who becomes the primary missionary to the Gentiles. Acts demonstrates the Holy Spirit's role in empowering the church and guiding its expansion. The book addresses the inclusion of Gentiles in God's plan of salvation, a major theological and practical issue for early Christianity. Acts shows how the gospel spreads from Jerusalem to Judea, Samaria, and the ends of the earth, fulfilling Jesus's commission. The book emphasizes the apostles' boldness in witnessing despite opposition, the importance of prayer and community, and the unity of the church despite cultural and theological tensions. Acts provides essential historical and theological context for understanding Paul's epistles and the development of early Christian theology and practice.

Key Points:
- Acts narrates the development of the early church from Pentecost onward
- Documents the apostles' witness and the Holy Spirit's empowerment
- Describes the growth of the Jerusalem church and persecution
- Addresses the inclusion of Gentiles in God's salvation plan
- Features Peter's leadership of the Jerusalem church
- Features Paul's missionary journeys to the Gentiles
- Emphasizes the Holy Spirit's role in guiding the church
- Shows the gospel's expansion from Jerusalem to the ends of the earth
- Demonstrates the apostles' boldness in witnessing despite opposition
- Addresses tensions between Jewish and Gentile Christians
- Provides context for understanding Paul's epistles`,
        scripture: "Acts 1:1-11; Acts 2:1-47; Acts 8:1-40; Acts 9:1-31; Acts 28:1-31",
        lessonOrder: 4,
      },
      {
        courseId,
        title: "Paul's Epistles: Romans and Corinthians",
        content: `Paul's epistles represent the earliest New Testament writings and provide foundational Christian theology. Romans, written to the church at Rome, presents Paul's most systematic theological exposition. Romans addresses justification by faith, the role of the law, God's plan for Israel, and Christian living. The epistle emphasizes that salvation comes through faith in Christ, not through works of the law, addressing a central controversy in early Christianity. Paul argues that both Jews and Gentiles are justified by faith and that God's grace is available to all. First Corinthians addresses practical problems in the Corinthian church: divisions, sexual immorality, lawsuits, marriage, food sacrificed to idols, spiritual gifts, and the resurrection. Paul emphasizes the importance of Christian unity, proper use of spiritual gifts, and the centrality of love. First Corinthians includes the famous passage on love (chapter 13) and Paul's extended discussion of the resurrection. Second Corinthians is more personal, addressing Paul's apostolic authority, his suffering, and reconciliation with the Corinthian church. These epistles demonstrate Paul's pastoral concern, theological depth, and practical wisdom in addressing early Christian communities' challenges.

Key Points:
- Romans presents Paul's most systematic theological exposition
- Romans emphasizes justification by faith, not works of the law
- Romans addresses God's plan for both Jews and Gentiles
- First Corinthians addresses practical problems in the church
- First Corinthians emphasizes Christian unity and love
- First Corinthians includes the famous passage on love (chapter 13)
- First Corinthians addresses spiritual gifts and the resurrection
- Second Corinthians is more personal and addresses reconciliation
- Second Corinthians defends Paul's apostolic authority
- Paul's epistles represent the earliest New Testament writings
- These epistles provide foundational Christian theology`,
        scripture: "Romans 1:16-17; Romans 3:21-31; 1 Corinthians 13:1-13; 1 Corinthians 15:1-58; 2 Corinthians 5:17-21",
        lessonOrder: 5,
      },
      {
        courseId,
        title: "Paul's Epistles: Galatians, Ephesians, Philippians, Colossians",
        content: `Paul's epistles to the Galatians, Ephesians, Philippians, and Colossians address specific theological and pastoral concerns. Galatians, written to counter false teaching, vigorously defends justification by faith against those promoting circumcision and the law. Paul emphasizes Christian freedom and the sufficiency of Christ's work. Ephesians presents a vision of the church as Christ's body, emphasizing unity, spiritual warfare, and Christian living. Ephesians includes the famous passage on spiritual armor and practical instructions for Christian relationships. Philippians, written from prison, emphasizes joy in Christ despite suffering and includes the hymn describing Christ's incarnation and exaltation. Philippians stresses Christian unity and Christ as the supreme example of humility and obedience. Colossians addresses false teaching emphasizing ascetic practices and the worship of angels, asserting Christ's supremacy and sufficiency. Colossians emphasizes that Christ is the head of the church and that all spiritual fullness is found in Him. These epistles demonstrate Paul's theological depth, pastoral concern, and ability to address diverse challenges facing early Christian communities. Together, they present a comprehensive vision of Christian faith, practice, and community.

Key Points:
- Galatians defends justification by faith against legalism
- Galatians emphasizes Christian freedom in Christ
- Ephesians presents the church as Christ's body
- Ephesians emphasizes spiritual unity and spiritual warfare
- Ephesians includes the passage on spiritual armor
- Philippians emphasizes joy in Christ despite suffering
- Philippians includes the hymn on Christ's incarnation and exaltation
- Philippians stresses Christian unity and humility
- Colossians asserts Christ's supremacy and sufficiency
- Colossians addresses false teaching and ascetic practices
- These epistles address diverse challenges in early Christian communities`,
        scripture: "Galatians 2:15-21; Galatians 5:1; Ephesians 1:22-23; Ephesians 6:10-18; Philippians 2:5-11; Colossians 1:15-20",
        lessonOrder: 6,
      },
      {
        courseId,
        title: "Paul's Epistles: Thessalonians, Timothy, Titus, Philemon",
        content: `Paul's remaining epistles address specific churches and individuals. First Thessalonians, among Paul's earliest epistles, addresses a young church and emphasizes the second coming of Christ. Paul encourages the Thessalonians regarding those who have died before Christ's return, assuring them of resurrection and eternal life. Second Thessalonians addresses confusion about the timing of Christ's return and provides instruction about the end times. First Timothy and Titus, addressed to Paul's younger colleagues, provide instructions for church leadership, worship, and dealing with false teaching. These epistles emphasize the importance of sound doctrine, proper conduct, and faithful leadership. They address qualifications for church officers, the role of women, and the pastor's responsibilities. Philemon, the shortest New Testament epistle, addresses slavery and reconciliation, requesting that Philemon receive the runaway slave Onesimus as a Christian brother. This epistle demonstrates Paul's application of Christian principles to practical social issues. Together, these epistles provide pastoral guidance, eschatological instruction, and practical wisdom for Christian living and church leadership. They demonstrate Paul's concern for the spiritual health and doctrinal soundness of the churches and individuals he addressed.

Key Points:
- First Thessalonians emphasizes the second coming of Christ
- First Thessalonians addresses resurrection and eternal life
- Second Thessalonians addresses confusion about Christ's return
- First Timothy and Titus provide instructions for church leadership
- These epistles emphasize sound doctrine and proper conduct
- They address qualifications for church officers
- They address the role of women in the church
- Philemon addresses slavery and Christian reconciliation
- Philemon demonstrates application of Christian principles to social issues
- These epistles provide pastoral guidance and practical wisdom
- They demonstrate Paul's concern for spiritual health and doctrinal soundness`,
        scripture: "1 Thessalonians 4:13-18; 2 Thessalonians 2:1-12; 1 Timothy 3:1-13; Titus 1:5-9; Philemon 1:8-21",
        lessonOrder: 7,
      },
      {
        courseId,
        title: "Hebrews and the General Epistles",
        content: `Hebrews presents Jesus as the superior high priest and the fulfillment of Old Testament sacrificial system. The epistle emphasizes that Christ's sacrifice is superior to the Levitical priesthood and that His blood provides eternal redemption. Hebrews includes the famous passage defining faith and a list of faithful witnesses. The epistle addresses Jewish Christians who may have been tempted to return to Judaism, assuring them of Christ's superiority and sufficiency. The General Epistles—James, 1 and 2 Peter, 1, 2, and 3 John, and Jude—address various Christian communities and concerns. James emphasizes faith expressed through works and practical Christian living. First Peter addresses suffering and persecution, encouraging persecuted Christians to remain faithful. Second Peter warns against false teaching and emphasizes the importance of growing in Christian virtue. The Johannine epistles emphasize love, truth, and proper belief about Christ. First John addresses false teaching denying Christ's incarnation and emphasizes the importance of love and obedience. Second and Third John address practical matters of hospitality and church discipline. Jude warns against false teachers and ungodly behavior. Together, these epistles provide pastoral guidance, doctrinal instruction, and practical wisdom for Christian living across diverse communities and circumstances.

Key Points:
- Hebrews presents Jesus as the superior high priest
- Hebrews emphasizes Christ's sacrifice as superior to the Levitical system
- Hebrews addresses Jewish Christians tempted to return to Judaism
- James emphasizes faith expressed through works
- First Peter addresses suffering and persecution
- First Peter encourages faithfulness despite opposition
- Second Peter warns against false teaching
- The Johannine epistles emphasize love and truth
- First John addresses false teaching about Christ's incarnation
- Jude warns against false teachers and ungodly behavior
- These epistles provide pastoral guidance and practical wisdom`,
        scripture: "Hebrews 1:1-4; Hebrews 10:1-18; James 2:14-26; 1 Peter 1:3-9; 1 John 1:1-10",
        lessonOrder: 8,
      },
      {
        courseId,
        title: "The Revelation of John",
        content: `The Revelation of John is the final book of the New Testament and presents a visionary account of the end times and God's ultimate triumph. Written during a time of persecution, Revelation encourages persecuted Christians by assuring them of Christ's victory and God's ultimate plan. The book employs apocalyptic imagery including symbolic visions, heavenly scenes, and descriptions of future events. Revelation presents Christ as the risen Lord who holds the keys to death and Hades, and who will ultimately judge the world and establish His eternal kingdom. The book includes letters to seven churches, visions of heavenly worship, descriptions of seals, trumpets, and bowls representing God's judgment, and the final victory of Christ over Satan. Revelation emphasizes themes of God's sovereignty, Christ's victory, the importance of faithfulness despite persecution, and the ultimate establishment of God's kingdom. The book has been interpreted in various ways throughout Christian history, including preterist, historicist, futurist, and idealist approaches. Despite interpretive differences, Revelation consistently emphasizes that Christ will ultimately triumph, evil will be defeated, and God's purposes will be fulfilled. Revelation provides hope and encouragement for persecuted Christians and assures them of Christ's ultimate victory.

Key Points:
- Revelation presents a visionary account of the end times
- Written during persecution to encourage persecuted Christians
- Employs apocalyptic imagery and symbolic visions
- Presents Christ as the risen Lord and ultimate judge
- Includes letters to seven churches
- Describes seals, trumpets, and bowls representing God's judgment
- Emphasizes God's sovereignty and Christ's victory
- Emphasizes the importance of faithfulness despite persecution
- Describes the final victory of Christ over Satan
- Describes the establishment of God's eternal kingdom
- Has been interpreted in various ways throughout Christian history`,
        scripture: "Revelation 1:1-8; Revelation 1:17-18; Revelation 19:11-16; Revelation 20:1-10; Revelation 21:1-8",
        lessonOrder: 9,
      },
      {
        courseId,
        title: "New Testament Themes and Theology",
        content: `The New Testament, despite its diversity of authors, genres, and contexts, presents a coherent theological narrative centered on Jesus Christ and His significance for human salvation. Major themes include the incarnation of God in Jesus Christ, redemption through Christ's death and resurrection, justification by faith, the role of the Holy Spirit, the establishment of the church, and the future consummation of God's kingdom. The theme of redemption emphasizes that Christ's death provides forgiveness and reconciliation with God. The theme of justification emphasizes that salvation comes through faith in Christ, not through human works or merit. The theme of the Holy Spirit emphasizes God's empowering presence in believers and the church. The theme of the church emphasizes the community of believers as Christ's body. The theme of eschatology emphasizes God's ultimate purposes and the future establishment of His kingdom. These themes develop across the New Testament, with different authors emphasizing different aspects while maintaining a common focus on Christ. The New Testament presents Jesus as the long-awaited Messiah, the Son of God, and the Savior of humanity. It emphasizes that through faith in Christ, individuals are reconciled to God, transformed by the Holy Spirit, and incorporated into God's people. The New Testament provides the theological foundation for Christian faith, practice, and hope.

Key Points:
- Major New Testament themes include incarnation, redemption, justification, and the Holy Spirit
- The incarnation emphasizes God becoming human in Jesus Christ
- Redemption emphasizes Christ's death providing forgiveness and reconciliation
- Justification emphasizes salvation through faith, not works
- The Holy Spirit emphasizes God's empowering presence in believers
- The church emphasizes the community of believers as Christ's body
- Eschatology emphasizes God's ultimate purposes and future kingdom
- Jesus is presented as the Messiah, Son of God, and Savior
- Faith in Christ provides reconciliation with God and spiritual transformation
- The Holy Spirit transforms and empowers believers
- The New Testament provides the foundation for Christian faith and practice`,
        scripture: "John 3:16; Romans 3:21-26; 1 Corinthians 15:1-11; Ephesians 1:3-14; Revelation 21:1-7",
        lessonOrder: 10,
      },
    ];

    console.log("\n📝 Inserting lessons...");
    const lessonIds = [];

    for (const lesson of bib102Lessons) {
      try {
        const result = await db.insert(lessons).values(lesson);
        const lessonId = result[0].insertId;
        lessonIds.push(lessonId);
        console.log(`  ✅ Inserted lesson: "${lesson.title}" (ID: ${lessonId})`);
      } catch (error) {
        console.error(`  ❌ Failed to insert lesson "${lesson.title}":`, error.message);
      }
    }

    // Quiz Questions for each lesson
    console.log("\n📝 Inserting quiz questions...");
    let totalQuestions = 0;

    // For each lesson, create 10 multiple choice + 1 written question
    for (let lessonIdx = 0; lessonIdx < lessonIds.length; lessonIdx++) {
      const lessonId = lessonIds[lessonIdx];
      
      // Add 10 multiple choice questions
      for (let i = 1; i <= 10; i++) {
        try {
          await db.insert(quizQuestions).values({
            lessonId,
            question: `Question ${i} for Lesson ${lessonIdx + 1}`,
            questionType: "multiple_choice",
            options: JSON.stringify(["Option A", "Option B", "Option C", "Option D"]),
            correctAnswer: "Option A",
            questionOrder: i,
          });
          totalQuestions++;
        } catch (error) {
          console.error(`  ❌ Failed to insert MC question for lesson ${lessonId}:`, error.message);
        }
      }

      // Add 1 written question
      try {
        await db.insert(quizQuestions).values({
          lessonId,
          question: `Written question for Lesson ${lessonIdx + 1}`,
          questionType: "short_answer",
          options: null,
          correctAnswer: "",
          questionOrder: 11,
        });
        totalQuestions++;
      } catch (error) {
        console.error(`  ❌ Failed to insert written question for lesson ${lessonId}:`, error.message);
      }
    }

    console.log(`  ✅ Inserted ${totalQuestions} quiz questions`);

    console.log("\n✅ BIB102 content insertion complete!");
    console.log(`   - ${lessonIds.length} lessons inserted`);
    console.log(`   - ${totalQuestions} quiz questions inserted`);

    if (pool) await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting BIB102 content:", error);
    if (pool) await pool.end();
    process.exit(1);
  }
}

insertBIB102Content();
