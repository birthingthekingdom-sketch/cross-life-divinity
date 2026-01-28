import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Create CHAP101 Chaplaincy Training course
const courseData = {
  code: 'CHAP101',
  title: 'Chaplaincy Training',
  description: 'Comprehensive Clinical Pastoral Education (CPE) training for institutional chaplaincy. This course prepares students for ministry in hospitals, hospices, prisons, military, and corporate settings. Covers pastoral care theory, crisis intervention, spiritual assessment, interfaith sensitivity, and professional ethics.',
  price: 325.00,
  cpdHours: 30,
  level: 'advanced',
  category: 'ministry',
  totalLessons: 10,
  isVisible: true,
  courseType: 'theological'
};

const [courseResult] = await connection.execute(
  `INSERT INTO courses (code, title, description, price, cpdHours, totalLessons, courseType, requiresBackgroundCheck, backgroundCheckFee, colorTheme, createdAt, updatedAt) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
  [courseData.code, courseData.title, courseData.description, 275, 30, 10, 'theological', true, 50, 'purple']
);

const courseId = courseResult.insertId;
console.log(`Created CHAP101 course with ID: ${courseId}`);

// 10 comprehensive CPE lessons
const lessons = [
  {
    title: 'Introduction to Clinical Pastoral Education',
    content: `<h2>Introduction to Clinical Pastoral Education (CPE)</h2>
<p>Clinical Pastoral Education represents one of the most transformative approaches to ministerial formation in modern religious education. This foundational lesson introduces students to the history, philosophy, and methodology of CPE as a professional training model for chaplaincy ministry.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand the historical development of CPE from its origins in the 1920s</li>
<li>Identify the core components of the CPE educational model</li>
<li>Recognize the role of supervised clinical experience in pastoral formation</li>
<li>Articulate the integration of theological reflection with pastoral practice</li>
</ul>

<h3>Historical Background</h3>
<p>CPE emerged from the vision of Anton Boisen, Richard Cabot, and other pioneers who recognized that theological education needed a clinical component. Boisen, a hospital chaplain who had experienced mental illness himself, believed that "living human documents" were as important to study as written texts. This revolutionary approach transformed how ministers are trained for pastoral care.</p>

<h3>The CPE Model</h3>
<p>The CPE educational model integrates four key elements: (1) direct ministry to persons in crisis, (2) detailed reporting and evaluation of that ministry, (3) peer group interaction and feedback, and (4) individual supervision focused on personal and professional growth. This action-reflection model creates a powerful learning environment where theory meets practice.</p>

<h3>Key Points</h3>
<ul>
<li>CPE is experiential education that uses ministry encounters as the primary text</li>
<li>Theological reflection connects pastoral experience with faith traditions</li>
<li>Self-awareness is essential for effective pastoral care</li>
<li>Peer learning and supervision accelerate professional development</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Theology of Pastoral Care',
    content: `<h2>Theology of Pastoral Care</h2>
<p>Effective chaplaincy ministry requires a robust theological foundation that informs and shapes pastoral practice. This lesson explores the biblical and theological bases for pastoral care, examining how Christian theology provides a framework for ministry to those in crisis.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Articulate a biblical theology of pastoral care</li>
<li>Understand the concept of Imago Dei and its implications for ministry</li>
<li>Explore theodicy and its relevance to chaplaincy</li>
<li>Develop a personal theology of presence and compassion</li>
</ul>

<h3>Biblical Foundations</h3>
<p>The Hebrew concept of <em>hesed</em> (חֶסֶד) - steadfast love and covenant faithfulness - provides a foundational understanding of God's care for humanity. In the New Testament, Jesus embodies pastoral care through his ministry of healing, teaching, and presence with those who suffer. The Greek term <em>paraklesis</em> (παράκλησις) describes the comfort and encouragement that characterizes Christian pastoral ministry.</p>

<h3>Theological Themes</h3>
<p>Several theological themes inform chaplaincy practice: the Incarnation demonstrates God's willingness to enter human suffering; the Cross reveals redemptive meaning in suffering; the Resurrection offers hope beyond death; and the Holy Spirit empowers ministry presence. These themes shape how chaplains understand their role as representatives of divine care.</p>

<h3>Key Points</h3>
<ul>
<li>Pastoral care flows from God's character as revealed in Scripture</li>
<li>The Incarnation models ministry of presence</li>
<li>Theodicy questions require pastoral sensitivity, not easy answers</li>
<li>Grace and compassion are central to Christian pastoral identity</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Pastoral Identity and Self-Awareness',
    content: `<h2>Pastoral Identity and Self-Awareness</h2>
<p>The chaplain's primary tool is the self. This lesson explores the critical importance of self-awareness in pastoral ministry, examining how personal history, beliefs, and emotional patterns affect the capacity to provide effective spiritual care.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand the role of self-awareness in effective pastoral care</li>
<li>Identify personal strengths and growing edges in ministry</li>
<li>Recognize how personal history shapes pastoral responses</li>
<li>Develop practices for ongoing self-reflection and growth</li>
</ul>

<h3>The Use of Self in Ministry</h3>
<p>Henri Nouwen's concept of the "wounded healer" captures the paradox of pastoral ministry: our wounds, when integrated and understood, become sources of compassion and connection. However, unexamined wounds can lead to harmful ministry patterns. CPE emphasizes rigorous self-examination as essential to pastoral formation.</p>

<h3>Developing Self-Awareness</h3>
<p>Self-awareness develops through multiple practices: verbatim analysis of pastoral conversations, peer feedback in CPE groups, individual supervision, journaling, and spiritual direction. The goal is not perfection but honest recognition of how our humanity affects our ministry. This includes awareness of cultural conditioning, family-of-origin patterns, and theological assumptions.</p>

<h3>Key Points</h3>
<ul>
<li>Self-awareness is foundational to effective pastoral care</li>
<li>Personal wounds can become sources of compassion when integrated</li>
<li>Blind spots in self-understanding limit ministry effectiveness</li>
<li>Ongoing reflection and supervision support continued growth</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Listening and Communication Skills',
    content: `<h2>Listening and Communication Skills</h2>
<p>Active listening is the cornerstone of pastoral care. This lesson develops essential communication skills for chaplaincy ministry, including empathic listening, reflective responses, and the appropriate use of silence and presence.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Master active listening techniques for pastoral conversations</li>
<li>Develop skills in reflective and empathic responding</li>
<li>Understand the therapeutic use of silence</li>
<li>Recognize and avoid common communication barriers</li>
</ul>

<h3>The Art of Listening</h3>
<p>Pastoral listening goes beyond hearing words to attending to the whole person - their emotions, body language, spiritual concerns, and unspoken needs. Carl Rogers' person-centered approach emphasizes unconditional positive regard, empathy, and genuineness as essential conditions for therapeutic communication. These principles apply directly to chaplaincy practice.</p>

<h3>Communication Techniques</h3>
<p>Effective pastoral communication includes: open-ended questions that invite exploration, reflective statements that demonstrate understanding, appropriate self-disclosure that builds connection, and comfortable silence that allows processing. Chaplains must also recognize communication barriers such as advice-giving, premature reassurance, and theological lecturing that shut down authentic dialogue.</p>

<h3>Key Points</h3>
<ul>
<li>Listening is the primary skill in pastoral care</li>
<li>Empathy requires entering another's frame of reference</li>
<li>Silence can be a powerful pastoral tool</li>
<li>Advice-giving often blocks deeper exploration</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Crisis Intervention and Trauma Care',
    content: `<h2>Crisis Intervention and Trauma Care</h2>
<p>Chaplains frequently minister to people in acute crisis - medical emergencies, sudden loss, traumatic events, and life-threatening diagnoses. This lesson equips students with crisis intervention skills and trauma-informed care approaches essential for institutional chaplaincy.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand crisis theory and the stages of crisis response</li>
<li>Develop skills in psychological first aid</li>
<li>Recognize symptoms of trauma and traumatic stress</li>
<li>Apply trauma-informed principles to pastoral care</li>
</ul>

<h3>Understanding Crisis</h3>
<p>Crisis occurs when a person's normal coping mechanisms are overwhelmed by a stressful event. Gerald Caplan's crisis theory identifies the stages of impact, recoil, and adjustment. Chaplains provide stabilizing presence during the acute phase and support meaning-making during recovery. The goal is not to "fix" the crisis but to accompany the person through it.</p>

<h3>Trauma-Informed Care</h3>
<p>Trauma-informed chaplaincy recognizes how traumatic experiences affect the whole person - body, mind, and spirit. Key principles include: safety (physical and emotional), trustworthiness, choice, collaboration, and empowerment. Chaplains must avoid re-traumatization through insensitive questions or premature spiritual interpretations of suffering.</p>

<h3>Key Points</h3>
<ul>
<li>Crisis ministry requires calm, non-anxious presence</li>
<li>Psychological first aid focuses on safety and stabilization</li>
<li>Trauma affects the whole person including spiritual life</li>
<li>Meaning-making is a long-term process, not an immediate goal</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Grief, Loss, and Bereavement Ministry',
    content: `<h2>Grief, Loss, and Bereavement Ministry</h2>
<p>Ministry to the bereaved is central to chaplaincy practice. This lesson explores theories of grief, the diversity of grief responses, and practical approaches to supporting those who mourn in various institutional settings.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand contemporary grief theories and models</li>
<li>Recognize diverse grief responses across cultures</li>
<li>Develop skills for presence with the dying and bereaved</li>
<li>Address spiritual questions raised by death and loss</li>
</ul>

<h3>Understanding Grief</h3>
<p>Contemporary grief theory has moved beyond Kübler-Ross's stage model to recognize grief as a highly individual process. William Worden's task model identifies four tasks of mourning: accepting the reality of loss, processing grief pain, adjusting to a world without the deceased, and finding an enduring connection while embarking on a new life. Chaplains support this process without imposing timelines or expectations.</p>

<h3>Ministry to the Dying</h3>
<p>Chaplaincy includes ministry to those facing death - helping them address unfinished business, facilitating family communication, supporting spiritual preparation, and providing rituals of comfort. The chaplain's non-anxious presence with mortality models the faith community's care and points toward transcendent hope.</p>

<h3>Key Points</h3>
<ul>
<li>Grief is individual and does not follow predictable stages</li>
<li>Cultural and religious backgrounds shape grief expression</li>
<li>Ministry to the dying is a sacred privilege</li>
<li>Presence is more important than words in bereavement care</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Spiritual Assessment and Care Planning',
    content: `<h2>Spiritual Assessment and Care Planning</h2>
<p>Professional chaplaincy requires systematic approaches to spiritual assessment and care planning. This lesson introduces validated assessment tools and frameworks for developing spiritual care interventions in institutional settings.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand the purpose and methods of spiritual assessment</li>
<li>Apply spiritual assessment tools (FICA, HOPE, 7x7)</li>
<li>Develop spiritual care plans based on assessment findings</li>
<li>Document spiritual care in medical records appropriately</li>
</ul>

<h3>Spiritual Assessment Models</h3>
<p>Several validated tools assist chaplains in spiritual assessment. The FICA tool explores Faith, Importance, Community, and Address in care. The HOPE questions examine sources of Hope, Organized religion, Personal spirituality, and Effects on care. George Fitchett's 7x7 model provides comprehensive assessment of holistic and spiritual dimensions. Each tool offers a framework for systematic exploration of spiritual needs.</p>

<h3>Care Planning and Documentation</h3>
<p>Professional chaplaincy requires clear documentation of spiritual assessments and care plans. This includes identifying spiritual needs, setting goals, planning interventions, and evaluating outcomes. Documentation serves continuity of care, demonstrates chaplaincy value, and supports interdisciplinary collaboration. Chaplains must balance thorough documentation with respect for confidentiality.</p>

<h3>Key Points</h3>
<ul>
<li>Spiritual assessment is foundational to professional chaplaincy</li>
<li>Multiple validated tools are available for spiritual assessment</li>
<li>Care plans should be specific, measurable, and patient-centered</li>
<li>Documentation demonstrates chaplaincy's contribution to care</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Interfaith Sensitivity and Religious Diversity',
    content: `<h2>Interfaith Sensitivity and Religious Diversity</h2>
<p>Institutional chaplains serve people of all faiths and none. This lesson develops competency in interfaith ministry, exploring major world religions, secular spiritualities, and approaches to providing inclusive spiritual care.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand core beliefs and practices of major world religions</li>
<li>Develop interfaith competency for diverse ministry contexts</li>
<li>Provide spiritual care to non-religious individuals</li>
<li>Navigate religious differences with sensitivity and respect</li>
</ul>

<h3>World Religions Overview</h3>
<p>Chaplains must have working knowledge of major faith traditions: Judaism (Shabbat, kosher laws, end-of-life practices), Islam (salat, halal requirements, Islamic bioethics), Buddhism (meditation, impermanence, compassion), Hinduism (karma, dharma, death rituals), and others. This knowledge enables respectful care and appropriate referrals to tradition-specific clergy when needed.</p>

<h3>Inclusive Spiritual Care</h3>
<p>Interfaith chaplaincy requires holding one's own faith commitments while genuinely honoring others' spiritual paths. This is not relativism but mature faith that can engage difference without threat. Chaplains serve as "hosts" who create space for diverse spiritual expression rather than imposing their own tradition. This includes ministry to atheists, agnostics, and "spiritual but not religious" individuals.</p>

<h3>Key Points</h3>
<ul>
<li>Chaplains serve all people regardless of religious background</li>
<li>Knowledge of world religions enables respectful care</li>
<li>Interfaith ministry requires secure personal faith identity</li>
<li>Spiritual care extends to non-religious individuals</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Ethics in Chaplaincy Practice',
    content: `<h2>Ethics in Chaplaincy Practice</h2>
<p>Professional chaplaincy is governed by ethical standards that protect both care recipients and chaplains. This lesson examines ethical principles, professional boundaries, confidentiality, and common ethical dilemmas in institutional chaplaincy.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand core ethical principles in chaplaincy practice</li>
<li>Maintain appropriate professional boundaries</li>
<li>Navigate confidentiality in institutional settings</li>
<li>Apply ethical decision-making frameworks</li>
</ul>

<h3>Ethical Principles</h3>
<p>Chaplaincy ethics draw from both religious ethics and healthcare ethics. Core principles include: respect for autonomy (honoring patient choices), beneficence (acting for patient good), non-maleficence (avoiding harm), justice (fair distribution of care), and fidelity (keeping commitments). Professional codes from organizations like the Association of Professional Chaplains provide specific guidance for practice.</p>

<h3>Boundaries and Confidentiality</h3>
<p>Professional boundaries protect the integrity of the pastoral relationship. This includes appropriate physical boundaries, emotional boundaries, and role clarity. Confidentiality in chaplaincy is similar to clergy privilege but operates within institutional contexts where some information sharing may be required. Chaplains must clearly communicate confidentiality limits while maintaining trust.</p>

<h3>Key Points</h3>
<ul>
<li>Ethical practice protects patients and chaplains</li>
<li>Professional boundaries maintain relationship integrity</li>
<li>Confidentiality has limits in institutional settings</li>
<li>Ethical dilemmas require careful discernment and consultation</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  },
  {
    title: 'Chaplaincy in Specialized Settings',
    content: `<h2>Chaplaincy in Specialized Settings</h2>
<p>This capstone lesson explores chaplaincy practice in various institutional contexts - hospitals, hospices, prisons, military, and corporate settings. Each context presents unique challenges and opportunities for spiritual care ministry.</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand the unique dynamics of various chaplaincy settings</li>
<li>Adapt pastoral care approaches to institutional contexts</li>
<li>Navigate organizational culture and interdisciplinary teams</li>
<li>Develop a personal vision for chaplaincy ministry</li>
</ul>

<h3>Healthcare Chaplaincy</h3>
<p>Hospital and hospice chaplains work within medical teams, providing spiritual care during illness, surgery, and end of life. They conduct spiritual assessments, support families, lead rituals, and participate in ethics consultations. Healthcare chaplaincy requires understanding of medical culture, HIPAA regulations, and interdisciplinary collaboration.</p>

<h3>Other Chaplaincy Contexts</h3>
<p>Prison chaplains minister in correctional facilities, addressing spiritual needs of inmates and staff while navigating security requirements. Military chaplains serve armed forces personnel and families, often in deployed settings. Corporate chaplains provide spiritual support in workplace environments. Each setting requires contextual adaptation while maintaining core chaplaincy competencies.</p>

<h3>Key Points</h3>
<ul>
<li>Each chaplaincy setting has unique dynamics and requirements</li>
<li>Core competencies transfer across settings with adaptation</li>
<li>Organizational culture shapes chaplaincy practice</li>
<li>Chaplains serve as bridge between institution and spiritual care</li>
</ul>

<p class="license">Licensed to Larry Fisher</p>`
  }
];

// Insert lessons
for (let i = 0; i < lessons.length; i++) {
  const lesson = lessons[i];
  await connection.execute(
    `INSERT INTO lessons (courseId, title, content, lessonOrder, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [courseId, lesson.title, lesson.content, i + 1]
  );
}
console.log(`Added ${lessons.length} lessons to CHAP101`);

// Get lesson IDs for quiz questions
const [lessonRows] = await connection.execute(
  `SELECT id, lessonOrder FROM lessons WHERE courseId = ? ORDER BY lessonOrder`,
  [courseId]
);

// Quiz questions for each lesson (11 per lesson: 10 MC + 1 short answer)
const quizData = [
  // Lesson 1: Introduction to CPE
  [
    { q: "Who is considered the founder of Clinical Pastoral Education?", type: "multiple_choice", options: ["Anton Boisen", "Carl Rogers", "Henri Nouwen", "Sigmund Freud"], answer: "Anton Boisen" },
    { q: "What term did Boisen use to describe patients as sources of learning?", type: "multiple_choice", options: ["Living human documents", "Case studies", "Clinical subjects", "Pastoral texts"], answer: "Living human documents" },
    { q: "CPE emerged in which decade?", type: "multiple_choice", options: ["1920s", "1940s", "1960s", "1980s"], answer: "1920s" },
    { q: "Which is NOT a core element of the CPE model?", type: "multiple_choice", options: ["Academic lectures", "Direct ministry", "Peer group interaction", "Individual supervision"], answer: "Academic lectures" },
    { q: "The CPE educational approach is best described as:", type: "multiple_choice", options: ["Action-reflection", "Lecture-based", "Self-study", "Observation only"], answer: "Action-reflection" },
    { q: "Richard Cabot was a:", type: "multiple_choice", options: ["Physician who supported CPE development", "Theologian who opposed CPE", "Hospital administrator", "Government official"], answer: "Physician who supported CPE development" },
    { q: "CPE integrates theological reflection with:", type: "multiple_choice", options: ["Pastoral practice", "Academic research", "Church history", "Biblical languages"], answer: "Pastoral practice" },
    { q: "The primary text in CPE education is:", type: "multiple_choice", options: ["Ministry encounters", "Systematic theology", "Church history", "Biblical exegesis"], answer: "Ministry encounters" },
    { q: "CPE supervision focuses on:", type: "multiple_choice", options: ["Personal and professional growth", "Academic achievement", "Denominational requirements", "Administrative skills"], answer: "Personal and professional growth" },
    { q: "Peer learning in CPE occurs through:", type: "multiple_choice", options: ["Group interaction and feedback", "Individual study", "Online courses", "Written exams"], answer: "Group interaction and feedback" },
    { q: "Explain why Anton Boisen believed 'living human documents' were important for theological education.", type: "short_answer", options: null, answer: "Boisen believed that studying real people in crisis provided insights into the human condition and spiritual experience that could not be gained from books alone. His own experience with mental illness convinced him that direct encounter with suffering was essential for ministerial formation." }
  ],
  // Lesson 2: Theology of Pastoral Care
  [
    { q: "The Hebrew word 'hesed' means:", type: "multiple_choice", options: ["Steadfast love and covenant faithfulness", "Sacrifice", "Judgment", "Law"], answer: "Steadfast love and covenant faithfulness" },
    { q: "The Greek term 'paraklesis' refers to:", type: "multiple_choice", options: ["Comfort and encouragement", "Judgment", "Sacrifice", "Prophecy"], answer: "Comfort and encouragement" },
    { q: "Which theological concept affirms human dignity?", type: "multiple_choice", options: ["Imago Dei", "Total depravity", "Original sin", "Predestination"], answer: "Imago Dei" },
    { q: "The Incarnation demonstrates:", type: "multiple_choice", options: ["God's willingness to enter human suffering", "Human self-sufficiency", "Divine distance", "Judgment of sin"], answer: "God's willingness to enter human suffering" },
    { q: "Theodicy addresses the question of:", type: "multiple_choice", options: ["Why suffering exists if God is good", "Church governance", "Biblical interpretation", "Sacramental theology"], answer: "Why suffering exists if God is good" },
    { q: "The Cross reveals:", type: "multiple_choice", options: ["Redemptive meaning in suffering", "God's absence", "Human achievement", "Moral perfection"], answer: "Redemptive meaning in suffering" },
    { q: "The Resurrection offers:", type: "multiple_choice", options: ["Hope beyond death", "Escape from responsibility", "Immediate healing", "Material prosperity"], answer: "Hope beyond death" },
    { q: "Pastoral care flows from:", type: "multiple_choice", options: ["God's character as revealed in Scripture", "Human wisdom alone", "Cultural expectations", "Institutional requirements"], answer: "God's character as revealed in Scripture" },
    { q: "Jesus' ministry modeled:", type: "multiple_choice", options: ["Healing, teaching, and presence with sufferers", "Political activism", "Military conquest", "Monastic withdrawal"], answer: "Healing, teaching, and presence with sufferers" },
    { q: "The Holy Spirit empowers:", type: "multiple_choice", options: ["Ministry presence", "Self-reliance", "Isolation", "Judgment"], answer: "Ministry presence" },
    { q: "Explain how the Incarnation provides a model for pastoral ministry.", type: "short_answer", options: null, answer: "The Incarnation shows God entering fully into human experience, including suffering. This models pastoral ministry as presence with those who suffer rather than distance from them. Chaplains embody this incarnational approach by being fully present with people in crisis." }
  ],
  // Lesson 3: Pastoral Identity and Self-Awareness
  [
    { q: "Henri Nouwen's concept of the 'wounded healer' suggests:", type: "multiple_choice", options: ["Our wounds can become sources of compassion", "Only perfect people should minister", "Wounds disqualify from ministry", "Healing must precede ministry"], answer: "Our wounds can become sources of compassion" },
    { q: "The chaplain's primary tool is:", type: "multiple_choice", options: ["The self", "Books", "Technology", "Rituals"], answer: "The self" },
    { q: "Unexamined wounds can lead to:", type: "multiple_choice", options: ["Harmful ministry patterns", "Better ministry", "Faster healing", "More compassion"], answer: "Harmful ministry patterns" },
    { q: "Verbatim analysis involves:", type: "multiple_choice", options: ["Detailed reporting of pastoral conversations", "Memorizing Scripture", "Writing sermons", "Administrative tasks"], answer: "Detailed reporting of pastoral conversations" },
    { q: "Self-awareness develops through:", type: "multiple_choice", options: ["Multiple practices including supervision and reflection", "Natural talent alone", "Academic study only", "Avoiding feedback"], answer: "Multiple practices including supervision and reflection" },
    { q: "Family-of-origin patterns affect:", type: "multiple_choice", options: ["How we respond in ministry situations", "Nothing in professional life", "Only personal relationships", "Academic performance"], answer: "How we respond in ministry situations" },
    { q: "The goal of self-examination in CPE is:", type: "multiple_choice", options: ["Honest recognition of how our humanity affects ministry", "Achieving perfection", "Eliminating all weakness", "Proving competence"], answer: "Honest recognition of how our humanity affects ministry" },
    { q: "Blind spots in self-understanding:", type: "multiple_choice", options: ["Limit ministry effectiveness", "Improve ministry", "Don't matter", "Help with boundaries"], answer: "Limit ministry effectiveness" },
    { q: "Spiritual direction supports:", type: "multiple_choice", options: ["Ongoing self-reflection and growth", "Avoiding supervision", "Independence from others", "Self-sufficiency"], answer: "Ongoing self-reflection and growth" },
    { q: "Cultural conditioning affects:", type: "multiple_choice", options: ["Our assumptions and responses in ministry", "Nothing important", "Only academic work", "Physical health only"], answer: "Our assumptions and responses in ministry" },
    { q: "Explain why self-awareness is considered foundational to effective pastoral care.", type: "short_answer", options: null, answer: "Self-awareness is foundational because the chaplain uses their own person as the primary instrument of care. Without understanding our own reactions, biases, and emotional patterns, we may unconsciously project our issues onto those we serve or miss important dynamics in pastoral encounters." }
  ],
  // Lesson 4: Listening and Communication Skills
  [
    { q: "The cornerstone of pastoral care is:", type: "multiple_choice", options: ["Active listening", "Preaching", "Advice-giving", "Problem-solving"], answer: "Active listening" },
    { q: "Carl Rogers emphasized which conditions for therapeutic communication?", type: "multiple_choice", options: ["Unconditional positive regard, empathy, genuineness", "Authority, expertise, distance", "Judgment, correction, instruction", "Silence, withdrawal, observation"], answer: "Unconditional positive regard, empathy, genuineness" },
    { q: "Open-ended questions:", type: "multiple_choice", options: ["Invite exploration", "Require yes/no answers", "Close conversation", "Demonstrate expertise"], answer: "Invite exploration" },
    { q: "Reflective statements:", type: "multiple_choice", options: ["Demonstrate understanding", "Give advice", "Change the subject", "End the conversation"], answer: "Demonstrate understanding" },
    { q: "Silence in pastoral care can be:", type: "multiple_choice", options: ["A powerful pastoral tool", "Always inappropriate", "A sign of failure", "Unprofessional"], answer: "A powerful pastoral tool" },
    { q: "Premature reassurance:", type: "multiple_choice", options: ["Shuts down authentic dialogue", "Helps healing", "Demonstrates faith", "Is always appropriate"], answer: "Shuts down authentic dialogue" },
    { q: "Empathy requires:", type: "multiple_choice", options: ["Entering another's frame of reference", "Maintaining distance", "Giving solutions", "Correcting errors"], answer: "Entering another's frame of reference" },
    { q: "Advice-giving often:", type: "multiple_choice", options: ["Blocks deeper exploration", "Solves problems", "Demonstrates care", "Is the goal of pastoral care"], answer: "Blocks deeper exploration" },
    { q: "Pastoral listening attends to:", type: "multiple_choice", options: ["The whole person including emotions and body language", "Words only", "Facts only", "Problems only"], answer: "The whole person including emotions and body language" },
    { q: "Theological lecturing in pastoral conversations:", type: "multiple_choice", options: ["Can shut down authentic dialogue", "Is always helpful", "Demonstrates expertise", "Should be primary"], answer: "Can shut down authentic dialogue" },
    { q: "Describe the difference between hearing words and pastoral listening.", type: "short_answer", options: null, answer: "Hearing words is simply receiving verbal content. Pastoral listening goes deeper to attend to the whole person - their emotions, body language, spiritual concerns, and unspoken needs. It involves empathic presence and seeking to understand the person's experience from their perspective." }
  ],
  // Lesson 5: Crisis Intervention and Trauma Care
  [
    { q: "Crisis occurs when:", type: "multiple_choice", options: ["Normal coping mechanisms are overwhelmed", "Life is going well", "Problems are solved", "Support is available"], answer: "Normal coping mechanisms are overwhelmed" },
    { q: "Gerald Caplan's crisis theory identifies stages of:", type: "multiple_choice", options: ["Impact, recoil, and adjustment", "Denial, anger, bargaining", "Beginning, middle, end", "Cause, effect, resolution"], answer: "Impact, recoil, and adjustment" },
    { q: "The goal of crisis ministry is:", type: "multiple_choice", options: ["To accompany the person through crisis", "To fix the crisis immediately", "To provide answers", "To minimize the crisis"], answer: "To accompany the person through crisis" },
    { q: "Psychological first aid focuses on:", type: "multiple_choice", options: ["Safety and stabilization", "Deep therapy", "Problem solving", "Spiritual answers"], answer: "Safety and stabilization" },
    { q: "Trauma-informed care recognizes:", type: "multiple_choice", options: ["How trauma affects the whole person", "That trauma is not important", "Only physical effects", "Only spiritual effects"], answer: "How trauma affects the whole person" },
    { q: "Key principles of trauma-informed care include:", type: "multiple_choice", options: ["Safety, trustworthiness, choice, collaboration, empowerment", "Speed, efficiency, solutions, closure", "Distance, objectivity, analysis, diagnosis", "Authority, expertise, direction, control"], answer: "Safety, trustworthiness, choice, collaboration, empowerment" },
    { q: "Re-traumatization can occur through:", type: "multiple_choice", options: ["Insensitive questions or premature spiritual interpretations", "Careful listening", "Patient presence", "Appropriate silence"], answer: "Insensitive questions or premature spiritual interpretations" },
    { q: "Meaning-making after trauma is:", type: "multiple_choice", options: ["A long-term process", "An immediate goal", "Not important", "The chaplain's job"], answer: "A long-term process" },
    { q: "Crisis ministry requires:", type: "multiple_choice", options: ["Calm, non-anxious presence", "Urgent action", "Quick solutions", "Emotional reactivity"], answer: "Calm, non-anxious presence" },
    { q: "Trauma affects:", type: "multiple_choice", options: ["Body, mind, and spirit", "Only the mind", "Only emotions", "Only behavior"], answer: "Body, mind, and spirit" },
    { q: "Explain why chaplains should avoid premature spiritual interpretations of suffering during crisis.", type: "short_answer", options: null, answer: "Premature spiritual interpretations can re-traumatize by imposing meaning before the person is ready, dismissing their pain, or suggesting they are responsible for their suffering. People in crisis need presence and support first; meaning-making is a long-term process that the person must lead." }
  ],
  // Lesson 6: Grief, Loss, and Bereavement Ministry
  [
    { q: "Contemporary grief theory recognizes grief as:", type: "multiple_choice", options: ["A highly individual process", "Following predictable stages", "The same for everyone", "Completed in a set time"], answer: "A highly individual process" },
    { q: "William Worden identified how many tasks of mourning?", type: "multiple_choice", options: ["Four", "Five", "Seven", "Three"], answer: "Four" },
    { q: "Worden's first task of mourning is:", type: "multiple_choice", options: ["Accepting the reality of loss", "Processing grief pain", "Adjusting to a new world", "Finding enduring connection"], answer: "Accepting the reality of loss" },
    { q: "Kübler-Ross's stage model is now understood as:", type: "multiple_choice", options: ["Not a rigid sequence everyone follows", "The definitive grief model", "Required for healthy grief", "Scientifically proven"], answer: "Not a rigid sequence everyone follows" },
    { q: "Ministry to the dying includes:", type: "multiple_choice", options: ["Helping address unfinished business", "Avoiding death topics", "Promising healing", "Minimizing concerns"], answer: "Helping address unfinished business" },
    { q: "Cultural and religious backgrounds:", type: "multiple_choice", options: ["Shape grief expression", "Don't affect grief", "Should be ignored", "Are irrelevant to care"], answer: "Shape grief expression" },
    { q: "In bereavement care, presence is:", type: "multiple_choice", options: ["More important than words", "Less important than advice", "Not necessary", "Secondary to solutions"], answer: "More important than words" },
    { q: "The chaplain's non-anxious presence with mortality:", type: "multiple_choice", options: ["Models the faith community's care", "Is unprofessional", "Should be avoided", "Is not important"], answer: "Models the faith community's care" },
    { q: "Grief timelines:", type: "multiple_choice", options: ["Should not be imposed on mourners", "Are fixed and predictable", "Should be enforced", "Are the same for everyone"], answer: "Should not be imposed on mourners" },
    { q: "Ministry to the dying is described as:", type: "multiple_choice", options: ["A sacred privilege", "To be avoided", "Only for specialists", "Depressing work"], answer: "A sacred privilege" },
    { q: "Explain why chaplains should not impose grief timelines or expectations on mourners.", type: "short_answer", options: null, answer: "Grief is highly individual and does not follow predictable patterns. Imposing timelines can shame mourners, invalidate their experience, and interfere with their natural grief process. Chaplains support mourners by accepting wherever they are in their grief journey without judgment." }
  ],
  // Lesson 7: Spiritual Assessment and Care Planning
  [
    { q: "FICA is an acronym for:", type: "multiple_choice", options: ["Faith, Importance, Community, Address", "Feelings, Ideas, Concerns, Answers", "Family, Illness, Care, Assessment", "Function, Integration, Coping, Adjustment"], answer: "Faith, Importance, Community, Address" },
    { q: "The HOPE assessment explores:", type: "multiple_choice", options: ["Hope, Organized religion, Personal spirituality, Effects on care", "Health, Outcomes, Prognosis, Expectations", "History, Observations, Plans, Evaluation", "Healing, Options, Prayer, Education"], answer: "Hope, Organized religion, Personal spirituality, Effects on care" },
    { q: "George Fitchett developed the:", type: "multiple_choice", options: ["7x7 model", "FICA tool", "HOPE questions", "Kübler-Ross stages"], answer: "7x7 model" },
    { q: "Professional chaplaincy requires:", type: "multiple_choice", options: ["Clear documentation of spiritual assessments", "No documentation", "Minimal records", "Verbal reports only"], answer: "Clear documentation of spiritual assessments" },
    { q: "Spiritual care plans should be:", type: "multiple_choice", options: ["Specific, measurable, and patient-centered", "Vague and general", "Chaplain-centered", "Unchanging"], answer: "Specific, measurable, and patient-centered" },
    { q: "Documentation serves:", type: "multiple_choice", options: ["Continuity of care and demonstrates chaplaincy value", "No purpose", "Only legal requirements", "Administrative convenience"], answer: "Continuity of care and demonstrates chaplaincy value" },
    { q: "Spiritual assessment is:", type: "multiple_choice", options: ["Foundational to professional chaplaincy", "Optional", "Only for religious patients", "Not important"], answer: "Foundational to professional chaplaincy" },
    { q: "Confidentiality in documentation requires:", type: "multiple_choice", options: ["Balance between thoroughness and privacy", "Sharing everything", "Recording nothing", "Ignoring privacy"], answer: "Balance between thoroughness and privacy" },
    { q: "Interdisciplinary collaboration is supported by:", type: "multiple_choice", options: ["Clear documentation", "Keeping records secret", "Avoiding team meetings", "Working alone"], answer: "Clear documentation" },
    { q: "Validated assessment tools provide:", type: "multiple_choice", options: ["Framework for systematic exploration of spiritual needs", "Rigid scripts", "Guaranteed outcomes", "Replacement for listening"], answer: "Framework for systematic exploration of spiritual needs" },
    { q: "Explain the purpose of spiritual assessment in professional chaplaincy.", type: "short_answer", options: null, answer: "Spiritual assessment systematically identifies a person's spiritual needs, resources, and concerns. It provides the foundation for developing targeted spiritual care interventions, demonstrates chaplaincy's contribution to overall care, and supports continuity of care through documentation." }
  ],
  // Lesson 8: Interfaith Sensitivity and Religious Diversity
  [
    { q: "Institutional chaplains serve:", type: "multiple_choice", options: ["People of all faiths and none", "Only Christians", "Only religious people", "Only their denomination"], answer: "People of all faiths and none" },
    { q: "Interfaith chaplaincy requires:", type: "multiple_choice", options: ["Holding one's faith while honoring others' paths", "Abandoning personal faith", "Converting others", "Avoiding religious topics"], answer: "Holding one's faith while honoring others' paths" },
    { q: "Knowledge of world religions enables:", type: "multiple_choice", options: ["Respectful care and appropriate referrals", "Converting patients", "Judging beliefs", "Avoiding religious patients"], answer: "Respectful care and appropriate referrals" },
    { q: "Chaplains serve as 'hosts' who:", type: "multiple_choice", options: ["Create space for diverse spiritual expression", "Impose their tradition", "Avoid spirituality", "Judge other faiths"], answer: "Create space for diverse spiritual expression" },
    { q: "Ministry to atheists and agnostics:", type: "multiple_choice", options: ["Is part of chaplaincy practice", "Should be avoided", "Is not possible", "Requires conversion"], answer: "Is part of chaplaincy practice" },
    { q: "Shabbat observance is important in:", type: "multiple_choice", options: ["Judaism", "Islam", "Buddhism", "Hinduism"], answer: "Judaism" },
    { q: "Halal requirements relate to:", type: "multiple_choice", options: ["Islam", "Judaism", "Christianity", "Buddhism"], answer: "Islam" },
    { q: "Interfaith competency requires:", type: "multiple_choice", options: ["Secure personal faith identity", "Weak faith", "No personal beliefs", "Religious relativism"], answer: "Secure personal faith identity" },
    { q: "The 'spiritual but not religious' population:", type: "multiple_choice", options: ["Deserves chaplaincy care", "Should be ignored", "Cannot receive spiritual care", "Must become religious"], answer: "Deserves chaplaincy care" },
    { q: "Appropriate referrals to tradition-specific clergy:", type: "multiple_choice", options: ["Are part of good chaplaincy practice", "Show failure", "Should be avoided", "Are unprofessional"], answer: "Are part of good chaplaincy practice" },
    { q: "Explain how a chaplain can maintain their own faith commitments while providing care to people of different religions.", type: "short_answer", options: null, answer: "A chaplain can hold their own faith securely while genuinely honoring others' spiritual paths. This is not relativism but mature faith that engages difference without threat. The chaplain serves as a host creating space for diverse expression rather than imposing their tradition." }
  ],
  // Lesson 9: Ethics in Chaplaincy Practice
  [
    { q: "Respect for autonomy means:", type: "multiple_choice", options: ["Honoring patient choices", "Making decisions for patients", "Ignoring patient wishes", "Following rules only"], answer: "Honoring patient choices" },
    { q: "Beneficence means:", type: "multiple_choice", options: ["Acting for patient good", "Avoiding harm", "Being fair", "Keeping promises"], answer: "Acting for patient good" },
    { q: "Non-maleficence means:", type: "multiple_choice", options: ["Avoiding harm", "Doing good", "Being fair", "Keeping promises"], answer: "Avoiding harm" },
    { q: "Professional boundaries protect:", type: "multiple_choice", options: ["The integrity of the pastoral relationship", "The chaplain only", "The institution only", "No one"], answer: "The integrity of the pastoral relationship" },
    { q: "Confidentiality in chaplaincy:", type: "multiple_choice", options: ["Has limits in institutional settings", "Is absolute", "Doesn't exist", "Is not important"], answer: "Has limits in institutional settings" },
    { q: "Chaplains must clearly communicate:", type: "multiple_choice", options: ["Confidentiality limits while maintaining trust", "That everything is confidential", "That nothing is confidential", "Only positive information"], answer: "Confidentiality limits while maintaining trust" },
    { q: "Ethical dilemmas require:", type: "multiple_choice", options: ["Careful discernment and consultation", "Quick decisions", "Avoiding the issue", "Following personal preference"], answer: "Careful discernment and consultation" },
    { q: "Professional codes provide:", type: "multiple_choice", options: ["Specific guidance for practice", "No help", "Rigid rules only", "Optional suggestions"], answer: "Specific guidance for practice" },
    { q: "Fidelity in ethics means:", type: "multiple_choice", options: ["Keeping commitments", "Avoiding harm", "Being fair", "Doing good"], answer: "Keeping commitments" },
    { q: "Justice in healthcare ethics concerns:", type: "multiple_choice", options: ["Fair distribution of care", "Individual benefit", "Avoiding harm", "Keeping secrets"], answer: "Fair distribution of care" },
    { q: "Explain why professional boundaries are important in chaplaincy practice.", type: "short_answer", options: null, answer: "Professional boundaries protect the integrity of the pastoral relationship by maintaining appropriate physical, emotional, and role clarity. They prevent exploitation, dual relationships, and confusion about the chaplain's role. Boundaries protect both the care recipient and the chaplain." }
  ],
  // Lesson 10: Chaplaincy in Specialized Settings
  [
    { q: "Healthcare chaplains work within:", type: "multiple_choice", options: ["Medical teams", "Isolation", "Only religious settings", "Administrative roles"], answer: "Medical teams" },
    { q: "HIPAA regulations affect:", type: "multiple_choice", options: ["Healthcare chaplaincy documentation", "Only doctors", "Only nurses", "No one in chaplaincy"], answer: "Healthcare chaplaincy documentation" },
    { q: "Prison chaplains must navigate:", type: "multiple_choice", options: ["Security requirements", "No restrictions", "Only religious concerns", "Medical protocols"], answer: "Security requirements" },
    { q: "Military chaplains serve:", type: "multiple_choice", options: ["Armed forces personnel and families", "Only officers", "Only enlisted", "Only in peacetime"], answer: "Armed forces personnel and families" },
    { q: "Corporate chaplains provide:", type: "multiple_choice", options: ["Spiritual support in workplace environments", "Only religious services", "Only crisis intervention", "Only management consulting"], answer: "Spiritual support in workplace environments" },
    { q: "Core chaplaincy competencies:", type: "multiple_choice", options: ["Transfer across settings with adaptation", "Only work in one setting", "Cannot be transferred", "Are setting-specific only"], answer: "Transfer across settings with adaptation" },
    { q: "Organizational culture:", type: "multiple_choice", options: ["Shapes chaplaincy practice", "Is irrelevant", "Should be ignored", "Cannot be understood"], answer: "Shapes chaplaincy practice" },
    { q: "Chaplains serve as a bridge between:", type: "multiple_choice", options: ["Institution and spiritual care", "Only religious groups", "Only administration", "Only patients"], answer: "Institution and spiritual care" },
    { q: "Ethics consultations in hospitals may involve:", type: "multiple_choice", options: ["Chaplain participation", "Only doctors", "Only administrators", "No spiritual perspective"], answer: "Chaplain participation" },
    { q: "Hospice chaplaincy focuses on:", type: "multiple_choice", options: ["End of life spiritual care", "Only physical care", "Only family support", "Only religious rituals"], answer: "End of life spiritual care" },
    { q: "Describe how chaplaincy practice must adapt to different institutional settings.", type: "short_answer", options: null, answer: "While core competencies remain constant, chaplains must adapt to each setting's unique culture, regulations, and needs. Healthcare requires medical team integration and HIPAA compliance. Prisons require security awareness. Military requires deployment readiness. Corporate settings require workplace sensitivity. Each context shapes how spiritual care is delivered." }
  ]
];

// Insert quiz questions
let totalQuizzes = 0;
for (let i = 0; i < lessonRows.length; i++) {
  const lessonId = lessonRows[i].id;
  const questions = quizData[i];
  
  for (let j = 0; j < questions.length; j++) {
    const q = questions[j];
    await connection.execute(
      `INSERT INTO quiz_questions (lessonId, question, questionType, options, correctAnswer, questionOrder, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [lessonId, q.q, q.type, q.options ? JSON.stringify(q.options) : null, q.answer, j + 1]
    );
    totalQuizzes++;
  }
}

console.log(`Added ${totalQuizzes} quiz questions to CHAP101`);
console.log('\n✅ CHAP101 Chaplaincy Training course created successfully!');

await connection.end();
