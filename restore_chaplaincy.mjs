import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get CHAP101 course ID
const [courses] = await connection.execute(
  "SELECT id FROM courses WHERE code = 'CHAP101'"
);

if (courses.length === 0) {
  console.log("CHAP101 course not found");
  process.exit(1);
}

const courseId = courses[0].id;
console.log("Found CHAP101 course ID:", courseId);

// Get current lesson IDs
const [lessons] = await connection.execute(
  "SELECT id, title FROM lessons WHERE courseId = ?",
  [courseId]
);
console.log("Current lessons:", lessons.length);

// Delete quiz questions for these lessons
for (const lesson of lessons) {
  await connection.execute(
    "DELETE FROM quiz_questions WHERE lessonId = ?",
    [lesson.id]
  );
  console.log("Deleted quizzes for lesson:", lesson.title);
}

// Delete lessons
await connection.execute(
  "DELETE FROM lessons WHERE courseId = ?",
  [courseId]
);
console.log("Deleted all lessons for CHAP101");

// Now insert the original 10 lessons with expanded content
const originalLessons = [
  {
    title: "Introduction to Chaplaincy Ministry",
    content: `# Introduction to Chaplaincy Ministry

Chaplaincy represents one of the most unique and challenging forms of Christian ministry. This foundational lesson explores the historical development, theological foundations, and contemporary expressions of chaplaincy across multiple contexts including healthcare, military, corrections, education, and corporate environments.

## Learning Objectives
- Understand the historical development of chaplaincy ministry
- Identify the biblical foundations for institutional chaplaincy
- Recognize the unique role of chaplains in secular settings
- Articulate the theology of presence in chaplaincy ministry

## Biblical Foundations

### Joseph: The First Institutional Chaplain
Joseph served in Pharaoh's court (Genesis 41:37-57) as a spiritual presence within a secular institution. He maintained his faith identity while serving the broader institutional mission, demonstrating key chaplaincy principles:
- Maintaining spiritual identity in secular context
- Serving the common good
- Ministry during crisis
- Interpreting divine guidance for institutional leaders

### Daniel: Chaplaincy in Government Service
Daniel's service in Babylonian and Persian courts (Daniel 1-6) provides another foundational model, demonstrating professional excellence, ethical integrity, and intercultural competence. Daniel served multiple administrations while maintaining his faith convictions.

### Nehemiah: Chaplaincy and Leadership
Nehemiah served as cupbearer to King Artaxerxes before leading the rebuilding of Jerusalem's walls. His position required trust, discretion, and the ability to minister to those in power while advocating for his people.

## The Theology of Presence

Chaplaincy fundamentally embodies a theology of presence—the conviction that God's presence can be mediated through human presence.

### Incarnational Presence
Just as God became present in Christ (John 1:14), chaplains embody divine presence in institutional contexts. Chaplains serve as sacramental signs of God's care and concern. The incarnation demonstrates that God enters into human situations, and chaplains follow this pattern by entering institutional contexts.

### Ministry of Accompaniment
Chaplains practice what Henri Nouwen called "ministry of presence"—being with people in their suffering without necessarily fixing or solving their problems. This accompaniment reflects God's promise to be with us (Isaiah 43:2, Matthew 28:20).

### Non-Anxious Presence
Edwin Friedman's concept of "non-anxious presence" describes how chaplains can bring calm stability to crisis situations, reflecting divine peace in chaotic institutional environments. This requires emotional and spiritual maturity.

## Key Points
- Chaplaincy is ministry within secular institutions
- Biblical models include Joseph, Daniel, and Nehemiah
- Theology of presence is foundational to chaplaincy
- Chaplains mediate divine presence in institutional contexts

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Theological Foundations of Chaplaincy",
    content: `# Theological Foundations of Chaplaincy

This lesson explores the theological underpinnings that inform and shape chaplaincy ministry. Understanding these foundations is essential for effective, theologically grounded chaplaincy practice.

## Learning Objectives
- Articulate a biblical theology of care and presence
- Understand the doctrine of common grace in chaplaincy
- Apply theological reflection to chaplaincy situations
- Integrate faith tradition with professional practice

## Imago Dei: The Foundation of Human Dignity

The doctrine that all humans are created in God's image (Genesis 1:26-27) provides the theological foundation for chaplaincy's commitment to serve all persons regardless of their faith background, moral status, or institutional role.

### Implications for Chaplaincy
- Every person deserves dignity and respect
- Spiritual care is a universal human need
- Chaplains serve the image of God in each person
- No one is beyond the reach of God's care

## Common Grace and General Revelation

The Reformed doctrine of common grace helps chaplains understand how God works beyond the boundaries of the church. God's grace operates in all human institutions, and chaplains can recognize and affirm this grace.

### Working with Non-Christians
- God's truth can be found outside the church
- Secular institutions can serve God's purposes
- Chaplains can affirm goodness wherever found
- Partnership with non-religious colleagues is possible

## The Priesthood of All Believers

The Protestant doctrine of the priesthood of all believers (1 Peter 2:9) supports the chaplain's role in helping all people access God directly. Chaplains facilitate spiritual connection rather than mediating it exclusively.

### Practical Applications
- Empowering individuals in their spiritual journey
- Respecting diverse paths to the sacred
- Supporting rather than replacing personal faith
- Facilitating rather than controlling spiritual experiences

## Theodicy and Suffering

Chaplains regularly encounter profound suffering and must develop theological frameworks for addressing questions of why bad things happen. This requires:
- Comfort without easy answers
- Presence in the midst of mystery
- Hope without denial of pain
- Faith that embraces lament

## Eschatological Hope

Christian chaplaincy is grounded in hope—the conviction that God is working toward redemption and restoration. This hope sustains chaplains and those they serve through difficult circumstances.

## Key Points
- Imago Dei grounds respect for all persons
- Common grace allows ministry in secular settings
- Priesthood of believers empowers spiritual care
- Theodicy requires presence, not easy answers

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Healthcare Chaplaincy",
    content: `# Healthcare Chaplaincy

Healthcare chaplains serve patients, families, and staff in acute care hospitals, providing spiritual assessment and care planning, crisis intervention, end-of-life ministry, bereavement support, and ethical consultation.

## Learning Objectives
- Understand the role of chaplains in healthcare settings
- Learn spiritual assessment methodologies
- Develop skills for end-of-life ministry
- Navigate healthcare ethics committees

## Hospital Settings

Healthcare chaplaincy encompasses ministry in diverse medical environments:
- Acute care hospitals
- Trauma centers
- Oncology units
- Intensive care units
- Emergency departments
- Surgical suites

### Core Functions
- Spiritual assessment and care planning
- Crisis intervention during medical emergencies
- End-of-life ministry and bereavement support
- Ethical consultation on complex medical decisions
- Staff support during traumatic cases

## Spiritual Assessment

Healthcare chaplains use various assessment tools to evaluate spiritual needs:

### FICA Assessment Tool
- **F**aith: What is your faith or belief?
- **I**mportance: How important is faith in your life?
- **C**ommunity: Are you part of a spiritual community?
- **A**ddress: How would you like me to address these issues?

### HOPE Assessment
- **H**ope: Sources of hope, meaning, comfort
- **O**rganized religion: Involvement and importance
- **P**ersonal spirituality: Private practices
- **E**ffects: How beliefs affect medical care

## End-of-Life Ministry

Chaplains play crucial roles in end-of-life care:
- Supporting patients facing terminal diagnoses
- Facilitating family discussions about goals of care
- Providing comfort during the dying process
- Conducting memorial services and rituals
- Supporting bereaved families

### Hospice and Palliative Care
Chaplains in hospice settings focus on:
- Quality of life rather than cure
- Spiritual preparation for death
- Family support and anticipatory grief
- Legacy work and life review

## Specialized Healthcare Settings

### Mental Health Facilities
- Addressing spiritual dimensions of mental illness
- Supporting recovery and hope
- Navigating religious delusions sensitively

### Pediatric Hospitals
- Ministry to children and families
- Addressing theodicy questions from parents
- Supporting siblings and extended family

### Rehabilitation Centers
- Supporting patients through recovery
- Addressing loss and adaptation
- Building hope for the future

## Key Points
- Healthcare chaplains serve patients, families, and staff
- Spiritual assessment is foundational to care planning
- End-of-life ministry requires specialized skills
- Different settings require adapted approaches

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Military Chaplaincy",
    content: `# Military Chaplaincy

Military chaplains serve uniformed personnel across all service branches, providing religious worship, sacramental ministry, counseling, moral and ethical guidance, family support services, and combat ministry.

## Learning Objectives
- Understand the unique context of military chaplaincy
- Learn about ministry in combat environments
- Address moral injury and combat trauma
- Navigate the military chain of command

## Active Duty Ministry

Military chaplains serve in all branches of the armed forces:
- Army
- Navy (including Marine Corps)
- Air Force
- Coast Guard
- Space Force

### Core Functions
- Religious worship and sacramental ministry
- Counseling and crisis intervention
- Moral and ethical guidance
- Family support services
- Combat and deployment ministry

## Unique Challenges

Military chaplaincy presents distinctive challenges:

### Religious Pluralism
- Serving religiously diverse populations while maintaining faith tradition integrity
- Providing for the free exercise of religion for all
- Facilitating worship for traditions other than one's own
- Balancing personal convictions with institutional requirements

### Combat Ministry
- Ministry in combat zones and dangerous environments
- Providing spiritual support during and after combat
- Addressing fear, guilt, and moral questions
- Maintaining presence under fire

### Chain of Command
- Balancing military chain of command with religious authority
- Maintaining confidentiality while serving the command
- Advising commanders on morale and welfare
- Navigating dual roles as officer and minister

## Moral Injury

Moral injury occurs when service members participate in or witness events that violate their moral code. Chaplains address:
- Guilt over actions taken in combat
- Shame about perceived failures
- Betrayal by leaders or institutions
- Loss of meaning and purpose

### Healing Approaches
- Acknowledging the reality of moral injury
- Providing space for confession and lament
- Facilitating forgiveness and reconciliation
- Rebuilding moral frameworks

## Family Ministry

Military chaplains support families through:
- Deployment preparation and reunion
- Family readiness programs
- Marriage and relationship counseling
- Support during casualties and losses

## Reserve and National Guard

Chaplains also serve in reserve components:
- Part-time military service
- Civilian ministry alongside military duties
- Mobilization and deployment support
- Community connections

## Key Points
- Military chaplains serve all service members
- Combat ministry requires unique skills
- Moral injury is a significant concern
- Family ministry is essential

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Correctional Chaplaincy",
    content: `# Correctional Chaplaincy

Correctional chaplains serve incarcerated populations, providing religious services, faith formation, individual spiritual counseling, crisis intervention, suicide prevention, reentry preparation, and family ministry.

## Learning Objectives
- Understand the correctional environment
- Develop skills for ministry with offenders
- Learn restorative justice principles
- Prepare inmates for successful reentry

## Prison Ministry Functions

Correctional chaplains fulfill multiple roles:
- Religious services and faith formation
- Individual spiritual counseling
- Crisis intervention and suicide prevention
- Reentry preparation and support
- Family ministry and visitation support

### Religious Programming
- Worship services for various faith traditions
- Bible studies and religious education
- Holiday and special observances
- Volunteer coordination

## The Correctional Environment

Understanding the prison context is essential:

### Security Considerations
- Operating within security protocols
- Building trust while maintaining boundaries
- Navigating inmate manipulation
- Working with correctional officers

### Institutional Culture
- Understanding prison hierarchy
- Recognizing gang dynamics
- Addressing violence and trauma
- Maintaining hope in difficult settings

## Ministry to Offenders

Effective correctional chaplaincy requires:

### Non-Judgmental Presence
- Seeing the person beyond the crime
- Offering grace without condoning behavior
- Building authentic relationships
- Maintaining appropriate boundaries

### Addressing Guilt and Shame
- Facilitating confession and repentance
- Offering forgiveness and reconciliation
- Supporting genuine transformation
- Avoiding cheap grace

## Restorative Justice Approaches

Modern correctional chaplaincy increasingly emphasizes restorative justice:
- Helping offenders take responsibility
- Facilitating healing for victims
- Restoring community relationships
- Moving beyond punishment to restoration

### Victim-Offender Dialogue
- Preparing offenders for accountability
- Supporting victims who choose to participate
- Facilitating meaningful dialogue
- Promoting healing for all parties

## Reentry Ministry

Preparing inmates for release is crucial:
- Spiritual preparation for freedom
- Connecting with faith communities
- Addressing practical needs
- Supporting family reunification

## Key Points
- Correctional chaplains serve incarcerated populations
- Security awareness is essential
- Restorative justice offers hope
- Reentry preparation is crucial

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Corporate and Workplace Chaplaincy",
    content: `# Corporate and Workplace Chaplaincy

Workplace chaplains provide confidential spiritual and emotional support to employees, addressing work-life balance issues, family and relationship concerns, grief and loss, addiction and recovery, and career transitions.

## Learning Objectives
- Understand the corporate chaplaincy model
- Develop skills for workplace ministry
- Navigate corporate culture and expectations
- Measure chaplaincy effectiveness

## Employee Support Services

Corporate chaplains address diverse needs:
- Work-life balance issues
- Family and relationship concerns
- Grief and loss
- Addiction and recovery
- Career transitions
- Workplace conflict resolution

### Confidential Care
- Employee assistance without HR involvement
- Trust-based relationships
- Non-judgmental support
- Referral to additional resources

## The Corporate Context

Understanding business environments is essential:

### Corporate Culture
- Learning organizational values and norms
- Building relationships across hierarchies
- Navigating corporate politics
- Maintaining neutrality

### Business Objectives
- Understanding company goals
- Aligning chaplaincy with organizational mission
- Demonstrating value to leadership
- Measuring outcomes

## Organizational Benefits

Research shows workplace chaplaincy:
- Reduces employee turnover
- Improves morale and engagement
- Enhances organizational culture
- Increases productivity
- Decreases absenteeism

### Return on Investment
- Cost savings from reduced turnover
- Improved employee wellness
- Enhanced company reputation
- Better workplace relationships

## Ministry Approaches

### Proactive Presence
- Regular rounds and visibility
- Building relationships before crises
- Creating trust through consistency
- Being available and approachable

### Crisis Response
- Workplace accidents and injuries
- Employee deaths and tragedies
- Organizational changes and layoffs
- Natural disasters and emergencies

## Diverse Settings

Corporate chaplaincy occurs in various industries:
- Manufacturing and industrial
- Healthcare organizations
- Retail and service
- Technology companies
- Transportation and logistics

## Key Points
- Workplace chaplains serve employees
- Confidentiality is foundational
- Business value can be demonstrated
- Proactive presence builds trust

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Pastoral Care Skills and Crisis Intervention",
    content: `# Pastoral Care Skills and Crisis Intervention

Effective chaplaincy requires specific skills in pastoral care, active listening, crisis intervention, and trauma-informed care. This lesson develops the practical competencies essential for chaplaincy ministry.

## Learning Objectives
- Master active listening techniques
- Develop crisis intervention skills
- Understand trauma-informed care
- Apply pastoral care in various contexts

## Active Listening

Active listening is foundational to chaplaincy:

### Core Components
- Full presence and attention
- Reflecting content and emotion
- Asking open-ended questions
- Avoiding premature advice-giving
- Validating experiences and feelings

### Techniques
- Paraphrasing: Restating content in your own words
- Reflecting feelings: Naming emotions you observe
- Summarizing: Pulling together key themes
- Clarifying: Seeking deeper understanding

### Barriers to Listening
- Internal distractions and judgments
- Planning your response while others speak
- Assuming you understand before hearing fully
- Imposing your own framework

## Crisis Intervention

Chaplains often respond to acute crises:

### Assessment
- Assessing immediate danger and risk
- Evaluating emotional state
- Identifying support systems
- Determining level of intervention needed

### Intervention
- De-escalation techniques
- Providing emotional stabilization
- Connecting individuals with resources
- Providing immediate spiritual support
- Following up after crisis

### Safety Planning
- Identifying warning signs
- Developing coping strategies
- Building support networks
- Creating action plans

## Trauma-Informed Care

Understanding trauma is essential:

### Trauma Principles
- Safety: Creating safe environments
- Trustworthiness: Being reliable and consistent
- Choice: Empowering decision-making
- Collaboration: Working together
- Empowerment: Building on strengths

### Recognizing Trauma Responses
- Fight, flight, freeze, fawn responses
- Hypervigilance and anxiety
- Dissociation and numbing
- Triggers and flashbacks

## Grief and Loss Ministry

Chaplains frequently minister to those experiencing loss:

### Types of Loss
- Death of loved ones
- Health and ability
- Relationships and divorce
- Employment and identity
- Dreams and expectations

### Grief Support
- Normalizing grief responses
- Providing ongoing presence
- Facilitating meaning-making
- Supporting rituals and remembrance

## Key Points
- Active listening is foundational
- Crisis intervention requires specific skills
- Trauma-informed care is essential
- Grief ministry is ongoing

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Interfaith Sensitivity and Cultural Competence",
    content: `# Interfaith Sensitivity and Cultural Competence

Chaplains serve religiously and culturally diverse populations, requiring deep understanding of various faith traditions and cultural contexts. This lesson develops the knowledge and skills for effective interfaith ministry.

## Learning Objectives
- Understand major world religions
- Develop cultural competence skills
- Navigate interfaith encounters
- Provide appropriate spiritual care across traditions

## Major Faith Traditions

Chaplains must understand diverse religious traditions:

### Christianity
- Catholic, Orthodox, Protestant traditions
- Evangelical and Mainline differences
- Pentecostal and Charismatic expressions
- Liturgical and non-liturgical practices

### Judaism
- Orthodox, Conservative, Reform branches
- Sabbath and dietary laws
- Life cycle rituals
- End-of-life practices

### Islam
- Sunni and Shia traditions
- Five Pillars of Islam
- Prayer and fasting requirements
- Death and burial practices

### Buddhism
- Theravada, Mahayana, Vajrayana schools
- Meditation practices
- Views on suffering and death
- Funeral and memorial customs

### Hinduism
- Diverse traditions and practices
- Karma and reincarnation beliefs
- Sacred texts and rituals
- Death and cremation practices

### Other Traditions
- Sikhism
- Indigenous spiritualities
- New religious movements
- Secular and non-religious worldviews

## Cultural Competence

Beyond religion, chaplains must understand culture:

### Cultural Dimensions
- Individualism vs. collectivism
- High and low context communication
- Power distance and hierarchy
- Time orientation

### Cultural Humility
- Recognizing your own cultural lens
- Avoiding stereotypes and assumptions
- Learning from those you serve
- Ongoing self-reflection

## Interfaith Ministry Skills

### Facilitation
- Providing for diverse religious needs
- Coordinating with faith community leaders
- Creating inclusive sacred spaces
- Honoring diverse practices

### Boundaries
- Maintaining your own faith identity
- Respecting others' beliefs
- Knowing when to refer
- Avoiding syncretism

## Key Points
- Religious diversity requires knowledge
- Cultural competence is essential
- Interfaith ministry requires skill
- Humility enables learning

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Professional Development and Certification",
    content: `# Professional Development and Certification

Chaplaincy is an increasingly professionalized field with specific training, certification, and continuing education requirements. This lesson explores the pathways to professional chaplaincy.

## Learning Objectives
- Understand Clinical Pastoral Education (CPE)
- Learn certification requirements
- Identify professional organizations
- Plan your professional development

## Clinical Pastoral Education (CPE)

CPE is the foundational training for professional chaplaincy:

### Core Elements
- Supervised clinical experience
- Theological reflection
- Personal growth and self-awareness
- Peer learning and feedback
- Individual and group supervision

### CPE Units
- One unit = 400 hours (300 clinical, 100 educational)
- Level I/Level II progression
- Supervisory CPE for those called to teach
- Accredited centers nationwide

### Learning Model
CPE uses an action-reflection model:
- Direct ministry experience
- Verbatim case studies
- Peer group feedback
- Supervisor consultation
- Integration of learning

## Certification Requirements

Professional chaplaincy certification typically requires:

### Educational Requirements
- Master's degree in theology or related field
- Minimum of 4 units of CPE
- Endorsement from faith community
- Demonstrated competency

### Board Certification
- Application and documentation
- Peer review process
- Certification interview
- Ongoing continuing education

## Professional Organizations

### Association of Professional Chaplains (APC)
- Largest multi-faith chaplaincy organization
- Board certification program
- Annual conference and resources
- Standards of practice

### National Association of Catholic Chaplains (NACC)
- Catholic chaplaincy certification
- Spiritual care resources
- Professional development

### Other Organizations
- Association of Clinical Pastoral Education (ACPE)
- Military Chaplains Association
- Correctional Chaplains Association
- Healthcare Chaplaincy Network

## Continuing Education

Professional chaplains maintain competency through:
- Annual continuing education requirements
- Conference attendance
- Peer consultation
- Specialized training
- Reading and research

## Key Points
- CPE is foundational training
- Certification demonstrates competency
- Professional organizations provide support
- Continuing education is required

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  },
  {
    title: "Capstone: Integrating Chaplaincy Competencies",
    content: `# Capstone: Integrating Chaplaincy Competencies

This final lesson brings together all the competencies and knowledge developed throughout the course, preparing you for effective chaplaincy ministry in your chosen context.

## Learning Objectives
- Integrate course learning into coherent practice
- Develop a personal chaplaincy philosophy
- Create a professional development plan
- Prepare for certification and ministry

## Core Competencies Review

Throughout this course, you have developed competencies in:

### Theological Foundations
- Biblical models for chaplaincy
- Theology of presence
- Interfaith sensitivity
- Spiritual assessment

### Ministry Skills
- Active listening
- Crisis intervention
- Grief and loss ministry
- Trauma-informed care

### Professional Practice
- Institutional context understanding
- Professional ethics and boundaries
- Self-care and personal spiritual formation
- Cultural competence

### Specialized Knowledge
- Healthcare chaplaincy
- Military chaplaincy
- Correctional chaplaincy
- Corporate chaplaincy

## Developing Your Philosophy of Chaplaincy

Every chaplain needs a clear philosophy of ministry:

### Key Questions
- What is your theological foundation?
- How do you understand your role?
- What are your core values?
- How will you measure effectiveness?

### Writing Your Philosophy
- Articulate your calling to chaplaincy
- Define your understanding of spiritual care
- Describe your approach to diverse populations
- Explain your commitment to professional standards

## Next Steps

### Pursuing CPE Certification
- Research accredited CPE centers
- Apply for Level I CPE
- Complete required units
- Seek board certification

### Joining Professional Organizations
- Select appropriate organization(s)
- Attend conferences and events
- Network with colleagues
- Access resources and support

### Seeking Mentorship and Supervision
- Identify experienced chaplains
- Request mentoring relationships
- Participate in peer groups
- Engage in ongoing supervision

### Continuing Theological Education
- Pursue advanced degrees if needed
- Attend specialized training
- Read current literature
- Engage in theological reflection

## Self-Care and Sustainability

Chaplaincy can be demanding. Sustainable ministry requires:
- Regular spiritual practices
- Physical health and wellness
- Emotional support systems
- Professional boundaries
- Sabbath and rest

## Key Points
- Integration of learning is essential
- Personal philosophy guides practice
- Professional development is ongoing
- Self-care enables sustainability

Licensed to Larry Fisher
This content is protected and licensed to Larry Fisher
Unauthorized reproduction or distribution is prohibited`
  }
];

// Insert lessons
for (let i = 0; i < originalLessons.length; i++) {
  const lesson = originalLessons[i];
  const lessonOrder = i + 1;
  
  const [result] = await connection.execute(
    "INSERT INTO lessons (courseId, title, content, lessonOrder) VALUES (?, ?, ?, ?)",
    [courseId, lesson.title, lesson.content, lessonOrder]
  );
  
  console.log(`Inserted lesson ${lessonOrder}: ${lesson.title} (ID: ${result.insertId})`);
}

console.log("\nAll 10 original Chaplaincy lessons restored!");

await connection.end();
