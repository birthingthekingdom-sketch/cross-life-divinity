// Slideshow configurations for course introductions

export interface SlideshowConfig {
  courseCode: string;
  courseName: string;
  audioUrl: string;
  slides: Array<{
    id: number;
    title: string;
    content: string;
    bgColor: string;
  }>;
}

export const slideshowConfigs: Record<string, SlideshowConfig> = {
  'DIV101': {
    courseCode: 'DIV101',
    courseName: 'Understanding Prophecy',
    audioUrl: '/audio/understanding-prophecy-intro.wav',
    slides: [
      {
        id: 1,
        title: 'Course Overview',
        content: 'Explore the office and gift of prophecy, and its vital role in the life of a believer. This course examines the spiritual gift of receiving and communicating messages from God.',
        bgColor: 'bg-gradient-to-br from-purple-600 to-purple-800',
      },
      {
        id: 2,
        title: 'Key Topics Covered',
        content: 'Biblical foundation of prophecy, the nature of the prophetic gift, true versus false prophecy, the role of prophecy in the church today, and practical guidelines for prophetic ministry.',
        bgColor: 'bg-gradient-to-br from-indigo-600 to-indigo-800',
      },
      {
        id: 3,
        title: 'Learning Outcomes',
        content: 'Articulate a biblical theology of prophecy, discern genuine prophetic words, operate in the prophetic gift responsibly, and cultivate spiritual sensitivity to God\'s voice.',
        bgColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
      },
      {
        id: 4,
        title: 'Who Should Take This Course',
        content: 'Ideal for pastors, ministry leaders, prophetic ministers, and believers seeking to deepen their understanding of prophecy and grow in spiritual discernment.',
        bgColor: 'bg-gradient-to-br from-cyan-600 to-cyan-800',
      },
      {
        id: 5,
        title: 'Course Benefits',
        content: 'Gain biblical foundation for understanding prophecy, develop spiritual discernment, learn practical guidelines for prophetic ministry, and operate confidently in prophetic gifts.',
        bgColor: 'bg-gradient-to-br from-teal-600 to-teal-800',
      },
    ],
  },
  'BIB101': {
    courseCode: 'BIB101',
    courseName: 'Old Testament Survey',
    audioUrl: '/audio/old-testament-survey-intro.wav',
    slides: [
      {
        id: 1,
        title: 'Course Overview',
        content: 'Comprehensive exploration of the Old Testament, examining its historical, literary, and theological dimensions. Journey through the Pentateuch, Historical Books, Wisdom Literature, and Prophetic writings.',
        bgColor: 'bg-gradient-to-br from-amber-600 to-amber-800',
      },
      {
        id: 2,
        title: 'Key Topics Covered',
        content: 'Old Testament canon structure, Pentateuch and foundational covenants, Historical Books, Wisdom Literature, Major and Minor Prophets, and how Old Testament themes are fulfilled in the New Testament.',
        bgColor: 'bg-gradient-to-br from-orange-600 to-orange-800',
      },
      {
        id: 3,
        title: 'Learning Outcomes',
        content: 'Demonstrate comprehensive knowledge of Old Testament history and theology, interpret texts responsibly, understand major theological themes, and teach Old Testament content with clarity and accuracy.',
        bgColor: 'bg-gradient-to-br from-red-600 to-red-800',
      },
      {
        id: 4,
        title: 'Who Should Take This Course',
        content: 'Essential for pastors, Bible teachers, seminary students, and ministry leaders who need comprehensive understanding of the Old Testament and ability to teach Scripture effectively.',
        bgColor: 'bg-gradient-to-br from-rose-600 to-rose-800',
      },
      {
        id: 5,
        title: 'Course Benefits',
        content: 'Gain comprehensive understanding of Old Testament history and theology, develop advanced biblical interpretation skills, teach with confidence and accuracy, and apply ancient wisdom to contemporary ministry.',
        bgColor: 'bg-gradient-to-br from-pink-600 to-pink-800',
      },
    ],
  },
};

export const getSlideshowConfig = (courseCode: string): SlideshowConfig | undefined => {
  return slideshowConfigs[courseCode];
};
