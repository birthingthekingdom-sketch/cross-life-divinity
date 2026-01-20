import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get all DIV112 lessons
const [lessons] = await connection.execute(`
  SELECT id, title FROM lessons WHERE courseId = 570005 ORDER BY id
`);

console.log(`Found ${lessons.length} lessons for DIV112`);

// Quiz questions for each lesson (10 MC + 1 short answer)
const quizData = {
  "The Incarnation": [
    { q: "What does the term 'incarnation' literally mean?", type: "multiple_choice", options: ["God becoming spirit", "The Word becoming flesh", "Spirit entering matter", "Divine transformation"], answer: "The Word becoming flesh" },
    { q: "Which verse states 'the Word became flesh and dwelt among us'?", type: "multiple_choice", options: ["John 1:1", "John 1:14", "John 3:16", "Colossians 1:15"], answer: "John 1:14" },
    { q: "The Greek word 'logos' in John 1 is translated as:", type: "multiple_choice", options: ["Spirit", "God", "Word", "Light"], answer: "Word" },
    { q: "Which Old Testament passage prophesied the virgin birth?", type: "multiple_choice", options: ["Isaiah 7:14", "Micah 5:2", "Psalm 22:1", "Genesis 3:15"], answer: "Isaiah 7:14" },
    { q: "The incarnation demonstrates that Jesus is:", type: "multiple_choice", options: ["Only divine", "Only human", "Both fully divine and fully human", "Neither divine nor human"], answer: "Both fully divine and fully human" },
    { q: "What does 'Immanuel' mean?", type: "multiple_choice", options: ["Prince of Peace", "God with us", "Mighty God", "Everlasting Father"], answer: "God with us" },
    { q: "The doctrine of the incarnation was formally defined at which council?", type: "multiple_choice", options: ["Nicaea", "Constantinople", "Chalcedon", "Ephesus"], answer: "Chalcedon" },
    { q: "According to Philippians 2:7, Christ 'emptied Himself' by:", type: "multiple_choice", options: ["Giving up His deity", "Taking the form of a servant", "Losing His divine attributes", "Becoming less than God"], answer: "Taking the form of a servant" },
    { q: "The incarnation was necessary for salvation because:", type: "multiple_choice", options: ["God needed to experience humanity", "Only a human could die for humans", "It was a divine experiment", "Angels could not save"], answer: "Only a human could die for humans" },
    { q: "Which heresy denied the reality of Christ's human body?", type: "multiple_choice", options: ["Arianism", "Docetism", "Nestorianism", "Pelagianism"], answer: "Docetism" },
    { q: "Explain why the incarnation is essential for Christian salvation.", type: "short_answer", options: null, answer: "The incarnation is essential because only a divine-human Savior could bridge the gap between God and humanity, offering a sacrifice of infinite value while truly representing humanity." }
  ],
  "The Life and Ministry of Jesus": [
    { q: "How long was Jesus' public ministry approximately?", type: "multiple_choice", options: ["1 year", "2 years", "3 years", "5 years"], answer: "3 years" },
    { q: "Where did Jesus grow up after returning from Egypt?", type: "multiple_choice", options: ["Bethlehem", "Jerusalem", "Nazareth", "Capernaum"], answer: "Nazareth" },
    { q: "Jesus' baptism by John marked the beginning of His:", type: "multiple_choice", options: ["Childhood", "Private life", "Public ministry", "Suffering"], answer: "Public ministry" },
    { q: "How many disciples did Jesus choose as His inner circle?", type: "multiple_choice", options: ["3", "7", "12", "70"], answer: "12" },
    { q: "The Sermon on the Mount is recorded primarily in which Gospel?", type: "multiple_choice", options: ["Mark", "Matthew", "Luke", "John"], answer: "Matthew" },
    { q: "Jesus' miracles demonstrated His authority over:", type: "multiple_choice", options: ["Only nature", "Only disease", "Only demons", "Nature, disease, demons, and death"], answer: "Nature, disease, demons, and death" },
    { q: "The Transfiguration revealed Jesus' divine:", type: "multiple_choice", options: ["Humanity", "Glory", "Weakness", "Suffering"], answer: "Glory" },
    { q: "Who appeared with Jesus at the Transfiguration?", type: "multiple_choice", options: ["Abraham and David", "Moses and Elijah", "Isaiah and Jeremiah", "Peter and John"], answer: "Moses and Elijah" },
    { q: "Jesus taught primarily through:", type: "multiple_choice", options: ["Philosophical lectures", "Parables and sermons", "Written documents", "Silent meditation"], answer: "Parables and sermons" },
    { q: "The triumphal entry into Jerusalem fulfilled prophecy from:", type: "multiple_choice", options: ["Isaiah 53", "Zechariah 9:9", "Micah 5:2", "Daniel 7:13"], answer: "Zechariah 9:9" },
    { q: "Describe the significance of Jesus' temptation in the wilderness for His ministry.", type: "short_answer", options: null, answer: "Jesus' temptation demonstrated His sinlessness and qualification as the perfect sacrifice, showing He could sympathize with human weakness while remaining without sin." }
  ],
  "The Pre-existence and Deity of Christ": [
    { q: "What does John 1:1 affirm about the Word (Logos)?", type: "multiple_choice", options: ["The Word was created", "The Word was with God and was God", "The Word became God", "The Word was an angel"], answer: "The Word was with God and was God" },
    { q: "In John 8:58, Jesus used which divine self-designation?", type: "multiple_choice", options: ["Son of Man", "I AM", "Lord", "Messiah"], answer: "I AM" },
    { q: "The Greek term 'ego eimi' echoes which Old Testament passage?", type: "multiple_choice", options: ["Genesis 1:1", "Exodus 3:14", "Isaiah 7:14", "Psalm 110:1"], answer: "Exodus 3:14" },
    { q: "According to Colossians 1:16, all things were created:", type: "multiple_choice", options: ["Before Christ", "By Christ", "Without Christ", "Against Christ"], answer: "By Christ" },
    { q: "The 'Angel of the LORD' in the Old Testament is often identified as:", type: "multiple_choice", options: ["Gabriel", "Michael", "The pre-incarnate Christ", "A created angel"], answer: "The pre-incarnate Christ" },
    { q: "Which divine attribute does Hebrews 13:8 ascribe to Christ?", type: "multiple_choice", options: ["Omnipresence", "Omniscience", "Immutability/Eternality", "Omnipotence"], answer: "Immutability/Eternality" },
    { q: "Thomas confessed Jesus as 'My Lord and my God' in which Gospel?", type: "multiple_choice", options: ["Matthew", "Mark", "Luke", "John"], answer: "John" },
    { q: "The Greek word 'kyrios' in the Septuagint translates which Hebrew name?", type: "multiple_choice", options: ["Elohim", "Adonai", "YHWH", "El Shaddai"], answer: "YHWH" },
    { q: "Proverbs 8:22-31 personifies Wisdom as present at:", type: "multiple_choice", options: ["The exodus", "Creation", "The flood", "The giving of the Law"], answer: "Creation" },
    { q: "Christ's deity is essential for salvation because:", type: "multiple_choice", options: ["Only God can forgive sins", "Humans cannot be saved", "Angels refused to help", "The Father required it"], answer: "Only God can forgive sins" },
    { q: "Explain the significance of Jesus' 'I AM' statements in John's Gospel for understanding His deity.", type: "short_answer", options: null, answer: "The 'I AM' statements identify Jesus with the covenant God of Israel (YHWH), claiming divine identity and eternal existence, which is why the Jewish leaders sought to stone Him for blasphemy." }
  ],
  "The Hypostatic Union - Two Natures in One Person": [
    { q: "The term 'hypostatic' comes from the Greek word meaning:", type: "multiple_choice", options: ["Nature", "Person/Substance", "Union", "Divine"], answer: "Person/Substance" },
    { q: "The Council of Chalcedon was held in which year?", type: "multiple_choice", options: ["AD 325", "AD 381", "AD 431", "AD 451"], answer: "AD 451" },
    { q: "According to Chalcedon, Christ's two natures are united:", type: "multiple_choice", options: ["Confusedly", "Separately", "Inconfusedly, unchangeably, indivisibly, inseparably", "Temporarily"], answer: "Inconfusedly, unchangeably, indivisibly, inseparably" },
    { q: "Which heresy taught that Christ was a created being?", type: "multiple_choice", options: ["Docetism", "Arianism", "Nestorianism", "Eutychianism"], answer: "Arianism" },
    { q: "Apollinarianism taught that Christ lacked a human:", type: "multiple_choice", options: ["Body", "Soul/Mind", "Will", "Emotions"], answer: "Soul/Mind" },
    { q: "Nestorianism erred by:", type: "multiple_choice", options: ["Denying Christ's deity", "Denying Christ's humanity", "Dividing Christ into two persons", "Mixing the two natures"], answer: "Dividing Christ into two persons" },
    { q: "Eutychianism/Monophysitism taught that Christ had:", type: "multiple_choice", options: ["Two natures", "One mixed nature", "No nature", "Three natures"], answer: "One mixed nature" },
    { q: "Colossians 2:9 states that in Christ dwells all the fullness of the Godhead:", type: "multiple_choice", options: ["Spiritually", "Symbolically", "Bodily", "Partially"], answer: "Bodily" },
    { q: "Evidence of Christ's true humanity includes:", type: "multiple_choice", options: ["He never slept", "He experienced hunger, thirst, and weariness", "He could not die", "He had no emotions"], answer: "He experienced hunger, thirst, and weariness" },
    { q: "The hypostatic union is essential for Christ's role as:", type: "multiple_choice", options: ["Creator only", "Judge only", "Mediator between God and humanity", "Prophet only"], answer: "Mediator between God and humanity" },
    { q: "Explain why both natures (divine and human) are necessary for Christ to be an effective Mediator.", type: "short_answer", options: null, answer: "Christ's divine nature gives infinite value to His sacrifice and enables Him to represent God, while His human nature allows Him to truly represent humanity and die as our substitute." }
  ],
  "The Virgin Birth and Its Theological Significance": [
    { q: "The virgin birth is more precisely described as the:", type: "multiple_choice", options: ["Immaculate conception", "Virginal conception", "Divine adoption", "Spiritual birth"], answer: "Virginal conception" },
    { q: "Which Gospel provides the account from Joseph's perspective?", type: "multiple_choice", options: ["Matthew", "Mark", "Luke", "John"], answer: "Matthew" },
    { q: "The Hebrew word 'almah' in Isaiah 7:14 primarily means:", type: "multiple_choice", options: ["Married woman", "Young woman of marriageable age", "Elderly woman", "Widow"], answer: "Young woman of marriageable age" },
    { q: "The Septuagint translated 'almah' with which Greek word?", type: "multiple_choice", options: ["Gyne", "Parthenos", "Neanis", "Mater"], answer: "Parthenos" },
    { q: "According to Luke 1:35, the conception was accomplished by:", type: "multiple_choice", options: ["Joseph", "An angel", "The Holy Spirit", "Natural means"], answer: "The Holy Spirit" },
    { q: "The virgin birth relates to Christ's sinlessness by:", type: "multiple_choice", options: ["Making Him less human", "Setting Him apart from ordinary human generation", "Giving Him special powers", "Removing His human nature"], answer: "Setting Him apart from ordinary human generation" },
    { q: "Mary's question 'How can this be?' confirms her:", type: "multiple_choice", options: ["Doubt in God", "Virginal state", "Married status", "Unbelief"], answer: "Virginal state" },
    { q: "The virgin birth fulfilled Isaiah's prophecy as a:", type: "multiple_choice", options: ["Curse", "Sign", "Judgment", "Warning"], answer: "Sign" },
    { q: "Claims of pagan parallels to the virgin birth are refuted because:", type: "multiple_choice", options: ["Pagan myths involve gods having physical relations with women", "The Gospels are mythological", "Jews borrowed from pagans", "The stories are identical"], answer: "Pagan myths involve gods having physical relations with women" },
    { q: "The virgin birth demonstrates Christ's:", type: "multiple_choice", options: ["Ordinary humanity", "Uniqueness as the God-man", "Weakness", "Dependence on Mary"], answer: "Uniqueness as the God-man" },
    { q: "Explain the connection between the virgin birth and Christ's role as the 'last Adam' (1 Corinthians 15:45).", type: "short_answer", options: null, answer: "As the last Adam, Christ begins a new humanity. The virgin birth sets Him apart from the ordinary transmission of sin through Adam's line, enabling Him to be sinless and to represent a new humanity." }
  ],
  "The Offices of Christ - Prophet, Priest, and King": [
    { q: "The Latin term for Christ's threefold office is:", type: "multiple_choice", options: ["Munus triplex", "Sola fide", "Imago Dei", "Communicatio idiomatum"], answer: "Munus triplex" },
    { q: "The title 'Christ' (Christos) means:", type: "multiple_choice", options: ["Savior", "Lord", "Anointed One", "Teacher"], answer: "Anointed One" },
    { q: "Moses prophesied of a coming Prophet in:", type: "multiple_choice", options: ["Genesis 3:15", "Deuteronomy 18:15", "Isaiah 53:1", "Psalm 110:1"], answer: "Deuteronomy 18:15" },
    { q: "The Greek word 'exegesato' in John 1:18 means Christ:", type: "multiple_choice", options: ["Created the Father", "Explained/revealed the Father", "Replaced the Father", "Served the Father"], answer: "Explained/revealed the Father" },
    { q: "Christ's priesthood is according to the order of:", type: "multiple_choice", options: ["Aaron", "Levi", "Melchizedek", "Moses"], answer: "Melchizedek" },
    { q: "According to Hebrews 7:25, Christ's priestly intercession is:", type: "multiple_choice", options: ["Temporary", "Occasional", "Continual", "Completed"], answer: "Continual" },
    { q: "Christ as Priest is unique because He is both:", type: "multiple_choice", options: ["Prophet and King", "Priest and sacrifice", "Teacher and healer", "Judge and advocate"], answer: "Priest and sacrifice" },
    { q: "The Davidic covenant promised an eternal:", type: "multiple_choice", options: ["Temple", "Priesthood", "Throne", "Sacrifice"], answer: "Throne" },
    { q: "Revelation 19:16 identifies Christ as:", type: "multiple_choice", options: ["Prophet of prophets", "Priest of priests", "King of kings and Lord of lords", "Angel of angels"], answer: "King of kings and Lord of lords" },
    { q: "As Prophet, Christ continues to teach through:", type: "multiple_choice", options: ["New revelations only", "His Word and Spirit", "Human prophets only", "Dreams only"], answer: "His Word and Spirit" },
    { q: "Explain how Christ's three offices work together in accomplishing salvation.", type: "short_answer", options: null, answer: "As Prophet, Christ reveals God's saving purposes; as Priest, He accomplishes salvation through His sacrifice and intercession; as King, He applies and consummates salvation through His sovereign rule." }
  ],
  "The Atonement - Theories and Biblical Teaching": [
    { q: "The English word 'atonement' can be understood as:", type: "multiple_choice", options: ["Punishment", "At-one-ment (reconciliation)", "Judgment", "Separation"], answer: "At-one-ment (reconciliation)" },
    { q: "The Greek word 'apolytrosis' refers to:", type: "multiple_choice", options: ["Propitiation", "Redemption", "Reconciliation", "Justification"], answer: "Redemption" },
    { q: "Propitiation specifically refers to:", type: "multiple_choice", options: ["Paying a ransom", "Satisfying God's wrath", "Restoring relationship", "Legal declaration"], answer: "Satisfying God's wrath" },
    { q: "The 'hilasterion' in the Old Testament was the:", type: "multiple_choice", options: ["Altar", "Mercy seat", "Temple veil", "Bronze serpent"], answer: "Mercy seat" },
    { q: "The Ransom Theory incorrectly taught that the ransom was paid to:", type: "multiple_choice", options: ["God", "Satan", "Humanity", "Angels"], answer: "Satan" },
    { q: "Anselm's Satisfaction Theory focused on God's:", type: "multiple_choice", options: ["Love", "Honor", "Wrath", "Mercy"], answer: "Honor" },
    { q: "The Moral Influence Theory was developed by:", type: "multiple_choice", options: ["Anselm", "Abelard", "Calvin", "Luther"], answer: "Abelard" },
    { q: "Penal Substitutionary Atonement teaches that Christ bore:", type: "multiple_choice", options: ["Our example", "Our influence", "Our penalty", "Our honor"], answer: "Our penalty" },
    { q: "2 Corinthians 5:21 states that Christ was made:", type: "multiple_choice", options: ["An example for us", "Sin for us", "A teacher for us", "A prophet for us"], answer: "Sin for us" },
    { q: "Isaiah 53:5 declares that Christ was wounded for our:", type: "multiple_choice", options: ["Education", "Example", "Transgressions", "Improvement"], answer: "Transgressions" },
    { q: "Explain why penal substitutionary atonement is essential for understanding the cross.", type: "short_answer", options: null, answer: "Penal substitution explains how God can be both just and the justifier of sinners—Christ bore the penalty we deserved, satisfying divine justice while providing mercy to those who believe." }
  ],
  "The Resurrection - Historical Evidence and Theological Meaning": [
    { q: "According to 1 Corinthians 15:17, if Christ is not risen, our faith is:", type: "multiple_choice", options: ["Strong", "Futile", "Growing", "Sufficient"], answer: "Futile" },
    { q: "The empty tomb is significant because:", type: "multiple_choice", options: ["It was a secret location", "The Jewish authorities could not deny it", "No one knew where it was", "It was in Galilee"], answer: "The Jewish authorities could not deny it" },
    { q: "Women being the first witnesses is significant because:", type: "multiple_choice", options: ["Women were highly respected", "Their testimony was not valued, making fabrication unlikely", "They were disciples", "They were wealthy"], answer: "Their testimony was not valued, making fabrication unlikely" },
    { q: "According to 1 Corinthians 15:6, how many saw the risen Christ at once?", type: "multiple_choice", options: ["Twelve", "Seventy", "More than five hundred", "One thousand"], answer: "More than five hundred" },
    { q: "The transformation of the disciples from fearful to bold is evidence of:", type: "multiple_choice", options: ["Good training", "The reality of the resurrection", "Political motivation", "Financial gain"], answer: "The reality of the resurrection" },
    { q: "James, the brother of Jesus, was converted after:", type: "multiple_choice", options: ["Jesus' baptism", "The Sermon on the Mount", "Seeing the risen Lord", "Pentecost"], answer: "Seeing the risen Lord" },
    { q: "Christ's resurrection body was:", type: "multiple_choice", options: ["Purely spiritual", "Physical yet glorified", "The same as before", "A ghost"], answer: "Physical yet glorified" },
    { q: "Romans 1:4 says Christ was declared Son of God with power by:", type: "multiple_choice", options: ["His miracles", "His teaching", "The resurrection from the dead", "His baptism"], answer: "The resurrection from the dead" },
    { q: "1 Corinthians 15:20 calls Christ the 'firstfruits' of:", type: "multiple_choice", options: ["Creation", "Those who have fallen asleep", "The apostles", "The prophets"], answer: "Those who have fallen asleep" },
    { q: "The resurrection guarantees believers':", type: "multiple_choice", options: ["Wealth", "Health", "Future resurrection", "Political power"], answer: "Future resurrection" },
    { q: "Explain how the resurrection validates Christ's atoning work on the cross.", type: "short_answer", options: null, answer: "The resurrection demonstrates that the Father accepted Christ's sacrifice, proving that the penalty for sin was fully paid. It is God's 'Amen' to the cross, confirming that believers are justified." }
  ],
  "The Ascension and Session of Christ": [
    { q: "The ascension occurred how many days after the resurrection?", type: "multiple_choice", options: ["Three days", "Seven days", "Forty days", "Fifty days"], answer: "Forty days" },
    { q: "According to Acts 1:9, Christ was received by:", type: "multiple_choice", options: ["Angels", "A cloud", "Fire", "Lightning"], answer: "A cloud" },
    { q: "The 'right hand of God' signifies:", type: "multiple_choice", options: ["A physical location", "Honor and authority", "Weakness", "Distance from God"], answer: "Honor and authority" },
    { q: "Christ 'sat down' at God's right hand because:", type: "multiple_choice", options: ["He was tired", "His sacrifice was complete", "He needed rest", "The Father commanded it"], answer: "His sacrifice was complete" },
    { q: "Psalm 110:4 prophesied Christ as a priest forever after the order of:", type: "multiple_choice", options: ["Aaron", "Levi", "Melchizedek", "Zadok"], answer: "Melchizedek" },
    { q: "According to Hebrews 7:25, Christ's present ministry includes:", type: "multiple_choice", options: ["Creating new worlds", "Making intercession for believers", "Writing new Scripture", "Judging the nations"], answer: "Making intercession for believers" },
    { q: "1 John 2:1 calls Christ our:", type: "multiple_choice", options: ["Judge", "Advocate (Parakletos)", "Accuser", "Prosecutor"], answer: "Advocate (Parakletos)" },
    { q: "The ascension was necessary for:", type: "multiple_choice", options: ["Christ to become God", "The sending of the Holy Spirit", "Christ to learn obedience", "The disciples to forget Him"], answer: "The sending of the Holy Spirit" },
    { q: "Ephesians 1:22 states that Christ is head over all things for:", type: "multiple_choice", options: ["The angels", "The nations", "The church", "Israel only"], answer: "The church" },
    { q: "The angels promised that Christ will return:", type: "multiple_choice", options: ["Secretly", "In the same manner as He ascended", "As a spirit", "Through another person"], answer: "In the same manner as He ascended" },
    { q: "Explain the significance of Christ's ongoing intercession for believers.", type: "short_answer", options: null, answer: "Christ's intercession means He continually represents believers before the Father, ensuring their acceptance, pleading their case when they sin, and guaranteeing that nothing can separate them from God's love." }
  ],
  "The Second Coming and Eschatological Christology": [
    { q: "The Greek term 'parousia' emphasizes Christ's:", type: "multiple_choice", options: ["Judgment", "Arrival and presence", "Wrath", "Delay"], answer: "Arrival and presence" },
    { q: "According to Revelation 1:7, at Christ's return:", type: "multiple_choice", options: ["Only believers will see Him", "Every eye will see Him", "He will be invisible", "Only Israel will see Him"], answer: "Every eye will see Him" },
    { q: "1 Thessalonians 5:2 compares the day of the Lord to:", type: "multiple_choice", options: ["A wedding", "A thief in the night", "A harvest", "A battle"], answer: "A thief in the night" },
    { q: "The second coming will be:", type: "multiple_choice", options: ["Secret and spiritual", "Personal, visible, and glorious", "Symbolic only", "Already fulfilled"], answer: "Personal, visible, and glorious" },
    { q: "According to John 5:28-29, Christ's return triggers:", type: "multiple_choice", options: ["The millennium only", "The general resurrection", "A new creation only", "The rapture only"], answer: "The general resurrection" },
    { q: "2 Thessalonians 2:8 says Christ will destroy the lawless one with:", type: "multiple_choice", options: ["A sword", "The brightness of His coming", "An army", "Fire from heaven"], answer: "The brightness of His coming" },
    { q: "Titus 2:13 calls Christ's appearing our:", type: "multiple_choice", options: ["Dread", "Blessed hope", "Judgment", "Fear"], answer: "Blessed hope" },
    { q: "According to 1 John 3:3, the hope of Christ's return motivates:", type: "multiple_choice", options: ["Fear", "Despair", "Purification/Holiness", "Laziness"], answer: "Purification/Holiness" },
    { q: "Revelation 21:3 describes the eternal state as God:", type: "multiple_choice", options: ["Judging humanity", "Dwelling with His people", "Destroying the earth", "Creating new angels"], answer: "Dwelling with His people" },
    { q: "The final words of Revelation 22:20 are:", type: "multiple_choice", options: ["Amen", "Even so, come, Lord Jesus", "The grace of our Lord", "Hallelujah"], answer: "Even so, come, Lord Jesus" },
    { q: "Explain how the certainty of Christ's return should affect Christian living today.", type: "short_answer", options: null, answer: "The certainty of Christ's return motivates watchfulness, holy living, faithful service, evangelistic urgency, and comfort in suffering, knowing that our labor is not in vain and that Christ will make all things right." }
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
