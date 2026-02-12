import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get all DIV111 lessons
const [lessons] = await connection.execute(`
  SELECT id, title FROM lessons WHERE courseId = 570004 ORDER BY id
`);

console.log(`Found ${lessons.length} lessons for DIV111`);

// Quiz questions for each lesson (10 MC + 1 short answer)
const quizData = {
  "Selecting Your Capstone Topic": [
    { q: "A capstone project should demonstrate:", type: "multiple_choice", options: ["Minimal effort", "Mastery of program learning outcomes", "Only personal opinions", "Avoidance of research"], answer: "Mastery of program learning outcomes" },
    { q: "The first step in selecting a topic is:", type: "multiple_choice", options: ["Writing the conclusion", "Identifying your interests and passions", "Submitting the final draft", "Defending your thesis"], answer: "Identifying your interests and passions" },
    { q: "A good capstone topic should be:", type: "multiple_choice", options: ["Too broad to manage", "Narrow enough to research thoroughly", "Unrelated to your studies", "Impossible to complete"], answer: "Narrow enough to research thoroughly" },
    { q: "Your capstone topic should connect to:", type: "multiple_choice", options: ["Only secular interests", "Your ministry context and calling", "Entertainment", "Unrelated hobbies"], answer: "Your ministry context and calling" },
    { q: "Before finalizing your topic, you should:", type: "multiple_choice", options: ["Avoid consulting anyone", "Consult with your advisor", "Skip the research phase", "Ignore program requirements"], answer: "Consult with your advisor" },
    { q: "A feasible topic is one that:", type: "multiple_choice", options: ["Cannot be completed with available resources", "Can be completed within time and resource constraints", "Requires unlimited funding", "Has no available sources"], answer: "Can be completed within time and resource constraints" },
    { q: "The capstone topic should address:", type: "multiple_choice", options: ["Trivial questions", "A significant question or problem", "Only personal preferences", "Nothing of importance"], answer: "A significant question or problem" },
    { q: "Original contribution means:", type: "multiple_choice", options: ["Copying others' work", "Adding something new to the conversation", "Repeating existing research", "Avoiding all sources"], answer: "Adding something new to the conversation" },
    { q: "Your topic should be refined through:", type: "multiple_choice", options: ["Ignoring feedback", "Preliminary reading and research", "Guessing", "Avoiding the library"], answer: "Preliminary reading and research" },
    { q: "The capstone project is an opportunity to:", type: "multiple_choice", options: ["Avoid learning", "Integrate faith, learning, and ministry", "Skip classes", "Ignore your calling"], answer: "Integrate faith, learning, and ministry" },
    { q: "Describe the criteria for selecting a good capstone topic.", type: "short_answer", options: null, answer: "A good capstone topic should be personally interesting, academically significant, appropriately narrow, feasible with available resources, connected to ministry, and capable of original contribution." }
  ],
  "Research Methodology for Theological Studies": [
    { q: "Theological research is the systematic investigation of questions related to:", type: "multiple_choice", options: ["Only science", "God, Scripture, doctrine, and Christian practice", "Only history", "Only philosophy"], answer: "God, Scripture, doctrine, and Christian practice" },
    { q: "Anselm's phrase 'fides quaerens intellectum' means:", type: "multiple_choice", options: ["Faith without reason", "Faith seeking understanding", "Reason without faith", "Understanding without faith"], answer: "Faith seeking understanding" },
    { q: "Primary sources in theological research include:", type: "multiple_choice", options: ["Commentaries", "Biblical texts in original languages", "Journal articles", "Textbooks"], answer: "Biblical texts in original languages" },
    { q: "Exegesis comes from the Greek meaning:", type: "multiple_choice", options: ["To read into", "To lead out", "To ignore", "To assume"], answer: "To lead out" },
    { q: "A good research question should be:", type: "multiple_choice", options: ["Vague and broad", "Clear, focused, significant, and researchable", "Impossible to answer", "Trivial"], answer: "Clear, focused, significant, and researchable" },
    { q: "Qualitative research involves:", type: "multiple_choice", options: ["Only numerical data", "Non-numerical data such as texts and interviews", "Only statistics", "Only surveys"], answer: "Non-numerical data such as texts and interviews" },
    { q: "Historical method in theology involves:", type: "multiple_choice", options: ["Ignoring the past", "Examining the development of doctrine over time", "Only studying the present", "Avoiding primary sources"], answer: "Examining the development of doctrine over time" },
    { q: "Systematic theology organizes biblical teaching:", type: "multiple_choice", options: ["Chronologically only", "Topically and constructively", "Randomly", "Without any structure"], answer: "Topically and constructively" },
    { q: "Academic integrity requires:", type: "multiple_choice", options: ["Plagiarism", "Proper citation of sources", "Copying without credit", "Ignoring sources"], answer: "Proper citation of sources" },
    { q: "Theological research should be approached with:", type: "multiple_choice", options: ["Arrogance", "Prayer, humility, and openness to the Spirit", "Indifference", "Closed-mindedness"], answer: "Prayer, humility, and openness to the Spirit" },
    { q: "Explain the relationship between faith and scholarship in theological research.", type: "short_answer", options: null, answer: "Christian scholarship operates within the framework of faith, pursuing truth with the conviction that all truth is God's truth. Faith and reason are complementary, not contradictory." }
  ],
  "Literature Review and Source Evaluation": [
    { q: "A literature review surveys:", type: "multiple_choice", options: ["Only your own ideas", "Existing scholarship on your topic", "Only one source", "Nothing relevant"], answer: "Existing scholarship on your topic" },
    { q: "The literature review helps identify:", type: "multiple_choice", options: ["Only agreements", "Gaps in existing research", "Only your thesis", "Nothing useful"], answer: "Gaps in existing research" },
    { q: "Peer-reviewed sources have been:", type: "multiple_choice", options: ["Published without review", "Evaluated by experts before publication", "Written by amateurs", "Unverified"], answer: "Evaluated by experts before publication" },
    { q: "When evaluating sources, 'authority' refers to:", type: "multiple_choice", options: ["The book's size", "The author's credentials and expertise", "The cover design", "The price"], answer: "The author's credentials and expertise" },
    { q: "A literature review should be organized:", type: "multiple_choice", options: ["Randomly", "Thematically, chronologically, or methodologically", "Without any structure", "By page count"], answer: "Thematically, chronologically, or methodologically" },
    { q: "Synthesis in a literature review means:", type: "multiple_choice", options: ["Summarizing each source separately", "Showing how sources relate to each other", "Ignoring connections", "Copying sources"], answer: "Showing how sources relate to each other" },
    { q: "Critical engagement with sources involves:", type: "multiple_choice", options: ["Accepting everything uncritically", "Evaluating arguments and identifying limitations", "Ignoring weaknesses", "Only praising sources"], answer: "Evaluating arguments and identifying limitations" },
    { q: "The literature review should lead to:", type: "multiple_choice", options: ["Confusion", "Your research question and thesis", "Abandoning research", "Unrelated topics"], answer: "Your research question and thesis" },
    { q: "Note-taking should capture:", type: "multiple_choice", options: ["Only titles", "Key arguments, quotations, and your reactions", "Nothing important", "Only page numbers"], answer: "Key arguments, quotations, and your reactions" },
    { q: "Ignoring opposing views in a literature review:", type: "multiple_choice", options: ["Strengthens your argument", "Weakens your argument", "Is required", "Shows thoroughness"], answer: "Weakens your argument" },
    { q: "Explain the difference between summarizing and synthesizing sources.", type: "short_answer", options: null, answer: "Summarizing reports what each source says individually, while synthesizing shows how sources relate to each other, identifying agreements, disagreements, and gaps in the literature." }
  ],
  "Thesis Development and Argumentation": [
    { q: "A thesis statement is:", type: "multiple_choice", options: ["A vague idea", "A concise declaration of your central argument", "A question", "A summary of sources"], answer: "A concise declaration of your central argument" },
    { q: "An arguable thesis is one that:", type: "multiple_choice", options: ["States an obvious fact", "Can be debated", "Everyone agrees with", "Cannot be supported"], answer: "Can be debated" },
    { q: "An argument consists of:", type: "multiple_choice", options: ["Only opinions", "Claims, evidence, and warrants", "Only emotions", "Only quotations"], answer: "Claims, evidence, and warrants" },
    { q: "A warrant is:", type: "multiple_choice", options: ["A legal document", "The reasoning connecting evidence to claim", "A type of evidence", "A quotation"], answer: "The reasoning connecting evidence to claim" },
    { q: "The 'straw man' fallacy involves:", type: "multiple_choice", options: ["Strengthening an opponent's argument", "Misrepresenting an opponent's position", "Agreeing with opponents", "Using strong evidence"], answer: "Misrepresenting an opponent's position" },
    { q: "Addressing counterarguments:", type: "multiple_choice", options: ["Weakens your argument", "Strengthens your argument", "Is unnecessary", "Shows weakness"], answer: "Strengthens your argument" },
    { q: "Deductive arguments move from:", type: "multiple_choice", options: ["Specific to general", "General principles to specific conclusions", "Random to organized", "Conclusion to premise"], answer: "General principles to specific conclusions" },
    { q: "Circular reasoning is a fallacy because:", type: "multiple_choice", options: ["It uses evidence", "It assumes what it tries to prove", "It addresses counterarguments", "It is too complex"], answer: "It assumes what it tries to prove" },
    { q: "Each paragraph should begin with:", type: "multiple_choice", options: ["A quotation", "A topic sentence stating the main point", "A question", "A transition only"], answer: "A topic sentence stating the main point" },
    { q: "Ethos, pathos, and logos refer to:", type: "multiple_choice", options: ["Greek gods", "Modes of persuasion (credibility, emotion, logic)", "Types of fallacies", "Citation styles"], answer: "Modes of persuasion (credibility, emotion, logic)" },
    { q: "Explain why a thesis must be arguable rather than a statement of fact.", type: "short_answer", options: null, answer: "An arguable thesis presents a claim that can be debated and requires evidence to support. A mere fact needs no argument. The thesis drives the research and gives the paper purpose." }
  ],
  "Biblical Exegesis for the Capstone": [
    { q: "Exegesis aims to understand:", type: "multiple_choice", options: ["What we want the text to say", "What the biblical author intended to communicate", "Only modern interpretations", "Our own opinions"], answer: "What the biblical author intended to communicate" },
    { q: "Textual criticism establishes:", type: "multiple_choice", options: ["The meaning of the text", "The original text", "The application", "The genre"], answer: "The original text" },
    { q: "Historical-cultural context examines:", type: "multiple_choice", options: ["Only grammar", "The original setting of the text", "Only modern application", "Only literary features"], answer: "The original setting of the text" },
    { q: "Genre analysis is important because:", type: "multiple_choice", options: ["All genres are interpreted the same way", "Different genres require different interpretive approaches", "Genre doesn't matter", "Only poetry has genre"], answer: "Different genres require different interpretive approaches" },
    { q: "Eisegesis is the error of:", type: "multiple_choice", options: ["Drawing meaning out of the text", "Reading meaning into the text", "Careful interpretation", "Using commentaries"], answer: "Reading meaning into the text" },
    { q: "The 'root fallacy' assumes meaning is determined by:", type: "multiple_choice", options: ["Context", "Etymology rather than usage", "Syntax", "Genre"], answer: "Etymology rather than usage" },
    { q: "BDAG is a lexicon for:", type: "multiple_choice", options: ["Hebrew", "Greek", "Aramaic", "Latin"], answer: "Greek" },
    { q: "Proof-texting is problematic because it:", type: "multiple_choice", options: ["Uses too much context", "Uses verses without regard for context", "Is too thorough", "Considers genre"], answer: "Uses verses without regard for context" },
    { q: "The hermeneutical spiral involves:", type: "multiple_choice", options: ["Ignoring the whole", "Iterating between parts and whole", "Only studying words", "Avoiding theology"], answer: "Iterating between parts and whole" },
    { q: "Exegesis should be integrated with:", type: "multiple_choice", options: ["Nothing else", "Biblical and systematic theology", "Only personal opinion", "Only one commentary"], answer: "Biblical and systematic theology" },
    { q: "Explain the difference between exegesis and eisegesis.", type: "short_answer", options: null, answer: "Exegesis draws meaning out of the text based on what the author intended, while eisegesis reads meaning into the text based on the interpreter's presuppositions or desires." }
  ],
  "Writing and Style for Theological Papers": [
    { q: "The cardinal virtue of academic writing is:", type: "multiple_choice", options: ["Complexity", "Clarity", "Length", "Jargon"], answer: "Clarity" },
    { q: "Concision means:", type: "multiple_choice", options: ["Using many unnecessary words", "Eliminating unnecessary words", "Writing as little as possible", "Avoiding all detail"], answer: "Eliminating unnecessary words" },
    { q: "The introduction should:", type: "multiple_choice", options: ["Hide the thesis", "State the thesis clearly", "Avoid the topic", "Be as long as possible"], answer: "State the thesis clearly" },
    { q: "Academic tone should be:", type: "multiple_choice", options: ["Casual and slangy", "Formal but not stuffy", "Arrogant", "Colloquial"], answer: "Formal but not stuffy" },
    { q: "Quotations should be:", type: "multiple_choice", options: ["Left to speak for themselves", "Introduced, integrated, and analyzed", "Used without citation", "Avoided entirely"], answer: "Introduced, integrated, and analyzed" },
    { q: "Revision addresses:", type: "multiple_choice", options: ["Only spelling", "Argument, organization, clarity, and evidence", "Nothing important", "Only the title"], answer: "Argument, organization, clarity, and evidence" },
    { q: "Passive voice overuse:", type: "multiple_choice", options: ["Strengthens prose", "Obscures agency and weakens prose", "Is always wrong", "Is required in academic writing"], answer: "Obscures agency and weakens prose" },
    { q: "Nominalization turns:", type: "multiple_choice", options: ["Nouns into verbs", "Verbs into nouns, weakening prose", "Adjectives into adverbs", "Nothing"], answer: "Verbs into nouns, weakening prose" },
    { q: "Transitions help readers:", type: "multiple_choice", options: ["Get confused", "Follow the flow of argument", "Skip sections", "Ignore the thesis"], answer: "Follow the flow of argument" },
    { q: "Good writing requires:", type: "multiple_choice", options: ["Only one draft", "Multiple revisions", "No editing", "Ignoring feedback"], answer: "Multiple revisions" },
    { q: "Explain why clarity is more important than complexity in academic writing.", type: "short_answer", options: null, answer: "The goal of academic writing is to communicate ideas effectively. Complex prose that obscures meaning fails this purpose. Clear writing demonstrates mastery; unnecessary complexity often hides confusion." }
  ],
  "Citation, Documentation, and Academic Integrity": [
    { q: "Citation gives credit to:", type: "multiple_choice", options: ["No one", "The intellectual contributions of others", "Only yourself", "Only famous authors"], answer: "The intellectual contributions of others" },
    { q: "Plagiarism is:", type: "multiple_choice", options: ["Acceptable", "Presenting others' work as your own", "Required", "Encouraged"], answer: "Presenting others' work as your own" },
    { q: "Paraphrasing without citation is:", type: "multiple_choice", options: ["Acceptable", "Plagiarism", "Required", "Best practice"], answer: "Plagiarism" },
    { q: "Turabian style uses:", type: "multiple_choice", options: ["In-text citations only", "Footnotes or endnotes with bibliography", "No citations", "Only parenthetical citations"], answer: "Footnotes or endnotes with bibliography" },
    { q: "When in doubt about whether to cite:", type: "multiple_choice", options: ["Don't cite", "Cite the source", "Guess", "Ask a friend"], answer: "Cite the source" },
    { q: "Self-plagiarism involves:", type: "multiple_choice", options: ["Citing yourself", "Reusing your own work without disclosure", "Writing original content", "Proper citation"], answer: "Reusing your own work without disclosure" },
    { q: "Academic integrity reflects:", type: "multiple_choice", options: ["Only academic rules", "Christian character and witness", "Nothing important", "Only legal requirements"], answer: "Christian character and witness" },
    { q: "Ephesians 4:25 commands believers to:", type: "multiple_choice", options: ["Lie", "Speak truth", "Plagiarize", "Ignore sources"], answer: "Speak truth" },
    { q: "Citation management tools include:", type: "multiple_choice", options: ["Only paper notes", "Zotero, EndNote, and Mendeley", "Only memory", "Nothing helpful"], answer: "Zotero, EndNote, and Mendeley" },
    { q: "Consequences of plagiarism can include:", type: "multiple_choice", options: ["Praise", "Failing, expulsion, and loss of degree", "Rewards", "Nothing"], answer: "Failing, expulsion, and loss of degree" },
    { q: "Explain why academic integrity is a spiritual issue for Christians.", type: "short_answer", options: null, answer: "Academic integrity reflects Christian virtues of honesty, humility, and stewardship. Dishonesty violates Scripture's commands for truthfulness and undermines our witness to the gospel." }
  ],
  "Oral Presentation and Defense": [
    { q: "The capstone defense is primarily:", type: "multiple_choice", options: ["An adversarial attack", "A scholarly conversation", "A punishment", "A formality only"], answer: "A scholarly conversation" },
    { q: "A typical presentation structure includes:", type: "multiple_choice", options: ["Only questions", "Introduction, background, methodology, findings, conclusion", "Only the thesis", "Only the bibliography"], answer: "Introduction, background, methodology, findings, conclusion" },
    { q: "Visual aids should be:", type: "multiple_choice", options: ["Cluttered with text", "Simple and uncluttered", "Read word-for-word", "Ignored"], answer: "Simple and uncluttered" },
    { q: "When answering questions, you should:", type: "multiple_choice", options: ["Interrupt the questioner", "Listen carefully and respond thoughtfully", "Become defensive", "Ignore the question"], answer: "Listen carefully and respond thoughtfully" },
    { q: "It is acceptable to say:", type: "multiple_choice", options: ["I know everything", "I would need to research that further", "I refuse to answer", "That's a stupid question"], answer: "I would need to research that further" },
    { q: "Nervousness before a presentation is:", type: "multiple_choice", options: ["A sign of failure", "Normal and manageable", "Unacceptable", "Impossible to overcome"], answer: "Normal and manageable" },
    { q: "Eye contact with the audience:", type: "multiple_choice", options: ["Should be avoided", "Helps engage listeners", "Is unprofessional", "Is unnecessary"], answer: "Helps engage listeners" },
    { q: "Practice for presentations should include:", type: "multiple_choice", options: ["Only reading silently", "Speaking aloud and timing yourself", "No preparation", "Only writing notes"], answer: "Speaking aloud and timing yourself" },
    { q: "Critique during the defense should be viewed as:", type: "multiple_choice", options: ["A personal attack", "An opportunity to learn", "Unfair", "Irrelevant"], answer: "An opportunity to learn" },
    { q: "After the defense, you may need to:", type: "multiple_choice", options: ["Do nothing", "Make revisions based on feedback", "Ignore all suggestions", "Start over completely"], answer: "Make revisions based on feedback" },
    { q: "Describe strategies for managing nervousness during an oral presentation.", type: "short_answer", options: null, answer: "Prepare thoroughly, practice repeatedly, breathe deeply, focus on the message rather than yourself, and remember that the audience wants you to succeed." }
  ],
  "Integrating Faith, Learning, and Ministry": [
    { q: "The phrase 'all truth is God's truth' means:", type: "multiple_choice", options: ["Only the Bible is true", "Truth in any discipline belongs to God", "Secular knowledge is false", "Faith and learning are separate"], answer: "Truth in any discipline belongs to God" },
    { q: "2 Corinthians 10:5 calls believers to bring every thought into:", type: "multiple_choice", options: ["Confusion", "Captivity to Christ", "Doubt", "Secular frameworks"], answer: "Captivity to Christ" },
    { q: "Romans 12:2 calls for the transformation of:", type: "multiple_choice", options: ["Only behavior", "The mind", "Only emotions", "Nothing"], answer: "The mind" },
    { q: "Theological education exists to prepare people for:", type: "multiple_choice", options: ["Only academic careers", "Effective ministry", "Only personal enrichment", "Nothing practical"], answer: "Effective ministry" },
    { q: "The capstone should serve:", type: "multiple_choice", options: ["Only the student", "The church and kingdom of God", "Only the institution", "No one"], answer: "The church and kingdom of God" },
    { q: "Research as spiritual discipline involves:", type: "multiple_choice", options: ["Ignoring prayer", "Prayerful study and humble engagement", "Arrogance", "Avoiding Scripture"], answer: "Prayerful study and humble engagement" },
    { q: "Jonathan Edwards taught that true religion involves:", type: "multiple_choice", options: ["Only the intellect", "Both understanding and affections", "Only emotions", "Neither"], answer: "Both understanding and affections" },
    { q: "Colossians 3:23 says to work heartily as to:", type: "multiple_choice", options: ["Men", "The Lord", "Yourself", "No one"], answer: "The Lord" },
    { q: "The capstone is:", type: "multiple_choice", options: ["The end of learning", "A milestone in lifelong learning", "Unimportant", "Only academic"], answer: "A milestone in lifelong learning" },
    { q: "Skills developed in capstone research will serve in:", type: "multiple_choice", options: ["Nothing", "Preaching, teaching, counseling, and leadership", "Only writing", "Only reading"], answer: "Preaching, teaching, counseling, and leadership" },
    { q: "Explain how the capstone project can be an act of worship.", type: "short_answer", options: null, answer: "When done with excellence, integrity, and for God's glory, the capstone becomes an offering of our minds and work to the Lord, serving His church and advancing His kingdom." }
  ],
  "Capstone Project Completion and Submission": [
    { q: "Final revision should address:", type: "multiple_choice", options: ["Only spelling", "Content, structure, and feedback integration", "Nothing", "Only the title"], answer: "Content, structure, and feedback integration" },
    { q: "Proofreading checks for:", type: "multiple_choice", options: ["Argument structure", "Typos, spelling, and formatting errors", "Thesis clarity", "Source quality"], answer: "Typos, spelling, and formatting errors" },
    { q: "Reading aloud helps catch:", type: "multiple_choice", options: ["Nothing", "Errors and awkward phrasing", "Only spelling", "Only grammar"], answer: "Errors and awkward phrasing" },
    { q: "Formatting should follow:", type: "multiple_choice", options: ["Your personal preference", "Institutional guidelines", "No rules", "Only your advisor's style"], answer: "Institutional guidelines" },
    { q: "Front matter typically includes:", type: "multiple_choice", options: ["Only the body", "Title page, abstract, and table of contents", "Only the conclusion", "Only the bibliography"], answer: "Title page, abstract, and table of contents" },
    { q: "The bibliography should include:", type: "multiple_choice", options: ["Only some sources", "All cited sources", "No sources", "Only books"], answer: "All cited sources" },
    { q: "You should submit your capstone:", type: "multiple_choice", options: ["At the last possible minute", "Early to avoid technical problems", "After the deadline", "Without proofreading"], answer: "Early to avoid technical problems" },
    { q: "After submitting, you should:", type: "multiple_choice", options: ["Forget about it", "Confirm receipt and keep a copy", "Delete your files", "Ignore the defense"], answer: "Confirm receipt and keep a copy" },
    { q: "2 Timothy 4:7 speaks of:", type: "multiple_choice", options: ["Giving up", "Fighting the good fight and finishing the race", "Avoiding challenges", "Starting over"], answer: "Fighting the good fight and finishing the race" },
    { q: "After completion, you should:", type: "multiple_choice", options: ["Stop learning", "Continue learning and growing", "Forget everything", "Avoid ministry"], answer: "Continue learning and growing" },
    { q: "Describe the key elements of a final revision checklist.", type: "short_answer", options: null, answer: "A final checklist should cover content (thesis, evidence, counterarguments), writing (clarity, grammar), formatting (margins, citations), documentation (all sources cited), and requirements (length, deadline)." }
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
