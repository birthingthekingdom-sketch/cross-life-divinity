import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { bridgeAcademyPracticeQuestions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import * as db from "../server/db";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const database = drizzle(DATABASE_URL);

// Practice questions organized by topic and difficulty
const practiceQuestions = {
  "GED-MATH": {
    "Number Systems": [
      {
        difficulty: "easy",
        question: "What is 25% of 80?",
        questionType: "multiple_choice",
        options: JSON.stringify(["15", "20", "25", "30"]),
        correctAnswer: "20",
        explanation: "25% means 1/4. 80 ÷ 4 = 20",
        variationGroup: "percentage_basic",
      },
      {
        difficulty: "easy",
        question: "Convert 3/4 to a decimal",
        questionType: "multiple_choice",
        options: JSON.stringify(["0.34", "0.75", "0.43", "1.33"]),
        correctAnswer: "0.75",
        explanation: "3 ÷ 4 = 0.75",
        variationGroup: "fraction_to_decimal",
      },
      {
        difficulty: "medium",
        question: "What is 15% of 240?",
        questionType: "multiple_choice",
        options: JSON.stringify(["30", "36", "40", "45"]),
        correctAnswer: "36",
        explanation: "15% of 240 = 0.15 × 240 = 36",
        variationGroup: "percentage_intermediate",
      },
      {
        difficulty: "medium",
        question: "Express 0.625 as a fraction in lowest terms",
        questionType: "multiple_choice",
        options: JSON.stringify(["5/8", "6/10", "62/100", "625/1000"]),
        correctAnswer: "5/8",
        explanation: "0.625 = 625/1000 = 5/8 when reduced",
        variationGroup: "decimal_to_fraction",
      },
      {
        difficulty: "hard",
        question: "If a number is increased by 20% and then decreased by 20%, what is the net change?",
        questionType: "multiple_choice",
        options: JSON.stringify(["0%", "-4%", "+4%", "-5%"]),
        correctAnswer: "-4%",
        explanation: "Starting with 100: +20% = 120. Then 120 × 0.8 = 96. Net change: -4%",
        variationGroup: "compound_percentage",
      },
    ],
    "Algebra": [
      {
        difficulty: "easy",
        question: "Solve: x + 5 = 12",
        questionType: "multiple_choice",
        options: JSON.stringify(["5", "7", "17", "2"]),
        correctAnswer: "7",
        explanation: "x = 12 - 5 = 7",
        variationGroup: "linear_equation_basic",
      },
      {
        difficulty: "easy",
        question: "Solve: 2x = 18",
        questionType: "multiple_choice",
        options: JSON.stringify(["8", "9", "16", "20"]),
        correctAnswer: "9",
        explanation: "x = 18 ÷ 2 = 9",
        variationGroup: "linear_equation_multiplication",
      },
      {
        difficulty: "medium",
        question: "Solve: 3x - 7 = 14",
        questionType: "multiple_choice",
        options: JSON.stringify(["5", "6", "7", "8"]),
        correctAnswer: "7",
        explanation: "3x = 14 + 7 = 21, so x = 7",
        variationGroup: "linear_equation_multistep",
      },
      {
        difficulty: "medium",
        question: "What is the slope of the line passing through (0, 2) and (4, 10)?",
        questionType: "multiple_choice",
        options: JSON.stringify(["1", "2", "3", "4"]),
        correctAnswer: "2",
        explanation: "Slope = (10-2)/(4-0) = 8/4 = 2",
        variationGroup: "slope_calculation",
      },
      {
        difficulty: "hard",
        question: "Solve: 2(x - 3) + 5 = 3x - 4",
        questionType: "multiple_choice",
        options: JSON.stringify(["3", "5", "7", "9"]),
        correctAnswer: "3",
        explanation: "2x - 6 + 5 = 3x - 4; 2x - 1 = 3x - 4; -1 + 4 = 3x - 2x; 3 = x",
        variationGroup: "linear_equation_complex",
      },
    ],
    "Geometry": [
      {
        difficulty: "easy",
        question: "What is the area of a rectangle with length 8 and width 5?",
        questionType: "multiple_choice",
        options: JSON.stringify(["13", "26", "40", "80"]),
        correctAnswer: "40",
        explanation: "Area = length × width = 8 × 5 = 40",
        variationGroup: "rectangle_area",
      },
      {
        difficulty: "easy",
        question: "What is the circumference of a circle with radius 3? (Use π ≈ 3.14)",
        questionType: "multiple_choice",
        options: JSON.stringify(["9.42", "18.84", "28.26", "6.28"]),
        correctAnswer: "18.84",
        explanation: "Circumference = 2πr = 2 × 3.14 × 3 = 18.84",
        variationGroup: "circle_circumference",
      },
      {
        difficulty: "medium",
        question: "What is the area of a triangle with base 10 and height 6?",
        questionType: "multiple_choice",
        options: JSON.stringify(["16", "30", "60", "120"]),
        correctAnswer: "30",
        explanation: "Area = (1/2) × base × height = (1/2) × 10 × 6 = 30",
        variationGroup: "triangle_area",
      },
      {
        difficulty: "medium",
        question: "In a right triangle, if one leg is 3 and the other is 4, what is the hypotenuse?",
        questionType: "multiple_choice",
        options: JSON.stringify(["5", "6", "7", "8"]),
        correctAnswer: "5",
        explanation: "Using Pythagorean theorem: 3² + 4² = 9 + 16 = 25, √25 = 5",
        variationGroup: "pythagorean_theorem",
      },
      {
        difficulty: "hard",
        question: "What is the volume of a rectangular box with dimensions 4 × 5 × 6?",
        questionType: "multiple_choice",
        options: JSON.stringify(["15", "60", "120", "240"]),
        correctAnswer: "120",
        explanation: "Volume = length × width × height = 4 × 5 × 6 = 120",
        variationGroup: "rectangular_volume",
      },
    ],
  },
  "GED-LANG": {
    "Reading Comprehension": [
      {
        difficulty: "easy",
        question: "What is the main idea of a passage about climate change?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Global temperatures are rising due to human activities",
          "It is cold in winter",
          "Scientists study weather patterns",
          "The sun is very hot",
        ]),
        correctAnswer: "Global temperatures are rising due to human activities",
        explanation: "The main idea is the central point the author is making about the topic.",
        variationGroup: "main_idea",
      },
      {
        difficulty: "easy",
        question: "What does the word 'benevolent' mean?",
        questionType: "multiple_choice",
        options: JSON.stringify(["kind and generous", "angry and hostile", "confused and lost", "tired and weak"]),
        correctAnswer: "kind and generous",
        explanation: "Benevolent means showing kindness and generosity.",
        variationGroup: "vocabulary_basic",
      },
      {
        difficulty: "medium",
        question: "What can we infer about a character who donates anonymously to charity?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "They value helping others more than recognition",
          "They are very poor",
          "They don't like money",
          "They are famous",
        ]),
        correctAnswer: "They value helping others more than recognition",
        explanation: "An inference is a conclusion based on evidence in the text.",
        variationGroup: "inference",
      },
      {
        difficulty: "medium",
        question: "What is the author's tone in a passage criticizing pollution?",
        questionType: "multiple_choice",
        options: JSON.stringify(["concerned and critical", "happy and cheerful", "confused and uncertain", "bored and indifferent"]),
        correctAnswer: "concerned and critical",
        explanation: "Tone is the author's attitude toward the subject.",
        variationGroup: "tone_analysis",
      },
      {
        difficulty: "hard",
        question: "What does the author imply by describing a character as 'meticulous'?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The character pays careful attention to detail",
          "The character is lazy",
          "The character is angry",
          "The character is confused",
        ]),
        correctAnswer: "The character pays careful attention to detail",
        explanation: "Meticulous means very careful and precise. The author implies attention to detail.",
        variationGroup: "word_implication",
      },
    ],
    "Grammar": [
      {
        difficulty: "easy",
        question: "Which sentence is grammatically correct?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "She go to the store every day.",
          "She goes to the store every day.",
          "She going to the store every day.",
          "She gone to the store every day.",
        ]),
        correctAnswer: "She goes to the store every day.",
        explanation: "Subject-verb agreement: 'she' (singular) requires 'goes' (singular verb).",
        variationGroup: "subject_verb_agreement",
      },
      {
        difficulty: "easy",
        question: "Which sentence uses correct punctuation?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The cat sat on the mat.",
          "The cat sat on the mat",
          "The cat sat on the mat,",
          "The cat sat on the mat;",
        ]),
        correctAnswer: "The cat sat on the mat.",
        explanation: "A simple sentence ends with a period.",
        variationGroup: "basic_punctuation",
      },
      {
        difficulty: "medium",
        question: "Identify the error: 'Between you and I, I think this is wrong.'",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "'I' should be 'me' (object of preposition)",
          "'think' should be 'thinks'",
          "'this' should be 'that'",
          "No error",
        ]),
        correctAnswer: "'I' should be 'me' (object of preposition)",
        explanation: "After prepositions like 'between,' use the objective case 'me'.",
        variationGroup: "pronoun_case",
      },
      {
        difficulty: "medium",
        question: "Which sentence correctly uses a comma?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "I like apples, oranges, and bananas.",
          "I like, apples oranges and bananas.",
          "I like apples oranges, and bananas.",
          "I, like apples oranges and bananas.",
        ]),
        correctAnswer: "I like apples, oranges, and bananas.",
        explanation: "Use commas to separate items in a list (Oxford comma before 'and').",
        variationGroup: "comma_usage",
      },
      {
        difficulty: "hard",
        question: "Which sentence is correctly punctuated?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "She said, 'I am going to the store.'",
          "She said 'I am going to the store.'",
          "She said, \"I am going to the store.\"",
          "Both A and C are correct",
        ]),
        correctAnswer: "Both A and C are correct",
        explanation: "Both single and double quotes are acceptable for direct speech.",
        variationGroup: "quotation_marks",
      },
    ],
    "Writing": [
      {
        difficulty: "easy",
        question: "What is a thesis statement?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The main argument or claim of an essay",
          "A list of sources",
          "A summary of the conclusion",
          "The title of the essay",
        ]),
        correctAnswer: "The main argument or claim of an essay",
        explanation: "A thesis statement clearly states the main point of the essay.",
        variationGroup: "thesis_definition",
      },
      {
        difficulty: "medium",
        question: "Which is the best thesis statement for an essay about exercise?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Regular exercise improves physical health, mental well-being, and longevity.",
          "Exercise is good for you.",
          "Many people exercise.",
          "I like to exercise.",
        ]),
        correctAnswer: "Regular exercise improves physical health, mental well-being, and longevity.",
        explanation: "A strong thesis is specific, arguable, and clearly states the main points.",
        variationGroup: "thesis_quality",
      },
      {
        difficulty: "medium",
        question: "What should a topic sentence do?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Introduce the main idea of a paragraph",
          "Conclude the essay",
          "List all sources",
          "Ask a question",
        ]),
        correctAnswer: "Introduce the main idea of a paragraph",
        explanation: "A topic sentence introduces the main idea that the paragraph will develop.",
        variationGroup: "topic_sentence",
      },
      {
        difficulty: "hard",
        question: "How should evidence be integrated into an essay?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "With proper citations and explanation of how it supports the claim",
          "Without any explanation",
          "Only in the conclusion",
          "As a separate section",
        ]),
        correctAnswer: "With proper citations and explanation of how it supports the claim",
        explanation: "Evidence should be cited and explained to show how it supports your argument.",
        variationGroup: "evidence_integration",
      },
    ],
  },
  "GED-SCI": {
    "Biology": [
      {
        difficulty: "easy",
        question: "What is the basic unit of life?",
        questionType: "multiple_choice",
        options: JSON.stringify(["cell", "atom", "molecule", "organism"]),
        correctAnswer: "cell",
        explanation: "The cell is the smallest unit of life and the basic building block of all organisms.",
        variationGroup: "cell_definition",
      },
      {
        difficulty: "easy",
        question: "What do plants use photosynthesis to produce?",
        questionType: "multiple_choice",
        options: JSON.stringify(["glucose and oxygen", "carbon dioxide and water", "nitrogen and phosphorus", "ATP and ADP"]),
        correctAnswer: "glucose and oxygen",
        explanation: "Photosynthesis converts light energy into chemical energy (glucose) and releases oxygen.",
        variationGroup: "photosynthesis",
      },
      {
        difficulty: "medium",
        question: "What is the function of mitochondria in a cell?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Produce energy (ATP)",
          "Store genetic information",
          "Synthesize proteins",
          "Regulate cell division",
        ]),
        correctAnswer: "Produce energy (ATP)",
        explanation: "Mitochondria are the powerhouse of the cell, producing ATP through cellular respiration.",
        variationGroup: "mitochondria_function",
      },
      {
        difficulty: "medium",
        question: "What is the process by which organisms pass traits to offspring?",
        questionType: "multiple_choice",
        options: JSON.stringify(["heredity", "mutation", "adaptation", "evolution"]),
        correctAnswer: "heredity",
        explanation: "Heredity is the passing of traits from parents to offspring through genes.",
        variationGroup: "heredity",
      },
      {
        difficulty: "hard",
        question: "What is natural selection?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The process where organisms with beneficial traits are more likely to survive and reproduce",
          "The random change in gene frequency in a population",
          "The movement of organisms to new environments",
          "The extinction of all organisms in an area",
        ]),
        correctAnswer: "The process where organisms with beneficial traits are more likely to survive and reproduce",
        explanation: "Natural selection is the mechanism of evolution where advantageous traits become more common.",
        variationGroup: "natural_selection",
      },
    ],
    "Chemistry": [
      {
        difficulty: "easy",
        question: "What is the chemical formula for water?",
        questionType: "multiple_choice",
        options: JSON.stringify(["H2O", "CO2", "O2", "H2"]),
        correctAnswer: "H2O",
        explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom.",
        variationGroup: "water_formula",
      },
      {
        difficulty: "easy",
        question: "What is an atom?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The smallest unit of an element",
          "A combination of molecules",
          "A type of energy",
          "A chemical reaction",
        ]),
        correctAnswer: "The smallest unit of an element",
        explanation: "An atom is the smallest unit of matter that retains the properties of an element.",
        variationGroup: "atom_definition",
      },
      {
        difficulty: "medium",
        question: "What is the pH of a neutral solution?",
        questionType: "multiple_choice",
        options: JSON.stringify(["7", "0", "14", "1"]),
        correctAnswer: "7",
        explanation: "A pH of 7 is neutral. Below 7 is acidic, above 7 is basic.",
        variationGroup: "ph_scale",
      },
      {
        difficulty: "medium",
        question: "What happens in a chemical reaction?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Bonds between atoms are broken and new bonds are formed",
          "Atoms disappear",
          "Matter is created",
          "Energy is destroyed",
        ]),
        correctAnswer: "Bonds between atoms are broken and new bonds are formed",
        explanation: "Chemical reactions involve breaking existing bonds and forming new ones.",
        variationGroup: "chemical_reaction",
      },
      {
        difficulty: "hard",
        question: "What is the law of conservation of mass?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Matter cannot be created or destroyed in a chemical reaction",
          "All matter has the same mass",
          "Mass increases during reactions",
          "Mass is only found in solids",
        ]),
        correctAnswer: "Matter cannot be created or destroyed in a chemical reaction",
        explanation: "The law of conservation of mass states that mass is conserved in chemical reactions.",
        variationGroup: "conservation_of_mass",
      },
    ],
    "Earth Science": [
      {
        difficulty: "easy",
        question: "What are the three main layers of Earth?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Crust, mantle, and core",
          "Lithosphere, asthenosphere, and mesosphere",
          "Troposphere, stratosphere, and thermosphere",
          "Continental, oceanic, and transitional",
        ]),
        correctAnswer: "Crust, mantle, and core",
        explanation: "Earth's three main layers are the crust (outermost), mantle (middle), and core (center).",
        variationGroup: "earth_layers",
      },
      {
        difficulty: "easy",
        question: "What causes the seasons?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The tilt of Earth's axis",
          "Earth's distance from the sun",
          "The moon's gravity",
          "Solar flares",
        ]),
        correctAnswer: "The tilt of Earth's axis",
        explanation: "Earth's axial tilt causes different parts to receive different amounts of sunlight.",
        variationGroup: "seasons",
      },
      {
        difficulty: "medium",
        question: "What is the water cycle?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The continuous movement of water between Earth's surface and atmosphere",
          "The flow of water in rivers",
          "The freezing of water",
          "The boiling of water",
        ]),
        correctAnswer: "The continuous movement of water between Earth's surface and atmosphere",
        explanation: "The water cycle includes evaporation, condensation, and precipitation.",
        variationGroup: "water_cycle",
      },
      {
        difficulty: "medium",
        question: "What is a fossil?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The preserved remains of an organism from the past",
          "A type of rock",
          "A mineral deposit",
          "A layer of soil",
        ]),
        correctAnswer: "The preserved remains of an organism from the past",
        explanation: "Fossils are evidence of past life and help us understand Earth's history.",
        variationGroup: "fossil_definition",
      },
      {
        difficulty: "hard",
        question: "What is plate tectonics?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The theory that Earth's crust is divided into moving plates",
          "The study of rocks",
          "The movement of water in oceans",
          "The rotation of Earth",
        ]),
        correctAnswer: "The theory that Earth's crust is divided into moving plates",
        explanation: "Plate tectonics explains earthquakes, volcanoes, and mountain formation.",
        variationGroup: "plate_tectonics",
      },
    ],
  },
  "GED-SOCIAL": {
    "U.S. History": [
      {
        difficulty: "easy",
        question: "In what year was the Declaration of Independence signed?",
        questionType: "multiple_choice",
        options: JSON.stringify(["1776", "1787", "1791", "1801"]),
        correctAnswer: "1776",
        explanation: "The Declaration of Independence was signed on July 4, 1776.",
        variationGroup: "declaration_independence",
      },
      {
        difficulty: "easy",
        question: "Who was the first President of the United States?",
        questionType: "multiple_choice",
        options: JSON.stringify(["George Washington", "Thomas Jefferson", "Benjamin Franklin", "Alexander Hamilton"]),
        correctAnswer: "George Washington",
        explanation: "George Washington served as the first president from 1789 to 1797.",
        variationGroup: "first_president",
      },
      {
        difficulty: "medium",
        question: "What was the main cause of the Civil War?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "Disagreement over slavery and states' rights",
          "Economic competition between regions",
          "Foreign invasion",
          "Political corruption",
        ]),
        correctAnswer: "Disagreement over slavery and states' rights",
        explanation: "The Civil War was fought primarily over the issue of slavery and state sovereignty.",
        variationGroup: "civil_war_cause",
      },
      {
        difficulty: "medium",
        question: "What was the Great Depression?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "A severe economic crisis in the 1930s",
          "A war in Europe",
          "A disease outbreak",
          "A political movement",
        ]),
        correctAnswer: "A severe economic crisis in the 1930s",
        explanation: "The Great Depression was a worldwide economic downturn that lasted from 1929 to the late 1930s.",
        variationGroup: "great_depression",
      },
      {
        difficulty: "hard",
        question: "What was the main purpose of the Civil Rights Movement?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "To end racial discrimination and achieve equal rights for all citizens",
          "To establish new political parties",
          "To expand U.S. territory",
          "To promote industrialization",
        ]),
        correctAnswer: "To end racial discrimination and achieve equal rights for all citizens",
        explanation: "The Civil Rights Movement fought for equal rights and an end to segregation.",
        variationGroup: "civil_rights",
      },
    ],
    "Civics": [
      {
        difficulty: "easy",
        question: "How many branches does the U.S. government have?",
        questionType: "multiple_choice",
        options: JSON.stringify(["3", "2", "4", "5"]),
        correctAnswer: "3",
        explanation: "The three branches are: Executive, Legislative, and Judicial.",
        variationGroup: "government_branches",
      },
      {
        difficulty: "easy",
        question: "What is the main role of the President?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "To lead the executive branch and enforce laws",
          "To make all laws",
          "To interpret the Constitution",
          "To command the military only",
        ]),
        correctAnswer: "To lead the executive branch and enforce laws",
        explanation: "The President is the head of the executive branch and enforces federal laws.",
        variationGroup: "president_role",
      },
      {
        difficulty: "medium",
        question: "What is the purpose of the Bill of Rights?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "To protect individual freedoms and rights",
          "To establish the government structure",
          "To declare independence",
          "To regulate commerce",
        ]),
        correctAnswer: "To protect individual freedoms and rights",
        explanation: "The Bill of Rights (first 10 amendments) protects fundamental freedoms.",
        variationGroup: "bill_of_rights",
      },
      {
        difficulty: "medium",
        question: "How often are presidential elections held?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Every 4 years", "Every 2 years", "Every 6 years", "Every year"]),
        correctAnswer: "Every 4 years",
        explanation: "U.S. presidential elections are held every 4 years.",
        variationGroup: "election_frequency",
      },
      {
        difficulty: "hard",
        question: "What is the purpose of the system of checks and balances?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "To prevent any one branch of government from becoming too powerful",
          "To make government more efficient",
          "To eliminate the need for laws",
          "To reduce the number of government officials",
        ]),
        correctAnswer: "To prevent any one branch of government from becoming too powerful",
        explanation: "Checks and balances ensure that power is distributed among the three branches.",
        variationGroup: "checks_balances",
      },
    ],
    "Economics": [
      {
        difficulty: "easy",
        question: "What is supply and demand?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The relationship between product availability and consumer desire",
          "The cost of production",
          "Government regulation",
          "International trade",
        ]),
        correctAnswer: "The relationship between product availability and consumer desire",
        explanation: "Supply and demand determine prices in a market economy.",
        variationGroup: "supply_demand",
      },
      {
        difficulty: "easy",
        question: "What is inflation?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "An increase in the general price level of goods and services",
          "A decrease in employment",
          "A rise in interest rates",
          "A stock market crash",
        ]),
        correctAnswer: "An increase in the general price level of goods and services",
        explanation: "Inflation reduces the purchasing power of money over time.",
        variationGroup: "inflation",
      },
      {
        difficulty: "medium",
        question: "What is a budget?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "A plan for spending and saving money",
          "A bank account",
          "A loan agreement",
          "A tax form",
        ]),
        correctAnswer: "A plan for spending and saving money",
        explanation: "A budget helps individuals and governments manage their finances.",
        variationGroup: "budget",
      },
      {
        difficulty: "medium",
        question: "What is the difference between a need and a want?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "A need is essential for survival; a want is something desired but not essential",
          "A need is expensive; a want is cheap",
          "A need is for adults; a want is for children",
          "There is no difference",
        ]),
        correctAnswer: "A need is essential for survival; a want is something desired but not essential",
        explanation: "Understanding needs vs. wants is important for budgeting.",
        variationGroup: "needs_wants",
      },
      {
        difficulty: "hard",
        question: "What is GDP (Gross Domestic Product)?",
        questionType: "multiple_choice",
        options: JSON.stringify([
          "The total value of goods and services produced by a country",
          "The average income of citizens",
          "The total government spending",
          "The unemployment rate",
        ]),
        correctAnswer: "The total value of goods and services produced by a country",
        explanation: "GDP is a key measure of a country's economic health.",
        variationGroup: "gdp",
      },
    ],
  },
};

async function populatePracticeQuestions() {
  try {
    console.log("Starting practice questions population...");

    let totalInserted = 0;

    // Get all courses
    const allCourses = await database.select().from(
      (await import("../drizzle/schema")).courses
    );

    const courseMap: Record<string, number> = {};
    for (const course of allCourses) {
      if (course.code.startsWith("GED-")) {
        courseMap[course.code] = course.id;
      }
    }

    // Insert questions for each course
    for (const [courseCode, topics] of Object.entries(practiceQuestions)) {
      const courseId = courseMap[courseCode];
      if (!courseId) {
        console.error(`Course ${courseCode} not found!`);
        continue;
      }

      let topicOrder = 1;
      for (const [topicName, questions] of Object.entries(topics)) {
        console.log(`\n📚 ${courseCode} - ${topicName}`);

        for (const question of questions) {
          await database.insert(bridgeAcademyPracticeQuestions).values({
            topicId: courseId, // Using courseId as topicId for now
            question: question.question,
            questionType: question.questionType as "multiple_choice" | "true_false" | "short_answer",
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            difficulty: question.difficulty as "easy" | "medium" | "hard",
            variationGroup: question.variationGroup,
          });
          totalInserted++;
        }

        console.log(`  ✓ Added ${questions.length} questions`);
        topicOrder++;
      }
    }

    console.log(`\n✅ Practice questions population complete!`);
    console.log(`Total questions inserted: ${totalInserted}`);
    console.log(`Breakdown:`);
    console.log(`  - GED Math: 15 questions`);
    console.log(`  - GED Language Arts: 15 questions`);
    console.log(`  - GED Science: 15 questions`);
    console.log(`  - GED Social Studies: 15 questions`);
    console.log(`  - Total: 60 practice questions`);

    process.exit(0);
  } catch (error) {
    console.error("Error populating practice questions:", error);
    process.exit(1);
  }
}

populatePracticeQuestions();
