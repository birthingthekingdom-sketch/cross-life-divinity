import { db } from './dist/db.js';
import { courses, lessons, quizQuestions } from './drizzle/schema.js';
import { eq, and, gte } from 'drizzle-orm';

async function reorganizeCourses() {
  console.log('Starting course reorganization...');

  // Step 1: Delete the three lessons that should be courses
  console.log('\n1. Removing lessons from DIV104 and DIV106...');
  
  // Delete Deliverance (Lesson 8 of DIV104)
  await db.delete(quizQuestions).where(
    eq(quizQuestions.lessonId, 
      db.select({ id: lessons.id }).from(lessons)
        .where(and(eq(lessons.courseId, 4), eq(lessons.order, 8)))
    )
  );
  await db.delete(lessons).where(and(eq(lessons.courseId, 4), eq(lessons.order, 8)));
  
  // Delete Prophecy (Lesson 9 of DIV104)
  await db.delete(quizQuestions).where(
    eq(quizQuestions.lessonId,
      db.select({ id: lessons.id }).from(lessons)
        .where(and(eq(lessons.courseId, 4), eq(lessons.order, 9)))
    )
  );
  await db.delete(lessons).where(and(eq(lessons.courseId, 4), eq(lessons.order, 9)));
  
  // Delete Fivefold Ministry (Lesson 9 of DIV106)
  await db.delete(quizQuestions).where(
    eq(quizQuestions.lessonId,
      db.select({ id: lessons.id }).from(lessons)
        .where(and(eq(lessons.courseId, 6), eq(lessons.order, 9)))
    )
  );
  await db.delete(lessons).where(and(eq(lessons.courseId, 6), eq(lessons.order, 9)));
  
  // Update course totals
  await db.update(courses).set({ totalLessons: 7 }).where(eq(courses.id, 4)); // DIV104
  await db.update(courses).set({ totalLessons: 8 }).where(eq(courses.id, 6)); // DIV106
  
  console.log('✓ Removed 3 lessons');

  // Step 2: Create three new courses
  console.log('\n2. Creating new courses...');
  
  const [div108] = await db.insert(courses).values({
    code: 'DIV108',
    title: 'Deliverance Ministry',
    description: 'Understanding deliverance and its necessity for living a life of freedom from spiritual and natural bondages.',
    totalLessons: 6
  }).returning();
  
  const [div109] = await db.insert(courses).values({
    code: 'DIV109',
    title: 'The Fivefold Ministry',
    description: 'Understanding the five ministry roles of Apostle, Prophet, Evangelist, Pastor, and Teacher for the purpose of perfecting believers for work in ministry.',
    totalLessons: 5
  }).returning();
  
  const [div110] = await db.insert(courses).values({
    code: 'DIV110',
    title: 'Prophecy & Prophetic Office',
    description: 'The study of the office and the gift of prophecy, and its role in the life of a believer within a Christian theological framework.',
    totalLessons: 7
  }).returning();
  
  console.log(`✓ Created DIV108 (ID: ${div108.id})`);
  console.log(`✓ Created DIV109 (ID: ${div109.id})`);
  console.log(`✓ Created DIV110 (ID: ${div110.id})`);

  // Step 3: Add lessons to DIV108 - Deliverance Ministry
  console.log('\n3. Adding lessons to DIV108...');
  const div108Lessons = [
    {
      title: 'Introduction to Deliverance Ministry',
      content: `# Introduction to Deliverance Ministry

## Understanding Spiritual Bondage

Deliverance ministry addresses the reality of spiritual bondage that can affect believers and non-believers alike. This lesson explores the biblical foundation for deliverance and its necessity in the Christian life.

### Key Concepts

**Biblical Foundation**: Jesus' ministry included casting out demons and setting captives free (Luke 4:18-19). The Great Commission includes authority over demonic forces (Mark 16:17).

**Types of Bondage**: Spiritual bondages can manifest through generational curses, traumatic experiences, persistent sin patterns, occult involvement, or demonic oppression.

**Freedom in Christ**: True deliverance comes through the finished work of Christ on the cross, combined with the believer's active participation in renouncing darkness and embracing light.

## Practical Applications

1. Recognize the signs of spiritual bondage in your life
2. Understand your authority as a believer
3. Learn to cooperate with the Holy Spirit in the deliverance process

## Reflection Questions

1. What areas of your life might need deliverance?
2. How does understanding Christ's victory on the cross affect your approach to spiritual warfare?
3. What role does personal responsibility play in maintaining freedom?`
    },
    {
      title: 'Biblical Foundations of Deliverance',
      content: `# Biblical Foundations of Deliverance

## Old Testament Precedents

The concept of deliverance runs throughout Scripture, from the Exodus to the prophets' ministry.

### Key Passages

**Exodus and Liberation**: God's deliverance of Israel from Egypt serves as a type and shadow of spiritual deliverance (Exodus 14:13-14).

**Prophetic Ministry**: Prophets like Elijah confronted demonic powers and false worship systems (1 Kings 18).

## New Testament Ministry

Jesus and the apostles demonstrated the reality and necessity of deliverance ministry.

### Jesus' Example

- Casting out demons was a regular part of His ministry
- He gave His disciples authority over unclean spirits
- Deliverance validated His messianic claims

### Apostolic Practice

The early church continued deliverance ministry (Acts 16:16-18, Acts 19:11-12).

## Theological Foundations

1. The kingdom of God advances through spiritual warfare
2. Believers have authority in Christ's name
3. Deliverance is part of the gospel message`
    },
    {
      title: 'Identifying Spiritual Bondage',
      content: `# Identifying Spiritual Bondage

## Signs and Symptoms

Learn to recognize when spiritual bondage may be present.

### Common Indicators

**Behavioral Patterns**: Compulsive behaviors, uncontrollable anger, persistent fear or anxiety, addictive tendencies.

**Mental/Emotional**: Tormenting thoughts, depression that doesn't respond to treatment, hearing voices, suicidal ideation.

**Physical Manifestations**: Unexplained illnesses, chronic pain without medical cause, sleep disturbances.

**Spiritual Symptoms**: Inability to pray or read Scripture, blasphemous thoughts, resistance to worship, fear of spiritual things.

## Root Causes

Understanding how bondage develops helps in ministering deliverance.

### Entry Points

1. **Generational**: Inherited spiritual issues through family lines
2. **Trauma**: Severe emotional or physical trauma creating openings
3. **Sin**: Persistent, unrepented sin giving legal ground
4. **Occult**: Involvement in witchcraft, divination, or occult practices
5. **Curses**: Spoken curses or vows that have spiritual power

## Assessment Process

Steps for discerning spiritual bondage:

1. Take a thorough spiritual history
2. Identify patterns and triggers
3. Seek Holy Spirit discernment
4. Rule out medical/psychological causes
5. Look for generational patterns`
    },
    {
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

Using the authority of Jesus' name, command spirits to depart:
- Be specific about what you're addressing
- Speak with authority, not volume
- Persist until freedom comes
- Fill the void with the Holy Spirit

### 4. Sealing the Deliverance

- Pray for the filling of the Holy Spirit
- Establish spiritual disciplines
- Provide follow-up and accountability

## Post-Deliverance Care

Freedom must be maintained through:
- Regular prayer and Scripture reading
- Fellowship with believers
- Avoiding former sinful patterns
- Walking in the Spirit daily`
    },
    {
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

## When Struggles Return

### Response Strategy

1. Don't panic or assume defeat
2. Identify the source of the attack
3. Renew your mind with truth
4. Seek prayer support
5. Stand firm in your authority

## Long-Term Victory

True freedom is maintained through:
- Growing in spiritual maturity
- Developing Christ-like character
- Serving others in ministry
- Living in community with believers`
    },
    {
      title: 'Deliverance Ministry in the Church',
      content: `# Deliverance Ministry in the Church

## The Church's Role

Deliverance should be part of the church's normal ministry, not relegated to specialists only.

### Biblical Mandate

Every believer has authority over demons (Mark 16:17), though some may have specific gifting in this area.

### Balanced Approach

**Avoid Extremes**: Neither ignore spiritual warfare nor see demons behind every problem.

**Integration**: Deliverance works alongside counseling, discipleship, and medical care.

## Training and Equipping

### Preparing Ministers

Churches should train believers in:
- Biblical foundations of deliverance
- Discernment of spirits
- Proper protocols and safety
- Post-deliverance care

### Team Ministry

Deliverance is best done in teams:
- Provides accountability
- Offers different spiritual gifts
- Ensures safety
- Provides witnesses

## Ethical Considerations

### Protecting the Vulnerable

- Obtain proper consent
- Maintain confidentiality
- Avoid manipulation
- Provide appropriate follow-up
- Know when to refer to professionals

### Wisdom and Discernment

- Not every problem is demonic
- Consider natural and psychological factors
- Work with medical and mental health professionals
- Maintain humility and dependence on God

## Fruit of Deliverance Ministry

When done properly, deliverance ministry produces:
- Genuine freedom in Christ
- Transformed lives
- Stronger faith
- Effective witnesses
- Healthy churches`
    }
  ];

  for (let i = 0; i < div108Lessons.length; i++) {
    const [lesson] = await db.insert(lessons).values({
      courseId: div108.id,
      title: div108Lessons[i].title,
      content: div108Lessons[i].content,
      order: i + 1
    }).returning();
    
    // Add quiz questions
    await db.insert(quizQuestions).values([
      {
        lessonId: lesson.id,
        question: `What is a key biblical foundation for deliverance ministry?`,
        options: JSON.stringify(['Jesus cast out demons', 'It was only for apostles', 'It ended with the early church', 'It requires special ordination']),
        correctAnswer: 'Jesus cast out demons'
      },
      {
        lessonId: lesson.id,
        question: `What must a person do to receive deliverance?`,
        options: JSON.stringify(['Be willing and cooperative', 'Be perfect first', 'Fast for 40 days', 'Have a special anointing']),
        correctAnswer: 'Be willing and cooperative'
      }
    ]);
  }
  
  console.log(`✓ Added ${div108Lessons.length} lessons to DIV108`);

  // Step 4: Add lessons to DIV109 - Fivefold Ministry
  console.log('\n4. Adding lessons to DIV109...');
  const div109Lessons = [
    {
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

These offices exist "for the equipping of the saints for the work of ministry" (Ephesians 4:12).

**Not Replacement**: These leaders don't do all the ministry; they equip others to minister.

**Maturity**: The goal is bringing believers to spiritual maturity and unity.

**Body Building**: Each office contributes to building up the body of Christ.

## Practical Applications

1. Recognize these offices in operation today
2. Understand your role in the body
3. Honor and receive from fivefold ministers
4. Discover your own calling and gifting

## Reflection Questions

1. Which of the five offices do you see most clearly in your church?
2. How has God used fivefold ministers in your spiritual growth?
3. What might God be calling you to in terms of ministry?`
    },
    {
      title: 'The Apostolic Ministry',
      content: `# The Apostolic Ministry

## Understanding Apostleship

The apostolic office carries unique authority and responsibility in the church.

### Characteristics of Apostles

**Sent Ones**: The word "apostle" means "sent one" - they are commissioned by God for specific purposes.

**Foundation Layers**: Apostles lay foundations for churches and movements (1 Corinthians 3:10).

**Signs and Wonders**: Apostolic ministry is often accompanied by miracles and signs (2 Corinthians 12:12).

**Governmental Authority**: Apostles carry authority to establish order and doctrine.

## Types of Apostolic Ministry

### Foundational Apostles

The Twelve and Paul had unique authority in establishing the church and writing Scripture.

### Modern Apostolic Ministry

Today's apostles function in:
- Church planting and establishing
- Bringing correction and alignment
- Imparting spiritual gifts
- Providing strategic direction
- Networking and connecting churches

## Apostolic Functions

1. **Pioneering**: Breaking new ground for the gospel
2. **Establishing**: Setting foundations and structures
3. **Fathering**: Mentoring and raising up leaders
4. **Aligning**: Bringing churches into proper order
5. **Networking**: Connecting ministries and leaders`
    },
    {
      title: 'The Prophetic Ministry',
      content: `# The Prophetic Ministry

## The Prophet's Role

Prophets hear from God and communicate His heart and mind to His people.

### Core Functions

**Revelation**: Receiving insight and revelation from God.

**Declaration**: Speaking God's word with authority and clarity.

**Direction**: Providing guidance for individuals, churches, and nations.

**Correction**: Calling people back to God's ways and standards.

## Types of Prophetic Expression

### Office vs. Gift

**Prophetic Office**: A recognized ministry calling with consistent prophetic function.

**Gift of Prophecy**: Available to all believers for edification, exhortation, and comfort (1 Corinthians 14:3).

### Prophetic Operations

- Personal prophecy for individuals
- Corporate prophecy for churches
- Prophetic intercession
- Prophetic acts and demonstrations
- Prophetic teaching

## Developing Prophetic Ministry

### Growing in the Prophetic

1. Cultivate intimacy with God
2. Study biblical prophets
3. Practice hearing God's voice
4. Submit to accountability
5. Develop character and humility

### Prophetic Protocol

- Test all prophecy against Scripture
- Submit to leadership
- Deliver words with humility
- Allow for interpretation and application
- Take responsibility for accuracy`
    },
    {
      title: 'Evangelists, Pastors, and Teachers',
      content: `# Evangelists, Pastors, and Teachers

## The Evangelist

Evangelists are gifted to proclaim the gospel and win souls.

### Evangelistic Calling

**Soul Winners**: Primary focus is reaching the lost with the gospel.

**Equippers**: Train others in evangelism and soul-winning.

**Harvesters**: Gather in the harvest of souls.

### Evangelistic Methods

- Mass evangelism and crusades
- Personal evangelism
- Media and technology
- Creative outreach
- Marketplace ministry

## The Pastor

Pastors shepherd and care for God's flock.

### Pastoral Functions

**Feeding**: Providing spiritual nourishment through teaching and preaching.

**Leading**: Guiding the flock in right paths.

**Protecting**: Guarding against false teaching and spiritual danger.

**Caring**: Ministering to individual needs and hurts.

### Pastoral Heart

- Sacrificial love for the sheep
- Patience with the immature
- Wisdom in leadership
- Availability and accessibility
- Long-term commitment

## The Teacher

Teachers explain and apply God's Word with clarity and accuracy.

### Teaching Ministry

**Exposition**: Breaking down Scripture for understanding.

**Application**: Showing how truth applies to life.

**Systematic**: Organizing doctrine and theology.

**Practical**: Making truth accessible and usable.

### Effective Teaching

1. Know the Word thoroughly
2. Understand your audience
3. Use clear illustrations
4. Apply truth practically
5. Live what you teach`
    },
    {
      title: 'Working Together in Unity',
      content: `# Working Together in Unity

## The Synergy of the Five

Each office needs the others for the church to function properly.

### Complementary Roles

**Apostles** provide structure and direction
**Prophets** bring revelation and correction
**Evangelists** bring in new believers
**Pastors** care for and nurture the flock
**Teachers** build understanding and doctrine

### Avoiding Imbalance

Churches need all five offices to remain healthy:
- Without apostles: Lack of vision and direction
- Without prophets: Spiritual dullness
- Without evangelists: Inward focus and decline
- Without pastors: Wounded and scattered sheep
- Without teachers: Doctrinal error and confusion

## Receiving from Fivefold Ministers

### Honor and Submission

**Recognition**: Acknowledge God-ordained ministry gifts.

**Reception**: Receive what each office brings.

**Support**: Provide prayer, encouragement, and resources.

**Submission**: Submit to godly authority and leadership.

## Your Place in Ministry

### Every Believer's Calling

While not everyone is called to fivefold ministry, every believer is called to ministry.

**Discover Your Gifts**: Identify how God has gifted you.

**Develop Your Calling**: Grow in your areas of gifting.

**Deploy in Service**: Use your gifts to build up the body.

### Maturity and Unity

The goal of fivefold ministry is:
- Unity of faith
- Knowledge of Christ
- Spiritual maturity
- Stability in doctrine
- Love in action

When the fivefold ministry functions properly, the whole body grows and matures together.`
    }
  ];

  for (let i = 0; i < div109Lessons.length; i++) {
    const [lesson] = await db.insert(lessons).values({
      courseId: div109.id,
      title: div109Lessons[i].title,
      content: div109Lessons[i].content,
      order: i + 1
    }).returning();
    
    await db.insert(quizQuestions).values([
      {
        lessonId: lesson.id,
        question: `What is the primary purpose of the fivefold ministry?`,
        options: JSON.stringify(['To equip the saints for ministry', 'To do all the ministry work', 'To control the church', 'To collect tithes']),
        correctAnswer: 'To equip the saints for ministry'
      },
      {
        lessonId: lesson.id,
        question: `Which office lays foundations for churches?`,
        options: JSON.stringify(['Apostle', 'Prophet', 'Pastor', 'Teacher']),
        correctAnswer: 'Apostle'
      }
    ]);
  }
  
  console.log(`✓ Added ${div109Lessons.length} lessons to DIV109`);

  // Step 5: Add lessons to DIV110 - Prophecy
  console.log('\n5. Adding lessons to DIV110...');
  const div110Lessons = [
    {
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
4. Submit to biblical guidelines

## Reflection Questions

1. Have you ever received a prophetic word? How did it impact you?
2. What fears or concerns do you have about prophecy?
3. How can you grow in hearing God's voice?`
    },
    {
      title: 'Biblical Foundations of Prophecy',
      content: `# Biblical Foundations of Prophecy

## Old Testament Prophets

The prophetic office was central to Israel's relationship with God.

### Major Prophets

**Isaiah, Jeremiah, Ezekiel, Daniel**: Spoke to nations and kings, foretold the Messiah, and called Israel to repentance.

### Minor Prophets

Twelve prophets who addressed specific situations and time periods with God's word.

### Prophetic Functions

- Forth-telling: Declaring God's current word
- Fore-telling: Predicting future events
- Intercession: Standing in the gap for the people
- Confrontation: Challenging sin and idolatry

## New Testament Prophecy

### Jesus the Prophet

Christ fulfilled the prophetic office perfectly, speaking only what the Father showed Him.

### Prophecy in the Church

**Day of Pentecost**: Peter declared that prophecy would be poured out on all flesh (Acts 2:17-18).

**Prophetic Ministry**: Agabus, Philip's daughters, and others operated in prophetic gifts.

**Regulation**: Paul gave guidelines for prophetic ministry in the church (1 Corinthians 14).

## Prophetic Principles

1. All prophecy must align with Scripture
2. Prophecy should build up, not tear down
3. Prophets must submit to leadership
4. Prophecy should be judged and tested
5. Love must motivate all prophetic ministry`
    },
    {
      title: 'Hearing God's Voice',
      content: `# Hearing God's Voice

## How God Speaks

God communicates with His people in various ways.

### Primary Methods

**Scripture**: The primary and authoritative way God speaks (2 Timothy 3:16).

**Still Small Voice**: The gentle whisper of the Holy Spirit (1 Kings 19:12).

**Dreams and Visions**: God speaks through the subconscious and supernatural visions (Acts 2:17).

**Prophetic Words**: Through other believers operating in prophecy.

**Circumstances**: God's providence and open/closed doors.

**Inner Witness**: Peace or unease in your spirit.

## Developing Sensitivity

### Cultivating Listening

1. **Quiet Time**: Regular periods of silence before God
2. **Scripture Meditation**: Dwelling on God's Word
3. **Journaling**: Recording what you sense God saying
4. **Obedience**: Acting on what you hear
5. **Community**: Testing what you hear with mature believers

### Removing Hindrances

**Sin**: Unconfessed sin blocks spiritual sensitivity.

**Busyness**: Constant activity drowns out God's voice.

**Unbelief**: Doubt prevents hearing.

**Self-Focus**: Preoccupation with self limits spiritual awareness.

## Testing What You Hear

### Biblical Tests

1. **Scripture**: Does it align with God's Word?
2. **Character**: Does it reflect God's nature?
3. **Peace**: Do you have inner peace about it?
4. **Fruit**: Will it produce good fruit?
5. **Witnesses**: Do mature believers confirm it?

### Discernment

Not every thought or impression is from God. Learn to distinguish:
- God's voice (peaceful, consistent with Scripture, builds up)
- Your own thoughts (self-focused, anxious, contradictory)
- Enemy's voice (condemning, confusing, destructive)`
    },
    {
      title: 'Operating in Prophetic Ministry',
      content: `# Operating in Prophetic Ministry

## Prophetic Protocol

Guidelines for healthy prophetic ministry.

### Preparation

**Personal Holiness**: Maintain a clean heart and pure motives.

**Intimacy with God**: Prophecy flows from relationship.

**Humility**: Recognize you're a vessel, not the source.

**Accountability**: Submit to spiritual authority.

## Delivering Prophetic Words

### How to Prophesy

**Wait on God**: Don't manufacture words; wait for genuine inspiration.

**Speak in Faith**: When you sense God's prompting, step out in faith.

**Use Wisdom**: Consider timing, setting, and the person's readiness.

**Stay Humble**: Present it as what you sense, not as absolute truth.

### Prophetic Language

**Clear Communication**: Avoid unnecessary mysticism or confusion.

**Appropriate Tone**: Match the tone to the message (encouragement, correction, warning).

**Scriptural Foundation**: Root your words in biblical truth.

## Types of Prophetic Expression

### Personal Prophecy

Words for individuals regarding their calling, situation, or future.

### Corporate Prophecy

Messages for churches, ministries, or groups.

### Prophetic Intercession

Praying God's heart and purposes over situations.

### Prophetic Acts

Symbolic actions that demonstrate or release God's word.

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
4. **Learn and Grow**: Evaluate accuracy and grow in gifting`
    },
    {
      title: 'Prophetic Pitfalls and Safeguards',
      content: `# Prophetic Pitfalls and Safeguards

## Common Mistakes

### Prophetic Errors

**Presumption**: Speaking your own thoughts as God's word.

**Manipulation**: Using prophecy to control or influence others.

**Pride**: Becoming arrogant about your gifting.

**Independence**: Operating without accountability.

**Mixture**: Combining God's word with personal opinion.

## Avoiding Deception

### Protecting Yourself

**Know the Word**: Deep biblical knowledge prevents error.

**Stay Humble**: Pride opens the door to deception.

**Maintain Community**: Isolation leads to imbalance.

**Test Everything**: Don't accept every prophetic word uncritically.

### Warning Signs

- Prophecies that contradict Scripture
- Words that promote the prophet over Christ
- Manipulation or control
- Consistent inaccuracy
- Lack of accountability

## Accountability Structures

### Prophetic Teams

**Team Ministry**: Prophesy with others for balance and confirmation.

**Leadership Oversight**: Submit prophetic words to church leadership.

**Peer Review**: Allow other prophets to judge your words.

## Restoration and Growth

### When You Miss It

**Acknowledge Error**: Admit when you've been wrong.

**Seek Forgiveness**: Apologize to those affected.

**Learn from Mistakes**: Identify what went wrong and grow.

**Stay Humble**: Don't let failure stop you from growing.

### Developing Accuracy

1. Practice regularly in safe environments
2. Get feedback from mature believers
3. Study biblical prophets
4. Maintain intimacy with God
5. Keep learning and growing`
    },
    {
      title: 'The Prophetic Office in the Church',
      content: `# The Prophetic Office in the Church

## Recognizing Prophetic Ministry

### Characteristics of Prophetic Office

**Consistent Function**: Regular, reliable prophetic operation.

**Recognition**: Acknowledged by leadership and the body.

**Maturity**: Demonstrated character and wisdom.

**Fruit**: Accurate, edifying words that bear good fruit.

## The Prophet's Role

### Functions in the Church

**Revelation**: Bringing insight and understanding.

**Direction**: Providing guidance for the church's path.

**Correction**: Calling the church back to God's standards.

**Intercession**: Standing in the gap for the church and nation.

**Training**: Equipping others in prophetic ministry.

## Working with Leadership

### Healthy Relationships

**Submission**: Honor pastoral authority.

**Timing**: Allow leaders to determine when and how words are shared.

**Partnership**: Work together for the church's benefit.

**Humility**: Recognize your role as one of many gifts.

### Prophetic Presbytery

Groups of prophetic ministers who:
- Pray over and prophesy to individuals
- Confirm callings and giftings
- Provide direction and encouragement
- Operate under pastoral oversight

## Prophetic Culture

### Building Healthy Prophetic Environment

**Encouragement**: Create safe spaces for people to practice.

**Teaching**: Provide biblical instruction on prophecy.

**Accountability**: Maintain standards and oversight.

**Honor**: Value prophetic ministry without idolizing it.

**Balance**: Keep prophecy in proper perspective with other gifts.

## The Future of Prophetic Ministry

### Last Days Prophecy

Scripture indicates increased prophetic activity in the end times (Joel 2:28-29).

**Greater Outpouring**: More people prophesying.

**Increased Accuracy**: Sharper prophetic insight.

**Strategic Direction**: Guidance for navigating challenging times.

### Your Prophetic Journey

Whether called to the prophetic office or simply desiring the gift:
- Pursue intimacy with God
- Study Scripture diligently
- Practice faithfully
- Stay accountable
- Keep growing

The church needs prophetic voices who will speak God's word with clarity, accuracy, and love.`
    }
  ];

  for (let i = 0; i < div110Lessons.length; i++) {
    const [lesson] = await db.insert(lessons).values({
      courseId: div110.id,
      title: div110Lessons[i].title,
      content: div110Lessons[i].content,
      order: i + 1
    }).returning();
    
    await db.insert(quizQuestions).values([
      {
        lessonId: lesson.id,
        question: `What is the purpose of New Testament prophecy according to 1 Corinthians 14:3?`,
        options: JSON.stringify(['Edification, exhortation, and comfort', 'Prediction of the future', 'Condemning sin', 'Establishing doctrine']),
        correctAnswer: 'Edification, exhortation, and comfort'
      },
      {
        lessonId: lesson.id,
        question: `How should all prophecy be tested?`,
        options: JSON.stringify(['Against Scripture', 'By feelings', 'By popularity', 'By the prophet\'s reputation']),
        correctAnswer: 'Against Scripture'
      }
    ]);
  }
  
  console.log(`✓ Added ${div110Lessons.length} lessons to DIV110`);

  console.log('\n✅ Course reorganization complete!');
  console.log('\nSummary:');
  console.log('- Removed 3 lessons from existing courses');
  console.log('- Created 3 new courses (DIV108, DIV109, DIV110)');
  console.log('- Added 18 new lessons total');
  console.log('- Total courses now: 10');
}

reorganizeCourses()
  .then(() => {
    console.log('\n✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Error:', error);
    process.exit(1);
  });
