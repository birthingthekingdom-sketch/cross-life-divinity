-- Comprehensive Lesson Enhancement Script
-- This script enhances all lessons with:
-- 1. Detailed theological content
-- 2. Reading material and assignments
-- 3. Minimum 10 quiz questions per lesson
-- 4. Written reflection questions

-- ============================================
-- FOUNDATIONAL THEOLOGY (DIV101)
-- ============================================

-- Lesson 1: Introduction to Systematic Theology
UPDATE lessons SET
  content = '# Introduction to Systematic Theology

## What is Systematic Theology?
Systematic theology is the discipline of organizing biblical truth into coherent doctrinal categories. Unlike biblical theology which follows the historical progression of Scripture, systematic theology arranges biblical teachings thematically to develop a comprehensive understanding of God\'s nature, character, and redemptive plan.

### Historical Development
The systematic approach to theology emerged during the medieval period with theologians like Thomas Aquinas, who sought to reconcile faith and reason. The Protestant Reformation brought renewed emphasis on Scripture as the sole authority (sola scriptura), leading to more biblically-grounded systematic theologies by figures such as John Calvin and Martin Luther.

### Key Characteristics
**Coherence**: Systematic theology seeks internal consistency, ensuring that doctrines do not contradict one another.
**Comprehensiveness**: It attempts to address all major Christian doctrines in an organized manner.
**Biblical Foundation**: All doctrines must be grounded in Scripture, the ultimate authority.
**Practical Application**: Theology is not merely academic but should transform how believers live and serve God.

## The Major Doctrinal Categories
1. **Theology Proper**: The study of God\'s nature, attributes, and existence
2. **Christology**: The person and work of Jesus Christ
3. **Pneumatology**: The doctrine of the Holy Spirit
4. **Soteriology**: The doctrine of salvation
5. **Ecclesiology**: The doctrine of the Church
6. **Eschatology**: The doctrine of end times

## Why Study Systematic Theology?
Understanding biblical doctrine strengthens faith, provides discernment against false teachings, enables effective ministry, and deepens our relationship with God. Systematic theology helps believers develop a biblical worldview that informs every aspect of life and service.

## The Role of Reason and Revelation
While Scripture is the ultimate authority, God has given us the capacity for reason. Systematic theology uses reason to understand and articulate biblical revelation, recognizing that faith and reason are not opposed but complementary. However, reason must always be subject to Scripture\'s authority.',
  readingMaterial = '**Primary Texts:**
- Grudem, Wayne. "Systematic Theology: An Introduction to Biblical Doctrine." Zondervan, 2000. (Chapters 1-3)
- Calvin, John. "Institutes of the Christian Religion." Book I, Chapters 1-5

**Supplementary Reading:**
- Erickson, Millard J. "Christian Theology." Baker Academic, 2013. (Introduction)
- Bloesch, Donald G. "A Theology of Word and Spirit." InterVarsity Press, 1992.

**Scripture References:**
- 2 Timothy 2:15 - "Present yourself to God as one approved, a worker who... correctly handles the word of truth"
- Romans 12:2 - "Do not conform to the pattern of this world, but be transformed by the renewing of your mind"',
  assignment = '**Written Assignment: Personal Theological Reflection**
Write a 2-3 page reflection on how understanding systematic theology can strengthen your personal faith and ministry. Include at least one example of how proper doctrine has helped you or someone you know overcome a spiritual challenge.

**Written Reflection Questions:**
1. How has your understanding of theology changed as a result of this lesson?
2. Which doctrinal category (Theology Proper, Christology, Pneumatology, Soteriology, Ecclesiology, or Eschatology) is most important to your personal faith journey and why?

**Due Date:** End of Week 2'
WHERE title = 'Introduction to Systematic Theology' AND courseId IN (SELECT id FROM courses WHERE code = 'DIV101');

-- Add 12 quiz questions for Lesson 1
DELETE FROM quiz_questions WHERE lessonId IN (SELECT id FROM lessons WHERE title = 'Introduction to Systematic Theology' AND courseId IN (SELECT id FROM courses WHERE code = 'DIV101'));

INSERT INTO quiz_questions (lessonId, question, questionType, options, correctAnswer, questionOrder)
SELECT l.id, 'What is the primary focus of systematic theology?', 'multiple_choice', 
  JSON_ARRAY('Organizing biblical truth into coherent doctrinal categories', 'Following the historical progression of Scripture', 'Studying only the Old Testament', 'Developing personal opinions about God'),
  'Organizing biblical truth into coherent doctrinal categories', 1
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'Which theologian is known for seeking to reconcile faith and reason during the medieval period?', 'multiple_choice',
  JSON_ARRAY('Thomas Aquinas', 'Martin Luther', 'John Calvin', 'Augustine'),
  'Thomas Aquinas', 2
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'What does "sola scriptura" mean?', 'multiple_choice',
  JSON_ARRAY('Scripture alone as authority', 'Reason alone is sufficient', 'Tradition is most important', 'Personal experience determines truth'),
  'Scripture alone as authority', 3
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'Which of the following is NOT one of the major doctrinal categories mentioned?', 'multiple_choice',
  JSON_ARRAY('Cosmology', 'Christology', 'Pneumatology', 'Soteriology'),
  'Cosmology', 4
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'What is the relationship between faith and reason in systematic theology?', 'multiple_choice',
  JSON_ARRAY('They are opposed to each other', 'They are complementary, with reason subject to Scripture', 'Reason is superior to faith', 'They are completely separate concerns'),
  'They are complementary, with reason subject to Scripture', 5
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'True or False: Systematic theology seeks to ensure doctrines do not contradict one another.', 'true_false',
  NULL, 'true', 6
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'What is the purpose of studying systematic theology according to the lesson?', 'short_answer',
  NULL, 'To strengthen faith, provide discernment against false teachings, enable effective ministry, and deepen our relationship with God', 7
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'Which of the following best describes the goal of systematic theology?', 'multiple_choice',
  JSON_ARRAY('To develop a comprehensive understanding of God and His plan', 'To prove that God does not exist', 'To create new doctrines', 'To replace Scripture with human reasoning'),
  'To develop a comprehensive understanding of God and His plan', 8
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'What is Theology Proper?', 'short_answer',
  NULL, 'The study of God\'s nature, attributes, and existence', 9
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'According to the lesson, systematic theology should transform how believers:', 'multiple_choice',
  JSON_ARRAY('Live and serve God', 'Earn money', 'Gain political power', 'Avoid reading Scripture'),
  'Live and serve God', 10
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'True or False: Scripture is the ultimate authority in systematic theology.', 'true_false',
  NULL, 'true', 11
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101')
UNION ALL
SELECT l.id, 'What is the main difference between biblical theology and systematic theology?', 'short_answer',
  NULL, 'Biblical theology follows the historical progression of Scripture, while systematic theology arranges teachings thematically', 12
FROM lessons l WHERE l.title = 'Introduction to Systematic Theology' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV101');

-- ============================================
-- CHRISTOLOGY (DIV102)
-- ============================================

-- Lesson 1: The Person of Christ
UPDATE lessons SET
  content = '# The Person of Christ

## Who is Jesus Christ?
Jesus Christ is the eternal Son of God who became incarnate (took on human flesh) for humanity\'s redemption. He is fully God and fully human, the God-man who alone bridges the infinite gap between holy God and sinful humanity.

### The Pre-Incarnate Christ
Before His earthly ministry, Jesus existed eternally with God the Father. The Gospel of John opens with this profound truth: "In the beginning was the Word, and the Word was with God, and the Word was God" (John 1:1). Jesus was active in creation, sustaining all things by His powerful word (Colossians 1:16-17).

### The Incarnation
The incarnation refers to God the Son taking on human flesh and becoming the God-man, Jesus Christ. This is Christianity\'s most distinctive claim and central mystery. Jesus was born of a virgin, lived a sinless life, died on the cross, rose from the dead, and ascended to heaven.

**Why the Incarnation?**
- To reveal God\'s character and nature (John 1:18)
- To accomplish redemption through His death and resurrection
- To provide a perfect example of obedience and righteousness
- To establish His authority as the judge of all humanity

## The Two Natures of Christ
Jesus possesses two distinct natures united in one person: a complete divine nature and a complete human nature.

### Christ\'s Divine Nature
Jesus possessed all the attributes of God:
- **Omniscience**: Knowledge of all things (John 2:24-25)
- **Omnipotence**: Power over nature and demons (Mark 4:35-41)
- **Eternality**: Existence before creation (John 8:58)
- **Immutability**: Unchanging character (Hebrews 13:8)

He accepted worship (Matthew 14:33), forgave sins (Mark 2:5), and claimed to be God (John 10:30).

### Christ\'s Human Nature
Jesus was genuinely human:
- He had a physical body (Luke 24:39)
- He experienced hunger, thirst, and fatigue (John 4:6-7)
- He experienced emotions: compassion, anger, sorrow (John 11:35)
- He prayed and submitted to the Father\'s will (Luke 22:42)
- He grew in wisdom and stature (Luke 2:52)

Importantly, Jesus\' humanity was sinless. He was tempted in every way, yet without sin (Hebrews 4:15).

## The Hypostatic Union
The hypostatic union refers to the permanent union of Christ\'s divine and human natures in one person. This is not a mixture or confusion of natures but a true union. Jesus is not two persons but one person with two natures.

### Theological Significance
This union ensures that:
- God Himself entered into human experience and suffering
- Christ\'s sacrifice has infinite value (God dying for humanity)
- Christ can serve as the perfect mediator between God and humanity
- Christ\'s resurrection guarantees the redemption of our bodies

## Titles and Names of Christ
**The Word (Logos)**: Emphasizes Christ as God\'s self-revelation
**The Son of God**: Emphasizes His divine nature and relationship to the Father
**The Son of Man**: Emphasizes His humanity and identification with humanity
**The Messiah/Christ**: Emphasizes His role as God\'s anointed one
**Lord**: Emphasizes His authority and deity
**Savior**: Emphasizes His redemptive work',
  readingMaterial = '**Primary Texts:**
- Grudem, Wayne. "Systematic Theology." Zondervan, 2000. (Chapters 24-27)
- Stott, John. "The Incomparable Christ." InterVarsity Press, 2001.

**Supplementary Reading:**
- Piper, John. "Jesus the Radical Submissive." Crossway, 2010.
- Torrance, Thomas F. "The Incarnation: The Ecumenical Significance of the Incarnation." Handsel Press, 1981.

**Scripture References:**
- John 1:1-14 - The incarnation of the Word
- Philippians 2:5-11 - Christ\'s humiliation and exaltation
- Colossians 1:15-20 - Christ\'s supremacy',
  assignment = '**Written Assignment: The Significance of the Incarnation**
Write a 3-page essay exploring why the incarnation is central to Christian faith. Address:
1. How the incarnation reveals God\'s character
2. Why God becoming human was necessary for redemption
3. How understanding Christ\'s two natures affects your worship and obedience

**Written Reflection Questions:**
1. What does it mean to you personally that Jesus is fully God and fully human?
2. How does the hypostatic union affect your understanding of Christ\'s sacrifice?'
WHERE title = 'The Person of Christ' AND courseId IN (SELECT id FROM courses WHERE code = 'DIV102');

-- Add 12 quiz questions for Christology Lesson 1
DELETE FROM quiz_questions WHERE lessonId IN (SELECT id FROM lessons WHERE title = 'The Person of Christ' AND courseId IN (SELECT id FROM courses WHERE code = 'DIV102'));

INSERT INTO quiz_questions (lessonId, question, questionType, options, correctAnswer, questionOrder)
SELECT l.id, 'What does "incarnation" mean in Christian theology?', 'multiple_choice',
  JSON_ARRAY('God the Son taking on human flesh', 'God becoming invisible', 'A spiritual vision', 'An ancient religious practice'),
  'God the Son taking on human flesh', 1
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'According to John 1:1, what was true about the Word in the beginning?', 'multiple_choice',
  JSON_ARRAY('The Word was with God and was God', 'The Word was separate from God', 'The Word did not exist', 'The Word was created by God'),
  'The Word was with God and was God', 2
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'Jesus Christ possesses which of the following?', 'multiple_choice',
  JSON_ARRAY('Only a divine nature', 'Only a human nature', 'Both a complete divine nature and a complete human nature', 'A mixture of divine and human natures'),
  'Both a complete divine nature and a complete human nature', 3
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'What is the hypostatic union?', 'short_answer',
  NULL, 'The permanent union of Christ\'s divine and human natures in one person', 4
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'True or False: Jesus experienced hunger, thirst, and fatigue during His earthly ministry.', 'true_false',
  NULL, 'true', 5
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'Which attribute of God did Jesus NOT possess?', 'multiple_choice',
  JSON_ARRAY('Omniscience', 'Omnipotence', 'Eternality', 'Limited knowledge'),
  'Limited knowledge', 6
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'What does it mean that Jesus was "sinless"?', 'short_answer',
  NULL, 'He was tempted in every way but did not sin; He was morally perfect and without any transgression', 7
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'According to the lesson, what is the primary purpose of the incarnation?', 'multiple_choice',
  JSON_ARRAY('To accomplish redemption through His death and resurrection', 'To become a political leader', 'To establish a new religion', 'To demonstrate human weakness'),
  'To accomplish redemption through His death and resurrection', 8
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'What does the title "Logos" (the Word) emphasize about Christ?', 'short_answer',
  NULL, 'Christ as God\'s self-revelation and the eternal Word of God', 9
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'True or False: The hypostatic union means Jesus is two separate persons.', 'true_false',
  NULL, 'false', 10
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'How does Christ\'s sacrifice have infinite value?', 'short_answer',
  NULL, 'Because God Himself died for humanity; the divine nature gives infinite worth to the sacrifice', 11
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102')
UNION ALL
SELECT l.id, 'Which of the following best describes Christ\'s role as mediator?', 'multiple_choice',
  JSON_ARRAY('He bridges the gap between holy God and sinful humanity', 'He eliminates the need for God', 'He makes humans equal to God', 'He creates a new god'),
  'He bridges the gap between holy God and sinful humanity', 12
FROM lessons l WHERE l.title = 'The Person of Christ' AND l.courseId IN (SELECT id FROM courses WHERE code = 'DIV102');

-- ============================================
-- DELIVERANCE MINISTRY (DIV108)
-- ============================================

-- Enhance existing Deliverance Ministry lessons with more content and questions
UPDATE lessons SET
  readingMaterial = '**Primary Texts:**
- Prince, Derek. "Blessing or Curse: You Can Choose." Chosen Books, 2006.
- Murphy, Ed. "The Handbook for Spiritual Warfare." Thomas Nelson, 2003.

**Supplementary Reading:**
- Kraft, Charles H. "Defeating Dark Angels." Servant Publications, 1992.
- Wagner, C. Peter. "Warfare Prayer." Regal Books, 1992.

**Scripture References:**
- Luke 4:18-19 - Jesus\' mission to set captives free
- Mark 16:17 - Authority over demonic forces
- Ephesians 6:10-18 - Spiritual armor and warfare',
  assignment = '**Written Assignment: Personal Deliverance Testimony**
Write a 2-3 page reflection on an area of your life where you have experienced spiritual bondage and freedom. Include:
1. The nature of the bondage
2. How you sought deliverance
3. The role of Christ\'s authority in your freedom
4. How maintaining freedom has affected your spiritual growth

**Written Reflection Questions:**
1. What does it mean to you that Jesus has authority over demonic forces?
2. How can understanding deliverance ministry help you minister to others?'
WHERE courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND lessonOrder = 1;

-- Add comprehensive quiz questions for Deliverance Ministry Lesson 1
DELETE FROM quiz_questions WHERE lessonId IN (SELECT id FROM lessons WHERE courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND lessonOrder = 1);

INSERT INTO quiz_questions (lessonId, question, questionType, options, correctAnswer, questionOrder)
SELECT l.id, 'What is the biblical foundation for deliverance ministry?', 'multiple_choice',
  JSON_ARRAY('Jesus cast out demons and set captives free', 'It was only for the apostles', 'It ended with the early church', 'It requires special ordination'),
  'Jesus cast out demons and set captives free', 1
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'What are the types of spiritual bondage mentioned in the lesson?', 'short_answer',
  NULL, 'Generational curses, traumatic experiences, persistent sin patterns, occult involvement, and demonic oppression', 2
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'True or False: True deliverance comes through Christ\'s finished work on the cross.', 'true_false',
  NULL, 'true', 3
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'What must a person do to receive deliverance?', 'multiple_choice',
  JSON_ARRAY('Actively participate in renouncing darkness', 'Be perfect first', 'Fast for 40 days', 'Have a special anointing'),
  'Actively participate in renouncing darkness', 4
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'According to Mark 16:17, what authority do believers have?', 'short_answer',
  NULL, 'Authority over demonic forces and the ability to cast out demons in Jesus\' name', 5
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'What is the relationship between personal responsibility and deliverance?', 'multiple_choice',
  JSON_ARRAY('Personal responsibility plays an important role in maintaining freedom', 'Responsibility is not important', 'Only God is responsible', 'Demons are responsible'),
  'Personal responsibility plays an important role in maintaining freedom', 6
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'What areas of life might need deliverance?', 'short_answer',
  NULL, 'Any area where spiritual bondage exists, including thoughts, emotions, behaviors, relationships, and spiritual strongholds', 7
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'True or False: Understanding Christ\'s victory on the cross affects our approach to spiritual warfare.', 'true_false',
  NULL, 'true', 8
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'How does deliverance ministry relate to the Great Commission?', 'short_answer',
  NULL, 'The Great Commission includes authority over demonic forces; deliverance is part of proclaiming freedom in Christ', 9
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'What is the ultimate goal of deliverance ministry?', 'multiple_choice',
  JSON_ARRAY('To set people free from spiritual bondage and restore them to wholeness in Christ', 'To demonstrate power over demons', 'To create fear of demons', 'To establish a new church'),
  'To set people free from spiritual bondage and restore them to wholeness in Christ', 10
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'What does it mean to "renounce darkness"?', 'short_answer',
  NULL, 'To consciously reject and turn away from anything connected to sin, demons, or rebellion against God', 11
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1
UNION ALL
SELECT l.id, 'How should believers respond to spiritual bondage in their lives?', 'multiple_choice',
  JSON_ARRAY('Seek deliverance through Christ\'s authority and cooperate with the Holy Spirit', 'Ignore it and hope it goes away', 'Accept it as God\'s will', 'Turn to other spiritual practices'),
  'Seek deliverance through Christ\'s authority and cooperate with the Holy Spirit', 12
FROM lessons l WHERE l.courseId IN (SELECT id FROM courses WHERE code = 'DIV108') AND l.lessonOrder = 1;

-- Continue with other lessons...
-- Note: This script can be extended with more lessons following the same pattern

COMMIT;
