import { getDb } from '../db';
import { lessons, quizQuestions, courses } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// Enhanced lesson content with theological material
const lessonsEnhancementData = {
  'DIV101': [ // Foundational Theology
    {
      title: 'Introduction to Systematic Theology',
      content: `# Introduction to Systematic Theology

## What is Systematic Theology?
Systematic theology is the discipline of organizing biblical truth into coherent doctrinal categories. Unlike biblical theology which follows the historical progression of Scripture, systematic theology arranges biblical teachings thematically to develop a comprehensive understanding of God's nature, character, and redemptive plan.

### Historical Development
The systematic approach to theology emerged during the medieval period with theologians like Thomas Aquinas, who sought to reconcile faith and reason. The Protestant Reformation brought renewed emphasis on Scripture as the sole authority (sola scriptura), leading to more biblically-grounded systematic theologies by figures such as John Calvin and Martin Luther.

### Key Characteristics
**Coherence**: Systematic theology seeks internal consistency, ensuring that doctrines do not contradict one another.
**Comprehensiveness**: It attempts to address all major Christian doctrines in an organized manner.
**Biblical Foundation**: All doctrines must be grounded in Scripture, the ultimate authority.
**Practical Application**: Theology is not merely academic but should transform how believers live and serve God.

## The Major Doctrinal Categories
1. **Theology Proper**: The study of God's nature, attributes, and existence
2. **Christology**: The person and work of Jesus Christ
3. **Pneumatology**: The doctrine of the Holy Spirit
4. **Soteriology**: The doctrine of salvation
5. **Ecclesiology**: The doctrine of the Church
6. **Eschatology**: The doctrine of end times

## Why Study Systematic Theology?
Understanding biblical doctrine strengthens faith, provides discernment against false teachings, enables effective ministry, and deepens our relationship with God. Systematic theology helps believers develop a biblical worldview that informs every aspect of life and service.

## The Role of Reason and Revelation
While Scripture is the ultimate authority, God has given us the capacity for reason. Systematic theology uses reason to understand and articulate biblical revelation, recognizing that faith and reason are not opposed but complementary. However, reason must always be subject to Scripture's authority.`,
      readingMaterial: `**Primary Texts:**
- Grudem, Wayne. "Systematic Theology: An Introduction to Biblical Doctrine." Zondervan, 2000. (Chapters 1-3)
- Calvin, John. "Institutes of the Christian Religion." Book I, Chapters 1-5

**Supplementary Reading:**
- Erickson, Millard J. "Christian Theology." Baker Academic, 2013. (Introduction)
- Bloesch, Donald G. "A Theology of Word and Spirit." InterVarsity Press, 1992.

**Scripture References:**
- 2 Timothy 2:15 - "Present yourself to God as one approved, a worker who... correctly handles the word of truth"
- Romans 12:2 - "Do not conform to the pattern of this world, but be transformed by the renewing of your mind"`,
      assignment: `**Written Assignment: Personal Theological Reflection**
Write a 2-3 page reflection on how understanding systematic theology can strengthen your personal faith and ministry. Include at least one example of how proper doctrine has helped you or someone you know overcome a spiritual challenge.

**Written Reflection Questions:**
1. How has your understanding of theology changed as a result of this lesson?
2. Which doctrinal category is most important to your personal faith journey and why?

**Due Date:** End of Week 2`,
      quizQuestions: [
        {
          question: 'What is the primary focus of systematic theology?',
          questionType: 'multiple_choice' as const,
          options: ['Organizing biblical truth into coherent doctrinal categories', 'Following the historical progression of Scripture', 'Studying only the Old Testament', 'Developing personal opinions about God'],
          correctAnswer: 'Organizing biblical truth into coherent doctrinal categories'
        },
        {
          question: 'Which theologian is known for seeking to reconcile faith and reason during the medieval period?',
          questionType: 'multiple_choice' as const,
          options: ['Thomas Aquinas', 'Martin Luther', 'John Calvin', 'Augustine'],
          correctAnswer: 'Thomas Aquinas'
        },
        {
          question: 'What does "sola scriptura" mean?',
          questionType: 'multiple_choice' as const,
          options: ['Scripture alone as authority', 'Reason alone is sufficient', 'Tradition is most important', 'Personal experience determines truth'],
          correctAnswer: 'Scripture alone as authority'
        },
        {
          question: 'Which of the following is NOT one of the major doctrinal categories mentioned?',
          questionType: 'multiple_choice' as const,
          options: ['Cosmology', 'Christology', 'Pneumatology', 'Soteriology'],
          correctAnswer: 'Cosmology'
        },
        {
          question: 'What is the relationship between faith and reason in systematic theology?',
          questionType: 'multiple_choice' as const,
          options: ['They are opposed to each other', 'They are complementary, with reason subject to Scripture', 'Reason is superior to faith', 'They are completely separate concerns'],
          correctAnswer: 'They are complementary, with reason subject to Scripture'
        },
        {
          question: 'True or False: Systematic theology seeks to ensure doctrines do not contradict one another.',
          questionType: 'true_false' as const,
          options: null,
          correctAnswer: 'true'
        },
        {
          question: 'What is the purpose of studying systematic theology according to the lesson?',
          questionType: 'short_answer' as const,
          options: null,
          correctAnswer: 'To strengthen faith, provide discernment against false teachings, enable effective ministry, and deepen our relationship with God'
        },
        {
          question: 'Which of the following best describes the goal of systematic theology?',
          questionType: 'multiple_choice' as const,
          options: ['To develop a comprehensive understanding of God and His plan', 'To prove that God does not exist', 'To create new doctrines', 'To replace Scripture with human reasoning'],
          correctAnswer: 'To develop a comprehensive understanding of God and His plan'
        },
        {
          question: 'What is Theology Proper?',
          questionType: 'short_answer' as const,
          options: null,
          correctAnswer: 'The study of God\'s nature, attributes, and existence'
        },
        {
          question: 'According to the lesson, systematic theology should transform how believers:',
          questionType: 'multiple_choice' as const,
          options: ['Live and serve God', 'Earn money', 'Gain political power', 'Avoid reading Scripture'],
          correctAnswer: 'Live and serve God'
        },
        {
          question: 'True or False: Scripture is the ultimate authority in systematic theology.',
          questionType: 'true_false' as const,
          options: null,
          correctAnswer: 'true'
        },
        {
          question: 'What is the main difference between biblical theology and systematic theology?',
          questionType: 'short_answer' as const,
          options: null,
          correctAnswer: 'Biblical theology follows the historical progression of Scripture, while systematic theology arranges teachings thematically'
        }
      ]
    }
  ],
  'DIV102': [ // Christology
    {
      title: 'The Person of Christ',
      content: `# The Person of Christ

## Who is Jesus Christ?
Jesus Christ is the eternal Son of God who became incarnate (took on human flesh) for humanity's redemption. He is fully God and fully human, the God-man who alone bridges the infinite gap between holy God and sinful humanity.

### The Pre-Incarnate Christ
Before His earthly ministry, Jesus existed eternally with God the Father. The Gospel of John opens with this profound truth: "In the beginning was the Word, and the Word was with God, and the Word was God" (John 1:1). Jesus was active in creation, sustaining all things by His powerful word (Colossians 1:16-17).

### The Incarnation
The incarnation refers to God the Son taking on human flesh and becoming the God-man, Jesus Christ. This is Christianity's most distinctive claim and central mystery. Jesus was born of a virgin, lived a sinless life, died on the cross, rose from the dead, and ascended to heaven.

**Why the Incarnation?**
- To reveal God's character and nature (John 1:18)
- To accomplish redemption through His death and resurrection
- To provide a perfect example of obedience and righteousness
- To establish His authority as the judge of all humanity

## The Two Natures of Christ
Jesus possesses two distinct natures united in one person: a complete divine nature and a complete human nature.

### Christ's Divine Nature
Jesus possessed all the attributes of God:
- **Omniscience**: Knowledge of all things (John 2:24-25)
- **Omnipotence**: Power over nature and demons (Mark 4:35-41)
- **Eternality**: Existence before creation (John 8:58)
- **Immutability**: Unchanging character (Hebrews 13:8)

He accepted worship (Matthew 14:33), forgave sins (Mark 2:5), and claimed to be God (John 10:30).

### Christ's Human Nature
Jesus was genuinely human:
- He had a physical body (Luke 24:39)
- He experienced hunger, thirst, and fatigue (John 4:6-7)
- He experienced emotions: compassion, anger, sorrow (John 11:35)
- He prayed and submitted to the Father's will (Luke 22:42)
- He grew in wisdom and stature (Luke 2:52)

Importantly, Jesus' humanity was sinless. He was tempted in every way, yet without sin (Hebrews 4:15).

## The Hypostatic Union
The hypostatic union refers to the permanent union of Christ's divine and human natures in one person. This is not a mixture or confusion of natures but a true union. Jesus is not two persons but one person with two natures.

### Theological Significance
This union ensures that:
- God Himself entered into human experience and suffering
- Christ's sacrifice has infinite value (God dying for humanity)
- Christ can serve as the perfect mediator between God and humanity
- Christ's resurrection guarantees the redemption of our bodies

## Titles and Names of Christ
**The Word (Logos)**: Emphasizes Christ as God's self-revelation
**The Son of God**: Emphasizes His divine nature and relationship to the Father
**The Son of Man**: Emphasizes His humanity and identification with humanity
**The Messiah/Christ**: Emphasizes His role as God's anointed one
**Lord**: Emphasizes His authority and deity
**Savior**: Emphasizes His redemptive work`,
      readingMaterial: `**Primary Texts:**
- Grudem, Wayne. "Systematic Theology." Zondervan, 2000. (Chapters 24-27)
- Stott, John. "The Incomparable Christ." InterVarsity Press, 2001.

**Supplementary Reading:**
- Piper, John. "Jesus the Radical Submissive." Crossway, 2010.
- Torrance, Thomas F. "The Incarnation: The Ecumenical Significance of the Incarnation." Handsel Press, 1981.

**Scripture References:**
- John 1:1-14 - The incarnation of the Word
- Philippians 2:5-11 - Christ's humiliation and exaltation
- Colossians 1:15-20 - Christ's supremacy`,
      assignment: `**Written Assignment: The Significance of the Incarnation**
Write a 3-page essay exploring why the incarnation is central to Christian faith. Address:
1. How the incarnation reveals God's character
2. Why God becoming human was necessary for redemption
3. How understanding Christ's two natures affects your worship and obedience

**Written Reflection Questions:**
1. What does it mean to you personally that Jesus is fully God and fully human?
2. How does the hypostatic union affect your understanding of Christ's sacrifice?`,
      quizQuestions: [
        {
          question: 'What does "incarnation" mean in Christian theology?',
          questionType: 'multiple_choice' as const,
          options: ['God the Son taking on human flesh', 'God becoming invisible', 'A spiritual vision', 'An ancient religious practice'],
          correctAnswer: 'God the Son taking on human flesh'
        },
        {
          question: 'According to John 1:1, what was true about the Word in the beginning?',
          questionType: 'multiple_choice' as const,
          options: ['The Word was with God and was God', 'The Word was separate from God', 'The Word did not exist', 'The Word was created by God'],
          correctAnswer: 'The Word was with God and was God'
        },
        {
          question: 'Jesus Christ possesses which of the following?',
          questionType: 'multiple_choice' as const,
          options: ['Only a divine nature', 'Only a human nature', 'Both a complete divine nature and a complete human nature', 'A mixture of divine and human natures'],
          correctAnswer: 'Both a complete divine nature and a complete human nature'
        },
        {
          question: 'What is the hypostatic union?',
          questionType: 'short_answer' as const,
          options: null,
          correctAnswer: 'The permanent union of Christ\'s divine and human natures in one person'
        },
        {
          question: 'True or False: Jesus experienced hunger, thirst, and fatigue during His earthly ministry.',
          questionType: 'true_false' as const,
          options: null,
          correctAnswer: 'true'
        },
        {
          question: 'Which attribute of God did Jesus NOT possess?',
          questionType: 'multiple_choice' as const,
          options: ['Omniscience', 'Omnipotence', 'Eternality', 'Limited knowledge'],
          correctAnswer: 'Limited knowledge'
        },
        {
          question: 'What does it mean that Jesus was "sinless"?',
          questionType: 'short_answer' as const,
          options: null,
          correctAnswer: 'He was tempted in every way but did not sin; He was morally perfect and without any transgression'
        },
        {
          question: 'According to the lesson, what is the primary purpose of the incarnation?',
          questionType: 'multiple_choice' as const,
          options: ['To accomplish redemption through His death and resurrection', 'To become a political leader', 'To establish a new religion', 'To demonstrate human weakness'],
          correctAnswer: 'To accomplish redemption through His death and resurrection'
        },
        {
          question: 'What does the title "Logos" (the Word) emphasize about Christ?',
          questionType: 'short_answer' as const,
          options: null,
          correctAnswer: 'Christ as God\'s self-revelation and the eternal Word of God'
        },
        {
          question: 'True or False: The hypostatic union means Jesus is two separate persons.',
          questionType: 'true_false' as const,
          options: null,
          correctAnswer: 'false'
        },
        {
          question: 'How does Christ\'s sacrifice have infinite value?',
          questionType: 'short_answer' as const,
          options: null,
          correctAnswer: 'Because God Himself died for humanity; the divine nature gives infinite worth to the sacrifice'
        },
        {
          question: 'Which of the following best describes Christ\'s role as mediator?',
          questionType: 'multiple_choice' as const,
          options: ['He bridges the gap between holy God and sinful humanity', 'He eliminates the need for God', 'He makes humans equal to God', 'He creates a new god'],
          correctAnswer: 'He bridges the gap between holy God and sinful humanity'
        }
      ]
    }
  ]
};

export async function enhanceLessons() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  console.log('Starting lesson enhancement...\n');
  let totalEnhanced = 0;
  let totalQuestionsAdded = 0;

  for (const [courseCode, lessonsData] of Object.entries(lessonsEnhancementData)) {
    const courseResult = await db.select().from(courses).where(eq(courses.code, courseCode));
    if (!courseResult.length) {
      console.log(`⚠️  Course ${courseCode} not found`);
      continue;
    }

    const course = courseResult[0];
    console.log(`📚 Processing ${courseCode}: ${course.title}`);

    for (const lessonData of lessonsData) {
      const lessonResult = await db.select().from(lessons)
        .where(eq(lessons.courseId, course.id))
        .limit(1);

      if (!lessonResult.length) {
        console.log(`  ⚠️  No lesson found for ${lessonData.title}`);
        continue;
      }

      const lesson = lessonResult[0];

      // Update lesson content
      await db.update(lessons).set({
        content: lessonData.content,
        readingMaterial: lessonData.readingMaterial,
        assignment: lessonData.assignment,
        updatedAt: new Date()
      }).where(eq(lessons.id, lesson.id));

      console.log(`  ✓ Updated: ${lessonData.title}`);
      totalEnhanced++;

      // Delete existing quiz questions
      await db.delete(quizQuestions).where(eq(quizQuestions.lessonId, lesson.id));

      // Add new quiz questions
      for (let i = 0; i < lessonData.quizQuestions.length; i++) {
        const q = lessonData.quizQuestions[i];
        await db.insert(quizQuestions).values({
          lessonId: lesson.id,
          question: q.question,
          questionType: q.questionType,
          options: q.options ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          questionOrder: i + 1
        });
      }

      console.log(`    → Added ${lessonData.quizQuestions.length} quiz questions`);
      totalQuestionsAdded += lessonData.quizQuestions.length;
    }
  }

  console.log(`\n✅ Enhancement complete!`);
  console.log(`   Total lessons enhanced: ${totalEnhanced}`);
  console.log(`   Total quiz questions added: ${totalQuestionsAdded}`);
  if (totalEnhanced > 0) {
    console.log(`   Average questions per lesson: ${(totalQuestionsAdded / totalEnhanced).toFixed(1)}`);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enhanceLessons()
    .then(() => {
      console.log('\n✓ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n✗ Error:', error);
      process.exit(1);
    });
}
