export type CourseSlideshow = {
  courseCode: string;
  title: string;
  audioPath: string;
  slides: Array<{
    id: string;
    title: string;
    subtitle: string;
    content: string;
    duration: number;
    gradient: string;
  }>;
};

export const courseIntroSlideshows: Record<string, CourseSlideshow> = {
  DIV101: {
    courseCode: 'DIV101',
    title: 'Understanding Prophecy',
    audioPath: '/audio/understanding-prophecy-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Understanding Prophecy',
        subtitle: 'Exploring the Gift and Office of Prophecy',
        content: 'Learn about the biblical foundation of prophecy and its vital role in the believer\'s life',
        duration: 8,
        gradient: 'from-purple-600 to-indigo-600'
      },
      {
        id: 'slide-2',
        title: 'Key Topics Covered',
        subtitle: 'What You\'ll Learn',
        content: 'Biblical foundation of prophecy • The prophetic gift and office • Discerning true vs false prophecy • Prophecy in the church today • Practical prophetic ministry guidelines',
        duration: 10,
        gradient: 'from-indigo-600 to-blue-600'
      },
      {
        id: 'slide-3',
        title: 'Learning Outcomes',
        subtitle: 'By Course Completion',
        content: 'Articulate a biblical theology of prophecy • Develop spiritual discernment • Understand prophetic gift operation • Learn practical ministry guidelines • Cultivate listening to God\'s voice',
        duration: 10,
        gradient: 'from-blue-600 to-cyan-600'
      },
      {
        id: 'slide-4',
        title: 'Who Should Take This Course',
        subtitle: 'Ideal For',
        content: 'Pastors and ministry leaders • Prophetic ministers • Believers exploring prophetic calling • Those seeking to deepen spiritual discernment • Church leaders evaluating prophetic words',
        duration: 8,
        gradient: 'from-cyan-600 to-teal-600'
      },
      {
        id: 'slide-5',
        title: 'Begin Your Journey',
        subtitle: 'Enroll Today',
        content: 'Gain theological depth and practical wisdom for understanding and operating in prophetic gifts',
        duration: 6,
        gradient: 'from-teal-600 to-green-600'
      }
    ]
  },
  BIB101: {
    courseCode: 'BIB101',
    title: 'Old Testament Survey',
    audioPath: '/audio/old-testament-survey-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Old Testament Survey',
        subtitle: 'Exploring God\'s Covenant History',
        content: 'In-depth exploration of the Old Testament examining historical, literary, and theological dimensions',
        duration: 8,
        gradient: 'from-amber-600 to-orange-600'
      },
      {
        id: 'slide-2',
        title: 'Course Content',
        subtitle: 'What You\'ll Study',
        content: 'Pentateuch and foundational covenants • Historical books and narratives • Wisdom literature and psalms • Major and minor prophets • Old Testament theology and fulfillment',
        duration: 10,
        gradient: 'from-orange-600 to-red-600'
      },
      {
        id: 'slide-3',
        title: 'Learning Outcomes',
        subtitle: 'Skills You\'ll Develop',
        content: 'Comprehensive Old Testament knowledge • Responsible biblical interpretation • Understanding major theological themes • Connecting Old Testament to New Testament • Teaching Scripture with clarity',
        duration: 10,
        gradient: 'from-red-600 to-rose-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal Students',
        subtitle: 'Who Should Enroll',
        content: 'Pastors and Bible teachers • Seminary students • Ministry leaders • Bible study leaders • Anyone deepening biblical knowledge',
        duration: 8,
        gradient: 'from-rose-600 to-pink-600'
      },
      {
        id: 'slide-5',
        title: 'Foundation for Faith',
        subtitle: 'Begin Today',
        content: 'Develop a deeper understanding of God\'s redemptive history and the foundation of Christian faith',
        duration: 6,
        gradient: 'from-pink-600 to-fuchsia-600'
      }
    ]
  },
  BIB102: {
    courseCode: 'BIB102',
    title: 'New Testament Survey',
    audioPath: '/audio/BIB102-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'New Testament Survey',
        subtitle: 'Jesus, the Church, and Christian Theology',
        content: 'Thorough exploration of the New Testament examining the life of Jesus and the apostolic church',
        duration: 8,
        gradient: 'from-blue-600 to-sky-600'
      },
      {
        id: 'slide-2',
        title: 'Course Topics',
        subtitle: 'What You\'ll Explore',
        content: 'The four Gospels and Jesus\'s life • Acts and the early church • Paul\'s epistles and theology • Hebrews, James, and Revelation • Major theological themes',
        duration: 10,
        gradient: 'from-sky-600 to-cyan-600'
      },
      {
        id: 'slide-3',
        title: 'Course Outcomes',
        subtitle: 'What You\'ll Achieve',
        content: 'Comprehensive New Testament knowledge • Advanced biblical interpretation skills • Understanding theological development • Connecting prophecy to fulfillment • Teaching with clarity and insight',
        duration: 10,
        gradient: 'from-cyan-600 to-teal-600'
      },
      {
        id: 'slide-4',
        title: 'Perfect For',
        subtitle: 'Ideal Students',
        content: 'Pastors and Bible teachers • Seminary students • Ministry leaders • Bible study facilitators • Serious Scripture students',
        duration: 8,
        gradient: 'from-teal-600 to-emerald-600'
      },
      {
        id: 'slide-5',
        title: 'Discover the Foundation',
        subtitle: 'Enroll Now',
        content: 'Deepen your appreciation for Jesus\'s life, teachings, and the apostolic church',
        duration: 6,
        gradient: 'from-emerald-600 to-green-600'
      }
    ]
  },
  CHR101: {
    courseCode: 'CHR101',
    title: 'Christian Ethics',
    audioPath: '/audio/CHR101-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Christian Ethics',
        subtitle: 'Living with Integrity and Wisdom',
        content: 'Practical application of Christian principles to ethical decision-making and moral living',
        duration: 8,
        gradient: 'from-green-600 to-emerald-600'
      },
      {
        id: 'slide-2',
        title: 'Topics Covered',
        subtitle: 'Essential Content',
        content: 'Biblical foundations for ethics • Christian moral theology • Ethical decision-making frameworks • Contemporary ethical challenges • Christian values in secular contexts',
        duration: 10,
        gradient: 'from-emerald-600 to-teal-600'
      },
      {
        id: 'slide-3',
        title: 'Learning Goals',
        subtitle: 'By Completion',
        content: 'Articulate biblical ethics foundation • Analyze ethical dilemmas • Apply Christian principles • Develop moral discernment • Guide others ethically',
        duration: 10,
        gradient: 'from-teal-600 to-cyan-600'
      },
      {
        id: 'slide-4',
        title: 'Who Should Enroll',
        subtitle: 'Ideal Candidates',
        content: 'Pastors and counselors • Educators and business leaders • Healthcare professionals • Anyone facing ethical challenges • Leadership positions',
        duration: 8,
        gradient: 'from-cyan-600 to-blue-600'
      },
      {
        id: 'slide-5',
        title: 'Live with Purpose',
        subtitle: 'Start Your Journey',
        content: 'Develop greater integrity and wisdom in all areas of life and ministry',
        duration: 6,
        gradient: 'from-blue-600 to-indigo-600'
      }
    ]
  },
  DIV102: {
    courseCode: 'DIV102',
    title: 'Prayer and Intercession',
    audioPath: '/audio/DIV102-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Prayer and Intercession',
        subtitle: 'Spiritual Disciplines for Transformation',
        content: 'Explore the spiritual disciplines of prayer and intercessory prayer as essential Christian practices',
        duration: 8,
        gradient: 'from-purple-600 to-violet-600'
      },
      {
        id: 'slide-2',
        title: 'What You\'ll Learn',
        subtitle: 'Course Content',
        content: 'Biblical foundations of prayer • Types of prayer and practices • Prayer models and disciplines • Role of the Holy Spirit • Overcoming prayer obstacles',
        duration: 10,
        gradient: 'from-violet-600 to-purple-600'
      },
      {
        id: 'slide-3',
        title: 'Outcomes',
        subtitle: 'Your Growth',
        content: 'Pray with greater faith and effectiveness • Understand intercessory prayer power • Develop consistent prayer discipline • Experience God\'s presence • Lead others in prayer',
        duration: 10,
        gradient: 'from-purple-600 to-fuchsia-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal For',
        subtitle: 'Who Should Take It',
        content: 'Prayer leaders and intercessors • Pastors and ministry leaders • Anyone deepening prayer life • Those called to intercession • Believers seeking intimacy with God',
        duration: 8,
        gradient: 'from-fuchsia-600 to-pink-600'
      },
      {
        id: 'slide-5',
        title: 'Transform Your Prayer',
        subtitle: 'Begin Today',
        content: 'Experience the power and purpose of prayer in your spiritual journey',
        duration: 6,
        gradient: 'from-pink-600 to-rose-600'
      }
    ]
  },
  DIV103: {
    courseCode: 'DIV103',
    title: 'Spiritual Warfare',
    audioPath: '/audio/DIV103-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Spiritual Warfare',
        subtitle: 'Victory in Christ',
        content: 'Biblical reality of spiritual warfare and practical tools for spiritual victory',
        duration: 8,
        gradient: 'from-red-600 to-rose-600'
      },
      {
        id: 'slide-2',
        title: 'Course Topics',
        subtitle: 'Essential Content',
        content: 'Biblical foundation of spiritual warfare • Nature of demonic forces • The armor of God • Prayer as spiritual weapon • Authority in Christ',
        duration: 10,
        gradient: 'from-rose-600 to-pink-600'
      },
      {
        id: 'slide-3',
        title: 'What You\'ll Gain',
        subtitle: 'Learning Outcomes',
        content: 'Understand spiritual opposition • Recognize demonic tactics • Use God\'s armor effectively • Stand firm in faith • Help others find freedom',
        duration: 10,
        gradient: 'from-pink-600 to-fuchsia-600'
      },
      {
        id: 'slide-4',
        title: 'Perfect For',
        subtitle: 'Ideal Students',
        content: 'Pastors and intercessors • Deliverance ministers • Anyone facing spiritual opposition • Ministry leaders • Believers seeking spiritual victory',
        duration: 8,
        gradient: 'from-fuchsia-600 to-purple-600'
      },
      {
        id: 'slide-5',
        title: 'Claim Your Victory',
        subtitle: 'Enroll Now',
        content: 'Grow in confidence in Christ\'s authority and power over all spiritual forces',
        duration: 6,
        gradient: 'from-purple-600 to-indigo-600'
      }
    ]
  },
  DIV104: {
    courseCode: 'DIV104',
    title: 'Evangelism and Discipleship',
    audioPath: '/audio/DIV104-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Evangelism and Discipleship',
        subtitle: 'Reaching and Developing Disciples',
        content: 'Biblical mandate to share the gospel and make disciples of all nations',
        duration: 8,
        gradient: 'from-orange-600 to-amber-600'
      },
      {
        id: 'slide-2',
        title: 'Key Topics',
        subtitle: 'What You\'ll Study',
        content: 'Great Commission foundation • Evangelism strategies • Sharing your faith • Discipleship principles • Creating discipleship culture',
        duration: 10,
        gradient: 'from-amber-600 to-yellow-600'
      },
      {
        id: 'slide-3',
        title: 'Your Growth',
        subtitle: 'Learning Outcomes',
        content: 'Share faith effectively • Disciple new believers • Develop small group leaders • Create discipleship strategies • Reach the lost',
        duration: 10,
        gradient: 'from-yellow-600 to-lime-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal Students',
        subtitle: 'Who Should Enroll',
        content: 'Pastors and evangelists • Small group leaders • Ministry leaders • Missionaries • Any believer wanting to share faith',
        duration: 8,
        gradient: 'from-lime-600 to-green-600'
      },
      {
        id: 'slide-5',
        title: 'Make Disciples',
        subtitle: 'Start Today',
        content: 'Gain passion for reaching the lost and developing mature disciples of Jesus',
        duration: 6,
        gradient: 'from-green-600 to-emerald-600'
      }
    ]
  },
  DIV105: {
    courseCode: 'DIV105',
    title: 'Leadership Principles',
    audioPath: '/audio/DIV105-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Leadership Principles',
        subtitle: 'Leading with Integrity and Wisdom',
        content: 'Biblical principles for effective leadership in ministry and organizational contexts',
        duration: 8,
        gradient: 'from-indigo-600 to-blue-600'
      },
      {
        id: 'slide-2',
        title: 'Course Content',
        subtitle: 'What You\'ll Learn',
        content: 'Biblical leadership models • Servant leadership • Character development • Vision casting • Team building and delegation',
        duration: 10,
        gradient: 'from-blue-600 to-sky-600'
      },
      {
        id: 'slide-3',
        title: 'Outcomes',
        subtitle: 'Your Development',
        content: 'Lead with integrity and wisdom • Cast compelling vision • Build effective teams • Develop future leaders • Create healthy cultures',
        duration: 10,
        gradient: 'from-sky-600 to-cyan-600'
      },
      {
        id: 'slide-4',
        title: 'Who Should Attend',
        subtitle: 'Ideal For',
        content: 'Pastors and ministry leaders • Organizational leaders • New leaders • Senior leaders • Anyone in leadership position',
        duration: 8,
        gradient: 'from-cyan-600 to-teal-600'
      },
      {
        id: 'slide-5',
        title: 'Transform Your Leadership',
        subtitle: 'Enroll Today',
        content: 'Develop greater capacity to lead organizations and ministries with biblical values',
        duration: 6,
        gradient: 'from-teal-600 to-emerald-600'
      }
    ]
  },
  DIV106: {
    courseCode: 'DIV106',
    title: 'The Fivefold Ministry',
    audioPath: '/audio/DIV106-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'The Fivefold Ministry',
        subtitle: 'Apostles, Prophets, Evangelists, Pastors, Teachers',
        content: 'Understanding the five ministry offices and how they work together in the church',
        duration: 8,
        gradient: 'from-rose-600 to-pink-600'
      },
      {
        id: 'slide-2',
        title: 'The Five Offices',
        subtitle: 'What You\'ll Study',
        content: 'Apostolic ministry • Prophetic ministry • Evangelistic ministry • Pastoral ministry • Teaching ministry',
        duration: 10,
        gradient: 'from-pink-600 to-fuchsia-600'
      },
      {
        id: 'slide-3',
        title: 'Learning Goals',
        subtitle: 'By Course End',
        content: 'Understand each office function • Identify your calling • Appreciate ministry diversity • Develop fivefold leaders • Create balanced teams',
        duration: 10,
        gradient: 'from-fuchsia-600 to-purple-600'
      },
      {
        id: 'slide-4',
        title: 'Perfect For',
        subtitle: 'Ideal Students',
        content: 'Pastors and ministry leaders • Those exploring calling • Church leaders • Anyone seeking ministry clarity • Leadership teams',
        duration: 8,
        gradient: 'from-purple-600 to-violet-600'
      },
      {
        id: 'slide-5',
        title: 'Discover Your Calling',
        subtitle: 'Begin Now',
        content: 'Gain clarity about your ministry calling and role in God\'s plan for the church',
        duration: 6,
        gradient: 'from-violet-600 to-indigo-600'
      }
    ]
  },
  DIV107: {
    courseCode: 'DIV107',
    title: 'Church Administration',
    audioPath: '/audio/DIV107-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Church Administration',
        subtitle: 'Managing Ministry Effectively',
        content: 'Practical aspects of managing a church or ministry organization',
        duration: 8,
        gradient: 'from-slate-600 to-gray-600'
      },
      {
        id: 'slide-2',
        title: 'Topics Covered',
        subtitle: 'Essential Skills',
        content: 'Financial management • Volunteer coordination • Facility management • Administrative systems • Communication and compliance',
        duration: 10,
        gradient: 'from-gray-600 to-zinc-600'
      },
      {
        id: 'slide-3',
        title: 'What You\'ll Achieve',
        subtitle: 'Learning Outcomes',
        content: 'Develop administrative systems • Manage finances effectively • Coordinate volunteers • Support ministry mission • Use technology wisely',
        duration: 10,
        gradient: 'from-zinc-600 to-stone-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal For',
        subtitle: 'Who Should Enroll',
        content: 'Church administrators • Pastors • Finance committee members • Office managers • Anyone in church management',
        duration: 8,
        gradient: 'from-stone-600 to-neutral-600'
      },
      {
        id: 'slide-5',
        title: 'Strengthen Your Ministry',
        subtitle: 'Start Today',
        content: 'Create efficient systems that support your ministry\'s spiritual mission',
        duration: 6,
        gradient: 'from-neutral-600 to-slate-600'
      }
    ]
  },
  DIV108: {
    courseCode: 'DIV108',
    title: 'Understanding Prophecy (Advanced)',
    audioPath: '/audio/DIV108-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Understanding Prophecy Advanced',
        subtitle: 'Leading Prophetic Ministry',
        content: 'Advanced study of prophetic ministry with focus on accountability and integrity',
        duration: 8,
        gradient: 'from-purple-600 to-indigo-600'
      },
      {
        id: 'slide-2',
        title: 'Advanced Topics',
        subtitle: 'Course Content',
        content: 'Prophetic movements and history • Contemporary prophetic challenges • Prophetic protocols • Testing prophetic words • Accountability structures',
        duration: 10,
        gradient: 'from-indigo-600 to-blue-600'
      },
      {
        id: 'slide-3',
        title: 'Your Development',
        subtitle: 'Learning Outcomes',
        content: 'Lead prophetic ministry wisely • Test and evaluate words • Establish accountability • Mentor prophetic people • Create healthy culture',
        duration: 10,
        gradient: 'from-blue-600 to-cyan-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal Students',
        subtitle: 'Who Should Take It',
        content: 'Prophetic ministers • Pastors overseeing prophecy • Senior leaders • Those developing prophetic teams • Ministry leaders',
        duration: 8,
        gradient: 'from-cyan-600 to-teal-600'
      },
      {
        id: 'slide-5',
        title: 'Lead with Wisdom',
        subtitle: 'Enroll Today',
        content: 'Develop advanced skills for leading prophetic ministry with integrity and accountability',
        duration: 6,
        gradient: 'from-teal-600 to-green-600'
      }
    ]
  },
  DIV109: {
    courseCode: 'DIV109',
    title: 'The Fivefold Ministry (Advanced)',
    audioPath: '/audio/DIV109-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Fivefold Ministry Advanced',
        subtitle: 'Building Balanced Leadership Teams',
        content: 'Deep study of how the five offices work together in leadership and organizational structures',
        duration: 8,
        gradient: 'from-rose-600 to-pink-600'
      },
      {
        id: 'slide-2',
        title: 'Advanced Content',
        subtitle: 'What You\'ll Study',
        content: 'Office strengths and weaknesses • Team dynamics • Conflict resolution • Organizational structures • Developing fivefold leaders',
        duration: 10,
        gradient: 'from-pink-600 to-fuchsia-600'
      },
      {
        id: 'slide-3',
        title: 'Outcomes',
        subtitle: 'Your Growth',
        content: 'Build balanced teams • Understand office dynamics • Resolve conflicts • Create supporting structures • Lead diverse teams',
        duration: 10,
        gradient: 'from-fuchsia-600 to-purple-600'
      },
      {
        id: 'slide-4',
        title: 'Perfect For',
        subtitle: 'Ideal Candidates',
        content: 'Senior pastors • Executive pastors • Leadership teams • Those building teams • Senior leaders',
        duration: 8,
        gradient: 'from-purple-600 to-violet-600'
      },
      {
        id: 'slide-5',
        title: 'Build Stronger Teams',
        subtitle: 'Start Now',
        content: 'Develop balanced, effective teams that honor all five ministry offices',
        duration: 6,
        gradient: 'from-violet-600 to-indigo-600'
      }
    ]
  },
  DIV110: {
    courseCode: 'DIV110',
    title: 'Deliverance Ministry',
    audioPath: '/audio/DIV110-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Deliverance Ministry',
        subtitle: 'Freedom in Christ',
        content: 'Biblical basis for deliverance ministry and practical tools for spiritual freedom',
        duration: 8,
        gradient: 'from-red-600 to-rose-600'
      },
      {
        id: 'slide-2',
        title: 'Course Topics',
        subtitle: 'What You\'ll Learn',
        content: 'Biblical foundation • Demonic influence and oppression • Identifying demonic activity • Deliverance principles • Maintaining freedom',
        duration: 10,
        gradient: 'from-rose-600 to-pink-600'
      },
      {
        id: 'slide-3',
        title: 'Learning Goals',
        subtitle: 'By Completion',
        content: 'Understand deliverance ministry • Identify demonic influence • Minister effectively • Help people find freedom • Establish protocols',
        duration: 10,
        gradient: 'from-pink-600 to-fuchsia-600'
      },
      {
        id: 'slide-4',
        title: 'Who Should Enroll',
        subtitle: 'Ideal Students',
        content: 'Pastors and counselors • Deliverance ministers • Those helping others • Ministry leaders • Anyone encountering spiritual bondage',
        duration: 8,
        gradient: 'from-fuchsia-600 to-purple-600'
      },
      {
        id: 'slide-5',
        title: 'Set People Free',
        subtitle: 'Begin Today',
        content: 'Help others experience lasting freedom from demonic bondage and oppression',
        duration: 6,
        gradient: 'from-purple-600 to-indigo-600'
      }
    ]
  },
  BIB103: {
    courseCode: 'BIB103',
    title: 'Biblical Hermeneutics',
    audioPath: '/audio/BIB103-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Biblical Hermeneutics',
        subtitle: 'Interpreting Scripture Accurately',
        content: 'Principles and methods of biblical interpretation for studying Scripture effectively',
        duration: 8,
        gradient: 'from-amber-600 to-orange-600'
      },
      {
        id: 'slide-2',
        title: 'Topics Covered',
        subtitle: 'Essential Content',
        content: 'Hermeneutical principles • Literary genres • Contextual interpretation • Avoiding interpretive errors • Applying biblical truth',
        duration: 10,
        gradient: 'from-orange-600 to-red-600'
      },
      {
        id: 'slide-3',
        title: 'Your Growth',
        subtitle: 'Learning Outcomes',
        content: 'Interpret Scripture accurately • Work with different genres • Apply biblical truth • Study Scripture deeply • Teach others effectively',
        duration: 10,
        gradient: 'from-red-600 to-rose-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal For',
        subtitle: 'Who Should Take It',
        content: 'Pastors and Bible teachers • Seminary students • Bible study leaders • Serious Scripture students • Anyone deepening biblical knowledge',
        duration: 8,
        gradient: 'from-rose-600 to-pink-600'
      },
      {
        id: 'slide-5',
        title: 'Master Scripture Study',
        subtitle: 'Enroll Now',
        content: 'Develop essential skills for interpreting Scripture with accuracy and depth',
        duration: 6,
        gradient: 'from-pink-600 to-fuchsia-600'
      }
    ]
  },
  BIB104: {
    courseCode: 'BIB104',
    title: 'Systematic Theology',
    audioPath: '/audio/BIB104-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Systematic Theology',
        subtitle: 'Understanding Christian Doctrine',
        content: 'Comprehensive study of Christian doctrine organized around major theological themes',
        duration: 8,
        gradient: 'from-blue-600 to-sky-600'
      },
      {
        id: 'slide-2',
        title: 'Doctrinal Areas',
        subtitle: 'What You\'ll Study',
        content: 'God\'s nature and attributes • Christology • Pneumatology • Soteriology • Ecclesiology • Eschatology',
        duration: 10,
        gradient: 'from-sky-600 to-cyan-600'
      },
      {
        id: 'slide-3',
        title: 'Your Development',
        subtitle: 'Learning Outcomes',
        content: 'Articulate Christian doctrines • Develop theological framework • Understand doctrine relationships • Teach doctrine clearly • Address theological questions',
        duration: 10,
        gradient: 'from-cyan-600 to-teal-600'
      },
      {
        id: 'slide-4',
        title: 'Perfect For',
        subtitle: 'Ideal Students',
        content: 'Pastors and Bible teachers • Seminary students • Theology students • Ministry leaders • Serious theology students',
        duration: 8,
        gradient: 'from-teal-600 to-emerald-600'
      },
      {
        id: 'slide-5',
        title: 'Build Your Theology',
        subtitle: 'Start Today',
        content: 'Develop mature theological understanding grounded in Scripture and Christian tradition',
        duration: 6,
        gradient: 'from-emerald-600 to-green-600'
      }
    ]
  },
  CHR102: {
    courseCode: 'CHR102',
    title: 'Church History',
    audioPath: '/audio/CHR102-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Church History',
        subtitle: 'From Apostles to Present',
        content: 'History of the Christian church from apostolic times to the present day',
        duration: 8,
        gradient: 'from-green-600 to-emerald-600'
      },
      {
        id: 'slide-2',
        title: 'Historical Periods',
        subtitle: 'What You\'ll Explore',
        content: 'Apostolic church • Early church and persecution • Medieval church • Reformation • Modern and contemporary Christianity',
        duration: 10,
        gradient: 'from-emerald-600 to-teal-600'
      },
      {
        id: 'slide-3',
        title: 'Learning Goals',
        subtitle: 'By Course End',
        content: 'Know major historical periods • Understand theological development • Learn from history • Apply insights to ministry • Appreciate Christian tradition',
        duration: 10,
        gradient: 'from-teal-600 to-cyan-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal Students',
        subtitle: 'Who Should Enroll',
        content: 'Pastors and Bible teachers • Seminary students • History students • Ministry leaders • Anyone interested in church history',
        duration: 8,
        gradient: 'from-cyan-600 to-blue-600'
      },
      {
        id: 'slide-5',
        title: 'Understand Your Heritage',
        subtitle: 'Begin Now',
        content: 'Develop deeper understanding of how Christianity developed through history',
        duration: 6,
        gradient: 'from-blue-600 to-indigo-600'
      }
    ]
  },
  CHR103: {
    courseCode: 'CHR103',
    title: 'Comparative Religion',
    audioPath: '/audio/CHR103-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Comparative Religion',
        subtitle: 'Understanding World Faiths',
        content: 'Study of major world religions and how Christianity relates to other faith traditions',
        duration: 8,
        gradient: 'from-purple-600 to-violet-600'
      },
      {
        id: 'slide-2',
        title: 'Religions Studied',
        subtitle: 'Course Content',
        content: 'Islam • Judaism • Buddhism • Hinduism • Other major world religions',
        duration: 10,
        gradient: 'from-violet-600 to-purple-600'
      },
      {
        id: 'slide-3',
        title: 'Your Growth',
        subtitle: 'Learning Outcomes',
        content: 'Understand world religions • Engage respectfully with others • Share Christian faith • Address theological differences • Appreciate diversity',
        duration: 10,
        gradient: 'from-purple-600 to-fuchsia-600'
      },
      {
        id: 'slide-4',
        title: 'Perfect For',
        subtitle: 'Ideal Candidates',
        content: 'Pastors and missionaries • Interfaith dialogue leaders • Ministry leaders • Anyone in diverse communities • Theology students',
        duration: 8,
        gradient: 'from-fuchsia-600 to-pink-600'
      },
      {
        id: 'slide-5',
        title: 'Engage with Respect',
        subtitle: 'Enroll Today',
        content: 'Develop understanding of world religions and engage respectfully with people of different faiths',
        duration: 6,
        gradient: 'from-pink-600 to-rose-600'
      }
    ]
  },
  MIN101: {
    courseCode: 'MIN101',
    title: 'Pastoral Care',
    audioPath: '/audio/MIN101-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Pastoral Care',
        subtitle: 'Caring for People in Crisis',
        content: 'Biblical foundations and practical skills for pastoral care and counseling',
        duration: 8,
        gradient: 'from-teal-600 to-cyan-600'
      },
      {
        id: 'slide-2',
        title: 'Topics Covered',
        subtitle: 'Essential Content',
        content: 'Pastoral care foundations • Counseling skills • Crisis and grief care • Prayer and Scripture • Boundaries and self-care',
        duration: 10,
        gradient: 'from-cyan-600 to-sky-600'
      },
      {
        id: 'slide-3',
        title: 'Your Development',
        subtitle: 'Learning Outcomes',
        content: 'Develop compassionate presence • Listen effectively • Provide crisis care • Counsel with wisdom • Establish care systems',
        duration: 10,
        gradient: 'from-sky-600 to-blue-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal For',
        subtitle: 'Who Should Take It',
        content: 'Pastors and chaplains • Counselors • Caregivers • Ministry leaders • Anyone in pastoral care role',
        duration: 8,
        gradient: 'from-blue-600 to-indigo-600'
      },
      {
        id: 'slide-5',
        title: 'Care with Compassion',
        subtitle: 'Start Today',
        content: 'Develop skills to provide compassionate, effective pastoral care to those in need',
        duration: 6,
        gradient: 'from-indigo-600 to-purple-600'
      }
    ]
  },
  MIN102: {
    courseCode: 'MIN102',
    title: 'Homiletics',
    audioPath: '/audio/MIN102-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Homiletics',
        subtitle: 'The Art of Preaching',
        content: 'Art and science of sermon preparation and delivery for powerful preaching',
        duration: 8,
        gradient: 'from-orange-600 to-amber-600'
      },
      {
        id: 'slide-2',
        title: 'Course Topics',
        subtitle: 'What You\'ll Learn',
        content: 'Sermon structure and organization • Outline development • Using illustrations • Delivery and presence • Different sermon types',
        duration: 10,
        gradient: 'from-amber-600 to-yellow-600'
      },
      {
        id: 'slide-3',
        title: 'Your Growth',
        subtitle: 'Learning Outcomes',
        content: 'Develop well-structured sermons • Organize biblical material • Use stories effectively • Deliver with power • Impact your congregation',
        duration: 10,
        gradient: 'from-yellow-600 to-lime-600'
      },
      {
        id: 'slide-4',
        title: 'Perfect For',
        subtitle: 'Ideal Students',
        content: 'Pastors and preachers • New preachers • Experienced preachers • Ministry leaders • Anyone in preaching ministry',
        duration: 8,
        gradient: 'from-lime-600 to-green-600'
      },
      {
        id: 'slide-5',
        title: 'Preach with Power',
        subtitle: 'Enroll Now',
        content: 'Develop practical skills for preparing and delivering powerful, engaging sermons',
        duration: 6,
        gradient: 'from-green-600 to-emerald-600'
      }
    ]
  },
  MIN103: {
    courseCode: 'MIN103',
    title: 'Worship and Liturgy',
    audioPath: '/audio/MIN103-intro.wav',
    slides: [
      {
        id: 'slide-1',
        title: 'Worship and Liturgy',
        subtitle: 'Leading Meaningful Worship',
        content: 'Worship practices and liturgical traditions for leading worship that honors God',
        duration: 8,
        gradient: 'from-rose-600 to-pink-600'
      },
      {
        id: 'slide-2',
        title: 'Topics Covered',
        subtitle: 'Essential Content',
        content: 'Theology of worship • Worship traditions and styles • Planning worship services • Music in worship • Liturgical elements',
        duration: 10,
        gradient: 'from-pink-600 to-fuchsia-600'
      },
      {
        id: 'slide-3',
        title: 'Your Development',
        subtitle: 'Learning Outcomes',
        content: 'Understand worship theology • Plan meaningful services • Lead worship authentically • Engage your congregation • Create worship environments',
        duration: 10,
        gradient: 'from-fuchsia-600 to-purple-600'
      },
      {
        id: 'slide-4',
        title: 'Ideal For',
        subtitle: 'Who Should Enroll',
        content: 'Worship leaders • Pastors • Musicians • Worship teams • Anyone in worship ministry',
        duration: 8,
        gradient: 'from-purple-600 to-violet-600'
      },
      {
        id: 'slide-5',
        title: 'Lead Worship Well',
        subtitle: 'Begin Today',
        content: 'Develop skills to lead worship that honors God and engages your congregation spiritually',
        duration: 6,
        gradient: 'from-violet-600 to-indigo-600'
      }
    ]
  }
};
