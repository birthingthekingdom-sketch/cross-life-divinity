import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { courses, lessons } from "../drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const db = drizzle(DATABASE_URL);

const gedCourses = [
  {
    code: "GED-MATH",
    title: "Mathematical Reasoning",
    description:
      "Master mathematical concepts and problem-solving skills required for the GED Mathematical Reasoning exam. This course covers algebra, geometry, statistics, and data analysis.",
    colorTheme: "#3b82f6",
    cpd_hours: 15,
  },
  {
    code: "GED-LANG",
    title: "Reasoning Through Language Arts",
    description:
      "Develop reading comprehension, writing, and grammar skills for the GED Language Arts exam. Learn to analyze texts, write persuasive essays, and master grammar rules.",
    colorTheme: "#8b5cf6",
    cpd_hours: 15,
  },
  {
    code: "GED-SCI",
    title: "Science",
    description:
      "Explore life science, physical science, and earth science concepts tested on the GED Science exam. Understand scientific processes, data interpretation, and real-world applications.",
    colorTheme: "#10b981",
    cpd_hours: 15,
  },
  {
    code: "GED-SOCIAL",
    title: "Social Studies",
    description:
      "Study U.S. history, civics, economics, and geography for the GED Social Studies exam. Analyze historical documents, understand government systems, and interpret maps and charts.",
    colorTheme: "#f59e0b",
    cpd_hours: 15,
  },
];

const lessonsByCode: Record<string, Array<{ title: string; content: string }>> = {
  "GED-MATH": [
    {
      title: "Lesson 1: Number Systems and Operations",
      content:
        "This lesson covers fundamental number systems including integers, decimals, fractions, and percentages. Students will master basic arithmetic operations, order of operations (PEMDAS), and problem-solving strategies. Key topics include: understanding place value, performing calculations with positive and negative numbers, simplifying fractions, converting between decimals and percentages, and applying these concepts to real-world scenarios. The GED Mathematical Reasoning exam requires fluency with these foundational concepts as they form the basis for more complex algebraic and geometric problems. Students will practice identifying which operations to use in different contexts and develop estimation skills for checking answers.",
      videoUrl: "https://www.youtube.com/embed/kOWXtKvjHSE",
      readingMaterial: "GED Math Foundations Textbook, Chapter 1-2",
      scripture: "Proverbs 3:21 - Keep sound wisdom and discretion",
    },
    {
      title: "Lesson 2: Algebra and Equations",
      content:
        'This lesson introduces algebraic thinking and equation solving. Students will learn to work with variables, write expressions, solve linear equations, and apply algebraic reasoning to word problems. Topics include: translating words into mathematical expressions, solving one-step and multi-step equations, working with inequalities, graphing linear equations, and understanding slope and intercept. The GED exam frequently tests the ability to set up and solve equations from real-world contexts. Students will develop strategies for checking their solutions and learn to recognize common algebraic patterns. Emphasis is placed on understanding the "why" behind algebraic procedures, not just memorizing steps.',
      videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
      readingMaterial: "Algebra Essentials for GED, Chapter 3-4",
      scripture: "Philippians 4:8 - Think on these things",
    },
    {
      title: "Lesson 3: Geometry and Data Analysis",
      content:
        "This final mathematics lesson covers geometric concepts and statistical reasoning. Students will study properties of shapes, calculate area and volume, understand coordinate geometry, and interpret data through graphs and statistics. Topics include: identifying geometric shapes and their properties, calculating perimeter and area, understanding 3D shapes and volume, working with the Pythagorean theorem, interpreting scatter plots and line graphs, calculating mean, median, and mode, and understanding probability. The GED exam includes multiple questions on geometry and data interpretation. Students will learn to visualize spatial relationships, work with formulas, and make sense of data presented in various formats. Problem-solving in context remains a central focus.",
      videoUrl: "https://www.youtube.com/embed/krtQJSvxFEo",
      readingMaterial: "Geometry and Statistics for GED, Chapter 5-6",
      scripture: "Proverbs 15:22 - Plans fail for lack of counsel",
    },
  ],
  "GED-LANG": [
    {
      title: "Lesson 1: Reading Comprehension and Analysis",
      content:
        "This lesson develops critical reading skills essential for the GED Language Arts exam. Students will learn to identify main ideas, understand author's purpose, analyze arguments, and make inferences from texts. Key topics include: distinguishing fact from opinion, understanding text structure, recognizing tone and bias, analyzing cause and effect relationships, and evaluating evidence. The GED exam presents passages from literature, informational texts, and historical documents. Students will practice active reading strategies, annotation techniques, and question-answering approaches. Emphasis is placed on supporting answers with evidence from the text and understanding how authors construct meaning through word choice, structure, and rhetorical devices.",
      videoUrl: "https://www.youtube.com/embed/8Wy6eFV3vKg",
      readingMaterial: "Reading Comprehension Strategies, Chapter 1-2",
      scripture: "Proverbs 18:15 - The heart of the discerning acquires knowledge",
    },
    {
      title: "Lesson 2: Writing and Grammar",
      content:
        "This lesson covers the writing and grammar components of the GED Language Arts exam. Students will master sentence structure, grammar rules, punctuation, and writing conventions. Topics include: identifying and correcting sentence fragments and run-ons, understanding subject-verb agreement, using correct verb tenses, proper pronoun usage, punctuation rules, and capitalization. The GED exam tests both recognition of errors and the ability to edit passages. Students will learn common grammar mistakes, understand why certain constructions are incorrect, and develop proofreading skills. Additionally, students will learn to write clear, organized sentences that effectively communicate ideas. The focus is on practical application rather than memorizing grammar terminology.",
      videoUrl: "https://www.youtube.com/embed/Zd_wvnLWxA4",
      readingMaterial: "Grammar and Writing for GED, Chapter 3-4",
      scripture: "Proverbs 22:29 - Do you see someone skilled in their work",
    },
    {
      title: "Lesson 3: Essay Writing and Composition",
      content:
        "This lesson focuses on the extended response (essay) portion of the GED Language Arts exam. Students will learn to plan, organize, and write persuasive and explanatory essays. Topics include: understanding the prompt, organizing ideas with clear thesis statements, developing supporting paragraphs, using evidence effectively, and revising for clarity and impact. The GED essay requires students to read a passage and respond with a written argument. Students will practice brainstorming, outlining, drafting, and editing. They will learn to write introductions that hook readers, body paragraphs that support claims with evidence, and conclusions that reinforce main ideas. Emphasis is placed on clear communication, logical organization, and appropriate tone for academic writing.",
      videoUrl: "https://www.youtube.com/embed/VPcIqMezDDs",
      readingMaterial: "Essay Writing Mastery, Chapter 5-6",
      scripture: "Ephesians 4:29 - Let your conversation be always full of grace",
    },
  ],
  "GED-SCI": [
    {
      title: "Lesson 1: Life Science and Biology",
      content:
        "This lesson covers life science concepts tested on the GED Science exam. Students will study cell structure and function, genetics and heredity, evolution, ecology, and human body systems. Key topics include: understanding cell organelles and their functions, learning how organisms reproduce and pass traits, understanding natural selection and adaptation, studying ecosystems and food chains, and learning about major human body systems. The GED exam emphasizes understanding how living systems work and interact. Students will learn to interpret biological diagrams, understand cause-and-effect relationships in nature, and apply biological concepts to real-world scenarios like disease, nutrition, and environmental issues. Scientific literacy is the goal, not memorization of facts.",
      videoUrl: "https://www.youtube.com/embed/V4MF8sB8sSY",
      readingMaterial: "Life Science Fundamentals, Chapter 1-2",
      scripture: "Genesis 1:27 - So God created mankind in his own image",
    },
    {
      title: "Lesson 2: Physical Science and Chemistry",
      content:
        "This lesson covers physical science concepts including matter, energy, forces, and chemical reactions. Students will study properties of matter, states of matter, atomic structure, chemical bonding, energy transformation, motion, and forces. Topics include: understanding atoms and molecules, recognizing chemical reactions, understanding energy types and conservation, applying Newton's laws of motion, and understanding waves and sound. The GED exam tests the ability to understand how the physical world works. Students will learn to interpret scientific diagrams and data, understand cause-and-effect in physical systems, and apply physical science concepts to everyday phenomena. The focus is on conceptual understanding and application rather than complex calculations.",
      videoUrl: "https://www.youtube.com/embed/FVr0vXWxIIQ",
      readingMaterial: "Physical Science Essentials, Chapter 3-4",
      scripture: "Proverbs 8:11 - Wisdom is more precious than rubies",
    },
    {
      title: "Lesson 3: Earth Science and Scientific Reasoning",
      content:
        "This final science lesson covers earth science concepts and scientific reasoning skills. Students will study Earth's structure, weather and climate, astronomy, and the scientific method. Topics include: understanding plate tectonics and earthquakes, learning about weather patterns and climate change, studying the solar system and celestial objects, and applying the scientific method to analyze data. The GED exam includes questions requiring students to interpret scientific data, graphs, and experimental results. Students will learn to read and understand scientific diagrams, make predictions based on data, and evaluate scientific claims. Critical thinking and data interpretation are emphasized as students learn to think like scientists and evaluate information critically.",
      videoUrl: "https://www.youtube.com/embed/xme3Z_-cGrE",
      readingMaterial: "Earth Science and Data Analysis, Chapter 5-6",
      scripture: "Psalm 19:1 - The heavens declare the glory of God",
    },
  ],
  "GED-SOCIAL": [
    {
      title: "Lesson 1: U.S. History and Government",
      content:
        "This lesson covers U.S. history and government concepts essential for the GED Social Studies exam. Students will study colonial America through modern times, understanding major historical events, key figures, and their significance. Topics include: understanding the founding principles of the United States, studying the Constitution and Bill of Rights, learning about major historical periods and events, understanding the three branches of government, and recognizing how historical events shaped American society. The GED exam emphasizes understanding cause-and-effect relationships in history and recognizing how events connect. Students will learn to analyze primary and secondary sources, understand different perspectives on historical events, and recognize patterns in history. The focus is on developing historical thinking skills and understanding how past events influence the present.",
      videoUrl: "https://www.youtube.com/embed/sSh8kvHMhiM",
      readingMaterial: "U.S. History and Government, Chapter 1-2",
      scripture: "Romans 13:1 - Let everyone be subject to the governing authorities",
    },
    {
      title: "Lesson 2: Economics and Civics",
      content:
        "This lesson covers economics and civics concepts tested on the GED Social Studies exam. Students will study economic systems, supply and demand, personal finance, and civic responsibilities. Topics include: understanding basic economic principles, recognizing how markets work, learning about different economic systems, understanding personal finance and budgeting, and recognizing civic duties and rights. The GED exam includes questions about economic decision-making and understanding how economies function. Students will learn to interpret economic data and graphs, understand cause-and-effect in economic systems, and apply economic concepts to personal and national scenarios. Additionally, students will understand their roles and responsibilities as citizens and how government policies affect their lives.",
      videoUrl: "https://www.youtube.com/embed/3erN3x34Pzc",
      readingMaterial: "Economics and Civics Fundamentals, Chapter 3-4",
      scripture: "Proverbs 21:5 - The plans of the diligent lead to profit",
    },
    {
      title: "Lesson 3: Geography and Global Studies",
      content:
        "This final social studies lesson covers geography and global studies concepts. Students will study world geography, map reading, cultural diversity, and global issues. Topics include: understanding maps and geographic features, recognizing cultural regions and their characteristics, understanding how geography influences human societies, studying major world regions and their histories, and understanding contemporary global issues. The GED exam includes map questions and requires understanding how geography influences human activity. Students will learn to read various types of maps, understand geographic terminology, and recognize patterns in how geography shapes societies. The focus is on developing geographic literacy and understanding our interconnected world.",
      videoUrl: "https://www.youtube.com/embed/iNtIGR7bNYc",
      readingMaterial: "Geography and Global Studies, Chapter 5-6",
      scripture: "Acts 17:26 - From one man he made all the nations",
    },
  ],
};

async function populateBridgeAcademy() {
  try {
    console.log("Starting Bridge Academy GED population...");

    // Insert courses
    for (const course of gedCourses) {
      await db.insert(courses).values(course);
      console.log(`✓ Created course: ${course.code} - ${course.title}`);
    }

    // Fetch all courses to get their IDs
    const allCourses = await db.select().from(courses);

    // Create a map of course codes to IDs
    const courseMap: Record<string, number> = {};
    for (const course of allCourses) {
      courseMap[course.code] = course.id;
    }

    // Insert lessons for each course
    for (const [courseCode, lessonList] of Object.entries(lessonsByCode)) {
      const courseId = courseMap[courseCode];
      if (!courseId) {
        console.error(`Course ${courseCode} not found!`);
        continue;
      }

      for (let idx = 0; idx < lessonList.length; idx++) {
        const lesson = lessonList[idx];
        await db.insert(lessons).values({
          courseId,
          title: lesson.title,
          content: lesson.content,
          lessonOrder: idx + 1,
        });
        console.log(`  ✓ Created lesson: ${lesson.title}`);
      }
    }

    console.log("\n✅ Bridge Academy GED population complete!");
    console.log("Created:");
    console.log(
      "  - 4 GED courses (Math, Language Arts, Science, Social Studies)"
    );
    console.log("  - 12 comprehensive lessons (3 per course)");

    process.exit(0);
  } catch (error) {
    console.error("Error populating Bridge Academy:", error);
    process.exit(1);
  }
}

populateBridgeAcademy();
