import mysql from 'mysql2/promise';

// Parse DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
const urlObj = new URL(dbUrl);

const pool = mysql.createPool({
  host: urlObj.hostname,
  user: urlObj.username,
  password: urlObj.password,
  database: urlObj.pathname.slice(1),
  port: parseInt(urlObj.port) || 3306,
  ssl: 'Amazon RDS',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

const QUESTIONS = {
  'MATH-1': [
    { q: "What is 0.75 as a fraction?", opts: ["1/2", "3/4", "2/3", "4/5"], ans: "3/4", exp: "0.75 = 75/100 = 3/4" },
    { q: "Calculate: 25% of 80", opts: ["15", "20", "25", "30"], ans: "20", exp: "25% × 80 = 20" },
    { q: "What is 3/5 as a decimal?", opts: ["0.5", "0.6", "0.75", "0.8"], ans: "0.6", exp: "3 ÷ 5 = 0.6" },
    { q: "Simplify: 12/18", opts: ["1/2", "2/3", "3/4", "4/5"], ans: "2/3", exp: "GCD(12,18)=6" },
    { q: "What is 1.5 × 4?", opts: ["5", "6", "6.5", "7"], ans: "6", exp: "1.5 × 4 = 6" },
  ],
  'MATH-2': [
    { q: "Solve: x + 5 = 12", opts: ["5", "7", "12", "17"], ans: "7", exp: "x = 12 - 5 = 7" },
    { q: "Solve: 2x = 10", opts: ["2", "5", "8", "10"], ans: "5", exp: "x = 10 ÷ 2 = 5" },
    { q: "Solve: x - 3 = 8", opts: ["5", "8", "11", "14"], ans: "11", exp: "x = 8 + 3 = 11" },
    { q: "Solve: 3x + 2 = 11", opts: ["1", "2", "3", "4"], ans: "3", exp: "3x = 9, x = 3" },
    { q: "What is 2x when x = 5?", opts: ["5", "7", "10", "15"], ans: "10", exp: "2 × 5 = 10" },
  ],
  'RLA-1': [
    { q: "What is the main idea of a text?", opts: ["A small detail", "The central point", "A character's name", "The ending"], ans: "The central point", exp: "Main idea is the central point" },
    { q: "What does 'inference' mean?", opts: ["A direct statement", "A conclusion based on clues", "A question", "A summary"], ans: "A conclusion based on clues", exp: "Inference is a logical conclusion" },
    { q: "What is a topic sentence?", opts: ["End a paragraph", "Introduce the main idea", "List facts", "Ask questions"], ans: "Introduce the main idea", exp: "Topic sentence introduces main idea" },
    { q: "What is author's purpose?", opts: ["Confuse readers", "Inform, entertain, or persuade", "Make it long", "Use difficult words"], ans: "Inform, entertain, or persuade", exp: "Authors write to inform, entertain, or persuade" },
    { q: "What is a supporting detail?", opts: ["The main idea", "Information that supports main idea", "The conclusion", "The title"], ans: "Information that supports main idea", exp: "Supporting details provide evidence" },
  ]
};

async function seed() {
  let conn;
  try {
    console.log('Connecting to database...');
    conn = await pool.getConnection();
    
    // Get topic IDs
    const [topics] = await conn.query('SELECT id, subjectCode, topicNumber FROM bridge_academy_topics ORDER BY id');
    const topicMap = {};
    topics.forEach(t => {
      topicMap[`${t.subjectCode}-${t.topicNumber}`] = t.id;
    });
    
    let inserted = 0;
    
    // Insert questions
    for (const [key, questions] of Object.entries(QUESTIONS)) {
      const topicId = topicMap[key];
      if (!topicId) {
        console.log(`⚠️ Topic ${key} not found`);
        continue;
      }
      
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const opts = JSON.stringify(q.opts);
        
        await conn.query(
          'INSERT INTO bridge_academy_quiz_questions (topicId, questionNumber, questionText, questionType, options, correctAnswer, explanation, difficultyLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [topicId, i + 1, q.q, 'mc', opts, q.ans, q.exp, 'medium']
        );
        inserted++;
      }
    }
    
    console.log(`✅ Inserted ${inserted} quiz questions`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (conn) await conn.end();
    await pool.end();
  }
}

seed();
