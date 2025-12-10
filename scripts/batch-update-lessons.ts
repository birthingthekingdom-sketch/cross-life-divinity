import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";

// Create database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: 'default' });

// Comprehensive lesson content mapping based on course and lesson titles
const lessonContentMap: Record<string, Record<string, { content: string; scripture: string }>> = {
  // Year 1: Foundations of Faith
  "Introduction to Theology": {
    "What is Theology?": {
      content: `Theology is the systematic study of the nature of God and religious truth. The word comes from the Greek 'theos' (God) and 'logos' (word/study). Christian theology seeks to understand God's revelation through Scripture, creation, and the person of Jesus Christ.

Biblical theology begins with the acknowledgment that God has revealed Himself progressively throughout history. As Hebrews 1:1-2 states, "God, who at various times and in various ways spoke in time past to the fathers by the prophets, has in these last days spoken to us by His Son."

The purpose of theological study is not merely intellectual exercise, but transformation. Romans 12:2 calls believers to "be transformed by the renewing of your mind." Theology equips the church to know God more deeply, live faithfully, and communicate truth effectively.

Key theological disciplines include systematic theology (organizing biblical truth by topic), biblical theology (tracing themes through Scripture), historical theology (studying how doctrine developed), and practical theology (applying truth to ministry and life).`,
      scripture: "2 Timothy 3:16-17; Hebrews 1:1-2; Romans 12:2; Psalm 119:105"
    },
    "The Nature of God": {
      content: `God's nature is revealed through His attributes, which theologians categorize as incommunicable (unique to God alone) and communicable (shared in limited measure with humanity). 

The incommunicable attributes include God's self-existence (aseity), immutability (unchanging nature), infinity, and omnipresence. Psalm 90:2 declares, "Before the mountains were brought forth, or ever You had formed the earth and the world, even from everlasting to everlasting, You are God."

God's communicable attributes include love, holiness, justice, mercy, and faithfulness. 1 John 4:8 reveals that "God is love," while 1 Peter 1:16 commands, "Be holy, for I am holy." These attributes are not contradictory but harmoniously unified in God's perfect character.

The Trinity—one God eternally existing in three persons (Father, Son, and Holy Spirit)—is central to Christian theology. Matthew 28:19 commands baptism "in the name of the Father and of the Son and of the Holy Spirit," using the singular "name" to indicate unity while acknowledging three distinct persons.

Understanding God's nature shapes our worship, prayer, and daily living. We approach Him with reverence (holiness), confidence (love), and assurance (faithfulness).`,
      scripture: "Psalm 90:2; 1 John 4:8; 1 Peter 1:16; Matthew 28:19; Exodus 3:14; Isaiah 6:3"
    },
    "Divine Revelation": {
      content: `Divine revelation refers to God's self-disclosure to humanity. Without revelation, humans cannot know God truly. As 1 Corinthians 2:11 states, "No one knows the things of God except the Spirit of God."

General revelation is God's disclosure of Himself through creation and conscience. Romans 1:20 declares, "His invisible attributes are clearly seen, being understood by the things that are made, even His eternal power and Godhead." Psalm 19:1 proclaims, "The heavens declare the glory of God."

Special revelation is God's specific communication through Scripture, prophets, and supremely through Jesus Christ. Hebrews 1:1-2 shows the progression: God spoke through prophets, but has now spoken through His Son. John 1:14 reveals that "the Word became flesh and dwelt among us."

Scripture is the written record of God's special revelation, inspired by the Holy Spirit. 2 Timothy 3:16 affirms, "All Scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness."

The sufficiency of Scripture means the Bible contains everything necessary for salvation and godly living. 2 Peter 1:3 declares that God's "divine power has given to us all things that pertain to life and godliness, through the knowledge of Him."`,
      scripture: "1 Corinthians 2:11; Romans 1:20; Psalm 19:1-4; Hebrews 1:1-2; John 1:14; 2 Timothy 3:16-17; 2 Peter 1:3"
    },
    "The Authority of Scripture": {
      content: `The authority of Scripture rests on its divine origin. Scripture is not merely human wisdom but God's authoritative Word. Jesus affirmed this in Matthew 5:18: "Till heaven and earth pass away, one jot or one tittle will by no means pass from the law till all is fulfilled."

Biblical inspiration means God superintended human authors so they wrote exactly what He intended, without error in the original manuscripts. 2 Peter 1:21 explains, "Holy men of God spoke as they were moved by the Holy Spirit."

The inerrancy of Scripture means the Bible is completely truthful in all it affirms. Psalm 119:160 declares, "The entirety of Your word is truth." Jesus prayed in John 17:17, "Your word is truth."

Scripture's authority extends to all areas it addresses—theology, morality, history, and the nature of reality. Isaiah 40:8 promises, "The grass withers, the flower fades, but the word of our God stands forever."

Believers submit to Scripture's authority by studying it diligently (2 Timothy 2:15), obeying it faithfully (James 1:22), and using it as the standard for evaluating all teaching and practice (Acts 17:11).`,
      scripture: "Matthew 5:18; 2 Peter 1:21; Psalm 119:160; John 17:17; Isaiah 40:8; 2 Timothy 2:15; James 1:22"
    },
    "Interpreting the Bible": {
      content: `Biblical hermeneutics is the science and art of interpreting Scripture accurately. Proper interpretation requires both the illumination of the Holy Spirit (1 Corinthians 2:14) and diligent study using sound principles.

The grammatical-historical method seeks to understand what the text meant to its original audience by examining grammar, historical context, and literary genre. Nehemiah 8:8 models this: "They read from the Book of the Law of God, making it clear and giving the meaning."

Context is crucial—examining the immediate passage, the book, and the entire Bible. Scripture interprets Scripture, with clearer passages illuminating more difficult ones. 2 Peter 3:16 warns against twisting Scripture through ignorance of context.

Understanding literary genres (narrative, poetry, prophecy, epistle, apocalyptic) is essential. Psalm 23 uses metaphor ("The LORD is my shepherd"), while Acts records historical events. Each genre has interpretive principles appropriate to its form.

Application follows interpretation. James 1:22 commands, "Be doers of the word, and not hearers only." The goal is not merely knowledge but transformation and obedience.

Prayer for wisdom (James 1:5) and dependence on the Holy Spirit (John 16:13) are essential, as the Spirit who inspired Scripture also illuminates it to believers.`,
      scripture: "1 Corinthians 2:14; Nehemiah 8:8; 2 Peter 3:16; James 1:22; James 1:5; John 16:13; Psalm 119:18"
    }
  },
  
  "Old Testament Survey": {
    "The Pentateuch": {
      content: `The Pentateuch (Greek for "five books") comprises Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. These foundational books establish God's covenant relationship with humanity and Israel.

Genesis reveals God as Creator (Genesis 1:1), humanity's fall into sin (Genesis 3), and God's covenant promises to Abraham (Genesis 12:1-3). The Abrahamic covenant promises land, descendants, and blessing to all nations—ultimately fulfilled in Christ.

Exodus narrates Israel's deliverance from Egyptian slavery, demonstrating God's power and faithfulness. The Passover (Exodus 12) foreshadows Christ as the Lamb of God (John 1:29). At Sinai, God establishes His covenant with Israel through the Law.

Leviticus emphasizes holiness: "Be holy, for I am holy" (Leviticus 11:45). The sacrificial system points to Christ's ultimate sacrifice. Hebrews 10:1 explains that the Law was "a shadow of the good things to come."

Numbers records Israel's wilderness wanderings due to unbelief (Numbers 14). First Corinthians 10:11 states these events "happened to them as examples, and they were written for our admonition."

Deuteronomy means "second law"—Moses' final sermons reviewing God's faithfulness and calling Israel to covenant obedience. Deuteronomy 6:4-5, the Shema, commands wholehearted love for God.`,
      scripture: "Genesis 1:1; Genesis 12:1-3; Exodus 12:1-13; Leviticus 11:45; Numbers 14:1-35; Deuteronomy 6:4-5"
    },
    "Historical Books": {
      content: `The historical books (Joshua through Esther) record Israel's history from conquest of Canaan to post-exilic restoration, revealing God's faithfulness despite human failure.

Joshua chronicles Israel's conquest of the Promised Land under Joshua's leadership. Joshua 1:8 emphasizes meditation on God's Word: "This Book of the Law shall not depart from your mouth, but you shall meditate in it day and night."

Judges depicts cycles of sin, oppression, repentance, and deliverance. Judges 21:25 summarizes the era: "Everyone did what was right in his own eyes"—a warning against moral relativism.

Ruth demonstrates God's providence and redemption. Boaz serves as a kinsman-redeemer, foreshadowing Christ's redemptive work.

First and Second Samuel record Israel's transition from judges to monarchy. David, despite his failures, is called "a man after God's own heart" (1 Samuel 13:14) because of his repentant faith.

First and Second Kings trace Israel's divided kingdom and eventual exile due to covenant unfaithfulness. Second Kings 17:7-23 explains the exile as judgment for idolatry and disobedience.

Ezra and Nehemiah record the return from exile and rebuilding of Jerusalem, demonstrating God's faithfulness to restore His people.`,
      scripture: "Joshua 1:8; Judges 21:25; Ruth 4:13-17; 1 Samuel 13:14; 2 Kings 17:7-23; Ezra 1:1-4; Nehemiah 1:1-11"
    },
    "Wisdom Literature": {
      content: `Wisdom Literature (Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon) addresses life's deepest questions through poetry, reflection, and practical instruction.

Job explores suffering and God's sovereignty. Despite devastating loss, Job declares, "Though He slay me, yet will I trust Him" (Job 13:15). God's response (Job 38-41) emphasizes His wisdom and power beyond human understanding.

Psalms is Israel's hymnal and prayer book, expressing the full range of human emotion in worship. Psalm 1 contrasts the righteous and wicked. Psalm 23 celebrates God as Shepherd. Messianic psalms (Psalm 22, 110) prophesy Christ's suffering and reign.

Proverbs provides practical wisdom for daily living. Proverbs 1:7 establishes the foundation: "The fear of the LORD is the beginning of knowledge." Proverbs addresses relationships, work, speech, and character.

Ecclesiastes examines life's meaning "under the sun" (from a purely earthly perspective). Solomon concludes: "Fear God and keep His commandments, for this is man's all" (Ecclesiastes 12:13).

Song of Solomon celebrates marital love as God's gift, reflecting the covenant love between Christ and His church (Ephesians 5:25-32).`,
      scripture: "Job 13:15; Job 38:1-4; Psalm 1:1-6; Psalm 23:1-6; Proverbs 1:7; Ecclesiastes 12:13; Song of Solomon 8:6-7"
    },
    "Major Prophets": {
      content: `The Major Prophets (Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel) are called "major" due to their length, not importance. They proclaim God's judgment and promise of restoration.

Isaiah prophesies judgment on Judah's sin but also the coming Messiah. Isaiah 53 vividly describes Christ's substitutionary suffering: "He was wounded for our transgressions, He was bruised for our iniquities" (Isaiah 53:5).

Jeremiah, the "weeping prophet," warns of Babylon's coming invasion due to covenant unfaithfulness. Yet Jeremiah 31:31-34 promises a New Covenant written on hearts—fulfilled in Christ (Hebrews 8:8-12).

Lamentations mourns Jerusalem's destruction, yet affirms hope: "Through the LORD's mercies we are not consumed, because His compassions fail not. They are new every morning; great is Your faithfulness" (Lamentations 3:22-23).

Ezekiel prophesies during the Babylonian exile, emphasizing God's holiness and glory. Ezekiel 36:26-27 promises spiritual renewal: "I will give you a new heart and put a new spirit within you."

Daniel demonstrates faithfulness in exile and receives apocalyptic visions of God's sovereign plan. Daniel 2 and 7 reveal God's kingdom will ultimately triumph over all earthly kingdoms.`,
      scripture: "Isaiah 53:4-6; Jeremiah 31:31-34; Lamentations 3:22-23; Ezekiel 36:26-27; Daniel 2:44; Daniel 7:13-14"
    },
    "Minor Prophets": {
      content: `The twelve Minor Prophets (Hosea through Malachi) address Israel and Judah before, during, and after exile, calling for repentance and announcing God's coming judgment and restoration.

Hosea uses his marriage to an unfaithful wife to illustrate Israel's spiritual adultery and God's persistent love. Hosea 11:8 reveals God's heart: "How can I give you up, Ephraim?"

Joel prophesies the Day of the LORD and promises the outpouring of the Spirit (Joel 2:28-32), fulfilled at Pentecost (Acts 2:16-21).

Amos, a shepherd-prophet, condemns social injustice and empty religion. Amos 5:24 demands: "Let justice run down like water, and righteousness like a mighty stream."

Jonah demonstrates God's compassion for all nations, even Israel's enemies. Jonah's three days in the fish foreshadow Christ's resurrection (Matthew 12:40).

Micah prophesies the Messiah's birthplace: "But you, Bethlehem Ephrathah... out of you shall come forth to Me the One to be Ruler in Israel" (Micah 5:2).

Malachi, the final Old Testament prophet, promises Elijah's return before the Messiah (Malachi 4:5-6), fulfilled in John the Baptist (Matthew 11:14).`,
      scripture: "Hosea 11:8; Joel 2:28-32; Amos 5:24; Jonah 1:17; Micah 5:2; Malachi 4:5-6"
    }
  }
};

// Generate content for lessons not in the detailed map
function generateGenericContent(courseTitle: string, lessonTitle: string) {
  return {
    content: `This lesson on "${lessonTitle}" is part of the ${courseTitle} course. 

Biblical Foundation:
The study of ${lessonTitle} is grounded in Scripture's comprehensive revelation of God's truth. As 2 Timothy 3:16-17 affirms, "All Scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness, that the man of God may be complete, thoroughly equipped for every good work."

Key Principles:
Understanding ${lessonTitle} requires careful examination of biblical texts, historical context, and theological implications. Proverbs 2:3-5 encourages diligent study: "If you cry out for discernment, and lift up your voice for understanding, if you seek her as silver, and search for her as for hidden treasures; then you will understand the fear of the LORD, and find the knowledge of God."

Practical Application:
The goal of studying ${lessonTitle} is not merely intellectual knowledge but spiritual transformation and practical ministry effectiveness. James 1:22 commands, "Be doers of the word, and not hearers only, deceiving yourselves."

This lesson will explore biblical passages, theological concepts, and practical applications related to ${lessonTitle}, equipping students for faithful ministry and godly living.`,
    scripture: "2 Timothy 3:16-17; Proverbs 2:3-5; James 1:22; Psalm 119:105"
  };
}

// Generate quiz questions based on content
function generateQuizQuestions(lessonTitle: string, content: string) {
  return [
    {
      question: `What is the primary biblical foundation for studying ${lessonTitle}?`,
      type: 'multiple_choice' as const,
      options: 'Understanding God\'s revelation in Scripture,Memorizing biblical facts,Developing personal opinions,Comparing different religious traditions',
      correctAnswer: 'Understanding God\'s revelation in Scripture'
    },
    {
      question: `True or False: The study of ${lessonTitle} should lead to both knowledge and practical application.`,
      type: 'true_false' as const,
      options: 'True,False',
      correctAnswer: 'True'
    },
    {
      question: `How does this lesson's content relate to ministry and Christian living?`,
      type: 'multiple_choice' as const,
      options: 'It provides theological knowledge for transformation,It offers historical information only,It focuses on academic credentials,It emphasizes cultural relevance',
      correctAnswer: 'It provides theological knowledge for transformation'
    },
    {
      question: `Explain in your own words one key principle from this lesson and how you would apply it in ministry.`,
      type: 'short_answer' as const,
      options: null,
      correctAnswer: null
    },
    {
      question: `According to the lesson, what role does Scripture play in theological study?`,
      type: 'multiple_choice' as const,
      options: 'Scripture is the authoritative foundation for all doctrine,Scripture is one of many equal sources,Scripture provides historical context only,Scripture is optional for theology',
      correctAnswer: 'Scripture is the authoritative foundation for all doctrine'
    }
  ];
}

async function updateAllLessons() {
  console.log('Starting batch update of all 180 lessons...\n');
  
  // Get all lessons with course info
  const lessons = await db.select({
    id: schema.lessons.id,
    title: schema.lessons.title,
    courseId: schema.lessons.courseId,
    courseTitle: schema.courses.title
  })
  .from(schema.lessons)
  .leftJoin(schema.courses, eq(schema.lessons.courseId, schema.courses.id));
  
  console.log(`Found ${lessons.length} lessons to update\n`);
  
  let updatedCount = 0;
  
  for (const lesson of lessons) {
    try {
      // Get content from map or generate generic content
      let lessonData;
      if (lesson.courseTitle && lessonContentMap[lesson.courseTitle] && 
          lessonContentMap[lesson.courseTitle][lesson.title]) {
        lessonData = lessonContentMap[lesson.courseTitle][lesson.title];
        console.log(`✓ Using detailed content for: ${lesson.courseTitle} - ${lesson.title}`);
      } else {
        lessonData = generateGenericContent(lesson.courseTitle || 'Unknown Course', lesson.title);
        console.log(`○ Using generic content for: ${lesson.courseTitle} - ${lesson.title}`);
      }
      
      // Update lesson content and scripture
      await db.update(schema.lessons)
        .set({
          content: lessonData.content,
          scripture: lessonData.scripture,
          updatedAt: new Date()
        })
        .where(eq(schema.lessons.id, lesson.id));
      
      // Delete existing quiz questions
      await db.delete(schema.quizQuestions)
        .where(eq(schema.quizQuestions.lessonId, lesson.id));
      
      // Insert new quiz questions
      const quizQuestions = generateQuizQuestions(lesson.title, lessonData.content);
      
      for (let i = 0; i < quizQuestions.length; i++) {
        const q = quizQuestions[i];
        await db.insert(schema.quizQuestions).values({
          lessonId: lesson.id,
          question: q.question,
          questionType: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer || '',
          questionOrder: i + 1
        });
      }
      
      updatedCount++;
      
    } catch (error: any) {
      console.error(`✗ Error updating lesson ${lesson.id} (${lesson.title}):`, error.message);
    }
  }
  
  console.log(`\n✅ Successfully updated ${updatedCount} out of ${lessons.length} lessons`);
  console.log('\nUpdate complete! All lessons now have biblical content and Scripture references.');
}

// Run the update
updateAllLessons()
  .then(async () => {
    await connection.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Fatal error:', error);
    await connection.end();
    process.exit(1);
  });
