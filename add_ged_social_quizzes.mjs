import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// GED-SOCIAL lesson IDs and quiz data
const quizData = {
  540031: [ // Colonial America and Independence
    { q: "The first permanent English settlement in America was:", type: "multiple_choice", options: ["Jamestown", "Plymouth", "Boston", "Philadelphia"], answer: "Jamestown" },
    { q: "The Declaration of Independence was signed in:", type: "multiple_choice", options: ["1776", "1789", "1765", "1800"], answer: "1776" },
    { q: "The primary author of the Declaration of Independence was:", type: "multiple_choice", options: ["Thomas Jefferson", "George Washington", "Benjamin Franklin", "John Adams"], answer: "Thomas Jefferson" },
    { q: "The Boston Tea Party protested:", type: "multiple_choice", options: ["Taxation without representation", "Slavery", "Religious persecution", "Land disputes"], answer: "Taxation without representation" },
    { q: "The Pilgrims arrived on the:", type: "multiple_choice", options: ["Mayflower", "Santa Maria", "Endeavour", "Constitution"], answer: "Mayflower" },
    { q: "The French and Indian War was fought between:", type: "multiple_choice", options: ["Britain and France", "Colonists and British", "Spain and France", "Colonists and Native Americans only"], answer: "Britain and France" },
    { q: "The Stamp Act required colonists to:", type: "multiple_choice", options: ["Pay taxes on printed materials", "House British soldiers", "Stop trading with Britain", "Free their slaves"], answer: "Pay taxes on printed materials" },
    { q: "The first shots of the Revolutionary War were fired at:", type: "multiple_choice", options: ["Lexington and Concord", "Boston", "Philadelphia", "New York"], answer: "Lexington and Concord" },
    { q: "The Treaty of Paris (1783) ended:", type: "multiple_choice", options: ["The Revolutionary War", "The French and Indian War", "The War of 1812", "The Civil War"], answer: "The Revolutionary War" },
    { q: "Colonial governments were based on:", type: "multiple_choice", options: ["English traditions of self-government", "French monarchy", "Spanish rule", "Native American systems"], answer: "English traditions of self-government" },
    { q: "Explain the significance of 'no taxation without representation' in the American Revolution.", type: "short_answer", options: null, answer: "Colonists believed they should not pay taxes to Britain without having elected representatives in Parliament. This principle became a rallying cry for independence." }
  ],
  540032: [ // Civil War and Reconstruction
    { q: "The Civil War began in:", type: "multiple_choice", options: ["1861", "1776", "1850", "1870"], answer: "1861" },
    { q: "The Emancipation Proclamation freed slaves in:", type: "multiple_choice", options: ["Confederate states", "All states", "Northern states", "Border states only"], answer: "Confederate states" },
    { q: "The president during the Civil War was:", type: "multiple_choice", options: ["Abraham Lincoln", "Ulysses S. Grant", "Jefferson Davis", "Andrew Johnson"], answer: "Abraham Lincoln" },
    { q: "The 13th Amendment:", type: "multiple_choice", options: ["Abolished slavery", "Granted citizenship", "Gave voting rights", "Established segregation"], answer: "Abolished slavery" },
    { q: "The Battle of Gettysburg was significant because:", type: "multiple_choice", options: ["It was a turning point for the Union", "The South won", "It ended the war", "It was the first battle"], answer: "It was a turning point for the Union" },
    { q: "Reconstruction aimed to:", type: "multiple_choice", options: ["Rebuild the South and integrate freed slaves", "Punish the North", "Expand slavery", "Reduce federal power"], answer: "Rebuild the South and integrate freed slaves" },
    { q: "The 14th Amendment granted:", type: "multiple_choice", options: ["Citizenship to all born in the US", "Voting rights to women", "Freedom of speech", "Right to bear arms"], answer: "Citizenship to all born in the US" },
    { q: "The 15th Amendment gave:", type: "multiple_choice", options: ["Voting rights regardless of race", "Freedom of religion", "Right to a fair trial", "Freedom of the press"], answer: "Voting rights regardless of race" },
    { q: "Jim Crow laws:", type: "multiple_choice", options: ["Enforced racial segregation", "Ended slavery", "Gave equal rights", "Promoted integration"], answer: "Enforced racial segregation" },
    { q: "The Freedmen's Bureau helped:", type: "multiple_choice", options: ["Former slaves with education and jobs", "Confederate soldiers", "Northern businesses", "European immigrants"], answer: "Former slaves with education and jobs" },
    { q: "Explain the main causes of the Civil War.", type: "short_answer", options: null, answer: "The main causes were slavery, states' rights, economic differences between North and South, and the election of Abraham Lincoln, which led Southern states to secede." }
  ],
  540033: [ // Modern America (1900-Present)
    { q: "World War I began in:", type: "multiple_choice", options: ["1914", "1939", "1941", "1900"], answer: "1914" },
    { q: "The Great Depression began with:", type: "multiple_choice", options: ["The stock market crash of 1929", "World War I", "World War II", "The Civil War"], answer: "The stock market crash of 1929" },
    { q: "The New Deal was created by:", type: "multiple_choice", options: ["Franklin D. Roosevelt", "Herbert Hoover", "Harry Truman", "Dwight Eisenhower"], answer: "Franklin D. Roosevelt" },
    { q: "The US entered World War II after:", type: "multiple_choice", options: ["Pearl Harbor attack", "D-Day", "VE Day", "The Great Depression"], answer: "Pearl Harbor attack" },
    { q: "The Cold War was primarily between:", type: "multiple_choice", options: ["USA and Soviet Union", "USA and China", "USA and Germany", "USA and Japan"], answer: "USA and Soviet Union" },
    { q: "The Civil Rights Movement aimed to:", type: "multiple_choice", options: ["End racial discrimination", "Start a war", "Expand territory", "Reduce immigration"], answer: "End racial discrimination" },
    { q: "Martin Luther King Jr. advocated for:", type: "multiple_choice", options: ["Nonviolent protest", "Armed resistance", "Separation of races", "Emigration to Africa"], answer: "Nonviolent protest" },
    { q: "The Vietnam War ended in:", type: "multiple_choice", options: ["1975", "1965", "1980", "1990"], answer: "1975" },
    { q: "The September 11 attacks occurred in:", type: "multiple_choice", options: ["2001", "1999", "2005", "1995"], answer: "2001" },
    { q: "The 19th Amendment gave:", type: "multiple_choice", options: ["Women the right to vote", "Freedom of speech", "End to slavery", "Citizenship to immigrants"], answer: "Women the right to vote" },
    { q: "Describe the significance of the Civil Rights Act of 1964.", type: "short_answer", options: null, answer: "The Civil Rights Act of 1964 outlawed discrimination based on race, color, religion, sex, or national origin. It ended segregation in public places and banned employment discrimination." }
  ],
  540034: [ // Constitutional Rights and Amendments
    { q: "The First Amendment protects:", type: "multiple_choice", options: ["Freedom of speech, religion, press, assembly, petition", "Right to bear arms", "Protection from search", "Right to a fair trial"], answer: "Freedom of speech, religion, press, assembly, petition" },
    { q: "The Second Amendment concerns:", type: "multiple_choice", options: ["Right to bear arms", "Freedom of speech", "Right to vote", "Freedom of religion"], answer: "Right to bear arms" },
    { q: "The Fourth Amendment protects against:", type: "multiple_choice", options: ["Unreasonable searches and seizures", "Self-incrimination", "Cruel punishment", "Double jeopardy"], answer: "Unreasonable searches and seizures" },
    { q: "The Fifth Amendment includes:", type: "multiple_choice", options: ["Right against self-incrimination", "Right to bear arms", "Freedom of speech", "Right to vote"], answer: "Right against self-incrimination" },
    { q: "The Sixth Amendment guarantees:", type: "multiple_choice", options: ["Right to a speedy trial", "Freedom of religion", "Right to bear arms", "Freedom of the press"], answer: "Right to a speedy trial" },
    { q: "The Eighth Amendment prohibits:", type: "multiple_choice", options: ["Cruel and unusual punishment", "Unreasonable searches", "Self-incrimination", "Double jeopardy"], answer: "Cruel and unusual punishment" },
    { q: "The Bill of Rights consists of:", type: "multiple_choice", options: ["The first 10 amendments", "The first 5 amendments", "All amendments", "The Constitution only"], answer: "The first 10 amendments" },
    { q: "Due process means:", type: "multiple_choice", options: ["Fair treatment through the legal system", "Quick punishment", "No trial needed", "Automatic conviction"], answer: "Fair treatment through the legal system" },
    { q: "The 10th Amendment reserves powers to:", type: "multiple_choice", options: ["States and the people", "The President", "Congress only", "The Supreme Court"], answer: "States and the people" },
    { q: "Freedom of the press is protected by:", type: "multiple_choice", options: ["The First Amendment", "The Second Amendment", "The Fourth Amendment", "The Tenth Amendment"], answer: "The First Amendment" },
    { q: "Explain why the Bill of Rights was added to the Constitution.", type: "short_answer", options: null, answer: "The Bill of Rights was added to protect individual liberties from government overreach. Anti-Federalists demanded these protections before ratifying the Constitution." }
  ],
  540035: [ // Branches of Government
    { q: "The legislative branch is:", type: "multiple_choice", options: ["Congress", "The President", "The Supreme Court", "The Cabinet"], answer: "Congress" },
    { q: "The executive branch is headed by:", type: "multiple_choice", options: ["The President", "The Speaker of the House", "The Chief Justice", "The Vice President"], answer: "The President" },
    { q: "The judicial branch interprets:", type: "multiple_choice", options: ["Laws and the Constitution", "Executive orders", "Treaties", "Budgets"], answer: "Laws and the Constitution" },
    { q: "Congress consists of:", type: "multiple_choice", options: ["The Senate and House of Representatives", "The President and Vice President", "The Supreme Court", "State governors"], answer: "The Senate and House of Representatives" },
    { q: "How many senators does each state have?", type: "multiple_choice", options: ["2", "1", "3", "Varies by population"], answer: "2" },
    { q: "The number of House representatives is based on:", type: "multiple_choice", options: ["State population", "State size", "State age", "Equal for all states"], answer: "State population" },
    { q: "The Supreme Court has how many justices?", type: "multiple_choice", options: ["9", "7", "11", "5"], answer: "9" },
    { q: "Checks and balances ensure:", type: "multiple_choice", options: ["No branch becomes too powerful", "The President has all power", "Congress controls everything", "Courts make laws"], answer: "No branch becomes too powerful" },
    { q: "The President can veto:", type: "multiple_choice", options: ["Bills passed by Congress", "Supreme Court decisions", "Constitutional amendments", "State laws"], answer: "Bills passed by Congress" },
    { q: "Judicial review allows courts to:", type: "multiple_choice", options: ["Declare laws unconstitutional", "Write new laws", "Elect the President", "Declare war"], answer: "Declare laws unconstitutional" },
    { q: "Explain how the system of checks and balances works.", type: "short_answer", options: null, answer: "Each branch can limit the others: Congress passes laws but the President can veto; the President enforces laws but Congress controls funding; courts can declare laws unconstitutional but judges are appointed by the President and confirmed by Congress." }
  ],
  540036: [ // Global Economics and Trade
    { q: "Supply and demand determine:", type: "multiple_choice", options: ["Prices in a market economy", "Government spending", "Tax rates", "Immigration policy"], answer: "Prices in a market economy" },
    { q: "GDP stands for:", type: "multiple_choice", options: ["Gross Domestic Product", "General Domestic Price", "Government Debt Payment", "Global Development Program"], answer: "Gross Domestic Product" },
    { q: "Inflation is:", type: "multiple_choice", options: ["Rising prices over time", "Falling prices", "Stable prices", "Government spending"], answer: "Rising prices over time" },
    { q: "A tariff is:", type: "multiple_choice", options: ["A tax on imports", "A trade agreement", "A type of currency", "A government subsidy"], answer: "A tax on imports" },
    { q: "Free trade means:", type: "multiple_choice", options: ["Trade without barriers", "Government-controlled trade", "No international trade", "Trade only with allies"], answer: "Trade without barriers" },
    { q: "The Federal Reserve controls:", type: "multiple_choice", options: ["Monetary policy", "Tax rates", "Trade agreements", "Immigration"], answer: "Monetary policy" },
    { q: "Unemployment rate measures:", type: "multiple_choice", options: ["Percentage of people without jobs who are seeking work", "Total population", "Number of businesses", "Government employees"], answer: "Percentage of people without jobs who are seeking work" },
    { q: "A recession is:", type: "multiple_choice", options: ["Economic decline for two consecutive quarters", "Economic growth", "Stable economy", "Rising employment"], answer: "Economic decline for two consecutive quarters" },
    { q: "Globalization refers to:", type: "multiple_choice", options: ["Increased worldwide interconnection", "Isolation of nations", "Decreased trade", "Local economies only"], answer: "Increased worldwide interconnection" },
    { q: "A trade deficit occurs when:", type: "multiple_choice", options: ["Imports exceed exports", "Exports exceed imports", "Trade is balanced", "No trade occurs"], answer: "Imports exceed exports" },
    { q: "Explain how supply and demand affect prices.", type: "short_answer", options: null, answer: "When demand is high and supply is low, prices rise. When supply is high and demand is low, prices fall. Prices reach equilibrium where supply meets demand." }
  ],
  540037: [ // World History and Cultures
    { q: "The Renaissance began in:", type: "multiple_choice", options: ["Italy", "England", "France", "Germany"], answer: "Italy" },
    { q: "The Industrial Revolution started in:", type: "multiple_choice", options: ["Britain", "America", "France", "Germany"], answer: "Britain" },
    { q: "World War I was triggered by:", type: "multiple_choice", options: ["Assassination of Archduke Franz Ferdinand", "Pearl Harbor", "The Great Depression", "The Cold War"], answer: "Assassination of Archduke Franz Ferdinand" },
    { q: "The Holocaust was:", type: "multiple_choice", options: ["Nazi genocide of Jews and others", "A natural disaster", "An economic crisis", "A political movement"], answer: "Nazi genocide of Jews and others" },
    { q: "The Berlin Wall fell in:", type: "multiple_choice", options: ["1989", "1975", "1991", "1980"], answer: "1989" },
    { q: "Colonialism involved:", type: "multiple_choice", options: ["European powers controlling other lands", "Trade agreements", "Democratic movements", "Religious reforms"], answer: "European powers controlling other lands" },
    { q: "The United Nations was founded in:", type: "multiple_choice", options: ["1945", "1918", "1939", "1960"], answer: "1945" },
    { q: "The French Revolution began in:", type: "multiple_choice", options: ["1789", "1776", "1800", "1850"], answer: "1789" },
    { q: "Apartheid was a system of:", type: "multiple_choice", options: ["Racial segregation in South Africa", "Economic reform", "Democratic government", "Religious freedom"], answer: "Racial segregation in South Africa" },
    { q: "The Enlightenment emphasized:", type: "multiple_choice", options: ["Reason and individual rights", "Religious authority", "Monarchy", "Feudalism"], answer: "Reason and individual rights" },
    { q: "Explain the significance of the Industrial Revolution.", type: "short_answer", options: null, answer: "The Industrial Revolution transformed economies from agricultural to industrial, introduced factory systems, new technologies, urbanization, and changed social structures and working conditions." }
  ],
  540038: [ // Document Analysis and Primary Sources
    { q: "A primary source is:", type: "multiple_choice", options: ["An original document from the time period", "A textbook", "An encyclopedia", "A modern interpretation"], answer: "An original document from the time period" },
    { q: "A secondary source is:", type: "multiple_choice", options: ["An analysis of primary sources", "An original document", "An eyewitness account", "A diary"], answer: "An analysis of primary sources" },
    { q: "When analyzing a document, first consider:", type: "multiple_choice", options: ["Who wrote it and when", "The length", "The font", "The binding"], answer: "Who wrote it and when" },
    { q: "Bias in a source means:", type: "multiple_choice", options: ["The author's perspective affects content", "The source is false", "The source is primary", "The source is long"], answer: "The author's perspective affects content" },
    { q: "Context helps us understand:", type: "multiple_choice", options: ["The circumstances surrounding a document", "Only the words", "Nothing important", "The author's age"], answer: "The circumstances surrounding a document" },
    { q: "A political cartoon is:", type: "multiple_choice", options: ["A visual commentary on events", "A photograph", "A news article", "A government document"], answer: "A visual commentary on events" },
    { q: "The purpose of a document refers to:", type: "multiple_choice", options: ["Why it was created", "Its length", "Its age", "Its location"], answer: "Why it was created" },
    { q: "Corroborating sources means:", type: "multiple_choice", options: ["Checking multiple sources for accuracy", "Using only one source", "Ignoring sources", "Creating new sources"], answer: "Checking multiple sources for accuracy" },
    { q: "An eyewitness account is:", type: "multiple_choice", options: ["A firsthand description of events", "A textbook summary", "A modern analysis", "A fictional story"], answer: "A firsthand description of events" },
    { q: "Historical significance refers to:", type: "multiple_choice", options: ["The importance of an event or document", "The age of a document", "The length of a document", "The author's fame"], answer: "The importance of an event or document" },
    { q: "Describe the steps for analyzing a primary source document.", type: "short_answer", options: null, answer: "Identify the source (author, date, type). Consider the context (historical circumstances). Analyze the content (main ideas, arguments). Evaluate bias and perspective. Consider the purpose and audience." }
  ],
  540039: [ // Social Studies Test-Taking Strategies
    { q: "When reading a passage, first:", type: "multiple_choice", options: ["Identify the main idea", "Memorize every detail", "Skip to questions", "Read very slowly"], answer: "Identify the main idea" },
    { q: "For document-based questions:", type: "multiple_choice", options: ["Analyze the source carefully", "Ignore the document", "Guess immediately", "Skip them"], answer: "Analyze the source carefully" },
    { q: "If a question asks about a map:", type: "multiple_choice", options: ["Read the legend and title first", "Ignore the map", "Only read the question", "Guess the answer"], answer: "Read the legend and title first" },
    { q: "Process of elimination helps by:", type: "multiple_choice", options: ["Removing obviously wrong answers", "Adding confusion", "Wasting time", "Nothing"], answer: "Removing obviously wrong answers" },
    { q: "For cause and effect questions:", type: "multiple_choice", options: ["Identify what led to what", "Ignore the relationship", "Focus only on dates", "Guess randomly"], answer: "Identify what led to what" },
    { q: "Time management means:", type: "multiple_choice", options: ["Pacing yourself through the test", "Rushing", "Taking long breaks", "Ignoring time"], answer: "Pacing yourself through the test" },
    { q: "If stuck on a question:", type: "multiple_choice", options: ["Mark it and return later", "Spend 10 minutes on it", "Give up", "Leave it blank"], answer: "Mark it and return later" },
    { q: "Reading all answer choices is important because:", type: "multiple_choice", options: ["The best answer may be last", "It wastes time", "First answer is always right", "It confuses you"], answer: "The best answer may be last" },
    { q: "For comparison questions:", type: "multiple_choice", options: ["Look for similarities and differences", "Focus on one item only", "Ignore both items", "Guess"], answer: "Look for similarities and differences" },
    { q: "Checking your work:", type: "multiple_choice", options: ["Catches careless errors", "Wastes time", "Is not helpful", "Changes correct answers"], answer: "Catches careless errors" },
    { q: "Describe a strategy for answering questions about historical documents.", type: "short_answer", options: null, answer: "Read the document introduction for context. Identify the author, date, and purpose. Read the question before re-reading the document. Look for specific evidence in the text to support your answer." }
  ],
  540040: [ // Social Studies Practice and Review
    { q: "The Constitution was ratified in:", type: "multiple_choice", options: ["1788", "1776", "1800", "1750"], answer: "1788" },
    { q: "The Louisiana Purchase doubled the size of:", type: "multiple_choice", options: ["The United States", "France", "Spain", "Britain"], answer: "The United States" },
    { q: "The Monroe Doctrine stated:", type: "multiple_choice", options: ["European powers should not colonize the Americas", "America would join European alliances", "Trade would be restricted", "Slavery would expand"], answer: "European powers should not colonize the Americas" },
    { q: "Manifest Destiny was the belief that:", type: "multiple_choice", options: ["America should expand to the Pacific", "Slavery should end", "America should remain small", "Europe should rule America"], answer: "America should expand to the Pacific" },
    { q: "The Progressive Era focused on:", type: "multiple_choice", options: ["Social and political reform", "Expanding slavery", "Reducing democracy", "Isolationism"], answer: "Social and political reform" },
    { q: "The Marshall Plan helped:", type: "multiple_choice", options: ["Rebuild Europe after WWII", "Start the Cold War", "End the Great Depression", "Expand American territory"], answer: "Rebuild Europe after WWII" },
    { q: "Brown v. Board of Education ruled that:", type: "multiple_choice", options: ["School segregation was unconstitutional", "Slavery was legal", "Women could vote", "Prayer in schools was required"], answer: "School segregation was unconstitutional" },
    { q: "The Electoral College elects:", type: "multiple_choice", options: ["The President", "Senators", "Representatives", "Governors"], answer: "The President" },
    { q: "Federalism divides power between:", type: "multiple_choice", options: ["National and state governments", "Three branches", "Two parties", "Citizens and government"], answer: "National and state governments" },
    { q: "The Preamble to the Constitution begins with:", type: "multiple_choice", options: ["We the People", "In Congress", "The President", "All men are created equal"], answer: "We the People" },
    { q: "Explain the concept of federalism in the United States government.", type: "short_answer", options: null, answer: "Federalism divides power between the national (federal) government and state governments. Some powers are exclusive to each level, while others are shared. This system balances national unity with state autonomy." }
  ]
};

let totalQuizzes = 0;

for (const [lessonId, questions] of Object.entries(quizData)) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await connection.execute(
      `INSERT INTO quiz_questions (lessonId, question, questionType, options, correctAnswer, questionOrder, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        parseInt(lessonId),
        q.q,
        q.type,
        q.options ? JSON.stringify(q.options) : null,
        q.answer,
        i + 1
      ]
    );
    totalQuizzes++;
  }
  console.log(`Added 11 quizzes for lesson ${lessonId}`);
}

console.log(`\nTotal GED-SOCIAL quizzes created: ${totalQuizzes}`);
await connection.end();
