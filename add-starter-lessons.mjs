import { getDb } from './server/db.js';
import { courses, lessons, quizQuestions } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

async function addStarterLessons() {
  console.log('Adding starter lessons to new courses...');

  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  // Get the new course IDs
  const allCourses = await db.select().from(courses).where(eq(courses.code, 'DIV108'));
  const div108 = allCourses[0];
  
  const allCourses2 = await db.select().from(courses).where(eq(courses.code, 'DIV109'));
  const div109 = allCourses2[0];
  
  const allCourses3 = await db.select().from(courses).where(eq(courses.code, 'DIV110'));
  const div110 = allCourses3[0];

  console.log(`DIV108 ID: ${div108.id}`);
  console.log(`DIV109 ID: ${div109.id}`);
  console.log(`DIV110 ID: ${div110.id}`);

  // DIV108: Deliverance Ministry - 3 lessons
  console.log('\nAdding lessons to DIV108...');
  
  const div108Lesson1 = await db.insert(lessons).values({
    courseId: div108.id,
    title: 'Introduction to Deliverance Ministry',
    content: `# Introduction to Deliverance Ministry

## Understanding Spiritual Bondage

Deliverance ministry addresses the reality of spiritual bondage that can affect believers and non-believers alike. This lesson explores the biblical foundation for deliverance and its necessity in the Christian life.

### Key Concepts

**Biblical Foundation**: Jesus ministry included casting out demons and setting captives free (Luke 4:18-19). The Great Commission includes authority over demonic forces (Mark 16:17).

**Types of Bondage**: Spiritual bondages can manifest through generational curses, traumatic experiences, persistent sin patterns, occult involvement, or demonic oppression.

**Freedom in Christ**: True deliverance comes through the finished work of Christ on the cross, combined with the believer's active participation in renouncing darkness and embracing light.

## Practical Applications

1. Recognize the signs of spiritual bondage in your life
2. Understand your authority as a believer
3. Learn to cooperate with the Holy Spirit in the deliverance process

## Reflection Questions

1. What areas of your life might need deliverance?
2. How does understanding Christ's victory on the cross affect your approach to spiritual warfare?
3. What role does personal responsibility play in maintaining freedom?`,
    lessonOrder: 1
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div108Lesson1[0].id,
      question: 'What is a key biblical foundation for deliverance ministry?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['Jesus cast out demons and set captives free', 'It was only for the apostles', 'It ended with the early church', 'It requires special ordination']),
      correctAnswer: 'Jesus cast out demons and set captives free',
      questionOrder: 1
    },
    {
      lessonId: div108Lesson1[0].id,
      question: 'What must a person do to receive deliverance?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['Actively participate in renouncing darkness', 'Be perfect first', 'Fast for 40 days', 'Have a special anointing']),
      correctAnswer: 'Actively participate in renouncing darkness',
      questionOrder: 2
    }
  ]);

  const div108Lesson2 = await db.insert(lessons).values({
    courseId: div108.id,
    title: 'The Deliverance Process',
    content: `# The Deliverance Process

## Preparation

Proper preparation is essential for effective deliverance ministry.

### Personal Preparation

**Minister's Readiness**: Must be walking in holiness, filled with the Spirit, and covered by prayer.

**Recipient's Willingness**: The person must desire freedom and be willing to cooperate.

**Prayer Coverage**: Intercession before, during, and after the session.

## Steps in Deliverance

### 1. Confession and Repentance

The individual must confess known sins and renounce involvement with darkness.

### 2. Breaking Legal Ground

- Renounce ancestral sins
- Break generational curses
- Forgive those who have caused harm
- Revoke ungodly vows or agreements

### 3. Commanding Spirits to Leave

Using the authority of Jesus name, command spirits to depart:
- Be specific about what you are addressing
- Speak with authority, not volume
- Persist until freedom comes
- Fill the void with the Holy Spirit

### 4. Sealing the Deliverance

- Pray for the filling of the Holy Spirit
- Establish spiritual disciplines
- Provide follow-up and accountability`,
    lessonOrder: 2
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div108Lesson2[0].id,
      question: 'What is the first step in the deliverance process?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['Confession and repentance', 'Commanding spirits', 'Fasting', 'Anointing with oil']),
      correctAnswer: 'Confession and repentance',
      questionOrder: 1
    }
  ]);

  const div108Lesson3 = await db.insert(lessons).values({
    courseId: div108.id,
    title: 'Maintaining Freedom',
    content: `# Maintaining Freedom

## The Danger of Empty Houses

Jesus warned that deliverance without discipleship leads to worse bondage (Matthew 12:43-45).

### Filling the Void

**Positive Replacement**: Replace old habits with godly practices.

**Holy Spirit Fullness**: Continuously be filled with the Spirit (Ephesians 5:18).

**Renewing the Mind**: Transform thinking through God's Word (Romans 12:2).

## Spiritual Disciplines

### Daily Practices

1. **Prayer**: Maintain constant communication with God
2. **Scripture**: Daily Bible reading and meditation
3. **Worship**: Regular praise and thanksgiving
4. **Fellowship**: Stay connected to the body of Christ

### Protective Measures

- Put on the full armor of God daily (Ephesians 6:10-18)
- Guard your heart and mind
- Avoid compromising situations
- Maintain accountability relationships

## Long-Term Victory

True freedom is maintained through:
- Growing in spiritual maturity
- Developing Christ-like character
- Serving others in ministry
- Living in community with believers`,
    lessonOrder: 3
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div108Lesson3[0].id,
      question: 'According to Matthew 12:43-45, what happens if deliverance is not followed by discipleship?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['It can lead to worse bondage', 'Nothing happens', 'Freedom is permanent', 'The person becomes immune']),
      correctAnswer: 'It can lead to worse bondage',
      questionOrder: 1
    }
  ]);

  console.log('✓ Added 3 lessons to DIV108');

  // DIV109: The Fivefold Ministry - 3 lessons
  console.log('\nAdding lessons to DIV109...');
  
  const div109Lesson1 = await db.insert(lessons).values({
    courseId: div109.id,
    title: 'Introduction to the Fivefold Ministry',
    content: `# Introduction to the Fivefold Ministry

## Biblical Foundation

The fivefold ministry is outlined in Ephesians 4:11-13, describing five distinct ministry roles given by Christ to His church.

### The Five Offices

**Apostle**: Sent ones who establish and oversee churches, carrying governmental authority.

**Prophet**: Those who hear from God and speak His word, providing direction and correction.

**Evangelist**: Proclaimers of the gospel who win souls and equip others for evangelism.

**Pastor**: Shepherds who care for, protect, and nurture the flock.

**Teacher**: Those who explain and apply Scripture, building understanding and doctrine.

## Purpose of the Fivefold Ministry

### Equipping the Saints

These offices exist for the equipping of the saints for the work of ministry (Ephesians 4:12).

**Not Replacement**: These leaders do not do all the ministry; they equip others to minister.

**Maturity**: The goal is bringing believers to spiritual maturity and unity.

**Body Building**: Each office contributes to building up the body of Christ.

## Practical Applications

1. Recognize these offices in operation today
2. Understand your role in the body
3. Honor and receive from fivefold ministers
4. Discover your own calling and gifting`,
    lessonOrder: 1
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div109Lesson1[0].id,
      question: 'What is the primary purpose of the fivefold ministry according to Ephesians 4:12?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['To equip the saints for the work of ministry', 'To do all the ministry work', 'To control the church', 'To collect tithes']),
      correctAnswer: 'To equip the saints for the work of ministry',
      questionOrder: 1
    }
  ]);

  const div109Lesson2 = await db.insert(lessons).values({
    courseId: div109.id,
    title: 'Apostles and Prophets',
    content: `# Apostles and Prophets

## The Apostolic Ministry

The apostolic office carries unique authority and responsibility in the church.

### Characteristics of Apostles

**Sent Ones**: The word apostle means sent one - they are commissioned by God for specific purposes.

**Foundation Layers**: Apostles lay foundations for churches and movements (1 Corinthians 3:10).

**Signs and Wonders**: Apostolic ministry is often accompanied by miracles and signs (2 Corinthians 12:12).

**Governmental Authority**: Apostles carry authority to establish order and doctrine.

## The Prophetic Ministry

Prophets hear from God and communicate His heart and mind to His people.

### Core Functions

**Revelation**: Receiving insight and revelation from God.

**Declaration**: Speaking God's word with authority and clarity.

**Direction**: Providing guidance for individuals, churches, and nations.

**Correction**: Calling people back to God's ways and standards.

## Working Together

Apostles and prophets work together to establish the church on a solid foundation (Ephesians 2:20).`,
    lessonOrder: 2
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div109Lesson2[0].id,
      question: 'What do apostles primarily do according to 1 Corinthians 3:10?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['Lay foundations for churches', 'Preach only', 'Collect offerings', 'Write books']),
      correctAnswer: 'Lay foundations for churches',
      questionOrder: 1
    }
  ]);

  const div109Lesson3 = await db.insert(lessons).values({
    courseId: div109.id,
    title: 'Evangelists, Pastors, and Teachers',
    content: `# Evangelists, Pastors, and Teachers

## The Evangelist

Evangelists are gifted to proclaim the gospel and win souls.

### Evangelistic Calling

**Soul Winners**: Primary focus is reaching the lost with the gospel.

**Equippers**: Train others in evangelism and soul-winning.

**Harvesters**: Gather in the harvest of souls.

## The Pastor

Pastors shepherd and care for God's flock.

### Pastoral Functions

**Feeding**: Providing spiritual nourishment through teaching and preaching.

**Leading**: Guiding the flock in right paths.

**Protecting**: Guarding against false teaching and spiritual danger.

**Caring**: Ministering to individual needs and hurts.

## The Teacher

Teachers explain and apply God's Word with clarity and accuracy.

### Teaching Ministry

**Exposition**: Breaking down Scripture for understanding.

**Application**: Showing how truth applies to life.

**Systematic**: Organizing doctrine and theology.

**Practical**: Making truth accessible and usable.

## Unity in Diversity

All five offices work together to build up the body of Christ in love and unity.`,
    lessonOrder: 3
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div109Lesson3[0].id,
      question: 'What is the primary role of a pastor?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['To shepherd and care for the flock', 'To win souls only', 'To teach doctrine only', 'To prophesy']),
      correctAnswer: 'To shepherd and care for the flock',
      questionOrder: 1
    }
  ]);

  console.log('✓ Added 3 lessons to DIV109');

  // DIV110: Prophecy & Prophetic Office - 3 lessons
  console.log('\nAdding lessons to DIV110...');
  
  const div110Lesson1 = await db.insert(lessons).values({
    courseId: div110.id,
    title: 'Introduction to Prophecy',
    content: `# Introduction to Prophecy

## Understanding Prophecy

Prophecy is the supernatural ability to receive and communicate messages from God.

### Biblical Definition

**Old Testament**: Prophets were God's spokespersons, declaring His word to Israel and the nations.

**New Testament**: Prophecy continues as a gift for edification, exhortation, and comfort (1 Corinthians 14:3).

### Purpose of Prophecy

**Revelation**: Making known God's thoughts and plans.

**Edification**: Building up believers and the church.

**Direction**: Providing guidance for decisions and actions.

**Confirmation**: Validating what God has already spoken.

## The Gift vs. The Office

### Gift of Prophecy

Available to all believers (1 Corinthians 14:31), operating as the Spirit wills for specific situations.

### Office of Prophet

A recognized ministry calling with consistent prophetic function and authority.

## Practical Applications

1. Desire spiritual gifts, especially prophecy (1 Corinthians 14:1)
2. Learn to hear God's voice
3. Practice prophesying in safe environments
4. Submit to biblical guidelines`,
    lessonOrder: 1
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div110Lesson1[0].id,
      question: 'According to 1 Corinthians 14:3, what is the purpose of New Testament prophecy?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['Edification, exhortation, and comfort', 'Prediction only', 'Condemning sin', 'Establishing new doctrine']),
      correctAnswer: 'Edification, exhortation, and comfort',
      questionOrder: 1
    }
  ]);

  const div110Lesson2 = await db.insert(lessons).values({
    courseId: div110.id,
    title: 'Hearing God\'s Voice',
    content: `# Hearing God's Voice

## How God Speaks

God communicates with His people in various ways.

### Primary Methods

**Scripture**: The primary and authoritative way God speaks (2 Timothy 3:16).

**Still Small Voice**: The gentle whisper of the Holy Spirit (1 Kings 19:12).

**Dreams and Visions**: God speaks through the subconscious and supernatural visions (Acts 2:17).

**Prophetic Words**: Through other believers operating in prophecy.

## Developing Sensitivity

### Cultivating Listening

1. **Quiet Time**: Regular periods of silence before God
2. **Scripture Meditation**: Dwelling on God's Word
3. **Journaling**: Recording what you sense God saying
4. **Obedience**: Acting on what you hear
5. **Community**: Testing what you hear with mature believers

## Testing What You Hear

### Biblical Tests

1. **Scripture**: Does it align with God's Word?
2. **Character**: Does it reflect God's nature?
3. **Peace**: Do you have inner peace about it?
4. **Fruit**: Will it produce good fruit?
5. **Witnesses**: Do mature believers confirm it?`,
    lessonOrder: 2
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div110Lesson2[0].id,
      question: 'What is the primary way God speaks according to 2 Timothy 3:16?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['Through Scripture', 'Through dreams only', 'Through feelings', 'Through circumstances only']),
      correctAnswer: 'Through Scripture',
      questionOrder: 1
    }
  ]);

  const div110Lesson3 = await db.insert(lessons).values({
    courseId: div110.id,
    title: 'Operating in Prophetic Ministry',
    content: `# Operating in Prophetic Ministry

## Prophetic Protocol

Guidelines for healthy prophetic ministry.

### Preparation

**Personal Holiness**: Maintain a clean heart and pure motives.

**Intimacy with God**: Prophecy flows from relationship.

**Humility**: Recognize you are a vessel, not the source.

**Accountability**: Submit to spiritual authority.

## Delivering Prophetic Words

### How to Prophesy

**Wait on God**: Do not manufacture words; wait for genuine inspiration.

**Speak in Faith**: When you sense God's prompting, step out in faith.

**Use Wisdom**: Consider timing, setting, and the person's readiness.

**Stay Humble**: Present it as what you sense, not as absolute truth.

## Handling Prophetic Ministry

### When You Receive Prophecy

1. **Record It**: Write it down for future reference
2. **Test It**: Measure it against Scripture and wise counsel
3. **Wait on Timing**: Some words are for future fulfillment
4. **Act in Faith**: Respond appropriately to confirmed words

### When You Give Prophecy

1. **Deliver Faithfully**: Say what God shows you
2. **Release Responsibility**: The outcome is between God and the recipient
3. **Follow Up**: Check in if appropriate
4. **Learn and Grow**: Evaluate accuracy and grow in gifting`,
    lessonOrder: 3
  }).returning();

  await db.insert(quizQuestions).values([
    {
      lessonId: div110Lesson3[0].id,
      question: 'What should you do when you receive a prophetic word?',
      questionType: 'multiple_choice',
      options: JSON.stringify(['Record it and test it against Scripture', 'Immediately act on it without question', 'Ignore it', 'Share it with everyone']),
      correctAnswer: 'Record it and test it against Scripture',
      questionOrder: 1
    }
  ]);

  console.log('✓ Added 3 lessons to DIV110');

  // Update course lesson counts
  await db.update(courses).set({ totalLessons: 3 }).where(eq(courses.id, div108.id));
  await db.update(courses).set({ totalLessons: 3 }).where(eq(courses.id, div109.id));
  await db.update(courses).set({ totalLessons: 3 }).where(eq(courses.id, div110.id));

  console.log('\n✅ All starter lessons added successfully!');
  console.log('\nSummary:');
  console.log('- DIV108: Deliverance Ministry (3 lessons)');
  console.log('- DIV109: The Fivefold Ministry (3 lessons)');
  console.log('- DIV110: Prophecy & Prophetic Office (3 lessons)');
  console.log('\nTotal courses: 10');
  console.log('You can add more lessons through the admin panel!');
}

addStarterLessons()
  .then(() => {
    console.log('\n✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Error:', error);
    process.exit(1);
  });
