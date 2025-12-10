import mysql from 'mysql2/promise';

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || '';
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || '';

interface LessonData {
  id: number;
  title: string;
  courseTitle: string;
  courseCode: string;
}

async function generateSeminaryContent(lesson: LessonData): Promise<string> {
  const prompt = "You are a seminary professor writing rigorous academic content for a divinity school course.\n\n" +
    "LESSON TITLE: " + lesson.title + "\n" +
    "COURSE: " + lesson.courseTitle + " (" + lesson.courseCode + ")\n\n" +
    "Create comprehensive seminary-level lesson content (3000-4000 words) that includes:\n\n" +
    "I. INTRODUCTION\n" +
    "- Theological significance and context\n" +
    "- Connection to broader biblical theology\n" +
    "- Learning objectives\n\n" +
    "II. LEXICAL AND SEMANTIC ANALYSIS\n" +
    "- Hebrew/Greek word studies with transliteration\n" +
    "- Etymology and semantic range\n" +
    "- Usage in biblical corpus\n\n" +
    "III. EXEGETICAL ANALYSIS\n" +
    "- Primary Scripture passages with detailed exposition\n" +
    "- Historical-grammatical interpretation\n" +
    "- Literary context and structure\n\n" +
    "IV. HISTORICAL AND CULTURAL CONTEXT\n" +
    "- Ancient Near Eastern background\n" +
    "- Historical development\n\n" +
    "V. THEOLOGICAL FRAMEWORKS\n" +
    "- Systematic theology connections\n" +
    "- Key theological debates\n" +
    "- Engagement with major scholars (cite 3-5 theologians like Barth, Calvin, Luther, Wesley, Grudem, Carson, Packer)\n\n" +
    "VI. PRACTICAL APPLICATIONS\n" +
    "- Ministry implications\n" +
    "- Pastoral considerations\n\n" +
    "VII. CONCLUSION\n\n" +
    "REQUIREMENTS:\n" +
    "- Use proper Hebrew/Greek transliteration\n" +
    "- Include 10-15 primary Scripture references\n" +
    "- Maintain M.Div. level academic rigor\n" +
    "- Write in formal academic style with complete paragraphs";

  try {
    const response = await fetch(FORGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + FORGE_API_KEY
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 16000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed: ' + response.statusText);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error generating content for lesson ' + lesson.id + ':', error);
    throw error;
  }
}

async function generateScriptureReferences(lesson: LessonData): Promise<string> {
  const prompt = 'For a seminary lesson titled "' + lesson.title + '" in the course "' + lesson.courseTitle + '", provide 8-12 key Scripture references.\n\nFormat as semicolon-separated list: "Genesis 1:1-3; Psalm 19:1-6; John 1:1-14"\n\nFocus on primary texts for exegetical analysis.';

  try {
    const response = await fetch(FORGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + FORGE_API_KEY
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    return "2 Timothy 3:16-17; Hebrews 4:12; Psalm 119:105";
  }
}

async function main() {
  console.log('🎓 Generating Seminary-Level Content...\n');

  const conn = await mysql.createConnection(process.env.DATABASE_URL!);

  try {
    const [lessons] = await conn.execute(
      'SELECT l.id, l.title, c.title as courseTitle, c.code as courseCode ' +
      'FROM lessons l ' +
      'JOIN courses c ON l.courseId = c.id ' +
      'ORDER BY l.id ' +
      'LIMIT 5'
    );

    const lessonData = lessons as LessonData[];
    console.log('Processing ' + lessonData.length + ' lessons (test run)\n');

    for (const lesson of lessonData) {
      console.log('\n📖 ' + lesson.title);
      
      const content = await generateSeminaryContent(lesson);
      const scripture = await generateScriptureReferences(lesson);

      await conn.execute(
        'UPDATE lessons SET content = ?, scripture = ? WHERE id = ?',
        [content, scripture, lesson.id]
      );

      console.log('   ✅ Complete');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n✅ Test generation complete!');

  } finally {
    await conn.end();
  }
}

main().catch(console.error);
