import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const courseId = 360001; // WOR101 Biblical Worship

const lessons = [
  {
    title: "The Theology of Worship",
    content: `# The Theology of Worship

## I. Introduction

Worship stands at the center of the Christian life and the life of the church. It is the primary reason for which we were created and redeemed. Yet worship is often misunderstood, reduced to music styles or emotional experiences. This lesson establishes a theological foundation for understanding what worship truly is and why it matters.

The Hebrew word for worship, **שָׁחָה** (shachah), means to bow down or prostrate oneself. The Greek **προσκυνέω** (proskuneō) carries similar meaning—to kiss toward, expressing reverence and adoration. True worship involves the whole person—body, mind, and spirit—directed toward the one true God.

**Learning Objectives:**
- Define worship theologically and biblically
- Understand worship as response to God's revelation
- Explore the Trinitarian nature of worship
- Distinguish between true and false worship

## II. Defining Worship

### A. Worship as Worth-ship

The English word "worship" derives from the Old English "weorthscipe," meaning to ascribe worth or value. Worship is fundamentally about declaring God's worth—His glory, majesty, holiness, and grace.

> "Ascribe to the LORD the glory due his name; worship the LORD in the splendor of holiness." — Psalm 29:2 (ESV)

### B. Worship as Response

Worship is not something we initiate but our response to God's self-revelation. God reveals Himself, and we respond with adoration, praise, thanksgiving, and surrender. This pattern is seen throughout Scripture:

- Isaiah sees the Lord high and lifted up and responds with confession and commission (Isaiah 6)
- The shepherds hear the angelic announcement and respond by glorifying God (Luke 2:20)
- The disciples see the risen Christ and respond with worship (Matthew 28:17)

### C. Worship as Lifestyle

While corporate worship gatherings are essential, worship extends to all of life:

> "I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship." — Romans 12:1 (ESV)

Every aspect of life—work, relationships, leisure—can be an act of worship when done for God's glory.

## III. The Object of Worship

### A. God Alone

The first commandment establishes the exclusive object of worship: "You shall have no other gods before me" (Exodus 20:3). Jesus affirmed this: "You shall worship the Lord your God and him only shall you serve" (Matthew 4:10).

### B. The Trinitarian God

Christian worship is inherently Trinitarian:

- We worship **the Father** who loved us and sent His Son
- We worship **through the Son** who is our mediator and the image of the invisible God
- We worship **in the Spirit** who enables and empowers our worship

> "For through him [Christ] we both have access in one Spirit to the Father." — Ephesians 2:18 (ESV)

### C. The Revealed God

We worship God as He has revealed Himself in Scripture, not as we imagine Him to be. True worship is grounded in true knowledge of God.

## IV. The Nature of True Worship

### A. In Spirit and Truth

Jesus' conversation with the Samaritan woman provides the definitive statement on worship:

> "But the hour is coming, and is now here, when the true worshipers will worship the Father in spirit and truth, for the Father is seeking such people to worship him. God is spirit, and those who worship him must worship in spirit and truth." — John 4:23-24 (ESV)

**In Spirit**: Worship must be genuine, from the heart, enabled by the Holy Spirit—not merely external ritual.

**In Truth**: Worship must be according to God's revealed truth—not based on human invention or false ideas about God.

### B. With Reverence and Awe

> "Therefore let us be grateful for receiving a kingdom that cannot be shaken, and thus let us offer to God acceptable worship, with reverence and awe, for our God is a consuming fire." — Hebrews 12:28-29 (ESV)

Worship involves holy fear—not terror, but profound respect for God's majesty and holiness.

### C. With Joy and Gladness

> "Serve the LORD with gladness! Come into his presence with singing!" — Psalm 100:2 (ESV)

Reverence and joy are not opposites. True worship combines awe at God's transcendence with delight in His goodness.

## V. False Worship

### A. Idolatry

Idolatry is directing worship to anything other than the true God. This includes:

- Worship of false gods or images
- Worship of created things (Romans 1:25)
- Worship of self, success, pleasure, or possessions

### B. Vain Worship

Jesus condemned worship that honors God with lips while hearts are far from Him (Matthew 15:8-9). External conformity without internal reality is vain worship.

### C. Self-Centered Worship

When worship becomes about our preferences, experiences, or entertainment rather than God's glory, it has become self-centered rather than God-centered.

## VI. The Purpose of Worship

### A. God's Glory

The ultimate purpose of worship is God's glory. We exist to glorify God and enjoy Him forever.

> "So, whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31 (ESV)

### B. Our Transformation

As we worship, we are transformed into Christ's likeness:

> "And we all, with unveiled face, beholding the glory of the Lord, are being transformed into the same image from one degree of glory to another." — 2 Corinthians 3:18 (ESV)

### C. Witness to the World

Authentic worship testifies to God's reality and draws others to Him.

## VII. Key Points Summary

- Worship is ascribing worth to God in response to His revelation
- True worship is directed to the Triune God alone
- Worship must be in spirit (genuine) and truth (according to Scripture)
- Worship combines reverence and joy
- False worship includes idolatry, empty ritual, and self-centeredness
- Worship glorifies God, transforms us, and witnesses to the world

## VIII. Scripture Memory

> "God is spirit, and those who worship him must worship in spirit and truth." — John 4:24 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Worship in the Old Testament",
    content: `# Worship in the Old Testament

## I. Introduction

The Old Testament provides the foundation for understanding biblical worship. From the patriarchs to the prophets, from the tabernacle to the temple, the Old Testament reveals how God's people approached Him in worship. Understanding this history illuminates New Testament worship and our own practice today.

The Hebrew Scriptures use multiple terms for worship: **עָבַד** (abad, to serve), **שָׁחָה** (shachah, to bow down), **הָלַל** (halal, to praise), and **יָדָה** (yadah, to give thanks). Together these capture the multifaceted nature of worship—service, submission, celebration, and gratitude.

**Learning Objectives:**
- Trace the development of worship through Old Testament history
- Understand the significance of tabernacle and temple worship
- Explore the role of sacrifice, priesthood, and festivals
- Identify principles that carry forward into Christian worship

## II. Worship in the Patriarchal Period

### A. Altars and Sacrifice

The patriarchs worshiped by building altars and offering sacrifices:

- Noah built an altar after the flood (Genesis 8:20)
- Abraham built altars at Shechem, Bethel, and Hebron (Genesis 12:7-8; 13:18)
- Isaac built an altar at Beersheba (Genesis 26:25)
- Jacob set up pillars and poured out offerings (Genesis 28:18; 35:14)

These altars marked places of encounter with God and expressed devotion and thanksgiving.

### B. Calling on the Name of the LORD

> "At that time people began to call upon the name of the LORD." — Genesis 4:26 (ESV)

Worship involved invoking God's name—acknowledging His presence and seeking His blessing.

### C. Characteristics of Patriarchal Worship

- **Personal**: Direct encounters between individuals and God
- **Spontaneous**: Arising from specific occasions and revelations
- **Simple**: Altars, sacrifices, and prayer without elaborate ritual
- **Family-centered**: The patriarch served as priest for his household

## III. Worship at Sinai and the Tabernacle

### A. The Sinai Revelation

At Sinai, God gave Israel detailed instructions for worship. The first four commandments established the foundation:

1. No other gods
2. No graven images
3. No taking God's name in vain
4. Remember the Sabbath

### B. The Tabernacle

The tabernacle (**מִשְׁכָּן**, mishkan, "dwelling place") was God's portable sanctuary among His people:

> "And let them make me a sanctuary, that I may dwell in their midst." — Exodus 25:8 (ESV)

**Structure**:
- Outer court with bronze altar and laver
- Holy Place with lampstand, table of showbread, and incense altar
- Most Holy Place with the Ark of the Covenant

The tabernacle taught that approaching God requires:
- **Sacrifice** (bronze altar)
- **Cleansing** (laver)
- **Mediation** (priestly service)
- **Reverence** (restricted access to God's presence)

### C. The Sacrificial System

Leviticus outlines five main offerings:

| Offering | Hebrew | Purpose |
|----------|--------|---------|
| Burnt Offering | עֹלָה (olah) | Total consecration to God |
| Grain Offering | מִנְחָה (minchah) | Thanksgiving and dedication |
| Peace Offering | שֶׁלֶם (shelem) | Fellowship with God |
| Sin Offering | חַטָּאת (chattat) | Atonement for unintentional sin |
| Guilt Offering | אָשָׁם (asham) | Restitution for specific wrongs |

These sacrifices pointed forward to Christ's ultimate sacrifice.

### D. The Priesthood

The Levitical priesthood mediated between God and people:

- **Aaron and his sons** served as priests
- **The high priest** alone entered the Most Holy Place once yearly
- Priests offered sacrifices, taught the law, and blessed the people

## IV. Temple Worship

### A. Solomon's Temple

David desired to build a permanent house for God, but the task fell to Solomon. The temple followed the tabernacle pattern but on a grander scale:

> "The house that I am to build will be great, for our God is greater than all gods." — 2 Chronicles 2:5 (ESV)

### B. Temple Liturgy

Temple worship was elaborate and beautiful:

- **Morning and evening sacrifices** (Exodus 29:38-42)
- **Levitical choirs and musicians** (1 Chronicles 25)
- **Psalms sung antiphonally**
- **Incense offered with prayers**
- **Festivals celebrated with great ceremony**

### C. The Psalms

The Psalter was Israel's hymnbook. The Psalms express the full range of human emotion directed toward God:

- Praise and thanksgiving (Psalms 100, 150)
- Lament and petition (Psalms 22, 88)
- Trust and confidence (Psalms 23, 91)
- Confession and repentance (Psalm 51)
- Royal and messianic hope (Psalms 2, 110)

## V. The Festivals

### A. Annual Festivals

God instituted festivals to commemorate His mighty acts:

| Festival | Hebrew | Significance |
|----------|--------|--------------|
| Passover | פֶּסַח (Pesach) | Deliverance from Egypt |
| Unleavened Bread | מַצּוֹת (Matzot) | Purity and haste of exodus |
| Firstfruits | בִּכּוּרִים (Bikkurim) | Gratitude for harvest |
| Pentecost/Weeks | שָׁבֻעוֹת (Shavuot) | Harvest thanksgiving, law-giving |
| Trumpets | רֹאשׁ הַשָּׁנָה (Rosh Hashanah) | New year, repentance |
| Day of Atonement | יוֹם כִּפּוּר (Yom Kippur) | National atonement |
| Tabernacles | סֻכּוֹת (Sukkot) | Wilderness wandering, harvest |

### B. The Sabbath

The weekly Sabbath was central to Israelite worship—a day of rest, assembly, and remembrance of creation and redemption.

## VI. Prophetic Critique of Worship

### A. The Problem of Empty Ritual

The prophets repeatedly condemned worship divorced from righteousness:

> "I hate, I despise your feasts, and I take no delight in your solemn assemblies... But let justice roll down like waters, and righteousness like an ever-flowing stream." — Amos 5:21, 24 (ESV)

### B. The Call for Heart Worship

> "For I desire steadfast love and not sacrifice, the knowledge of God rather than burnt offerings." — Hosea 6:6 (ESV)

God desires internal reality, not mere external compliance.

### C. Hope for Renewed Worship

The prophets also envisioned a future when all nations would worship the true God:

> "For from the rising of the sun to its setting my name will be great among the nations, and in every place incense will be offered to my name, and a pure offering." — Malachi 1:11 (ESV)

## VII. Key Points Summary

- Patriarchal worship was personal, spontaneous, and altar-centered
- The tabernacle and temple provided structured, sacrificial worship
- Priests mediated between God and people
- Festivals commemorated God's saving acts
- The Psalms expressed worship in song and prayer
- The prophets called for worship that united ritual with righteousness

## VIII. Scripture Memory

> "Oh come, let us worship and bow down; let us kneel before the LORD, our Maker!" — Psalm 95:6 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Worship in the New Testament",
    content: `# Worship in the New Testament

## I. Introduction

The New Testament reveals a dramatic transformation in worship. With the coming of Christ, the shadows of the Old Testament give way to the reality. The temple is no longer a building but the body of Christ and His people. Sacrifice is no longer animal blood but the once-for-all offering of the Lamb of God. This lesson explores how worship is fulfilled and transformed in the New Covenant.

The Greek word **λατρεία** (latreia) refers to service rendered to God, while **προσκυνέω** (proskuneō) denotes the act of worship itself—bowing before God in reverence and adoration.

**Learning Objectives:**
- Understand how Christ fulfills Old Testament worship
- Explore worship in the Gospels and early church
- Identify the elements of New Testament worship
- Apply New Testament principles to contemporary worship

## II. Christ as the Fulfillment of Worship

### A. Christ as Temple

Jesus declared, "Destroy this temple, and in three days I will raise it up" (John 2:19). He spoke of His body. Christ is the true meeting place between God and humanity.

### B. Christ as Sacrifice

> "Behold, the Lamb of God, who takes away the sin of the world!" — John 1:29 (ESV)

Christ's death on the cross fulfilled all the sacrifices of the Old Testament. The book of Hebrews develops this extensively:

> "He entered once for all into the holy places, not by means of the blood of goats and calves but by means of his own blood, thus securing an eternal redemption." — Hebrews 9:12 (ESV)

### C. Christ as High Priest

Jesus is our great High Priest who has passed through the heavens (Hebrews 4:14). He ever lives to intercede for us (Hebrews 7:25).

### D. Christ as the Object of Worship

The New Testament presents Jesus as worthy of worship:

- The magi worshiped Him (Matthew 2:11)
- The disciples worshiped Him (Matthew 28:17)
- Thomas confessed, "My Lord and my God!" (John 20:28)
- Heaven worships the Lamb (Revelation 5:8-14)

## III. Worship in the Gospels

### A. Jesus' Teaching on Worship

Jesus' conversation with the Samaritan woman (John 4:19-24) is foundational:

- True worship transcends location (neither Gerizim nor Jerusalem)
- True worship is "in spirit and truth"
- The Father seeks such worshipers

### B. Jesus' Example of Worship

Jesus modeled worship through:

- Regular synagogue attendance (Luke 4:16)
- Temple worship (Luke 2:41-49; John 2:13-17)
- Prayer and communion with the Father (Mark 1:35; Luke 5:16)
- Thanksgiving (Matthew 11:25; John 11:41)

### C. The Lord's Supper

At the Last Supper, Jesus instituted the central act of Christian worship:

> "Do this in remembrance of me." — Luke 22:19 (ESV)

The Lord's Supper proclaims Christ's death until He comes (1 Corinthians 11:26).

## IV. Worship in Acts and the Early Church

### A. Continuity and Discontinuity

The early church maintained continuity with Jewish worship while experiencing transformation:

- They continued in temple worship (Acts 2:46; 3:1)
- They also met in homes for distinctly Christian worship (Acts 2:42, 46)
- Eventually, the break with the temple was complete

### B. Elements of Early Christian Worship

> "And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers." — Acts 2:42 (ESV)

Key elements included:

- **Apostolic teaching** (Scripture and doctrine)
- **Fellowship** (κοινωνία, koinōnia)
- **Breaking of bread** (Lord's Supper and common meals)
- **Prayers** (both set prayers and spontaneous)

### C. The Lord's Day

Christians gathered on the first day of the week—the day of resurrection:

> "On the first day of the week, when we were gathered together to break bread..." — Acts 20:7 (ESV)

## V. Worship in the Epistles

### A. Pauline Teaching on Worship

Paul's letters provide extensive instruction on worship:

**Romans 12:1-2**: Worship as presenting our bodies as living sacrifices
**1 Corinthians 11-14**: Order in corporate worship, Lord's Supper, spiritual gifts
**Ephesians 5:18-20**: Being filled with the Spirit, singing psalms, hymns, and spiritual songs
**Colossians 3:16-17**: Teaching and admonishing through song, doing all in Jesus' name

### B. Worship and the Body of Christ

Worship is corporate, not merely individual:

> "When you come together, each one has a hymn, a lesson, a revelation, a tongue, or an interpretation. Let all things be done for building up." — 1 Corinthians 14:26 (ESV)

### C. Orderly Worship

Paul insists on order: "All things should be done decently and in order" (1 Corinthians 14:40). Worship should edify the congregation, not create confusion.

## VI. Worship in Revelation

### A. Heavenly Worship

Revelation provides glimpses of worship in heaven:

- The four living creatures cry "Holy, holy, holy" (Revelation 4:8)
- The twenty-four elders cast their crowns before the throne (Revelation 4:10)
- Myriads of angels worship the Lamb (Revelation 5:11-12)
- A great multitude from every nation worships (Revelation 7:9-10)

### B. Worship Songs in Revelation

Revelation contains hymns that shaped early Christian worship:

> "Worthy are you, our Lord and God, to receive glory and honor and power, for you created all things, and by your will they existed and were created." — Revelation 4:11 (ESV)

> "Worthy is the Lamb who was slain, to receive power and wealth and wisdom and might and honor and glory and blessing!" — Revelation 5:12 (ESV)

### C. The Consummation of Worship

Revelation envisions the ultimate goal—God dwelling with His people:

> "Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people, and God himself will be with them as their God." — Revelation 21:3 (ESV)

## VII. Key Points Summary

- Christ fulfills Old Testament worship as temple, sacrifice, and high priest
- Jesus taught that true worship is in spirit and truth
- The early church worshiped through teaching, fellowship, breaking of bread, and prayers
- The Lord's Day became the Christian day of worship
- Paul emphasized orderly, edifying corporate worship
- Revelation reveals the glorious worship of heaven

## VIII. Scripture Memory

> "And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers." — Acts 2:42 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Elements of Corporate Worship",
    content: `# The Elements of Corporate Worship

## I. Introduction

What should happen when the church gathers for worship? Throughout history, Christians have identified certain elements as essential to corporate worship. These elements are not arbitrary traditions but are grounded in Scripture and reflect the nature of the gospel itself. This lesson examines the biblical elements of corporate worship and their significance.

The Reformers distinguished between **elements** (what Scripture commands for worship) and **circumstances** (practical matters like time and place). This distinction helps us maintain biblical fidelity while allowing appropriate flexibility.

**Learning Objectives:**
- Identify the biblical elements of corporate worship
- Understand the theological significance of each element
- Distinguish between elements and circumstances
- Apply these principles to worship planning

## II. The Reading of Scripture

### A. Biblical Basis

> "Until I come, devote yourself to the public reading of Scripture, to exhortation, to teaching." — 1 Timothy 4:13 (ESV)

The public reading of Scripture has been central to worship from ancient Israel (Nehemiah 8:1-8) through the early church.

### B. Significance

When Scripture is read, God speaks to His people. The reading of Scripture is not merely preliminary to the sermon but is itself an act of worship and a means of grace.

### C. Practice

- Read substantial portions of Scripture
- Read from both Old and New Testaments
- Read clearly and reverently
- Consider using a lectionary for systematic reading

## III. Preaching and Teaching

### A. Biblical Basis

Preaching is central to New Testament worship:

> "Preach the word; be ready in season and out of season; reprove, rebuke, and exhort, with complete patience and teaching." — 2 Timothy 4:2 (ESV)

### B. Significance

Through preaching, God's Word is explained, applied, and proclaimed. The Spirit works through the preached Word to convict, convert, and sanctify.

### C. Characteristics of Biblical Preaching

- **Expository**: Explaining the text's meaning
- **Christocentric**: Pointing to Christ
- **Applicational**: Addressing life and practice
- **Dependent on the Spirit**: Preached in the Spirit's power

## IV. Prayer

### A. Biblical Basis

> "First of all, then, I urge that supplications, prayers, intercessions, and thanksgivings be made for all people." — 1 Timothy 2:1 (ESV)

Prayer was central to early church worship (Acts 2:42).

### B. Types of Prayer in Worship

- **Invocation**: Calling upon God's presence
- **Confession**: Acknowledging sin
- **Thanksgiving**: Expressing gratitude
- **Supplication**: Presenting needs
- **Intercession**: Praying for others
- **Benediction**: Pronouncing blessing

### C. Corporate Prayer

Corporate prayer expresses the unity of the body. The congregation prays together, whether through responsive prayers, unison prayers, or "Amen" to pastoral prayers.

## V. Singing

### A. Biblical Basis

> "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God." — Colossians 3:16 (ESV)

### B. The Content of Song

- **Psalms**: The inspired hymnbook of Scripture
- **Hymns**: Doctrinal songs of praise
- **Spiritual songs**: Spirit-inspired expressions of worship

### C. The Purpose of Singing

Singing serves multiple purposes:

- **Praise**: Declaring God's worth
- **Teaching**: Instructing in truth
- **Exhortation**: Encouraging one another
- **Expression**: Voicing the heart's devotion

### D. Congregational Singing

Worship singing is primarily congregational, not performance. The goal is full participation by God's people.

## VI. The Sacraments/Ordinances

### A. Baptism

Baptism is the initiatory rite of the church:

> "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." — Matthew 28:19 (ESV)

Baptism signifies union with Christ in His death and resurrection (Romans 6:3-4).

### B. The Lord's Supper

The Lord's Supper is the ongoing meal of the covenant community:

> "For as often as you eat this bread and drink the cup, you proclaim the Lord's death until he comes." — 1 Corinthians 11:26 (ESV)

The Supper nourishes faith, proclaims Christ's death, and anticipates His return.

### C. Frequency and Practice

Churches differ on frequency and mode, but the sacraments should be celebrated regularly and reverently.

## VII. Offerings

### A. Biblical Basis

> "On the first day of every week, each of you is to put something aside and store it up, as he may prosper." — 1 Corinthians 16:2 (ESV)

### B. Significance

Giving is an act of worship expressing:

- Gratitude for God's provision
- Trust in God's faithfulness
- Support for the church's mission
- Generosity reflecting God's character

## VIII. Confession and Assurance

### A. Confession of Sin

Corporate confession acknowledges our common need for grace:

> "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness." — 1 John 1:9 (ESV)

### B. Assurance of Pardon

Following confession, the declaration of God's forgiveness in Christ assures penitent hearts.

### C. Confession of Faith

Reciting creeds and confessions (Apostles' Creed, Nicene Creed) expresses the church's common faith.

## IX. Benediction

### A. Biblical Basis

The Aaronic blessing (Numbers 6:24-26) and apostolic benedictions (2 Corinthians 13:14) model this practice.

### B. Significance

The benediction sends God's people into the world with His blessing, commissioning them for service.

## X. Key Points Summary

- Scripture reading is God speaking to His people
- Preaching explains and applies God's Word
- Prayer expresses dependence on God
- Singing teaches, exhorts, and praises
- Sacraments signify and seal gospel realities
- Offerings express gratitude and trust
- Confession and assurance address our sin and God's grace
- Benediction sends us with God's blessing

## XI. Scripture Memory

> "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God." — Colossians 3:16 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Music and Worship",
    content: `# Music and Worship

## I. Introduction

Music has always been central to the worship of God's people. From Miriam's song at the Red Sea to the new song of the redeemed in Revelation, Scripture is filled with music. Yet music in worship is also a source of controversy. This lesson examines the biblical theology of music in worship and provides principles for navigating contemporary discussions.

The Hebrew term **זָמַר** (zamar) means to sing praise with instruments, while **שִׁיר** (shir) refers to singing. The Greek **ψάλλω** (psallō) originally meant to pluck strings but came to mean singing praise. These terms reveal that worship music involves both voice and instrument.

**Learning Objectives:**
- Understand the biblical theology of music in worship
- Explore the history of church music
- Develop criteria for evaluating worship music
- Navigate contemporary worship music discussions

## II. Music in the Bible

### A. Old Testament Music

Music permeates the Old Testament:

- **Miriam's Song** (Exodus 15:20-21): Celebrating deliverance
- **David's Psalms**: The heart of Israel's worship
- **Temple Musicians** (1 Chronicles 25): Levitical choirs and instrumentalists
- **Instruments**: Lyres, harps, trumpets, cymbals, tambourines

The Psalms command the use of instruments:

> "Praise him with trumpet sound; praise him with lute and harp! Praise him with tambourine and dance; praise him with strings and pipe! Praise him with sounding cymbals; praise him with loud clashing cymbals!" — Psalm 150:3-5 (ESV)

### B. New Testament Music

The New Testament continues the emphasis on singing:

- Jesus and the disciples sang a hymn at the Last Supper (Matthew 26:30)
- Paul and Silas sang in prison (Acts 16:25)
- The Ephesian and Colossian churches sang psalms, hymns, and spiritual songs (Ephesians 5:19; Colossians 3:16)
- Heavenly worship includes new songs (Revelation 5:9; 14:3)

### C. The Purpose of Music in Worship

Scripture reveals multiple purposes:

- **Praise**: Declaring God's worth (Psalm 150)
- **Teaching**: Instructing in truth (Colossians 3:16)
- **Encouragement**: Building up the body (Ephesians 5:19)
- **Testimony**: Proclaiming God's works (Psalm 96:1-3)
- **Prayer**: Expressing petition and lament (Psalm 13)

## III. A Brief History of Church Music

### A. Early Church

The early church sang psalms, hymns, and canticles. Singing was primarily unaccompanied and congregational.

### B. Medieval Period

Gregorian chant developed in the Western church. Music became more elaborate but often less congregational.

### C. The Reformation

The Reformers restored congregational singing:

- **Luther** wrote hymns in the vernacular and encouraged instruments
- **Calvin** emphasized psalm-singing, often unaccompanied
- **The English tradition** produced the Book of Common Prayer and metrical psalms

### D. Evangelical Revivals

The 18th and 19th centuries saw an explosion of hymnody:

- Isaac Watts: "When I Survey the Wondrous Cross"
- Charles Wesley: "And Can It Be"
- Fanny Crosby: "Blessed Assurance"

### E. Contemporary Worship

The late 20th century brought contemporary worship music, praise choruses, and diverse musical styles.

## IV. Theological Principles for Worship Music

### A. God-Centered

Worship music must focus on God—His character, works, and glory—not primarily on our feelings or experiences.

### B. Biblically Grounded

The content of worship songs should be biblically accurate and theologically rich. We sing what we believe.

### C. Congregationally Accessible

Worship music should enable congregational participation, not merely performance.

### D. Excellent

Music offered to God should be the best we can offer, reflecting His worthiness.

### E. Contextually Appropriate

Music should fit the cultural context while maintaining biblical fidelity.

## V. Evaluating Worship Songs

### A. Lyrical Criteria

- **Theological accuracy**: Does it teach truth?
- **Biblical content**: Is it grounded in Scripture?
- **God-centeredness**: Does it focus on God or self?
- **Depth**: Does it express substantive truth?
- **Singability**: Can the congregation sing it?

### B. Musical Criteria

- **Melodic accessibility**: Can untrained singers learn it?
- **Harmonic support**: Does the music serve the text?
- **Rhythmic appropriateness**: Does it fit the content?
- **Range**: Is it singable for average voices?

### C. Practical Criteria

- **Teachability**: Can the congregation learn it?
- **Durability**: Will it stand the test of time?
- **Versatility**: Does it fit various contexts?

## VI. Navigating Worship Music Controversies

### A. Style Wars

Churches often divide over musical style. Principles for navigating:

- Distinguish between preference and principle
- Seek unity in essentials, liberty in non-essentials
- Consider the whole congregation, not just one demographic
- Avoid both traditionalism and trendiness

### B. Instruments

Some traditions restrict instruments; others embrace them. The key is that instruments serve congregational singing, not overshadow it.

### C. Performance vs. Participation

The danger of performance-oriented worship is that the congregation becomes an audience. Music should facilitate participation.

### D. Old vs. New

A healthy church sings both historic hymns and contemporary songs, drawing from the whole treasury of Christian music.

## VII. Practical Wisdom

### A. Song Selection

- Choose songs with strong theology and singable melodies
- Balance familiar songs with new ones
- Consider the flow and theme of the service
- Include a variety of moods (praise, lament, confession, thanksgiving)

### B. Leading Worship

- Lead with humility and focus on God
- Facilitate participation, don't perform
- Choose keys accessible to average voices
- Avoid excessive repetition or manipulation

### C. Training Musicians

- Develop musicians' skills and spiritual maturity
- Teach the theology of worship
- Foster a servant attitude

## VIII. Key Points Summary

- Music is central to biblical worship
- Church music has a rich and varied history
- Worship music should be God-centered, biblical, and congregational
- Songs should be evaluated for theological content and singability
- Navigate controversies with wisdom, humility, and unity
- Balance tradition and innovation in song selection

## IX. Scripture Memory

> "Sing to the LORD a new song; sing to the LORD, all the earth!" — Psalm 96:1 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Prayer in Worship",
    content: `# Prayer in Worship

## I. Introduction

Prayer is the breath of worship. Through prayer, we speak to God, expressing adoration, confession, thanksgiving, and supplication. Corporate prayer unites the congregation in dependence on God and shapes the community's spiritual life. This lesson explores the theology and practice of prayer in worship.

The New Testament uses several Greek words for prayer: **προσευχή** (proseuchē, general prayer), **δέησις** (deēsis, petition), **ἔντευξις** (enteuxis, intercession), and **εὐχαριστία** (eucharistia, thanksgiving). Together these capture the breadth of prayer in worship.

**Learning Objectives:**
- Understand the theology of corporate prayer
- Explore different types of prayer in worship
- Develop skills in leading public prayer
- Apply principles to worship planning

## II. The Theology of Corporate Prayer

### A. Prayer as Response to God

Prayer is not primarily about getting things from God but about responding to who He is. We pray because God has revealed Himself and invited us into relationship.

### B. Prayer in Jesus' Name

> "Whatever you ask in my name, this I will do, that the Father may be glorified in the Son." — John 14:13 (ESV)

We approach God through Christ our mediator. Prayer "in Jesus' name" means praying according to His character and will.

### C. Prayer in the Spirit

> "Likewise the Spirit helps us in our weakness. For we do not know what to pray for as we ought, but the Spirit himself intercedes for us." — Romans 8:26 (ESV)

The Holy Spirit enables and empowers our prayers.

### D. Corporate Prayer

When the church prays together, it expresses unity and mutual dependence:

> "Again I say to you, if two of you agree on earth about anything they ask, it will be done for them by my Father in heaven." — Matthew 18:19 (ESV)

## III. Types of Prayer in Worship

### A. Invocation

The invocation calls upon God's presence at the beginning of worship. It acknowledges that worship depends on God's gracious initiative.

**Example**: "Almighty God, to whom all hearts are open, all desires known, and from whom no secrets are hidden: cleanse the thoughts of our hearts by the inspiration of your Holy Spirit, that we may perfectly love you and worthily magnify your holy name; through Christ our Lord. Amen."

### B. Adoration

Prayers of adoration praise God for who He is—His attributes, character, and glory.

**Example**: "Holy, holy, holy Lord, God of power and might, heaven and earth are full of your glory. Hosanna in the highest!"

### C. Confession

Corporate confession acknowledges our common sinfulness and need for grace:

> "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness." — 1 John 1:9 (ESV)

Confession should be specific enough to be meaningful but general enough for corporate use.

### D. Assurance of Pardon

Following confession, a declaration of God's forgiveness assures penitent hearts:

**Example**: "Hear the good news: Christ Jesus came into the world to save sinners. If anyone is in Christ, there is a new creation. In the name of Jesus Christ, you are forgiven."

### E. Thanksgiving

Prayers of thanksgiving express gratitude for God's gifts and works:

> "Give thanks in all circumstances; for this is the will of God in Christ Jesus for you." — 1 Thessalonians 5:18 (ESV)

### F. Supplication and Intercession

Supplication presents our needs; intercession prays for others:

> "First of all, then, I urge that supplications, prayers, intercessions, and thanksgivings be made for all people, for kings and all who are in high positions." — 1 Timothy 2:1-2 (ESV)

Intercession should include:
- The church and its leaders
- The nation and its leaders
- The world and its needs
- The sick and suffering
- The lost and unreached

### G. Benediction

The benediction pronounces God's blessing as the congregation is sent into the world:

> "The LORD bless you and keep you; the LORD make his face to shine upon you and be gracious to you; the LORD lift up his countenance upon you and give you peace." — Numbers 6:24-26 (ESV)

## IV. Forms of Corporate Prayer

### A. Pastoral Prayer

A minister leads the congregation in extended prayer, covering multiple concerns. The congregation participates through attentive listening and "Amen."

### B. Responsive Prayer

Leader and congregation alternate in prayer, often using printed or projected text.

### C. Unison Prayer

The entire congregation prays together in one voice, using a common text.

### D. The Lord's Prayer

Jesus taught His disciples to pray this prayer (Matthew 6:9-13). It has been central to Christian worship from the earliest centuries.

### E. Collect

A collect is a brief, structured prayer with five parts: address, attribute, petition, result, and ending.

### F. Bidding Prayer

The leader announces prayer topics; the congregation prays silently or aloud; the leader offers a concluding prayer.

### G. Extemporaneous Prayer

Spontaneous prayer led by the Spirit, without a written text.

## V. Leading Public Prayer

### A. Preparation

- Prepare thoughtfully, even for extemporaneous prayer
- Ground prayers in Scripture
- Consider the congregation's needs and the service's theme

### B. Language

- Use reverent but accessible language
- Avoid clichés and empty phrases
- Speak to God, not to the congregation
- Use "we" rather than "I" for corporate prayer

### C. Delivery

- Speak clearly and at a moderate pace
- Pause for reflection
- Avoid theatrical or manipulative tones
- Lead with humility and sincerity

### D. Length

- Be concise; long prayers can lose the congregation
- Cover essential concerns without exhausting attention

## VI. The Lord's Prayer in Worship

### A. Structure

The Lord's Prayer provides a model for all prayer:

- **Address**: "Our Father in heaven"
- **Adoration**: "Hallowed be your name"
- **Kingdom**: "Your kingdom come, your will be done"
- **Provision**: "Give us this day our daily bread"
- **Forgiveness**: "Forgive us our debts"
- **Protection**: "Lead us not into temptation, deliver us from evil"
- **Doxology**: "For yours is the kingdom and the power and the glory forever"

### B. Use in Worship

The Lord's Prayer can be prayed in unison, sung, or used as a framework for pastoral prayer.

## VII. Key Points Summary

- Prayer is essential to worship, expressing dependence on God
- Corporate prayer unites the congregation
- Different types of prayer serve different purposes
- Various forms (pastoral, responsive, unison) facilitate participation
- Leading public prayer requires preparation and humility
- The Lord's Prayer provides a model for all prayer

## VIII. Scripture Memory

> "First of all, then, I urge that supplications, prayers, intercessions, and thanksgivings be made for all people." — 1 Timothy 2:1 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Sacraments in Worship",
    content: `# The Sacraments in Worship

## I. Introduction

The sacraments—Baptism and the Lord's Supper—are visible signs of invisible grace. Instituted by Christ Himself, they occupy a central place in Christian worship. Through these sacred acts, the gospel is proclaimed, faith is nourished, and the community is united. This lesson explores the theology and practice of the sacraments in worship.

The term "sacrament" comes from the Latin **sacramentum**, which translated the Greek **μυστήριον** (mystērion, mystery). Some traditions prefer "ordinance," emphasizing Christ's command. Both terms point to sacred acts instituted by Christ for the church.

**Learning Objectives:**
- Understand the biblical basis for the sacraments
- Explore different theological perspectives
- Examine the practice of Baptism and the Lord's Supper
- Apply sacramental theology to worship

## II. The Nature of Sacraments

### A. Definition

Augustine defined a sacrament as "a visible sign of an invisible grace." The Westminster Shorter Catechism states: "A sacrament is a holy ordinance instituted by Christ, wherein, by sensible signs, Christ, and the benefits of the new covenant, are represented, sealed, and applied to believers."

### B. Word and Sacrament

Sacraments are "visible words" (Augustine). They proclaim the gospel through action and symbol, complementing the preached Word.

### C. Sign and Seal

Sacraments are both:
- **Signs**: Pointing to spiritual realities
- **Seals**: Confirming God's promises to faith

### D. Means of Grace

Through the sacraments, God conveys grace to those who receive them in faith. They are not mere symbols but effectual means of blessing.

## III. Baptism

### A. Biblical Basis

Jesus commanded baptism:

> "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." — Matthew 28:19 (ESV)

The early church practiced baptism from the beginning (Acts 2:38, 41; 8:12, 36-38; 10:47-48).

### B. Meaning of Baptism

Baptism signifies:

- **Union with Christ**: In His death and resurrection (Romans 6:3-4)
- **Cleansing from sin**: Washing away of sins (Acts 22:16)
- **Regeneration**: New birth by the Spirit (Titus 3:5)
- **Incorporation into the church**: Entrance into the covenant community (1 Corinthians 12:13)

### C. Mode of Baptism

Christians differ on the mode:

- **Immersion**: Submerging the candidate in water
- **Affusion**: Pouring water over the candidate
- **Aspersion**: Sprinkling water on the candidate

Each tradition appeals to biblical and historical evidence.

### D. Subjects of Baptism

- **Believer's baptism**: Only those who profess faith
- **Infant baptism**: Children of believers, based on covenant theology

Both positions have strong advocates and biblical arguments.

### E. Baptism in Worship

Baptism should be celebrated in the context of corporate worship:

- The congregation witnesses and welcomes
- The gospel is proclaimed
- The church is reminded of its own baptism
- Vows may be taken by the candidate, parents, or congregation

## IV. The Lord's Supper

### A. Biblical Basis

Jesus instituted the Supper on the night of His betrayal:

> "And he took bread, and when he had given thanks, he broke it and gave it to them, saying, 'This is my body, which is given for you. Do this in remembrance of me.' And likewise the cup after they had eaten, saying, 'This cup that is poured out for you is the new covenant in my blood.'" — Luke 22:19-20 (ESV)

Paul provides further instruction in 1 Corinthians 11:23-26.

### B. Names for the Supper

- **The Lord's Supper** (1 Corinthians 11:20)
- **The Breaking of Bread** (Acts 2:42)
- **Communion** (1 Corinthians 10:16)
- **Eucharist** (from Greek εὐχαριστία, thanksgiving)
- **The Mass** (from Latin missa, dismissal)

### C. Meaning of the Supper

The Lord's Supper signifies:

- **Remembrance**: Recalling Christ's sacrifice
- **Proclamation**: Declaring His death until He comes
- **Communion**: Fellowship with Christ and one another
- **Nourishment**: Spiritual feeding on Christ by faith
- **Anticipation**: Looking forward to the marriage supper of the Lamb

### D. Theological Perspectives

Christians differ on Christ's presence in the Supper:

| View | Description |
|------|-------------|
| **Transubstantiation** (Roman Catholic) | Bread and wine become Christ's body and blood |
| **Consubstantiation** (Lutheran) | Christ is present "in, with, and under" the elements |
| **Spiritual Presence** (Reformed) | Christ is spiritually present to faith |
| **Memorial** (Zwinglian) | The Supper is a memorial, not a means of grace |

### E. Frequency

Churches differ on how often to celebrate:

- Weekly (early church practice, some traditions today)
- Monthly (common in many Protestant churches)
- Quarterly (some traditions)

### F. The Supper in Worship

The Lord's Supper should be celebrated reverently:

- Words of institution read from Scripture
- Prayer of thanksgiving
- Distribution of elements
- Communion hymns or silence
- Prayer of dedication

## V. Preparing for the Sacraments

### A. Self-Examination

> "Let a person examine himself, then, and so eat of the bread and drink of the cup." — 1 Corinthians 11:28 (ESV)

Participants should examine their hearts, confess sin, and come in faith.

### B. Fencing the Table

Some traditions practice "fencing the table"—inviting only baptized believers in good standing to partake.

### C. Instruction

Catechesis (instruction) prepares candidates for baptism and first communion.

## VI. Key Points Summary

- Sacraments are visible signs of invisible grace, instituted by Christ
- Baptism signifies union with Christ, cleansing, and incorporation into the church
- The Lord's Supper proclaims Christ's death and nourishes faith
- Christians differ on mode, subjects, and presence, but agree on the sacraments' importance
- Sacraments should be celebrated reverently in corporate worship

## VII. Scripture Memory

> "For as often as you eat this bread and drink the cup, you proclaim the Lord's death until he comes." — 1 Corinthians 11:26 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Church Calendar and Christian Seasons",
    content: `# The Church Calendar and Christian Seasons

## I. Introduction

The church calendar, or liturgical year, structures time around the life of Christ and the great events of salvation history. Through seasons of anticipation, celebration, and ordinary time, the church rehearses the gospel year after year. This lesson explores the history, theology, and practice of the church calendar.

The church calendar sanctifies time, reminding us that all of life belongs to God. As we move through the seasons, we are formed by the rhythm of the gospel story.

**Learning Objectives:**
- Understand the history and development of the church calendar
- Explore the major seasons and their significance
- Examine the theological rationale for the liturgical year
- Apply the calendar to worship planning

## II. History of the Church Calendar

### A. Jewish Roots

The church calendar has roots in the Jewish liturgical year:

- **Sabbath**: Weekly day of rest
- **Passover**: Annual celebration of deliverance
- **Pentecost**: Feast of Weeks
- **Tabernacles**: Harvest festival

### B. Early Church Development

The early church developed its own calendar:

- **The Lord's Day**: Weekly celebration of resurrection
- **Easter**: Annual celebration of Christ's resurrection
- **Pentecost**: Celebration of the Spirit's coming
- **Christmas**: Celebration of Christ's birth (4th century)

### C. Medieval Elaboration

The medieval church elaborated the calendar with saints' days, fasts, and feasts. The Reformation simplified but retained the basic structure.

### D. Contemporary Practice

Today, many traditions follow the church calendar, while others observe only major holidays. There is renewed interest in the liturgical year across traditions.

## III. The Seasons of the Church Year

### A. Advent

**Duration**: Four Sundays before Christmas
**Color**: Purple or blue
**Theme**: Anticipation of Christ's coming—both His first advent and His return

Advent is a season of preparation, longing, and hope. It looks back to Israel's waiting for the Messiah and forward to Christ's second coming.

### B. Christmas

**Duration**: December 25 through Epiphany (12 days)
**Color**: White or gold
**Theme**: Celebration of the Incarnation

Christmas celebrates the Word made flesh. The season includes:
- Christmas Day
- The Feast of the Holy Innocents
- The Feast of the Holy Name (January 1)

### C. Epiphany

**Duration**: January 6 and following Sundays
**Color**: White, then green
**Theme**: Manifestation of Christ to the world

Epiphany celebrates the revelation of Christ to the Gentiles (the Magi). The season emphasizes Christ's baptism, His first miracle, and His mission to all nations.

### D. Lent

**Duration**: 40 days before Easter (excluding Sundays)
**Color**: Purple
**Theme**: Repentance, self-examination, preparation for Easter

Lent begins on Ash Wednesday and is a season of fasting, prayer, and almsgiving. It recalls Jesus' 40 days in the wilderness and prepares hearts for the celebration of the resurrection.

### E. Holy Week

**Duration**: Palm Sunday through Holy Saturday
**Color**: Purple, then red (Good Friday), then no color (Holy Saturday)
**Theme**: Christ's passion and death

Holy Week includes:
- **Palm Sunday**: Jesus' triumphal entry
- **Maundy Thursday**: The Last Supper, foot washing
- **Good Friday**: The crucifixion
- **Holy Saturday**: The silence of the tomb

### F. Easter

**Duration**: Easter Sunday through Pentecost (50 days)
**Color**: White or gold
**Theme**: Celebration of the resurrection

Easter is the climax of the Christian year. The season celebrates Christ's victory over death and includes the Ascension (40 days after Easter).

### G. Pentecost

**Duration**: The 50th day after Easter
**Color**: Red
**Theme**: The coming of the Holy Spirit

Pentecost celebrates the Spirit's descent on the church (Acts 2). It is sometimes called the birthday of the church.

### H. Ordinary Time

**Duration**: The Sundays after Epiphany and after Pentecost
**Color**: Green
**Theme**: Growth in discipleship

Ordinary Time (from "ordinal," meaning counted) is the longest season. It focuses on Christ's teaching and the church's growth in faith.

## IV. Theological Rationale

### A. Rehearsing the Gospel

The church calendar tells the gospel story year after year. Through repetition, the story shapes our identity and forms our faith.

### B. Sanctifying Time

The calendar reminds us that all time belongs to God. We mark time not by secular holidays but by the events of salvation.

### C. Unity with the Church

Following the church calendar connects us with Christians across time and space who observe the same seasons.

### D. Balanced Teaching

The calendar ensures that the whole counsel of God is taught over time, not just the pastor's favorite topics.

## V. Practical Application

### A. Worship Planning

- Plan services around the season's themes
- Select Scripture readings, hymns, and prayers that fit the season
- Use appropriate colors and symbols

### B. Preaching

- Follow a lectionary or plan sermon series around the seasons
- Let the calendar shape the preaching calendar

### C. Personal Devotion

- Observe the seasons in personal prayer and reading
- Fast during Lent; feast during Easter
- Use devotional resources tied to the calendar

### D. Family and Home

- Celebrate the seasons at home with traditions, decorations, and special meals
- Teach children the meaning of each season

## VI. Key Points Summary

- The church calendar structures time around the gospel story
- Major seasons include Advent, Christmas, Epiphany, Lent, Easter, and Pentecost
- The calendar rehearses the gospel, sanctifies time, and unites the church
- Worship, preaching, and devotion can be shaped by the seasons

## VII. Scripture Memory

> "For everything there is a season, and a time for every matter under heaven." — Ecclesiastes 3:1 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Leading and Planning Worship",
    content: `# Leading and Planning Worship

## I. Introduction

Leading worship is a sacred responsibility. The worship leader serves as a guide, helping the congregation encounter God through Word, prayer, song, and sacrament. This lesson provides practical guidance for planning and leading worship services that are biblical, Christ-centered, and congregationally engaging.

The worship leader is not a performer but a servant—serving God and serving the congregation. The goal is not to draw attention to oneself but to facilitate the congregation's meeting with God.

**Learning Objectives:**
- Understand the role and responsibilities of worship leaders
- Develop skills in worship planning
- Learn principles for leading worship effectively
- Apply these principles to various worship contexts

## II. The Role of the Worship Leader

### A. Servant Leadership

> "Whoever would be great among you must be your servant." — Matthew 20:26 (ESV)

The worship leader serves:
- **God**: Offering worship that honors Him
- **The congregation**: Facilitating their worship
- **The Word**: Ensuring Scripture shapes the service

### B. Spiritual Qualifications

Worship leaders should be:
- Genuine worshipers themselves
- Growing in spiritual maturity
- Humble and teachable
- Gifted for leadership
- Doctrinally sound

### C. Practical Skills

Worship leaders need:
- Musical ability (for music leaders)
- Public speaking skills
- Organizational ability
- Sensitivity to the congregation
- Flexibility and adaptability

## III. Theology of Worship Planning

### A. Gospel-Centered Structure

Worship should tell the gospel story:

1. **Call to Worship**: God initiates, calling us into His presence
2. **Adoration**: We respond with praise
3. **Confession**: We acknowledge our sin
4. **Assurance**: We hear the gospel of forgiveness
5. **Word**: God speaks through Scripture and preaching
6. **Response**: We respond in prayer, song, offering, commitment
7. **Sending**: God sends us into the world with His blessing

### B. Dialogical Pattern

Worship is a dialogue between God and His people:
- God speaks (Scripture, preaching, assurance)
- We respond (prayer, song, confession, offering)

### C. Vertical and Horizontal

Worship is both:
- **Vertical**: Directed toward God
- **Horizontal**: Building up one another

## IV. Planning a Worship Service

### A. Preparation

- Begin with prayer
- Study the Scripture texts for the day
- Consider the season (liturgical calendar)
- Consult with the preacher about the sermon theme
- Review available resources (musicians, readers, etc.)

### B. Selecting Elements

Choose elements that:
- Are biblically grounded
- Fit the theme or season
- Engage the congregation
- Flow logically

### C. Selecting Songs

Consider:
- Theological content
- Congregational singability
- Fit with the service theme
- Balance of familiar and new
- Variety of mood and tempo

### D. Flow and Transitions

- Plan smooth transitions between elements
- Consider how one element leads to the next
- Avoid awkward pauses or jarring shifts
- Use music, silence, or brief words to connect elements

### E. Timing

- Respect time constraints
- Allow adequate time for essential elements
- Don't rush through important moments
- Be flexible if the Spirit leads differently

## V. Leading Worship in Practice

### A. Before the Service

- Arrive early to prepare
- Pray with the worship team
- Check all technical elements
- Review the order of service
- Prepare your heart

### B. During the Service

- Lead with confidence and humility
- Make eye contact with the congregation
- Give clear cues and instructions
- Be present and attentive
- Respond to the Spirit's leading

### C. Verbal Leadership

- Speak clearly and naturally
- Avoid clichés and filler words
- Keep transitions brief
- Point to God, not yourself
- Use Scripture to frame elements

### D. Musical Leadership

- Choose accessible keys
- Set appropriate tempos
- Lead with your voice, not just instruments
- Facilitate participation, don't perform
- Know when to be quiet

### E. After the Service

- Debrief with the team
- Receive feedback graciously
- Give thanks for what God did
- Note improvements for next time

## VI. Special Considerations

### A. Multigenerational Worship

- Include elements that engage all ages
- Balance traditional and contemporary
- Teach new songs; honor old ones
- Involve different generations in leadership

### B. Multicultural Worship

- Incorporate diverse musical styles
- Use multiple languages when appropriate
- Celebrate the diversity of the body
- Avoid tokenism; seek genuine inclusion

### C. Technology in Worship

- Use technology as a tool, not a distraction
- Ensure technical elements serve worship
- Have backup plans for technical failures
- Don't let screens replace hymnals entirely

### D. Special Services

- Weddings, funerals, baptisms, ordinations
- Holiday services (Christmas, Easter)
- Prayer services, healing services
- Adapt the basic structure to the occasion

## VII. Key Points Summary

- Worship leaders are servants, not performers
- Worship should be gospel-centered and dialogical
- Planning requires prayer, preparation, and attention to flow
- Leading requires confidence, humility, and sensitivity
- Consider the needs of the whole congregation

## VIII. Scripture Memory

> "Let all things be done for building up." — 1 Corinthians 14:26 (ESV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Worship and the Christian Life",
    content: `# Worship and the Christian Life

## I. Introduction

Worship is not confined to Sunday morning. The whole of the Christian life is to be an act of worship—a living sacrifice offered to God. This lesson explores the connection between corporate worship and daily life, showing how what we do on Sunday shapes how we live Monday through Saturday.

The apostle Paul's exhortation in Romans 12:1 captures this vision: our bodies—our whole lives—are to be presented as living sacrifices, which is our "spiritual worship" (λογικὴν λατρείαν, logikēn latreian).

**Learning Objectives:**
- Understand worship as a whole-life response to God
- Explore the connection between Sunday worship and daily life
- Develop practices that extend worship into everyday living
- Apply worship principles to work, relationships, and service

## II. Worship as Lifestyle

### A. Romans 12:1-2

> "I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship. Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect." — Romans 12:1-2 (ESV)

This passage teaches:
- Worship is a response to God's mercies
- Worship involves the whole person (body)
- Worship is ongoing (living sacrifice)
- Worship requires transformation

### B. All of Life as Worship

Every aspect of life can be worship:

> "So, whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31 (ESV)

Work, relationships, leisure, creativity—all can be offered to God.

### C. The Priesthood of All Believers

> "You yourselves like living stones are being built up as a spiritual house, to be a holy priesthood, to offer spiritual sacrifices acceptable to God through Jesus Christ." — 1 Peter 2:5 (ESV)

Every believer is a priest, offering the sacrifice of a holy life.

## III. Sunday Shapes the Week

### A. Gathered and Scattered

The church gathers for worship and scatters for mission. What happens in gathered worship equips and sends us for scattered worship in daily life.

### B. Formation Through Liturgy

The patterns of corporate worship form us:
- **Confession** teaches us humility
- **Assurance** reminds us of grace
- **Scripture** renews our minds
- **Prayer** cultivates dependence
- **Communion** nourishes faith
- **Benediction** sends us with blessing

### C. The Lord's Day

The Lord's Day is not merely a break from work but a foretaste of eternal rest. It reorients our week around God's priorities.

## IV. Worship and Work

### A. Work as Calling

Work is not merely a means to earn money but a calling from God. We serve God through our vocations.

> "Whatever you do, work heartily, as for the Lord and not for men." — Colossians 3:23 (ESV)

### B. Excellence as Worship

Doing our work with excellence honors God. Shoddy work dishonors Him.

### C. Integrity as Worship

Honesty, fairness, and integrity in the workplace are acts of worship.

### D. Witness Through Work

Our work ethic and character testify to our faith.

## V. Worship and Relationships

### A. Family as Worship

Family life is a context for worship:
- Family devotions
- Sabbath observance
- Hospitality
- Raising children in the faith

### B. Marriage as Worship

Marriage reflects Christ and the church (Ephesians 5:22-33). A godly marriage glorifies God.

### C. Friendship as Worship

Loving, serving, and encouraging friends is worship:

> "A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another." — John 13:34 (ESV)

### D. Community as Worship

The church community—bearing one another's burdens, sharing resources, building up one another—is worship.

## VI. Worship and Service

### A. Serving the Least

> "Truly, I say to you, as you did it to one of the least of these my brothers, you did it to me." — Matthew 25:40 (ESV)

Serving the poor, the sick, the marginalized is serving Christ.

### B. Justice as Worship

Working for justice reflects God's character:

> "He has told you, O man, what is good; and what does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?" — Micah 6:8 (ESV)

### C. Evangelism as Worship

Sharing the gospel is an act of worship, declaring God's worth to those who do not yet know Him.

### D. Missions as Worship

The goal of missions is worship:

> "Declare his glory among the nations, his marvelous works among all the peoples!" — Psalm 96:3 (ESV)

## VII. Practices for Daily Worship

### A. Morning and Evening Prayer

Begin and end the day with prayer, offering the day to God.

### B. Scripture Reading

Daily engagement with Scripture renews the mind.

### C. Gratitude

Cultivating thankfulness in all circumstances is worship:

> "Give thanks in all circumstances; for this is the will of God in Christ Jesus for you." — 1 Thessalonians 5:18 (ESV)

### D. Sabbath Rest

Weekly rest trusts God's provision and anticipates eternal rest.

### E. Generosity

Giving of time, money, and resources expresses worship.

### F. Hospitality

Welcoming others into our homes and lives reflects God's welcome.

## VIII. The Goal of Worship

### A. God's Glory

The ultimate goal of all worship—gathered and scattered—is God's glory.

### B. Our Joy

In glorifying God, we find our deepest joy. As the Westminster Catechism states: "Man's chief end is to glorify God, and to enjoy him forever."

### C. The World's Good

Authentic worship overflows in love and service that blesses the world.

## IX. Key Points Summary

- Worship is a whole-life response to God, not just Sunday activity
- Corporate worship shapes and sends us for daily worship
- Work, relationships, and service are contexts for worship
- Practices like prayer, Scripture, and Sabbath cultivate daily worship
- The goal is God's glory, our joy, and the world's good

## X. Scripture Memory

> "So, whether you eat or drink, or whatever you do, do all to the glory of God." — 1 Corinthians 10:31 (ESV)

---
*Licensed to Larry Fisher*`
  }
];

// Insert lessons
for (let i = 0; i < lessons.length; i++) {
  const lesson = lessons[i];
  const lessonOrder = i + 1;
  const [result] = await connection.execute(
    `INSERT INTO lessons (courseId, title, content, lessonOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [courseId, lesson.title, lesson.content, lessonOrder]
  );
  console.log(`Created lesson ${i+1}: ${lesson.title} (ID: ${result.insertId})`);
}

console.log('\nWOR101 lessons created successfully!');
await connection.end();
