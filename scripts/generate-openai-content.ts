import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

// OpenAI API configuration - set this via environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface LessonData {
  id: number;
  title: string;
  courseTitle: string;
  courseCode: string;
  courseDescription: string;
}

interface GenerationResult {
  lessonId: number;
  success: boolean;
  error?: string;
}

const SEMINARY_CONTENT_PROMPT = `You are a distinguished seminary professor with expertise in biblical theology, systematic theology, and pastoral ministry. You are writing rigorous academic content for Master of Divinity (M.Div.) level students.

LESSON TITLE: {{TITLE}}
COURSE: {{COURSE_TITLE}} ({{COURSE_CODE}})
COURSE CONTEXT: {{COURSE_DESCRIPTION}}

Create comprehensive seminary-level lesson content (3500-4500 words) with the following structure:

# {{TITLE}}

## I. Introduction
Write 2-3 paragraphs establishing:
- The theological and biblical significance of this topic
- How it connects to broader systematic theology
- Why this matters for pastoral ministry and Christian discipleship
- Clear learning objectives for the lesson

## II. Lexical and Semantic Analysis
Provide detailed word studies including:
- Key Hebrew terms (with transliteration using standard academic format, e.g., בְּרֵאשִׁית - bᵉrēʾšîṯ)
- Key Greek terms (with transliteration, e.g., λόγος - logos)
- Etymology and semantic range
- Usage patterns across the biblical corpus
- Theological significance of the terminology

## III. Biblical and Exegetical Foundation
Conduct thorough exegesis of 3-5 primary Scripture passages:
- Historical-grammatical interpretation
- Literary context and structure
- Theological themes and motifs
- Intertextual connections
- Application of sound hermeneutical principles

## IV. Historical and Cultural Context
Examine:
- Ancient Near Eastern background (for OT topics)
- Greco-Roman context (for NT topics)
- Historical development through church history
- Cultural practices and customs that illuminate the text
- How understanding context affects interpretation

## V. Theological Framework and Scholarly Engagement
Engage with major theological perspectives:
- Reformed, Wesleyan, Catholic, Orthodox viewpoints where relevant
- Cite and interact with 4-6 major theologians (e.g., Augustine, Aquinas, Calvin, Luther, Wesley, Barth, Brunner, Packer, Carson, Grudem, Fee, Wright)
- Present different theological positions fairly
- Identify areas of consensus and ongoing debate
- Connect to systematic theology categories

## VI. Contemporary Application and Ministry Practice
Address practical dimensions:
- Implications for pastoral ministry
- Counseling and spiritual formation applications
- Ethical considerations
- How this shapes Christian discipleship
- Common misconceptions to avoid
- Wisdom for ministry contexts

## VII. Critical Questions for Reflection
Pose 3-4 substantive questions that require:
- Integration of biblical, theological, and practical knowledge
- Critical thinking and analysis
- Personal reflection and application
- Engagement with contemporary issues

## VIII. Conclusion
Synthesize key insights and:
- Summarize main theological points
- Reinforce practical applications
- Point toward further study
- Connect to the broader curriculum

## Recommended Reading
Provide a brief annotated bibliography with:
- 2-3 primary sources (biblical commentaries, theological works)
- 2-3 contemporary scholarly works
- 1-2 practical/pastoral resources

CRITICAL REQUIREMENTS:
- Write at M.Div. academic level (not undergraduate)
- Use proper Hebrew/Greek transliteration with diacritical marks
- Cite specific Scripture references extensively (15-25 throughout)
- Engage with actual theologians and their specific works
- Maintain formal academic prose style
- Avoid generic platitudes - be specific and substantive
- Include both theological depth and pastoral wisdom
- Ensure content is biblically faithful and theologically sound
- Write in complete, well-structured paragraphs

Do NOT use bullet points or lists except in the Recommended Reading section. Write in flowing academic prose.`;

const SCRIPTURE_REFERENCES_PROMPT = `For a seminary-level lesson titled "{{TITLE}}" in the course "{{COURSE_TITLE}}", provide 10-15 key Scripture references that would be essential for rigorous academic study.

These should be PRIMARY texts that would receive detailed exegetical treatment, not merely proof texts.

Format EXACTLY as a semicolon-separated list with NO additional text:
Genesis 1:1-3; Psalm 19:1-6; John 1:1-14; Romans 1:18-25

Include book, chapter, and verse ranges. Be specific and comprehensive.`;

const QUIZ_QUESTIONS_PROMPT = `Based on this seminary lesson, create 5 rigorous quiz questions that test deep theological understanding and critical thinking:

LESSON TITLE: {{TITLE}}
COURSE: {{COURSE_TITLE}}

Create EXACTLY 5 questions in this order:
1. Multiple choice - testing exegetical or theological analysis (4 options)
2. True/False - testing understanding of a key concept or scholarly position
3. Multiple choice - testing application of hermeneutical principles or historical knowledge (4 options)
4. Short answer - requiring synthesis, critical thinking, and integration of course material
5. Multiple choice - testing contemporary application or ministry practice (4 options)

Format as valid JSON array (no markdown, no code blocks):
[
  {
    "type": "multiple_choice",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  },
  {
    "type": "true_false",
    "question": "Statement to evaluate",
    "correctAnswer": "True"
  }
]

Ensure questions are substantive, not trivial. Test understanding, not mere memorization.`;

async function callOpenAI(prompt: string, maxTokens: number = 4000): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a distinguished seminary professor with deep expertise in biblical studies, systematic theology, church history, and pastoral ministry. You write at the highest academic level while remaining pastorally relevant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function fillTemplate(template: string, lesson: LessonData): string {
  return template
    .replace(/\{\{TITLE\}\}/g, lesson.title)
    .replace(/\{\{COURSE_TITLE\}\}/g, lesson.courseTitle)
    .replace(/\{\{COURSE_CODE\}\}/g, lesson.courseCode)
    .replace(/\{\{COURSE_DESCRIPTION\}\}/g, lesson.courseDescription);
}

async function generateLessonContent(lesson: LessonData): Promise<string> {
  console.log(`   → Generating content (this may take 60-90 seconds)...`);
  const prompt = fillTemplate(SEMINARY_CONTENT_PROMPT, lesson);
  return await callOpenAI(prompt, 4500);
}

async function generateScriptureReferences(lesson: LessonData): Promise<string> {
  console.log(`   → Generating Scripture references...`);
  const prompt = fillTemplate(SCRIPTURE_REFERENCES_PROMPT, lesson);
  const result = await callOpenAI(prompt, 300);
  return result.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
}

async function generateQuizQuestions(lesson: LessonData): Promise<any[]> {
  console.log(`   → Generating quiz questions...`);
  const prompt = fillTemplate(QUIZ_QUESTIONS_PROMPT, lesson);
  const result = await callOpenAI(prompt, 1500);
  
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || result.match(/\[[\s\S]*\]/);
  const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : result;
  
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(`   ⚠️  Failed to parse quiz JSON, using fallback`);
    return generateFallbackQuiz(lesson);
  }
}

function generateFallbackQuiz(lesson: LessonData): any[] {
  return [
    {
      type: 'multiple_choice',
      question: `What is the primary theological significance of ${lesson.title} within the context of ${lesson.courseTitle}?`,
      options: [
        'Understanding God\'s revelation in Scripture',
        'Developing personal spirituality',
        'Comparing religious traditions',
        'Historical documentation'
      ],
      correctAnswer: 'Understanding God\'s revelation in Scripture'
    },
    {
      type: 'true_false',
      question: `The study of ${lesson.title} requires engagement with original biblical languages and historical-grammatical interpretation.`,
      correctAnswer: 'True'
    },
    {
      type: 'multiple_choice',
      question: 'Which hermeneutical principle is most essential for sound biblical interpretation?',
      options: [
        'Historical-grammatical method within canonical context',
        'Allegorical interpretation',
        'Reader-response criticism',
        'Subjective application'
      ],
      correctAnswer: 'Historical-grammatical method within canonical context'
    },
    {
      type: 'short_answer',
      question: `Explain how the theological principles in ${lesson.title} connect to systematic theology and their implications for contemporary pastoral ministry.`,
      correctAnswer: 'Requires theological integration and practical application with biblical support'
    },
    {
      type: 'multiple_choice',
      question: 'What role does church history play in understanding this theological topic?',
      options: [
        'Provides context for theological development and interpretive traditions',
        'Is irrelevant to modern biblical study',
        'Replaces biblical authority',
        'Only matters for historical theology courses'
      ],
      correctAnswer: 'Provides context for theological development and interpretive traditions'
    }
  ];
}

async function processLesson(conn: mysql.Connection, lesson: LessonData): Promise<GenerationResult> {
  try {
    console.log(`\n📖 Processing: ${lesson.title}`);
    console.log(`   Course: ${lesson.courseTitle} (${lesson.courseCode})`);

    // Check if lesson already has generated content
    const [existing] = await conn.execute(
      'SELECT content, scripture FROM lessons WHERE id = ? AND content IS NOT NULL AND LENGTH(content) > 2000',
      [lesson.id]
    );
    
    if (Array.isArray(existing) && existing.length > 0) {
      console.log(`   ⏭️  Already completed, skipping...`);
      return { lessonId: lesson.id, success: true };
    }

    // Generate content
    const content = await generateLessonContent(lesson);
    
    // Generate Scripture references
    const scripture = await generateScriptureReferences(lesson);
    
    // Update lesson in database
    await conn.execute(
      'UPDATE lessons SET content = ?, scripture = ? WHERE id = ?',
      [content, scripture, lesson.id]
    );

    // Delete existing quiz questions
    await conn.execute('DELETE FROM quiz_questions WHERE lessonId = ?', [lesson.id]);

    // Generate and insert quiz questions
    const questions = await generateQuizQuestions(lesson);

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      // Validate required fields
      if (!q.type || !q.question || !q.correctAnswer) {
        console.log(`   ⚠️  Skipping invalid quiz question ${i + 1}`);
        continue;
      }
      
      await conn.execute(
        `INSERT INTO quiz_questions (lessonId, questionType, question, options, correctAnswer, questionOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          lesson.id,
          q.type || 'multiple_choice',
          q.question || '',
          q.options ? JSON.stringify(q.options) : '[]',
          q.correctAnswer || '',
          i + 1
        ]
      );
    }

    console.log(`   ✅ Completed successfully`);
    return { lessonId: lesson.id, success: true };

  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    return { lessonId: lesson.id, success: false, error: String(error) };
  }
}

async function main() {
  console.log('🎓 Seminary Content Generation System\n');
  console.log('═'.repeat(60));
  
  if (!OPENAI_API_KEY) {
    console.error('\n❌ ERROR: OPENAI_API_KEY environment variable is not set');
    console.log('\nPlease set your OpenAI API key:');
    console.log('  export OPENAI_API_KEY="sk-..."');
    console.log('\nThen run this script again.');
    process.exit(1);
  }

  const conn = await mysql.createConnection(process.env.DATABASE_URL!);

  try {
    // Get all lessons with course information
    const [lessons] = await conn.execute(`
      SELECT 
        l.id, 
        l.title, 
        c.title as courseTitle, 
        c.code as courseCode,
        c.description as courseDescription
      FROM lessons l
      JOIN courses c ON l.courseId = c.id
      ORDER BY l.id
    `);

    const lessonData = lessons as LessonData[];
    console.log(`\nFound ${lessonData.length} lessons to process`);
    console.log(`Estimated time: ${Math.ceil(lessonData.length * 2.5 / 60)} hours\n`);
    console.log('═'.repeat(60));

    const results: GenerationResult[] = [];
    const startTime = Date.now();

    for (let i = 0; i < lessonData.length; i++) {
      const lesson = lessonData[i];
      console.log(`\n[${i + 1}/${lessonData.length}]`);
      
      const result = await processLesson(conn, lesson);
      results.push(result);

      // Rate limiting - wait 3 seconds between requests to avoid API limits
      if (i < lessonData.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Progress update every 10 lessons
      if ((i + 1) % 10 === 0) {
        const elapsed = (Date.now() - startTime) / 1000 / 60;
        const successCount = results.filter(r => r.success).length;
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`📊 Progress: ${i + 1}/${lessonData.length} lessons`);
        console.log(`   ✅ Successful: ${successCount}`);
        console.log(`   ❌ Failed: ${results.length - successCount}`);
        console.log(`   ⏱️  Elapsed: ${elapsed.toFixed(1)} minutes`);
        console.log(`${'═'.repeat(60)}`);
      }
    }

    // Final summary
    const successCount = results.filter(r => r.success).length;
    const failedResults = results.filter(r => !r.success);
    const totalTime = (Date.now() - startTime) / 1000 / 60;

    console.log(`\n\n${'═'.repeat(60)}`);
    console.log('📊 GENERATION COMPLETE');
    console.log(`${'═'.repeat(60)}`);
    console.log(`✅ Successful: ${successCount}/${lessonData.length}`);
    console.log(`❌ Failed: ${failedResults.length}/${lessonData.length}`);
    console.log(`⏱️  Total time: ${totalTime.toFixed(1)} minutes`);
    
    if (failedResults.length > 0) {
      console.log(`\n⚠️  Failed lesson IDs: ${failedResults.map(r => r.lessonId).join(', ')}`);
    }

    // Save results to file
    const resultsPath = path.join(process.cwd(), 'generation-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved to: ${resultsPath}`);

  } finally {
    await conn.end();
  }
}

main().catch(console.error);
