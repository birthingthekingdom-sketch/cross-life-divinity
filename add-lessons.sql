-- Add lessons to DIV108: Deliverance Ministry
INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES
(30001, 'Introduction to Deliverance Ministry', '# Introduction to Deliverance Ministry

## Understanding Spiritual Bondage

Deliverance ministry addresses the reality of spiritual bondage that can affect believers and non-believers alike.

### Key Concepts

**Biblical Foundation**: Jesus ministry included casting out demons and setting captives free (Luke 4:18-19).

**Types of Bondage**: Spiritual bondages can manifest through generational curses, traumatic experiences, persistent sin patterns, occult involvement, or demonic oppression.

**Freedom in Christ**: True deliverance comes through the finished work of Christ on the cross.

## Practical Applications

1. Recognize the signs of spiritual bondage
2. Understand your authority as a believer
3. Cooperate with the Holy Spirit', 1),

(30001, 'The Deliverance Process', '# The Deliverance Process

## Steps in Deliverance

### 1. Confession and Repentance
The individual must confess known sins and renounce involvement with darkness.

### 2. Breaking Legal Ground
- Renounce ancestral sins
- Break generational curses
- Forgive those who have caused harm

### 3. Commanding Spirits to Leave
Using the authority of Jesus name, command spirits to depart.

### 4. Sealing the Deliverance
- Pray for the filling of the Holy Spirit
- Establish spiritual disciplines
- Provide follow-up and accountability', 2),

(30001, 'Maintaining Freedom', '# Maintaining Freedom

## The Danger of Empty Houses

Jesus warned that deliverance without discipleship leads to worse bondage (Matthew 12:43-45).

## Spiritual Disciplines

### Daily Practices
1. **Prayer**: Maintain constant communication with God
2. **Scripture**: Daily Bible reading and meditation
3. **Worship**: Regular praise and thanksgiving
4. **Fellowship**: Stay connected to the body of Christ

## Long-Term Victory

True freedom is maintained through growing in spiritual maturity and developing Christ-like character.', 3);

-- Add lessons to DIV109: The Fivefold Ministry
INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES
(30002, 'Introduction to the Fivefold Ministry', '# Introduction to the Fivefold Ministry

## Biblical Foundation

The fivefold ministry is outlined in Ephesians 4:11-13.

### The Five Offices

**Apostle**: Sent ones who establish and oversee churches.
**Prophet**: Those who hear from God and speak His word.
**Evangelist**: Proclaimers of the gospel who win souls.
**Pastor**: Shepherds who care for and nurture the flock.
**Teacher**: Those who explain and apply Scripture.

## Purpose

These offices exist for equipping the saints for the work of ministry (Ephesians 4:12).', 1),

(30002, 'Apostles and Prophets', '# Apostles and Prophets

## The Apostolic Ministry

Apostles lay foundations for churches and movements (1 Corinthians 3:10).

### Characteristics
- Sent ones commissioned by God
- Signs and wonders accompany their ministry
- Governmental authority to establish order

## The Prophetic Ministry

Prophets hear from God and communicate His heart.

### Core Functions
- Revelation from God
- Declaration of God\'s word
- Direction for individuals and churches
- Correction when needed', 2),

(30002, 'Evangelists, Pastors, and Teachers', '# Evangelists, Pastors, and Teachers

## The Evangelist

Evangelists proclaim the gospel and win souls.

## The Pastor

Pastors shepherd and care for God\'s flock through feeding, leading, protecting, and caring.

## The Teacher

Teachers explain and apply God\'s Word with clarity and accuracy.

## Unity in Diversity

All five offices work together to build up the body of Christ in love and unity.', 3);

-- Add lessons to DIV110: Prophecy & Prophetic Office
INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES
(30003, 'Introduction to Prophecy', '# Introduction to Prophecy

## Understanding Prophecy

Prophecy is the supernatural ability to receive and communicate messages from God.

### Purpose of Prophecy

**Edification**: Building up believers (1 Corinthians 14:3)
**Exhortation**: Encouraging and motivating
**Comfort**: Providing consolation and hope

## The Gift vs. The Office

**Gift of Prophecy**: Available to all believers
**Office of Prophet**: A recognized ministry calling with consistent prophetic function', 1),

(30003, 'Hearing God\'s Voice', '# Hearing God\'s Voice

## How God Speaks

### Primary Methods

**Scripture**: The primary and authoritative way God speaks (2 Timothy 3:16).
**Still Small Voice**: The gentle whisper of the Holy Spirit.
**Dreams and Visions**: God speaks through supernatural visions.

## Testing What You Hear

1. **Scripture**: Does it align with God\'s Word?
2. **Character**: Does it reflect God\'s nature?
3. **Peace**: Do you have inner peace about it?
4. **Fruit**: Will it produce good fruit?
5. **Witnesses**: Do mature believers confirm it?', 2),

(30003, 'Operating in Prophetic Ministry', '# Operating in Prophetic Ministry

## Prophetic Protocol

### Preparation
- Personal Holiness
- Intimacy with God
- Humility
- Accountability

## Delivering Prophetic Words

**Wait on God**: Do not manufacture words.
**Speak in Faith**: Step out when God prompts.
**Use Wisdom**: Consider timing and setting.
**Stay Humble**: Present it as what you sense.

## Handling Prophecy

When you receive prophecy: Record it, test it, wait on timing, and act in faith on confirmed words.', 3);

-- Update course lesson counts
UPDATE courses SET totalLessons = 3 WHERE id IN (30001, 30002, 30003);
