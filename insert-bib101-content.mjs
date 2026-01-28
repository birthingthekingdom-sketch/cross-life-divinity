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

async function insertBIB101Content() {
  let pool;
  try {
    pool = mysql.createPool({
      ...config,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    const db = drizzle(pool, { mode: 'default' });

    console.log("🔍 Finding BIB101 course...");
    const courseResult = await db
      .select()
      .from(courses)
      .where(eq(courses.code, "BIB101"))
      .limit(1);

    if (courseResult.length === 0) {
      console.error("❌ BIB101 course not found in database");
      if (pool) await pool.end();
      process.exit(1);
    }

    const courseId = courseResult[0].id;
    console.log(`✅ Found BIB101 with ID: ${courseId}`);

    // BIB101 Lesson Content
    const bib101Lessons = [
      {
        courseId,
        title: "Introduction to the Old Testament",
        content: `The Old Testament, also known as Hebrew Scripture or Tanakh, forms the foundation of biblical faith and represents approximately 1,000 years of Jewish history and religious development. Composed of 39 books in the Christian canon, the Old Testament chronicles God's relationship with humanity from creation through the restoration period following the Babylonian exile. Understanding the Old Testament requires familiarity with its historical context, literary genres, and theological themes that continue to shape religious thought today. The Old Testament was written primarily in Hebrew with some Aramaic portions and reflects the experiences, beliefs, and spiritual journey of ancient Israel. These sacred texts have been preserved, interpreted, and transmitted through centuries of Jewish and Christian tradition, making them essential for understanding the development of monotheistic faith and biblical theology.

Key Points:
- The Old Testament contains 39 books divided into four main sections: the Torah (5 books), Historical Books (12 books), Wisdom Literature (5 books), and Prophetic Books (17 books)
- Written primarily in Hebrew over approximately 1,000 years (12th-2nd centuries BCE)
- Reflects the history of ancient Israel from patriarchal times through the post-exilic period
- Contains multiple literary genres including narrative, poetry, wisdom literature, and prophecy
- Emphasizes God's covenant relationship with Israel and humanity's response to divine revelation
- Provides historical, cultural, and theological context for understanding the New Testament
- Includes accounts of creation, the patriarchs, the exodus, the wilderness wandering, the conquest of Canaan, the monarchy, exile, and restoration
- Addresses themes of faith, obedience, justice, redemption, and God's faithfulness`,
        scripture: "Genesis 1:1; Exodus 3:14; Deuteronomy 6:4; Psalm 119:105; Isaiah 40:8",
        lessonOrder: 1,
      },
      {
        courseId,
        title: "The Torah: Books of Moses",
        content: `The Torah, also known as the Pentateuch or the Five Books of Moses, comprises Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. These five books form the foundation of Hebrew Scripture and contain Israel's most sacred narratives and laws. The Torah narrates humanity's creation, the patriarchal period, Israel's slavery in Egypt, the miraculous exodus, the wilderness wandering, and the covenant at Mount Sinai. Beyond narrative, the Torah contains extensive legal codes that governed ancient Israelite society, including the Ten Commandments, laws concerning worship, social justice, and ritual purity. Traditional Jewish belief attributes the Torah to Moses, though modern scholarship recognizes multiple authors and editors contributing over centuries. The Torah remains central to Jewish practice and identity, with annual readings in synagogues completing a yearly cycle. For Christians, the Torah provides essential context for understanding God's covenant with Israel and prefigures themes of redemption and grace found in the New Testament.

Key Points:
- The Torah consists of five books: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy
- Contains foundational narratives: creation, patriarchs (Abraham, Isaac, Jacob), exodus from Egypt, wilderness wandering, and covenant at Sinai
- Includes the Ten Commandments and extensive legal codes governing Israelite society
- Emphasizes themes of covenant, obedience, God's faithfulness, and divine guidance
- The Torah is read annually in Jewish synagogues, completing a yearly cycle
- Contains approximately 613 commandments according to Jewish tradition
- Reflects both narrative and legal literature, combining storytelling with legislative material
- Demonstrates God's relationship with Israel from its origins through preparation for entering the Promised Land`,
        scripture: "Genesis 1:1; Genesis 12:1-3; Exodus 3:14; Exodus 20:1-17; Deuteronomy 6:4-9",
        lessonOrder: 2,
      },
      {
        courseId,
        title: "The Historical Books",
        content: `The Historical Books span from Israel's conquest of Canaan through the post-exilic restoration, covering approximately 600 years of history. These twelve books—Joshua, Judges, Ruth, 1 and 2 Samuel, 1 and 2 Kings, 1 and 2 Chronicles, Ezra, Nehemiah, and Esther—narrate Israel's transformation from a tribal confederation into a kingdom, its division, decline, exile, and eventual restoration. The Historical Books present not merely chronological accounts but theological interpretations of events, demonstrating how Israel's faithfulness or unfaithfulness to God's covenant affected their national destiny. Key figures include Joshua (the conquest leader), the judges (tribal leaders during the pre-monarchic period), Samuel (the prophet who anointed Israel's kings), David (the greatest king), Solomon (builder of the temple), and the prophets who called Israel to repentance. The books culminate with the exile to Babylon and the return under Persian rule, emphasizing God's faithfulness despite Israel's failures and the possibility of restoration through repentance.

Key Points:
- The Historical Books cover approximately 600 years of Israelite history
- Include accounts of the conquest of Canaan, the period of judges, the establishment of the monarchy, the united kingdom, the divided kingdom, exile, and restoration
- Present history as theological narrative, interpreting events through the lens of covenant faithfulness
- Feature major figures: Joshua, Samson, David, Solomon, and various prophets
- Demonstrate the consequences of obedience and disobedience to God's covenant
- Include the building of the First Temple by Solomon
- Chronicle the division of the kingdom into Israel (north) and Judah (south)
- Describe the fall of both kingdoms and exile to Assyria and Babylon
- End with the restoration of the Jewish community and rebuilding of the temple`,
        scripture: "Joshua 1:8; 1 Samuel 16:13; 1 Kings 8:22-61; 2 Kings 25:1-21; Ezra 1:1-4",
        lessonOrder: 3,
      },
      {
        courseId,
        title: "Poetry and Wisdom Literature",
        content: `Biblical poetry and wisdom literature represent distinctive literary genres within the Old Testament that address theological, ethical, and practical questions through artistic and philosophical means. The poetic books—Psalms, Job, Proverbs, Ecclesiastes, Song of Songs, and Lamentations—employ parallelism, metaphor, imagery, and rhythm to convey profound spiritual and intellectual truths. The Psalms, a collection of 150 poems, express the full range of human emotion in relationship with God, from praise and thanksgiving to lament and petition. Job explores the profound question of suffering and divine justice through dramatic dialogue and poetic speeches. Proverbs offers practical wisdom for living a righteous and successful life through concise sayings and teachings. Ecclesiastes questions the meaning of life and human achievement, concluding with the importance of fearing God. The Song of Songs celebrates human love and intimacy, interpreted both literally and allegorically. Lamentations expresses grief over Jerusalem's destruction. Wisdom literature often employs the figure of Wisdom personified as a divine attribute, reflecting God's creative and sustaining power in the world.

Key Points:
- Biblical poetry uses parallelism (repetition of ideas in successive lines) as a primary structural device
- The Psalms contain 150 poems expressing praise, thanksgiving, lament, petition, and confession
- Job addresses the problem of suffering and the nature of divine justice through dialogue
- Proverbs offers practical wisdom through short, memorable sayings about righteous living
- Ecclesiastes questions human achievement and meaning, emphasizing the fear of God
- Song of Songs celebrates human love and intimacy
- Lamentations expresses communal grief over Jerusalem's destruction
- Wisdom literature often personifies Wisdom as a divine attribute reflecting God's character
- These books address universal human questions about meaning, suffering, justice, and purpose
- Wisdom literature often employs irony, paradox, and questioning to provoke reflection`,
        scripture: "Psalm 23; Psalm 42; Job 1:1-5; Proverbs 1:1-7; Ecclesiastes 12:13",
        lessonOrder: 4,
      },
      {
        courseId,
        title: "Major Prophets: Isaiah",
        content: `The book of Isaiah is the longest prophetic book and represents the work of one or more prophets spanning centuries. Isaiah of Jerusalem prophesied during the 8th century BCE, addressing the kingdom of Judah during times of political crisis and religious unfaithfulness. The book contains prophecies of judgment against Judah and surrounding nations, promises of restoration and redemption, and profound messianic passages that Christians interpret as pointing to Jesus Christ. Isaiah's message emphasizes God's holiness, justice, and redemptive purpose. The prophet calls Israel to repentance and righteousness, warning of judgment for unfaithfulness while offering hope of restoration. Isaiah employs vivid imagery, poetic language, and symbolic actions to communicate his prophetic message. Key themes include God's sovereignty, the coming judgment, the promise of a remnant, restoration after exile, and the coming Messiah. The famous "Servant Songs" (Isaiah 42, 49, 50, 52-53) describe a suffering servant whose sacrifice brings redemption, interpreted by Christians as prophecies of Christ's passion and atonement.

Key Points:
- Isaiah prophesied during the 8th century BCE in the kingdom of Judah
- The book likely contains prophecies from multiple prophets across several centuries
- Major themes include God's holiness, judgment for unfaithfulness, and promise of restoration
- Contains the famous "Servant Songs" describing a suffering servant bringing redemption
- Emphasizes the importance of social justice and righteous living
- Predicts the coming of a Messiah who will establish God's kingdom
- Describes God's plan for the restoration of Israel after exile
- Uses vivid imagery and poetic language to communicate prophetic messages
- Addresses both judgment and hope, warning and promise
- Emphasizes the remnant—a faithful minority through whom God will accomplish His purposes`,
        scripture: "Isaiah 1:18; Isaiah 6:1-8; Isaiah 40:28-31; Isaiah 53:1-12; Isaiah 61:1-3",
        lessonOrder: 5,
      },
      {
        courseId,
        title: "Major Prophets: Jeremiah and Lamentations",
        content: `Jeremiah prophesied during the final decades of the kingdom of Judah, from approximately 627 to 586 BCE, witnessing the nation's decline, the Babylonian siege of Jerusalem, and the exile of the people. Called by God as a young man, Jeremiah received the difficult task of proclaiming judgment and calling Judah to repentance, knowing his message would be rejected. Jeremiah's prophecies emphasize God's judgment against Judah's unfaithfulness, idolatry, and social injustice, while also offering hope of restoration through a new covenant. The book of Jeremiah is characterized by personal laments in which the prophet expresses his anguish over his calling and the nation's suffering. Jeremiah experiences opposition, imprisonment, and ridicule yet remains faithful to his prophetic mission. The book of Lamentations, traditionally attributed to Jeremiah, consists of five poems expressing grief over Jerusalem's destruction and exile, moving from lamentation through questioning to hope in God's faithfulness. Together, Jeremiah and Lamentations present a profound meditation on suffering, judgment, and the possibility of restoration through God's grace.

Key Points:
- Jeremiah prophesied during the final decades of Judah's independence (627-586 BCE)
- His primary message emphasized judgment against Judah's unfaithfulness and idolatry
- Called as a young man, Jeremiah faced opposition and rejection throughout his ministry
- Experienced personal anguish expressed in his "confessions" or personal laments
- Proclaimed the coming Babylonian exile as God's judgment
- Offered hope of restoration and a new covenant with God
- Emphasized the importance of repentance and returning to God
- Lamentations expresses communal grief over Jerusalem's destruction
- Both books address the profound questions of suffering, judgment, and divine faithfulness
- Jeremiah's prophecies include specific predictions about the exile and restoration`,
        scripture: "Jeremiah 1:4-10; Jeremiah 29:11; Jeremiah 31:31-34; Lamentations 1:1; Lamentations 3:22-23",
        lessonOrder: 6,
      },
      {
        courseId,
        title: "Major Prophets: Ezekiel and Daniel",
        content: `Ezekiel and Daniel prophesied during the Babylonian exile, offering different but complementary perspectives on God's purposes during this crisis. Ezekiel, a priest in exile, received dramatic visions emphasizing God's holiness, judgment, and restoration. His prophecies include the vision of God's throne-chariot (the merkabah), the valley of dry bones symbolizing Israel's restoration, and the vision of the restored temple. Ezekiel emphasizes individual responsibility and God's concern for His people even in exile. Daniel, taken into Babylonian captivity as a young man, served in the royal court and received visions concerning future kingdoms and God's ultimate triumph. Daniel's prophecies are apocalyptic in nature, using symbolic imagery to describe future events and God's final victory. Both prophets address the exiled community's questions about God's faithfulness during their suffering and separation from their homeland. Ezekiel's visions are highly visual and symbolic, while Daniel's prophecies employ numerical symbolism and animal imagery. Together, they provide hope that God has not abandoned His people and will ultimately restore them and establish His kingdom.

Key Points:
- Ezekiel prophesied as a priest in exile during the Babylonian captivity
- Received dramatic visions emphasizing God's holiness and restoration
- The merkabah vision (God's throne-chariot) reveals God's transcendence and mobility
- The valley of dry bones vision symbolizes Israel's restoration and resurrection
- Emphasizes individual responsibility and God's concern for His people
- Daniel was taken captive as a young man and served in the Babylonian court
- Received apocalyptic visions concerning future kingdoms and God's ultimate triumph
- Uses symbolic imagery including beasts, numbers, and celestial beings
- Emphasizes God's sovereignty over earthly kingdoms
- Both prophets offer hope of restoration and God's ultimate victory
- Addresses the exiled community's questions about God's faithfulness`,
        scripture: "Ezekiel 1:1-28; Ezekiel 37:1-14; Ezekiel 47:1-12; Daniel 2:31-45; Daniel 7:1-28",
        lessonOrder: 7,
      },
      {
        courseId,
        title: "Minor Prophets - Part 1",
        content: `The twelve minor prophets (so called because of their shorter length, not lesser importance) prophesied during various periods of Israel and Judah's history, from the 9th to the 5th centuries BCE. These prophets include Hosea, Joel, Amos, Obadiah, Jonah, and Micah (Part 1) and Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, and Malachi (Part 2). Each prophet addressed specific historical circumstances and communities with messages of judgment, repentance, and restoration. Hosea prophesied to the northern kingdom of Israel, using the metaphor of his marriage to an unfaithful wife to illustrate Israel's unfaithfulness to God. Amos, a shepherd called to prophesy, emphasized social justice and God's concern for the poor and oppressed. Jonah's narrative presents a reluctant prophet called to preach repentance to Nineveh. Micah addressed both kingdoms, emphasizing God's justice and the importance of justice, mercy, and humility before God. Joel prophesied about the "day of the Lord" and God's outpouring of His Spirit. Obadiah pronounced judgment against Edom. Together, the minor prophets present diverse perspectives on God's relationship with His people and His purposes in history.

Key Points:
- The twelve minor prophets prophesied during various periods (9th-5th centuries BCE)
- Called "minor" because of their shorter length, not lesser importance
- Hosea emphasizes God's faithful love despite Israel's unfaithfulness
- Amos emphasizes social justice and God's concern for the poor and oppressed
- Joel prophesies about the "day of the Lord" and God's Spirit
- Obadiah pronounces judgment against Edom
- Jonah presents a narrative of a reluctant prophet called to Nineveh
- Micah emphasizes God's justice and the importance of justice, mercy, and humility
- Each prophet addressed specific historical circumstances and communities
- Together they present diverse perspectives on God's purposes in history
- Themes include judgment, repentance, restoration, God's justice, and God's faithfulness`,
        scripture: "Hosea 1:1-3; Amos 5:24; Joel 2:28-29; Jonah 1:1-3; Micah 6:8",
        lessonOrder: 8,
      },
      {
        courseId,
        title: "Minor Prophets - Part 2",
        content: `The second group of minor prophets—Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, and Malachi—prophesied during and after the Babylonian exile, addressing different historical circumstances than their predecessors. Nahum prophesied the fall of Nineveh, Assyria's capital, announcing God's judgment against Assyria's cruelty. Habakkuk wrestled with the problem of God's justice, questioning why God allows evil to flourish, ultimately affirming faith in God's justice. Zephaniah prophesied about the "day of the Lord" as a day of judgment and restoration. Haggai and Zechariah prophesied to the returned exiles, encouraging them to rebuild the temple and assuring them of God's presence and future restoration. Malachi, the final book of the Old Testament, addressed the post-exilic community's spiritual apathy, calling them to renewed commitment to God and promising the coming messenger (John the Baptist) and the day of judgment. Together, these prophets address the exiled and post-exilic communities' spiritual struggles and God's continuing purposes for His people.

Key Points:
- These prophets prophesied during and after the Babylonian exile
- Nahum announces God's judgment against Assyria's cruelty
- Habakkuk wrestles with the problem of God's justice and evil
- Zephaniah prophesies about the "day of the Lord" as judgment and restoration
- Haggai encourages the returned exiles to rebuild the temple
- Zechariah assures the community of God's presence and future restoration
- Malachi addresses spiritual apathy and calls for renewed commitment
- These prophets address the exiled and post-exilic communities' spiritual struggles
- Themes include God's judgment, restoration, faithfulness, and future hope
- Malachi promises the coming messenger and the day of judgment
- Together they show God's continuing purposes for His people through judgment and restoration`,
        scripture: "Nahum 1:1-8; Habakkuk 2:4; Zephaniah 1:14-16; Haggai 1:1-11; Zechariah 1:1-6; Malachi 3:1",
        lessonOrder: 9,
      },
      {
        courseId,
        title: "Old Testament Themes and Fulfillment",
        content: `The Old Testament, despite its diversity of genres, historical periods, and authors, presents a coherent theological narrative centered on God's relationship with humanity and His redemptive purposes. Major themes include creation and humanity's purpose, sin and its consequences, God's covenant with Abraham and Israel, God's law and the importance of obedience, God's judgment against unfaithfulness, God's mercy and restoration, and the promise of a coming Messiah. These themes develop progressively throughout the Old Testament, with each section building on and deepening previous revelation. The theme of covenant—God's binding commitment to His people—provides the framework for understanding God's relationship with Israel. The theme of redemption—God's gracious act of saving His people—runs throughout the Old Testament, from the exodus to the restoration after exile. The messianic theme—the promise of a coming deliverer—develops gradually, becoming increasingly specific in the prophetic books. Christians understand the Old Testament as pointing toward and prefiguring the New Testament, with Jesus Christ as the fulfillment of Old Testament promises and themes. The Old Testament provides essential context for understanding Christ's person, work, and significance.

Key Points:
- Major Old Testament themes include creation, sin, covenant, law, judgment, mercy, restoration, and messianic promise
- The theme of covenant provides the framework for God's relationship with His people
- The theme of redemption emphasizes God's gracious salvation of His people
- The messianic theme develops progressively, becoming increasingly specific
- Old Testament themes prefigure and point toward New Testament fulfillment
- Jesus Christ is understood as the fulfillment of Old Testament promises
- The Old Testament provides essential context for understanding Christ's significance
- Themes develop progressively throughout the Old Testament
- God's character—holiness, justice, mercy, faithfulness—is revealed through these themes
- The Old Testament and New Testament form a unified narrative of God's redemptive purposes
- Understanding Old Testament themes enriches Christian faith and biblical interpretation`,
        scripture: "Genesis 3:15; Exodus 12:1-14; Isaiah 53:1-12; Jeremiah 31:31-34; Malachi 3:1",
        lessonOrder: 10,
      },
    ];

    console.log("\n📝 Inserting lessons...");
    const lessonIds = [];

    for (const lesson of bib101Lessons) {
      try {
        const result = await db.insert(lessons).values(lesson);
        const lessonId = result[0].insertId;
        lessonIds.push(lessonId);
        console.log(`  ✅ Inserted lesson: "${lesson.title}" (ID: ${lessonId})`);
      } catch (error) {
        console.error(`  ❌ Failed to insert lesson "${lesson.title}":`, error.message);
      }
    }

    // Quiz Questions for each lesson - sample data
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

    console.log("\n✅ BIB101 content insertion complete!");
    console.log(`   - ${lessonIds.length} lessons inserted`);
    console.log(`   - ${totalQuestions} quiz questions inserted`);

    if (pool) await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting BIB101 content:", error);
    if (pool) await pool.end();
    process.exit(1);
  }
}

insertBIB101Content();
