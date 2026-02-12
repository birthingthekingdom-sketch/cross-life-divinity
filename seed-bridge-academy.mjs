import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const QUESTIONS_DATA = {
  'MATH-1': {
    quiz: [
      { q: "What is 0.75 as a fraction?", opts: ["1/2", "3/4", "2/3", "4/5"], ans: "3/4", exp: "0.75 = 75/100 = 3/4 when simplified" },
      { q: "Calculate: 25% of 80", opts: ["15", "20", "25", "30"], ans: "20", exp: "25% × 80 = 0.25 × 80 = 20" },
      { q: "What is 3/5 as a decimal?", opts: ["0.5", "0.6", "0.75", "0.8"], ans: "0.6", exp: "3 ÷ 5 = 0.6" },
      { q: "Simplify: 12/18", opts: ["1/2", "2/3", "3/4", "4/5"], ans: "2/3", exp: "GCD(12,18)=6, so 12/18 = 2/3" },
      { q: "What is 1.5 × 4?", opts: ["5", "6", "6.5", "7"], ans: "6", exp: "1.5 × 4 = 6" },
      { q: "Calculate: 100 ÷ 0.5", opts: ["50", "100", "200", "500"], ans: "200", exp: "100 ÷ 0.5 = 100 × 2 = 200" },
      { q: "What is 20% of 150?", opts: ["20", "30", "40", "50"], ans: "30", exp: "20% × 150 = 0.2 × 150 = 30" },
      { q: "Simplify: 8/12", opts: ["1/2", "2/3", "3/4", "4/5"], ans: "2/3", exp: "GCD(8,12)=4, so 8/12 = 2/3" },
      { q: "What is 2/3 + 1/3?", opts: ["1/2", "2/3", "1", "4/3"], ans: "1", exp: "2/3 + 1/3 = 3/3 = 1" },
      { q: "Calculate: 15% of 200", opts: ["20", "25", "30", "35"], ans: "30", exp: "15% × 200 = 0.15 × 200 = 30" }
    ]
  }
};

async function seedQuestions() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting Bridge Academy question seeding...');
    
    // Get topic IDs
    const [topics] = await connection.query('SELECT id, subjectCode, topicNumber FROM bridge_academy_topics ORDER BY id');
    
    const topicMap = {};
    topics.forEach(topic => {
      const key = `${topic.subjectCode}-${topic.topicNumber}`;
      topicMap[key] = topic.id;
    });
    
    let quizCount = 0;
    
    // Seed sample MATH-1 questions
    const topicId = topicMap['MATH-1'];
    const questions = QUESTIONS_DATA['MATH-1'];
    
    for (const q of questions.quiz) {
      const optionsJson = JSON.stringify(q.opts);
      await connection.query(
        'INSERT INTO bridge_academy_quiz_questions (topicId, questionNumber, questionText, questionType, options, correctAnswer, explanation, difficultyLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [topicId, quizCount + 1, q.q, 'mc', optionsJson, q.ans, q.exp, 'medium']
      );
      quizCount++;
    }
    
    console.log(`✅ Seeded ${quizCount} quiz questions for MATH-1`);
    
  } catch (error) {
    console.error('Error seeding questions:', error);
  } finally {
    await connection.end();
    await pool.end();
  }
}

seedQuestions();
