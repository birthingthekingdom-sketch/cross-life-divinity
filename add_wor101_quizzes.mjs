import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get all WOR101 lessons
const [lessons] = await connection.execute(`
  SELECT id, title FROM lessons WHERE courseId = 360001 ORDER BY id
`);

console.log(`Found ${lessons.length} lessons for WOR101`);

// Quiz questions for each lesson (10 MC + 1 short answer)
const quizData = {
  "The Theology of Worship": [
    { q: "The Hebrew word 'shachah' means:", type: "multiple_choice", options: ["To sing", "To bow down or prostrate oneself", "To clap hands", "To dance"], answer: "To bow down or prostrate oneself" },
    { q: "True worship must be:", type: "multiple_choice", options: ["Only emotional", "In spirit and truth", "Only intellectual", "Only external"], answer: "In spirit and truth" },
    { q: "Worship is fundamentally:", type: "multiple_choice", options: ["Getting things from God", "A response to God's revelation", "Entertainment", "A human invention"], answer: "A response to God's revelation" },
    { q: "Christian worship is inherently:", type: "multiple_choice", options: ["Unitarian", "Trinitarian", "Dualistic", "Pantheistic"], answer: "Trinitarian" },
    { q: "According to Romans 12:1, our bodies should be presented as:", type: "multiple_choice", options: ["Dead sacrifices", "Living sacrifices", "Burnt offerings", "Grain offerings"], answer: "Living sacrifices" },
    { q: "Idolatry is:", type: "multiple_choice", options: ["Worshiping the true God", "Directing worship to anything other than God", "Using instruments in worship", "Singing hymns"], answer: "Directing worship to anything other than God" },
    { q: "Jesus' teaching on worship in John 4 emphasizes:", type: "multiple_choice", options: ["Location is most important", "Worship transcends location", "Only Jerusalem is valid", "Only Gerizim is valid"], answer: "Worship transcends location" },
    { q: "Hebrews 12:28-29 says worship should be offered with:", type: "multiple_choice", options: ["Casual indifference", "Reverence and awe", "Fear and trembling only", "Entertainment"], answer: "Reverence and awe" },
    { q: "Vain worship is worship that:", type: "multiple_choice", options: ["Uses the wrong music", "Honors God with lips while hearts are far", "Is too long", "Is too short"], answer: "Honors God with lips while hearts are far" },
    { q: "The ultimate purpose of worship is:", type: "multiple_choice", options: ["Our entertainment", "God's glory", "Social connection", "Personal therapy"], answer: "God's glory" },
    { q: "Explain what it means to worship 'in spirit and truth' according to John 4:23-24.", type: "short_answer", options: null, answer: "Worshiping in spirit means genuine, heartfelt worship enabled by the Holy Spirit. Worshiping in truth means worship according to God's revealed truth in Scripture, not human invention." }
  ],
  "Worship in the Old Testament": [
    { q: "The Hebrew word 'abad' means:", type: "multiple_choice", options: ["To sing", "To serve", "To dance", "To clap"], answer: "To serve" },
    { q: "The patriarchs worshiped by building:", type: "multiple_choice", options: ["Temples", "Altars", "Churches", "Synagogues"], answer: "Altars" },
    { q: "The tabernacle was called 'mishkan' meaning:", type: "multiple_choice", options: ["Holy place", "Dwelling place", "Meeting tent", "Sacrifice house"], answer: "Dwelling place" },
    { q: "The burnt offering (olah) signified:", type: "multiple_choice", options: ["Fellowship", "Total consecration to God", "Thanksgiving", "Guilt payment"], answer: "Total consecration to God" },
    { q: "Only the high priest could enter the Most Holy Place:", type: "multiple_choice", options: ["Daily", "Weekly", "Monthly", "Once yearly"], answer: "Once yearly" },
    { q: "The Psalms were Israel's:", type: "multiple_choice", options: ["Law code", "Hymnbook", "History book", "Prophecy collection"], answer: "Hymnbook" },
    { q: "Passover commemorated:", type: "multiple_choice", options: ["Creation", "Deliverance from Egypt", "The giving of the law", "The harvest"], answer: "Deliverance from Egypt" },
    { q: "The prophets condemned worship that was:", type: "multiple_choice", options: ["Too joyful", "Divorced from righteousness", "Too musical", "Too simple"], answer: "Divorced from righteousness" },
    { q: "Hosea 6:6 says God desires:", type: "multiple_choice", options: ["More sacrifices", "Steadfast love rather than sacrifice", "Larger temples", "More festivals"], answer: "Steadfast love rather than sacrifice" },
    { q: "The Day of Atonement (Yom Kippur) was for:", type: "multiple_choice", options: ["Harvest thanksgiving", "National atonement", "New year celebration", "Remembering the wilderness"], answer: "National atonement" },
    { q: "Describe the structure and significance of the tabernacle in Israel's worship.", type: "short_answer", options: null, answer: "The tabernacle had three areas: outer court (bronze altar, laver), Holy Place (lampstand, showbread, incense altar), and Most Holy Place (Ark). It taught that approaching God requires sacrifice, cleansing, mediation, and reverence." }
  ],
  "Worship in the New Testament": [
    { q: "Jesus declared that He would raise up the temple in three days, referring to:", type: "multiple_choice", options: ["The Jerusalem temple", "His body", "A new building", "The church"], answer: "His body" },
    { q: "John the Baptist called Jesus:", type: "multiple_choice", options: ["The Lion of Judah", "The Lamb of God", "The Good Shepherd", "The Bread of Life"], answer: "The Lamb of God" },
    { q: "According to Hebrews, Jesus is our:", type: "multiple_choice", options: ["Prophet only", "King only", "Great High Priest", "Angel"], answer: "Great High Priest" },
    { q: "The early church devoted themselves to all EXCEPT:", type: "multiple_choice", options: ["Apostles' teaching", "Fellowship", "Breaking of bread", "Temple sacrifices"], answer: "Temple sacrifices" },
    { q: "Christians gathered on the first day of the week because it was:", type: "multiple_choice", options: ["The Sabbath", "The day of resurrection", "A Roman holiday", "Convenient"], answer: "The day of resurrection" },
    { q: "The Greek word 'koinonia' means:", type: "multiple_choice", options: ["Preaching", "Fellowship", "Singing", "Sacrifice"], answer: "Fellowship" },
    { q: "Paul insists that worship should be done:", type: "multiple_choice", options: ["Chaotically", "Decently and in order", "Silently only", "Without planning"], answer: "Decently and in order" },
    { q: "In Revelation, the Lamb is worshiped by:", type: "multiple_choice", options: ["Only humans", "Myriads of angels and all creation", "Only the elders", "Only the living creatures"], answer: "Myriads of angels and all creation" },
    { q: "The Lord's Supper proclaims Christ's death until:", type: "multiple_choice", options: ["The temple is rebuilt", "He comes again", "We forget", "The church ends"], answer: "He comes again" },
    { q: "Ephesians 2:18 teaches that we have access to the Father through Christ:", type: "multiple_choice", options: ["By our own merit", "In one Spirit", "Through angels", "By works"], answer: "In one Spirit" },
    { q: "Explain how Christ fulfills Old Testament worship as temple, sacrifice, and high priest.", type: "short_answer", options: null, answer: "Christ is the true temple (God's dwelling with humanity), the once-for-all sacrifice for sin, and the great high priest who mediates between God and humanity, making the OT shadows obsolete." }
  ],
  "The Elements of Corporate Worship": [
    { q: "1 Timothy 4:13 commands devotion to the public reading of:", type: "multiple_choice", options: ["Poetry", "Scripture", "Announcements", "News"], answer: "Scripture" },
    { q: "When Scripture is read in worship, who speaks:", type: "multiple_choice", options: ["Only the reader", "God speaks to His people", "The congregation", "No one in particular"], answer: "God speaks to His people" },
    { q: "Colossians 3:16 mentions singing:", type: "multiple_choice", options: ["Only psalms", "Psalms, hymns, and spiritual songs", "Only hymns", "Only spiritual songs"], answer: "Psalms, hymns, and spiritual songs" },
    { q: "The purpose of congregational singing includes:", type: "multiple_choice", options: ["Entertainment only", "Teaching and admonishing one another", "Performance", "Competition"], answer: "Teaching and admonishing one another" },
    { q: "Baptism signifies:", type: "multiple_choice", options: ["Only cleansing", "Union with Christ in death and resurrection", "Only membership", "Only obedience"], answer: "Union with Christ in death and resurrection" },
    { q: "The Lord's Supper proclaims:", type: "multiple_choice", options: ["Our goodness", "Christ's death until He comes", "Our achievements", "The church's success"], answer: "Christ's death until He comes" },
    { q: "The benediction:", type: "multiple_choice", options: ["Starts the service", "Pronounces God's blessing as we are sent", "Replaces the sermon", "Is optional"], answer: "Pronounces God's blessing as we are sent" },
    { q: "Corporate confession acknowledges:", type: "multiple_choice", options: ["Our perfection", "Our common need for grace", "Others' sins only", "Nothing important"], answer: "Our common need for grace" },
    { q: "Giving in worship expresses:", type: "multiple_choice", options: ["Obligation only", "Gratitude, trust, and generosity", "Guilt", "Competition"], answer: "Gratitude, trust, and generosity" },
    { q: "The Reformers distinguished between elements and:", type: "multiple_choice", options: ["Sacraments", "Circumstances", "Ordinances", "Traditions"], answer: "Circumstances" },
    { q: "Explain the difference between elements and circumstances of worship according to the Reformers.", type: "short_answer", options: null, answer: "Elements are what Scripture commands for worship (reading, preaching, prayer, singing, sacraments). Circumstances are practical matters not prescribed (time, place, seating) that may vary while maintaining biblical fidelity." }
  ],
  "Music and Worship": [
    { q: "The Hebrew word 'zamar' means:", type: "multiple_choice", options: ["To dance", "To sing praise with instruments", "To clap", "To bow"], answer: "To sing praise with instruments" },
    { q: "Psalm 150 commands praise with:", type: "multiple_choice", options: ["Voice only", "Various instruments", "Silence only", "No music"], answer: "Various instruments" },
    { q: "The Reformation restored:", type: "multiple_choice", options: ["Clergy-only singing", "Congregational singing", "Instrumental-only worship", "Silent worship"], answer: "Congregational singing" },
    { q: "Worship music should be primarily:", type: "multiple_choice", options: ["Performance-oriented", "God-centered", "Self-focused", "Entertainment"], answer: "God-centered" },
    { q: "When evaluating worship songs, theological accuracy means:", type: "multiple_choice", options: ["It sounds good", "It teaches truth", "It is popular", "It is new"], answer: "It teaches truth" },
    { q: "Congregational accessibility means songs should be:", type: "multiple_choice", options: ["Only for professionals", "Singable by the congregation", "Extremely complex", "Only for soloists"], answer: "Singable by the congregation" },
    { q: "The danger of performance-oriented worship is:", type: "multiple_choice", options: ["Too much participation", "The congregation becomes an audience", "Too much Scripture", "Too much prayer"], answer: "The congregation becomes an audience" },
    { q: "A healthy church sings:", type: "multiple_choice", options: ["Only old hymns", "Only new songs", "Both historic hymns and contemporary songs", "No songs"], answer: "Both historic hymns and contemporary songs" },
    { q: "Isaac Watts wrote:", type: "multiple_choice", options: ["Amazing Grace", "When I Survey the Wondrous Cross", "A Mighty Fortress", "How Great Thou Art"], answer: "When I Survey the Wondrous Cross" },
    { q: "Instruments in worship should:", type: "multiple_choice", options: ["Overshadow singing", "Serve congregational singing", "Replace singing", "Be banned"], answer: "Serve congregational singing" },
    { q: "Describe the criteria for evaluating whether a song is appropriate for corporate worship.", type: "short_answer", options: null, answer: "Songs should be evaluated for theological accuracy, biblical content, God-centeredness, depth, singability, melodic accessibility, and whether they facilitate congregational participation rather than performance." }
  ],
  "Prayer in Worship": [
    { q: "1 Timothy 2:1 urges prayers, intercessions, and:", type: "multiple_choice", options: ["Complaints", "Thanksgivings", "Demands", "Wishes"], answer: "Thanksgivings" },
    { q: "Praying 'in Jesus' name' means:", type: "multiple_choice", options: ["A magic formula", "Praying according to His character and will", "Saying His name at the end", "Nothing special"], answer: "Praying according to His character and will" },
    { q: "The invocation:", type: "multiple_choice", options: ["Ends the service", "Calls upon God's presence at the beginning", "Replaces Scripture", "Is unnecessary"], answer: "Calls upon God's presence at the beginning" },
    { q: "Prayers of adoration praise God for:", type: "multiple_choice", options: ["What we want", "Who He is", "Our achievements", "Others' failures"], answer: "Who He is" },
    { q: "Following confession, the assurance of pardon:", type: "multiple_choice", options: ["Condemns us", "Declares God's forgiveness in Christ", "Is unnecessary", "Ignores sin"], answer: "Declares God's forgiveness in Christ" },
    { q: "Intercession is prayer:", type: "multiple_choice", options: ["For ourselves only", "For others", "Against enemies", "For material things only"], answer: "For others" },
    { q: "The Lord's Prayer provides:", type: "multiple_choice", options: ["The only acceptable prayer", "A model for all prayer", "A replacement for other prayers", "An optional addition"], answer: "A model for all prayer" },
    { q: "A collect is:", type: "multiple_choice", options: ["A long prayer", "A brief, structured prayer with five parts", "An offering", "A song"], answer: "A brief, structured prayer with five parts" },
    { q: "Corporate prayer expresses:", type: "multiple_choice", options: ["Individual isolation", "Unity and mutual dependence", "Competition", "Independence"], answer: "Unity and mutual dependence" },
    { q: "The Aaronic blessing is found in:", type: "multiple_choice", options: ["Genesis 1", "Numbers 6", "Psalm 23", "Matthew 6"], answer: "Numbers 6" },
    { q: "Explain the different types of prayer that should be included in corporate worship.", type: "short_answer", options: null, answer: "Corporate worship should include invocation (calling on God's presence), adoration (praising who God is), confession (acknowledging sin), thanksgiving (expressing gratitude), supplication (presenting needs), intercession (praying for others), and benediction (pronouncing blessing)." }
  ],
  "The Sacraments in Worship": [
    { q: "Augustine defined a sacrament as:", type: "multiple_choice", options: ["A magic ritual", "A visible sign of invisible grace", "An optional practice", "A human invention"], answer: "A visible sign of invisible grace" },
    { q: "The two sacraments recognized by most Protestants are:", type: "multiple_choice", options: ["Confirmation and marriage", "Baptism and the Lord's Supper", "Ordination and confession", "Anointing and penance"], answer: "Baptism and the Lord's Supper" },
    { q: "Romans 6:3-4 teaches that baptism signifies:", type: "multiple_choice", options: ["Only cleansing", "Union with Christ in death and resurrection", "Only obedience", "Nothing spiritual"], answer: "Union with Christ in death and resurrection" },
    { q: "The Lord's Supper is also called:", type: "multiple_choice", options: ["The Eucharist", "The Agape", "The Feast", "The Gathering"], answer: "The Eucharist" },
    { q: "1 Corinthians 11:26 says the Supper proclaims Christ's death until:", type: "multiple_choice", options: ["We forget", "He comes", "The church ends", "We are perfect"], answer: "He comes" },
    { q: "The view that bread and wine become Christ's body and blood is called:", type: "multiple_choice", options: ["Consubstantiation", "Transubstantiation", "Memorial view", "Spiritual presence"], answer: "Transubstantiation" },
    { q: "1 Corinthians 11:28 instructs participants to:", type: "multiple_choice", options: ["Eat quickly", "Examine themselves", "Ignore their condition", "Fast beforehand"], answer: "Examine themselves" },
    { q: "Sacraments are both signs and:", type: "multiple_choice", options: ["Suggestions", "Seals", "Options", "Symbols only"], answer: "Seals" },
    { q: "The early church practiced baptism:", type: "multiple_choice", options: ["Never", "From the beginning", "Only after 100 AD", "Only for adults"], answer: "From the beginning" },
    { q: "Sacraments are means of:", type: "multiple_choice", options: ["Entertainment", "Grace", "Social status", "Competition"], answer: "Grace" },
    { q: "Explain the meaning and significance of the Lord's Supper in Christian worship.", type: "short_answer", options: null, answer: "The Lord's Supper signifies remembrance of Christ's sacrifice, proclamation of His death, communion with Christ and one another, spiritual nourishment by faith, and anticipation of the marriage supper of the Lamb." }
  ],
  "The Church Calendar and Christian Seasons": [
    { q: "Advent is a season of:", type: "multiple_choice", options: ["Celebration only", "Anticipation of Christ's coming", "Fasting only", "Mourning"], answer: "Anticipation of Christ's coming" },
    { q: "The liturgical color for Lent is:", type: "multiple_choice", options: ["White", "Purple", "Red", "Green"], answer: "Purple" },
    { q: "Easter celebrates:", type: "multiple_choice", options: ["Christ's birth", "Christ's resurrection", "The Spirit's coming", "Christ's ascension"], answer: "Christ's resurrection" },
    { q: "Pentecost celebrates:", type: "multiple_choice", options: ["Christ's birth", "Christ's death", "The coming of the Holy Spirit", "Christ's return"], answer: "The coming of the Holy Spirit" },
    { q: "Lent lasts for:", type: "multiple_choice", options: ["7 days", "40 days", "50 days", "12 days"], answer: "40 days" },
    { q: "Holy Week begins with:", type: "multiple_choice", options: ["Easter Sunday", "Palm Sunday", "Good Friday", "Ash Wednesday"], answer: "Palm Sunday" },
    { q: "The liturgical color for Ordinary Time is:", type: "multiple_choice", options: ["Purple", "White", "Green", "Red"], answer: "Green" },
    { q: "Christmas season lasts:", type: "multiple_choice", options: ["1 day", "12 days", "40 days", "7 days"], answer: "12 days" },
    { q: "The church calendar sanctifies:", type: "multiple_choice", options: ["Only Sundays", "Time itself", "Only holidays", "Nothing"], answer: "Time itself" },
    { q: "Following the church calendar connects us with:", type: "multiple_choice", options: ["Only our local church", "Christians across time and space", "Only ancient Christians", "Only modern Christians"], answer: "Christians across time and space" },
    { q: "Describe the theological rationale for following the church calendar.", type: "short_answer", options: null, answer: "The church calendar rehearses the gospel story year after year, sanctifies time by marking it with salvation events, unites us with Christians across time and space, and ensures balanced teaching of the whole counsel of God." }
  ],
  "Leading and Planning Worship": [
    { q: "The worship leader is primarily a:", type: "multiple_choice", options: ["Performer", "Servant", "Celebrity", "Entertainer"], answer: "Servant" },
    { q: "Gospel-centered worship structure begins with:", type: "multiple_choice", options: ["The sermon", "God's call to worship", "The offering", "Announcements"], answer: "God's call to worship" },
    { q: "Worship is a dialogue between:", type: "multiple_choice", options: ["Musicians and congregation", "God and His people", "Pastor and elders", "Choir and band"], answer: "God and His people" },
    { q: "When selecting songs, leaders should consider:", type: "multiple_choice", options: ["Only personal preference", "Theological content and singability", "Only what's popular", "Only what's new"], answer: "Theological content and singability" },
    { q: "Transitions between worship elements should be:", type: "multiple_choice", options: ["Awkward and jarring", "Smooth and connecting", "Eliminated entirely", "As long as possible"], answer: "Smooth and connecting" },
    { q: "1 Corinthians 14:26 says all things should be done for:", type: "multiple_choice", options: ["Entertainment", "Building up", "Performance", "Competition"], answer: "Building up" },
    { q: "Worship leaders should arrive:", type: "multiple_choice", options: ["Just in time", "Early to prepare", "Late to make an entrance", "Whenever convenient"], answer: "Early to prepare" },
    { q: "Verbal leadership should:", type: "multiple_choice", options: ["Draw attention to the leader", "Point to God", "Be lengthy", "Use clichés"], answer: "Point to God" },
    { q: "Multigenerational worship should:", type: "multiple_choice", options: ["Focus only on youth", "Include elements that engage all ages", "Focus only on elderly", "Ignore differences"], answer: "Include elements that engage all ages" },
    { q: "Technology in worship should:", type: "multiple_choice", options: ["Be the focus", "Serve worship, not distract", "Replace all tradition", "Be avoided entirely"], answer: "Serve worship, not distract" },
    { q: "Describe the qualities and responsibilities of an effective worship leader.", type: "short_answer", options: null, answer: "Effective worship leaders are genuine worshipers, spiritually mature, humble, doctrinally sound, and skilled in music and/or public speaking. They serve God and the congregation, facilitate participation, prepare thoroughly, and point to God rather than themselves." }
  ],
  "Worship and the Christian Life": [
    { q: "Romans 12:1 calls believers to present their bodies as:", type: "multiple_choice", options: ["Dead sacrifices", "Living sacrifices", "Burnt offerings", "Sin offerings"], answer: "Living sacrifices" },
    { q: "1 Corinthians 10:31 says whatever we do should be done:", type: "multiple_choice", options: ["For our glory", "To the glory of God", "For entertainment", "For profit"], answer: "To the glory of God" },
    { q: "1 Peter 2:5 calls believers a:", type: "multiple_choice", options: ["Holy nation only", "Holy priesthood", "Chosen race only", "Royal family only"], answer: "Holy priesthood" },
    { q: "Work can be worship when done:", type: "multiple_choice", options: ["Carelessly", "As for the Lord", "Only in church", "For personal glory only"], answer: "As for the Lord" },
    { q: "Colossians 3:23 says to work heartily as to:", type: "multiple_choice", options: ["Men", "The Lord", "Ourselves", "Our employers only"], answer: "The Lord" },
    { q: "Serving 'the least of these' is serving:", type: "multiple_choice", options: ["No one important", "Christ Himself", "Only the poor", "Only strangers"], answer: "Christ Himself" },
    { q: "Micah 6:8 says the Lord requires us to:", type: "multiple_choice", options: ["Offer more sacrifices", "Do justice, love kindness, walk humbly", "Build bigger temples", "Fast more often"], answer: "Do justice, love kindness, walk humbly" },
    { q: "The goal of missions is:", type: "multiple_choice", options: ["Cultural imperialism", "Worship among all nations", "Political power", "Economic benefit"], answer: "Worship among all nations" },
    { q: "1 Thessalonians 5:18 commands:", type: "multiple_choice", options: ["Complaining", "Giving thanks in all circumstances", "Worry", "Anxiety"], answer: "Giving thanks in all circumstances" },
    { q: "The Westminster Catechism says man's chief end is to:", type: "multiple_choice", options: ["Be happy", "Glorify God and enjoy Him forever", "Accumulate wealth", "Achieve success"], answer: "Glorify God and enjoy Him forever" },
    { q: "Explain how Sunday worship shapes and sends Christians for worship in daily life.", type: "short_answer", options: null, answer: "Sunday worship forms us through confession (teaching humility), assurance (reminding us of grace), Scripture (renewing minds), prayer (cultivating dependence), communion (nourishing faith), and benediction (sending with blessing). This equips us to worship through work, relationships, and service throughout the week." }
  ]
};

let totalQuizzes = 0;

for (const lesson of lessons) {
  const questions = quizData[lesson.title];
  if (!questions) {
    console.log(`No quiz data found for: ${lesson.title}`);
    continue;
  }
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await connection.execute(
      `INSERT INTO quiz_questions (lessonId, question, questionType, options, correctAnswer, questionOrder, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        lesson.id,
        q.q,
        q.type,
        q.options ? JSON.stringify(q.options) : null,
        q.answer,
        i + 1
      ]
    );
    totalQuizzes++;
  }
  console.log(`Added ${questions.length} quizzes for: ${lesson.title}`);
}

console.log(`\nTotal quizzes created: ${totalQuizzes}`);
await connection.end();
