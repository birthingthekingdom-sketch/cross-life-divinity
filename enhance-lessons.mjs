import { getDb } from './server/db.js';
import { courses, lessons, quizQuestions } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

const db = await getDb();
if (!db) {
  console.error('Failed to connect to database');
  process.exit(1);
}

// Enhanced lesson content with theological material and reading assignments
const enhancedLessons = {
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

**Due Date:** End of Week 2`
    },
    {
      title: 'God\'s Nature and Attributes',
      content: `# God's Nature and Attributes

## The Being of God
God is the self-existent, eternal, all-powerful Creator who stands above and beyond His creation. Unlike His creatures, God is not dependent on anything outside Himself for existence or sustenance. He is the source of all being and the ground of all reality.

### God's Transcendence and Immanence
**Transcendence** refers to God's absolute otherness and superiority over creation. God is infinitely greater than the universe and all that exists within it. This truth calls forth worship and reverence.

**Immanence** refers to God's presence and involvement within creation. God is not distant or detached but actively sustains all things and relates to His creatures. This truth provides comfort and assurance of God's care.

## The Attributes of God
God's attributes are His essential characteristics or perfections. While we distinguish them for study, they are unified in God's being.

### Incommunicable Attributes (Unique to God)
**Aseity**: God's complete self-sufficiency and independence from creation
**Immutability**: God's unchanging nature and consistency
**Eternity**: God's transcendence of time; He exists outside temporal limitations
**Omniscience**: God's complete knowledge of all things, past, present, and future
**Omnipotence**: God's unlimited power to accomplish His purposes

### Communicable Attributes (Reflected in Humans)
**Holiness**: God's absolute moral purity and separation from sin
**Justice**: God's righteous judgment and fair administration of His law
**Mercy**: God's compassionate response to human need and suffering
**Love**: God's selfless, sacrificial commitment to the good of others
**Wisdom**: God's perfect knowledge and optimal application of that knowledge
**Faithfulness**: God's reliability and consistency in keeping His promises

## The Trinity
The doctrine of the Trinity affirms that God is one in essence but three in person: Father, Son, and Holy Spirit. Each person is fully God, yet there is only one God. This mystery, while difficult to comprehend, is clearly taught throughout Scripture.

### Biblical Evidence
- Matthew 28:19 - The baptismal formula: "Father, Son, and Holy Spirit"
- 1 Corinthians 12:4-6 - Different gifts, services, and activities from the three persons
- 2 Corinthians 13:14 - The apostolic blessing invoking all three persons

## Implications for Christian Life
Understanding God's attributes provides foundation for prayer, worship, obedience, and trust. God's holiness calls us to pursue sanctification. His justice motivates us to seek righteousness. His mercy encourages us to extend grace to others. His love compels us to surrender our lives to Him.`,
      readingMaterial: `**Primary Texts:**
- Grudem, Wayne. "Systematic Theology." Zondervan, 2000. (Chapters 4-13)
- Packer, J.I. "Knowing God." InterVarsity Press, 1973.

**Supplementary Reading:**
- Tozer, A.W. "The Knowledge of the Holy." HarperCollins, 1961.
- Sproul, R.C. "The Holiness of God." Tyndale House, 1985.

**Scripture References:**
- Exodus 3:14 - God's self-revelation as "I AM"
- Isaiah 40:25-26 - God's incomparability and power
- 1 John 4:7-8 - "God is love"`,
      assignment: `**Reflection Questions:**
1. Which attribute of God means the most to you personally and why?
2. How does understanding God's transcendence and immanence affect your prayer life?

**Written Assignment:**
Compose a personal prayer (1-2 pages) that reflects on God's attributes and how they relate to your current circumstances or challenges.`
    },
    {
      title: 'The Doctrine of Scripture',
      content: `# The Doctrine of Scripture

## What is the Doctrine of Scripture?
The doctrine of Scripture addresses the nature, origin, authority, and reliability of the Bible. It answers fundamental questions: Is the Bible God's Word? How should we interpret it? What authority does it have in our lives?

### Key Affirmations
**Revelation**: God has revealed Himself and His truth through Scripture
**Inspiration**: The Holy Spirit guided the human authors so that Scripture is God's Word
**Authority**: Scripture is the supreme authority for faith and practice
**Sufficiency**: Scripture contains all necessary revelation for salvation and Christian living
**Clarity**: Scripture is sufficiently clear that ordinary believers can understand its essential teachings

## Inspiration and Authority
The doctrine of inspiration affirms that the Bible is "God-breathed" (2 Timothy 3:16). This means that while human authors wrote the biblical texts, the Holy Spirit superintended the process so that the result is God's authoritative Word. Inspiration extends to the very words (verbal inspiration) and ensures the Bible's reliability.

### Views on Inspiration
**Plenary Inspiration**: Every part of Scripture is inspired by God
**Verbal Inspiration**: The very words, not just the ideas, are inspired
**Dynamic Inspiration**: God inspired the thoughts, allowing human authors freedom in expression
**Illumination**: The Holy Spirit enables believers to understand Scripture's meaning

## The Canon of Scripture
The canon refers to the collection of books recognized as Scripture. The Old Testament canon was largely established by the time of Christ. The New Testament canon developed gradually, with the 27 books being universally recognized by the 4th century.

### Criteria for Canonicity
- Apostolic authority or connection
- Doctrinal consistency with established Scripture
- Universal acceptance by the early Church
- Evidence of divine inspiration and spiritual power

## Biblical Interpretation (Hermeneutics)
Proper interpretation requires understanding the historical context, literary genre, grammatical structure, and theological significance of biblical texts.

### Hermeneutical Principles
**Grammatical-Historical Method**: Interpret Scripture according to its normal grammatical meaning in its historical context
**Literal Interpretation**: Take Scripture at face value, recognizing figures of speech and literary devices
**Contextual Interpretation**: Understand passages within their immediate and broader biblical context
**Theological Interpretation**: Interpret Scripture in light of its overall theological message

## The Sufficiency and Clarity of Scripture
Scripture is sufficient for all matters of faith and practice. While not addressing every possible question, it provides all necessary guidance for salvation and Christian living. While some passages are difficult, the essential teachings are clear enough for ordinary believers to understand.`,
      readingMaterial: `**Primary Texts:**
- Grudem, Wayne. "Systematic Theology." Zondervan, 2000. (Chapters 2-3)
- Piper, John. "Desiring God." Multnomah Press, 1986. (Chapter on Scripture)

**Supplementary Reading:**
- Sproul, R.C. "Scripture Alone: The Evangelical Doctrine." P&R Publishing, 2005.
- Vanhoozer, Kevin J. "Is There a Meaning in This Text?" Zondervan, 1998.

**Scripture References:**
- 2 Timothy 3:16-17 - "All Scripture is God-breathed"
- Psalm 119:105 - "Your word is a lamp to my feet"
- Hebrews 4:12 - The power and effectiveness of God's Word`,
      assignment: `**Study Assignment:**
Choose a biblical passage (3-5 verses) and apply the grammatical-historical hermeneutical method. Write a 2-page analysis that includes:
1. Historical and cultural context
2. Grammatical analysis of key terms
3. Literary genre and structure
4. Theological significance
5. Application to contemporary Christian life`
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
3. How understanding Christ's two natures affects your worship and obedience`
    },
    {
      title: 'The Work of Christ: Atonement',
      content: `# The Work of Christ: Atonement

## What is the Atonement?
The atonement refers to Christ's work of reconciling sinful humanity with holy God through His death and resurrection. It is the heart of the gospel and the foundation of Christian salvation.

### The Problem: Human Sin
All humans are sinners who have fallen short of God's glory (Romans 3:23). Sin creates a barrier between humanity and God, resulting in spiritual death and separation from God. God's justice demands that sin be punished; His holiness cannot tolerate sin in His presence.

### The Solution: Christ's Atoning Work
Jesus Christ, through His death on the cross, provided the solution to humanity's sin problem. His sacrifice was:
- **Substitutionary**: He died in our place, bearing the penalty we deserved
- **Sufficient**: His one sacrifice is enough for all sins of all people for all time
- **Effective**: It actually accomplishes reconciliation between God and humanity

## Theories of the Atonement
Throughout church history, theologians have developed various models to explain how Christ's death accomplishes salvation. These are not contradictory but complementary perspectives.

### The Substitutionary/Penal Theory
Christ bore the penalty for our sins. God's justice required that sin be punished, and Christ accepted that punishment on our behalf. This is the most biblically grounded understanding.

**Key Texts**: Isaiah 53:5-6; Romans 3:25-26; 2 Corinthians 5:21

### The Christus Victor Theory
Christ defeated Satan, sin, and death through His resurrection. The atonement is understood primarily as liberation from Satan's power and the curse of sin.

**Key Texts**: Colossians 2:15; Hebrews 2:14-15; Revelation 12:7-11

### The Moral Influence Theory
Christ's death demonstrates God's love and moral character, inspiring us to repentance and transformation. While this element is important, it is insufficient as a complete explanation of atonement.

**Key Texts**: Romans 5:8; 1 John 4:9-10

### The Satisfaction Theory
Christ's death satisfies God's honor and justice, restoring the proper relationship between God and humanity. This theory emphasizes Christ's obedience and the restoration of God's order.

## The Resurrection and Exaltation
Christ's resurrection is inseparable from His atoning work. The resurrection:
- Validates Christ's claims and work
- Demonstrates God's power over sin and death
- Provides the basis for our hope and future resurrection
- Enables Christ's ongoing intercession for believers

Christ's exaltation refers to His ascension to heaven and session at God's right hand, where He reigns as Lord and intercedes for believers.

## The Application of Atonement: Justification and Reconciliation
**Justification**: God declares us righteous based on Christ's righteousness imputed to us through faith. We are declared "not guilty" and accepted as righteous in God's sight.

**Reconciliation**: Through Christ's atonement, the barrier between God and humanity is removed. We are reconciled to God and restored to relationship with Him.

**Redemption**: We are bought back from sin's slavery through Christ's payment. We are no longer slaves to sin but slaves to righteousness.`,
      readingMaterial: `**Primary Texts:**
- Grudem, Wayne. "Systematic Theology." Zondervan, 2000. (Chapters 28-31)
- Stott, John. "The Cross of Christ." InterVarsity Press, 1986.

**Supplementary Reading:**
- Piper, John. "Pierced for Our Transgressions." Crossway, 2007.
- Torrance, Thomas F. "Atonement: The Person and Work of Christ." InterVarsity Press, 2009.

**Scripture References:**
- Romans 3:21-26 - Justification through faith in Christ's atonement
- 1 Peter 2:24 - Christ bearing our sins
- Hebrews 9:24-28 - Christ's sacrifice for sins`,
      assignment: `**Comparative Analysis Assignment:**
Write a 3-4 page analysis comparing and contrasting at least two theories of atonement. Discuss:
1. The biblical basis for each theory
2. Strengths and weaknesses of each approach
3. How these theories complement one another
4. Which understanding most deeply impacts your personal faith`
    }
  ]
};

// Generate quiz questions for each lesson
const generateQuizQuestions = (lessonTitle, lessonContent) => {
  const questions = [];
  
  // Generic theological questions based on content
  const questionTemplates = [
    {
      question: `What is the primary focus of the lesson "${lessonTitle}"?`,
      type: 'multiple_choice',
      options: ['Understanding biblical doctrine', 'Learning church history', 'Developing prayer skills', 'Memorizing Scripture verses'],
      correct: 'Understanding biblical doctrine'
    },
    {
      question: `According to the lesson, what is the relationship between faith and reason in theology?`,
      type: 'multiple_choice',
      options: ['They are opposed to each other', 'They are complementary, with reason subject to Scripture', 'Reason is superior to faith', 'They are completely separate concerns'],
      correct: 'They are complementary, with reason subject to Scripture'
    },
    {
      question: `How should Christians approach biblical interpretation?`,
      type: 'multiple_choice',
      options: ['Use only literal meanings', 'Use the grammatical-historical method', 'Ignore historical context', 'Rely solely on personal feelings'],
      correct: 'Use the grammatical-historical method'
    },
    {
      question: `What is the significance of understanding God's attributes for Christian living?`,
      type: 'short_answer',
      correct: 'Understanding God\'s attributes provides foundation for prayer, worship, obedience, and trust. It shapes how we relate to God and live out our faith.'
    },
    {
      question: `Is Scripture sufficient for all matters of Christian faith and practice?`,
      type: 'true_false',
      correct: 'true'
    },
    {
      question: `The doctrine of the Trinity teaches that God is:`,
      type: 'multiple_choice',
      options: ['Three separate gods', 'One in essence but three in person', 'Only the Father', 'A mystery that cannot be understood'],
      correct: 'One in essence but three in person'
    },
    {
      question: `What does "incarnation" mean in Christian theology?`,
      type: 'short_answer',
      correct: 'The incarnation refers to God the Son taking on human flesh and becoming the God-man, Jesus Christ.'
    },
    {
      question: `Jesus Christ possessed which of the following?`,
      type: 'multiple_choice',
      options: ['Only a divine nature', 'Only a human nature', 'Both a complete divine nature and a complete human nature', 'A mixture of divine and human natures'],
      correct: 'Both a complete divine nature and a complete human nature'
    },
    {
      question: `What is the hypostatic union?`,
      type: 'short_answer',
      correct: 'The hypostatic union refers to the permanent union of Christ\'s divine and human natures in one person.'
    },
    {
      question: `The atonement primarily refers to:`,
      type: 'multiple_choice',
      options: ['Christ\'s teachings about morality', 'Christ\'s reconciliation of sinful humanity with holy God through His death and resurrection', 'Christ\'s miracles and healings', 'Christ\'s establishment of the Church'],
      correct: 'Christ\'s reconciliation of sinful humanity with holy God through His death and resurrection'
    },
    {
      question: `According to the substitutionary theory of atonement, Christ:`,
      type: 'multiple_choice',
      options: ['Taught us how to be good', 'Bore the penalty for our sins in our place', 'Defeated Satan through military conquest', 'Established a new moral code'],
      correct: 'Bore the penalty for our sins in our place'
    },
    {
      question: `What is the significance of Christ's resurrection for Christian faith?`,
      type: 'short_answer',
      correct: 'Christ\'s resurrection validates His claims and work, demonstrates God\'s power over sin and death, provides the basis for our hope and future resurrection, and enables Christ\'s ongoing intercession for believers.'
    }
  ];
  
  return questionTemplates;
};

// Main enhancement function
async function enhanceLessons() {
  console.log('Starting lesson enhancement...\n');
  
  let totalLessonsEnhanced = 0;
  let totalQuestionsAdded = 0;
  
  // Get all courses
  const allCourses = await db.select().from(courses);
  
  for (const course of allCourses) {
    const courseCode = course.code;
    
    if (!enhancedLessons[courseCode]) {
      console.log(`⚠️  No enhanced content for ${courseCode}: ${course.title}`);
      continue;
    }
    
    console.log(`\n📚 Processing ${courseCode}: ${course.title}`);
    
    const courseEnhancedLessons = enhancedLessons[courseCode];
    const existingLessons = await db.select().from(lessons).where(eq(lessons.courseId, course.id));
    
    // Update or create lessons
    for (let i = 0; i < Math.min(courseEnhancedLessons.length, existingLessons.length); i++) {
      const enhanced = courseEnhancedLessons[i];
      const existing = existingLessons[i];
      
      // Update lesson with enhanced content
      await db.update(lessons)
        .set({
          title: enhanced.title,
          content: enhanced.content,
          readingMaterial: enhanced.readingMaterial,
          assignment: enhanced.assignment,
          updatedAt: new Date()
        })
        .where(eq(lessons.id, existing.id));
      
      console.log(`  ✓ Updated: ${enhanced.title}`);
      totalLessonsEnhanced++;
      
      // Remove existing quiz questions for this lesson
      await db.delete(quizQuestions).where(eq(quizQuestions.lessonId, existing.id));
      
      // Add new quiz questions
      const questions = generateQuizQuestions(enhanced.title, enhanced.content);
      
      for (let j = 0; j < questions.length; j++) {
        const q = questions[j];
        const options = q.type === 'multiple_choice' ? JSON.stringify(q.options) : null;
        
        await db.insert(quizQuestions).values({
          lessonId: existing.id,
          question: q.question,
          questionType: q.type,
          options: options,
          correctAnswer: q.correct,
          questionOrder: j + 1
        });
        
        totalQuestionsAdded++;
      }
      
      console.log(`    → Added ${questions.length} quiz questions`);
    }
  }
  
  console.log(`\n✅ Enhancement complete!`);
  console.log(`   Total lessons enhanced: ${totalLessonsEnhanced}`);
  console.log(`   Total quiz questions added: ${totalQuestionsAdded}`);
  console.log(`   Average questions per lesson: ${(totalQuestionsAdded / totalLessonsEnhanced).toFixed(1)}`);
}

try {
  await enhanceLessons();
  process.exit(0);
} catch (error) {
  console.error('Error enhancing lessons:', error);
  process.exit(1);
}
