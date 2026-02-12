import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get all DIV113 lessons
const [lessons] = await connection.execute(`
  SELECT id, title FROM lessons WHERE courseId = 570006 ORDER BY id
`);

console.log(`Found ${lessons.length} lessons for DIV113`);

// Quiz questions for each lesson (10 MC + 1 short answer)
const quizData = {
  "Science and Faith": [
    { q: "The view that science and faith are in perpetual conflict is called:", type: "multiple_choice", options: ["Complementarianism", "Conflict thesis", "Integration", "Independence"], answer: "Conflict thesis" },
    { q: "Which approach views science and religion as addressing different questions?", type: "multiple_choice", options: ["Conflict", "Independence (NOMA)", "Integration", "Replacement"], answer: "Independence (NOMA)" },
    { q: "The fine-tuning of the universe for life is evidence for:", type: "multiple_choice", options: ["Random chance", "Intelligent design", "Multiverse only", "Naturalism"], answer: "Intelligent design" },
    { q: "Which scientist was a devout Christian who developed the laws of motion?", type: "multiple_choice", options: ["Darwin", "Newton", "Hawking", "Sagan"], answer: "Newton" },
    { q: "The Big Bang theory was first proposed by:", type: "multiple_choice", options: ["An atheist physicist", "A Catholic priest (Lemaître)", "A Hindu scientist", "A secular philosopher"], answer: "A Catholic priest (Lemaître)" },
    { q: "Methodological naturalism means:", type: "multiple_choice", options: ["God does not exist", "Science studies natural causes without denying the supernatural", "Religion is false", "Only matter exists"], answer: "Science studies natural causes without denying the supernatural" },
    { q: "The Galileo affair is often misrepresented as:", type: "multiple_choice", options: ["A scientific debate", "A conflict between science and faith", "A political dispute", "A personal vendetta"], answer: "A conflict between science and faith" },
    { q: "Francis Collins, director of the Human Genome Project, is:", type: "multiple_choice", options: ["An atheist", "A Christian believer", "An agnostic", "A Buddhist"], answer: "A Christian believer" },
    { q: "The cosmological argument for God's existence is based on:", type: "multiple_choice", options: ["Morality", "The origin of the universe", "Religious experience", "Miracles"], answer: "The origin of the universe" },
    { q: "Science can answer questions about:", type: "multiple_choice", options: ["Ultimate meaning and purpose", "How the natural world works", "Moral values", "Aesthetic beauty"], answer: "How the natural world works" },
    { q: "Explain how science and Christian faith can be complementary rather than contradictory.", type: "short_answer", options: null, answer: "Science and faith address different but complementary questions—science explains how the natural world works, while faith addresses why it exists and what it means. Both can be true simultaneously." }
  ],
  "Religious Pluralism": [
    { q: "Religious pluralism claims that:", type: "multiple_choice", options: ["Only Christianity is true", "All religions are equally valid paths to God", "No religion is true", "Religion is harmful"], answer: "All religions are equally valid paths to God" },
    { q: "The philosopher most associated with religious pluralism is:", type: "multiple_choice", options: ["Alvin Plantinga", "John Hick", "William Lane Craig", "C.S. Lewis"], answer: "John Hick" },
    { q: "Jesus' statement 'I am the way, the truth, and the life' is found in:", type: "multiple_choice", options: ["Matthew 28:19", "John 14:6", "Romans 10:9", "Acts 4:12"], answer: "John 14:6" },
    { q: "The inclusivist view holds that:", type: "multiple_choice", options: ["All religions save", "Only explicit faith in Christ saves", "Christ saves, but some may be saved without explicit knowledge", "No one is saved"], answer: "Christ saves, but some may be saved without explicit knowledge" },
    { q: "A major problem with pluralism is that:", type: "multiple_choice", options: ["It respects all religions", "It contradicts the exclusive claims of most religions", "It promotes tolerance", "It encourages dialogue"], answer: "It contradicts the exclusive claims of most religions" },
    { q: "Acts 4:12 declares that salvation is found in:", type: "multiple_choice", options: ["Many names", "No name", "No other name but Jesus", "Any sincere belief"], answer: "No other name but Jesus" },
    { q: "The 'blind men and the elephant' parable is used to argue for:", type: "multiple_choice", options: ["Christian exclusivism", "Religious pluralism", "Atheism", "Agnosticism"], answer: "Religious pluralism" },
    { q: "A critique of the elephant parable is that:", type: "multiple_choice", options: ["Elephants don't exist", "The narrator claims to see what the blind men cannot", "It supports Christianity", "It proves pluralism"], answer: "The narrator claims to see what the blind men cannot" },
    { q: "Exclusivism holds that:", type: "multiple_choice", options: ["All religions are true", "Salvation is only through explicit faith in Christ", "God saves everyone", "Truth is relative"], answer: "Salvation is only through explicit faith in Christ" },
    { q: "Christians should engage other religions with:", type: "multiple_choice", options: ["Hostility", "Indifference", "Truth and grace", "Compromise"], answer: "Truth and grace" },
    { q: "Explain why religious pluralism is logically inconsistent.", type: "short_answer", options: null, answer: "Pluralism claims all religions are equally true, but religions make contradictory claims (e.g., God is personal vs. impersonal). Contradictory claims cannot all be true simultaneously." }
  ],
  "Bioethics and the Sanctity of Life": [
    { q: "The doctrine of the sanctity of life is based on:", type: "multiple_choice", options: ["Human achievement", "The imago Dei (image of God)", "Social utility", "Legal status"], answer: "The imago Dei (image of God)" },
    { q: "Genesis 1:27 teaches that humans are created in:", type: "multiple_choice", options: ["The image of angels", "The image of animals", "The image of God", "Their own image"], answer: "The image of God" },
    { q: "The Hebrew word 'tselem' means:", type: "multiple_choice", options: ["Soul", "Body", "Image", "Spirit"], answer: "Image" },
    { q: "Psalm 139:13-14 affirms that humans are:", type: "multiple_choice", options: ["Products of chance", "Fearfully and wonderfully made", "Merely physical beings", "Accidents of nature"], answer: "Fearfully and wonderfully made" },
    { q: "The Didache, an early Christian document, explicitly condemned:", type: "multiple_choice", options: ["Slavery", "Abortion", "Poverty", "War"], answer: "Abortion" },
    { q: "Euthanasia comes from Greek words meaning:", type: "multiple_choice", options: ["Painful death", "Good death", "Quick death", "Natural death"], answer: "Good death" },
    { q: "The distinction between killing and allowing to die is:", type: "multiple_choice", options: ["Meaningless", "Morally significant", "Legally irrelevant", "Theologically unimportant"], answer: "Morally significant" },
    { q: "Germline genetic editing raises concerns because:", type: "multiple_choice", options: ["It only affects one person", "Changes are passed to future generations", "It is inexpensive", "It has no risks"], answer: "Changes are passed to future generations" },
    { q: "According to Scripture, who is the Lord of life and death?", type: "multiple_choice", options: ["Humans", "Doctors", "God alone", "The state"], answer: "God alone" },
    { q: "Palliative care focuses on:", type: "multiple_choice", options: ["Hastening death", "Prolonging life at all costs", "Comfort and pain management", "Experimental treatments"], answer: "Comfort and pain management" },
    { q: "Explain why the imago Dei is foundational for bioethics.", type: "short_answer", options: null, answer: "The imago Dei means every human has inherent dignity and worth because they bear God's image, regardless of age, ability, or utility. This grounds the protection of human life at all stages." }
  ],
  "Gender, Sexuality, and Biblical Anthropology": [
    { q: "Genesis 1:27 teaches that God created humanity:", type: "multiple_choice", options: ["As genderless beings", "Male and female", "As a spectrum", "Without bodies"], answer: "Male and female" },
    { q: "The Hebrew terms 'zakar' and 'neqebah' refer to:", type: "multiple_choice", options: ["Soul and spirit", "Male and female", "Heaven and earth", "Good and evil"], answer: "Male and female" },
    { q: "Biblical anthropology affirms that the body is:", type: "multiple_choice", options: ["Evil and to be escaped", "Irrelevant to identity", "Good and integral to personhood", "An illusion"], answer: "Good and integral to personhood" },
    { q: "Marriage is defined in Genesis 2:24 as:", type: "multiple_choice", options: ["Any loving relationship", "A man leaving parents and joining his wife", "A social contract", "A temporary arrangement"], answer: "A man leaving parents and joining his wife" },
    { q: "The Greek word 'porneia' encompasses:", type: "multiple_choice", options: ["Only adultery", "All sexual immorality", "Only prostitution", "Only homosexuality"], answer: "All sexual immorality" },
    { q: "1 Corinthians 6:18-20 teaches that the body is:", type: "multiple_choice", options: ["Unimportant", "A temple of the Holy Spirit", "Merely physical", "To be indulged"], answer: "A temple of the Holy Spirit" },
    { q: "Scripture honors singleness as:", type: "multiple_choice", options: ["A curse", "A legitimate calling", "Second-best", "Unnatural"], answer: "A legitimate calling" },
    { q: "Romans 1:26-27 describes homosexual practice as:", type: "multiple_choice", options: ["Natural", "Contrary to nature", "Neutral", "Blessed"], answer: "Contrary to nature" },
    { q: "The church's response to those struggling with sexual sin should include:", type: "multiple_choice", options: ["Rejection", "Affirmation of sin", "Truth and grace", "Silence"], answer: "Truth and grace" },
    { q: "1 Corinthians 6:11 offers hope because it says:", type: "multiple_choice", options: ["Sin doesn't matter", "Such were some of you, but you were washed", "Change is impossible", "Grace covers ongoing sin"], answer: "Such were some of you, but you were washed" },
    { q: "Explain how the gospel offers hope for those struggling with sexual sin.", type: "short_answer", options: null, answer: "The gospel offers justification (declared righteous through faith), sanctification (progressive transformation by the Spirit), and glorification (complete healing at resurrection), providing forgiveness and power for change." }
  ],
  "Social Justice and the Kingdom of God": [
    { q: "The Hebrew word 'mishpat' is often translated as:", type: "multiple_choice", options: ["Love", "Justice", "Faith", "Hope"], answer: "Justice" },
    { q: "The Hebrew word 'tsedaqah' means:", type: "multiple_choice", options: ["Judgment", "Righteousness", "Mercy", "Power"], answer: "Righteousness" },
    { q: "Micah 6:8 calls believers to do justly, love mercy, and:", type: "multiple_choice", options: ["Seek power", "Walk humbly with God", "Gain wealth", "Avoid conflict"], answer: "Walk humbly with God" },
    { q: "The prophets condemned Israel for:", type: "multiple_choice", options: ["Being too religious", "Oppressing the poor and vulnerable", "Following the law", "Worshiping correctly"], answer: "Oppressing the poor and vulnerable" },
    { q: "Jesus announced His mission in Luke 4 to include:", type: "multiple_choice", options: ["Political revolution", "Good news to the poor and liberty to captives", "Military conquest", "Economic prosperity"], answer: "Good news to the poor and liberty to captives" },
    { q: "The 'already/not yet' of the kingdom means:", type: "multiple_choice", options: ["The kingdom has fully come", "The kingdom will never come", "The kingdom is inaugurated but not consummated", "The kingdom is only spiritual"], answer: "The kingdom is inaugurated but not consummated" },
    { q: "Critical theory analyzes society primarily through:", type: "multiple_choice", options: ["Biblical categories", "Power dynamics between groups", "Economic theory", "Scientific method"], answer: "Power dynamics between groups" },
    { q: "Biblical justice differs from critical theory because:", type: "multiple_choice", options: ["It ignores oppression", "It affirms universal sinfulness and redemption through Christ", "It supports the status quo", "It rejects mercy"], answer: "It affirms universal sinfulness and redemption through Christ" },
    { q: "Galatians 3:28 teaches that in Christ there is:", type: "multiple_choice", options: ["Continued division", "Neither Jew nor Greek, slave nor free, male nor female", "Only spiritual equality", "Political uniformity"], answer: "Neither Jew nor Greek, slave nor free, male nor female" },
    { q: "The church's approach to justice should prioritize:", type: "multiple_choice", options: ["Political power", "The gospel while addressing social concerns", "Avoiding controversy", "Partisan alignment"], answer: "The gospel while addressing social concerns" },
    { q: "Explain the relationship between gospel proclamation and social action.", type: "short_answer", options: null, answer: "Gospel proclamation and social action are both essential but distinct. The gospel addresses the root cause of injustice (sin) while social action demonstrates love and witnesses to the kingdom. Neither should eclipse the other." }
  ],
  "The Church in a Post-Christian Culture": [
    { q: "Post-Christian culture is characterized by:", type: "multiple_choice", options: ["Christian dominance", "The marginalization of Christian influence", "Religious revival", "Theocracy"], answer: "The marginalization of Christian influence" },
    { q: "The 'nones' are those who:", type: "multiple_choice", options: ["Are monks", "Claim no religious affiliation", "Are atheists only", "Reject all spirituality"], answer: "Claim no religious affiliation" },
    { q: "Jeremiah 29:7 instructs exiles to:", type: "multiple_choice", options: ["Rebel against Babylon", "Seek the peace of the city", "Isolate themselves", "Abandon their faith"], answer: "Seek the peace of the city" },
    { q: "Daniel in Babylon exemplifies:", type: "multiple_choice", options: ["Compromise", "Faithful witness in a pagan context", "Withdrawal", "Assimilation"], answer: "Faithful witness in a pagan context" },
    { q: "The early church grew by:", type: "multiple_choice", options: ["Political power", "Distinctive community and winsome witness", "Military force", "Cultural dominance"], answer: "Distinctive community and winsome witness" },
    { q: "James Davison Hunter advocates:", type: "multiple_choice", options: ["Culture war", "Faithful presence", "Withdrawal", "Political activism"], answer: "Faithful presence" },
    { q: "Christian hospitality in a fragmented society is:", type: "multiple_choice", options: ["Irrelevant", "Powerfully attractive", "Outdated", "Dangerous"], answer: "Powerfully attractive" },
    { q: "The promise that 'the gates of Hades will not prevail' against the church is found in:", type: "multiple_choice", options: ["John 3:16", "Matthew 16:18", "Romans 8:28", "Revelation 21:4"], answer: "Matthew 16:18" },
    { q: "The center of global Christianity has shifted to:", type: "multiple_choice", options: ["Europe", "North America", "The Global South", "Australia"], answer: "The Global South" },
    { q: "Our ultimate hope is not cultural transformation but:", type: "multiple_choice", options: ["Political victory", "Christ's return", "Economic prosperity", "Social acceptance"], answer: "Christ's return" },
    { q: "Explain how the Babylonian exile provides a model for the church in post-Christian culture.", type: "short_answer", options: null, answer: "Like the exiles, the church should maintain distinct identity, engage constructively with culture, seek the welfare of society, and trust God's sovereign purposes while awaiting ultimate restoration." }
  ],
  "Technology, AI, and Christian Ethics": [
    { q: "Technology is an expression of:", type: "multiple_choice", options: ["Human sinfulness only", "Human creativity reflecting the imago Dei", "Satanic influence", "Random chance"], answer: "Human creativity reflecting the imago Dei" },
    { q: "The Tower of Babel illustrates the danger of:", type: "multiple_choice", options: ["All technology", "Technology divorced from God", "Building structures", "Human cooperation"], answer: "Technology divorced from God" },
    { q: "AI systems lack which quality essential to the imago Dei?", type: "multiple_choice", options: ["Processing power", "Moral agency and consciousness", "Data storage", "Speed"], answer: "Moral agency and consciousness" },
    { q: "Deepfakes raise ethical concerns about:", type: "multiple_choice", options: ["Entertainment", "Truthfulness and deception", "Efficiency", "Cost"], answer: "Truthfulness and deception" },
    { q: "The Greek word 'koinonia' refers to:", type: "multiple_choice", options: ["Technology", "Fellowship/community", "Knowledge", "Power"], answer: "Fellowship/community" },
    { q: "Hebrews 10:24-25 emphasizes the importance of:", type: "multiple_choice", options: ["Online worship only", "Not forsaking assembling together", "Virtual community", "Digital discipleship"], answer: "Not forsaking assembling together" },
    { q: "Digital technology often promotes:", type: "multiple_choice", options: ["Deep relationships", "Breadth over depth in relationships", "Solitude", "Contemplation"], answer: "Breadth over depth in relationships" },
    { q: "Colossians 3:2 calls believers to set their minds on:", type: "multiple_choice", options: ["Earthly things", "Things above", "Technology", "Entertainment"], answer: "Things above" },
    { q: "A Christian approach to technology should ask whether it:", type: "multiple_choice", options: ["Is new", "Serves human flourishing and honors God", "Is popular", "Is profitable"], answer: "Serves human flourishing and honors God" },
    { q: "Sabbath from technology is important for:", type: "multiple_choice", options: ["Legalism", "Rest and presence with God and others", "Avoiding progress", "Rejecting modernity"], answer: "Rest and presence with God and others" },
    { q: "Explain why AI cannot possess the imago Dei.", type: "short_answer", options: null, answer: "AI lacks consciousness, moral agency, spiritual nature, and intrinsic dignity. It cannot relate to God, make genuine moral choices, or bear responsibility. Its value is instrumental, not inherent." }
  ],
  "Environmental Stewardship and Creation Care": [
    { q: "The Hebrew word 'bara' in Genesis 1:1 refers to:", type: "multiple_choice", options: ["Human creation", "Divine creation", "Natural processes", "Evolution"], answer: "Divine creation" },
    { q: "Genesis 1:31 declares that God's creation was:", type: "multiple_choice", options: ["Flawed", "Very good", "Evil", "Neutral"], answer: "Very good" },
    { q: "Psalm 24:1 teaches that the earth belongs to:", type: "multiple_choice", options: ["Humanity", "The LORD", "No one", "Governments"], answer: "The LORD" },
    { q: "The Hebrew word 'shamar' in Genesis 2:15 means:", type: "multiple_choice", options: ["To exploit", "To keep/guard", "To destroy", "To ignore"], answer: "To keep/guard" },
    { q: "Humans are described as stewards, which means they are:", type: "multiple_choice", options: ["Owners", "Managers accountable to God", "Exploiters", "Irrelevant"], answer: "Managers accountable to God" },
    { q: "Romans 8:20-22 describes creation as:", type: "multiple_choice", options: ["Perfect", "Groaning and awaiting liberation", "Unimportant", "Already redeemed"], answer: "Groaning and awaiting liberation" },
    { q: "Colossians 1:19-20 teaches that Christ's redemption extends to:", type: "multiple_choice", options: ["Humans only", "All things", "Angels only", "Israel only"], answer: "All things" },
    { q: "2 Peter 3:13 promises:", type: "multiple_choice", options: ["Destruction of all matter", "New heavens and a new earth", "Escape from the physical", "Eternal disembodiment"], answer: "New heavens and a new earth" },
    { q: "Christians should avoid both exploitation and:", type: "multiple_choice", options: ["Stewardship", "Nature worship", "Conservation", "Gardening"], answer: "Nature worship" },
    { q: "Environmental degradation often affects most severely:", type: "multiple_choice", options: ["The wealthy", "The poor", "No one", "Only animals"], answer: "The poor" },
    { q: "Explain how the promise of new creation should affect present environmental ethics.", type: "short_answer", options: null, answer: "The promise of new creation does not justify neglect but motivates care. Our stewardship anticipates and witnesses to the coming renewal, demonstrating that creation matters to God." }
  ],
  "Ecumenism, Denominationalism, and Christian Unity": [
    { q: "Jesus prayed for the unity of His followers in:", type: "multiple_choice", options: ["Matthew 28", "John 17", "Luke 24", "Mark 16"], answer: "John 17" },
    { q: "Ephesians 4:3 calls believers to keep the unity of the Spirit in:", type: "multiple_choice", options: ["Doctrine", "The bond of peace", "Organization", "Uniformity"], answer: "The bond of peace" },
    { q: "The Great Schism of 1054 divided:", type: "multiple_choice", options: ["Protestants and Catholics", "Eastern Orthodox and Roman Catholic", "Lutherans and Reformed", "Baptists and Methodists"], answer: "Eastern Orthodox and Roman Catholic" },
    { q: "The Protestant Reformation began in:", type: "multiple_choice", options: ["1054", "1517", "1776", "1948"], answer: "1517" },
    { q: "The World Council of Churches was founded in:", type: "multiple_choice", options: ["1517", "1054", "1948", "2000"], answer: "1948" },
    { q: "A critique of the ecumenical movement is:", type: "multiple_choice", options: ["It emphasizes doctrine too much", "It may minimize essential doctrines for unity", "It is too conservative", "It rejects dialogue"], answer: "It may minimize essential doctrines for unity" },
    { q: "The Reformation maxim states: 'In essentials unity, in non-essentials liberty, in all things':", type: "multiple_choice", options: ["Uniformity", "Charity/love", "Silence", "Debate"], answer: "Charity/love" },
    { q: "Essential doctrines include:", type: "multiple_choice", options: ["Worship styles", "The Trinity and deity of Christ", "Church governance", "Eschatological details"], answer: "The Trinity and deity of Christ" },
    { q: "The marks of the true church according to the Reformers include:", type: "multiple_choice", options: ["Large buildings", "The Word rightly preached and sacraments rightly administered", "Political influence", "Wealth"], answer: "The Word rightly preached and sacraments rightly administered" },
    { q: "Christians from different traditions can cooperate in:", type: "multiple_choice", options: ["Nothing", "Evangelism, mercy ministry, and prayer", "Only worship", "Only politics"], answer: "Evangelism, mercy ministry, and prayer" },
    { q: "Explain the difference between essential and non-essential doctrines.", type: "short_answer", options: null, answer: "Essential doctrines (Trinity, Christ's deity, salvation by grace) are necessary for salvation and define Christianity. Non-essentials (worship styles, church governance) allow for legitimate diversity within orthodoxy." }
  ],
  "World Religions and the Uniqueness of Christ": [
    { q: "Islam teaches that Muhammad is:", type: "multiple_choice", options: ["The Son of God", "The final prophet", "Divine", "The Messiah"], answer: "The final prophet" },
    { q: "Hinduism's concept of Brahman refers to:", type: "multiple_choice", options: ["A personal god", "The ultimate reality underlying all existence", "A prophet", "A sacred text"], answer: "The ultimate reality underlying all existence" },
    { q: "Buddhism's Four Noble Truths address:", type: "multiple_choice", options: ["God's existence", "Suffering and its cessation", "Creation", "Salvation by faith"], answer: "Suffering and its cessation" },
    { q: "Judaism and Christianity share:", type: "multiple_choice", options: ["The New Testament", "The Hebrew Scriptures", "Belief in Jesus as Messiah", "The Quran"], answer: "The Hebrew Scriptures" },
    { q: "John Hick is associated with:", type: "multiple_choice", options: ["Christian exclusivism", "Religious pluralism", "Atheism", "Fundamentalism"], answer: "Religious pluralism" },
    { q: "The inclusivist view holds that:", type: "multiple_choice", options: ["All religions save equally", "Christ is the only Savior but some may be saved without explicit knowledge", "No one is saved", "Christianity is false"], answer: "Christ is the only Savior but some may be saved without explicit knowledge" },
    { q: "Acts 4:12 declares there is no other name for salvation except:", type: "multiple_choice", options: ["Muhammad", "Buddha", "Jesus", "Moses"], answer: "Jesus" },
    { q: "Jesus claimed 'I and My Father are one' in:", type: "multiple_choice", options: ["John 10:30", "Matthew 28:19", "Luke 2:49", "Mark 1:11"], answer: "John 10:30" },
    { q: "Christ's resurrection is significant because it:", type: "multiple_choice", options: ["Is a myth", "Verifies His claims and provides hope", "Is irrelevant", "Happened to many prophets"], answer: "Verifies His claims and provides hope" },
    { q: "Christians should engage other religions with:", type: "multiple_choice", options: ["Hostility", "Indifference", "Truth, grace, and wisdom", "Compromise of the gospel"], answer: "Truth, grace, and wisdom" },
    { q: "Explain why Jesus' claim to be 'the way, the truth, and the life' is exclusive.", type: "short_answer", options: null, answer: "Jesus claims to be the only way to the Father, not one way among many. This excludes other paths to salvation and requires a response of faith or rejection, not mere acknowledgment as one option." }
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
