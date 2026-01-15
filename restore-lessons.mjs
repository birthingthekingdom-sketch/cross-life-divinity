import mysql from 'mysql2/promise';

// Parse DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
const urlObj = new URL(dbUrl);

// Extract SSL config from URL if present
let sslConfig = false;
const sslMatch = dbUrl.match(/ssl=({.*})/);
if (sslMatch) {
  try {
    sslConfig = JSON.parse(sslMatch[1]);
  } catch (e) {
    sslConfig = true;
  }
}

const pool = mysql.createPool({
  host: urlObj.hostname,
  user: urlObj.username,
  password: urlObj.password,
  database: urlObj.pathname.slice(1),
  port: parseInt(urlObj.port) || 3306,
  ssl: sslConfig || { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// Comprehensive lesson data for all courses
const LESSONS_DATA = {
  780001: { // Old Testament Survey (BIB101)
    title: 'Old Testament Survey',
    lessons: [
      { order: 1, title: 'Introduction to the Old Testament', content: 'Overview of the Old Testament books, structure, and major themes.' },
      { order: 2, title: 'The Torah: Books of Moses', content: 'Study of Genesis, Exodus, Leviticus, Numbers, and Deuteronomy.' },
      { order: 3, title: 'The Historical Books', content: 'Joshua, Judges, Ruth, 1-2 Samuel, 1-2 Kings, 1-2 Chronicles.' },
      { order: 4, title: 'Poetry and Wisdom Literature', content: 'Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon.' },
      { order: 5, title: 'Major Prophets: Isaiah', content: 'Study of Isaiah and its major themes of judgment and restoration.' },
      { order: 6, title: 'Major Prophets: Jeremiah and Lamentations', content: 'Jeremiah\'s prophetic ministry and the book of Lamentations.' },
      { order: 7, title: 'Major Prophets: Ezekiel and Daniel', content: 'Visions of Ezekiel and prophecies of Daniel.' },
      { order: 8, title: 'Minor Prophets Part 1', content: 'Hosea, Joel, Amos, Obadiah, Jonah, Micah.' },
      { order: 9, title: 'Minor Prophets Part 2', content: 'Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi.' },
      { order: 10, title: 'Old Testament Themes and Fulfillment', content: 'Messianic themes and fulfillment in the New Testament.' },
    ]
  },
  780002: { // New Testament Survey (BIB102)
    title: 'New Testament Survey',
    lessons: [
      { order: 1, title: 'Introduction to the New Testament', content: 'Overview of the New Testament books and historical context.' },
      { order: 2, title: 'The Gospels: Matthew and Mark', content: 'Study of Matthew and Mark\'s accounts of Jesus\' life and ministry.' },
      { order: 3, title: 'The Gospels: Luke and John', content: 'Study of Luke and John\'s unique perspectives on Jesus.' },
      { order: 4, title: 'Acts: The Early Church', content: 'The birth and growth of the early church in Jerusalem and beyond.' },
      { order: 5, title: 'Paul\'s Epistles: Romans and Corinthians', content: 'Study of Romans, 1 Corinthians, and 2 Corinthians.' },
      { order: 6, title: 'Paul\'s Epistles: Galatians through Colossians', content: 'Galatians, Ephesians, Philippians, Colossians.' },
      { order: 7, title: 'Paul\'s Epistles: Thessalonians and Pastoral Epistles', content: '1-2 Thessalonians, 1-2 Timothy, Titus, Philemon.' },
      { order: 8, title: 'Hebrews and James', content: 'The book of Hebrews and James\' practical theology.' },
      { order: 9, title: '1 Peter through 3 John', content: 'Study of 1 Peter, 2 Peter, 1-3 John.' },
      { order: 10, title: 'Jude and Revelation', content: 'Jude\'s warning and John\'s apocalyptic vision in Revelation.' },
    ]
  },
  780003: { // Systematic Theology (THE201)
    title: 'Systematic Theology',
    lessons: [
      { order: 1, title: 'Introduction to Systematic Theology', content: 'Definition, purpose, and methodology of systematic theology.' },
      { order: 2, title: 'Theology Proper: The Doctrine of God', content: 'Study of God\'s existence, attributes, and nature.' },
      { order: 3, title: 'Christology: The Doctrine of Christ', content: 'The person and work of Jesus Christ.' },
      { order: 4, title: 'Pneumatology: The Doctrine of the Holy Spirit', content: 'The person and work of the Holy Spirit.' },
      { order: 5, title: 'Anthropology and Hamartiology', content: 'The doctrine of humanity and sin.' },
      { order: 6, title: 'Soteriology: The Doctrine of Salvation', content: 'The plan and process of salvation.' },
      { order: 7, title: 'Ecclesiology: The Doctrine of the Church', content: 'The nature, purpose, and organization of the church.' },
      { order: 8, title: 'Eschatology: The Doctrine of Last Things', content: 'Study of end times, resurrection, and judgment.' },
      { order: 9, title: 'Theological Integration and Application', content: 'How systematic theology informs Christian practice.' },
      { order: 10, title: 'Contemporary Theological Issues', content: 'Application of theology to modern challenges.' },
    ]
  },
  780004: { // Biblical Hermeneutics (BIB201)
    title: 'Biblical Hermeneutics',
    lessons: [
      { order: 1, title: 'Introduction to Biblical Interpretation', content: 'History and principles of biblical hermeneutics.' },
      { order: 2, title: 'Grammatical-Historical Method', content: 'Understanding grammar, history, and cultural context.' },
      { order: 3, title: 'Literary Genre Analysis', content: 'Interpreting narrative, poetry, prophecy, and wisdom literature.' },
      { order: 4, title: 'Cultural and Historical Background', content: 'Understanding ancient Near Eastern culture and history.' },
      { order: 5, title: 'Word Studies and Exegesis', content: 'Detailed word analysis and exegetical methods.' },
      { order: 6, title: 'Typology and Symbolism', content: 'Understanding types, symbols, and figurative language.' },
      { order: 7, title: 'Theological Interpretation', content: 'Connecting individual passages to biblical theology.' },
      { order: 8, title: 'Application and Homiletics', content: 'Moving from interpretation to preaching and teaching.' },
      { order: 9, title: 'Common Interpretive Errors', content: 'Avoiding eisegesis and other hermeneutical mistakes.' },
      { order: 10, title: 'Practical Exegesis Workshop', content: 'Applying hermeneutical principles to biblical texts.' },
    ]
  },
  780005: { // Fundamentals of Apologetics (THE301)
    title: 'Fundamentals of Apologetics',
    lessons: [
      { order: 1, title: 'Introduction to Christian Apologetics', content: 'Definition, purpose, and methods of apologetics.' },
      { order: 2, title: 'Classical Arguments for God\'s Existence', content: 'Cosmological, teleological, and ontological arguments.' },
      { order: 3, title: 'The Problem of Evil and Suffering', content: 'Addressing theodicy and the nature of evil.' },
      { order: 4, title: 'The Reliability of Scripture', content: 'Manuscript evidence and historical reliability of the Bible.' },
      { order: 5, title: 'The Historical Jesus and Resurrection', content: 'Evidence for the life, death, and resurrection of Jesus.' },
      { order: 6, title: 'Responding to Atheism and Skepticism', content: 'Addressing common objections from atheists and skeptics.' },
      { order: 7, title: 'Comparative Religions and Worldviews', content: 'Understanding and responding to other faith systems.' },
      { order: 8, title: 'Science and Faith', content: 'Reconciling Christian faith with scientific discovery.' },
      { order: 9, title: 'Moral and Existential Arguments', content: 'Moral argument for God and existential questions.' },
      { order: 10, title: 'Gracious Dialogue and Persuasion', content: 'Engaging critics with gentleness and respect.' },
    ]
  },
  780006: { // Understanding Prophecy (DIV101)
    title: 'Understanding Prophecy',
    lessons: [
      { order: 1, title: 'Introduction to Prophecy', content: 'Definition and biblical foundation of the prophetic gift.' },
      { order: 2, title: 'Old Testament Prophets', content: 'Study of major and minor prophets in the Old Testament.' },
      { order: 3, title: 'New Testament Prophecy', content: 'Prophecy in the New Testament and early church.' },
      { order: 4, title: 'The Gift of Prophecy Today', content: 'How the prophetic gift operates in modern churches.' },
      { order: 5, title: 'Testing Prophetic Words', content: 'Biblical criteria for evaluating prophecy.' },
      { order: 6, title: 'Prophetic Intercession', content: 'The role of intercession in prophetic ministry.' },
      { order: 7, title: 'Dreams and Visions', content: 'Understanding divine communication through dreams and visions.' },
      { order: 8, title: 'Prophetic Warnings and Correction', content: 'The role of prophecy in church discipline and guidance.' },
      { order: 9, title: 'Prophetic Words and Fulfillment', content: 'How prophetic words come to pass and their timing.' },
      { order: 10, title: 'Developing Your Prophetic Gift', content: 'Practical steps for growing in prophetic ministry.' },
    ]
  },
  780007: { // Deliverance Ministry (DIV102)
    title: 'Deliverance Ministry',
    lessons: [
      { order: 1, title: 'Introduction to Deliverance Ministry', content: 'Biblical foundation and purpose of deliverance ministry.' },
      { order: 2, title: 'Understanding Spiritual Bondage', content: 'Types of bondage and how they develop.' },
      { order: 3, title: 'Demonic Oppression vs. Possession', content: 'Distinguishing between oppression and possession.' },
      { order: 4, title: 'The Authority of the Believer', content: 'Understanding your authority in Christ for deliverance.' },
      { order: 5, title: 'The Deliverance Process', content: 'Steps in conducting a deliverance session.' },
      { order: 6, title: 'Generational Curses and Bondage', content: 'Understanding and breaking generational patterns.' },
      { order: 7, title: 'Maintaining Freedom', content: 'Post-deliverance discipleship and spiritual protection.' },
      { order: 8, title: 'Common Obstacles in Deliverance', content: 'Addressing resistance and complications.' },
      { order: 9, title: 'Pastoral Care in Deliverance', content: 'Compassionate ministry to those in bondage.' },
      { order: 10, title: 'Deliverance and Inner Healing', content: 'Integration of deliverance with inner healing prayer.' },
    ]
  },
  780008: { // Evangelism and Discipleship (MIN101)
    title: 'Evangelism and Discipleship',
    lessons: [
      { order: 1, title: 'The Great Commission', content: 'Understanding Jesus\' command to make disciples.' },
      { order: 2, title: 'Gospel Presentation Methods', content: 'Various approaches to sharing the gospel.' },
      { order: 3, title: 'Personal Evangelism', content: 'One-on-one witnessing and relationship evangelism.' },
      { order: 4, title: 'Mass Evangelism and Crusades', content: 'Large-scale evangelistic events and strategies.' },
      { order: 5, title: 'The Discipleship Process', content: 'Steps in spiritual formation and growth.' },
      { order: 6, title: 'Mentoring and Spiritual Direction', content: 'One-on-one discipleship relationships.' },
      { order: 7, title: 'Small Group Discipleship', content: 'Group-based discipleship and accountability.' },
      { order: 8, title: 'Multiplication and Reproduction', content: 'Training disciples to make disciples.' },
      { order: 9, title: 'Addressing Common Objections', content: 'Responding to questions about faith.' },
      { order: 10, title: 'Sustaining Spiritual Growth', content: 'Long-term strategies for discipleship.' },
    ]
  },
  780009: { // Discipleship Training (MIN102)
    title: 'Discipleship Training',
    lessons: [
      { order: 1, title: 'Foundation of Discipleship', content: 'Biblical models and principles of discipleship.' },
      { order: 2, title: 'Character Development', content: 'Spiritual formation and character transformation.' },
      { order: 3, title: 'Spiritual Disciplines', content: 'Prayer, fasting, meditation, and study.' },
      { order: 4, title: 'Accountability and Community', content: 'The role of community in spiritual growth.' },
      { order: 5, title: 'Overcoming Obstacles to Growth', content: 'Addressing spiritual struggles and setbacks.' },
      { order: 6, title: 'Doctrinal Foundations', content: 'Essential Christian doctrines for disciples.' },
      { order: 7, title: 'Servant Leadership', content: 'Leading through service and humility.' },
      { order: 8, title: 'Witness and Testimony', content: 'Sharing your faith story effectively.' },
      { order: 9, title: 'Missional Living', content: 'Living with purpose and kingdom focus.' },
      { order: 10, title: 'Reproducing Disciples', content: 'Training others to become disciple-makers.' },
    ]
  },
  780010: { // Prayer and Intercession (SPR101)
    title: 'Prayer and Intercession',
    lessons: [
      { order: 1, title: 'Foundations of Prayer', content: 'Biblical basis and theology of prayer.' },
      { order: 2, title: 'Types of Prayer', content: 'Adoration, confession, thanksgiving, supplication, intercession.' },
      { order: 3, title: 'The Lord\'s Prayer', content: 'Understanding and praying the model prayer.' },
      { order: 4, title: 'Intercessory Prayer', content: 'Praying for others and standing in the gap.' },
      { order: 5, title: 'Spiritual Warfare Prayer', content: 'Prayer as a weapon against spiritual forces.' },
      { order: 6, title: 'Corporate Prayer and Worship', content: 'Prayer in community and corporate worship.' },
      { order: 7, title: 'Fasting and Prayer', content: 'Combining fasting with prayer for spiritual breakthrough.' },
      { order: 8, title: 'Praying Scripture', content: 'Using the Bible in prayer and meditation.' },
      { order: 9, title: 'Answered Prayer and Faith', content: 'Understanding God\'s answers and building faith.' },
      { order: 10, title: 'Prayer Movements and Revivals', content: 'Historical prayer movements and their impact.' },
    ]
  },
  780011: { // Christian Leadership (LED201)
    title: 'Christian Leadership',
    lessons: [
      { order: 1, title: 'Biblical Leadership Principles', content: 'Leadership models from Scripture.' },
      { order: 2, title: 'Servant Leadership', content: 'Jesus\' model of leadership through service.' },
      { order: 3, title: 'Vision and Direction', content: 'Casting vision and providing direction.' },
      { order: 4, title: 'Team Building and Delegation', content: 'Developing teams and empowering others.' },
      { order: 5, title: 'Decision Making and Wisdom', content: 'Making wise decisions in ministry.' },
      { order: 6, title: 'Conflict Resolution', content: 'Handling conflict with grace and wisdom.' },
      { order: 7, title: 'Mentoring and Development', content: 'Investing in the growth of others.' },
      { order: 8, title: 'Leadership Ethics and Integrity', content: 'Maintaining integrity in leadership.' },
      { order: 9, title: 'Organizational Leadership', content: 'Leading churches and Christian organizations.' },
      { order: 10, title: 'Personal Leadership Development', content: 'Continuing growth as a leader.' },
    ]
  },
  780012: { // Pastoral Counseling (PAS201)
    title: 'Pastoral Counseling',
    lessons: [
      { order: 1, title: 'Foundations of Pastoral Care', content: 'Biblical basis for pastoral counseling.' },
      { order: 2, title: 'Listening and Empathy', content: 'Active listening and empathetic presence.' },
      { order: 3, title: 'Grief and Loss', content: 'Pastoral care for those experiencing grief.' },
      { order: 4, title: 'Crisis Counseling', content: 'Responding to crises and emergencies.' },
      { order: 5, title: 'Marriage and Family Issues', content: 'Counseling couples and families.' },
      { order: 6, title: 'Mental Health and Illness', content: 'Understanding mental health in pastoral context.' },
      { order: 7, title: 'Addiction and Recovery', content: 'Pastoral care for those struggling with addiction.' },
      { order: 8, title: 'Abuse and Trauma', content: 'Caring for victims of abuse and trauma.' },
      { order: 9, title: 'Spiritual Direction', content: 'Guiding spiritual growth and discernment.' },
      { order: 10, title: 'Self-Care and Burnout Prevention', content: 'Maintaining pastoral health and wellness.' },
    ]
  },
  780013: { // Church Administration (PAS301)
    title: 'Church Administration',
    lessons: [
      { order: 1, title: 'Church Organization and Structure', content: 'Organizing church leadership and governance.' },
      { order: 2, title: 'Financial Management', content: 'Church budgeting and financial stewardship.' },
      { order: 3, title: 'Facilities and Property Management', content: 'Managing church buildings and grounds.' },
      { order: 4, title: 'Human Resources and Staffing', content: 'Hiring, training, and managing church staff.' },
      { order: 5, title: 'Volunteer Coordination', content: 'Recruiting and managing volunteers.' },
      { order: 6, title: 'Communication and Marketing', content: 'Internal and external church communication.' },
      { order: 7, title: 'Legal and Compliance Issues', content: 'Church law and regulatory compliance.' },
      { order: 8, title: 'Technology and Systems', content: 'Church management systems and technology.' },
      { order: 9, title: 'Event Planning and Coordination', content: 'Planning church events and programs.' },
      { order: 10, title: 'Strategic Planning', content: 'Long-term planning and growth strategies.' },
    ]
  },
  780014: { // Homiletics (PAS101)
    title: 'Homiletics',
    lessons: [
      { order: 1, title: 'Introduction to Preaching', content: 'Biblical foundation and purpose of preaching.' },
      { order: 2, title: 'Sermon Preparation', content: 'Steps in developing a sermon.' },
      { order: 3, title: 'Exegesis for Preaching', content: 'Studying the text for preaching.' },
      { order: 4, title: 'Sermon Structure and Organization', content: 'Organizing sermons for clarity and impact.' },
      { order: 5, title: 'Illustrations and Examples', content: 'Using stories and illustrations effectively.' },
      { order: 6, title: 'Delivery and Presentation', content: 'Preaching with power and presence.' },
      { order: 7, title: 'Different Preaching Styles', content: 'Topical, expository, and narrative preaching.' },
      { order: 8, title: 'Preaching to Different Audiences', content: 'Adapting messages for different groups.' },
      { order: 9, title: 'Prophetic and Pastoral Preaching', content: 'Balancing prophetic challenge with pastoral care.' },
      { order: 10, title: 'Continuing Development as a Preacher', content: 'Growing in preaching excellence.' },
    ]
  },
  780015: { // Discovering Spiritual Gifts (SPR201)
    title: 'Discovering Spiritual Gifts',
    lessons: [
      { order: 1, title: 'Introduction to Spiritual Gifts', content: 'Biblical foundation of spiritual gifts.' },
      { order: 2, title: 'The Gift of Prophecy', content: 'Understanding and using the prophetic gift.' },
      { order: 3, title: 'The Gift of Teaching', content: 'Developing teaching gifts and abilities.' },
      { order: 4, title: 'The Gift of Encouragement', content: 'Using exhortation to build others up.' },
      { order: 5, title: 'The Gift of Service', content: 'Serving others with your gifts.' },
      { order: 6, title: 'The Gift of Giving', content: 'Generous giving and stewardship.' },
      { order: 7, title: 'The Gift of Leadership', content: 'Leading with vision and purpose.' },
      { order: 8, title: 'The Gift of Mercy', content: 'Compassionate ministry to the hurting.' },
      { order: 9, title: 'Discovering Your Gifts', content: 'Identifying your spiritual gifts.' },
      { order: 10, title: 'Using Your Gifts in Ministry', content: 'Deploying gifts for kingdom impact.' },
    ]
  },
  780016: { // The Fivefold Ministry (MIN201)
    title: 'The Fivefold Ministry',
    lessons: [
      { order: 1, title: 'Introduction to Fivefold Ministry', content: 'Overview of apostles, prophets, evangelists, pastors, teachers.' },
      { order: 2, title: 'The Apostolic Office', content: 'Role and function of apostles in the church.' },
      { order: 3, title: 'The Prophetic Office', content: 'Role and function of prophets in the church.' },
      { order: 4, title: 'The Evangelistic Office', content: 'Role and function of evangelists in the church.' },
      { order: 5, title: 'The Pastoral Office', content: 'Role and function of pastors in the church.' },
      { order: 6, title: 'The Teaching Office', content: 'Role and function of teachers in the church.' },
      { order: 7, title: 'Integration of Fivefold Gifts', content: 'How fivefold offices work together.' },
      { order: 8, title: 'Fivefold Ministry in Church Growth', content: 'Impact of fivefold ministry on church health.' },
      { order: 9, title: 'Developing Fivefold Leaders', content: 'Training and mentoring fivefold leaders.' },
      { order: 10, title: 'Fivefold Ministry Today', content: 'Contemporary application of fivefold ministry.' },
    ]
  },
  780017: { // Spiritual Warfare (SPR301)
    title: 'Spiritual Warfare',
    lessons: [
      { order: 1, title: 'Introduction to Spiritual Warfare', content: 'Understanding the reality of spiritual conflict.' },
      { order: 2, title: 'The Nature of Our Enemy', content: 'Understanding Satan and demonic forces.' },
      { order: 3, title: 'The Armor of God', content: 'Ephesians 6 and spiritual protection.' },
      { order: 4, title: 'Prayer and Intercession in Warfare', content: 'Using prayer as a weapon.' },
      { order: 5, title: 'Binding and Loosing', content: 'Understanding authority in spiritual warfare.' },
      { order: 6, title: 'Territorial Intercession', content: 'Praying for cities and regions.' },
      { order: 7, title: 'Spiritual Strongholds', content: 'Identifying and breaking strongholds.' },
      { order: 8, title: 'Deliverance and Freedom', content: 'Ministering freedom to the oppressed.' },
      { order: 9, title: 'Discernment in Warfare', content: 'Developing spiritual discernment.' },
      { order: 10, title: 'Victory in Christ', content: 'Living in the victory Christ has won.' },
    ]
  },
  780018: { // Prophetic Intercession (SPR302)
    title: 'Prophetic Intercession',
    lessons: [
      { order: 1, title: 'Introduction to Prophetic Intercession', content: 'Combining prophecy and intercession.' },
      { order: 2, title: 'Hearing God\'s Heart', content: 'Listening for God\'s burden for prayer.' },
      { order: 3, title: 'Praying God\'s Word', content: 'Using Scripture in prophetic prayer.' },
      { order: 4, title: 'Corporate Prophetic Prayer', content: 'Group intercession with prophetic elements.' },
      { order: 5, title: 'Prophetic Decrees', content: 'Speaking God\'s word into situations.' },
      { order: 6, title: 'Intercession for Nations', content: 'Praying for governmental leaders and nations.' },
      { order: 7, title: 'Intercession for the Church', content: 'Praying for church growth and health.' },
      { order: 8, title: 'Prophetic Fasting', content: 'Combining fasting with prophetic intercession.' },
      { order: 9, title: 'Prophetic Worship', content: 'Worship as a form of intercession.' },
      { order: 10, title: 'Seeing Results in Prayer', content: 'Recognizing answers to prophetic prayer.' },
    ]
  },
  780019: { // Advanced Biblical Studies (BIB301)
    title: 'Advanced Biblical Studies',
    lessons: [
      { order: 1, title: 'Advanced Exegetical Methods', content: 'Deep study techniques for biblical texts.' },
      { order: 2, title: 'Textual Criticism', content: 'Understanding manuscript variations.' },
      { order: 3, title: 'Biblical Theology', content: 'Tracing theological themes through Scripture.' },
      { order: 4, title: 'Covenant Theology', content: 'Understanding God\'s covenants with humanity.' },
      { order: 5, title: 'Dispensationalism and Continuity', content: 'Different approaches to biblical interpretation.' },
      { order: 6, title: 'Typology and Symbolism', content: 'Advanced study of types and symbols.' },
      { order: 7, title: 'Messianic Prophecy', content: 'Tracing Jesus in Old Testament prophecy.' },
      { order: 8, title: 'Eschatological Themes', content: 'Advanced study of end times.' },
      { order: 9, title: 'Biblical Ethics', content: 'Ethical principles from Scripture.' },
      { order: 10, title: 'Capstone Project', content: 'Comprehensive biblical research project.' },
    ]
  },
  780020: { // Chaplaincy Training (CHAP101)
    title: 'Chaplaincy Training',
    lessons: [
      { order: 1, title: 'Introduction to Chaplaincy Ministry', content: 'History and role of chaplains in institutional settings.' },
      { order: 2, title: 'Clinical Pastoral Education (CPE)', content: 'Supervised clinical training in pastoral care.' },
      { order: 3, title: 'Chaplaincy in Healthcare Settings', content: 'Hospital and hospice chaplaincy.' },
      { order: 4, title: 'Chaplaincy in Military Settings', content: 'Military chaplaincy and service.' },
      { order: 5, title: 'Chaplaincy in Correctional Facilities', content: 'Prison and jail chaplaincy.' },
      { order: 6, title: 'Chaplaincy in Corporate Settings', content: 'Corporate and workplace chaplaincy.' },
      { order: 7, title: 'Crisis Intervention and Trauma Care', content: 'Responding to crises in institutional settings.' },
      { order: 8, title: 'Interfaith Chaplaincy', content: 'Working with people of different faiths.' },
      { order: 9, title: 'Chaplaincy Ethics and Boundaries', content: 'Professional ethics in chaplaincy.' },
      { order: 10, title: 'Chaplaincy Certification and Advancement', content: 'Professional development and certification.' },
    ]
  },
};

// GED courses
const GED_LESSONS = {
  780021: { // GED Mathematics (GED-MATH)
    title: 'GED Mathematics',
    lessons: [
      { order: 1, title: 'Number Sense and Operations', content: 'Whole numbers, decimals, fractions, and percentages.' },
      { order: 2, title: 'Ratios and Proportions', content: 'Understanding and solving ratio and proportion problems.' },
      { order: 3, title: 'Algebra Basics', content: 'Variables, expressions, and simple equations.' },
      { order: 4, title: 'Linear Equations and Graphing', content: 'Solving and graphing linear equations.' },
      { order: 5, title: 'Systems of Equations', content: 'Solving systems of linear equations.' },
      { order: 6, title: 'Quadratic Equations', content: 'Solving quadratic equations and applications.' },
      { order: 7, title: 'Geometry and Measurement', content: 'Shapes, area, volume, and measurement.' },
      { order: 8, title: 'Data Analysis and Statistics', content: 'Mean, median, mode, and probability.' },
      { order: 9, title: 'Functions and Patterns', content: 'Understanding functions and patterns.' },
      { order: 10, title: 'Problem Solving and Applications', content: 'Real-world math applications.' },
      { order: 11, title: 'Practice Test 1', content: 'Full-length practice test with explanations.' },
      { order: 12, title: 'Practice Test 2', content: 'Full-length practice test with explanations.' },
    ]
  },
  780022: { // GED Language Arts (GED-LANG)
    title: 'GED Language Arts',
    lessons: [
      { order: 1, title: 'Reading Comprehension', content: 'Understanding main ideas and details in texts.' },
      { order: 2, title: 'Vocabulary and Word Meaning', content: 'Building vocabulary and understanding context.' },
      { order: 3, title: 'Grammar and Sentence Structure', content: 'Nouns, verbs, adjectives, and sentence construction.' },
      { order: 4, title: 'Punctuation and Mechanics', content: 'Commas, periods, apostrophes, and capitalization.' },
      { order: 5, title: 'Writing Process', content: 'Planning, drafting, revising, and editing.' },
      { order: 6, title: 'Essay Writing', content: 'Writing effective essays with thesis and support.' },
      { order: 7, title: 'Persuasive Writing', content: 'Developing persuasive arguments and evidence.' },
      { order: 8, title: 'Literature and Fiction', content: 'Understanding plot, character, and theme.' },
      { order: 9, title: 'Non-Fiction and Informational Text', content: 'Analyzing informational and expository text.' },
      { order: 10, title: 'Speaking and Listening', content: 'Effective communication and listening skills.' },
      { order: 11, title: 'Practice Test 1', content: 'Full-length practice test with explanations.' },
      { order: 12, title: 'Practice Test 2', content: 'Full-length practice test with explanations.' },
    ]
  },
  780023: { // GED Science (GED-SCI)
    title: 'GED Science',
    lessons: [
      { order: 1, title: 'Life Science Basics', content: 'Cells, genetics, and evolution.' },
      { order: 2, title: 'Human Body and Health', content: 'Body systems and health concepts.' },
      { order: 3, title: 'Ecology and Environment', content: 'Ecosystems, food chains, and environmental issues.' },
      { order: 4, title: 'Physical Science Basics', content: 'Matter, energy, and forces.' },
      { order: 5, title: 'Waves and Sound', content: 'Properties of waves and sound.' },
      { order: 6, title: 'Light and Electricity', content: 'Light properties and electrical concepts.' },
      { order: 7, title: 'Earth Science', content: 'Rocks, minerals, weather, and space.' },
      { order: 8, title: 'Chemistry Fundamentals', content: 'Elements, compounds, and chemical reactions.' },
      { order: 9, title: 'Scientific Method and Analysis', content: 'Experimental design and data interpretation.' },
      { order: 10, title: 'Practice Test 1', content: 'Full-length practice test with explanations.' },
    ]
  },
  780024: { // GED Social Studies (GED-SOCIAL)
    title: 'GED Social Studies',
    lessons: [
      { order: 1, title: 'World History', content: 'Ancient civilizations through modern times.' },
      { order: 2, title: 'U.S. History', content: 'American history from colonial times to present.' },
      { order: 3, title: 'Civics and Government', content: 'U.S. government structure and function.' },
      { order: 4, title: 'Economics', content: 'Supply and demand, markets, and economic systems.' },
      { order: 5, title: 'Geography', content: 'Maps, regions, and geographic concepts.' },
      { order: 6, title: 'Social and Cultural Studies', content: 'Culture, society, and social issues.' },
      { order: 7, title: 'Political Systems and Rights', content: 'Government types and human rights.' },
      { order: 8, title: 'Global Issues', content: 'International relations and global challenges.' },
      { order: 9, title: 'Document Analysis', content: 'Analyzing historical and political documents.' },
      { order: 10, title: 'Practice Test 1', content: 'Full-length practice test with explanations.' },
    ]
  },
};

async function restoreLessons() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting lesson restoration...');
    
    // Combine all lessons data
    const allLessons = { ...LESSONS_DATA, ...GED_LESSONS };
    
    let totalInserted = 0;
    
    for (const [courseId, courseData] of Object.entries(allLessons)) {
      console.log(`\nRestoring lessons for course ${courseId} (${courseData.title})...`);
      
      for (const lesson of courseData.lessons) {
        await connection.execute(
          'INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)',
          [parseInt(courseId), lesson.title, lesson.content, lesson.order]
        );
        totalInserted++;
      }
      
      console.log(`✓ Inserted ${courseData.lessons.length} lessons for ${courseData.title}`);
    }
    
    console.log(`\n✅ Restoration complete! Total lessons inserted: ${totalInserted}`);
    
  } catch (error) {
    console.error('Error during restoration:', error);
    throw error;
  } finally {
    await connection.end();
    await pool.end();
  }
}

restoreLessons().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
