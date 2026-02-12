import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
const urlObj = new URL(dbUrl);

const pool = mysql.createPool({
  host: urlObj.hostname,
  user: urlObj.username,
  password: urlObj.password,
  database: urlObj.pathname.slice(1),
  port: parseInt(urlObj.port) || 3306,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

async function list() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const [courses] = await conn.query(
      "SELECT code, title FROM courses WHERE courseType IS NULL OR courseType = '' OR courseType = 'theological' ORDER BY code"
    );
    console.log('Theological courses:', courses.length);
    courses.forEach(c => console.log(`  ${c.code}: ${c.title}`));
    
    const expected = [
      'BIB101', 'BIB102', 'BIB201', 'BIB301',
      'THE201', 'THE301', 'THE401',
      'DIV101', 'DIV102', 'DIV103', 'DIV104',
      'MIN101', 'MIN102', 'MIN201', 'MIN301',
      'SPR101', 'SPR201', 'SPR301',
      'LED201', 'LED301',
      'PAS101', 'PAS201', 'PAS301',
      'CHAP101'
    ];
    
    const found = new Set(courses.map(c => c.code));
    const missing = expected.filter(c => !found.has(c));
    
    console.log('\nExpected but missing:', missing);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (conn) await conn.release();
    await pool.end();
  }
}

list();
