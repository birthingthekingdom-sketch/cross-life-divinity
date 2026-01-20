import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const courseId = 570004; // DIV111 Capstone Project

// 9 new lessons to add (already have 1: Selecting Your Capstone Topic)
const lessons = [
  {
    title: "Research Methodology for Theological Studies",
    content: `# Research Methodology for Theological Studies

## I. Introduction

Effective theological research requires a solid understanding of research methodology. Whether you are writing a thesis, dissertation, or capstone project, the methods you employ will determine the quality and credibility of your work. This lesson introduces the foundational principles of research methodology as applied to theological and biblical studies.

Theological research differs from purely empirical research in that it engages with divine revelation, historical texts, and faith traditions. Nevertheless, rigorous methodology is essential for producing scholarship that is both academically sound and spiritually edifying.

**Learning Objectives:**
- Understand the nature and purpose of theological research
- Distinguish between various research methodologies
- Develop skills in formulating research questions
- Apply appropriate methods to your capstone project

## II. The Nature of Theological Research

### A. Definition and Purpose

Theological research is the systematic investigation of questions related to God, Scripture, doctrine, and Christian practice. Its purposes include:

- **Understanding**: Deepening comprehension of biblical texts and theological concepts
- **Application**: Connecting theological truth to contemporary life and ministry
- **Contribution**: Adding to the body of theological knowledge
- **Formation**: Shaping the researcher's own faith and character

### B. The Relationship of Faith and Scholarship

Christian scholarship operates within the framework of faith. As Anselm expressed it: "fides quaerens intellectum" (faith seeking understanding). This does not mean abandoning critical inquiry but rather pursuing truth with the conviction that all truth is God's truth.

The researcher approaches Scripture as the authoritative Word of God while employing rigorous academic methods. Faith and reason are complementary, not contradictory.

### C. Types of Theological Research

**Biblical Studies**: Exegesis, biblical theology, textual criticism
**Systematic Theology**: Doctrinal analysis and construction
**Historical Theology**: Development of doctrine through church history
**Practical Theology**: Application to ministry, ethics, and spiritual formation
**Apologetics**: Defense and commendation of the Christian faith

## III. Research Methodologies

### A. Qualitative vs. Quantitative Research

**Quantitative research** involves numerical data, statistical analysis, and measurable variables. It is more common in social sciences but may be used in ministry studies (e.g., surveys of church growth).

**Qualitative research** involves non-numerical data such as texts, interviews, and observations. It is the predominant approach in theological studies.

Most theological research is qualitative, focusing on interpretation of texts, analysis of ideas, and synthesis of sources.

### B. Primary and Secondary Sources

**Primary sources** are original documents or firsthand accounts:
- Biblical texts in original languages
- Historical documents (church fathers, creeds, confessions)
- Original research data (interviews, surveys)

**Secondary sources** are interpretations or analyses of primary sources:
- Commentaries
- Theological monographs
- Journal articles
- Reference works

Effective research engages both primary and secondary sources, with primary sources taking precedence.

### C. Exegetical Method

Exegesis (from Greek ἐξήγησις, "to lead out") is the careful interpretation of biblical texts. The exegetical method includes:

1. **Textual criticism**: Establishing the original text
2. **Historical-cultural context**: Understanding the original setting
3. **Literary analysis**: Genre, structure, and rhetorical features
4. **Grammatical analysis**: Syntax and semantics in original languages
5. **Theological synthesis**: Integrating findings with broader biblical theology

### D. Historical Method

Historical research in theology examines the development of doctrine, institutions, and practices over time. It involves:

- Critical evaluation of sources
- Contextual analysis
- Tracing influence and development
- Avoiding anachronism

### E. Systematic Method

Systematic theology organizes biblical teaching topically and constructively. The method involves:

- Gathering relevant biblical data
- Analyzing historical interpretations
- Synthesizing a coherent doctrinal statement
- Addressing contemporary questions

## IV. Formulating Research Questions

### A. Characteristics of Good Research Questions

Effective research questions are:

- **Clear**: Precisely stated and understandable
- **Focused**: Narrow enough to be manageable
- **Significant**: Addressing important issues
- **Researchable**: Capable of being investigated with available resources
- **Original**: Contributing something new to the conversation

### B. Types of Research Questions

**Descriptive**: What does the text say? What did the author mean?
**Analytical**: How does this doctrine develop? What are the components?
**Evaluative**: Is this interpretation valid? Which view is most biblical?
**Applicational**: How should this truth shape ministry practice?

### C. Refining Your Question

Begin with a broad area of interest, then narrow through:

1. Preliminary reading in the field
2. Identifying gaps or debates in scholarship
3. Focusing on a specific text, figure, or issue
4. Formulating a clear, answerable question

## V. Research Ethics

### A. Academic Integrity

Plagiarism—presenting others' work as your own—is a serious ethical violation. Proper citation of sources is essential. When in doubt, cite.

### B. Intellectual Honesty

Represent sources accurately, even when you disagree. Engage opposing views fairly. Acknowledge the limitations of your research.

### C. Spiritual Integrity

Theological research is not merely academic but spiritual. Approach your work with prayer, humility, and openness to the Spirit's guidance.

## VI. Key Points Summary

- Theological research combines faith commitment with academic rigor
- Various methodologies (exegetical, historical, systematic) serve different purposes
- Good research questions are clear, focused, significant, and researchable
- Academic and spiritual integrity are essential
- Research should contribute to both scholarship and the church

## VII. Scripture Memory

> "Study to show yourself approved to God, a worker who does not need to be ashamed, rightly dividing the word of truth." — 2 Timothy 2:15 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Literature Review and Source Evaluation",
    content: `# Literature Review and Source Evaluation

## I. Introduction

A literature review is a critical component of any substantial research project. It surveys existing scholarship on your topic, identifies key debates and gaps, and positions your own research within the broader academic conversation. This lesson teaches you how to conduct an effective literature review and evaluate sources critically.

The literature review demonstrates that you understand the field, have engaged with relevant scholarship, and are prepared to make an original contribution. It is not merely a summary of sources but a critical synthesis that advances your argument.

**Learning Objectives:**
- Understand the purpose and structure of a literature review
- Develop skills in locating and evaluating sources
- Learn to synthesize sources into a coherent narrative
- Apply critical thinking to scholarly literature

## II. The Purpose of a Literature Review

### A. Demonstrating Knowledge

The literature review shows that you have mastered the relevant scholarship. It establishes your credibility as a researcher and demonstrates that your work is informed by the best available sources.

### B. Identifying Gaps

By surveying existing research, you identify what has been done and what remains to be explored. Your research should address a gap, question, or problem that the literature reveals.

### C. Positioning Your Research

The literature review situates your work within ongoing scholarly conversations. It shows how your research relates to, builds upon, or challenges existing scholarship.

### D. Providing Context

The review provides readers with the background necessary to understand your research. It introduces key concepts, debates, and figures relevant to your topic.

## III. Finding Sources

### A. Types of Sources

**Books and Monographs**: Comprehensive treatments of topics
**Journal Articles**: Focused, peer-reviewed research
**Dissertations and Theses**: Original research, often unpublished elsewhere
**Reference Works**: Dictionaries, encyclopedias, handbooks
**Primary Sources**: Original texts, documents, data

### B. Search Strategies

**Library Catalogs**: Search your institution's holdings
**Academic Databases**: ATLA Religion Database, JSTOR, Google Scholar
**Bibliographies**: Follow citations in key works
**Consultation**: Ask professors and librarians for recommendations

### C. Evaluating Source Quality

Not all sources are equal. Evaluate sources based on:

- **Authority**: Who is the author? What are their credentials?
- **Publisher**: Is it a reputable academic press or journal?
- **Currency**: Is the source current or dated?
- **Relevance**: Does it directly address your topic?
- **Accuracy**: Is the information reliable and well-documented?
- **Objectivity**: Does the author acknowledge other perspectives?

### D. Peer Review

Peer-reviewed sources have been evaluated by experts before publication. Prioritize peer-reviewed journal articles and books from academic presses.

## IV. Reading and Note-Taking

### A. Strategic Reading

You cannot read every source exhaustively. Develop strategies for efficient reading:

- Read abstracts, introductions, and conclusions first
- Skim for relevant sections
- Read key sources more carefully
- Take notes as you read

### B. Effective Note-Taking

Good notes capture:

- Bibliographic information (for citations)
- Key arguments and evidence
- Relevant quotations (with page numbers)
- Your own reactions and questions

### C. Organizing Notes

Organize notes by theme, not just by source. This facilitates synthesis when writing the review. Consider using note-taking software or a card system.

## V. Writing the Literature Review

### A. Structure

Literature reviews may be organized:

**Chronologically**: Tracing the development of scholarship over time
**Thematically**: Grouping sources by topic or approach
**Methodologically**: Organizing by research methods used
**By School of Thought**: Grouping by interpretive tradition

Choose the structure that best serves your topic and argument.

### B. Synthesis, Not Summary

A literature review is not a series of book reports. It synthesizes sources, showing how they relate to each other and to your research question. Look for:

- Points of agreement and disagreement
- Trends and developments
- Gaps and unanswered questions
- Strengths and weaknesses of different approaches

### C. Critical Engagement

Engage sources critically. This means:

- Evaluating arguments, not just reporting them
- Identifying assumptions and limitations
- Comparing and contrasting different views
- Offering your own assessment

### D. Connecting to Your Research

The literature review should lead naturally to your research question. Show how your project addresses a gap, resolves a debate, or extends existing scholarship.

## VI. Common Pitfalls

### A. Mere Summary

Avoid simply summarizing sources one after another. Synthesize and analyze.

### B. Uncritical Acceptance

Do not accept claims uncritically. Evaluate evidence and arguments.

### C. Ignoring Opposing Views

Engage with scholarship that challenges your position. This strengthens your argument.

### D. Poor Organization

A disorganized review confuses readers. Use clear structure and transitions.

### E. Inadequate Citation

Cite all sources properly. Failure to cite is plagiarism.

## VII. Evaluating Theological Sources

### A. Confessional Commitments

Be aware of authors' theological commitments. A Reformed scholar and a Roman Catholic scholar may interpret the same text differently. This does not disqualify either, but it should inform your reading.

### B. Historical Context

Older sources may reflect the assumptions of their time. Read them in context while evaluating their ongoing relevance.

### C. Scholarly vs. Popular

Distinguish between scholarly and popular sources. Popular books may be useful for illustration but should not be primary sources for academic research.

## VIII. Key Points Summary

- The literature review surveys, synthesizes, and critically evaluates existing scholarship
- Sources should be evaluated for authority, relevance, and quality
- Synthesis involves showing relationships between sources, not just summarizing
- Critical engagement strengthens your research
- The review should position your project within the scholarly conversation

## IX. Scripture Memory

> "The heart of the prudent acquires knowledge, and the ear of the wise seeks knowledge." — Proverbs 18:15 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Thesis Development and Argumentation",
    content: `# Thesis Development and Argumentation

## I. Introduction

The thesis statement is the heart of your capstone project. It articulates your central claim—the argument you will develop and defend throughout your paper. A strong thesis is clear, specific, arguable, and significant. This lesson teaches you how to develop an effective thesis and construct a compelling argument.

Good argumentation is essential for persuasive theological writing. You must not only state your position but also provide evidence, address counterarguments, and lead readers to your conclusion through logical reasoning.

**Learning Objectives:**
- Understand the characteristics of an effective thesis statement
- Develop skills in constructing logical arguments
- Learn to anticipate and address counterarguments
- Apply principles of argumentation to your capstone project

## II. The Thesis Statement

### A. Definition

A thesis statement is a concise declaration of your central argument. It tells readers what you will argue and why it matters. The thesis should be:

- **Clear**: Easily understood, not vague or ambiguous
- **Specific**: Focused on a particular claim, not overly broad
- **Arguable**: A claim that can be debated, not a mere statement of fact
- **Significant**: Addressing an important question or problem

### B. Thesis vs. Topic

A topic is a subject area; a thesis is a claim about that subject.

**Topic**: The doctrine of justification in Paul's letters
**Thesis**: Paul's doctrine of justification is forensic, declaring sinners righteous on the basis of Christ's imputed righteousness, rather than transformative in the sense of making them inherently righteous.

### C. Developing Your Thesis

Thesis development is an iterative process:

1. **Begin with a question**: What do you want to investigate?
2. **Conduct preliminary research**: What do scholars say?
3. **Formulate a working thesis**: Your initial answer to the question
4. **Refine through research**: Adjust as you learn more
5. **Finalize your thesis**: A clear, defensible claim

### D. Testing Your Thesis

Ask yourself:

- Can someone disagree with this claim?
- Is this specific enough to argue in my paper's length?
- Do I have evidence to support this claim?
- Does this address a significant question?

## III. The Structure of Arguments

### A. Claims, Evidence, and Warrants

An argument consists of:

**Claim**: The assertion you are making
**Evidence**: The data, facts, or sources that support the claim
**Warrant**: The reasoning that connects evidence to claim

Example:
- **Claim**: The Gospel of John was written by the apostle John.
- **Evidence**: Early church testimony (Irenaeus, Polycarp), internal evidence (eyewitness details), the "beloved disciple" references.
- **Warrant**: Eyewitness testimony and early attribution are reliable indicators of authorship.

### B. Types of Arguments

**Deductive arguments** move from general principles to specific conclusions. If the premises are true and the logic valid, the conclusion necessarily follows.

**Inductive arguments** move from specific evidence to general conclusions. The conclusion is probable, not certain.

**Abductive arguments** (inference to the best explanation) argue that a hypothesis best explains the available evidence.

Theological arguments often combine these types.

### C. Logical Fallacies

Avoid common fallacies:

- **Ad hominem**: Attacking the person rather than the argument
- **Straw man**: Misrepresenting an opponent's position
- **False dilemma**: Presenting only two options when more exist
- **Appeal to authority**: Citing an authority without evidence
- **Circular reasoning**: Assuming what you are trying to prove
- **Hasty generalization**: Drawing conclusions from insufficient evidence

## IV. Building Your Argument

### A. Outlining

Before writing, outline your argument:

1. **Introduction**: Present the problem and thesis
2. **Background**: Provide necessary context
3. **Main arguments**: Develop your case point by point
4. **Counterarguments**: Address opposing views
5. **Conclusion**: Summarize and state implications

### B. Paragraph Structure

Each paragraph should:

- Begin with a topic sentence stating the paragraph's main point
- Provide evidence and analysis supporting that point
- Connect to the overall argument

### C. Transitions

Use transitions to guide readers through your argument. Show how each section relates to what precedes and follows.

### D. Evidence

Support your claims with appropriate evidence:

- Biblical texts (in context, properly exegeted)
- Historical sources
- Scholarly authorities
- Logical reasoning

## V. Addressing Counterarguments

### A. Why Address Counterarguments?

Engaging opposing views strengthens your argument by:

- Demonstrating awareness of the debate
- Showing intellectual honesty
- Anticipating reader objections
- Refining your own position

### B. How to Address Counterarguments

1. **State the opposing view fairly**: Do not create a straw man
2. **Acknowledge any valid points**: Concede where appropriate
3. **Refute the argument**: Show why your position is stronger
4. **Maintain a respectful tone**: Critique ideas, not persons

### C. Concession and Rebuttal

Sometimes you must concede a point while maintaining your overall argument. This shows nuance and intellectual honesty.

Example: "While it is true that some early manuscripts omit this phrase, the weight of textual evidence and the internal coherence of the passage support its authenticity."

## VI. Persuasive Writing

### A. Ethos, Pathos, Logos

Classical rhetoric identifies three modes of persuasion:

**Ethos**: Credibility and character of the writer
**Pathos**: Emotional appeal
**Logos**: Logical argument

Academic writing emphasizes logos but should not neglect ethos (establishing credibility) or appropriate pathos (engaging readers' concerns).

### B. Clarity and Precision

Write clearly. Avoid jargon when simpler terms suffice. Define technical terms when you use them. Be precise in your claims.

### C. Tone

Maintain a scholarly tone—confident but not arrogant, critical but not dismissive. Respect your readers and your sources.

## VII. Key Points Summary

- A strong thesis is clear, specific, arguable, and significant
- Arguments consist of claims, evidence, and warrants
- Avoid logical fallacies and engage counterarguments fairly
- Structure your argument with clear organization and transitions
- Write with clarity, precision, and appropriate tone

## VIII. Scripture Memory

> "But sanctify the Lord God in your hearts, and always be ready to give a defense to everyone who asks you a reason for the hope that is in you, with meekness and fear." — 1 Peter 3:15 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Biblical Exegesis for the Capstone",
    content: `# Biblical Exegesis for the Capstone

## I. Introduction

Exegesis—the careful, systematic interpretation of Scripture—is foundational to theological research. Whether your capstone focuses on a specific biblical text or draws on Scripture to address a doctrinal or practical question, sound exegetical method is essential. This lesson reviews the principles and practices of biblical exegesis as applied to capstone research.

The goal of exegesis is to understand what the biblical author intended to communicate to the original audience. This meaning then becomes the basis for theological reflection and contemporary application.

**Learning Objectives:**
- Review the principles of sound biblical exegesis
- Apply exegetical methods to capstone research
- Integrate exegesis with theological synthesis
- Avoid common exegetical errors

## II. The Exegetical Process

### A. Text Selection and Delimitation

Begin by selecting and delimiting your passage:

- Identify the literary unit (pericope)
- Note the boundaries marked by genre, theme, or structure
- Consider the passage's place in the larger book and canon

### B. Textual Criticism

Establish the text you are interpreting:

- Consult critical editions (NA28, BHS)
- Note significant textual variants
- Evaluate the evidence for different readings
- Explain your textual decisions

### C. Historical-Cultural Context

Understand the world behind the text:

- Author, audience, date, and occasion
- Historical circumstances
- Cultural practices and assumptions
- Geographical and political setting

### D. Literary Context

Examine the text's literary setting:

- Immediate context (surrounding passages)
- Book-level context (themes, structure, purpose)
- Canonical context (place in the whole Bible)

### E. Genre Analysis

Identify the literary genre:

- Narrative, poetry, prophecy, wisdom, apocalyptic, epistle, etc.
- Genre-specific interpretive principles
- Subgenres and literary forms

### F. Grammatical-Syntactical Analysis

Analyze the language of the text:

- Word studies (etymology, semantic range, contextual meaning)
- Grammatical constructions
- Syntactical relationships
- Discourse features

### G. Theological Analysis

Synthesize the theological message:

- Key theological themes
- Relationship to biblical theology
- Contribution to systematic theology
- Christological connections

### H. Application

Consider contemporary significance:

- Timeless principles vs. culturally bound elements
- Relevance to the church today
- Practical implications for life and ministry

## III. Tools for Exegesis

### A. Original Languages

Proficiency in Hebrew and Greek enables direct engagement with the text. If your language skills are limited, use:

- Interlinear Bibles
- Analytical lexicons
- Grammatical aids
- Multiple translations for comparison

### B. Reference Works

**Lexicons**: BDAG (Greek), HALOT (Hebrew)
**Grammars**: Wallace (Greek), Waltke-O'Connor (Hebrew)
**Concordances**: For word studies
**Bible Dictionaries**: For background information
**Commentaries**: For scholarly interpretation

### C. Commentaries

Use commentaries wisely:

- Consult after doing your own preliminary work
- Use multiple commentaries representing different perspectives
- Distinguish between exegetical and devotional commentaries
- Evaluate arguments, don't just accept conclusions

## IV. Integrating Exegesis and Theology

### A. Biblical Theology

Biblical theology traces themes through the canon, showing how God's revelation unfolds progressively. Connect your exegesis to the broader biblical-theological narrative.

### B. Systematic Theology

Systematic theology organizes biblical teaching topically. Your exegesis should inform and be informed by doctrinal categories.

### C. The Hermeneutical Spiral

Interpretation involves a spiral between the parts and the whole:

- Individual texts inform our understanding of doctrine
- Doctrinal understanding shapes how we read texts
- The process is iterative, refining both exegesis and theology

## V. Common Exegetical Errors

### A. Eisegesis

Reading meaning into the text rather than drawing it out. Guard against imposing your presuppositions on Scripture.

### B. Illegitimate Totality Transfer

Assuming a word carries all its possible meanings in every occurrence. Words have semantic ranges; context determines meaning.

### C. Root Fallacy

Assuming a word's meaning is determined by its etymology. Meaning is determined by usage, not roots.

### D. Overreliance on Word Studies

Words gain meaning in sentences and discourses. Don't isolate words from their syntactical and literary context.

### E. Ignoring Genre

Interpreting poetry as prose, or apocalyptic as literal prediction, leads to misunderstanding.

### F. Proof-Texting

Using isolated verses to support a position without regard for context. Always interpret in context.

## VI. Presenting Exegesis in Your Capstone

### A. Depth vs. Breadth

Balance thorough exegesis of key texts with broader coverage of relevant passages. Not every verse requires the same depth of analysis.

### B. Documentation

Cite your sources. Acknowledge where you follow or depart from other interpreters.

### C. Clarity

Explain technical terms. Write for an educated but not specialist audience.

### D. Integration

Weave exegesis into your argument. Don't present exegesis as a separate section disconnected from your thesis.

## VII. Key Points Summary

- Exegesis follows a systematic process from text to application
- Use appropriate tools while developing your own interpretive skills
- Integrate exegesis with biblical and systematic theology
- Avoid common exegetical fallacies
- Present exegesis clearly and in service of your argument

## VIII. Scripture Memory

> "Be diligent to present yourself approved to God, a worker who does not need to be ashamed, rightly dividing the word of truth." — 2 Timothy 2:15 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Writing and Style for Theological Papers",
    content: `# Writing and Style for Theological Papers

## I. Introduction

Excellent research deserves excellent writing. Clear, precise, and engaging prose communicates your ideas effectively and demonstrates your competence as a scholar. This lesson covers the principles of good academic writing, with particular attention to the conventions of theological scholarship.

Writing is not merely a means of reporting research; it is an integral part of the research process. As you write, you clarify your thinking, discover gaps in your argument, and refine your ideas.

**Learning Objectives:**
- Understand the principles of clear academic writing
- Apply conventions of theological writing
- Develop skills in revision and editing
- Produce polished, professional prose

## II. Principles of Academic Writing

### A. Clarity

Clarity is the cardinal virtue of academic writing. Your goal is to communicate ideas, not to impress with complexity. Write so that readers understand your meaning on the first reading.

**Strategies for clarity**:
- Use simple words when they suffice
- Keep sentences manageable in length
- Define technical terms
- Avoid ambiguous pronouns
- Use active voice when possible

### B. Precision

Say exactly what you mean. Vague language obscures your argument and frustrates readers.

**Imprecise**: "Many scholars think this passage is important."
**Precise**: "Wright, Dunn, and Hays argue that Romans 3:21-26 is the theological center of Paul's letter."

### C. Concision

Eliminate unnecessary words. Every word should earn its place.

**Wordy**: "It is important to note that the fact of the matter is that Paul's theology of justification is central to his thought."
**Concise**: "Justification is central to Paul's theology."

### D. Coherence

Ideas should flow logically. Use transitions to guide readers through your argument. Each paragraph should have a clear purpose and connect to what precedes and follows.

### E. Engagement

Academic writing need not be dull. Engage readers with clear arguments, vivid examples, and a sense of why the topic matters.

## III. Structure and Organization

### A. The Introduction

The introduction should:

- Capture the reader's attention
- Introduce the topic and its significance
- State the thesis clearly
- Preview the structure of the paper

### B. The Body

The body develops your argument through:

- Clear topic sentences for each paragraph
- Evidence and analysis supporting each point
- Logical progression from one section to the next
- Engagement with counterarguments

### C. The Conclusion

The conclusion should:

- Summarize the main argument
- Restate the thesis in light of the evidence presented
- Discuss implications and significance
- Suggest directions for further research (if appropriate)

### D. Headings and Subheadings

Use headings to organize longer papers. Headings help readers navigate and signal the structure of your argument.

## IV. Style Conventions

### A. Tone

Academic writing is formal but not stuffy. Avoid:

- Colloquialisms and slang
- Contractions (use "do not" rather than "don't")
- First-person plural ("we") when you mean "I"
- Overly casual language

Appropriate first-person ("I argue...") is acceptable in most theological writing.

### B. Tense

- Use present tense for general truths and ongoing states ("Paul argues...")
- Use past tense for historical events ("Jesus died...")
- Be consistent within sections

### C. Inclusive Language

Use gender-inclusive language when referring to people in general. Follow your institution's guidelines.

### D. Citation Style

Follow the required citation style (Turabian, SBL, APA, etc.) consistently. Proper citation:

- Gives credit to sources
- Allows readers to verify your claims
- Demonstrates scholarly integrity

### E. Quotations

- Quote when the exact wording matters
- Introduce quotations with context
- Integrate quotations grammatically
- Analyze quotations; don't let them speak for themselves
- Block indent quotations over a certain length (typically 4-5 lines)

## V. The Writing Process

### A. Drafting

Get ideas on paper without worrying about perfection. The first draft is for discovery; revision is for refinement.

**Strategies**:
- Write regularly, even in short sessions
- Start with sections you find easiest
- Don't edit while drafting
- Accept imperfection in early drafts

### B. Revision

Revision is where good writing happens. Revise for:

- Argument: Is the thesis clear and well-supported?
- Organization: Does the structure serve the argument?
- Clarity: Will readers understand?
- Evidence: Is every claim supported?
- Style: Is the prose clear and engaging?

### C. Editing

Editing addresses sentence-level issues:

- Grammar and syntax
- Word choice
- Punctuation
- Spelling

### D. Proofreading

Proofread for typos and formatting errors. Read aloud or have someone else read your work.

## VI. Common Writing Problems

### A. Passive Voice Overuse

Passive voice obscures agency and weakens prose.

**Passive**: "It has been argued by scholars that..."
**Active**: "Scholars argue that..."

Use passive voice deliberately, not by default.

### B. Nominalization

Turning verbs into nouns weakens prose.

**Nominalized**: "The investigation of the text was conducted by the author."
**Verbal**: "The author investigated the text."

### C. Hedging

Excessive hedging weakens your claims.

**Over-hedged**: "It might perhaps be suggested that Paul may possibly have intended..."
**Confident**: "Paul likely intended..."

Be appropriately confident in your claims.

### D. Jargon

Use technical terms when necessary, but don't use jargon to sound impressive. Define terms for your audience.

## VII. Key Points Summary

- Clarity, precision, and concision are essential
- Structure your paper with clear introduction, body, and conclusion
- Follow academic conventions for tone, tense, and citation
- Revise thoroughly; good writing is rewriting
- Avoid common problems like passive voice overuse and jargon

## VIII. Scripture Memory

> "Let your speech always be with grace, seasoned with salt, that you may know how you ought to answer each one." — Colossians 4:6 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Citation, Documentation, and Academic Integrity",
    content: `# Citation, Documentation, and Academic Integrity

## I. Introduction

Proper citation and documentation are essential to academic integrity. They give credit to sources, enable readers to verify your claims, and demonstrate your engagement with scholarship. This lesson covers the principles of citation, common documentation styles, and the ethical foundations of academic honesty.

Academic integrity is not merely about following rules; it reflects the character of the Christian scholar. Honesty, humility, and respect for others' work are virtues that should characterize all our endeavors.

**Learning Objectives:**
- Understand the purposes and principles of citation
- Apply common documentation styles correctly
- Recognize and avoid plagiarism
- Cultivate academic integrity as a spiritual discipline

## II. The Purpose of Citation

### A. Giving Credit

Citation acknowledges the intellectual contributions of others. When you use someone's ideas, arguments, or words, you must credit them. This is a matter of honesty and respect.

### B. Enabling Verification

Citations allow readers to check your sources. This transparency is essential to scholarly discourse. Readers can evaluate your evidence and pursue topics further.

### C. Demonstrating Engagement

Citations show that you have engaged with relevant scholarship. They establish your credibility and situate your work within the academic conversation.

### D. Avoiding Plagiarism

Proper citation prevents plagiarism—the presentation of others' work as your own. Plagiarism is a serious ethical violation with significant consequences.

## III. What to Cite

### A. Direct Quotations

Any words taken directly from a source must be placed in quotation marks (or block-indented for longer quotes) and cited.

### B. Paraphrases

When you restate someone's ideas in your own words, you must still cite the source. Paraphrasing without citation is plagiarism.

### C. Ideas and Arguments

Even if you don't quote or paraphrase, you must cite sources for ideas, arguments, or interpretations that are not your own.

### D. Facts and Data

Common knowledge need not be cited (e.g., "Paul wrote Romans"). But specific facts, statistics, or data from sources require citation.

### E. When in Doubt, Cite

If you're unsure whether to cite, err on the side of citation. Over-citation is a minor problem; plagiarism is a major one.

## IV. Documentation Styles

### A. Turabian/Chicago Style

Turabian (based on Chicago Manual of Style) is widely used in theological and humanities writing. It uses footnotes or endnotes with a bibliography.

**Footnote example**:
1. N.T. Wright, *The Resurrection of the Son of God* (Minneapolis: Fortress, 2003), 45.

**Bibliography example**:
Wright, N.T. *The Resurrection of the Son of God*. Minneapolis: Fortress, 2003.

### B. SBL Style

The Society of Biblical Literature Handbook is standard for biblical studies. It is similar to Turabian but with specific conventions for biblical and ancient sources.

### C. APA Style

American Psychological Association style uses in-text parenthetical citations with a reference list. It is common in social sciences and some practical theology.

**In-text example**:
(Wright, 2003, p. 45)

### D. Consistency

Whatever style you use, apply it consistently throughout your paper. Follow your institution's requirements.

## V. Plagiarism

### A. Definition

Plagiarism is presenting someone else's work—words, ideas, or structure—as your own. It includes:

- Copying text without quotation marks and citation
- Paraphrasing without citation
- Using someone's argument or structure without acknowledgment
- Submitting work done by others
- Self-plagiarism (reusing your own previous work without disclosure)

### B. Consequences

Plagiarism can result in:

- Failing the assignment or course
- Academic probation or expulsion
- Damage to reputation
- Loss of degree

### C. Avoiding Plagiarism

- Take careful notes with full bibliographic information
- Distinguish clearly between your words and sources' words
- Cite all sources
- Use plagiarism detection tools to check your work
- When in doubt, cite

### D. Unintentional Plagiarism

Plagiarism can be unintentional but is still a violation. Poor note-taking, careless paraphrasing, or ignorance of citation rules can lead to unintentional plagiarism. The solution is careful practice and attention to proper documentation.

## VI. Academic Integrity as Spiritual Discipline

### A. Honesty

Scripture commands truthfulness: "Therefore, putting away lying, 'Let each one of you speak truth with his neighbor'" (Ephesians 4:25). Academic honesty is an application of this command.

### B. Humility

Acknowledging our dependence on others' work reflects humility. No scholar works in isolation. We build on the contributions of those who came before.

### C. Stewardship

We are stewards of the gifts God has given us. Using our minds honestly and diligently honors God and serves others.

### D. Witness

Our integrity as scholars is part of our Christian witness. Dishonesty undermines our testimony and brings reproach on the gospel.

## VII. Practical Tips

### A. Organize Your Research

Keep careful records of all sources from the beginning. Note bibliographic information, page numbers, and whether text is quoted or paraphrased.

### B. Use Citation Management Tools

Software like Zotero, EndNote, or Mendeley can help organize sources and generate citations.

### C. Learn Your Style Guide

Invest time in learning the required citation style. Keep a style manual handy.

### D. Proofread Citations

Check that all citations are complete and correctly formatted. Verify that every source cited appears in your bibliography.

## VIII. Key Points Summary

- Citation gives credit, enables verification, and demonstrates engagement
- Cite direct quotes, paraphrases, ideas, and specific facts
- Follow the required documentation style consistently
- Plagiarism is a serious ethical violation with significant consequences
- Academic integrity reflects Christian character and witness

## IX. Scripture Memory

> "Therefore, putting away lying, 'Let each one of you speak truth with his neighbor,' for we are members of one another." — Ephesians 4:25 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Oral Presentation and Defense",
    content: `# Oral Presentation and Defense

## I. Introduction

Many capstone projects culminate in an oral presentation or defense. This is an opportunity to share your research, demonstrate your expertise, and engage with faculty and peers. Effective presentation skills are essential for ministry and academic contexts alike. This lesson prepares you for successful oral presentation and defense of your capstone project.

The defense is not an adversarial proceeding but a scholarly conversation. It is your opportunity to explain your work, respond to questions, and demonstrate your mastery of the subject.

**Learning Objectives:**
- Understand the purpose and format of capstone presentations
- Develop skills in oral communication
- Prepare for questions and discussion
- Present with confidence and clarity

## II. The Purpose of the Defense

### A. Demonstration of Mastery

The defense demonstrates that you have mastered your topic. You should be able to explain your research clearly, answer questions, and engage with critiques.

### B. Scholarly Conversation

The defense is a conversation with scholars who have read your work. They want to understand your thinking, probe your arguments, and help you refine your ideas.

### C. Celebration of Achievement

Completing a capstone project is a significant accomplishment. The defense is an occasion to celebrate your work and receive recognition.

## III. Preparing Your Presentation

### A. Know Your Audience

Consider who will be present:

- Faculty committee members
- Peers and classmates
- Family and friends (if invited)

Tailor your presentation to your audience's knowledge level.

### B. Structure Your Presentation

A typical presentation includes:

1. **Introduction**: State your topic and thesis
2. **Background**: Provide necessary context
3. **Methodology**: Explain your approach
4. **Main Findings**: Present your key arguments and evidence
5. **Conclusion**: Summarize and state significance
6. **Questions**: Invite discussion

### C. Time Management

Know your time limit and practice to stay within it. A common structure:

- 15-20 minutes for presentation
- 20-30 minutes for questions

Plan to use less than your allotted time to allow for questions.

### D. Visual Aids

If using slides (PowerPoint, etc.):

- Keep slides simple and uncluttered
- Use bullet points, not paragraphs
- Include relevant images, charts, or diagrams
- Don't read from slides; use them as prompts
- Test technology beforehand

### E. Practice

Practice your presentation multiple times:

- Practice aloud, not just in your head
- Time yourself
- Practice before friends or family
- Anticipate questions and prepare responses

## IV. Delivering Your Presentation

### A. Presence and Posture

- Stand confidently
- Make eye contact with your audience
- Use natural gestures
- Avoid nervous habits (pacing, fidgeting)

### B. Voice and Pace

- Speak clearly and at a moderate pace
- Vary your tone to maintain interest
- Pause for emphasis
- Project your voice to reach the back of the room

### C. Engagement

- Connect with your audience
- Show enthusiasm for your topic
- Invite engagement through questions or discussion

### D. Handling Nerves

Nervousness is normal. Strategies to manage it:

- Prepare thoroughly
- Practice repeatedly
- Breathe deeply before beginning
- Focus on your message, not yourself
- Remember that your audience wants you to succeed

## V. The Question and Answer Session

### A. Listening Carefully

Listen to questions fully before responding. Make sure you understand what is being asked. It's acceptable to ask for clarification.

### B. Responding Thoughtfully

- Take a moment to think before answering
- Answer directly and concisely
- Provide evidence for your claims
- Acknowledge when you don't know something

### C. Handling Difficult Questions

- Stay calm and respectful
- Don't become defensive
- Acknowledge valid criticisms
- Explain your reasoning
- It's okay to say, "That's a good question; I would need to research that further."

### D. Engaging with Critique

View critique as an opportunity to learn, not an attack. Engage thoughtfully with suggestions for improvement.

## VI. Common Questions

Anticipate questions such as:

- Why did you choose this topic?
- How does your thesis differ from other scholars?
- What are the limitations of your research?
- How would you respond to [counterargument]?
- What are the implications for ministry/the church?
- What would you do differently if you could start over?
- What directions for future research does your work suggest?

## VII. After the Defense

### A. Revisions

You may be asked to make revisions based on feedback. Take this seriously and complete revisions promptly.

### B. Reflection

Reflect on what you learned through the process—both about your topic and about yourself as a researcher.

### C. Celebration

Celebrate your accomplishment! Completing a capstone project is a significant achievement.

## VIII. Key Points Summary

- The defense demonstrates mastery and invites scholarly conversation
- Prepare a clear, well-structured presentation
- Practice thoroughly and manage your time
- Deliver with confidence, clarity, and engagement
- Handle questions thoughtfully and graciously

## IX. Scripture Memory

> "Let your speech always be with grace, seasoned with salt, that you may know how you ought to answer each one." — Colossians 4:6 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Integrating Faith, Learning, and Ministry",
    content: `# Integrating Faith, Learning, and Ministry

## I. Introduction

The capstone project is not merely an academic exercise; it is an opportunity to integrate faith, learning, and ministry. Theological education exists to serve the church and advance the kingdom of God. This lesson explores how your capstone can contribute to this mission and how the skills you develop will serve your future ministry.

The integration of faith and learning is a distinctive mark of Christian scholarship. We do not compartmentalize our faith from our academic work but bring all our thinking under the lordship of Christ.

**Learning Objectives:**
- Understand the integration of faith and learning
- Connect academic research to ministry application
- Reflect on personal and spiritual formation through research
- Envision how your capstone serves the church

## II. The Integration of Faith and Learning

### A. All Truth Is God's Truth

The Christian scholar operates with the conviction that all truth is God's truth. Whether we study Scripture, history, science, or culture, we are exploring God's creation and revelation. There is no secular/sacred divide in the pursuit of knowledge.

Augustine expressed this: "Let every good and true Christian understand that wherever truth may be found, it belongs to his Master."

### B. The Lordship of Christ Over the Mind

Paul calls believers to "bring every thought into captivity to the obedience of Christ" (2 Corinthians 10:5). This includes our academic thinking. We approach scholarship with Christian presuppositions and evaluate all claims in light of Scripture.

### C. Faith Seeking Understanding

Anselm's motto—"fides quaerens intellectum" (faith seeking understanding)—captures the dynamic of Christian scholarship. We begin with faith and pursue deeper understanding through study and reflection.

### D. The Renewal of the Mind

Romans 12:2 calls for the transformation of our minds: "Do not be conformed to this world, but be transformed by the renewing of your mind." Theological education is part of this renewal, shaping how we think about God, the world, and ourselves.

## III. Connecting Research to Ministry

### A. The Purpose of Theological Education

Theological education exists to prepare men and women for effective ministry. Your capstone should contribute to this purpose, not merely fulfill an academic requirement.

### B. Practical Application

Consider how your research applies to ministry contexts:

- **Preaching and Teaching**: How does your exegesis inform proclamation?
- **Pastoral Care**: How does your theology guide counseling and care?
- **Leadership**: How does your research inform church leadership?
- **Evangelism and Apologetics**: How does your work equip for witness?
- **Discipleship**: How does your study promote spiritual growth?

### C. Serving the Church

The church is the primary context for ministry. Consider how your capstone serves the church:

- Does it address a real need in the church?
- Can it be communicated to non-specialists?
- Does it build up the body of Christ?

### D. Contextual Sensitivity

Ministry occurs in specific contexts. Consider how your research applies in your particular context—cultural, denominational, geographical.

## IV. Personal and Spiritual Formation

### A. Research as Spiritual Discipline

The capstone process can be a spiritual discipline. Prayerful study of Scripture, humble engagement with others' ideas, and patient perseverance through challenges all form Christian character.

### B. Virtues of the Scholar

Christian scholarship cultivates virtues:

- **Humility**: Acknowledging our limitations and dependence on others
- **Honesty**: Pursuing truth and representing sources fairly
- **Diligence**: Working carefully and thoroughly
- **Patience**: Persevering through difficulties
- **Love**: Serving others through our work

### C. Transformation Through Study

Deep engagement with Scripture and theology should transform us. We do not merely study about God; we encounter Him through His Word.

### D. Integrating Head and Heart

Avoid the danger of mere intellectualism. Knowledge should lead to worship, obedience, and love. As Jonathan Edwards taught, true religion involves both the understanding and the affections.

## V. The Capstone as Contribution

### A. Contributing to Scholarship

Your capstone contributes to the ongoing conversation of theological scholarship. Even a modest contribution advances understanding and serves future researchers.

### B. Contributing to the Church

More importantly, your capstone serves the church. Whether directly (a practical ministry project) or indirectly (foundational research), your work should build up the body of Christ.

### C. Contributing to Your Formation

The process of completing a capstone forms you as a scholar, minister, and Christian. The skills, habits, and character developed will serve you throughout your ministry.

## VI. Looking Forward

### A. Lifelong Learning

The capstone is not the end of learning but a milestone in a lifelong journey. Continue to read, study, and grow throughout your ministry.

### B. Continued Research

Some capstone projects open doors for further research—doctoral studies, publications, or ongoing ministry projects.

### C. Applying Your Skills

The skills developed in capstone research—critical thinking, clear writing, careful exegesis, theological synthesis—will serve you in preaching, teaching, counseling, and leadership.

### D. Serving Christ

Ultimately, all our work is service to Christ. "And whatever you do, do it heartily, as to the Lord and not to men" (Colossians 3:23). May your capstone and all your ministry glorify Him.

## VII. Key Points Summary

- Christian scholarship integrates faith and learning under Christ's lordship
- Research should connect to ministry application and serve the church
- The capstone process forms character and cultivates scholarly virtues
- Your work contributes to scholarship, the church, and your own formation
- Continue learning and serving Christ throughout your ministry

## VIII. Scripture Memory

> "And whatever you do, do it heartily, as to the Lord and not to men, knowing that from the Lord you will receive the reward of the inheritance; for you serve the Lord Christ." — Colossians 3:23-24 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Capstone Project Completion and Submission",
    content: `# Capstone Project Completion and Submission

## I. Introduction

The final stage of your capstone journey is completion and submission. This lesson guides you through the process of finalizing your project, ensuring it meets all requirements, and submitting it for evaluation. Careful attention to these final steps will ensure that your hard work is presented in the best possible light.

Completion involves more than finishing the writing. It includes thorough revision, proper formatting, final proofreading, and adherence to submission requirements. This lesson provides a comprehensive checklist for successful completion.

**Learning Objectives:**
- Understand the requirements for capstone completion
- Apply final revision and editing strategies
- Ensure proper formatting and documentation
- Navigate the submission process successfully

## II. Final Revision

### A. Content Review

Before finalizing, review your content:

- Does the thesis remain clear and consistent throughout?
- Is every claim supported by evidence?
- Have you addressed counterarguments?
- Is the argument logically structured?
- Does the conclusion follow from the evidence?

### B. Structural Review

Examine the structure:

- Is the introduction effective?
- Do sections flow logically?
- Are transitions clear?
- Is the conclusion satisfying?
- Are headings and subheadings appropriate?

### C. Feedback Integration

If you received feedback from advisors or peers:

- Have you addressed all substantive concerns?
- Have you incorporated helpful suggestions?
- Have you explained any feedback you chose not to follow?

## III. Editing and Proofreading

### A. Sentence-Level Editing

Review each sentence for:

- Clarity and precision
- Grammar and syntax
- Word choice
- Concision

### B. Proofreading

Check for:

- Spelling errors
- Typographical errors
- Punctuation mistakes
- Formatting inconsistencies

### C. Strategies for Effective Proofreading

- Read aloud to catch errors
- Read backwards (sentence by sentence) to focus on mechanics
- Use spell-check but don't rely on it exclusively
- Have someone else proofread
- Take breaks between writing and proofreading

## IV. Formatting

### A. General Formatting Requirements

Follow your institution's formatting guidelines:

- Margins (typically 1 inch)
- Font (typically Times New Roman, 12 pt)
- Line spacing (typically double-spaced)
- Page numbers
- Title page format
- Heading styles

### B. Front Matter

Typical front matter includes:

- Title page
- Abstract (if required)
- Table of contents
- List of abbreviations (if needed)
- Acknowledgments (optional)

### C. Back Matter

Typical back matter includes:

- Bibliography/Works Cited
- Appendices (if needed)
- Glossary (if needed)

### D. Citation Formatting

Ensure all citations are:

- Complete and accurate
- Consistently formatted
- Matching the required style guide

## V. Final Checklist

### A. Content

☐ Thesis is clear and consistently argued
☐ All claims are supported by evidence
☐ Counterarguments are addressed
☐ Exegesis is sound and well-documented
☐ Sources are properly cited
☐ Conclusion summarizes and states significance

### B. Writing

☐ Prose is clear, precise, and concise
☐ Grammar and syntax are correct
☐ Spelling and punctuation are correct
☐ Tone is appropriately academic
☐ Transitions are clear

### C. Formatting

☐ Follows institutional guidelines
☐ Margins, font, and spacing are correct
☐ Page numbers are present
☐ Title page is properly formatted
☐ Headings are consistent
☐ Bibliography is complete and correctly formatted

### D. Documentation

☐ All sources are cited
☐ Citation style is consistent
☐ Bibliography includes all cited sources
☐ No plagiarism

### E. Requirements

☐ Meets minimum length requirements
☐ Includes all required sections
☐ Follows any specific assignment guidelines
☐ Submitted by deadline

## VI. The Submission Process

### A. Know the Requirements

Understand exactly what is required:

- Submission format (paper, electronic, both)
- File format (Word, PDF)
- Number of copies
- Submission location or platform
- Deadline (date and time)

### B. Submit Early

Don't wait until the last minute. Technical problems, printer failures, or other issues can derail last-minute submissions. Submit at least a day early if possible.

### C. Confirm Receipt

After submitting:

- Keep a copy for your records
- Confirm that your submission was received
- Follow up if you don't receive confirmation

### D. Prepare for Defense

If a defense is required:

- Schedule your defense
- Prepare your presentation
- Review your project thoroughly
- Anticipate questions

## VII. After Submission

### A. Celebrate

Completing a capstone project is a significant achievement. Take time to celebrate and rest.

### B. Reflect

Reflect on what you learned:

- About your topic
- About research and writing
- About yourself
- About your faith and calling

### C. Apply

Consider how you will apply what you learned in future ministry and study.

### D. Continue

The capstone is a milestone, not a destination. Continue learning, growing, and serving.

## VIII. Key Points Summary

- Final revision addresses content, structure, and feedback
- Careful editing and proofreading ensure polished prose
- Proper formatting follows institutional guidelines
- Use the checklist to ensure completeness
- Submit early and confirm receipt

## IX. Scripture Memory

> "I have fought the good fight, I have finished the race, I have kept the faith." — 2 Timothy 4:7 (NKJV)

---
*Licensed to Larry Fisher*`
  }
];

// Insert lessons (starting from order 2 since 1 lesson already exists)
for (let i = 0; i < lessons.length; i++) {
  const lesson = lessons[i];
  const lessonOrder = i + 2;
  const [result] = await connection.execute(
    `INSERT INTO lessons (courseId, title, content, lessonOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [courseId, lesson.title, lesson.content, lessonOrder]
  );
  console.log(`Created lesson ${i+1}: ${lesson.title} (ID: ${result.insertId})`);
}

console.log('\nDIV111 lessons created successfully!');
await connection.end();
