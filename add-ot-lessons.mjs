import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { courses, lessons } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Get Old Testament Survey course
const [otCourse] = await db.select().from(courses).where(eq(courses.title, 'Old Testament Survey'));

if (!otCourse) {
  console.error('Old Testament Survey course not found!');
  process.exit(1);
}

const otLessons = [
  {
    title: "Introduction to the Old Testament",
    content: `# Introduction to the Old Testament

## Overview
This foundational lesson introduces students to the Old Testament as the first major division of the Christian Bible, exploring its structure, historical context, and theological significance.

## Key Topics

### The Canon of the Old Testament
- **Hebrew Bible (Tanakh)**: Torah (Law), Nevi'im (Prophets), Ketuvim (Writings)
- **Christian Old Testament**: 39 books organized as Law, History, Poetry/Wisdom, Major Prophets, Minor Prophets
- **Formation of the Canon**: Historical process of recognition and preservation

### Historical and Cultural Context
- **Ancient Near Eastern World**: Geography, cultures, and civilizations
- **Timeline**: From creation narratives through the post-exilic period (c. 2000 BCE - 400 BCE)
- **Archaeological Discoveries**: How archaeology illuminates biblical texts

### Literary Genres
- **Narrative**: Historical accounts and stories
- **Law**: Covenant stipulations and legal codes
- **Poetry**: Psalms, wisdom literature, prophetic oracles
- **Prophecy**: Forth-telling and foretelling

### Theological Themes
- **Covenant**: God's binding relationship with His people
- **Monotheism**: The revelation of one true God
- **Redemption**: God's plan to restore fallen humanity
- **Messianic Hope**: Anticipation of the coming Deliverer

## Learning Objectives
By the end of this lesson, students will be able to:
1. Explain the structure and organization of the Old Testament
2. Identify major historical periods and cultural contexts
3. Recognize primary literary genres and their characteristics
4. Articulate core theological themes that run throughout the Old Testament

## Reading Assignment
- Genesis 1-3 (Creation and Fall)
- Exodus 19-20 (Sinai Covenant and Ten Commandments)
- Psalm 1 (Introduction to Hebrew Poetry)
- Isaiah 53 (Messianic Prophecy)`,
    assignment: "Write a 500-word essay explaining how understanding the historical and cultural context of the Old Testament enhances our interpretation of its message. Include specific examples from at least two different Old Testament books."
  },
  {
    title: "The Pentateuch: Genesis",
    content: `# The Pentateuch: Genesis

## Overview
Genesis, the book of beginnings, establishes the foundation for all biblical theology by revealing God as Creator, humanity's origin and purpose, the entrance of sin, and God's covenant promises to the patriarchs.

## Key Topics

### Primeval History (Genesis 1-11)
- **Creation (1-2)**: God creates the universe and humanity in His image
- **The Fall (3)**: Sin enters the world through human disobedience
- **Cain and Abel (4)**: The first murder and its consequences
- **The Flood (6-9)**: God's judgment and covenant with Noah
- **Tower of Babel (11)**: Human pride and the dispersion of nations

### Patriarchal Narratives (Genesis 12-50)
- **Abraham (12-25)**: The call, covenant, and promise of blessing
- **Isaac (21-27)**: The promised son and continuation of the covenant
- **Jacob (25-36)**: The supplanter transformed into Israel
- **Joseph (37-50)**: Providence, forgiveness, and preservation

### Major Theological Themes
- **Divine Sovereignty**: God's supreme authority over creation and history
- **Image of God**: Humanity's unique status and calling
- **Sin and Its Consequences**: The broken relationship between God and humanity
- **Covenant Promises**: Land, descendants, and blessing to all nations
- **Providence**: God's faithful guidance despite human failure

### Literary Features
- **Toledot Structure**: "These are the generations of..." (10 occurrences)
- **Narrative Artistry**: Character development, irony, and plot structure
- **Typology**: Patterns that anticipate future fulfillment

## Learning Objectives
By the end of this lesson, students will be able to:
1. Outline the major sections and narratives of Genesis
2. Explain the Abrahamic covenant and its significance
3. Trace the theme of God's faithfulness through the patriarchal stories
4. Apply Genesis's teachings on creation, fall, and redemption to contemporary life

## Reading Assignment
- Genesis 1-3, 12, 15, 22, 37, 45, 50`,
    assignment: "Compare and contrast the Abrahamic covenant (Genesis 12, 15, 17) with the Noahic covenant (Genesis 9). What are the key promises in each? How do they relate to God's redemptive plan? (750 words)"
  },
  {
    title: "The Pentateuch: Exodus, Leviticus, Numbers",
    content: `# The Pentateuch: Exodus, Leviticus, Numbers

## Overview
These three books chronicle Israel's deliverance from Egypt, the giving of the Law at Sinai, and the wilderness wanderings—establishing Israel as God's covenant people with a distinct identity, worship system, and moral code.

## Exodus: Redemption and Covenant

### The Exodus Event (1-18)
- **Oppression in Egypt**: Israel's slavery and God's compassion
- **Moses' Call**: The burning bush and divine commission
- **Ten Plagues**: God's power over Egyptian gods
- **Passover**: Redemption through substitutionary sacrifice
- **Red Sea Crossing**: Definitive deliverance and new beginning

### Sinai Covenant (19-24)
- **Theophany**: God's awesome presence on the mountain
- **Ten Commandments**: Moral foundation of covenant relationship
- **Book of the Covenant**: Case laws and social regulations
- **Covenant Ratification**: Blood ceremony sealing the agreement

### Tabernacle (25-40)
- **Divine Blueprint**: Detailed instructions for worship
- **Priestly Mediation**: Aaron and his sons set apart
- **God's Presence**: Glory filling the tabernacle

## Leviticus: Holiness and Worship

### Sacrificial System (1-7)
- **Burnt Offering**: Complete consecration to God
- **Grain Offering**: Thanksgiving and dedication
- **Peace Offering**: Fellowship with God
- **Sin and Guilt Offerings**: Atonement for transgressions

### Priesthood and Purity (8-16)
- **Priestly Consecration**: Setting apart for service
- **Clean and Unclean**: Ritual purity laws
- **Day of Atonement**: Annual cleansing of sanctuary and people

### Holiness Code (17-27)
- **Ethical Holiness**: "Be holy, for I am holy" (19:2)
- **Festivals**: Sacred calendar marking God's mighty acts
- **Blessings and Curses**: Covenant sanctions

## Numbers: Wilderness Wanderings

### Organization and Preparation (1-10)
- **Census**: Numbering the tribes for military and worship
- **Camp Arrangement**: Ordered community around the tabernacle
- **Levitical Duties**: Roles in transporting and maintaining worship

### Rebellion and Judgment (11-25)
- **Complaints**: Murmuring against God's provision
- **Spies Report**: Unbelief and its consequences
- **Forty Years**: Judgment generation dies in wilderness
- **Balaam**: Attempted curse becomes blessing

### New Generation (26-36)
- **Second Census**: Preparing to enter the Promised Land
- **Joshua's Commission**: Leadership transition
- **Transjordan Conquest**: First victories

## Learning Objectives
By the end of this lesson, students will be able to:
1. Explain the significance of the Exodus as a paradigm of redemption
2. Describe the purpose and function of the sacrificial system
3. Understand the concept of holiness in Leviticus
4. Trace Israel's failures and God's faithfulness in Numbers

## Reading Assignment
- Exodus 3, 12, 19-20, 25-26, 40
- Leviticus 16, 19, 23
- Numbers 13-14, 20-21`,
    assignment: "The sacrificial system in Leviticus points forward to Christ's atoning work. Choose two types of offerings and explain how they typologically foreshadow Jesus' sacrifice. Include New Testament references. (800 words)"
  },
  {
    title: "The Pentateuch: Deuteronomy",
    content: `# The Pentateuch: Deuteronomy

## Overview
Deuteronomy, meaning "second law," presents Moses' farewell addresses to the new generation of Israelites poised to enter the Promised Land. It reiterates and expands the covenant, emphasizing love, obedience, and the consequences of faithfulness or rebellion.

## Key Topics

### Structure and Literary Form
- **Covenant Treaty Format**: Parallels ancient Near Eastern suzerainty treaties
- **Preamble (1:1-5)**: Historical setting
- **Historical Prologue (1:6-4:49)**: God's past faithfulness
- **Stipulations (5-26)**: Covenant obligations
- **Blessings and Curses (27-28)**: Covenant sanctions
- **Witnesses and Succession (29-34)**: Covenant continuity

### The Shema and the Greatest Commandment
- **Deuteronomy 6:4-9**: "Hear, O Israel: The LORD our God, the LORD is one"
- **Wholehearted Devotion**: Love God with all your heart, soul, and strength
- **Catechesis**: Teaching children God's commands
- **Jesus' Affirmation**: Cited as the greatest commandment (Mark 12:29-30)

### Major Themes

#### Monotheism and Exclusive Worship
- **One God**: Yahweh alone is God; no other gods exist
- **Central Sanctuary**: Worship at the place God chooses (Jerusalem)
- **Idolatry Prohibited**: Severe warnings against false worship

#### Covenant Love and Obedience
- **Hesed**: God's steadfast, loyal love
- **Response**: Israel's love demonstrated through obedience
- **Motivation**: Not fear, but gratitude for redemption

#### Blessing and Curse
- **Conditional Covenant**: Obedience brings blessing; disobedience brings curse
- **Deuteronomy 28**: Detailed consequences of covenant faithfulness or violation
- **Prophetic Warning**: Anticipates exile and restoration

#### Social Justice
- **Care for the Vulnerable**: Widows, orphans, foreigners, Levites
- **Economic Ethics**: Honest weights, debt forgiveness, gleaning rights
- **Judicial Integrity**: Impartial justice, reliable witnesses

### Moses' Farewell and Death
- **Song of Moses (32)**: Poetic testimony of God's faithfulness and Israel's rebellion
- **Blessing of the Tribes (33)**: Final words over each tribe
- **Death on Mount Nebo (34)**: Moses views the Promised Land but does not enter
- **Joshua's Leadership**: Succession to the next generation

## Theological Significance

### Foundation for Biblical Theology
- **Most Quoted OT Book in NT**: Over 80 citations
- **Jesus' Temptation**: All three responses from Deuteronomy (Matt 4:1-11)
- **Paul's Theology**: Justification by faith, not works of law

### Covenant Renewal
- **Generational Transition**: Each generation must personally embrace the covenant
- **Corporate and Individual**: Both communal identity and personal responsibility

## Learning Objectives
By the end of this lesson, students will be able to:
1. Explain the covenant treaty structure of Deuteronomy
2. Articulate the Shema and its significance for monotheistic faith
3. Understand the relationship between love, obedience, and blessing
4. Apply Deuteronomy's social justice principles to contemporary contexts

## Reading Assignment
- Deuteronomy 4-6, 8, 28, 30, 34`,
    assignment: "Deuteronomy emphasizes both God's grace (election, redemption) and human responsibility (obedience). How does the book hold these two themes in tension? Is there a contradiction, or do they complement each other? Support your answer with specific texts. (700 words)"
  },
  {
    title: "Historical Books: Conquest and Judges",
    content: `# Historical Books: Conquest and Judges

## Overview
The books of Joshua and Judges chronicle Israel's entry into the Promised Land, the conquest of Canaan, and the turbulent period before the monarchy—a cycle of faithfulness, apostasy, oppression, and deliverance.

## Joshua: Conquest and Settlement

### Entering the Promised Land (1-5)
- **Joshua's Commission**: "Be strong and courageous" (1:1-9)
- **Rahab's Faith**: Gentile inclusion in God's people (2)
- **Crossing the Jordan**: Miraculous entry mirroring the Red Sea (3-4)
- **Covenant Renewal**: Circumcision and Passover at Gilgal (5)

### Conquest Campaigns (6-12)
- **Jericho**: Walls fall by faith and obedience (6)
- **Achan's Sin**: Corporate responsibility and consequences (7)
- **Ai and Gibeon**: Victory and deception (8-9)
- **Southern and Northern Campaigns**: Subduing the land (10-12)

### Land Distribution (13-21)
- **Tribal Allotments**: Fulfillment of patriarchal promises
- **Cities of Refuge**: Justice and mercy
- **Levitical Cities**: Worship centers throughout the land

### Covenant Renewal and Joshua's Farewell (22-24)
- **Altar of Witness**: Unity among tribes (22)
- **Joshua's Charge**: "Choose this day whom you will serve" (24:15)
- **Covenant at Shechem**: Reaffirmation of loyalty to Yahweh

## Judges: The Cycle of Apostasy

### The Judges Cycle
1. **Israel does evil** in the sight of the LORD
2. **God gives them into the hand** of oppressors
3. **Israel cries out** to the LORD
4. **God raises up a judge** (deliverer)
5. **The land has rest** during the judge's lifetime
6. **The judge dies**, and the cycle repeats

### Major Judges
- **Othniel**: First judge, sets the pattern (3:7-11)
- **Ehud**: Left-handed deliverer from Moab (3:12-30)
- **Deborah and Barak**: Prophetess leads victory over Canaanites (4-5)
- **Gideon**: From fearful to faithful, defeats Midianites (6-8)
- **Jephthah**: Tragic vow and victory over Ammonites (10:6-12:7)
- **Samson**: Flawed strongman against Philistines (13-16)

### Theological Themes
- **Covenant Unfaithfulness**: "Everyone did what was right in his own eyes" (17:6; 21:25)
- **God's Patience**: Repeated deliverance despite repeated rebellion
- **Need for Kingship**: Anticipates the monarchy (though with ambivalence)
- **Incomplete Conquest**: Failure to drive out Canaanites leads to idolatry

### Downward Spiral
- **Moral Decline**: Each judge more flawed than the last
- **Social Chaos**: Micah's idolatry (17-18), Levite's concubine (19), civil war (20-21)
- **Cry for Leadership**: "In those days there was no king in Israel"

## Learning Objectives
By the end of this lesson, students will be able to:
1. Trace the conquest narrative and its theological significance
2. Explain the judges cycle and its recurring pattern
3. Identify major judges and their contributions
4. Understand the book's critique of Israel's unfaithfulness

## Reading Assignment
- Joshua 1, 6, 24
- Judges 2-3, 6-7, 13-16`,
    assignment: "The conquest of Canaan raises ethical questions about divine command to destroy the Canaanites. Research and present two different Christian perspectives on this issue. Which do you find more persuasive, and why? (900 words)"
  },
  {
    title: "Historical Books: United and Divided Kingdoms",
    content: `# Historical Books: United and Divided Kingdoms

## Overview
The books of 1-2 Samuel and 1-2 Kings narrate Israel's transition from theocracy to monarchy, the golden age under David and Solomon, and the tragic division and eventual exile of both kingdoms.

## 1-2 Samuel: Rise of the Monarchy

### Samuel: Prophet and Judge (1 Sam 1-7)
- **Hannah's Prayer**: Barrenness to blessing (1-2)
- **Eli's Failure**: Priestly corruption and judgment (2-4)
- **Ark Narrative**: Philistine capture and return (4-6)
- **Samuel's Leadership**: Last judge, first prophet of monarchy era (7)

### Saul: Israel's First King (1 Sam 8-15)
- **Demand for a King**: Rejection of theocracy (8)
- **Saul's Anointing**: Chosen for external qualities (9-10)
- **Early Victories**: Ammonite deliverance (11)
- **Disobedience**: Unlawful sacrifice (13), incomplete obedience (15)
- **Rejection**: "To obey is better than sacrifice" (15:22)

### David: The Man After God's Own Heart (1 Sam 16 - 2 Sam 24)
- **Anointing**: Chosen for internal character (1 Sam 16)
- **Goliath**: Faith triumphs over human strength (1 Sam 17)
- **Friendship with Jonathan**: Covenant loyalty (1 Sam 18-20)
- **Fugitive Years**: Saul's jealous pursuit (1 Sam 21-31)
- **King of Judah, then Israel**: Unification (2 Sam 1-5)
- **Davidic Covenant**: Eternal dynasty promise (2 Sam 7)
- **Bathsheba and Nathan**: Sin, confrontation, repentance (2 Sam 11-12)
- **Absalom's Rebellion**: Family consequences of sin (2 Sam 13-18)

## 1-2 Kings: Glory and Decline

### Solomon's Reign (1 Kings 1-11)
- **Succession**: David's charge and Solomon's anointing (1 Kings 1-2)
- **Wisdom**: Famous judgment and international reputation (1 Kings 3-4)
- **Temple Building**: Fulfillment of David's dream (1 Kings 5-8)
- **Queen of Sheba**: Wealth and wisdom displayed (1 Kings 10)
- **Apostasy**: Foreign wives lead to idolatry (1 Kings 11)

### Divided Kingdom (1 Kings 12 - 2 Kings 17)
- **Rehoboam's Folly**: Ten tribes secede under Jeroboam (1 Kings 12)
- **Israel (North)**: Persistent idolatry, no good kings, 19 kings, 9 dynasties
- **Judah (South)**: Mixed record, Davidic dynasty continues, 20 kings
- **Elijah**: Prophet confronts Baal worship (1 Kings 17-19, 21; 2 Kings 1-2)
- **Elisha**: Double portion, miracles, prophetic ministry (2 Kings 2-13)
- **Fall of Israel**: Assyrian conquest, 722 BC (2 Kings 17)

### Judah Alone (2 Kings 18-25)
- **Hezekiah**: Reform and deliverance from Assyria (2 Kings 18-20)
- **Manasseh**: Worst king, leads Judah into deep apostasy (2 Kings 21)
- **Josiah**: Discovery of the Law, great reform (2 Kings 22-23)
- **Fall of Judah**: Babylonian conquest, 586 BC (2 Kings 24-25)

## Theological Themes
- **Davidic Covenant**: Promise of eternal dynasty finds ultimate fulfillment in Christ
- **Deuteronomic Theology**: Obedience brings blessing; disobedience brings curse
- **Prophetic Word**: God's word through prophets always comes to pass
- **Temple Theology**: God's presence among His people
- **Exile as Judgment**: Covenant curses realized

## Learning Objectives
By the end of this lesson, students will be able to:
1. Trace the rise and fall of Israel's monarchy
2. Compare and contrast Saul, David, and Solomon
3. Explain the causes of the kingdom's division
4. Understand the role of prophets during the monarchy

## Reading Assignment
- 1 Samuel 8, 16-17; 2 Samuel 7, 11-12
- 1 Kings 3, 8, 11-12, 17-18
- 2 Kings 17, 22-23, 25`,
    assignment: "The Davidic Covenant (2 Samuel 7) is foundational to messianic hope. Explain the key promises of this covenant and trace how they are fulfilled in Jesus Christ according to the New Testament. (850 words)"
  },
  {
    title: "Wisdom Literature: Psalms and Proverbs",
    content: `# Wisdom Literature: Psalms and Proverbs

## Overview
The Wisdom Literature of the Old Testament—Job, Psalms, Proverbs, Ecclesiastes, and Song of Solomon—addresses the practical and philosophical dimensions of faith, exploring how to live wisely before God in a complex world.

## Psalms: Israel's Hymnal and Prayer Book

### Structure and Organization
- **Five Books**: Mirroring the Pentateuch (Pss 1-41, 42-72, 73-89, 90-106, 107-150)
- **Doxologies**: Each book ends with praise (41:13, 72:18-19, 89:52, 106:48, 150)
- **Davidic Authorship**: 73 psalms attributed to David
- **Temple Worship**: Used in corporate and private devotion

### Types of Psalms
- **Lament**: Crying out to God in distress (Pss 3, 13, 22, 44)
- **Thanksgiving**: Praising God for deliverance (Pss 30, 116, 138)
- **Hymns of Praise**: Celebrating God's character and works (Pss 8, 19, 103, 145-150)
- **Royal Psalms**: Concerning the king, messianic implications (Pss 2, 45, 72, 110)
- **Wisdom Psalms**: Instruction in righteous living (Pss 1, 37, 119)
- **Imprecatory Psalms**: Calling for judgment on enemies (Pss 35, 69, 109, 137)

### Hebrew Poetry
- **Parallelism**: Synonymous, antithetic, synthetic
- **Imagery**: Metaphor, simile, personification
- **Acrostic**: Alphabetic structure (Pss 9-10, 25, 34, 37, 111-112, 119, 145)

### Theological Themes
- **God's Sovereignty**: Creator, King, Judge
- **Human Experience**: Full range of emotions expressed honestly
- **Covenant Faithfulness**: God's hesed (steadfast love)
- **Messianic Hope**: Suffering and exalted king (Pss 2, 22, 110)
- **Torah Meditation**: Delight in God's word (Ps 1, 19, 119)

### Psalms in the New Testament
- **Most Quoted OT Book**: Over 100 citations and allusions
- **Jesus' Use**: In teaching, prayer, and on the cross
- **Early Church Worship**: Foundational to Christian liturgy

## Proverbs: Practical Wisdom for Daily Life

### Structure
- **Prologue (1-9)**: Wisdom's call and value
- **Proverbs of Solomon (10:1-22:16)**: Short, pithy sayings
- **Sayings of the Wise (22:17-24:34)**: Longer instructions
- **More Proverbs of Solomon (25-29)**: Collected by Hezekiah's men
- **Sayings of Agur and Lemuel (30-31)**: Including the virtuous woman

### Key Themes
- **Fear of the LORD**: "The fear of the LORD is the beginning of wisdom" (1:7, 9:10)
- **Wisdom vs. Folly**: Two paths, two destinies
- **Character Formation**: Virtues to cultivate, vices to avoid
- **Speech**: Power of words, wise and foolish talk
- **Work Ethic**: Diligence vs. laziness
- **Relationships**: Family, friendship, marriage
- **Justice**: Righteousness in society

### Literary Features
- **Antithetic Parallelism**: Contrasting wise and foolish behavior
- **Numerical Sayings**: "Three things... four..." (30:15-31)
- **Personification**: Wisdom and Folly as women calling out (1, 8-9)

### Wisdom Christology
- **Wisdom Incarnate**: Jesus as the wisdom of God (1 Cor 1:24, 30)
- **Proverbs 8**: Wisdom's role in creation applied to Christ (John 1:1-3; Col 1:15-17)

## Learning Objectives
By the end of this lesson, students will be able to:
1. Identify major types of psalms and their characteristics
2. Explain the structure and use of Hebrew parallelism
3. Articulate the central message of Proverbs
4. Apply wisdom principles to contemporary ethical decisions

## Reading Assignment
- Psalms 1, 8, 19, 22, 23, 51, 103, 119 (selections), 150
- Proverbs 1-4, 8-9, 31`,
    assignment: "Choose one lament psalm (e.g., Ps 13, 22, 42) and analyze its structure, emotional progression, and theological resolution. How does the psalmist move from distress to trust? What does this teach us about honest prayer? (700 words)"
  },
  {
    title: "Major Prophets: Isaiah and Jeremiah",
    content: `# Major Prophets: Isaiah and Jeremiah

## Overview
The Major Prophets (Isaiah, Jeremiah, Ezekiel, Daniel) are called "major" due to their length, not superior importance. Isaiah and Jeremiah ministered during critical periods of Judah's history, proclaiming judgment and hope.

## Isaiah: The Evangelical Prophet

### Historical Context
- **Ministry**: c. 740-680 BC, during reigns of Uzziah, Jotham, Ahaz, Hezekiah
- **Assyrian Crisis**: Northern kingdom falls (722 BC), Judah threatened
- **Hezekiah's Reform**: Spiritual renewal and miraculous deliverance (701 BC)

### Structure
- **Chapters 1-39**: Judgment and Assyrian crisis
- **Chapters 40-55**: Comfort and Babylonian exile
- **Chapters 56-66**: Restoration and new creation

### Key Themes

#### The Holy One of Israel
- **Isaiah's Call**: Vision of God's holiness (6:1-8)
- **Transcendence**: God's majesty and glory
- **Immanence**: "Immanuel" - God with us (7:14)

#### Judgment and Salvation
- **Oracles Against Nations**: Universal sovereignty (13-23)
- **Remnant Theology**: Faithful few preserved (1:9, 10:20-22)
- **Day of the LORD**: Both judgment and deliverance

#### Messianic Prophecies
- **Immanuel**: Virgin birth (7:14, cf. Matt 1:23)
- **Child Born**: Wonderful Counselor, Mighty God, Prince of Peace (9:6-7)
- **Branch of Jesse**: Righteous king from David's line (11:1-10)
- **Suffering Servant**: Vicarious atonement (52:13-53:12)

#### New Creation
- **New Heavens and New Earth**: Cosmic renewal (65:17-25, 66:22)
- **Universal Worship**: All nations stream to Zion (2:2-4, 66:18-23)
- **Peaceable Kingdom**: Wolf and lamb, lion and ox (11:6-9)

### Isaiah in the New Testament
- **Most Quoted Prophet**: Over 60 citations
- **Jesus' Inaugural Sermon**: Isaiah 61 (Luke 4:16-21)
- **Suffering Servant**: Applied to Jesus' passion (Acts 8:32-35)

## Jeremiah: The Weeping Prophet

### Historical Context
- **Ministry**: c. 627-580 BC, from Josiah through the fall of Jerusalem
- **Babylonian Crisis**: Rising power, multiple deportations (605, 597, 586 BC)
- **Fall of Jerusalem**: Destruction of temple and city (586 BC)

### Structure
- **Chapters 1-25**: Oracles of judgment against Judah
- **Chapters 26-45**: Biographical narratives and Jeremiah's sufferings
- **Chapters 46-51**: Oracles against foreign nations
- **Chapter 52**: Historical appendix on Jerusalem's fall

### Key Themes

#### Call and Commission
- **Jeremiah 1**: Appointed before birth, prophet to nations
- **Reluctance**: "I am only a youth" (1:6)
- **Divine Assurance**: "Do not be afraid... I am with you" (1:8)

#### Covenant Lawsuit
- **Indictment**: Judah's persistent idolatry and injustice
- **Broken Covenant**: Violation of Sinai stipulations
- **Inevitable Judgment**: Babylonian conquest as divine discipline

#### Personal Suffering
- **Confessions**: Jeremiah's laments and complaints (11:18-12:6, 15:10-21, 17:14-18, 18:18-23, 20:7-18)
- **Persecution**: Beaten, imprisoned, thrown into cistern
- **Loneliness**: Forbidden to marry, ostracized by community

#### New Covenant
- **Jeremiah 31:31-34**: Foundational text for Christian theology
- **Internalized Law**: Written on hearts, not stone tablets
- **Direct Knowledge**: Personal relationship with God
- **Complete Forgiveness**: "I will remember their sin no more"
- **New Testament Fulfillment**: Hebrews 8:8-12, Last Supper (Luke 22:20)

#### Hope Beyond Judgment
- **Restoration Promised**: Return from exile (29:10-14, 30-33)
- **Davidic King**: Righteous Branch (23:5-6, 33:14-16)
- **Everlasting Covenant**: Unbreakable divine commitment (32:36-41)

## Learning Objectives
By the end of this lesson, students will be able to:
1. Explain the historical contexts of Isaiah and Jeremiah's ministries
2. Identify and interpret key messianic prophecies in Isaiah
3. Articulate the theology of the New Covenant in Jeremiah 31
4. Apply prophetic themes of judgment and hope to contemporary situations

## Reading Assignment
- Isaiah 6, 7, 9, 11, 40, 52:13-53:12, 61, 65-66
- Jeremiah 1, 7, 23, 29, 31, 52`,
    assignment: "Isaiah 53 is the most detailed messianic prophecy in the Old Testament. Provide a verse-by-verse analysis showing how this passage was fulfilled in Jesus Christ. Include New Testament references and theological implications. (1000 words)"
  },
  {
    title: "Minor Prophets and Apocalyptic Literature",
    content: `# Minor Prophets and Apocalyptic Literature

## Overview
The twelve Minor Prophets (Hosea through Malachi) and apocalyptic books (Daniel, portions of Ezekiel, Zechariah) address Israel and Judah during various historical crises, calling for repentance and offering eschatological hope.

## The Twelve Minor Prophets

### Pre-Exilic Prophets (8th-7th centuries BC)

#### Hosea: God's Unfailing Love
- **Context**: Northern kingdom, contemporary with Amos
- **Symbolic Marriage**: Hosea and Gomer illustrate God's relationship with Israel (1-3)
- **Covenant Lawsuit**: Israel's spiritual adultery (4-13)
- **Restoration Hope**: "I will heal their apostasy; I will love them freely" (14:4)

#### Amos: Justice and Righteousness
- **Context**: Northern kingdom, prosperous but corrupt
- **Social Justice**: "Let justice roll down like waters" (5:24)
- **Day of the LORD**: Judgment, not deliverance for the unrighteous (5:18-20)
- **Remnant Hope**: Restoration of David's fallen tent (9:11-15)

#### Micah: What Does the LORD Require?
- **Context**: Judah, contemporary with Isaiah
- **Indictment**: Corrupt leaders, false prophets, social injustice (1-3)
- **Messianic Prophecy**: Bethlehem birthplace (5:2, cf. Matt 2:6)
- **Summary of True Religion**: "Do justice, love kindness, walk humbly with your God" (6:8)

### Exilic and Post-Exilic Prophets (6th-5th centuries BC)

#### Habakkuk: Faith in Crisis
- **Context**: Babylonian threat, theodicy questions
- **Dialogue**: "Why do you tolerate wrongdoing?" (1:2-4)
- **Divine Response**: Judgment coming, but "the righteous shall live by faith" (2:4)
- **Prayer of Faith**: Trusting God despite circumstances (3)

#### Haggai and Zechariah: Rebuilding the Temple
- **Context**: Post-exilic Jerusalem, temple reconstruction stalled
- **Haggai's Call**: Prioritize God's house (1:1-11)
- **Zechariah's Visions**: Eight night visions encouraging completion (1-6)
- **Messianic Prophecies**: Branch, humble king, pierced one (Zech 3:8, 9:9, 12:10)

#### Malachi: Messenger of the Covenant
- **Context**: Post-exilic, spiritual apathy and compromise
- **Disputation Style**: Six dialogues addressing Israel's complaints
- **Tithes and Offerings**: Robbing God (3:8-12)
- **Elijah's Return**: Forerunner before the Day of the LORD (4:5-6, cf. Matt 11:14)

## Apocalyptic Literature: Daniel

### Historical Context
- **Exile**: Daniel taken to Babylon in 605 BC
- **Faithfulness**: Refusing defilement, interpreting dreams, surviving lions' den (1-6)
- **Visions**: Four kingdoms, Son of Man, seventy weeks, end times (7-12)

### Key Themes

#### Sovereignty of God
- **Nebuchadnezzar's Dream**: Kingdoms rise and fall under divine control (2)
- **God's Kingdom**: Eternal, indestructible, universal (2:44, 7:13-14)

#### Faithfulness Under Persecution
- **Fiery Furnace**: Shadrach, Meshach, Abednego (3)
- **Lions' Den**: Daniel's unwavering prayer life (6)
- **Encouragement**: God delivers the faithful

#### Eschatological Hope
- **Son of Man**: Heavenly figure receiving eternal dominion (7:13-14)
- **Seventy Weeks**: Prophetic timeline (9:24-27)
- **Resurrection**: "Many who sleep... will awake" (12:2)
- **End Times**: Michael, tribulation, deliverance (12:1-3)

### Apocalyptic Genre
- **Symbolic Imagery**: Beasts, horns, numbers
- **Dualism**: Cosmic conflict between good and evil
- **Eschatology**: Focus on end times and final judgment
- **Encouragement**: God will vindicate His people

## Learning Objectives
By the end of this lesson, students will be able to:
1. Identify the major themes of selected Minor Prophets
2. Explain the characteristics of apocalyptic literature
3. Interpret Daniel's visions in their historical and eschatological contexts
4. Apply prophetic calls for justice and faithfulness to contemporary life

## Reading Assignment
- Hosea 1-3, 11, 14
- Amos 5, 9
- Micah 5-6
- Habakkuk 2-3
- Haggai 1-2
- Zechariah 9, 12-14
- Malachi 3-4
- Daniel 2, 3, 6, 7, 9, 12`,
    assignment: "The Minor Prophets repeatedly call for social justice alongside proper worship. Choose three prophets and explain how they integrate these two concerns. What does this teach us about authentic faith? (850 words)"
  },
  {
    title: "Old Testament Theology and Christology",
    content: `# Old Testament Theology and Christology

## Overview
This concluding lesson synthesizes the major theological themes of the Old Testament and explores how they find their fulfillment in Jesus Christ, demonstrating the unity of Scripture and the continuity of God's redemptive plan.

## Major Theological Themes

### The Character of God

#### Monotheism
- **Shema**: "Hear, O Israel: The LORD our God, the LORD is one" (Deut 6:4)
- **Uniqueness**: No other gods exist; idols are nothing (Isa 44:6-8)
- **Universal Sovereignty**: Creator and ruler of all nations

#### Holiness
- **Transcendence**: "Holy, holy, holy is the LORD of hosts" (Isa 6:3)
- **Moral Purity**: Separation from sin, call to ethical holiness
- **Presence**: Tabernacle, temple, Shekinah glory

#### Covenant Faithfulness (Hesed)
- **Steadfast Love**: Loyal, enduring commitment
- **Patience**: Slow to anger, abounding in mercy (Exod 34:6-7)
- **Forgiveness**: Gracious response to repentance

### Covenant Theology

#### Major Covenants
- **Noahic**: Universal, preservation of creation (Gen 9)
- **Abrahamic**: Particular, election and blessing (Gen 12, 15, 17)
- **Mosaic**: Conditional, law and obedience (Exod 19-24)
- **Davidic**: Royal, eternal dynasty (2 Sam 7)
- **New Covenant**: Internalized, complete forgiveness (Jer 31:31-34)

#### Covenant Structure
- **Suzerain-Vassal**: God as king, Israel as servant
- **Blessings and Curses**: Deuteronomic theology
- **Faithfulness and Failure**: Israel's history as covenant violation

### Sin and Redemption

#### The Problem of Sin
- **The Fall**: Genesis 3, universal human condition
- **Consequences**: Death, alienation, broken relationships
- **Pervasiveness**: "All have turned aside" (Ps 14:3, 53:3)

#### Sacrificial Atonement
- **Substitution**: Innocent victim bears guilt
- **Blood Atonement**: "Life is in the blood" (Lev 17:11)
- **Day of Atonement**: Annual cleansing (Lev 16)
- **Limitations**: Repeated sacrifices, external cleansing

#### Prophetic Hope
- **Suffering Servant**: Vicarious, once-for-all atonement (Isa 53)
- **New Covenant**: Internal transformation, complete forgiveness (Jer 31)

### Messianic Expectation

#### Royal Messiah
- **Seed of the Woman**: Proto-evangelium (Gen 3:15)
- **Davidic King**: Eternal throne (2 Sam 7:12-16)
- **Immanuel**: God with us (Isa 7:14)
- **Wonderful Counselor**: Divine titles (Isa 9:6-7)
- **Branch**: Righteous ruler (Jer 23:5-6, Zech 3:8, 6:12)

#### Suffering Servant
- **Isaiah 53**: Despised, wounded, crushed for our iniquities
- **Psalm 22**: Forsaken, pierced, mocked
- **Zechariah 12:10**: Pierced one, mourned

#### Prophetic Fulfillment
- **Dual Nature**: Suffering and reigning
- **Two Comings**: First advent (suffering), second advent (glory)

## Christological Interpretation

### Jesus as Fulfillment

#### Typology
- **Adam**: Last Adam, new humanity (Rom 5:12-21, 1 Cor 15:45)
- **Moses**: Prophet like Moses (Deut 18:15, Acts 3:22)
- **David**: Son of David, eternal king (Matt 1:1, Rev 22:16)
- **Passover Lamb**: Our Passover sacrificed (1 Cor 5:7)
- **Temple**: Dwelling place of God (John 2:19-21)

#### Direct Prophecy
- **Virgin Birth**: Isaiah 7:14 → Matthew 1:23
- **Bethlehem**: Micah 5:2 → Matthew 2:6
- **Triumphal Entry**: Zechariah 9:9 → Matthew 21:5
- **Crucifixion**: Psalm 22, Isaiah 53 → Passion narratives
- **Resurrection**: Psalm 16:10 → Acts 2:27

### New Testament Use of the Old Testament

#### Hermeneutical Approaches
- **Literal Fulfillment**: Direct prediction and realization
- **Typological**: Patterns and shadows pointing forward
- **Analogical**: Similar situations applied to Christ
- **Christocentric Reading**: All Scripture testifies to Christ (Luke 24:27, 44)

#### Key Texts
- **Hebrews**: Old covenant as shadow, Christ as substance
- **Matthew**: Formula quotations ("This was to fulfill...")
- **Paul**: Abraham's faith, new covenant, Adam-Christ typology
- **Peter and John**: Prophetic fulfillment in apostolic preaching

## Theological Continuity and Discontinuity

### Continuity
- **One God**: Same God of Abraham, Isaac, Jacob
- **One Plan**: Unified redemptive history
- **One People**: Israel and church, one olive tree (Rom 11)
- **One Messiah**: Jesus is the Christ, the fulfillment

### Discontinuity
- **Old Covenant Obsolete**: Fulfilled and superseded (Heb 8:13)
- **Ceremonial Law**: Shadows fulfilled in Christ (Col 2:16-17)
- **New Covenant**: Better promises, internal transformation
- **Universal Mission**: Gospel to all nations, Gentile inclusion

## Learning Objectives
By the end of this lesson, students will be able to:
1. Articulate the major theological themes of the Old Testament
2. Explain how the Old Testament anticipates and points to Christ
3. Interpret the Old Testament christologically with hermeneutical integrity
4. Understand the relationship between the Old and New Covenants

## Reading Assignment
- Genesis 3:15, 12:1-3
- Deuteronomy 6:4-9, 18:15-19
- 2 Samuel 7:12-16
- Psalm 22, 110
- Isaiah 7:14, 9:6-7, 53
- Jeremiah 31:31-34
- Luke 24:13-49
- Hebrews 1, 8-10`,
    assignment: "Write a comprehensive essay tracing one major Old Testament theme (e.g., covenant, sacrifice, kingship, temple) from its introduction through its development and ultimate fulfillment in Christ. Demonstrate how the New Testament authors interpret and apply this theme. (1200 words)"
  }
];

console.log(`Creating ${otLessons.length} lessons for Old Testament Survey (Course ID: ${otCourse.id})...`);

for (let i = 0; i < otLessons.length; i++) {
  const lesson = otLessons[i];
  await db.insert(lessons).values({
    courseId: otCourse.id,
    title: lesson.title,
    content: lesson.content,
    assignment: lesson.assignment,
    lessonOrder: i + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log(`✓ Created Lesson ${i + 1}: ${lesson.title}`);
}

// Update course totalLessons
await db.update(courses)
  .set({ totalLessons: otLessons.length })
  .where(eq(courses.id, otCourse.id));

console.log(`\n✅ Successfully created ${otLessons.length} lessons for Old Testament Survey!`);
console.log(`Course updated with totalLessons: ${otLessons.length}`);
await connection.end();
