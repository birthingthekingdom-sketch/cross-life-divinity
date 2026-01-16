import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const courseId = 570006; // DIV113 Contemporary Theological Issues

// 8 new lessons to add (already have 2: Science and Faith, Religious Pluralism)
const lessons = [
  {
    title: "Bioethics and the Sanctity of Life",
    content: `# Bioethics and the Sanctity of Life

## I. Introduction

Bioethics—the study of ethical issues arising from advances in biology and medicine—presents some of the most pressing moral challenges facing the contemporary church. From abortion and euthanasia to genetic engineering and reproductive technologies, Christians must navigate complex terrain while upholding the biblical doctrine of the sanctity of human life. This lesson examines these issues through the lens of Scripture and historic Christian teaching.

The sanctity of life doctrine affirms that human life possesses inherent dignity and worth because humans are created in the image of God (imago Dei). This foundational truth has profound implications for how we approach bioethical questions.

**Learning Objectives:**
- Understand the biblical basis for the sanctity of human life
- Examine key bioethical issues from a Christian perspective
- Develop a framework for ethical decision-making in medical contexts
- Apply biblical principles to contemporary bioethical debates

## II. The Biblical Foundation: Imago Dei

### A. Creation in God's Image

Genesis 1:26-27 establishes the foundational truth: "Then God said, 'Let Us make man in Our image, according to Our likeness'... So God created man in His own image; in the image of God He created him; male and female He created them."

The Hebrew term צֶלֶם (tselem, "image") and דְּמוּת (demut, "likeness") indicate that humans uniquely reflect God's nature among all creatures. This image includes rationality, moral agency, relationality, and the capacity for communion with God.

### B. The Value of Human Life

Because humans bear God's image, human life has intrinsic value—not merely instrumental value based on utility, productivity, or quality of life. Genesis 9:6 declares: "Whoever sheds man's blood, by man his blood shall be shed; for in the image of God He made man."

Psalm 139:13-16 affirms God's intimate involvement in human formation: "For You formed my inward parts; You covered me in my mother's womb. I will praise You, for I am fearfully and wonderfully made."

## III. Beginning of Life Issues

### A. Abortion

The biblical witness consistently treats the unborn as persons deserving protection:

- Jeremiah 1:5: "Before I formed you in the womb I knew you; before you were born I sanctified you."
- Luke 1:41-44: John the Baptist "leaped in the womb" at the presence of the unborn Jesus.
- Exodus 21:22-25: The Mosaic law prescribed penalties for harm to an unborn child.

The early church unanimously condemned abortion. The Didache (c. AD 70-100) states: "You shall not murder a child by abortion nor kill that which is born."

### B. Reproductive Technologies

In vitro fertilization (IVF), surrogacy, and other reproductive technologies raise ethical questions:

- The creation and destruction of "excess" embryos
- The commodification of human reproduction
- Third-party involvement in procreation (donors, surrogates)
- The separation of procreation from the marital union

Christians must weigh the legitimate desire for children against the potential violations of human dignity involved in some procedures.

### C. Embryonic Research and Cloning

Research involving the destruction of human embryos treats nascent human life as mere raw material. Therapeutic cloning creates human embryos solely for destruction. These practices violate the principle that human beings should never be treated merely as means to an end.

## IV. End of Life Issues

### A. Euthanasia and Assisted Suicide

Euthanasia (from Greek εὐθανασία, "good death") involves intentionally ending a life to relieve suffering. Scripture teaches that God alone is the Lord of life and death (Deuteronomy 32:39; 1 Samuel 2:6).

The distinction between killing and allowing to die is morally significant. Withdrawing extraordinary or burdensome treatment differs from actively causing death.

### B. Palliative Care and Hospice

Christian ethics affirms aggressive pain management and comfort care for the dying. The goal is neither to hasten death nor to prolong the dying process artificially, but to provide compassionate care that honors human dignity.

### C. Advance Directives

Christians may prudently prepare advance directives specifying their wishes for end-of-life care, while recognizing that God remains sovereign over the timing of death.

## V. Genetic Technologies

### A. Genetic Testing and Screening

Prenatal genetic testing raises concerns when used to select against children with disabilities. The value of human life does not depend on genetic "normalcy."

### B. Gene Therapy and Enhancement

A distinction exists between therapeutic interventions (correcting genetic diseases) and enhancement (improving normal traits). The former may be permissible; the latter raises concerns about "playing God" and creating genetic inequality.

### C. CRISPR and Germline Editing

Editing the human germline (changes passed to future generations) raises profound questions about human identity, unforeseen consequences, and the limits of human authority over creation.

## VI. A Framework for Bioethical Decision-Making

1. **Affirm the sanctity of human life** created in God's image
2. **Distinguish between killing and allowing to die**
3. **Consider the intention** behind medical interventions
4. **Evaluate proportionality** of benefits and burdens
5. **Respect human dignity** at every stage of life
6. **Seek wisdom** from Scripture, church tradition, and medical expertise
7. **Trust God's sovereignty** over life and death

## VII. Key Points Summary

- Human life has inherent dignity because of the imago Dei
- The unborn, disabled, and dying deserve protection and care
- Bioethical decisions require careful moral reasoning
- Christians must engage these issues with both conviction and compassion
- The church offers a counter-cultural witness to the value of every human life

## VIII. Scripture Memory

> "For You formed my inward parts; You covered me in my mother's womb. I will praise You, for I am fearfully and wonderfully made." — Psalm 139:13-14 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Gender, Sexuality, and Biblical Anthropology",
    content: `# Gender, Sexuality, and Biblical Anthropology

## I. Introduction

Few issues in contemporary culture are as contested as questions of gender and sexuality. The church faces pressure to conform to rapidly shifting cultural norms while remaining faithful to biblical teaching. This lesson examines what Scripture teaches about human nature, gender, and sexuality, providing a framework for engaging these issues with both truth and grace.

Biblical anthropology—the doctrine of humanity—provides the foundation for understanding gender and sexuality. God's design for human beings as male and female, and for sexuality within the covenant of marriage, reflects His creative purposes and wisdom.

**Learning Objectives:**
- Understand the biblical teaching on human nature and gender
- Examine Scripture's teaching on marriage and sexuality
- Engage contemporary challenges with biblical fidelity and pastoral sensitivity
- Develop a Christ-centered approach to these issues

## II. Biblical Anthropology: Created Male and Female

### A. The Creation Narrative

Genesis 1:27 establishes the fundamental reality: "So God created man in His own image; in the image of God He created him; male and female He created them."

The Hebrew terms זָכָר (zakar, "male") and נְקֵבָה (neqebah, "female") denote biological sex as part of God's good creation. This binary distinction is not a social construct but a creational given.

Genesis 2 elaborates on the creation of woman from man, establishing their complementary relationship: "And the LORD God said, 'It is not good that man should be alone; I will make him a helper comparable to him'" (Genesis 2:18).

### B. The Significance of Embodiment

Biblical anthropology affirms the goodness of the body. Humans are not souls trapped in bodies but embodied souls or ensouled bodies. The body is integral to personal identity, not incidental to it.

The incarnation of Christ (John 1:14) and the promise of bodily resurrection (1 Corinthians 15) underscore the significance of embodiment in God's purposes.

### C. The Fall and Its Effects

The Fall introduced disorder into every aspect of human existence, including our experience of gender and sexuality. Romans 1:24-27 describes the exchange of natural relations for unnatural as a consequence of humanity's rejection of God.

However, the Fall does not nullify creation. God's original design remains the norm, even as we experience the effects of sin.

## III. Marriage and Sexuality

### A. The Divine Institution of Marriage

Marriage is defined in Genesis 2:24: "Therefore a man shall leave his father and mother and be joined to his wife, and they shall become one flesh."

Jesus affirmed this creation ordinance in Matthew 19:4-6, declaring that God "made them male and female" and that "what God has joined together, let not man separate."

Marriage is:
- **Covenantal**: A binding commitment before God
- **Complementary**: Uniting male and female
- **Comprehensive**: A union of whole persons, including sexual union
- **Fruitful**: Ordered toward procreation and family

### B. Sexual Ethics

Scripture consistently reserves sexual intimacy for the marriage covenant between husband and wife. Sexual immorality (πορνεία, porneia) encompasses all sexual activity outside this boundary, including:

- Premarital sex (fornication)
- Adultery
- Homosexual practice
- Incest
- Bestiality

1 Corinthians 6:18-20 exhorts: "Flee sexual immorality... your body is the temple of the Holy Spirit... therefore glorify God in your body."

### C. Singleness and Celibacy

Scripture also honors singleness as a legitimate calling (1 Corinthians 7:7-8). Jesus and Paul were both single. Celibacy for the sake of the kingdom is a gift, not a curse.

## IV. Contemporary Challenges

### A. Same-Sex Attraction and Homosexuality

The church must distinguish between temptation and behavior. Experiencing same-sex attraction is not itself sin; acting on such desires is. Romans 1:26-27, 1 Corinthians 6:9-11, and 1 Timothy 1:10 clearly identify homosexual practice as contrary to God's design.

The church is called to:
- Uphold the biblical sexual ethic with clarity
- Welcome all people with the gospel of grace
- Support those who struggle with unwanted attractions
- Call all people to repentance and faith in Christ

### B. Transgenderism and Gender Dysphoria

Gender dysphoria—distress arising from incongruence between biological sex and perceived gender identity—is a real experience requiring compassionate response. However, the biblical response differs from the cultural affirmation of transgender identities.

Scripture teaches that:
- Biological sex is a gift, not an assignment to be overridden
- The body is not separate from personal identity
- Surgical and hormonal interventions do not change one's sex
- Healing comes through Christ, not through bodily alteration

### C. Pastoral Care

The church must be a place of welcome for all sinners, including those struggling with sexual and gender issues. This requires:

- Speaking truth with love (Ephesians 4:15)
- Offering genuine community and friendship
- Providing patient discipleship
- Pointing to the transforming power of the gospel

## V. The Gospel and Human Sexuality

The gospel offers hope for all who struggle with sexual sin:

- **Justification**: We are declared righteous through faith in Christ, not through sexual purity
- **Sanctification**: The Spirit progressively transforms our desires and behaviors
- **Glorification**: We await the resurrection when all brokenness will be healed

1 Corinthians 6:11 declares to former sexual sinners: "And such were some of you. But you were washed, but you were sanctified, but you were justified in the name of the Lord Jesus and by the Spirit of our God."

## VI. Key Points Summary

- God created humanity male and female as part of His good design
- Marriage is the covenant union of one man and one woman
- All sexual activity outside marriage is contrary to God's will
- The church must uphold biblical teaching while extending grace to all
- The gospel offers transformation and hope for sexual sinners

## VII. Scripture Memory

> "So God created man in His own image; in the image of God He created him; male and female He created them." — Genesis 1:27 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Social Justice and the Kingdom of God",
    content: `# Social Justice and the Kingdom of God

## I. Introduction

"Social justice" has become one of the most contested terms in contemporary discourse, both within and outside the church. For some, it represents the heart of the gospel's application to society; for others, it signals an accommodation to secular ideology. This lesson seeks to provide a biblically grounded understanding of justice, the kingdom of God, and the church's responsibility to address social evils.

The challenge is to affirm what Scripture clearly teaches about justice while avoiding the conflation of biblical categories with secular political ideologies. The kingdom of God provides the proper framework for understanding the church's social witness.

**Learning Objectives:**
- Understand the biblical concept of justice (mishpat and tsedaqah)
- Examine the relationship between the gospel and social concern
- Distinguish biblical justice from secular ideologies
- Apply kingdom principles to contemporary social issues

## II. The Biblical Concept of Justice

### A. Hebrew Terminology

The Old Testament uses two primary terms for justice:

**Mishpat (מִשְׁפָּט)**: Often translated "justice" or "judgment," mishpat refers to the proper ordering of relationships according to God's standards. It includes both retributive justice (punishing wrongdoing) and restorative justice (setting things right).

**Tsedaqah (צְדָקָה)**: Usually translated "righteousness," tsedaqah describes conformity to God's character and standards. When paired with mishpat, it encompasses both vertical (God-ward) and horizontal (human) relationships.

Micah 6:8 famously combines these concepts: "He has shown you, O man, what is good; and what does the LORD require of you but to do justly (mishpat), to love mercy (chesed), and to walk humbly with your God?"

### B. Justice in the Law and Prophets

The Mosaic law contained extensive provisions for social justice:

- Protection for the vulnerable: widows, orphans, and foreigners (Deuteronomy 10:18; 24:17-21)
- Economic provisions: gleaning laws, Sabbath year, Jubilee (Leviticus 19:9-10; 25:8-55)
- Fair treatment in courts: impartial judgment, honest weights (Leviticus 19:15, 35-36)

The prophets thundered against injustice:

- Amos condemned those who "sell the righteous for silver, and the poor for a pair of sandals" (Amos 2:6)
- Isaiah denounced those who "decree unrighteous decrees... to rob the needy of justice" (Isaiah 10:1-2)
- Jeremiah called for justice to the oppressed (Jeremiah 22:3)

### C. Jesus and Justice

Jesus inaugurated the kingdom of God, which includes the restoration of justice:

- Luke 4:18-19: Jesus announced His mission to "preach the gospel to the poor... proclaim liberty to the captives... set at liberty those who are oppressed"
- Matthew 23:23: Jesus rebuked the Pharisees for neglecting "the weightier matters of the law: justice and mercy and faith"
- Matthew 25:31-46: The sheep and goats are distinguished by their treatment of "the least of these"

## III. The Kingdom of God and Social Transformation

### A. Already and Not Yet

The kingdom of God is both present and future. Jesus inaugurated the kingdom at His first coming, but its consummation awaits His return. This "already/not yet" tension shapes Christian social engagement.

We work for justice now as a sign of the coming kingdom, while recognizing that perfect justice awaits Christ's return. We are neither utopians (expecting to create heaven on earth) nor quietists (withdrawing from social concern).

### B. The Church's Calling

The church is called to:

1. **Proclaim the gospel**: The ultimate solution to injustice is the transformation of hearts through Christ
2. **Model justice**: The church should be a counter-cultural community of justice and reconciliation
3. **Advocate for the vulnerable**: Christians should speak for those who cannot speak for themselves (Proverbs 31:8-9)
4. **Engage culture**: Believers are salt and light in society (Matthew 5:13-16)

### C. The Priority of the Gospel

While social concern is essential, it must not eclipse the proclamation of the gospel. The greatest injustice is eternal separation from God, and the greatest need is reconciliation with Him through Christ.

Social action without gospel proclamation becomes mere humanitarianism. Gospel proclamation without social concern becomes truncated Christianity.

## IV. Distinguishing Biblical Justice from Secular Ideologies

### A. Critical Theory and Intersectionality

Contemporary "social justice" movements often draw on critical theory, which analyzes society primarily through the lens of power dynamics between oppressor and oppressed groups. While Scripture acknowledges oppression, it differs from critical theory in key ways:

- **Sin is universal**: All humans are sinners, not just oppressors (Romans 3:23)
- **Redemption is individual and corporate**: Salvation comes through personal faith in Christ
- **Identity is primarily in Christ**: Believers' fundamental identity is in Christ, not in group categories (Galatians 3:28)
- **Forgiveness is central**: The gospel calls for reconciliation, not perpetual grievance

### B. Avoiding Politicization

Biblical justice transcends partisan politics. Christians may disagree on policy solutions while agreeing on biblical principles. The church must not become captive to any political ideology, whether left or right.

### C. Maintaining Unity

Ephesians 4:3 calls believers to maintain "the unity of the Spirit in the bond of peace." Disagreements over social issues should not divide the body of Christ.

## V. Applying Kingdom Justice Today

### A. Racial Reconciliation

The gospel breaks down ethnic barriers (Ephesians 2:14-16). The church should model reconciliation across racial lines and address ongoing effects of historical injustice.

### B. Economic Justice

Scripture calls for honest dealing, care for the poor, and generosity. Christians should advocate for economic systems that enable human flourishing while recognizing the limits of government solutions.

### C. Protection of the Vulnerable

The church has historically led in caring for orphans, widows, the unborn, and the marginalized. This witness must continue.

## VI. Key Points Summary

- Biblical justice (mishpat and tsedaqah) encompasses right relationships with God and neighbor
- The kingdom of God provides the framework for Christian social engagement
- The gospel must remain central to all social concern
- Biblical justice differs from secular ideologies in key respects
- Christians should work for justice while awaiting the kingdom's consummation

## VII. Scripture Memory

> "He has shown you, O man, what is good; and what does the LORD require of you but to do justly, to love mercy, and to walk humbly with your God?" — Micah 6:8 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Church in a Post-Christian Culture",
    content: `# The Church in a Post-Christian Culture

## I. Introduction

Western societies that were once shaped by Christian assumptions are increasingly characterized as "post-Christian." The cultural consensus that once supported Christian values has eroded, and the church finds itself in an unfamiliar position—no longer at the center of culture but on the margins. This lesson examines what it means to be the church in a post-Christian context and how believers can faithfully witness in this new environment.

The term "post-Christian" does not mean that Christianity has disappeared but that it no longer provides the dominant framework for cultural values, institutions, and public discourse. The church must learn to be a faithful minority in a context that is often indifferent or hostile to its message.

**Learning Objectives:**
- Understand the characteristics of post-Christian culture
- Examine biblical models for faithful witness in hostile contexts
- Develop strategies for engaging post-Christian society
- Maintain hope and mission in challenging circumstances

## II. Understanding Post-Christian Culture

### A. Characteristics of Post-Christendom

The transition from Christendom (where Christianity was culturally dominant) to post-Christendom involves several shifts:

- **From majority to minority**: Christians are increasingly a cultural minority
- **From privilege to marginalization**: Christian assumptions no longer shape public policy
- **From maintenance to mission**: The church must adopt a missionary posture
- **From institution to movement**: Formal structures give way to grassroots vitality

### B. Secularization and Its Effects

Secularization involves the declining influence of religion in public life. This manifests in:

- **Institutional secularization**: Religion is privatized, excluded from public discourse
- **Moral secularization**: Traditional moral frameworks are replaced by expressive individualism
- **Cognitive secularization**: Supernatural beliefs are marginalized as irrational

The sociologist Charles Taylor describes our age as one of "exclusive humanism"—a worldview that finds meaning and morality without reference to God.

### C. The Rise of the "Nones"

The fastest-growing religious category in Western societies is the "nones"—those claiming no religious affiliation. Many are not atheists but "spiritual but not religious," reflecting a rejection of institutional religion while retaining vague spiritual interests.

## III. Biblical Models for Faithful Witness

### A. Exile in Babylon

The Babylonian exile provides a paradigm for faithful living in a hostile culture. Jeremiah 29:4-7 instructs the exiles:

> "Build houses and dwell in them; plant gardens and eat their fruit... And seek the peace of the city where I have caused you to be carried away captive, and pray to the LORD for it; for in its peace you will have peace."

The exiles were to:
- Maintain their distinct identity
- Engage constructively with their host culture
- Seek the welfare of their city
- Trust in God's sovereign purposes

### B. The Early Church

The early church thrived as a minority in the pagan Roman Empire. Acts and the Epistles reveal their strategy:

- **Distinctive community**: The church modeled an alternative society of love and mutual care (Acts 2:42-47)
- **Winsome witness**: Believers were to "walk in wisdom toward those who are outside" (Colossians 4:5)
- **Suffering faithfully**: Persecution was expected and endured with joy (1 Peter 4:12-16)
- **Cultural engagement**: Paul engaged Greek philosophy at the Areopagus (Acts 17:22-31)

### C. Daniel in Babylon

Daniel exemplifies faithful witness in a pagan court:

- He maintained his convictions (Daniel 1:8; 6:10)
- He served with excellence (Daniel 6:3)
- He spoke truth to power (Daniel 4:27; 5:22-28)
- He trusted God with the consequences (Daniel 3:17-18; 6:22)

## IV. Strategies for Engaging Post-Christian Culture

### A. Faithful Presence

The sociologist James Davison Hunter advocates "faithful presence"—Christians being fully present in their vocations and communities, embodying the gospel in word and deed. This involves:

- Excellence in work and creativity
- Deep investment in local communities
- Long-term commitment to place and people
- Modeling an alternative way of life

### B. Apologetic Engagement

Post-Christian culture requires renewed apologetics that addresses contemporary questions:

- The problem of evil and suffering
- The reliability of Scripture
- The coherence of Christian morality
- The historical evidence for Christ's resurrection

Apologetics should be both defensive (answering objections) and offensive (exposing the inadequacy of secular worldviews).

### C. Hospitality and Relationship

In a fragmented, lonely society, Christian hospitality is powerfully attractive. Opening homes, sharing meals, and building genuine friendships create contexts for gospel witness.

### D. Prophetic Witness

The church must speak prophetically to cultural idols and injustices while doing so with humility and love. This includes:

- Defending the sanctity of life
- Upholding marriage and family
- Advocating for the poor and marginalized
- Calling for religious freedom

## V. Maintaining Hope and Mission

### A. The Sovereignty of God

God remains sovereign over history. The rise of post-Christian culture does not catch Him by surprise. He is working out His purposes, and the gates of Hades will not prevail against His church (Matthew 16:18).

### B. The Power of the Gospel

The gospel remains "the power of God to salvation" (Romans 1:16). The same message that transformed the Roman Empire can transform post-Christian culture.

### C. The Promise of Christ's Return

Our ultimate hope is not cultural transformation but Christ's return. We labor faithfully, knowing that our work is "not in vain in the Lord" (1 Corinthians 15:58).

### D. The Global Church

While Western Christianity declines, the global church is growing rapidly. The center of Christianity has shifted to the Global South. Western Christians can learn from and partner with the vibrant church worldwide.

## VI. Key Points Summary

- Post-Christian culture is characterized by the marginalization of Christian influence
- Biblical models (exile, early church, Daniel) guide faithful witness
- Strategies include faithful presence, apologetics, hospitality, and prophetic witness
- Hope is grounded in God's sovereignty, the gospel's power, and Christ's return
- The global church reminds us that Christianity is flourishing worldwide

## VII. Scripture Memory

> "And seek the peace of the city where I have caused you to be carried away captive, and pray to the LORD for it; for in its peace you will have peace." — Jeremiah 29:7 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Technology, AI, and Christian Ethics",
    content: `# Technology, AI, and Christian Ethics

## I. Introduction

Technological advancement has always raised ethical questions, but the pace and scope of contemporary innovation—particularly in artificial intelligence, biotechnology, and digital communication—present unprecedented challenges. Christians must think carefully about how to engage with technology in ways that honor God, serve human flourishing, and maintain faithful witness.

This lesson examines technology through the lens of biblical theology, exploring both its potential for good and its dangers. We will develop a framework for ethical engagement with emerging technologies, with particular attention to artificial intelligence.

**Learning Objectives:**
- Understand a biblical theology of technology and human creativity
- Examine the ethical implications of artificial intelligence
- Evaluate the impact of digital technology on human relationships and discipleship
- Develop wisdom for faithful engagement with technology

## II. A Biblical Theology of Technology

### A. Human Creativity and the Cultural Mandate

Technology is an expression of human creativity, which itself reflects the image of God. The cultural mandate of Genesis 1:28—"Be fruitful and multiply; fill the earth and subdue it"—includes the development of tools and techniques to cultivate creation.

The Hebrew word עָבַד (abad, "to work" or "to serve") in Genesis 2:15 implies active cultivation, not passive observation. Humans are called to develop creation's potential through creative work.

### B. Technology in Scripture

Scripture records technological development without condemnation:

- Tubal-Cain was "an instructor of every craftsman in bronze and iron" (Genesis 4:22)
- Noah built the ark using sophisticated construction techniques (Genesis 6)
- Bezalel was filled with the Spirit for artistic and technical work on the tabernacle (Exodus 31:1-5)

Technology is not inherently evil but can be used for good or ill depending on human intentions and applications.

### C. The Dangers of Technological Idolatry

The Tower of Babel (Genesis 11) illustrates the danger of technology divorced from God—the attempt to "make a name for ourselves" through human achievement. Technology becomes idolatrous when it:

- Promises salvation apart from God
- Replaces human relationships with artificial substitutes
- Enhances human power without moral formation
- Serves mammon rather than God's purposes

## III. Artificial Intelligence: Opportunities and Challenges

### A. What Is AI?

Artificial intelligence refers to computer systems designed to perform tasks that typically require human intelligence—learning, reasoning, problem-solving, perception, and language understanding. Current AI includes:

- **Machine learning**: Systems that improve through experience
- **Natural language processing**: Understanding and generating human language
- **Computer vision**: Interpreting visual information
- **Generative AI**: Creating text, images, and other content

### B. Ethical Concerns with AI

**Truthfulness and Deception**: AI can generate convincing but false content (deepfakes, misinformation). Christians committed to truth (John 14:6; Ephesians 4:25) must be vigilant.

**Human Dignity and Replacement**: As AI automates more tasks, questions arise about human purpose and dignity. Work is part of human calling (Genesis 2:15), not merely a means to income.

**Bias and Justice**: AI systems can perpetuate or amplify existing biases. Justice (mishpat) requires attention to how AI affects the vulnerable.

**Privacy and Surveillance**: AI enables unprecedented surveillance capabilities. Human dignity includes the right to privacy and freedom from constant monitoring.

**Autonomy and Accountability**: As AI systems make more decisions, questions of moral responsibility become complex. Who is accountable when an AI causes harm?

### C. AI and the Imago Dei

AI, however sophisticated, is not created in God's image. It lacks:

- **Consciousness**: Subjective experience and self-awareness
- **Moral agency**: The capacity for genuine moral choice
- **Spiritual nature**: The ability to relate to God
- **Intrinsic dignity**: Value is instrumental, not inherent

Christians should resist the temptation to attribute personhood to AI systems or to treat them as moral agents.

## IV. Digital Technology and Human Flourishing

### A. The Impact on Relationships

Digital technology has transformed human relationships:

- **Connection and isolation**: Social media connects globally while often increasing local isolation
- **Shallow vs. deep**: Digital communication tends toward breadth rather than depth
- **Presence and absence**: Constant connectivity can undermine genuine presence with those physically near

The biblical vision of community (κοινωνία, koinonia) involves embodied presence, not merely digital connection (Hebrews 10:24-25).

### B. Attention and Formation

Digital technology competes for attention, often through addictive design. The Christian call to "set your mind on things above" (Colossians 3:2) and to practice self-control (Galatians 5:23) requires intentional management of digital consumption.

The formation of Christian character requires practices—prayer, Scripture reading, worship, service—that are undermined by constant distraction.

### C. Children and Technology

Parents bear responsibility for guiding children's technology use. Considerations include:

- Age-appropriate access and content
- Screen time limits
- Modeling healthy technology habits
- Teaching discernment and self-control

## V. A Framework for Faithful Engagement

### A. Questions to Ask

When evaluating technology, Christians should ask:

1. **Does this serve human flourishing?** Technology should enhance, not diminish, human life.
2. **Does this honor human dignity?** Both users and those affected by the technology deserve respect.
3. **Does this promote truth?** Christians are committed to truthfulness in all things.
4. **Does this foster genuine community?** Technology should enhance, not replace, embodied relationships.
5. **Does this support spiritual formation?** Our tools should aid, not hinder, growth in Christ.
6. **Does this serve justice?** Technology should not harm the vulnerable or perpetuate injustice.

### B. Practices for Wisdom

- **Sabbath from technology**: Regular disconnection for rest and presence
- **Intentional use**: Purposeful rather than passive consumption
- **Accountability**: Community oversight of technology habits
- **Discernment**: Evaluating new technologies before adoption
- **Moderation**: Avoiding both technophobia and uncritical embrace

## VI. Key Points Summary

- Technology is a legitimate expression of human creativity under God
- AI raises profound ethical questions about truth, dignity, and accountability
- Digital technology impacts relationships, attention, and spiritual formation
- Christians must engage technology with wisdom and discernment
- The goal is human flourishing and faithful witness, not technological progress for its own sake

## VII. Scripture Memory

> "See then that you walk circumspectly, not as fools but as wise, redeeming the time, because the days are evil." — Ephesians 5:15-16 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Environmental Stewardship and Creation Care",
    content: `# Environmental Stewardship and Creation Care

## I. Introduction

Environmental issues—climate change, pollution, biodiversity loss, resource depletion—have become prominent concerns in contemporary society. Christians have sometimes been accused of contributing to environmental degradation through an emphasis on human dominion over nature. This lesson examines what Scripture teaches about creation care and develops a theology of environmental stewardship.

The biblical doctrine of creation provides the foundation for environmental ethics. God created the world, declared it good, and entrusted it to human stewardship. This stewardship involves both the right to use creation's resources and the responsibility to care for creation on behalf of its Creator.

**Learning Objectives:**
- Understand the biblical basis for creation care
- Examine the concept of stewardship in Scripture
- Evaluate contemporary environmental issues theologically
- Develop a balanced approach to environmental responsibility

## II. The Biblical Doctrine of Creation

### A. God as Creator

Scripture begins with the affirmation that God created all things: "In the beginning God created the heavens and the earth" (Genesis 1:1). The Hebrew בָּרָא (bara, "to create") is used exclusively of divine creative activity.

Key truths about creation:

- **Creation is distinct from God**: Unlike pantheism, Scripture distinguishes Creator from creation
- **Creation is good**: God declared His work "very good" (Genesis 1:31)
- **Creation reveals God**: "The heavens declare the glory of God" (Psalm 19:1)
- **Creation belongs to God**: "The earth is the LORD's, and all its fullness" (Psalm 24:1)

### B. The Goodness of the Material World

Against Gnostic tendencies to devalue the material world, Scripture affirms its goodness. The incarnation—God becoming flesh (John 1:14)—and the promise of bodily resurrection and new creation (Revelation 21:1) underscore the value of the physical world.

### C. Creation's Purpose

Creation exists for God's glory: "For by Him all things were created... All things were created through Him and for Him" (Colossians 1:16). Creation is not merely a resource for human consumption but a theater of God's glory.

## III. Human Stewardship

### A. The Cultural Mandate

Genesis 1:28 establishes human responsibility: "Be fruitful and multiply; fill the earth and subdue it; have dominion over the fish of the sea, over the birds of the air, and over every living thing that moves on the earth."

The Hebrew רָדָה (radah, "to rule" or "have dominion") and כָּבַשׁ (kabash, "to subdue") do not authorize exploitation but responsible rule. Human dominion is exercised under God's ultimate sovereignty.

### B. The Garden Mandate

Genesis 2:15 specifies the nature of human work: "Then the LORD God took the man and put him in the garden of Eden to tend (עָבַד, abad) and keep (שָׁמַר, shamar) it."

- **Abad** means "to work" or "to serve"—active cultivation
- **Shamar** means "to keep" or "to guard"—protective care

Stewardship involves both development and preservation, use and protection.

### C. Stewardship, Not Ownership

Humans are stewards (οἰκονόμος, oikonomos), not owners. We manage what belongs to God and will give account for our stewardship (Luke 16:2). This accountability extends to how we treat creation.

## IV. The Effects of the Fall on Creation

### A. The Curse on the Ground

The Fall brought consequences for creation: "Cursed is the ground for your sake; in toil you shall eat of it all the days of your life" (Genesis 3:17). Human sin introduced disorder into the created order.

### B. Creation's Groaning

Romans 8:20-22 describes creation's present condition: "For the creation was subjected to futility, not willingly, but because of Him who subjected it in hope... the whole creation groans and labors with birth pangs together until now."

Creation suffers the effects of human sin and awaits liberation.

### C. Human Responsibility

Environmental degradation is a consequence of human sin—greed, short-sightedness, and failure to exercise responsible stewardship. The Fall does not excuse environmental harm but explains its origin.

## V. Redemption and New Creation

### A. Christ's Cosmic Redemption

Christ's redemptive work extends to all creation: "For it pleased the Father that in Him all the fullness should dwell, and by Him to reconcile all things to Himself... whether things on earth or things in heaven" (Colossians 1:19-20).

### B. The Promise of New Creation

Scripture promises not the destruction of creation but its renewal: "Nevertheless we, according to His promise, look for new heavens and a new earth in which righteousness dwells" (2 Peter 3:13).

Revelation 21:1-5 describes the new creation where God dwells with His people and "makes all things new."

### C. Present Implications

The promise of new creation does not justify present neglect. Rather, our care for creation anticipates and witnesses to the coming renewal. We are called to be signs of the kingdom.

## VI. Applying Creation Care Today

### A. Principles for Environmental Ethics

1. **Creation has intrinsic value** because God made it and declared it good
2. **Humans are stewards**, accountable to God for creation care
3. **Development and preservation** must be held in balance
4. **The poor are often most affected** by environmental degradation
5. **Future generations** deserve consideration in present decisions
6. **Science and Scripture** should inform our understanding

### B. Practical Applications

- **Personal stewardship**: Reducing waste, conserving resources, sustainable consumption
- **Community engagement**: Supporting local environmental initiatives
- **Advocacy**: Speaking for creation care in public discourse
- **Church leadership**: Modeling environmental responsibility in church practices

### C. Avoiding Extremes

Christians should avoid both:

- **Exploitation**: Treating creation as merely a resource to be consumed
- **Nature worship**: Elevating creation above human welfare or to divine status

The biblical balance is stewardship—responsible care that honors both Creator and creation.

## VII. Key Points Summary

- God created the world and declared it good
- Humans are stewards, not owners, of creation
- The Fall brought disorder, but redemption extends to all creation
- Creation care is a legitimate Christian concern
- Stewardship involves both use and protection of creation

## VIII. Scripture Memory

> "The earth is the LORD's, and all its fullness, the world and those who dwell therein." — Psalm 24:1 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "Ecumenism, Denominationalism, and Christian Unity",
    content: `# Ecumenism, Denominationalism, and Christian Unity

## I. Introduction

The visible disunity of the Christian church—manifested in thousands of denominations and traditions—presents both a theological problem and a practical challenge. Jesus prayed that His followers would be one (John 17:21), yet Christians are divided over doctrine, practice, and governance. This lesson examines the biblical call to unity, the historical development of denominationalism, and contemporary approaches to ecumenism.

The goal is neither uncritical ecumenism that sacrifices truth for unity nor sectarian isolation that ignores Christ's prayer. Rather, we seek a biblically grounded approach that maintains doctrinal integrity while pursuing genuine fellowship with all who belong to Christ.

**Learning Objectives:**
- Understand the biblical basis for Christian unity
- Trace the historical development of denominationalism
- Evaluate contemporary ecumenical movements
- Develop a balanced approach to unity and truth

## II. The Biblical Call to Unity

### A. Jesus' Prayer for Unity

John 17:20-23 records Jesus' prayer for His followers:

> "I do not pray for these alone, but also for those who will believe in Me through their word; that they all may be one, as You, Father, are in Me, and I in You; that they also may be one in Us, that the world may believe that You sent Me."

Key observations:

- Unity is modeled on the Trinity—the Father and Son are distinct yet one
- Unity has a missional purpose—"that the world may believe"
- Unity is a gift to be received and maintained, not merely an achievement

### B. Pauline Teaching on Unity

Paul emphasized unity in the body of Christ:

**Ephesians 4:3-6**: "Endeavoring to keep the unity of the Spirit in the bond of peace. There is one body and one Spirit, just as you were called in one hope of your calling; one Lord, one faith, one baptism; one God and Father of all."

**1 Corinthians 1:10-13**: Paul rebuked divisions at Corinth: "Is Christ divided? Was Paul crucified for you?"

**Galatians 3:28**: "There is neither Jew nor Greek, there is neither slave nor free, there is neither male nor female; for you are all one in Christ Jesus."

### C. The Nature of Christian Unity

Biblical unity is:

- **Spiritual**: Rooted in the Holy Spirit's work, not merely organizational
- **Visible**: Meant to be seen by the world as a witness
- **Doctrinal**: Based on shared faith in essential truths
- **Relational**: Expressed in love and fellowship
- **Missional**: Serving the church's witness to the world

## III. The History of Denominationalism

### A. Early Church Unity and Division

The early church maintained remarkable unity despite geographical spread. The ecumenical councils (Nicaea, Constantinople, Chalcedon) defined orthodox doctrine against heresy.

However, divisions emerged:

- **1054**: The Great Schism between Eastern Orthodox and Roman Catholic churches
- **1517**: The Protestant Reformation divided Western Christianity
- **Post-Reformation**: Protestantism fragmented into numerous traditions

### B. Causes of Division

Divisions have arisen over:

- **Doctrine**: Disagreements over salvation, sacraments, Scripture
- **Governance**: Episcopal, presbyterian, congregational polities
- **Practice**: Worship styles, ethical standards, cultural expressions
- **Personality**: Conflicts between leaders
- **Culture**: National, ethnic, and linguistic differences

### C. Evaluating Denominationalism

Denominationalism has both positive and negative aspects:

**Positive**:
- Allows for legitimate diversity in non-essential matters
- Provides accountability structures
- Preserves distinctive theological emphases
- Enables contextual mission

**Negative**:
- Obscures the unity of Christ's body
- Hinders mission and witness
- Perpetuates unnecessary divisions
- Can foster pride and competition

## IV. Contemporary Ecumenism

### A. The Ecumenical Movement

The modern ecumenical movement emerged in the early 20th century, culminating in the World Council of Churches (1948). It sought to overcome divisions and promote visible unity.

### B. Critiques of Ecumenism

Evangelical critiques of the ecumenical movement include:

- **Doctrinal minimalism**: Unity achieved by minimizing distinctive doctrines
- **Liberal theology**: Association with theological liberalism
- **Institutional focus**: Emphasis on organizational merger rather than spiritual unity
- **Syncretism**: Blurring boundaries with non-Christian religions

### C. Evangelical Approaches

Evangelicals have pursued unity through:

- **Parachurch organizations**: Cooperation across denominational lines
- **Evangelical alliances**: Networks like the World Evangelical Alliance
- **Bilateral dialogues**: Conversations between specific traditions
- **Local cooperation**: Joint ministry efforts in communities

## V. Principles for Pursuing Unity

### A. Distinguishing Essentials and Non-Essentials

The Reformation maxim applies: "In essentials, unity; in non-essentials, liberty; in all things, charity."

**Essential doctrines** (where division may be necessary):
- The Trinity
- The deity and humanity of Christ
- Salvation by grace through faith
- The authority of Scripture
- The bodily resurrection

**Non-essential matters** (where diversity is permissible):
- Church governance structures
- Worship styles
- Views on secondary doctrines
- Cultural expressions

### B. Levels of Fellowship

Christians can relate at different levels:

1. **Full communion**: Shared membership, sacraments, ministry
2. **Cooperative ministry**: Joint projects while maintaining distinct identities
3. **Dialogue**: Respectful conversation across differences
4. **Recognition**: Acknowledging others as genuine Christians despite disagreements

### C. The Marks of the Church

The Reformers identified marks of the true church:

- **The Word rightly preached**: Faithful proclamation of the gospel
- **The sacraments rightly administered**: Baptism and Lord's Supper according to Christ's institution
- **Church discipline**: Maintaining holiness and accountability

Where these marks are present, we recognize a true church, even amid imperfections.

## VI. Practical Applications

### A. Local Church Cooperation

Churches can cooperate in:
- Evangelistic outreach
- Mercy ministry to the poor
- Prayer gatherings
- Community service

### B. Personal Relationships

Individual Christians can:
- Build friendships across denominational lines
- Learn from other traditions
- Pray for the unity of Christ's church
- Avoid unnecessary criticism of other believers

### C. Maintaining Integrity

Unity must not compromise:
- The gospel itself
- Essential doctrines
- Moral standards
- Faithful witness

## VII. Key Points Summary

- Jesus prayed for the unity of His followers
- Denominationalism has both positive and negative aspects
- Ecumenism must be evaluated carefully
- Unity requires distinguishing essentials from non-essentials
- Christians should pursue unity while maintaining doctrinal integrity

## VIII. Scripture Memory

> "Endeavoring to keep the unity of the Spirit in the bond of peace. There is one body and one Spirit, just as you were called in one hope of your calling." — Ephesians 4:3-4 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "World Religions and the Uniqueness of Christ",
    content: `# World Religions and the Uniqueness of Christ

## I. Introduction

In an increasingly pluralistic world, Christians regularly encounter adherents of other religions—Islam, Hinduism, Buddhism, Judaism, and others. The question of how Christianity relates to other religions is both theologically significant and practically urgent. This lesson examines the major world religions, evaluates pluralistic approaches to religion, and affirms the uniqueness of Jesus Christ as the only way of salvation.

The Christian claim that Jesus is "the way, the truth, and the life" (John 14:6) is considered offensive in a culture that prizes tolerance and religious diversity. Yet faithfulness to Scripture requires maintaining this claim while engaging other religions with respect and genuine understanding.

**Learning Objectives:**
- Understand the basic beliefs of major world religions
- Evaluate pluralistic and inclusivist approaches to religion
- Affirm the biblical basis for Christ's uniqueness
- Develop a gracious approach to interfaith engagement

## II. Overview of Major World Religions

### A. Islam

**Founder**: Muhammad (c. 570-632 AD)
**Scripture**: The Quran
**Core beliefs**:
- Strict monotheism (tawhid): "There is no god but Allah"
- Muhammad is the final prophet
- Five Pillars: confession, prayer, alms, fasting, pilgrimage
- Salvation through submission to Allah and good works

**Relationship to Christianity**: Islam acknowledges Jesus (Isa) as a prophet but denies His deity, crucifixion, and resurrection.

### B. Hinduism

**Origin**: Ancient India (c. 1500 BC and earlier)
**Scriptures**: Vedas, Upanishads, Bhagavad Gita
**Core beliefs**:
- Brahman: The ultimate reality underlying all existence
- Atman: The individual soul, ultimately identical with Brahman
- Karma: The law of moral cause and effect
- Samsara: The cycle of death and rebirth
- Moksha: Liberation from the cycle through various paths

**Diversity**: Hinduism encompasses monotheistic, polytheistic, and pantheistic expressions.

### C. Buddhism

**Founder**: Siddhartha Gautama, the Buddha (c. 563-483 BC)
**Scriptures**: Tripitaka, various sutras
**Core beliefs**:
- Four Noble Truths: Life is suffering; suffering arises from desire; suffering ceases when desire ceases; the Eightfold Path leads to cessation
- Eightfold Path: Right understanding, intention, speech, action, livelihood, effort, mindfulness, concentration
- Nirvana: Extinction of desire and escape from the cycle of rebirth
- No-self (anatta): Denial of a permanent self or soul

**Varieties**: Theravada, Mahayana, Vajrayana (Tibetan)

### D. Judaism

**Origin**: Abraham (c. 2000 BC), Moses (c. 1400 BC)
**Scriptures**: Hebrew Bible (Tanakh), Talmud
**Core beliefs**:
- Monotheism: "Hear, O Israel: The LORD our God, the LORD is one" (Deuteronomy 6:4)
- Covenant: God's special relationship with Israel
- Torah: Divine law governing all of life
- Messianic hope: Expectation of a coming deliverer

**Relationship to Christianity**: Christianity emerged from Judaism and shares the Hebrew Scriptures but differs on the identity of the Messiah.

### E. Other Religions

- **Sikhism**: Monotheistic religion founded in 15th-century India
- **Confucianism**: Chinese ethical system emphasizing social harmony
- **Taoism**: Chinese philosophy/religion focused on harmony with the Tao
- **Shinto**: Japanese religion centered on kami (spirits) and ritual purity
- **Indigenous religions**: Diverse traditions worldwide

## III. Approaches to Religious Diversity

### A. Pluralism

**Definition**: All religions are equally valid paths to the same ultimate reality.

**Proponents**: John Hick, Paul Knitter

**Key claims**:
- The Real (ultimate reality) is beyond all human concepts
- Different religions are culturally conditioned responses to the Real
- No religion has privileged access to truth
- Salvation/liberation is available through all traditions

**Critique**: Pluralism contradicts the exclusive claims of most religions, including Christianity. It imposes a meta-narrative that no religion actually teaches.

### B. Inclusivism

**Definition**: Christ is the only Savior, but salvation may be available to those who have not explicitly heard the gospel.

**Proponents**: Karl Rahner ("anonymous Christians"), Clark Pinnock

**Key claims**:
- Christ's atonement is universally sufficient
- The Holy Spirit may work beyond the visible church
- Those who respond to the light they have may be saved through Christ

**Critique**: While more biblically grounded than pluralism, inclusivism lacks clear scriptural support and may undermine evangelistic urgency.

### C. Exclusivism (Particularism)

**Definition**: Salvation is available only through explicit faith in Jesus Christ.

**Biblical basis**:
- John 14:6: "I am the way, the truth, and the life. No one comes to the Father except through Me."
- Acts 4:12: "Nor is there salvation in any other, for there is no other name under heaven given among men by which we must be saved."
- 1 Timothy 2:5: "For there is one God and one Mediator between God and men, the Man Christ Jesus."

**Implications**: Exclusivism underscores the urgency of evangelism and missions.

## IV. The Uniqueness of Christ

### A. Unique Claims

Jesus made claims no other religious founder made:

- **Divine identity**: "I and My Father are one" (John 10:30)
- **Exclusive salvation**: "No one comes to the Father except through Me" (John 14:6)
- **Authority over sin**: "Son, your sins are forgiven you" (Mark 2:5)
- **Power over death**: "I am the resurrection and the life" (John 11:25)

### B. Unique Work

Christ accomplished what no other can:

- **Incarnation**: God became man (John 1:14)
- **Atonement**: He bore the penalty for sin (1 Peter 2:24)
- **Resurrection**: He conquered death (1 Corinthians 15:20)
- **Mediation**: He reconciles God and humanity (1 Timothy 2:5)

### C. Unique Verification

Christ's claims are verified by:

- **Fulfilled prophecy**: Hundreds of Old Testament predictions fulfilled
- **Miracles**: Signs authenticating His divine mission
- **Resurrection**: Historical evidence for His bodily rising
- **Transformed lives**: Ongoing testimony of changed lives

## V. Engaging Other Religions

### A. With Truth

Christians must maintain the exclusive claims of Christ without compromise. Love does not require affirming error.

### B. With Grace

Engagement should be characterized by:

- Respect for persons created in God's image
- Genuine listening and understanding
- Humility about our own limitations
- Patience in building relationships

### C. With Wisdom

Effective witness requires:

- Understanding the beliefs of others
- Finding points of contact and common ground
- Addressing felt needs and genuine questions
- Presenting Christ as the fulfillment of human longing

## VI. Key Points Summary

- Major world religions offer different answers to life's ultimate questions
- Pluralism and inclusivism fail to account for Scripture's exclusive claims
- Jesus Christ is unique in His person, work, and claims
- Christians must engage other religions with truth, grace, and wisdom
- The gospel remains the power of God for salvation to all who believe

## VII. Scripture Memory

> "Jesus said to him, 'I am the way, the truth, and the life. No one comes to the Father except through Me.'" — John 14:6 (NKJV)

---
*Licensed to Larry Fisher*`
  }
];

// Insert lessons (starting from order 3 since 2 lessons already exist)
for (let i = 0; i < lessons.length; i++) {
  const lesson = lessons[i];
  const lessonOrder = i + 3;
  const [result] = await connection.execute(
    `INSERT INTO lessons (courseId, title, content, lessonOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [courseId, lesson.title, lesson.content, lessonOrder]
  );
  console.log(`Created lesson ${i+1}: ${lesson.title} (ID: ${result.insertId})`);
}

console.log('\nDIV113 lessons created successfully!');
await connection.end();
