import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || '';
const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/);
const [, user, password, host, database] = urlMatch || ['', 'root', '', 'localhost', 'test'];

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

const lessonsData = {
  'BIB101': [
    {
      title: 'Introduction to the Old Testament',
      order: 1,
      content: `## Introduction to the Old Testament

### Overview
The Old Testament is the foundational collection of sacred texts that forms the first major section of the Christian Bible. Composed primarily in Hebrew over approximately 1,000 years, these 39 books chronicle God's relationship with humanity from creation through the restoration of Israel after exile. Understanding the Old Testament is essential for comprehending the complete biblical narrative and the theological foundations of Christianity.

### Learning Objectives
- Understand the structure and composition of the Old Testament
- Identify the major sections and their characteristics
- Recognize key themes and theological concepts
- Appreciate the historical and cultural context of Old Testament writings
- Understand how the Old Testament connects to the New Testament

### Key Points
- **Structure**: The Old Testament contains 39 books divided into four main sections: the Torah (5 books), Historical Books (12 books), Wisdom Literature (5 books), and Prophetic Books (17 books)
- **Timeline**: Written primarily in Hebrew over approximately 1,000 years (12th-2nd centuries BCE)
- **Historical Scope**: Reflects the history of ancient Israel from patriarchal times through the post-exilic period
- **Literary Genres**: Contains multiple literary genres including narrative, poetry, wisdom literature, and prophecy
- **Central Theme**: Emphasizes God's covenant relationship with Israel and humanity's response to divine revelation
- **Theological Foundation**: Provides historical, cultural, and theological context for understanding the New Testament
- **Major Events**: Includes accounts of creation, the patriarchs, the exodus, the wilderness wandering, the conquest of Canaan, the monarchy, exile, and restoration
- **Key Themes**: Addresses themes of faith, obedience, justice, redemption, and God's faithfulness

### Scripture References
- Genesis 1:1 - The creation account and beginning of God's revelation
- Exodus 3:14 - God's self-revelation to Moses
- Deuteronomy 6:4-5 - The Shema, central to Jewish faith
- Psalm 23 - The Lord as shepherd, exemplifying wisdom literature
- Isaiah 53 - The suffering servant, prophetic literature
- Malachi 4:5-6 - Final Old Testament prophecy

### Summary
The Old Testament represents God's progressive revelation to humanity through the history of Israel. These ancient texts reveal God's character, establish His covenant with His people, and set the stage for the coming of Christ. Studying the Old Testament provides believers with a comprehensive understanding of biblical history, theology, and the foundation upon which Christian faith is built.

---

Licensed to Larry Fisher`
    },
    {
      title: 'The Torah: Books of Moses',
      order: 2,
      content: `## The Torah: Books of Moses

### Overview
The Torah, also called the Pentateuch or the Five Books of Moses, consists of Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. These foundational texts establish the theological framework for all of Scripture, presenting God's creation of the world, His covenant with Abraham, the liberation of Israel from Egypt, and the giving of the Law at Mount Sinai. The Torah is considered the most sacred part of the Hebrew Bible.

### Learning Objectives
- Understand the structure and content of each book of the Torah
- Identify the major covenants and their significance
- Recognize the role of Moses in God's plan
- Understand the purpose and application of Old Testament law
- Connect Torah themes to New Testament fulfillment

### Key Points
- **Genesis**: Establishes God's creation, humanity's fall, and God's covenant with Abraham (12:1-3)
- **Exodus**: Chronicles Israel's liberation from Egypt and the giving of the Ten Commandments at Mount Sinai
- **Leviticus**: Details the sacrificial system, priestly duties, and laws for holy living
- **Numbers**: Records Israel's wilderness wandering and preparation for entering Canaan
- **Deuteronomy**: Contains Moses' farewell address and restatement of the Law
- **The Mosaic Covenant**: Established at Sinai, conditional upon Israel's obedience
- **The Law**: 613 commandments categorized as ceremonial, civil, and moral laws
- **Theological Significance**: Reveals God's character, His redemptive plan, and His expectations for His people

### Scripture References
- Genesis 12:1-3 - The Abrahamic covenant
- Exodus 3:1-15 - God's call to Moses
- Exodus 20:1-17 - The Ten Commandments
- Leviticus 19:18 - Love your neighbor as yourself
- Numbers 14:1-45 - Israel's failure to enter Canaan
- Deuteronomy 6:4-5 - The Shema

### Summary
The Torah forms the theological and historical foundation of the entire Bible. Through the stories of creation, the patriarchs, and the exodus, God reveals His character and His plan for redemption. The laws given through Moses establish the standards for holy living and point forward to Christ's fulfillment of the Law.

---

Licensed to Larry Fisher`
    },
    {
      title: 'The Historical Books',
      order: 3,
      content: `## The Historical Books

### Overview
The Historical Books (Joshua through Esther) chronicle Israel's conquest of Canaan, the establishment of the monarchy, the divided kingdom, exile, and restoration. These twelve books provide a continuous historical narrative spanning approximately 1,000 years and demonstrate God's faithfulness despite Israel's repeated unfaithfulness.

### Learning Objectives
- Understand Israel's conquest and settlement of Canaan
- Trace the development of the monarchy from Saul through the exile
- Recognize patterns of faithfulness and unfaithfulness
- Understand the significance of David and Solomon
- Connect historical events to theological lessons

### Key Points
- **Joshua**: Chronicles the conquest of Canaan under Joshua's leadership
- **Judges**: Records the period of tribal judges and Israel's cycles of sin and deliverance
- **Ruth**: A redemption story during the judges period, establishing David's lineage
- **1-2 Samuel**: Chronicles the establishment of the monarchy under Saul and David
- **1-2 Kings**: Records the united kingdom under Solomon and the divided kingdom
- **1-2 Chronicles**: Parallel account emphasizing the Davidic line and temple worship
- **Ezra-Nehemiah**: Chronicles the return from exile and rebuilding of Jerusalem
- **Esther**: Demonstrates God's providential care during the diaspora

### Scripture References
- Joshua 1:8 - God's promise to Joshua
- 1 Samuel 16:7 - God looks at the heart
- 2 Samuel 7:12-13 - The Davidic covenant
- 1 Kings 8:27-30 - Solomon's prayer at the temple dedication
- 2 Kings 25:1-12 - The fall of Jerusalem and exile
- Nehemiah 8:8 - Ezra reads the Law to the people

### Summary
The Historical Books reveal God's sovereignty in Israel's history. Despite repeated cycles of sin and judgment, God remains faithful to His covenant promises. These books establish the Davidic dynasty as central to God's redemptive plan and demonstrate that God's purposes cannot be thwarted by human failure.

---

Licensed to Larry Fisher`
    },
    {
      title: 'Poetry and Wisdom Literature',
      order: 4,
      content: `## Poetry and Wisdom Literature

### Overview
The Wisdom Literature section of the Old Testament (Job, Psalms, Proverbs, Ecclesiastes, and Song of Solomon) uses poetic and philosophical language to address life's deepest questions. These books explore themes of suffering, praise, practical living, the meaning of life, and human love, offering timeless wisdom for believers.

### Learning Objectives
- Understand the characteristics of Hebrew poetry
- Recognize the different types of wisdom literature
- Apply biblical wisdom to contemporary life
- Understand how these books address suffering and meaning
- Connect wisdom literature to Christ

### Key Points
- **Job**: Addresses the problem of suffering and God's justice through dialogue and divine response
- **Psalms**: Collection of 150 prayers and praises expressing the full range of human emotion before God
- **Proverbs**: Collection of practical wisdom sayings for righteous living and decision-making
- **Ecclesiastes**: Philosophical exploration of life's meaning and the vanity of human pursuits
- **Song of Solomon**: Poetic celebration of human love and intimacy
- **Hebrew Poetry**: Uses parallelism, metaphor, and imagery rather than rhyme
- **Wisdom Themes**: Fear of the Lord, righteousness, justice, humility, and trust in God

### Scripture References
- Job 42:1-6 - Job's response to God's revelation
- Psalm 23 - The Lord as shepherd
- Proverbs 3:5-6 - Trust in the Lord with all your heart
- Ecclesiastes 12:13-14 - Fear God and keep His commandments
- Song of Solomon 2:16 - Expression of mutual love

### Summary
The Wisdom Literature provides spiritual and practical guidance for believers. Through poetry and philosophical reflection, these books address life's fundamental questions and point believers toward trust in God and righteous living. They demonstrate that faith involves both intellectual understanding and emotional engagement with God.

---

Licensed to Larry Fisher`
    },
    {
      title: 'Major Prophets: Isaiah',
      order: 5,
      content: `## Major Prophets: Isaiah

### Overview
Isaiah is the longest prophetic book in the Old Testament and is considered the most significant. Written by the prophet Isaiah during the 8th century BCE, this 66-chapter book addresses Judah's spiritual condition, announces judgment for sin, and offers hope through prophecies of restoration and the coming Messiah. Isaiah's prophecies profoundly influence New Testament theology.

### Learning Objectives
- Understand Isaiah's historical context and ministry
- Identify major themes in Isaiah's prophecies
- Recognize messianic prophecies and their fulfillment in Christ
- Understand the structure and major sections of Isaiah
- Apply Isaiah's message to contemporary faith

### Key Points
- **Historical Context**: Isaiah ministered during the Assyrian crisis when the northern kingdom fell (722 BCE)
- **Structure**: Three major sections addressing judgment (1-39), comfort (40-55), and restoration (56-66)
- **Key Themes**: God's holiness, human sinfulness, judgment, redemption, and restoration
- **Messianic Prophecies**: Isaiah 7:14 (virgin birth), 9:6-7 (Messiah's birth), 53 (suffering servant)
- **The Suffering Servant**: Isaiah 52:13-53:12 describes the servant's vicarious suffering for others' sins
- **Restoration Hope**: Despite judgment, Isaiah promises restoration and a renewed creation
- **Influence on New Testament**: More frequently quoted in the New Testament than any other Old Testament book

### Scripture References
- Isaiah 1:18 - Come, let us reason together
- Isaiah 6:1-8 - Isaiah's call and commissioning
- Isaiah 7:14 - A virgin shall conceive
- Isaiah 40:31 - Those who hope in the Lord will renew their strength
- Isaiah 53:5-6 - The suffering servant bearing our sins

### Summary
Isaiah presents a comprehensive vision of God's redemptive plan. Through prophecies of judgment and restoration, Isaiah reveals God's character and His ultimate purpose to redeem creation through the Messiah. The book's profound messianic prophecies have made it central to Christian theology and apologetics.

---

Licensed to Larry Fisher`
    },
    {
      title: 'Major Prophets: Jeremiah and Lamentations',
      order: 6,
      content: `## Major Prophets: Jeremiah and Lamentations

### Overview
Jeremiah, called "the weeping prophet," ministered during Judah's final decades before the Babylonian exile. His prophecies warned of judgment, called for repentance, and ultimately proclaimed hope for restoration. The book of Lamentations, traditionally attributed to Jeremiah, is a poetic response to the destruction of Jerusalem in 586 BCE.

### Learning Objectives
- Understand Jeremiah's historical context and prophetic ministry
- Recognize Jeremiah's personal struggles and faith
- Understand the new covenant prophecy
- Comprehend the theological meaning of lament
- Connect Jeremiah's message to Christ

### Key Points
- **Jeremiah's Ministry**: Prophesied for 40+ years during the reign of five kings
- **Message of Judgment**: Called Judah to repentance before the Babylonian invasion
- **Personal Struggles**: Jeremiah's internal conflict between his calling and personal suffering
- **New Covenant**: Jeremiah 31:31-34 prophesies a new covenant written on hearts
- **Hope Amid Judgment**: Despite judgment, Jeremiah promises restoration and God's enduring love
- **Lamentations**: Five poetic laments expressing grief over Jerusalem's destruction
- **Theological Significance**: Demonstrates that God's judgment serves redemptive purposes

### Scripture References
- Jeremiah 1:4-10 - Jeremiah's call and commissioning
- Jeremiah 23:5-6 - The righteous branch (Messiah)
- Jeremiah 29:11 - Plans for welfare and hope
- Jeremiah 31:31-34 - The new covenant
- Lamentations 3:22-23 - God's mercies are new every morning

### Summary
Jeremiah and Lamentations reveal God's heart for His people even in judgment. Jeremiah's prophecies demonstrate that God's discipline aims at restoration, and the new covenant promises an intimate relationship with God. Lamentations teaches believers that honest expression of grief and pain is appropriate in faith.

---

Licensed to Larry Fisher`
    },
    {
      title: 'Major Prophets: Ezekiel and Daniel',
      order: 7,
      content: `## Major Prophets: Ezekiel and Daniel

### Overview
Ezekiel and Daniel prophesied during the Babylonian exile (6th century BCE). Ezekiel addressed the exiled community in Babylon, offering visions of God's throne, judgment, and restoration. Daniel, a Jewish official in the Babylonian court, demonstrated faithfulness to God and received apocalyptic visions of future kingdoms and God's ultimate victory.

### Learning Objectives
- Understand the historical context of exile
- Recognize Ezekiel's visions and their theological significance
- Understand Daniel's apocalyptic prophecies
- Comprehend the theme of God's sovereignty
- Connect these prophecies to New Testament fulfillment

### Key Points
- **Ezekiel's Visions**: Throne chariot (merkabah), valley of dry bones, restored temple
- **Ezekiel's Message**: God's glory departs but will return; restoration is possible
- **Daniel's Faithfulness**: Refused to compromise despite pressure to assimilate
- **Daniel's Visions**: Four kingdoms, the son of man, the 70 weeks
- **Apocalyptic Literature**: Uses symbolic imagery to reveal God's control of history
- **Sovereignty Theme**: Despite earthly powers, God remains sovereign
- **Messianic Elements**: Daniel 7:13-14 describes the son of man coming with clouds of heaven

### Scripture References
- Ezekiel 1:1-28 - Vision of God's throne
- Ezekiel 37:1-14 - Valley of dry bones vision
- Daniel 1:8 - Daniel's resolve not to defile himself
- Daniel 3:16-18 - Shadrach, Meshach, and Abednego's faith
- Daniel 7:13-14 - The son of man vision

### Summary
Ezekiel and Daniel demonstrate God's faithfulness during exile. Through visions and prophecies, they reveal that God's purposes continue despite earthly circumstances. Their messages of God's sovereignty and ultimate victory provide hope to believers facing difficult circumstances and assure them that God's kingdom will ultimately triumph.

---

Licensed to Larry Fisher`
    },
    {
      title: 'Minor Prophets - Part 1',
      order: 8,
      content: `## Minor Prophets - Part 1

### Overview
The twelve Minor Prophets (Hosea through Malachi) are called "minor" not because they are less important, but because they are shorter than the Major Prophets. These prophets ministered during various periods from the 8th to 5th centuries BCE, addressing both the northern and southern kingdoms. Part 1 covers Hosea, Joel, Amos, Obadiah, Jonah, and Micah.

### Learning Objectives
- Understand the historical context of each prophet
- Recognize the major themes of each prophetic book
- Understand God's relationship with His people through these prophets
- Recognize messianic prophecies in the Minor Prophets
- Apply these prophecies to contemporary faith

### Key Points
- **Hosea**: God's faithful love despite Israel's unfaithfulness; marriage as metaphor for covenant
- **Joel**: The day of the Lord; outpouring of God's Spirit (quoted in Acts 2)
- **Amos**: God's justice and concern for the poor; judgment on injustice
- **Obadiah**: Judgment on Edom; God's ultimate sovereignty
- **Jonah**: God's grace and mercy extended to all nations; repentance and forgiveness
- **Micah**: God's requirements for justice, mercy, and humility; Messiah born in Bethlehem

### Scripture References
- Hosea 11:8-9 - God's compassionate love
- Joel 2:28-32 - Outpouring of the Spirit
- Amos 5:24 - Let justice roll down like waters
- Obadiah 1:21 - The kingdom will be the Lord's
- Jonah 4:10-11 - God's concern for all people
- Micah 5:2 - Messiah born in Bethlehem
- Micah 6:8 - What does the Lord require of you?

### Summary
The first six Minor Prophets reveal God's character as both just and merciful. They call God's people to repentance, justice, and faithfulness while assuring them of God's ultimate sovereignty and redemptive purposes. These prophecies demonstrate that God's concern extends to all nations and that His kingdom will ultimately triumph.

---

Licensed to Larry Fisher`
    },
    {
      title: 'Minor Prophets - Part 2',
      order: 9,
      content: `## Minor Prophets - Part 2

### Overview
Part 2 of the Minor Prophets covers Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, and Malachi. These six prophets ministered during the later period of the divided kingdom and the post-exilic restoration. They address God's judgment, the restoration of Jerusalem, and messianic expectations.

### Learning Objectives
- Understand the historical context of each prophet
- Recognize themes of judgment and restoration
- Understand the post-exilic community's hopes
- Recognize messianic prophecies in these books
- Connect these prophecies to New Testament fulfillment

### Key Points
- **Nahum**: God's judgment on Nineveh; comfort for Judah
- **Habakkuk**: Wrestling with God about injustice; faith in God's ultimate justice
- **Zephaniah**: The day of the Lord; judgment and restoration
- **Haggai**: Encouragement to rebuild the temple; God's presence with His people
- **Zechariah**: Visions of restoration; messianic prophecies; God's future kingdom
- **Malachi**: God's love for Israel; call to faithfulness; promise of Elijah's return

### Scripture References
- Nahum 1:7 - The Lord is good, a refuge in times of trouble
- Habakkuk 2:4 - The righteous will live by faith
- Zephaniah 3:17 - The Lord rejoices over you with singing
- Haggai 2:4-5 - Be strong, for I am with you
- Zechariah 9:9 - Your king comes to you, righteous and victorious
- Malachi 3:1 - I will send my messenger to prepare the way

### Summary
The final six Minor Prophets address the post-exilic community's restoration and messianic hopes. They assure believers that despite judgment, God remains faithful to His covenant promises. These prophecies point forward to Christ's coming and the establishment of God's eternal kingdom, providing hope and encouragement to believers.

---

Licensed to Larry Fisher`
    },
    {
      title: 'Old Testament Themes and Fulfillment',
      order: 10,
      content: `## Old Testament Themes and Fulfillment

### Overview
The Old Testament presents recurring themes that find their ultimate fulfillment in Jesus Christ and the New Testament. Understanding these themes provides a comprehensive framework for interpreting Scripture and recognizing how God's redemptive plan unfolds throughout history.

### Learning Objectives
- Identify major Old Testament themes
- Understand how these themes develop throughout Scripture
- Recognize Old Testament types and their New Testament fulfillment
- Understand the connection between Old and New Testaments
- Apply Old Testament themes to contemporary faith

### Key Points
- **Covenant Theme**: God's progressive revelation through covenants (Abrahamic, Mosaic, Davidic, New)
- **Redemption**: God's consistent work to redeem His people from bondage and sin
- **Sacrifice**: The sacrificial system pointing to Christ's ultimate sacrifice
- **Messiah**: Progressive revelation of the coming Messiah through prophecy and type
- **God's Faithfulness**: Despite human failure, God remains faithful to His promises
- **Justice and Mercy**: God's character combining both justice and compassionate mercy
- **Kingdom**: God's kingdom progressively revealed and ultimately established in Christ
- **Restoration**: God's consistent work to restore His people and creation

### Scripture References
- Genesis 3:15 - The protoevangelium (first gospel promise)
- Exodus 12 - Passover as type of Christ's redemption
- Leviticus 16 - Day of Atonement foreshadowing Christ's sacrifice
- 1 Samuel 16:13 - David's anointing foreshadowing Christ
- Isaiah 53 - Suffering servant fulfilled in Christ
- Malachi 4:5-6 - Promise of Elijah's return (John the Baptist)

### Summary
The Old Testament presents a coherent narrative of God's redemptive plan. Through covenants, sacrifices, prophecies, and types, God progressively reveals His plan to redeem humanity through Christ. Understanding these themes enables believers to see the unity of Scripture and recognize how the Old Testament points to and is fulfilled in the New Testament. This comprehensive perspective strengthens faith and provides a foundation for biblical interpretation.

---

Licensed to Larry Fisher`
    }
  ]
};

async function createLessons() {
  const connection = await pool.getConnection();
  
  try {
    let totalCreated = 0;
    
    for (const [courseCode, lessons] of Object.entries(lessonsData)) {
      // Get course ID
      const [courses] = await connection.query(
        'SELECT id FROM courses WHERE code = ?',
        [courseCode]
      );
      
      if (courses.length === 0) {
        console.log(`❌ Course ${courseCode} not found`);
        continue;
      }
      
      const courseId = courses[0].id;
      console.log(`\n📚 Creating lessons for ${courseCode} (Course ID: ${courseId})`);
      
      for (const lesson of lessons) {
        try {
          await connection.query(
            'INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)',
            [courseId, lesson.title, lesson.content, lesson.order]
          );
          console.log(`  ✓ Created: ${lesson.title}`);
          totalCreated++;
        } catch (error) {
          console.error(`  ❌ Failed to create "${lesson.title}": ${error.message}`);
        }
      }
    }
    
    console.log(`\n✅ Total lessons created: ${totalCreated}`);
    
    // Verify
    const [result] = await connection.query('SELECT COUNT(*) as count FROM lessons');
    console.log(`📊 Total lessons in database: ${result[0].count}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

createLessons();
