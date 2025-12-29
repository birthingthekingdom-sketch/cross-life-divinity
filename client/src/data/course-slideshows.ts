/**
 * Course Introduction Slideshows
 * Each course code maps to its specific slideshow content
 * This ensures proper course-to-content mapping (e.g., DIV109 only shows Kingdom Authority content)
 */

export interface SlideContent {
  title: string;
  subtitle: string;
  content: string;
  keyPoints: string[];
}

export interface CourseSlideshow {
  courseCode: string;
  courseTitle: string;
  slides: SlideContent[];
  voiceNarration?: {
    male?: string;
    female?: string;
  };
}

export const courseSlideshows: Record<string, CourseSlideshow> = {
  // DIV101 - Understanding Prophecy
  DIV101: {
    courseCode: "DIV101",
    courseTitle: "Understanding Prophecy",
    slides: [
      {
        title: "Understanding Prophecy",
        subtitle: "The Office and Gift of Prophecy in the Life of a Believer",
        content: "Explore the biblical foundation of prophecy, its role in the New Testament church, and how believers can develop and operate in prophetic gifts.",
        keyPoints: [
          "Biblical definition and types of prophecy",
          "The office of the prophet vs. the gift of prophecy",
          "How to recognize genuine prophetic words",
          "Developing your prophetic gifting"
        ]
      },
      {
        title: "Prophetic Foundation",
        subtitle: "What the Bible Says About Prophecy",
        content: "Understand the scriptural basis for prophecy and how it functions in modern ministry.",
        keyPoints: [
          "Old Testament prophetic tradition",
          "New Testament prophetic ministry",
          "1 Corinthians 14 - Pursuing prophecy",
          "Testing and validating prophetic words"
        ]
      },
      {
        title: "Practical Application",
        subtitle: "Operating in Your Prophetic Gift",
        content: "Learn how to develop, practice, and responsibly exercise prophetic gifts in your ministry context.",
        keyPoints: [
          "Cultivating sensitivity to the Holy Spirit",
          "Overcoming fear and insecurity",
          "Delivering prophetic words with wisdom",
          "Building credibility as a prophetic voice"
        ]
      }
    ]
  },

  // MIN201 - The Fivefold Ministry
  MIN201: {
    courseCode: "MIN201",
    courseTitle: "The Fivefold Ministry",
    slides: [
      {
        title: "The Fivefold Ministry",
        subtitle: "Understanding the Five Ministry Roles",
        content: "Discover the five distinct ministry callings outlined in Ephesians 4:11 and how they work together to build the body of Christ.",
        keyPoints: [
          "Apostle - Foundation and pioneering",
          "Prophet - Vision and direction",
          "Evangelist - Soul-winning and outreach",
          "Pastor - Care and shepherding",
          "Teacher - Instruction and discipleship"
        ]
      },
      {
        title: "Identifying Your Ministry Gift",
        subtitle: "Which Role Is God Calling You To?",
        content: "Explore the characteristics and calling patterns of each fivefold ministry to help identify your primary gifting.",
        keyPoints: [
          "Recognizing your natural strengths",
          "Understanding your passion and burden",
          "Confirmation through others",
          "Testing and development of your calling"
        ]
      },
      {
        title: "Ministry Integration",
        subtitle: "How the Five Gifts Work Together",
        content: "Learn how apostles, prophets, evangelists, pastors, and teachers complement each other to strengthen the church.",
        keyPoints: [
          "Avoiding ministry imbalance",
          "Building teams with multiple gifts",
          "Mutual accountability and support",
          "Equipping the saints for ministry"
        ]
      }
    ]
  },

  // MIN301 - Deliverance Ministry
  MIN301: {
    courseCode: "MIN301",
    courseTitle: "Deliverance Ministry",
    slides: [
      {
        title: "Deliverance Ministry",
        subtitle: "Freedom from Spiritual Oppression",
        content: "Understanding deliverance and its necessity for holiness and freedom in Christ. Learn how to minister freedom to those in bondage.",
        keyPoints: [
          "Biblical basis for deliverance",
          "Recognizing spiritual oppression",
          "Authority in Christ for deliverance",
          "Compassion and pastoral care in ministry"
        ]
      },
      {
        title: "Spiritual Warfare Foundations",
        subtitle: "Our Weapons and Authority",
        content: "Understand the spiritual realm and how believers are equipped to stand against darkness.",
        keyPoints: [
          "The nature of spiritual warfare",
          "Our authority in Christ",
          "Armor of God - practical application",
          "Prayer and intercession strategies"
        ]
      },
      {
        title: "Practical Deliverance Ministry",
        subtitle: "How to Minister Deliverance",
        content: "Practical guidance for conducting deliverance sessions with wisdom, compassion, and effectiveness.",
        keyPoints: [
          "Preparation and prayer",
          "Discernment and diagnosis",
          "The deliverance process",
          "Follow-up and discipleship"
        ]
      }
    ]
  },

  // BIB101 - Old Testament Survey
  BIB101: {
    courseCode: "BIB101",
    courseTitle: "Old Testament Survey",
    slides: [
      {
        title: "Old Testament Survey",
        subtitle: "God's Covenant People and Redemptive History",
        content: "Comprehensive overview of the Old Testament, exploring God's covenant with Israel and the development of biblical theology.",
        keyPoints: [
          "Creation and covenant foundation",
          "Israel's history and calling",
          "Prophetic foreshadowing of Christ",
          "Themes of redemption and restoration"
        ]
      },
      {
        title: "The Pentateuch",
        subtitle: "Foundation of Scripture",
        content: "Explore Genesis through Deuteronomy - the foundational books establishing God's law, covenant, and people.",
        keyPoints: [
          "Creation account and Fall",
          "Patriarchal covenant",
          "Exodus and liberation",
          "Law and covenant at Sinai"
        ]
      },
      {
        title: "Prophetic Books and Wisdom",
        subtitle: "God's Word Through Prophets and Sages",
        content: "Study the prophetic books and wisdom literature that guide believers in faith and practice.",
        keyPoints: [
          "Major and minor prophets",
          "Messianic prophecies",
          "Wisdom literature - Proverbs, Job, Ecclesiastes",
          "Psalms - prayers and worship"
        ]
      }
    ]
  },

  // BIB102 - New Testament Survey
  BIB102: {
    courseCode: "BIB102",
    courseTitle: "New Testament Survey",
    slides: [
      {
        title: "New Testament Survey",
        subtitle: "Jesus Christ and the Birth of the Church",
        content: "Rigorous examination of the New Testament through historical, critical, and theological lenses.",
        keyPoints: [
          "The Gospels - Jesus' life and teaching",
          "Acts - the birth of the church",
          "Paul's epistles - theology and practice",
          "Revelation - eschatology and hope"
        ]
      },
      {
        title: "The Gospels",
        subtitle: "Four Perspectives on Jesus",
        content: "Explore Matthew, Mark, Luke, and John - each presenting Jesus through a unique lens.",
        keyPoints: [
          "Matthew - Jesus the King",
          "Mark - Jesus the Servant",
          "Luke - Jesus the Son of Man",
          "John - Jesus the Word of God"
        ]
      },
      {
        title: "Pauline Theology",
        subtitle: "The Apostle's Vision for the Church",
        content: "Study Paul's letters and his revolutionary understanding of grace, faith, and Christian living.",
        keyPoints: [
          "Justification by faith",
          "The body of Christ",
          "Spiritual gifts and ministry",
          "Eschatological hope"
        ]
      }
    ]
  },

  // THE201 - Systematic Theology
  THE201: {
    courseCode: "THE201",
    courseTitle: "Systematic Theology",
    slides: [
      {
        title: "Systematic Theology",
        subtitle: "Organized Understanding of Christian Doctrine",
        content: "Comprehensive study of Christian doctrine organized by major theological themes and their biblical foundations.",
        keyPoints: [
          "Bibliology - doctrine of Scripture",
          "Theology - doctrine of God",
          "Christology - doctrine of Christ",
          "Soteriology - doctrine of salvation",
          "Ecclesiology - doctrine of the church"
        ]
      },
      {
        title: "God and Creation",
        subtitle: "The Nature of God and His Works",
        content: "Explore God's attributes, nature, and His creative work.",
        keyPoints: [
          "God's existence and attributes",
          "Trinity - Father, Son, Holy Spirit",
          "Creation and providence",
          "God's sovereignty and human freedom"
        ]
      },
      {
        title: "Salvation and Redemption",
        subtitle: "God's Plan for Human Restoration",
        content: "Study the doctrine of salvation from multiple perspectives.",
        keyPoints: [
          "The Fall and sin",
          "Christ's redemptive work",
          "Justification and sanctification",
          "Glorification and eternal life"
        ]
      }
    ]
  },

  // BIB201 - Biblical Hermeneutics
  BIB201: {
    courseCode: "BIB201",
    courseTitle: "Biblical Hermeneutics",
    slides: [
      {
        title: "Biblical Hermeneutics",
        subtitle: "Principles of Biblical Interpretation",
        content: "Master the art and science of interpreting Scripture accurately and applying it to life.",
        keyPoints: [
          "Historical-grammatical method",
          "Literary context and genre",
          "Original languages - Hebrew and Greek",
          "Application and relevance"
        ]
      },
      {
        title: "Interpretive Methods",
        subtitle: "Approaches to Understanding Scripture",
        content: "Explore various hermeneutical approaches and their strengths and limitations.",
        keyPoints: [
          "Literal interpretation",
          "Typological interpretation",
          "Allegorical interpretation",
          "Spiritual application"
        ]
      },
      {
        title: "Practical Exegesis",
        subtitle: "Studying Scripture Deeply",
        content: "Learn step-by-step methods for conducting thorough biblical study.",
        keyPoints: [
          "Observation - what does it say?",
          "Interpretation - what does it mean?",
          "Application - how does it apply?",
          "Communication - how do I share it?"
        ]
      }
    ]
  },

  // THE301 - Fundamentals of Apologetics
  THE301: {
    courseCode: "THE301",
    courseTitle: "Fundamentals of Apologetics",
    slides: [
      {
        title: "Fundamentals of Apologetics",
        subtitle: "Defending the Christian Faith",
        content: "Learn to articulate and defend Christian beliefs in a thoughtful, respectful manner.",
        keyPoints: [
          "What is apologetics?",
          "Classical, evidential, and presuppositional approaches",
          "Common objections and responses",
          "Engaging skeptics with grace and truth"
        ]
      },
      {
        title: "Foundational Arguments",
        subtitle: "Case for God and Christianity",
        content: "Study the major philosophical and theological arguments for God's existence and Christian faith.",
        keyPoints: [
          "Cosmological argument",
          "Teleological argument",
          "Moral argument",
          "Historical evidence for resurrection"
        ]
      },
      {
        title: "Engaging Culture",
        subtitle: "Apologetics in Modern Context",
        content: "Address contemporary challenges to faith and develop strategies for cultural engagement.",
        keyPoints: [
          "Science and faith",
          "Suffering and evil",
          "Religious pluralism",
          "Secular worldviews"
        ]
      }
    ]
  },

  // MIN101 - Evangelism and Discipleship
  MIN101: {
    courseCode: "MIN101",
    courseTitle: "Evangelism and Discipleship",
    slides: [
      {
        title: "Evangelism and Discipleship",
        subtitle: "Making Disciples Who Make Disciples",
        content: "Understand the Great Commission and develop skills for effective evangelism and discipleship.",
        keyPoints: [
          "The Great Commission mandate",
          "Evangelism methods and approaches",
          "Discipleship foundations",
          "Multiplication and leadership development"
        ]
      },
      {
        title: "Effective Evangelism",
        subtitle: "Sharing Your Faith",
        content: "Learn practical strategies for sharing the Gospel and leading people to Christ.",
        keyPoints: [
          "Personal testimony power",
          "Gospel presentation methods",
          "Handling objections",
          "Following up with new believers"
        ]
      },
      {
        title: "Discipleship Process",
        subtitle: "Building Spiritual Maturity",
        content: "Develop a systematic approach to discipling believers from conversion to maturity.",
        keyPoints: [
          "Stages of spiritual development",
          "Mentoring relationships",
          "Accountability and growth",
          "Releasing disciples into ministry"
        ]
      }
    ]
  },

  // MIN102 - Discipleship Training
  MIN102: {
    courseCode: "MIN102",
    courseTitle: "Discipleship Training",
    slides: [
      {
        title: "Discipleship Training",
        subtitle: "Equipping Believers for Ministry",
        content: "Comprehensive training in discipleship methodologies and spiritual formation.",
        keyPoints: [
          "Discipleship models and approaches",
          "Spiritual disciplines",
          "Character development",
          "Ministry skills training"
        ]
      },
      {
        title: "Spiritual Disciplines",
        subtitle: "Foundations for Growth",
        content: "Explore practices that cultivate spiritual maturity and closeness to God.",
        keyPoints: [
          "Prayer and meditation",
          "Bible study and Scripture memory",
          "Fasting and solitude",
          "Community and accountability"
        ]
      },
      {
        title: "Leadership Development",
        subtitle: "Raising Up the Next Generation",
        content: "Train disciples to become leaders who can multiply their influence.",
        keyPoints: [
          "Identifying potential leaders",
          "Mentoring and coaching",
          "Delegation and empowerment",
          "Succession planning"
        ]
      }
    ]
  },

  // SPR101 - Prayer and Intercession
  SPR101: {
    courseCode: "SPR101",
    courseTitle: "Prayer and Intercession",
    slides: [
      {
        title: "Prayer and Intercession",
        subtitle: "Communicating with God",
        content: "Deepen your prayer life and learn to intercede effectively for others and nations.",
        keyPoints: [
          "Types of prayer",
          "Prayer principles from Scripture",
          "Intercession and spiritual warfare",
          "Prayer strategies and methods"
        ]
      },
      {
        title: "Prayer Foundations",
        subtitle: "Biblical Basis for Prayer",
        content: "Understand what the Bible teaches about prayer and its power.",
        keyPoints: [
          "Jesus' teaching on prayer",
          "Prayer in the Psalms",
          "Apostolic prayer models",
          "Prayer promises and answers"
        ]
      },
      {
        title: "Intercession Ministry",
        subtitle: "Standing in the Gap",
        content: "Develop a burden for intercession and learn strategies for effective prayer.",
        keyPoints: [
          "Understanding intercession",
          "Praying for nations and leaders",
          "Prayer walking and spiritual mapping",
          "Prayer teams and corporate intercession"
        ]
      }
    ]
  },

  // LED201 - Christian Leadership
  LED201: {
    courseCode: "LED201",
    courseTitle: "Christian Leadership",
    slides: [
      {
        title: "Christian Leadership",
        subtitle: "Servant Leadership in Ministry",
        content: "Develop leadership skills grounded in biblical principles and servant-hearted values.",
        keyPoints: [
          "Biblical models of leadership",
          "Servant leadership",
          "Vision casting and strategy",
          "Team building and delegation"
        ]
      },
      {
        title: "Leadership Foundations",
        subtitle: "Character and Calling",
        content: "Build a strong foundation of character and clarity about your leadership calling.",
        keyPoints: [
          "Personal integrity",
          "Spiritual maturity",
          "Emotional intelligence",
          "Authentic leadership presence"
        ]
      },
      {
        title: "Leading Teams",
        subtitle: "Building and Developing Leaders",
        content: "Master the skills of team leadership and developing others into leaders.",
        keyPoints: [
          "Team dynamics",
          "Conflict resolution",
          "Motivation and inspiration",
          "Accountability and performance"
        ]
      }
    ]
  },

  // WOR101 - Biblical Worship
  WOR101: {
    courseCode: "WOR101",
    courseTitle: "Biblical Worship",
    slides: [
      {
        title: "Biblical Worship",
        subtitle: "Understanding True Worship",
        content: "Explore the theology and practice of worship in Scripture and contemporary ministry.",
        keyPoints: [
          "Definition of worship",
          "Old Testament worship patterns",
          "New Testament worship practice",
          "Worship in spirit and truth"
        ]
      },
      {
        title: "Worship Theology",
        subtitle: "What the Bible Teaches About Worship",
        content: "Study biblical foundations for understanding worship as central to Christian life.",
        keyPoints: [
          "Worship in creation",
          "Temple worship and sacrifice",
          "Jesus - the ultimate worship focus",
          "Worship and discipleship"
        ]
      },
      {
        title: "Worship Leadership",
        subtitle: "Leading Others in Worship",
        content: "Develop skills for leading worship that engages the whole person and draws people to God.",
        keyPoints: [
          "Music and worship",
          "Prophetic worship",
          "Corporate worship dynamics",
          "Creating space for God's presence"
        ]
      }
    ]
  },

  // PAS201 - Pastoral Counseling
  PAS201: {
    courseCode: "PAS201",
    courseTitle: "Pastoral Counseling",
    slides: [
      {
        title: "Pastoral Counseling",
        subtitle: "Caring for People's Spiritual and Emotional Needs",
        content: "Learn counseling skills for helping people navigate life challenges from a Christian perspective.",
        keyPoints: [
          "Counseling foundations",
          "Active listening and empathy",
          "Crisis intervention",
          "Referral and boundaries"
        ]
      },
      {
        title: "Counseling Skills",
        subtitle: "Techniques for Effective Helping",
        content: "Develop practical skills for pastoral care and counseling.",
        keyPoints: [
          "Building trust and rapport",
          "Asking good questions",
          "Reflecting and validating",
          "Guiding toward solutions"
        ]
      },
      {
        title: "Common Issues",
        subtitle: "Addressing Life Challenges",
        content: "Learn to address common pastoral counseling situations with wisdom and compassion.",
        keyPoints: [
          "Grief and loss",
          "Marriage and family issues",
          "Addiction and recovery",
          "Spiritual struggles"
        ]
      }
    ]
  },

  // PAS301 - Church Administration
  PAS301: {
    courseCode: "PAS301",
    courseTitle: "Church Administration",
    slides: [
      {
        title: "Church Administration",
        subtitle: "Managing Ministry Operations",
        content: "Master the administrative skills needed to lead a church effectively.",
        keyPoints: [
          "Organizational structure",
          "Financial management",
          "Staff and volunteer coordination",
          "Facilities and resources"
        ]
      },
      {
        title: "Leadership and Organization",
        subtitle: "Building Healthy Systems",
        content: "Develop organizational structures that support ministry and growth.",
        keyPoints: [
          "Vision and mission alignment",
          "Governance and accountability",
          "Communication systems",
          "Strategic planning"
        ]
      },
      {
        title: "Financial Stewardship",
        subtitle: "Managing Resources Wisely",
        content: "Learn biblical principles and practical skills for church financial management.",
        keyPoints: [
          "Budgeting and planning",
          "Giving and generosity",
          "Accountability and transparency",
          "Facility management"
        ]
      }
    ]
  },

  // PAS101 - Homiletics
  PAS101: {
    courseCode: "PAS101",
    courseTitle: "Homiletics",
    slides: [
      {
        title: "Homiletics",
        subtitle: "The Art and Science of Preaching",
        content: "Develop skills in sermon preparation and delivery for effective biblical preaching.",
        keyPoints: [
          "Sermon structure and development",
          "Exegesis and application",
          "Delivery and communication",
          "Engaging your audience"
        ]
      },
      {
        title: "Sermon Preparation",
        subtitle: "From Text to Pulpit",
        content: "Learn a systematic approach to preparing sermons that are biblical and relevant.",
        keyPoints: [
          "Text selection and study",
          "Exegetical work",
          "Sermon outline development",
          "Illustration and application"
        ]
      },
      {
        title: "Preaching Delivery",
        subtitle: "Communicating with Power",
        content: "Master the skills of effective preaching delivery.",
        keyPoints: [
          "Voice and diction",
          "Body language and presence",
          "Managing nervousness",
          "Engaging listeners"
        ]
      }
    ]
  },

  // SPR201 - Discovering Spiritual Gifts
  SPR201: {
    courseCode: "SPR201",
    courseTitle: "Discovering Spiritual Gifts",
    slides: [
      {
        title: "Discovering Spiritual Gifts",
        subtitle: "Understanding Your Spiritual Gifting",
        content: "Identify and develop your spiritual gifts for effective ministry in the body of Christ.",
        keyPoints: [
          "What are spiritual gifts?",
          "Lists of gifts in Scripture",
          "Gift assessment and discovery",
          "Developing and using your gifts"
        ]
      },
      {
        title: "Gifts of the Spirit",
        subtitle: "Manifestations of the Holy Spirit",
        content: "Explore the various spiritual gifts and their purpose in ministry.",
        keyPoints: [
          "Gifts of revelation - word of knowledge, wisdom, discernment",
          "Gifts of power - faith, healing, miracles",
          "Gifts of inspiration - prophecy, tongues, interpretation",
          "Motivational gifts - serving, teaching, exhorting"
        ]
      },
      {
        title: "Gift Integration",
        subtitle: "Using Your Gifts in Community",
        content: "Learn how to use your spiritual gifts effectively within the church community.",
        keyPoints: [
          "Complementary gifts",
          "Avoiding gift competition",
          "Accountability in gifting",
          "Multiplication through gifts"
        ]
      }
    ]
  },

  // DIV108 - Advanced Spiritual Warfare
  DIV108: {
    courseCode: "DIV108",
    courseTitle: "Advanced Spiritual Warfare",
    slides: [
      {
        title: "Advanced Spiritual Warfare",
        subtitle: "Master Advanced Techniques and Principles",
        content: "Deepen your understanding of spiritual warfare with advanced biblical principles for victory in Christ.",
        keyPoints: [
          "Spiritual realm reality",
          "Demonic hierarchies and strongholds",
          "Binding and loosing",
          "Territorial spiritual warfare"
        ]
      },
      {
        title: "Warfare Strategy",
        subtitle: "Strategic Approaches to Spiritual Battle",
        content: "Develop comprehensive strategies for spiritual warfare in personal and corporate contexts.",
        keyPoints: [
          "Identifying spiritual strongholds",
          "Prayer warfare strategies",
          "Prophetic intercession",
          "Breaking generational curses"
        ]
      },
      {
        title: "Victory in Christ",
        subtitle: "Living in Spiritual Authority",
        content: "Learn to live in the victory Christ has already won.",
        keyPoints: [
          "Authority in Christ",
          "Resisting the enemy",
          "Spiritual protection",
          "Maintaining victory"
        ]
      }
    ]
  },

  // DIV109 - Kingdom Authority and Power
  DIV109: {
    courseCode: "DIV109",
    courseTitle: "Kingdom Authority and Power",
    slides: [
      {
        title: "Kingdom Authority and Power",
        subtitle: "Explore the Authority Believers Have in Christ",
        content: "Understand the authority believers have in Christ and how to exercise kingdom power effectively.",
        keyPoints: [
          "The nature of kingdom authority",
          "Christ's authority delegated to believers",
          "Signs and wonders as kingdom demonstration",
          "Exercising authority with wisdom"
        ]
      },
      {
        title: "Kingdom Power",
        subtitle: "The Dunamis of God",
        content: "Explore the power of God available to believers for ministry and transformation.",
        keyPoints: [
          "Power in the Holy Spirit",
          "Miracles and healings",
          "Deliverance and freedom",
          "Transformation and renewal"
        ]
      },
      {
        title: "Practical Authority",
        subtitle: "Using Your Authority in Ministry",
        content: "Learn how to exercise spiritual authority in practical ministry situations.",
        keyPoints: [
          "Authority over sickness",
          "Authority over demonic forces",
          "Authority in prayer and intercession",
          "Authority in leadership and governance"
        ]
      }
    ]
  },

  // DIV110 - Prophetic Activation and Development
  DIV110: {
    courseCode: "DIV110",
    courseTitle: "Prophetic Activation and Development",
    slides: [
      {
        title: "Prophetic Activation and Development",
        subtitle: "Developing and Activating Your Prophetic Gift",
        content: "Learn to activate and develop your prophetic gifting for greater effectiveness in ministry.",
        keyPoints: [
          "Prophetic activation methods",
          "Developing spiritual sensitivity",
          "Prophetic training and practice",
          "Accountability and maturity"
        ]
      },
      {
        title: "Activation Practices",
        subtitle: "Exercises for Prophetic Development",
        content: "Practical exercises and methods for activating and strengthening prophetic gifting.",
        keyPoints: [
          "Listening prayer",
          "Prophetic journaling",
          "Corporate prophetic exercises",
          "Mentoring and feedback"
        ]
      },
      {
        title: "Prophetic Maturity",
        subtitle: "Growing in Prophetic Accuracy",
        content: "Develop maturity and accuracy in prophetic ministry.",
        keyPoints: [
          "Testing prophetic words",
          "Humility and accountability",
          "Avoiding pitfalls",
          "Prophetic integrity"
        ]
      }
    ]
  }
};

/**
 * Get slideshow for a specific course
 */
export function getCourseSlideshow(courseCode: string): CourseSlideshow | undefined {
  return courseSlideshows[courseCode];
}

/**
 * Get all course codes with slideshows
 */
export function getAllCourseCodesWithSlideshows(): string[] {
  return Object.keys(courseSlideshows);
}
