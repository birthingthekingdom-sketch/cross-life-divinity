import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get CHAP101 lessons
const [lessons] = await connection.execute(
  `SELECT l.id, l.title, l.lessonOrder FROM lessons l 
   JOIN courses c ON l.courseId = c.id 
   WHERE c.code = 'CHAP101' 
   ORDER BY l.lessonOrder`
);

console.log("Found", lessons.length, "lessons for CHAP101");

const quizzesByLesson = {
  "Introduction to Chaplaincy Ministry": [
    { question: "Which biblical figure is described as 'the first institutional chaplain' who served in Pharaoh's court?", options: JSON.stringify(["Moses", "Joseph", "Daniel", "Nehemiah"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "What is the 'theology of presence' in chaplaincy?", options: JSON.stringify(["A doctrine about God's omnipresence", "The conviction that God's presence can be mediated through human presence", "A theory about church attendance", "A philosophy of religious education"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Henri Nouwen's concept of 'ministry of presence' emphasizes:", options: JSON.stringify(["Fixing people's problems quickly", "Being with people in suffering without necessarily solving their problems", "Preaching sermons to the sick", "Converting non-believers"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Edwin Friedman's concept of 'non-anxious presence' describes:", options: JSON.stringify(["A state of emotional detachment", "Bringing calm stability to crisis situations", "Avoiding all stressful situations", "Meditation techniques for chaplains"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Daniel's service in Babylonian and Persian courts demonstrated:", options: JSON.stringify(["Compromise of faith values", "Professional excellence, ethical integrity, and intercultural competence", "Rejection of secular authority", "Military leadership skills"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Incarnational presence in chaplaincy refers to:", options: JSON.stringify(["Physical fitness requirements", "Chaplains embodying divine presence in institutional contexts", "The Christmas story", "Wearing religious vestments"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Nehemiah's role as cupbearer to King Artaxerxes required:", options: JSON.stringify(["Military training", "Trust, discretion, and ability to minister to those in power", "Cooking skills", "Political ambition"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Which of the following is NOT a key chaplaincy principle demonstrated by Joseph?", options: JSON.stringify(["Maintaining spiritual identity in secular context", "Serving the common good", "Ministry during crisis", "Establishing a new religion"]), correctAnswer: 3, questionType: "multiple_choice" },
    { question: "The ministry of accompaniment reflects God's promise found in:", options: JSON.stringify(["Genesis 1:1", "Isaiah 43:2 and Matthew 28:20", "Revelation 21:4", "Psalm 23:1"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Chaplaincy is best described as:", options: JSON.stringify(["Ministry exclusively within churches", "Ministry within secular institutions", "A form of missionary work", "Hospital administration"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Explain how the theology of presence shapes the chaplain's approach to ministry in institutional settings.", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Theological Foundations of Chaplaincy": [
    { question: "The doctrine of Imago Dei (Genesis 1:26-27) provides the foundation for:", options: JSON.stringify(["Church architecture", "Chaplaincy's commitment to serve all persons regardless of background", "Worship music selection", "Seminary curriculum"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "The Reformed doctrine of common grace helps chaplains understand:", options: JSON.stringify(["How to raise funds", "How God works beyond the boundaries of the church", "Church governance", "Biblical languages"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "The priesthood of all believers (1 Peter 2:9) supports the chaplain's role in:", options: JSON.stringify(["Performing sacraments exclusively", "Helping all people access God directly", "Establishing church hierarchy", "Collecting tithes"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "When addressing theodicy (why bad things happen), chaplains should provide:", options: JSON.stringify(["Simple explanations for all suffering", "Comfort without easy answers and presence in mystery", "Blame for the sufferer", "Avoidance of the topic"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Eschatological hope in Christian chaplaincy refers to:", options: JSON.stringify(["Fear of the end times", "The conviction that God is working toward redemption and restoration", "Predicting future events", "Avoiding discussions of death"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "According to the doctrine of common grace, secular institutions:", options: JSON.stringify(["Are always opposed to God", "Can serve God's purposes", "Should be avoided by Christians", "Have no spiritual value"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "The Imago Dei doctrine implies that:", options: JSON.stringify(["Only Christians deserve spiritual care", "Every person deserves dignity and respect", "Some people are beyond God's care", "Spiritual care is optional"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Chaplains facilitate spiritual connection rather than:", options: JSON.stringify(["Providing resources", "Mediating it exclusively", "Offering support", "Being present"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "When dealing with suffering, chaplains should embrace:", options: JSON.stringify(["Denial of pain", "Easy answers", "Faith that includes lament", "Avoidance"]), correctAnswer: 2, questionType: "multiple_choice" },
    { question: "Working with non-Christians, chaplains can affirm:", options: JSON.stringify(["Nothing outside their tradition", "Goodness wherever it is found", "Only Christian practices", "Secular values exclusively"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "How does the doctrine of common grace enable chaplains to minister effectively in secular institutional settings?", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Healthcare Chaplaincy": [
    { question: "The FICA spiritual assessment tool stands for:", options: JSON.stringify(["Faith, Importance, Community, Address", "Family, Illness, Care, Assistance", "Feelings, Ideas, Concerns, Alternatives", "Foundation, Integration, Comfort, Action"]), correctAnswer: 0, questionType: "multiple_choice" },
    { question: "Healthcare chaplains serve:", options: JSON.stringify(["Only patients", "Patients, families, and staff", "Only religious patients", "Only terminal patients"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "In hospice and palliative care, chaplains focus on:", options: JSON.stringify(["Finding a cure", "Quality of life rather than cure", "Aggressive treatment", "Medical procedures"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "The HOPE spiritual assessment includes:", options: JSON.stringify(["Hope, Organized religion, Personal spirituality, Effects on care", "Health, Operations, Procedures, Examinations", "Healing, Outcomes, Prognosis, Expectations", "History, Observations, Plans, Evaluations"]), correctAnswer: 0, questionType: "multiple_choice" },
    { question: "End-of-life ministry includes:", options: JSON.stringify(["Only conducting funerals", "Supporting patients, facilitating family discussions, and bereavement support", "Avoiding difficult conversations", "Medical decision-making"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "In mental health facilities, chaplains must navigate:", options: JSON.stringify(["Only medication issues", "Religious delusions sensitively while supporting recovery", "Avoiding all religious topics", "Diagnosing mental illness"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Legacy work and life review are important aspects of:", options: JSON.stringify(["Emergency room ministry", "Hospice chaplaincy", "Surgical chaplaincy", "Pediatric chaplaincy"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Healthcare chaplains provide ethical consultation on:", options: JSON.stringify(["Hospital budgets", "Complex medical decisions", "Staff schedules", "Equipment purchases"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "In pediatric hospitals, chaplains address:", options: JSON.stringify(["Only children's needs", "Ministry to children, families, and theodicy questions from parents", "Medical treatments", "School curriculum"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Spiritual assessment is foundational to:", options: JSON.stringify(["Hospital administration", "Care planning in chaplaincy", "Medical diagnosis", "Insurance claims"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Describe the role of a healthcare chaplain in end-of-life care and how they support patients and families.", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Military Chaplaincy": [
    { question: "Military chaplains serve in which branches?", options: JSON.stringify(["Only Army and Navy", "All branches including Army, Navy, Air Force, Coast Guard, and Space Force", "Only combat units", "Only stateside bases"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Moral injury occurs when service members:", options: JSON.stringify(["Are physically wounded", "Participate in or witness events that violate their moral code", "Receive promotions", "Complete their service"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Military chaplains must balance:", options: JSON.stringify(["Only religious duties", "Military chain of command with religious authority", "Personal time with work", "Budget concerns"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Combat ministry requires:", options: JSON.stringify(["Avoiding dangerous areas", "Providing spiritual support during and after combat", "Only rear-area service", "Political involvement"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Family ministry for military chaplains includes:", options: JSON.stringify(["Only worship services", "Deployment preparation, reunion support, and marriage counseling", "Housing assignments", "Pay issues"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "When addressing moral injury, chaplains should:", options: JSON.stringify(["Minimize the experience", "Provide space for confession, lament, and facilitate forgiveness", "Avoid the topic", "Focus only on physical healing"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Religious pluralism in military chaplaincy means:", options: JSON.stringify(["Converting all to one faith", "Serving diverse populations while maintaining faith tradition integrity", "Ignoring religious differences", "Promoting secularism"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Reserve and National Guard chaplains:", options: JSON.stringify(["Serve full-time only", "Combine part-time military service with civilian ministry", "Have no deployment duties", "Serve only in emergencies"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Healing approaches for moral injury include:", options: JSON.stringify(["Denial of the experience", "Acknowledging reality, confession, and rebuilding moral frameworks", "Medication only", "Ignoring symptoms"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Military chaplains advise commanders on:", options: JSON.stringify(["Tactical operations", "Morale and welfare", "Weapons systems", "Intelligence gathering"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Explain how military chaplains address moral injury in service members and what healing approaches they use.", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Correctional Chaplaincy": [
    { question: "Correctional chaplains serve:", options: JSON.stringify(["Only guards", "Incarcerated populations", "Only violent offenders", "Only minimum security inmates"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Restorative justice emphasizes:", options: JSON.stringify(["Punishment only", "Helping offenders take responsibility and facilitating healing", "Longer sentences", "Isolation"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Security considerations in correctional chaplaincy include:", options: JSON.stringify(["Ignoring protocols", "Operating within security protocols while building trust", "Carrying weapons", "Avoiding inmates"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Non-judgmental presence in prison ministry means:", options: JSON.stringify(["Condoning criminal behavior", "Seeing the person beyond the crime while maintaining boundaries", "Ignoring the crime", "Becoming friends with inmates"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Reentry ministry focuses on:", options: JSON.stringify(["Keeping inmates incarcerated", "Preparing inmates for release and connecting with faith communities", "Punishment", "Legal appeals"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Victim-offender dialogue involves:", options: JSON.stringify(["Confrontation and blame", "Preparing offenders for accountability and facilitating meaningful dialogue", "Avoiding victims", "Legal proceedings"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Addressing guilt and shame in inmates requires:", options: JSON.stringify(["Cheap grace", "Facilitating confession, repentance, and supporting genuine transformation", "Ignoring the past", "Minimizing consequences"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Understanding prison hierarchy is important for:", options: JSON.stringify(["Gaining power", "Effective ministry and safety", "Controlling inmates", "Administrative purposes"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Religious programming in prisons includes:", options: JSON.stringify(["Only Christian services", "Worship services for various faith traditions and volunteer coordination", "Political education", "Entertainment"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Correctional chaplains help with suicide prevention through:", options: JSON.stringify(["Ignoring warning signs", "Crisis intervention and ongoing spiritual support", "Medication", "Isolation"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "How does restorative justice differ from traditional punitive approaches, and what role do chaplains play in this model?", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Corporate and Workplace Chaplaincy": [
    { question: "Workplace chaplains provide:", options: JSON.stringify(["Only religious services", "Confidential spiritual and emotional support to employees", "HR services", "Management consulting"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Research shows workplace chaplaincy:", options: JSON.stringify(["Has no measurable impact", "Reduces employee turnover and improves morale", "Increases costs", "Decreases productivity"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Proactive presence in corporate chaplaincy means:", options: JSON.stringify(["Waiting for crises", "Regular rounds, visibility, and building relationships before crises", "Avoiding employees", "Only responding to requests"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Confidential care in workplace chaplaincy involves:", options: JSON.stringify(["Reporting everything to HR", "Employee assistance without HR involvement", "Sharing information with managers", "Public discussions"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Corporate chaplains address:", options: JSON.stringify(["Only work issues", "Work-life balance, family concerns, grief, addiction, and career transitions", "Only religious matters", "Only emergencies"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Understanding corporate culture is essential for:", options: JSON.stringify(["Changing the company", "Building relationships and effective ministry", "Criticizing management", "Avoiding work"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Crisis response in corporate chaplaincy includes:", options: JSON.stringify(["Only natural disasters", "Workplace accidents, employee deaths, layoffs, and emergencies", "Only religious holidays", "Budget meetings"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Return on investment for workplace chaplaincy includes:", options: JSON.stringify(["Only spiritual benefits", "Cost savings from reduced turnover and improved wellness", "Tax benefits", "Government grants"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Corporate chaplaincy occurs in:", options: JSON.stringify(["Only religious organizations", "Various industries including manufacturing, healthcare, retail, and technology", "Only large corporations", "Only non-profits"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Maintaining neutrality in corporate settings means:", options: JSON.stringify(["Taking sides in disputes", "Building relationships across hierarchies without favoritism", "Avoiding all employees", "Supporting management only"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "How can workplace chaplaincy demonstrate value to organizational leadership while maintaining confidentiality with employees?", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Pastoral Care Skills and Crisis Intervention": [
    { question: "Active listening includes:", options: JSON.stringify(["Planning your response while others speak", "Full presence, reflecting content and emotion, and avoiding premature advice", "Interrupting with solutions", "Judging the speaker"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Crisis intervention assessment includes:", options: JSON.stringify(["Only emotional state", "Immediate danger, emotional state, support systems, and intervention level needed", "Only physical safety", "Only religious beliefs"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Trauma-informed care principles include:", options: JSON.stringify(["Control and authority", "Safety, trustworthiness, choice, collaboration, and empowerment", "Avoidance and denial", "Quick fixes"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Paraphrasing in active listening means:", options: JSON.stringify(["Repeating exactly what was said", "Restating content in your own words", "Changing the subject", "Giving advice"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "De-escalation techniques are used for:", options: JSON.stringify(["Increasing tension", "Providing emotional stabilization during crises", "Avoiding difficult situations", "Ending conversations"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Recognizing trauma responses includes identifying:", options: JSON.stringify(["Only physical symptoms", "Fight, flight, freeze, fawn responses, hypervigilance, and triggers", "Only verbal cues", "Only past history"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Types of loss that chaplains address include:", options: JSON.stringify(["Only death", "Death, health, relationships, employment, and dreams", "Only physical loss", "Only financial loss"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Safety planning involves:", options: JSON.stringify(["Avoiding all risks", "Identifying warning signs, coping strategies, and support networks", "Isolation", "Denial"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Grief support includes:", options: JSON.stringify(["Rushing through grief", "Normalizing responses, providing presence, and facilitating meaning-making", "Avoiding the topic", "Setting time limits"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Barriers to listening include:", options: JSON.stringify(["Full attention", "Internal distractions, planning responses, and imposing your framework", "Open-ended questions", "Reflecting feelings"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Describe the key components of trauma-informed care and how chaplains apply these principles in their ministry.", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Interfaith Sensitivity and Cultural Competence": [
    { question: "Cultural humility involves:", options: JSON.stringify(["Assuming you know everything", "Recognizing your own cultural lens and learning from those you serve", "Imposing your culture", "Avoiding other cultures"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "The Five Pillars of Islam include:", options: JSON.stringify(["Only prayer", "Shahada, prayer, fasting, alms, and pilgrimage", "Only fasting", "Only pilgrimage"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Judaism includes which branches?", options: JSON.stringify(["Only Orthodox", "Orthodox, Conservative, and Reform", "Only Reform", "Only Hasidic"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Cultural dimensions include:", options: JSON.stringify(["Only language", "Individualism vs. collectivism, communication context, power distance", "Only food preferences", "Only clothing"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Interfaith facilitation involves:", options: JSON.stringify(["Converting everyone", "Providing for diverse religious needs and coordinating with faith leaders", "Ignoring differences", "Promoting one religion"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Buddhism includes which schools?", options: JSON.stringify(["Only Zen", "Theravada, Mahayana, and Vajrayana", "Only Tibetan", "Only Pure Land"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Maintaining boundaries in interfaith ministry means:", options: JSON.stringify(["Rejecting all other faiths", "Maintaining your faith identity while respecting others' beliefs", "Syncretism", "Avoiding interfaith encounters"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Hinduism includes beliefs about:", options: JSON.stringify(["Only one god", "Karma, reincarnation, and diverse traditions", "Only vegetarianism", "Only yoga"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "High and low context communication refers to:", options: JSON.stringify(["Volume of speech", "How much meaning is conveyed explicitly vs. implicitly", "Language complexity", "Educational level"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Avoiding syncretism means:", options: JSON.stringify(["Rejecting all interfaith dialogue", "Not blending religions inappropriately while respecting diversity", "Converting others", "Isolation"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "How can chaplains maintain their own faith identity while providing appropriate spiritual care to people of different religious traditions?", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Professional Development and Certification": [
    { question: "Clinical Pastoral Education (CPE) includes:", options: JSON.stringify(["Only classroom learning", "Supervised clinical experience, theological reflection, and peer learning", "Only reading", "Only online courses"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "One CPE unit equals:", options: JSON.stringify(["100 hours", "400 hours (300 clinical, 100 educational)", "1000 hours", "40 hours"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Board certification typically requires:", options: JSON.stringify(["Only a bachelor's degree", "Master's degree, CPE units, endorsement, and demonstrated competency", "Only experience", "Only a certificate"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "The Association of Professional Chaplains (APC) is:", options: JSON.stringify(["A government agency", "The largest multi-faith chaplaincy organization", "A seminary", "A hospital network"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "CPE uses which learning model?", options: JSON.stringify(["Lecture only", "Action-reflection model with verbatim case studies", "Online only", "Self-study"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Continuing education for chaplains includes:", options: JSON.stringify(["No requirements after certification", "Annual requirements, conferences, peer consultation, and specialized training", "Only reading", "Only online courses"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "The National Association of Catholic Chaplains (NACC) provides:", options: JSON.stringify(["Only Protestant resources", "Catholic chaplaincy certification and spiritual care resources", "Only military chaplaincy", "Only hospital chaplaincy"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Verbatim case studies in CPE involve:", options: JSON.stringify(["Memorizing conversations", "Written accounts of ministry encounters for peer and supervisor feedback", "Video recordings only", "Patient records"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Professional chaplaincy certification demonstrates:", options: JSON.stringify(["Only religious affiliation", "Competency and commitment to professional standards", "Only academic achievement", "Only experience"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Supervisory CPE is for:", options: JSON.stringify(["All chaplains", "Those called to teach and supervise other chaplains", "Only hospital chaplains", "Only military chaplains"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Explain the role of Clinical Pastoral Education (CPE) in preparing professional chaplains and what the training involves.", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ],
  "Capstone: Integrating Chaplaincy Competencies": [
    { question: "A personal chaplaincy philosophy should include:", options: JSON.stringify(["Only theological beliefs", "Theological foundation, understanding of role, core values, and effectiveness measures", "Only practical skills", "Only institutional requirements"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Self-care for chaplains includes:", options: JSON.stringify(["Working without breaks", "Spiritual practices, physical health, emotional support, and boundaries", "Avoiding difficult situations", "Isolation"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Core competencies developed in chaplaincy training include:", options: JSON.stringify(["Only theological knowledge", "Theological foundations, ministry skills, professional practice, and specialized knowledge", "Only crisis intervention", "Only cultural competence"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Next steps after chaplaincy training include:", options: JSON.stringify(["Stopping education", "Pursuing CPE, joining organizations, seeking mentorship, and continuing education", "Working alone", "Avoiding supervision"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Sustainable ministry requires:", options: JSON.stringify(["Constant work without rest", "Regular spiritual practices, wellness, support systems, and sabbath", "Avoiding difficult cases", "Working in isolation"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Integration of learning means:", options: JSON.stringify(["Keeping skills separate", "Bringing together all competencies into coherent practice", "Forgetting previous lessons", "Specializing in one area only"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Mentorship in chaplaincy involves:", options: JSON.stringify(["Working alone", "Identifying experienced chaplains and participating in peer groups", "Avoiding feedback", "Self-sufficiency"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Professional development is:", options: JSON.stringify(["Optional after certification", "Ongoing throughout a chaplain's career", "Only for beginners", "Only academic"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Writing your philosophy of chaplaincy helps:", options: JSON.stringify(["Meet requirements only", "Articulate your calling and guide your practice", "Impress others", "Get hired"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Sabbath and rest are important for:", options: JSON.stringify(["Only religious reasons", "Preventing burnout and enabling sustainable ministry", "Avoiding work", "Meeting requirements"]), correctAnswer: 1, questionType: "multiple_choice" },
    { question: "Describe the key elements of a personal chaplaincy philosophy and why it is important for effective ministry.", options: JSON.stringify([]), correctAnswer: 0, questionType: "short_answer" }
  ]
};

let totalQuizzes = 0;

for (const lesson of lessons) {
  const quizzes = quizzesByLesson[lesson.title];
  if (!quizzes) {
    console.log(`No quizzes found for: ${lesson.title}`);
    continue;
  }
  
  for (let i = 0; i < quizzes.length; i++) {
    const quiz = quizzes[i];
    await connection.execute(
      `INSERT INTO quiz_questions (lessonId, question, options, correctAnswer, questionType, questionOrder) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [lesson.id, quiz.question, quiz.options, quiz.correctAnswer, quiz.questionType, i + 1]
    );
    totalQuizzes++;
  }
  console.log(`Added ${quizzes.length} quizzes for: ${lesson.title}`);
}

console.log(`\nTotal quizzes added: ${totalQuizzes}`);

await connection.end();
