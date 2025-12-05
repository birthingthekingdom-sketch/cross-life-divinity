import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { courses } from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const theologyCourses = [
  {
    title: "Old Testament Survey",
    description: "A comprehensive exploration of the Old Testament, examining its historical context, literary genres, and theological themes. Students will journey through the Pentateuch, Historical Books, Wisdom Literature, and Prophetic writings, gaining deep insights into God's covenant relationship with Israel and the foundations of biblical faith.",
    colorTheme: "blue"
  },
  {
    title: "New Testament Theology",
    description: "An in-depth study of the theological themes and messages of the New Testament. This course examines the life and teachings of Jesus Christ, the early church's development, Pauline theology, and the eschatological vision of Revelation. Students will explore how the New Testament fulfills Old Testament promises and establishes the foundation of Christian doctrine.",
    colorTheme: "indigo"
  },
  {
    title: "Systematic Theology",
    description: "A comprehensive study of Christian doctrine organized by major theological topics including the nature of God, Christology, pneumatology, soteriology, ecclesiology, and eschatology. This course provides a framework for understanding how biblical truths form a coherent and unified system of belief that guides Christian faith and practice.",
    colorTheme: "purple"
  },
  {
    title: "Church History",
    description: "Trace the development of Christianity from the apostolic age through the modern era. This course examines key figures, movements, councils, and controversies that shaped Christian thought and practice. Students will explore the early church fathers, medieval scholasticism, the Reformation, and contemporary Christianity, understanding how historical context influences theological development.",
    colorTheme: "green"
  },
  {
    title: "Pastoral Leadership",
    description: "Equip yourself for effective ministry leadership with biblical principles and practical strategies. This course covers shepherding God's people, developing vision, building teams, conflict resolution, preaching and teaching, pastoral care, and maintaining spiritual health. Learn to lead with integrity, wisdom, and compassion in various ministry contexts.",
    colorTheme: "amber"
  },
  {
    title: "Christian Ethics",
    description: "Explore the foundations of Christian moral reasoning and its application to contemporary issues. This course examines biblical principles, ethical theories, and how Christians should respond to complex moral dilemmas in areas such as bioethics, social justice, sexuality, economics, and environmental stewardship. Develop a robust framework for making godly decisions.",
    colorTheme: "orange"
  },
  {
    title: "Biblical Hermeneutics",
    description: "Master the art and science of biblical interpretation. This course teaches sound principles for understanding Scripture in its original context and applying it faithfully today. Students will learn grammatical-historical interpretation, genre analysis, cultural background study, and responsible application methods that honor the text's intended meaning.",
    colorTheme: "teal"
  },
  {
    title: "Apologetics",
    description: "Develop confidence in defending the Christian faith through reasoned arguments and evidence. This course addresses common objections to Christianity, explores proofs for God's existence, examines the reliability of Scripture, and equips students to engage skeptics with grace and truth. Learn to give a reason for the hope within you.",
    colorTheme: "cyan"
  },
  {
    title: "Missions and Evangelism",
    description: "Discover God's heart for the nations and learn effective strategies for sharing the gospel cross-culturally. This course covers the biblical basis for missions, cultural sensitivity, evangelism methods, church planting principles, and mobilizing believers for the Great Commission. Gain practical skills for reaching the lost both locally and globally.",
    colorTheme: "red"
  },
  {
    title: "Spiritual Formation",
    description: "Cultivate a deeper relationship with God through classical and contemporary spiritual disciplines. This course explores prayer, meditation, fasting, solitude, study, worship, and service as means of grace that transform believers into Christlikeness. Learn to develop sustainable rhythms of spiritual growth and guide others in their journey of faith.",
    colorTheme: "pink"
  }
];

console.log('Deleting existing courses...');
await db.delete(courses);

console.log('Creating 10 theology courses...');
for (const course of theologyCourses) {
  const courseCode = course.title.toUpperCase().replace(/\s+/g, '_').substring(0, 20);
  const [newCourse] = await db.insert(courses).values({
    code: courseCode,
    title: course.title,
    description: course.description,
    colorTheme: course.colorTheme,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log(`✓ Created: ${course.title}`);
}

console.log('\n✅ Successfully replaced all courses with 10 theology courses!');
await connection.end();
