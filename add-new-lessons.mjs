import { drizzle } from "drizzle-orm/mysql2";
import { lessons, quizQuestions, courses } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

const newLessons = [
  {
    courseId: 4, // DIV104 - Spiritual Gifts
    title: "Understanding Deliverance Ministry",
    lessonOrder: 8,
    content: `# Understanding Deliverance Ministry

Deliverance ministry is a crucial aspect of spiritual warfare and freedom in Christ. This lesson explores the biblical foundation for deliverance and its necessity for living a life of freedom from spiritual and natural bondages.

## The Biblical Foundation

Jesus came to set the captives free (Luke 4:18-19). Throughout His ministry, He demonstrated authority over demons and spiritual oppression, and He gave His disciples the same authority (Luke 10:19).

### Key Scriptures

- **John 8:36**: "So if the Son sets you free, you will be free indeed."
- **2 Corinthians 3:17**: "Now the Lord is the Spirit, and where the Spirit of the Lord is, there is freedom."
- **James 4:7**: "Submit yourselves, therefore, to God. Resist the devil, and he will flee from you."

## Types of Bondage

### Spiritual Bondages
- Demonic oppression and influence
- Generational curses and patterns
- Occult involvement and its consequences
- Unconfessed sin and unforgiveness

### Natural Bondages
- Addictions (substances, behaviors, thought patterns)
- Emotional wounds and trauma
- Destructive relationships and soul ties
- Mental strongholds and lies

## The Process of Deliverance

### 1. Recognition
Acknowledge the bondage and its impact on your life. The Holy Spirit brings conviction and awareness.

### 2. Repentance
Turn away from sin and renounce any agreements with darkness. Confess and forsake the bondage.

### 3. Renunciation
Verbally break agreements with the enemy. Declare your freedom in Christ's name.

### 4. Replacement
Fill the void with God's Word, worship, and the Holy Spirit. Maintain your freedom through spiritual disciplines.

## Maintaining Freedom

Deliverance is not just a one-time event but an ongoing lifestyle:

1. **Daily surrender** to the Holy Spirit
2. **Regular prayer and fasting** for spiritual strength
3. **Accountability** with mature believers
4. **Renewing your mind** with Scripture
5. **Walking in forgiveness** toward others

## The Authority of the Believer

As believers, we have been given authority over all the power of the enemy (Luke 10:19). This authority is exercised through:

- The name of Jesus
- The blood of Jesus
- The Word of God
- Faith and obedience

## Practical Application

1. Examine your life for areas of bondage
2. Seek prayer and ministry from mature believers
3. Study Scripture on spiritual warfare
4. Develop a lifestyle of freedom and victory

## Reflection Questions

- Are there areas in your life where you feel bound or oppressed?
- Have you experienced the freedom that comes through deliverance?
- How can you help others find freedom in Christ?`,
    quizzes: [
      {
        question: "According to Luke 4:18-19, what did Jesus come to do?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Condemn sinners", "Set captives free", "Judge the world", "Establish a kingdom"]),
        correctAnswer: "Set captives free",
        questionOrder: 1
      },
      {
        question: "What is the first step in the process of deliverance?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Replacement", "Renunciation", "Recognition", "Repentance"]),
        correctAnswer: "Recognition",
        questionOrder: 2
      },
      {
        question: "True or False: Deliverance is a one-time event and requires no ongoing maintenance.",
        questionType: "true_false",
        options: JSON.stringify(["True", "False"]),
        correctAnswer: "False",
        questionOrder: 3
      }
    ]
  },
  {
    courseId: 4, // DIV104 - Spiritual Gifts
    title: "The Office and Gift of Prophecy",
    lessonOrder: 9,
    content: `# The Office and Gift of Prophecy

The study of the office and the gift of prophecy involves a deep exploration within a Christian theological framework. Prophecy refers to the spiritual gift of receiving and communicating messages from God, often concerning divine insight, future events, or spiritual guidance.

## Understanding Prophecy

### Definition
Prophecy is the supernatural ability to receive and declare the mind and counsel of God. It operates both as a gift of the Spirit (1 Corinthians 12:10) and as an office in the church (Ephesians 4:11).

### Biblical Foundation

- **1 Corinthians 14:3**: "But the one who prophesies speaks to people for their strengthening, encouraging and comfort."
- **Amos 3:7**: "Surely the Sovereign LORD does nothing without revealing his plan to his servants the prophets."
- **Acts 2:17-18**: God promises to pour out His Spirit and His people will prophesy.

## The Gift of Prophecy

### Purpose
The gift of prophecy is given for:
1. **Edification** - Building up the church
2. **Exhortation** - Encouraging and motivating believers
3. **Comfort** - Bringing consolation and peace

### Characteristics
- Available to all believers (1 Corinthians 14:31)
- Must be tested and judged (1 Corinthians 14:29)
- Should be exercised in love (1 Corinthians 13:2)
- Operates under the authority of Scripture

## The Office of Prophet

### Distinction from the Gift
While all can prophesy, not all are prophets. The office of prophet is a calling and appointment by God for specific ministry leadership.

### Old Testament Prophets
- Spoke God's word to nations and kings
- Called people to repentance
- Foretold future events
- Demonstrated signs and wonders

### New Testament Prophets
- Function within the church body
- Work alongside other fivefold ministers
- Provide direction and confirmation
- Equip and train believers

## Testing Prophecy

### Biblical Tests
1. **Does it align with Scripture?** (Isaiah 8:20)
2. **Does it glorify Jesus?** (Revelation 19:10)
3. **Does it produce good fruit?** (Matthew 7:16)
4. **Does it come to pass?** (Deuteronomy 18:22)
5. **Does it edify the church?** (1 Corinthians 14:3)

### Discernment
- Prophecy should never contradict Scripture
- Personal prophecy should confirm what God is already speaking
- Beware of manipulation or control through prophecy
- Submit prophecy to spiritual leadership

## Developing the Prophetic Gift

### Steps to Growth
1. **Study the Word** - Know God's voice through Scripture
2. **Cultivate intimacy** - Spend time in God's presence
3. **Practice discernment** - Learn to distinguish God's voice
4. **Step out in faith** - Begin to share what you receive
5. **Submit to accountability** - Allow others to judge and refine

### Pitfalls to Avoid
- Pride and self-promotion
- Operating outside of love
- Seeking sensationalism
- Ignoring proper order and authority

## The Role in the Believer's Life

Prophecy serves to:
- Reveal God's heart and purposes
- Provide guidance and direction
- Confirm God's calling and promises
- Warn of danger or deception
- Release faith and hope

## Practical Application

1. Desire spiritual gifts, especially prophecy (1 Corinthians 14:1)
2. Create space to hear from God regularly
3. Journal what you sense God is saying
4. Share prophetic words with humility and love
5. Welcome correction and refinement

## Reflection Questions

- Have you experienced the gift of prophecy in your life?
- How can you cultivate greater sensitivity to God's voice?
- What safeguards do you have in place for testing prophetic words?`,
    quizzes: [
      {
        question: "According to 1 Corinthians 14:3, what three purposes does prophecy serve?",
        questionType: "short_answer",
        correctAnswer: "strengthening, encouraging, and comfort",
        questionOrder: 1
      },
      {
        question: "True or False: Everyone who prophesies holds the office of prophet.",
        questionType: "true_false",
        options: JSON.stringify(["True", "False"]),
        correctAnswer: "False",
        questionOrder: 2
      },
      {
        question: "What is the primary test for any prophecy?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Does it sound impressive", "Does it align with Scripture", "Does it predict the future", "Does everyone agree with it"]),
        correctAnswer: "Does it align with Scripture",
        questionOrder: 3
      }
    ]
  },
  {
    courseId: 6, // DIV106 - Discipleship & Mentoring
    title: "The Fivefold Ministry",
    lessonOrder: 9,
    content: `# The Fivefold Ministry

Understanding the fivefold ministry and the five ministry roles of Apostle, Prophet, Evangelist, Pastor, and Teacher is essential for the purpose of perfecting believers for work in ministry.

## Biblical Foundation

**Ephesians 4:11-13** states: "So Christ himself gave the apostles, the prophets, the evangelists, the pastors and teachers, to equip his people for works of service, so that the body of Christ may be built up until we all reach unity in the faith and in the knowledge of the Son of God and become mature, attaining to the whole measure of the fullness of Christ."

## The Purpose of Fivefold Ministry

### Primary Functions
1. **Equipping the saints** for works of service
2. **Building up the body** of Christ
3. **Bringing unity** in faith and knowledge
4. **Promoting maturity** in believers
5. **Manifesting Christ's fullness** in the church

## The Five Ministry Offices

### 1. Apostle (The Sent One)

**Role**: Apostles are sent ones who establish, govern, and provide foundational leadership to the church.

**Characteristics**:
- Pioneer new works and territories
- Establish churches and ministries
- Provide governmental oversight
- Demonstrate signs and wonders
- Carry authority and wisdom

**Biblical Examples**: Paul, Peter, Barnabas

**Modern Expression**: Church planters, missionary leaders, network overseers

### 2. Prophet (The Seer)

**Role**: Prophets receive and communicate God's word, providing direction, correction, and revelation.

**Characteristics**:
- Hear and speak God's voice
- Provide spiritual insight and foresight
- Call people to righteousness
- Expose hidden things
- Confirm God's purposes

**Biblical Examples**: Agabus, Silas, Philip's daughters

**Modern Expression**: Prophetic ministers, intercessors, spiritual advisors

### 3. Evangelist (The Messenger)

**Role**: Evangelists proclaim the gospel, win souls, and ignite passion for reaching the lost.

**Characteristics**:
- Preach the gospel boldly
- Win souls to Christ
- Demonstrate power evangelism
- Train others in outreach
- Stir evangelistic zeal

**Biblical Examples**: Philip, Timothy

**Modern Expression**: Evangelists, missionaries, outreach leaders

### 4. Pastor (The Shepherd)

**Role**: Pastors care for, protect, and nurture the flock of God.

**Characteristics**:
- Provide loving care and counsel
- Protect from false teaching
- Guide spiritual development
- Create safe community
- Model Christ's compassion

**Biblical Examples**: Timothy, Titus (pastoral roles)

**Modern Expression**: Local church pastors, small group leaders, pastoral counselors

### 5. Teacher (The Instructor)

**Role**: Teachers explain and apply God's Word, bringing understanding and wisdom.

**Characteristics**:
- Explain Scripture accurately
- Make truth understandable
- Develop doctrine
- Train and disciple
- Impart knowledge and wisdom

**Biblical Examples**: Apollos, Priscilla and Aquila

**Modern Expression**: Bible teachers, seminary professors, discipleship leaders

## How They Work Together

### Synergy and Balance
Each ministry gift complements the others:
- **Apostles** provide structure and vision
- **Prophets** provide direction and correction
- **Evangelists** provide growth and outreach
- **Pastors** provide care and stability
- **Teachers** provide understanding and doctrine

### Avoiding Imbalance
A healthy church needs all five ministries functioning together. Overemphasis on one gift creates imbalance:
- Too much apostolic: Authoritarian control
- Too much prophetic: Instability and confusion
- Too much evangelistic: Shallow converts
- Too much pastoral: Inward focus, no growth
- Too much teaching: Intellectualism without power

## Recognizing Your Calling

### Questions to Consider
1. What ministry activities energize you?
2. What results do you consistently see in your ministry?
3. What do mature believers affirm in you?
4. Where does your heart naturally gravitate?
5. What needs do you see and want to meet?

### Development Process
1. **Discover** your gifting through serving
2. **Develop** through training and mentorship
3. **Deploy** under spiritual covering
4. **Demonstrate** fruit and faithfulness
5. **Mature** through experience and refinement

## Practical Application

### For Leaders
- Identify and activate fivefold ministers
- Create space for each gift to function
- Build teams with diverse giftings
- Release people into their callings

### For Believers
- Honor all five ministry gifts
- Receive from each ministry
- Discover your own calling
- Submit to spiritual authority
- Pursue excellence in your gifting

## The Ultimate Goal

The fivefold ministry exists to bring the church to maturity - "attaining to the whole measure of the fullness of Christ" (Ephesians 4:13). When these gifts function together, the body of Christ grows strong, unified, and effective.

## Reflection Questions

- Which of the fivefold ministries do you most resonate with?
- How have you been equipped by these ministry gifts?
- What steps can you take to develop your calling?`,
    quizzes: [
      {
        question: "According to Ephesians 4:11-13, what is the primary purpose of the fivefold ministry?",
        questionType: "multiple_choice",
        options: JSON.stringify(["To control the church", "To equip believers for works of service", "To collect tithes", "To perform miracles"]),
        correctAnswer: "To equip believers for works of service",
        questionOrder: 1
      },
      {
        question: "Which ministry role is described as 'The Shepherd'?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Apostle", "Prophet", "Evangelist", "Pastor"]),
        correctAnswer: "Pastor",
        questionOrder: 2
      },
      {
        question: "True or False: A healthy church only needs one of the fivefold ministry gifts to function properly.",
        questionType: "true_false",
        options: JSON.stringify(["True", "False"]),
        correctAnswer: "False",
        questionOrder: 3
      },
      {
        question: "What is the ultimate goal of the fivefold ministry according to Ephesians 4:13?",
        questionType: "short_answer",
        correctAnswer: "attaining to the whole measure of the fullness of Christ",
        questionOrder: 4
      }
    ]
  }
];

async function addLessons() {
  console.log("Adding new lessons...");
  
  for (const lessonData of newLessons) {
    const { quizzes, ...lessonInfo } = lessonData;
    
    // Insert lesson
    const result = await db.insert(lessons).values(lessonInfo);
    console.log(`✓ Added lesson: ${lessonInfo.title}`);
    
    // Get the inserted lesson ID (MySQL returns insertId)
    const lessonId = result[0].insertId;
    
    // Insert quiz questions
    for (const quiz of quizzes) {
      await db.insert(quizQuestions).values({
        lessonId: lessonId,
        ...quiz
      });
    }
    console.log(`  ✓ Added ${quizzes.length} quiz questions`);
  }
  
  // Update course totalLessons counts
  console.log("\nUpdating course lesson counts...");
  
  // DIV104 - Spiritual Gifts (was 7, now 9)
  await db.update(courses).set({ totalLessons: 9 }).where(eq(courses.id, 4));
  console.log("✓ Updated DIV104 to 9 lessons");
  
  // DIV106 - Discipleship & Mentoring (was 8, now 9)
  await db.update(courses).set({ totalLessons: 9 }).where(eq(courses.id, 6));
  console.log("✓ Updated DIV106 to 9 lessons");
  
  console.log("\n✅ All new lessons added successfully!");
  process.exit(0);
}

addLessons().catch(error => {
  console.error("Error adding lessons:", error);
  process.exit(1);
});
