import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const courseId = 570005; // DIV112 Christology

// 8 new lessons to add (already have 2: Incarnation, Life and Ministry)
const lessons = [
  {
    title: "The Pre-existence and Deity of Christ",
    content: `# The Pre-existence and Deity of Christ

## I. Introduction

The doctrine of Christ's pre-existence and deity stands as one of the most foundational affirmations of Christian theology. This lesson explores the biblical witness to Christ's eternal existence before His incarnation and His full divine nature as the second Person of the Trinity. Understanding these truths is essential for a proper Christology and for the worship and devotion that Christ rightfully deserves.

The pre-existence of Christ refers to His existence before the creation of the world and before His incarnation in human flesh. This is not merely a temporal priority but an eternal existence as the Logos (λόγος), the divine Word who was "with God" and "was God" from the beginning (John 1:1). The deity of Christ affirms that Jesus Christ is fully God, possessing all the divine attributes and worthy of the worship due to God alone.

**Learning Objectives:**
- Understand the biblical basis for Christ's pre-existence
- Examine key Scripture passages affirming Christ's deity
- Analyze the relationship between the pre-incarnate Christ and the Trinity
- Apply these doctrines to Christian worship and discipleship

## II. Biblical Foundation for Pre-existence

### A. Old Testament Anticipations

The Old Testament contains numerous theophanies and Christophanies—appearances of God and pre-incarnate appearances of Christ. The "Angel of the LORD" (מַלְאַךְ יְהוָה, mal'ak YHWH) in passages such as Genesis 16:7-13, Genesis 22:11-18, and Exodus 3:2-6 is often identified as the pre-incarnate Christ. This figure speaks as God, is identified as God, and receives worship.

The Wisdom literature also points to Christ's pre-existence. Proverbs 8:22-31 personifies Wisdom as present at creation: "The LORD possessed me at the beginning of His way, before His works of old. I was set up from everlasting, from the beginning, before there was ever an earth" (Proverbs 8:22-23, NKJV).

### B. New Testament Affirmations

The New Testament explicitly affirms Christ's pre-existence in multiple passages:

**John 1:1-3**: "In the beginning was the Word (ἐν ἀρχῇ ἦν ὁ λόγος), and the Word was with God (πρὸς τὸν θεόν), and the Word was God (θεὸς ἦν ὁ λόγος). He was in the beginning with God. All things were made through Him, and without Him nothing was made that was made."

**John 8:58**: Jesus declared, "Before Abraham was, I AM (πρὶν Ἀβραὰμ γενέσθαι ἐγὼ εἰμί)." The use of ἐγὼ εἰμί (ego eimi) echoes the divine name revealed to Moses in Exodus 3:14.

**Colossians 1:15-17**: Christ is "the image of the invisible God, the firstborn over all creation. For by Him all things were created... He is before all things, and in Him all things consist."

**Philippians 2:6-7**: Christ, "being in the form of God (ἐν μορφῇ θεοῦ), did not consider it robbery to be equal with God, but made Himself of no reputation, taking the form of a bondservant."

## III. The Deity of Christ

### A. Divine Titles Applied to Christ

Scripture applies to Christ titles that belong exclusively to God:

- **Lord (κύριος, kyrios)**: The Septuagint uses κύριος to translate the divine name YHWH. Paul declares "Jesus is Lord" (Romans 10:9) and applies Old Testament YHWH texts to Christ.

- **God (θεός, theos)**: Thomas confessed, "My Lord and my God!" (John 20:28). Titus 2:13 refers to "our great God and Savior Jesus Christ."

- **I AM (ἐγὼ εἰμί)**: Jesus used this divine self-designation seven times in John's Gospel, identifying Himself with the covenant God of Israel.

### B. Divine Attributes of Christ

Christ possesses the incommunicable attributes of God:

- **Eternality**: "Jesus Christ is the same yesterday, today, and forever" (Hebrews 13:8).
- **Omnipresence**: "Where two or three are gathered together in My name, I am there in the midst of them" (Matthew 18:20).
- **Omniscience**: "Lord, You know all things" (John 21:17).
- **Omnipotence**: "All authority has been given to Me in heaven and on earth" (Matthew 28:18).

### C. Divine Works of Christ

Christ performs works that only God can do:

- **Creation**: "All things were made through Him" (John 1:3).
- **Sustaining the universe**: "Upholding all things by the word of His power" (Hebrews 1:3).
- **Forgiving sins**: "Son, your sins are forgiven you" (Mark 2:5).
- **Giving eternal life**: "I give them eternal life, and they shall never perish" (John 10:28).

## IV. Theological Significance

The pre-existence and deity of Christ are not abstract doctrines but have profound implications:

1. **Salvation**: Only a divine Savior can accomplish eternal redemption. If Christ were merely human, His death could not atone for the sins of the world.

2. **Revelation**: Christ as the eternal Logos is the perfect revelation of the Father: "He who has seen Me has seen the Father" (John 14:9).

3. **Worship**: Christ is worthy of the worship due to God alone. The early church worshiped Christ as God (Revelation 5:13-14).

4. **Mediation**: Christ's deity and humanity qualify Him to be the one Mediator between God and humanity (1 Timothy 2:5).

## V. Key Points Summary

- Christ existed eternally before His incarnation as the divine Logos
- The Old Testament contains anticipations of Christ in theophanies and wisdom literature
- The New Testament explicitly affirms Christ's pre-existence and deity
- Divine titles, attributes, and works are ascribed to Christ
- These doctrines are essential for understanding salvation, revelation, and worship

## VI. Scripture Memory

> "In the beginning was the Word, and the Word was with God, and the Word was God. He was in the beginning with God. All things were made through Him, and without Him nothing was made that was made." — John 1:1-3 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Hypostatic Union - Two Natures in One Person",
    content: `# The Hypostatic Union - Two Natures in One Person

## I. Introduction

The doctrine of the hypostatic union is the theological formulation that explains how Jesus Christ is both fully God and fully man in one Person. The term "hypostatic" comes from the Greek word ὑπόστασις (hypostasis), meaning "substance" or "person." This doctrine affirms that in the incarnation, the divine and human natures are united in the one Person of Christ without confusion, change, division, or separation.

This doctrine was formally articulated at the Council of Chalcedon in AD 451, though its biblical foundations were recognized from the earliest days of the church. Understanding the hypostatic union is essential for a proper Christology and guards against various heresies that have threatened the church throughout history.

**Learning Objectives:**
- Define the hypostatic union and its key terminology
- Examine the biblical basis for Christ's two natures
- Understand the Chalcedonian Definition and its significance
- Identify and refute historical heresies concerning Christ's natures

## II. Biblical Foundation

### A. Evidence of Christ's Divine Nature

As established in the previous lesson, Scripture clearly affirms Christ's full deity. The Gospel of John opens with the declaration that the Word (λόγος) was God (θεὸς ἦν ὁ λόγος) and that this Word became flesh (John 1:1, 14). Paul writes that in Christ "dwells all the fullness of the Godhead bodily" (Colossians 2:9).

### B. Evidence of Christ's Human Nature

Scripture equally affirms Christ's true and complete humanity:

**Birth and Growth**: Jesus was born of a woman (Galatians 4:4), grew in wisdom and stature (Luke 2:52), and experienced normal human development.

**Physical Limitations**: Jesus experienced hunger (Matthew 4:2), thirst (John 19:28), weariness (John 4:6), and sleep (Mark 4:38).

**Human Emotions**: Jesus wept (John 11:35), experienced sorrow (Matthew 26:38), and showed compassion (Matthew 9:36).

**Death**: Jesus truly died on the cross (John 19:30-34), demonstrating His genuine human nature.

The author of Hebrews emphasizes that Christ "had to be made like His brethren in all things" (Hebrews 2:17, NASB) and was "tempted in all things as we are, yet without sin" (Hebrews 4:15).

### C. The Unity of Person

While possessing two distinct natures, Christ is one Person. The Scriptures never speak of Christ as two persons or as having a divided consciousness. The personal pronoun "I" is used by Christ whether speaking of divine prerogatives or human experiences.

## III. The Chalcedonian Definition

The Council of Chalcedon (AD 451) produced the definitive statement on Christ's two natures:

> "We confess one and the same Son, our Lord Jesus Christ, the same perfect in Godhead and also perfect in manhood; truly God and truly man, of a reasonable soul and body; consubstantial with the Father according to the Godhead, and consubstantial with us according to the Manhood; in all things like unto us, without sin; begotten before all ages of the Father according to the Godhead, and in these latter days, for us and for our salvation, born of the Virgin Mary, the Mother of God, according to the Manhood; one and the same Christ, Son, Lord, Only-begotten, to be acknowledged in two natures, inconfusedly, unchangeably, indivisibly, inseparably; the distinction of natures being by no means taken away by the union, but rather the property of each nature being preserved, and concurring in one Person and one Subsistence, not parted or divided into two persons, but one and the same Son, and only begotten, God the Word, the Lord Jesus Christ."

The four key adverbs—**inconfusedly** (ἀσυγχύτως), **unchangeably** (ἀτρέπτως), **indivisibly** (ἀδιαιρέτως), **inseparably** (ἀχωρίστως)—guard against the major Christological heresies.

## IV. Historical Heresies and Orthodox Responses

### A. Heresies Denying Christ's Deity

**Arianism**: Taught that Christ was a created being, the first and greatest of God's creatures, but not eternal God. Condemned at Nicaea (AD 325).

**Adoptionism**: Claimed Jesus was a mere man who was "adopted" as God's Son at His baptism or resurrection.

### B. Heresies Denying Christ's Humanity

**Docetism**: From the Greek δοκέω (dokeo, "to seem"), taught that Christ only appeared to have a human body but was purely spiritual.

**Apollinarianism**: Taught that Christ had a human body but His human mind/spirit was replaced by the divine Logos.

### C. Heresies Confusing the Natures

**Eutychianism/Monophysitism**: Taught that Christ's two natures were fused into one new nature, neither fully divine nor fully human.

### D. Heresies Dividing the Person

**Nestorianism**: Taught that Christ was two persons—one divine and one human—loosely connected.

## V. Theological Implications

The hypostatic union has profound implications for Christian faith and practice:

1. **Atonement**: Christ's divine nature gives infinite value to His sacrifice; His human nature allows Him to die as our substitute.

2. **Mediation**: As the God-man, Christ perfectly bridges the gap between God and humanity (1 Timothy 2:5).

3. **Revelation**: In Christ's humanity, we see how God intended humans to live; in His deity, we see God Himself.

4. **Sanctification**: Christ's perfect human life provides both the model and the power for our transformation.

## VI. Key Points Summary

- The hypostatic union affirms two complete natures in one Person
- Scripture attests to both Christ's full deity and complete humanity
- The Chalcedonian Definition guards against Christological heresies
- The four adverbs protect the integrity of both natures and the unity of Person
- This doctrine is essential for understanding salvation and mediation

## VII. Scripture Memory

> "For in Him dwells all the fullness of the Godhead bodily." — Colossians 2:9 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Virgin Birth and Its Theological Significance",
    content: `# The Virgin Birth and Its Theological Significance

## I. Introduction

The virgin birth of Jesus Christ—more precisely, the virginal conception—is a foundational doctrine of Christian faith. It affirms that Jesus was conceived in the womb of the Virgin Mary by the power of the Holy Spirit, without a human father. This miraculous event is not merely a biological wonder but carries profound theological significance for understanding Christ's Person and work.

The virgin birth is attested in the Apostles' Creed ("born of the Virgin Mary") and has been affirmed by the church throughout history as essential to orthodox Christology. This lesson examines the biblical evidence for the virgin birth and explores its theological implications.

**Learning Objectives:**
- Examine the biblical accounts of the virgin birth
- Understand the Old Testament prophecy of Isaiah 7:14
- Analyze the theological significance of the virgin birth
- Respond to critical objections to this doctrine

## II. Biblical Evidence

### A. The Gospel of Matthew

Matthew 1:18-25 provides the account from Joseph's perspective:

> "Now the birth of Jesus Christ was as follows: After His mother Mary was betrothed to Joseph, before they came together, she was found with child of the Holy Spirit (ἐκ πνεύματος ἁγίου)." (Matthew 1:18)

Matthew explicitly states that Mary was a virgin (παρθένος, parthenos) and that Joseph "did not know her till she had brought forth her firstborn Son" (Matthew 1:25). The phrase "did not know her" (οὐκ ἐγίνωσκεν αὐτήν) uses the Hebrew idiom for sexual relations.

Matthew also cites the fulfillment of Isaiah's prophecy: "Behold, the virgin shall be with child, and bear a Son, and they shall call His name Immanuel" (Matthew 1:23, quoting Isaiah 7:14).

### B. The Gospel of Luke

Luke 1:26-38 provides the account from Mary's perspective:

> "Then Mary said to the angel, 'How can this be, since I do not know a man?' And the angel answered and said to her, 'The Holy Spirit will come upon you, and the power of the Highest will overshadow you; therefore, also, that Holy One who is to be born will be called the Son of God.'" (Luke 1:34-35)

Mary's question, "How can this be, since I do not know a man?" (ἄνδρα οὐ γινώσκω), confirms her virginal state. The angel's response attributes the conception to the Holy Spirit's supernatural work.

### C. Isaiah 7:14 - The Prophecy

The Hebrew text of Isaiah 7:14 uses the word עַלְמָה (almah): "Therefore the Lord Himself will give you a sign: Behold, the virgin (עַלְמָה) shall conceive and bear a Son, and shall call His name Immanuel."

While almah primarily means "young woman of marriageable age," the Septuagint translators (c. 250 BC) rendered it with παρθένος (parthenos), which specifically means "virgin." This translation, made before the birth of Christ, reflects the Jewish understanding that the sign would involve a miraculous virgin birth.

## III. Theological Significance

### A. The Sinlessness of Christ

The virgin birth is intimately connected to Christ's sinlessness. While the precise mechanism is not fully explained in Scripture, the virgin birth sets Christ apart from the ordinary transmission of the sin nature through human generation.

Romans 5:12 teaches that sin entered the world through Adam and passed to all his descendants. Christ, conceived by the Holy Spirit without a human father, is the "last Adam" (1 Corinthians 15:45) who begins a new humanity.

### B. The Union of Divine and Human Natures

The virgin birth is the means by which the eternal Son of God took on human nature. The Holy Spirit's overshadowing of Mary (Luke 1:35) effected the union of deity and humanity in one Person. Christ did not come into existence at His conception—He eternally existed as the Logos—but He assumed human nature through the virgin birth.

### C. The Fulfillment of Prophecy

The virgin birth demonstrates God's faithfulness to His prophetic word. Isaiah 7:14 was given as a "sign" (אוֹת, ot)—something extraordinary that would authenticate God's message. A natural birth would not constitute such a sign.

### D. The Uniqueness of Christ

The virgin birth underscores Christ's uniqueness as the God-man. He is not merely another prophet or religious teacher but the incarnate Son of God. His entrance into the world was as unique as His Person.

## IV. Responding to Objections

### A. The Silence of Other New Testament Authors

Critics note that Paul, John, and other writers do not explicitly mention the virgin birth. However:

- Argument from silence is logically weak
- Paul refers to Christ being "born of a woman" (Galatians 4:4), an unusual phrase if Joseph were the father
- John's prologue (John 1:1-14) emphasizes the Logos becoming flesh, consistent with supernatural conception
- The early church universally affirmed the virgin birth

### B. Alleged Pagan Parallels

Some claim the virgin birth was borrowed from pagan myths. However:

- Pagan myths typically involve gods having physical relations with women—the opposite of the biblical account
- The Gospel accounts are sober historical narratives, not mythological
- Jewish monotheism would have rejected any pagan borrowing

### C. The Almah/Parthenos Question

The claim that almah does not mean "virgin" ignores:

- The Septuagint's pre-Christian translation using parthenos
- The context requiring a miraculous "sign"
- The consistent use of almah for unmarried young women of good reputation

## V. Key Points Summary

- The virgin birth is attested by Matthew and Luke with complementary accounts
- Isaiah 7:14 prophesied a virgin conception as a divine sign
- The virgin birth relates to Christ's sinlessness and unique Person
- It demonstrates the union of divine and human natures
- Critical objections can be adequately answered

## VI. Scripture Memory

> "The Holy Spirit will come upon you, and the power of the Highest will overshadow you; therefore, also, that Holy One who is to be born will be called the Son of God." — Luke 1:35 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Offices of Christ - Prophet, Priest, and King",
    content: `# The Offices of Christ - Prophet, Priest, and King

## I. Introduction

The threefold office of Christ—Prophet, Priest, and King (munus triplex)—provides a comprehensive framework for understanding Christ's mediatorial work. This theological construct, developed by John Calvin and other Reformers, synthesizes the biblical testimony concerning Christ's person and work under three categories that correspond to the three anointed offices in Old Testament Israel.

In the Old Testament, prophets, priests, and kings were anointed with oil as a sign of their divine appointment. The title "Christ" (Χριστός, Christos) and its Hebrew equivalent "Messiah" (מָשִׁיחַ, Mashiach) both mean "Anointed One." Jesus fulfills all three offices perfectly and eternally.

**Learning Objectives:**
- Understand the biblical basis for Christ's threefold office
- Examine how Christ fulfills each office
- Appreciate the unity and comprehensiveness of Christ's mediatorial work
- Apply these truths to Christian life and ministry

## II. Christ as Prophet

### A. Old Testament Background

Prophets in Israel were God's spokesmen, receiving divine revelation and communicating it to the people. Moses prophesied of a coming Prophet: "The LORD your God will raise up for you a Prophet like me from your midst, from your brethren. Him you shall hear" (Deuteronomy 18:15).

The Hebrew word for prophet, נָבִיא (nabi), emphasizes one who speaks forth God's message. Prophets declared "Thus says the LORD" and called Israel to covenant faithfulness.

### B. Christ's Prophetic Ministry

Jesus is the ultimate Prophet who perfectly reveals God to humanity:

**The Word Made Flesh**: "No one has seen God at any time. The only begotten Son, who is in the bosom of the Father, He has declared Him" (John 1:18). The Greek ἐξηγήσατο (exegesato) means "to explain" or "to make known"—Christ exegetes the Father.

**Teaching with Authority**: "The people were astonished at His teaching, for He taught them as one having authority, and not as the scribes" (Matthew 7:28-29).

**Fulfillment of Deuteronomy 18**: Peter explicitly identifies Jesus as the Prophet Moses foretold (Acts 3:22-23).

**Continuing Prophetic Ministry**: Christ continues to speak through His Word and Spirit: "He who hears you hears Me" (Luke 10:16).

### C. Implications

As Prophet, Christ:
- Reveals God's nature, will, and purposes
- Speaks with absolute divine authority
- Continues to teach through Scripture and the Spirit
- Calls His people to faithful obedience

## III. Christ as Priest

### A. Old Testament Background

Priests in Israel mediated between God and the people, offering sacrifices for sin and interceding on behalf of the nation. The Levitical priesthood, especially the high priest, foreshadowed Christ's priestly work.

The Hebrew word for priest, כֹּהֵן (kohen), denotes one who stands before God on behalf of others. The high priest alone entered the Holy of Holies on the Day of Atonement (Yom Kippur).

### B. Christ's Priestly Ministry

The book of Hebrews extensively develops Christ's priesthood:

**A Priest Forever**: Christ is a priest "according to the order of Melchizedek" (Hebrews 5:6, quoting Psalm 110:4), a priesthood superior to the Levitical order.

**The Perfect Sacrifice**: "But this Man, after He had offered one sacrifice for sins forever, sat down at the right hand of God" (Hebrews 10:12). Christ is both the priest who offers and the sacrifice offered.

**Ongoing Intercession**: "He always lives to make intercession for them" (Hebrews 7:25). Christ's priestly work continues in heaven.

**Access to God**: "Therefore, brethren, having boldness to enter the Holiest by the blood of Jesus... let us draw near" (Hebrews 10:19, 22).

### C. Implications

As Priest, Christ:
- Offered Himself as the once-for-all sacrifice for sin
- Provides access to God for all believers
- Continually intercedes for His people
- Sympathizes with our weaknesses (Hebrews 4:15)

## IV. Christ as King

### A. Old Testament Background

Kings in Israel ruled God's people, administered justice, and led in warfare. The Davidic covenant promised an eternal throne: "Your house and your kingdom shall be established forever before you. Your throne shall be established forever" (2 Samuel 7:16).

The Hebrew word for king, מֶלֶךְ (melek), denotes sovereign authority and rule.

### B. Christ's Kingly Ministry

Jesus is the promised Davidic King:

**Born King**: The magi sought "He who has been born King of the Jews" (Matthew 2:2).

**Proclaimed King**: Jesus entered Jerusalem as King, fulfilling Zechariah 9:9 (Matthew 21:5).

**Crucified as King**: The inscription read, "JESUS OF NAZARETH, THE KING OF THE JEWS" (John 19:19).

**Exalted King**: "God also has highly exalted Him and given Him the name which is above every name" (Philippians 2:9).

**Returning King**: "On His robe and on His thigh a name written: KING OF KINGS AND LORD OF LORDS" (Revelation 19:16).

### C. Implications

As King, Christ:
- Rules over His church and all creation
- Protects and provides for His people
- Conquers all enemies, including death
- Will establish His eternal kingdom

## V. The Unity of the Threefold Office

These three offices are not separate roles but aspects of one unified mediatorial work:

- As **Prophet**, Christ reveals God's saving purposes
- As **Priest**, Christ accomplishes salvation through His sacrifice
- As **King**, Christ applies and consummates salvation in His reign

All three offices require anointing, and Christ is the supremely Anointed One who fulfills each perfectly.

## VI. Key Points Summary

- Christ fulfills the three anointed offices of Old Testament Israel
- As Prophet, He perfectly reveals God and speaks with divine authority
- As Priest, He offered Himself as sacrifice and continually intercedes
- As King, He rules over His people and will reign eternally
- These offices together describe Christ's complete mediatorial work

## VII. Scripture Memory

> "The LORD has sworn and will not relent, 'You are a priest forever according to the order of Melchizedek.'" — Psalm 110:4 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Atonement - Theories and Biblical Teaching",
    content: `# The Atonement - Theories and Biblical Teaching

## I. Introduction

The atonement—Christ's work of reconciling sinful humanity to a holy God through His death on the cross—stands at the heart of Christian theology. The English word "atonement" can be understood as "at-one-ment," describing the restoration of relationship between God and humanity. The biblical vocabulary is rich, employing terms such as redemption, propitiation, reconciliation, and justification to describe various aspects of this multifaceted work.

Throughout church history, theologians have developed various theories to explain how Christ's death accomplishes salvation. This lesson examines the major atonement theories and evaluates them in light of Scripture, with particular attention to the biblical teaching of penal substitutionary atonement.

**Learning Objectives:**
- Understand the key biblical terms related to atonement
- Examine the major historical theories of the atonement
- Evaluate these theories according to Scripture
- Affirm the centrality of penal substitutionary atonement

## II. Biblical Vocabulary of Atonement

### A. Redemption (ἀπολύτρωσις, apolytrosis)

Redemption refers to liberation through the payment of a ransom price. In the ancient world, slaves could be redeemed through purchase. Christ "gave His life a ransom (λύτρον, lytron) for many" (Mark 10:45). We have "redemption through His blood" (Ephesians 1:7).

The Hebrew גָּאַל (ga'al) describes the kinsman-redeemer who purchases back a relative's lost inheritance or freedom (cf. Ruth 4; Leviticus 25).

### B. Propitiation (ἱλασμός, hilasmos)

Propitiation refers to the satisfaction of God's wrath against sin. Christ is "the propitiation for our sins" (1 John 2:2; 4:10). Romans 3:25 declares that God set forth Christ "as a propitiation (ἱλαστήριον, hilasterion) by His blood."

The hilasterion was the "mercy seat" covering the Ark of the Covenant, where the high priest sprinkled blood on the Day of Atonement (Leviticus 16).

### C. Reconciliation (καταλλαγή, katallage)

Reconciliation describes the restoration of relationship between estranged parties. "God was in Christ reconciling the world to Himself" (2 Corinthians 5:19). We were "enemies" but have been "reconciled to God through the death of His Son" (Romans 5:10).

### D. Justification (δικαίωσις, dikaiosis)

Justification is the legal declaration that a sinner is righteous before God. We are "justified freely by His grace through the redemption that is in Christ Jesus" (Romans 3:24). This is a forensic term from the law court.

## III. Historical Theories of the Atonement

### A. Ransom Theory (Early Church)

**Proponents**: Origen, Gregory of Nyssa

**Summary**: Christ's death was a ransom paid to Satan to release humanity from bondage.

**Evaluation**: While Scripture uses ransom language, it never identifies Satan as the recipient. The ransom is paid to God's justice, not to the devil.

### B. Satisfaction Theory (Anselm, 11th century)

**Summary**: Sin dishonors God and disrupts the moral order. Christ's death provides satisfaction to God's honor.

**Evaluation**: Anselm correctly emphasized that atonement addresses God's nature, but he focused on honor rather than justice and wrath.

### C. Moral Influence Theory (Abelard, 12th century)

**Summary**: Christ's death demonstrates God's love, inspiring humans to repent and live righteously.

**Evaluation**: While Christ's death does reveal God's love (Romans 5:8), this theory fails to explain how the cross actually removes sin and guilt.

### D. Governmental Theory (Grotius, 17th century)

**Summary**: Christ's death demonstrates God's displeasure with sin, maintaining moral government without requiring actual punishment of sin.

**Evaluation**: This theory weakens the necessity of Christ's death and the reality of divine justice.

### E. Christus Victor (Gustaf Aulén, 20th century revival)

**Summary**: Christ's death is a victory over the powers of evil—sin, death, and the devil.

**Evaluation**: Scripture does teach Christ's victory (Colossians 2:15), but this is a result of the atonement, not its primary mechanism.

### F. Penal Substitutionary Atonement (Reformation)

**Proponents**: Luther, Calvin, the Reformers

**Summary**: Christ bore the penalty for sin that sinners deserved, satisfying God's justice and propitiating His wrath.

**Biblical Support**:
- Isaiah 53:5-6: "He was wounded for our transgressions... the LORD has laid on Him the iniquity of us all."
- Romans 3:25-26: God set forth Christ as a propitiation "to demonstrate His righteousness."
- 2 Corinthians 5:21: "He made Him who knew no sin to be sin for us."
- Galatians 3:13: "Christ has redeemed us from the curse of the law, having become a curse for us."
- 1 Peter 2:24: "Who Himself bore our sins in His own body on the tree."

## IV. The Centrality of Penal Substitution

Penal substitutionary atonement best accounts for the full biblical testimony:

1. **It takes sin seriously**: Sin is not merely a mistake but an offense against God's holiness requiring just punishment.

2. **It upholds God's justice**: God does not simply overlook sin but punishes it fully in Christ.

3. **It explains the necessity of Christ's death**: If moral influence or example were sufficient, the cross would be unnecessary.

4. **It provides assurance**: Believers can know their sins are truly paid for, not merely covered.

5. **It grounds other aspects**: Victory over Satan, moral transformation, and reconciliation all flow from the substitutionary sacrifice.

## V. Key Points Summary

- Biblical vocabulary includes redemption, propitiation, reconciliation, and justification
- Various theories have attempted to explain the atonement
- Penal substitutionary atonement best accounts for Scripture's teaching
- Christ bore the penalty sinners deserved, satisfying divine justice
- Other aspects of atonement (victory, example) are grounded in substitution

## VI. Scripture Memory

> "He made Him who knew no sin to be sin for us, that we might become the righteousness of God in Him." — 2 Corinthians 5:21 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Resurrection - Historical Evidence and Theological Meaning",
    content: `# The Resurrection - Historical Evidence and Theological Meaning

## I. Introduction

The bodily resurrection of Jesus Christ from the dead is the cornerstone of Christian faith. The Apostle Paul declared, "If Christ is not risen, your faith is futile; you are still in your sins!" (1 Corinthians 15:17). The resurrection is not merely a spiritual metaphor or subjective experience but a historical event—the physical rising of Jesus from the tomb on the third day after His crucifixion.

This lesson examines both the historical evidence for the resurrection and its profound theological significance. The resurrection validates Christ's claims, vindicates His atoning work, and guarantees the future resurrection of all believers.

**Learning Objectives:**
- Examine the historical evidence for Christ's resurrection
- Understand the nature of Christ's resurrection body
- Explore the theological significance of the resurrection
- Apply resurrection truth to Christian life and hope

## II. Historical Evidence for the Resurrection

### A. The Empty Tomb

All four Gospels testify that on the third day, the tomb where Jesus was buried was found empty (Matthew 28:6; Mark 16:6; Luke 24:3; John 20:2). Several factors confirm the historicity of this account:

**The testimony of women**: In first-century Jewish culture, women's testimony was not considered reliable in court. If the disciples were fabricating the story, they would not have made women the primary witnesses.

**The Jewish response**: The Jewish authorities did not deny the empty tomb but attempted to explain it away by claiming the disciples stole the body (Matthew 28:11-15). This presupposes the tomb was indeed empty.

**The location was known**: The tomb belonged to Joseph of Arimathea, a member of the Sanhedrin. Its location was public knowledge, making fabrication easily disprovable.

### B. The Post-Resurrection Appearances

Jesus appeared to numerous witnesses over a period of forty days:

- Mary Magdalene (John 20:11-18)
- The other women (Matthew 28:9-10)
- Peter (Luke 24:34; 1 Corinthians 15:5)
- Two disciples on the road to Emmaus (Luke 24:13-35)
- The ten apostles (Luke 24:36-43; John 20:19-23)
- The eleven apostles, including Thomas (John 20:26-29)
- Seven disciples by the Sea of Galilee (John 21:1-23)
- More than five hundred brethren at once (1 Corinthians 15:6)
- James, the Lord's brother (1 Corinthians 15:7)
- All the apostles at the ascension (Acts 1:3-9)

Paul notes that most of the five hundred were still alive when he wrote (c. AD 55), inviting verification.

### C. The Transformation of the Disciples

The disciples were transformed from fearful, scattered followers into bold proclaimers willing to die for their testimony. Peter, who denied Christ three times, later proclaimed the resurrection before the Sanhedrin (Acts 4:10). This transformation is inexplicable apart from the reality of the resurrection.

### D. The Conversion of Skeptics

James, the brother of Jesus, was a skeptic during Jesus' ministry (John 7:5) but became a leader of the Jerusalem church after seeing the risen Lord (1 Corinthians 15:7). Paul (Saul) was a persecutor of the church until his encounter with the risen Christ (Acts 9; 1 Corinthians 15:8).

### E. The Origin of the Church

The Christian church emerged in Jerusalem, the very city where Jesus was crucified and buried. The proclamation of the resurrection was central from the beginning (Acts 2:24-32). The church's existence and rapid growth require an adequate cause—the resurrection provides it.

## III. The Nature of the Resurrection Body

Christ's resurrection body was both continuous with His pre-death body and transformed:

**Continuity**: Jesus showed His disciples His hands and side (John 20:20, 27). He ate food with them (Luke 24:42-43). The tomb was empty because the same body that was buried was raised.

**Transformation**: Jesus appeared in locked rooms (John 20:19, 26). He was not immediately recognized (Luke 24:16; John 20:14). His body was no longer subject to death (Romans 6:9).

Paul describes the resurrection body as "spiritual" (σῶμα πνευματικόν, soma pneumatikon) in 1 Corinthians 15:44—not meaning immaterial, but animated and empowered by the Spirit.

## IV. Theological Significance

### A. Vindication of Christ's Claims

The resurrection validates Jesus' claims to be the Son of God. He was "declared to be the Son of God with power according to the Spirit of holiness, by the resurrection from the dead" (Romans 1:4).

### B. Confirmation of the Atonement

The resurrection demonstrates that the Father accepted Christ's sacrifice. "He was delivered up because of our offenses, and was raised because of our justification" (Romans 4:25). The resurrection is God's "Amen" to the cross.

### C. Guarantee of Our Resurrection

Christ is "the firstfruits of those who have fallen asleep" (1 Corinthians 15:20). His resurrection guarantees the future resurrection of all who are in Him: "For as in Adam all die, even so in Christ all shall be made alive" (1 Corinthians 15:22).

### D. Foundation for Present Christian Life

The resurrection empowers Christian living:
- We are raised with Christ to "walk in newness of life" (Romans 6:4)
- We experience "the power of His resurrection" (Philippians 3:10)
- We serve a living Lord who intercedes for us (Hebrews 7:25)

## V. Key Points Summary

- Multiple lines of historical evidence support the resurrection
- The empty tomb, appearances, and transformed disciples are compelling
- Christ's resurrection body was physical yet glorified
- The resurrection vindicates Christ's claims and confirms the atonement
- It guarantees believers' future resurrection and empowers present life

## VI. Scripture Memory

> "But now Christ is risen from the dead, and has become the firstfruits of those who have fallen asleep." — 1 Corinthians 15:20 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Ascension and Session of Christ",
    content: `# The Ascension and Session of Christ

## I. Introduction

The ascension of Christ—His bodily departure from earth to heaven forty days after His resurrection—and His session—His present enthronement at the Father's right hand—are often overlooked aspects of Christology. Yet these events are essential to understanding Christ's completed work and ongoing ministry. The ascension marks the culmination of Christ's earthly mission, while the session describes His present heavenly activity on behalf of His people.

The Apostles' Creed confesses that Christ "ascended into heaven and sits at the right hand of God the Father Almighty." This lesson explores the biblical teaching on these doctrines and their significance for Christian faith and practice.

**Learning Objectives:**
- Examine the biblical accounts of Christ's ascension
- Understand the meaning of Christ's session at God's right hand
- Explore Christ's present heavenly ministry
- Apply these truths to Christian hope and worship

## II. The Ascension of Christ

### A. Biblical Accounts

The ascension is recorded in Luke 24:50-51 and Acts 1:9-11:

> "Now when He had spoken these things, while they watched, He was taken up, and a cloud received Him out of their sight. And while they looked steadfastly toward heaven as He went up, behold, two men stood by them in white apparel, who also said, 'Men of Galilee, why do you stand gazing up into heaven? This same Jesus, who was taken up from you into heaven, will so come in like manner as you saw Him go into heaven.'" (Acts 1:9-11)

The ascension was:
- **Visible**: The disciples watched as He ascended
- **Bodily**: The same Jesus who rose bodily ascended bodily
- **Gradual**: He was "taken up" while they watched
- **Into heaven**: He entered the presence of the Father

### B. Old Testament Background

The ascension fulfills Old Testament imagery and prophecy:

**Psalm 68:18**: "You have ascended on high, You have led captivity captive; You have received gifts among men." Paul applies this to Christ in Ephesians 4:8.

**Psalm 110:1**: "The LORD said to my Lord, 'Sit at My right hand, till I make Your enemies Your footstool.'" Jesus cited this psalm as referring to Himself (Matthew 22:44).

**Daniel 7:13-14**: "One like the Son of Man, coming with the clouds of heaven! He came to the Ancient of Days... Then to Him was given dominion and glory and a kingdom."

### C. Theological Significance of the Ascension

**Completion of Earthly Mission**: The ascension marks the end of Christ's humiliation and the beginning of His exaltation. His work of redemption accomplished, He returned to the Father.

**Preparation of a Place**: Jesus promised, "I go to prepare a place for you" (John 14:2). The ascension initiates this preparation.

**Sending of the Spirit**: Jesus said, "If I do not go away, the Helper will not come to you; but if I depart, I will send Him to you" (John 16:7). The ascension was necessary for Pentecost.

**Guarantee of Return**: The angels promised, "This same Jesus... will so come in like manner" (Acts 1:11). The ascension guarantees the second coming.

## III. The Session of Christ

### A. The Meaning of "Right Hand"

Christ's session at the Father's "right hand" (δεξιᾷ, dexia) signifies:

**Honor**: The right hand was the place of highest honor in the ancient world.

**Authority**: To sit at the king's right hand meant to share in his rule and power.

**Completion**: Priests in the Old Testament stood to minister; Christ sat down because His sacrifice was complete (Hebrews 10:12).

### B. Biblical Testimony

The New Testament repeatedly affirms Christ's session:

- "When He had by Himself purged our sins, sat down at the right hand of the Majesty on high" (Hebrews 1:3)
- "Who is at the right hand of God, having gone into heaven" (1 Peter 3:22)
- Stephen saw "the Son of Man standing at the right hand of God" (Acts 7:56)
- "Christ... who is even at the right hand of God, who also makes intercession for us" (Romans 8:34)

### C. Christ's Present Heavenly Ministry

From His position at the Father's right hand, Christ engages in ongoing ministry:

**Intercession**: "He always lives to make intercession for them" (Hebrews 7:25). Christ pleads our case before the Father, not as one begging for mercy but as one whose sacrifice has secured our acceptance.

**Advocacy**: "If anyone sins, we have an Advocate (παράκλητος, parakletos) with the Father, Jesus Christ the righteous" (1 John 2:1). When we sin, Christ represents us before the Father.

**Ruling**: Christ exercises authority over all things for the sake of the church. God "put all things under His feet, and gave Him to be head over all things to the church" (Ephesians 1:22).

**Preparing**: Christ prepares a place for His people and prepares His people for that place through the Spirit's work.

**Waiting**: Christ waits "till His enemies are made His footstool" (Hebrews 10:13). The session is not passive but anticipatory of final victory.

## IV. Implications for Christian Life

### A. Access to God

Because Christ is at the Father's right hand, we have bold access to the throne of grace: "Let us therefore come boldly to the throne of grace" (Hebrews 4:16).

### B. Security in Christ

Our Advocate and Intercessor ensures that nothing can separate us from God's love (Romans 8:34-39).

### C. Hope of Glory

Where Christ is, there we shall be: "Father, I desire that they also whom You gave Me may be with Me where I am" (John 17:24).

### D. Motivation for Service

Christ's authority empowers our mission: "All authority has been given to Me... Go therefore and make disciples" (Matthew 28:18-19).

## V. Key Points Summary

- The ascension was Christ's visible, bodily departure to heaven
- It fulfilled Old Testament prophecy and completed His earthly mission
- The session describes Christ's enthronement at the Father's right hand
- Christ presently intercedes, advocates, and rules from heaven
- These truths provide access, security, hope, and motivation for believers

## VI. Scripture Memory

> "Who is he who condemns? It is Christ who died, and furthermore is also risen, who is even at the right hand of God, who also makes intercession for us." — Romans 8:34 (NKJV)

---
*Licensed to Larry Fisher*`
  },
  {
    title: "The Second Coming and Eschatological Christology",
    content: `# The Second Coming and Eschatological Christology

## I. Introduction

The second coming of Jesus Christ—His visible, bodily return to earth in glory—is the blessed hope of the church and the culmination of redemptive history. While Christ's first coming was in humility to accomplish salvation, His second coming will be in power and glory to consummate His kingdom. Eschatological Christology examines Christ's role in the end times, including His return, judgment, and eternal reign.

The New Testament is saturated with references to Christ's return. One in every thirteen verses in the New Testament mentions the second coming. This doctrine is not peripheral but central to Christian hope and ethical living.

**Learning Objectives:**
- Examine the biblical teaching on Christ's second coming
- Understand the nature and purpose of Christ's return
- Explore Christ's role in judgment and the consummation
- Apply the hope of Christ's return to Christian living

## II. The Certainty of Christ's Return

### A. Christ's Own Promises

Jesus repeatedly promised to return:

> "And if I go and prepare a place for you, I will come again and receive you to Myself; that where I am, there you may be also." (John 14:3)

> "Then the sign of the Son of Man will appear in heaven, and then all the tribes of the earth will mourn, and they will see the Son of Man coming on the clouds of heaven with power and great glory." (Matthew 24:30)

### B. Apostolic Testimony

The apostles consistently taught Christ's return:

- "This same Jesus, who was taken up from you into heaven, will so come in like manner" (Acts 1:11)
- "For the Lord Himself will descend from heaven with a shout" (1 Thessalonians 4:16)
- "When Christ who is our life appears, then you also will appear with Him in glory" (Colossians 3:4)
- "He who testifies to these things says, 'Surely I am coming quickly'" (Revelation 22:20)

### C. The Greek Terminology

The New Testament uses several terms for Christ's return:

**Parousia (παρουσία)**: "Coming" or "presence"—emphasizes Christ's arrival and presence with His people (Matthew 24:27; 1 Thessalonians 4:15).

**Apokalypsis (ἀποκάλυψις)**: "Revelation" or "unveiling"—emphasizes the disclosure of Christ's glory (1 Peter 1:7; 2 Thessalonians 1:7).

**Epiphaneia (ἐπιφάνεια)**: "Appearing" or "manifestation"—emphasizes the visibility of Christ's return (2 Timothy 4:8; Titus 2:13).

## III. The Nature of Christ's Return

### A. Personal and Bodily

Christ Himself will return—not merely His influence or Spirit. "This same Jesus" who ascended will return (Acts 1:11). The return will be as bodily as the ascension.

### B. Visible and Glorious

"Every eye will see Him" (Revelation 1:7). Christ will come "in the glory of His Father with the holy angels" (Mark 8:38). This will not be a secret event but a cosmic revelation.

### C. Sudden and Unexpected

"The day of the Lord so comes as a thief in the night" (1 Thessalonians 5:2). "Therefore you also be ready, for the Son of Man is coming at an hour you do not expect" (Matthew 24:44).

### D. Triumphant and Final

Christ returns as conquering King: "On His robe and on His thigh a name written: KING OF KINGS AND LORD OF LORDS" (Revelation 19:16). His return initiates the final consummation of all things.

## IV. The Purpose of Christ's Return

### A. Resurrection of the Dead

"The hour is coming in which all who are in the graves will hear His voice and come forth" (John 5:28-29). Christ's return triggers the general resurrection.

### B. Judgment of All

Christ will judge the living and the dead:

> "For we must all appear before the judgment seat of Christ, that each one may receive the things done in the body, according to what he has done, whether good or bad." (2 Corinthians 5:10)

> "When the Son of Man comes in His glory... He will sit on the throne of His glory. All the nations will be gathered before Him, and He will separate them one from another." (Matthew 25:31-32)

### C. Transformation of Believers

"We shall all be changed—in a moment, in the twinkling of an eye, at the last trumpet" (1 Corinthians 15:51-52). Living believers will be transformed; deceased believers will be raised.

### D. Destruction of Evil

Christ returns to defeat His enemies: "Then the lawless one will be revealed, whom the Lord will consume with the breath of His mouth and destroy with the brightness of His coming" (2 Thessalonians 2:8).

### E. Establishment of the Eternal Kingdom

"Then comes the end, when He delivers the kingdom to God the Father, when He puts an end to all rule and all authority and power" (1 Corinthians 15:24). Christ's return inaugurates the eternal state.

## V. Christ's Eternal Reign

The consummation brings the full realization of Christ's kingdom:

**New Creation**: "Now I saw a new heaven and a new earth" (Revelation 21:1). Christ makes all things new.

**God's Dwelling with Humanity**: "Behold, the tabernacle of God is with men, and He will dwell with them" (Revelation 21:3).

**The Lamb as Temple and Light**: "The Lord God Almighty and the Lamb are its temple... the Lamb is its light" (Revelation 21:22-23).

**Eternal Worship**: "His servants shall serve Him. They shall see His face" (Revelation 22:3-4).

## VI. Implications for Christian Living

### A. Watchfulness

"Watch therefore, for you do not know what hour your Lord is coming" (Matthew 24:42).

### B. Holiness

"Everyone who has this hope in Him purifies himself, just as He is pure" (1 John 3:3).

### C. Faithful Service

"Occupy till I come" (Luke 19:13, KJV). We are to be found faithfully serving when Christ returns.

### D. Comfort and Hope

"Comfort one another with these words" (1 Thessalonians 4:18). The second coming is our "blessed hope" (Titus 2:13).

### E. Evangelistic Urgency

The certainty of judgment motivates gospel proclamation: "Knowing, therefore, the terror of the Lord, we persuade men" (2 Corinthians 5:11).

## VII. Key Points Summary

- Christ's return is certain, promised by Christ and the apostles
- It will be personal, visible, sudden, and glorious
- Christ returns to raise the dead, judge all, and establish His eternal kingdom
- The second coming motivates watchfulness, holiness, service, and hope
- "Even so, come, Lord Jesus!" (Revelation 22:20)

## VIII. Scripture Memory

> "Looking for the blessed hope and glorious appearing of our great God and Savior Jesus Christ." — Titus 2:13 (NKJV)

---
*Licensed to Larry Fisher*`
  }
];

// Insert lessons (starting from order 3 since 2 lessons already exist)
for (let i = 0; i < lessons.length; i++) {
  const lesson = lessons[i];
  const lessonOrder = i + 3; // Start from 3
  const [result] = await connection.execute(
    `INSERT INTO lessons (courseId, title, content, lessonOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [courseId, lesson.title, lesson.content, lessonOrder]
  );
  console.log(`Created lesson ${i+1}: ${lesson.title} (ID: ${result.insertId})`);
}

console.log('\nDIV112 lessons created successfully!');
await connection.end();
