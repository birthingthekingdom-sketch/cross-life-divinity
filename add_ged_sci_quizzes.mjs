import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// GED-SCI lesson IDs and quiz data
const quizData = {
  540021: [ // Cells and Organisms
    { q: "The basic unit of life is the:", type: "multiple_choice", options: ["Cell", "Atom", "Molecule", "Organ"], answer: "Cell" },
    { q: "Which organelle is the 'powerhouse' of the cell?", type: "multiple_choice", options: ["Mitochondria", "Nucleus", "Ribosome", "Golgi body"], answer: "Mitochondria" },
    { q: "DNA is found in the:", type: "multiple_choice", options: ["Nucleus", "Cytoplasm", "Cell membrane", "Ribosome"], answer: "Nucleus" },
    { q: "Plant cells have this structure that animal cells lack:", type: "multiple_choice", options: ["Cell wall", "Nucleus", "Mitochondria", "Ribosomes"], answer: "Cell wall" },
    { q: "The process by which cells divide is called:", type: "multiple_choice", options: ["Mitosis", "Photosynthesis", "Respiration", "Digestion"], answer: "Mitosis" },
    { q: "Which organelle makes proteins?", type: "multiple_choice", options: ["Ribosome", "Lysosome", "Vacuole", "Chloroplast"], answer: "Ribosome" },
    { q: "The cell membrane is:", type: "multiple_choice", options: ["Selectively permeable", "Completely impermeable", "Only in plants", "Made of cellulose"], answer: "Selectively permeable" },
    { q: "Chloroplasts are responsible for:", type: "multiple_choice", options: ["Photosynthesis", "Respiration", "Digestion", "Reproduction"], answer: "Photosynthesis" },
    { q: "Prokaryotic cells lack a:", type: "multiple_choice", options: ["Nucleus", "Cell membrane", "Cytoplasm", "Ribosome"], answer: "Nucleus" },
    { q: "The fluid inside a cell is called:", type: "multiple_choice", options: ["Cytoplasm", "Plasma", "Nucleoplasm", "Protoplasm"], answer: "Cytoplasm" },
    { q: "Explain the difference between prokaryotic and eukaryotic cells.", type: "short_answer", options: null, answer: "Prokaryotic cells lack a membrane-bound nucleus and organelles (like bacteria). Eukaryotic cells have a true nucleus and membrane-bound organelles (like plant and animal cells)." }
  ],
  540022: [ // Heredity and Evolution
    { q: "DNA stands for:", type: "multiple_choice", options: ["Deoxyribonucleic acid", "Diribonucleic acid", "Deoxyribose acid", "Dynamic nucleic acid"], answer: "Deoxyribonucleic acid" },
    { q: "Genes are segments of:", type: "multiple_choice", options: ["DNA", "Protein", "Carbohydrate", "Lipid"], answer: "DNA" },
    { q: "A dominant trait is expressed when:", type: "multiple_choice", options: ["One or two copies of the allele are present", "Only two copies are present", "No copies are present", "Only in males"], answer: "One or two copies of the allele are present" },
    { q: "Natural selection was proposed by:", type: "multiple_choice", options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Isaac Newton"], answer: "Charles Darwin" },
    { q: "A Punnett square is used to:", type: "multiple_choice", options: ["Predict genetic outcomes", "Measure DNA", "Count chromosomes", "Identify species"], answer: "Predict genetic outcomes" },
    { q: "Humans have how many chromosomes?", type: "multiple_choice", options: ["46", "23", "48", "44"], answer: "46" },
    { q: "A mutation is:", type: "multiple_choice", options: ["A change in DNA sequence", "Normal cell division", "Protein synthesis", "Cell death"], answer: "A change in DNA sequence" },
    { q: "Adaptation helps organisms:", type: "multiple_choice", options: ["Survive in their environment", "Reproduce faster", "Grow larger", "Live longer"], answer: "Survive in their environment" },
    { q: "Recessive traits are expressed when:", type: "multiple_choice", options: ["Two copies of the allele are present", "One copy is present", "The trait is dominant", "Always"], answer: "Two copies of the allele are present" },
    { q: "Evolution occurs over:", type: "multiple_choice", options: ["Many generations", "One lifetime", "A few days", "Instantly"], answer: "Many generations" },
    { q: "Explain how natural selection leads to evolution.", type: "short_answer", options: null, answer: "Organisms with traits better suited to their environment survive and reproduce more, passing those traits to offspring. Over generations, these advantageous traits become more common in the population." }
  ],
  540023: [ // Ecosystems and Biodiversity
    { q: "A food chain shows:", type: "multiple_choice", options: ["Energy flow through organisms", "Water cycle", "Carbon cycle", "Nitrogen cycle"], answer: "Energy flow through organisms" },
    { q: "Producers in an ecosystem are:", type: "multiple_choice", options: ["Plants and algae", "Animals", "Fungi", "Bacteria only"], answer: "Plants and algae" },
    { q: "Decomposers break down:", type: "multiple_choice", options: ["Dead organic matter", "Rocks", "Water", "Sunlight"], answer: "Dead organic matter" },
    { q: "Biodiversity refers to:", type: "multiple_choice", options: ["Variety of life forms", "Number of plants only", "Size of organisms", "Age of species"], answer: "Variety of life forms" },
    { q: "An ecosystem includes:", type: "multiple_choice", options: ["Living and non-living things", "Only animals", "Only plants", "Only water"], answer: "Living and non-living things" },
    { q: "Herbivores eat:", type: "multiple_choice", options: ["Plants", "Meat", "Both plants and meat", "Nothing"], answer: "Plants" },
    { q: "The water cycle includes:", type: "multiple_choice", options: ["Evaporation, condensation, precipitation", "Only rain", "Only evaporation", "Only condensation"], answer: "Evaporation, condensation, precipitation" },
    { q: "Apex predators are at the:", type: "multiple_choice", options: ["Top of the food chain", "Bottom of the food chain", "Middle of the food chain", "Outside the food chain"], answer: "Top of the food chain" },
    { q: "Symbiosis is:", type: "multiple_choice", options: ["A close relationship between species", "Competition", "Predation", "Decomposition"], answer: "A close relationship between species" },
    { q: "Habitat destruction threatens:", type: "multiple_choice", options: ["Biodiversity", "Only plants", "Only animals", "Nothing"], answer: "Biodiversity" },
    { q: "Explain the difference between a food chain and a food web.", type: "short_answer", options: null, answer: "A food chain shows a single linear pathway of energy transfer. A food web shows multiple interconnected food chains, representing the complex feeding relationships in an ecosystem." }
  ],
  540024: [ // Chemical Reactions
    { q: "In a chemical reaction, reactants become:", type: "multiple_choice", options: ["Products", "Elements", "Atoms", "Molecules only"], answer: "Products" },
    { q: "The law of conservation of mass states:", type: "multiple_choice", options: ["Mass is neither created nor destroyed", "Mass always increases", "Mass always decreases", "Mass can be created"], answer: "Mass is neither created nor destroyed" },
    { q: "A catalyst:", type: "multiple_choice", options: ["Speeds up a reaction without being consumed", "Slows down a reaction", "Is consumed in the reaction", "Has no effect"], answer: "Speeds up a reaction without being consumed" },
    { q: "An exothermic reaction:", type: "multiple_choice", options: ["Releases heat", "Absorbs heat", "Has no heat change", "Only occurs in cold"], answer: "Releases heat" },
    { q: "The pH scale measures:", type: "multiple_choice", options: ["Acidity and basicity", "Temperature", "Pressure", "Volume"], answer: "Acidity and basicity" },
    { q: "A pH of 7 is:", type: "multiple_choice", options: ["Neutral", "Acidic", "Basic", "Unknown"], answer: "Neutral" },
    { q: "Acids have a pH:", type: "multiple_choice", options: ["Below 7", "Above 7", "Exactly 7", "Of 14"], answer: "Below 7" },
    { q: "Combustion requires:", type: "multiple_choice", options: ["Fuel, oxygen, and heat", "Only fuel", "Only oxygen", "Only heat"], answer: "Fuel, oxygen, and heat" },
    { q: "Oxidation involves:", type: "multiple_choice", options: ["Loss of electrons", "Gain of electrons", "No electron change", "Only metals"], answer: "Loss of electrons" },
    { q: "Balancing a chemical equation ensures:", type: "multiple_choice", options: ["Equal atoms on both sides", "More products than reactants", "Fewer products", "Unequal atoms"], answer: "Equal atoms on both sides" },
    { q: "Explain the difference between an exothermic and endothermic reaction.", type: "short_answer", options: null, answer: "Exothermic reactions release energy (heat) to the surroundings, making them feel warm. Endothermic reactions absorb energy from the surroundings, making them feel cold." }
  ],
  540025: [ // Waves and Sound
    { q: "Sound travels fastest through:", type: "multiple_choice", options: ["Solids", "Liquids", "Gases", "Vacuum"], answer: "Solids" },
    { q: "The frequency of a wave is measured in:", type: "multiple_choice", options: ["Hertz", "Meters", "Seconds", "Joules"], answer: "Hertz" },
    { q: "Wavelength is the distance between:", type: "multiple_choice", options: ["Two consecutive crests", "Crest and trough", "Two troughs only", "Wave and source"], answer: "Two consecutive crests" },
    { q: "Amplitude determines a wave's:", type: "multiple_choice", options: ["Loudness or brightness", "Speed", "Frequency", "Wavelength"], answer: "Loudness or brightness" },
    { q: "Light waves are:", type: "multiple_choice", options: ["Electromagnetic waves", "Sound waves", "Mechanical waves", "Water waves"], answer: "Electromagnetic waves" },
    { q: "Sound cannot travel through:", type: "multiple_choice", options: ["A vacuum", "Air", "Water", "Metal"], answer: "A vacuum" },
    { q: "The Doppler effect explains:", type: "multiple_choice", options: ["Change in frequency due to motion", "Wave reflection", "Wave absorption", "Wave creation"], answer: "Change in frequency due to motion" },
    { q: "Reflection occurs when waves:", type: "multiple_choice", options: ["Bounce off a surface", "Pass through a medium", "Slow down", "Speed up"], answer: "Bounce off a surface" },
    { q: "Refraction is the bending of waves due to:", type: "multiple_choice", options: ["Change in speed", "Change in amplitude", "Change in frequency", "Reflection"], answer: "Change in speed" },
    { q: "Ultrasound has frequencies:", type: "multiple_choice", options: ["Above human hearing", "Below human hearing", "Within human hearing", "At zero"], answer: "Above human hearing" },
    { q: "Explain why sound travels faster in solids than in gases.", type: "short_answer", options: null, answer: "Sound travels faster in solids because particles are closer together and more tightly bonded, allowing vibrations to transfer more quickly from particle to particle." }
  ],
  540026: [ // Earth Structure and Processes
    { q: "The Earth's core is primarily made of:", type: "multiple_choice", options: ["Iron and nickel", "Silicon and oxygen", "Carbon and hydrogen", "Calcium and magnesium"], answer: "Iron and nickel" },
    { q: "Tectonic plates float on the:", type: "multiple_choice", options: ["Asthenosphere", "Core", "Crust", "Atmosphere"], answer: "Asthenosphere" },
    { q: "Earthquakes occur at:", type: "multiple_choice", options: ["Plate boundaries", "The core", "The atmosphere", "Ocean surfaces"], answer: "Plate boundaries" },
    { q: "The rock cycle describes:", type: "multiple_choice", options: ["Transformation of rock types", "Water movement", "Air circulation", "Plant growth"], answer: "Transformation of rock types" },
    { q: "Igneous rocks form from:", type: "multiple_choice", options: ["Cooled magma or lava", "Sediment layers", "Heat and pressure", "Erosion"], answer: "Cooled magma or lava" },
    { q: "Sedimentary rocks form from:", type: "multiple_choice", options: ["Compressed sediments", "Cooled lava", "Extreme heat", "Volcanic eruptions"], answer: "Compressed sediments" },
    { q: "Metamorphic rocks form from:", type: "multiple_choice", options: ["Heat and pressure on existing rocks", "Cooling magma", "Sediment deposition", "Erosion"], answer: "Heat and pressure on existing rocks" },
    { q: "Volcanoes form where:", type: "multiple_choice", options: ["Plates diverge or converge", "Plates are stable", "There is no tectonic activity", "Only in oceans"], answer: "Plates diverge or converge" },
    { q: "Erosion is caused by:", type: "multiple_choice", options: ["Wind, water, and ice", "Heat only", "Pressure only", "Earthquakes only"], answer: "Wind, water, and ice" },
    { q: "The Richter scale measures:", type: "multiple_choice", options: ["Earthquake magnitude", "Volcano height", "Rock hardness", "Wind speed"], answer: "Earthquake magnitude" },
    { q: "Describe the three main layers of the Earth.", type: "short_answer", options: null, answer: "The crust is the thin outer layer. The mantle is the thick middle layer of hot rock. The core is the center, with a liquid outer core and solid inner core, made of iron and nickel." }
  ],
  540027: [ // Space and Astronomy
    { q: "The Sun is a:", type: "multiple_choice", options: ["Star", "Planet", "Moon", "Asteroid"], answer: "Star" },
    { q: "Earth's moon causes:", type: "multiple_choice", options: ["Tides", "Seasons", "Day and night", "Earthquakes"], answer: "Tides" },
    { q: "A light-year measures:", type: "multiple_choice", options: ["Distance", "Time", "Speed", "Mass"], answer: "Distance" },
    { q: "The Milky Way is a:", type: "multiple_choice", options: ["Galaxy", "Star", "Planet", "Nebula"], answer: "Galaxy" },
    { q: "Seasons are caused by:", type: "multiple_choice", options: ["Earth's tilted axis", "Distance from the Sun", "Moon phases", "Solar flares"], answer: "Earth's tilted axis" },
    { q: "A solar eclipse occurs when:", type: "multiple_choice", options: ["The Moon blocks the Sun", "Earth blocks the Sun", "The Sun blocks the Moon", "Stars align"], answer: "The Moon blocks the Sun" },
    { q: "The planets orbit the Sun due to:", type: "multiple_choice", options: ["Gravity", "Magnetism", "Electricity", "Wind"], answer: "Gravity" },
    { q: "The largest planet in our solar system is:", type: "multiple_choice", options: ["Jupiter", "Saturn", "Neptune", "Earth"], answer: "Jupiter" },
    { q: "A comet is made of:", type: "multiple_choice", options: ["Ice and dust", "Rock only", "Gas only", "Metal only"], answer: "Ice and dust" },
    { q: "The Big Bang theory explains:", type: "multiple_choice", options: ["The origin of the universe", "Star formation only", "Planet formation only", "Moon phases"], answer: "The origin of the universe" },
    { q: "Explain why we have day and night on Earth.", type: "short_answer", options: null, answer: "Earth rotates on its axis once every 24 hours. The side facing the Sun experiences day, while the side facing away experiences night." }
  ],
  540028: [ // Data Interpretation in Science
    { q: "A hypothesis is:", type: "multiple_choice", options: ["A testable prediction", "A proven fact", "A final conclusion", "Random guess"], answer: "A testable prediction" },
    { q: "The independent variable is:", type: "multiple_choice", options: ["What the scientist changes", "What is measured", "Kept constant", "The conclusion"], answer: "What the scientist changes" },
    { q: "The dependent variable is:", type: "multiple_choice", options: ["What is measured", "What is changed", "Kept constant", "The hypothesis"], answer: "What is measured" },
    { q: "A control group:", type: "multiple_choice", options: ["Does not receive the treatment", "Receives the treatment", "Is not part of the experiment", "Is always larger"], answer: "Does not receive the treatment" },
    { q: "A bar graph is best for:", type: "multiple_choice", options: ["Comparing categories", "Showing trends over time", "Displaying percentages", "Showing relationships"], answer: "Comparing categories" },
    { q: "A line graph is best for:", type: "multiple_choice", options: ["Showing trends over time", "Comparing categories", "Displaying parts of a whole", "Random data"], answer: "Showing trends over time" },
    { q: "Correlation means:", type: "multiple_choice", options: ["Two variables are related", "One causes the other", "Variables are unrelated", "Data is random"], answer: "Two variables are related" },
    { q: "A scientific theory is:", type: "multiple_choice", options: ["A well-supported explanation", "An untested idea", "A guess", "Always wrong"], answer: "A well-supported explanation" },
    { q: "Replication in experiments:", type: "multiple_choice", options: ["Increases reliability", "Decreases accuracy", "Is unnecessary", "Wastes time"], answer: "Increases reliability" },
    { q: "Bias in an experiment:", type: "multiple_choice", options: ["Should be minimized", "Is always helpful", "Cannot be avoided", "Improves results"], answer: "Should be minimized" },
    { q: "Explain the difference between correlation and causation.", type: "short_answer", options: null, answer: "Correlation means two variables change together, but one doesn't necessarily cause the other. Causation means one variable directly causes a change in another." }
  ],
  540029: [ // Science Test-Taking Strategies
    { q: "When reading a science passage, first:", type: "multiple_choice", options: ["Skim for main ideas", "Memorize every detail", "Skip to questions", "Read very slowly"], answer: "Skim for main ideas" },
    { q: "For data interpretation questions:", type: "multiple_choice", options: ["Read axis labels carefully", "Ignore the graph", "Guess immediately", "Skip them"], answer: "Read axis labels carefully" },
    { q: "If a question asks about a graph:", type: "multiple_choice", options: ["Look at the graph first", "Ignore the graph", "Only read the question", "Guess the answer"], answer: "Look at the graph first" },
    { q: "Scientific vocabulary should be:", type: "multiple_choice", options: ["Understood in context", "Memorized randomly", "Ignored", "Made up"], answer: "Understood in context" },
    { q: "Process of elimination helps by:", type: "multiple_choice", options: ["Removing wrong answers", "Adding confusion", "Wasting time", "Nothing"], answer: "Removing wrong answers" },
    { q: "For experiment-based questions:", type: "multiple_choice", options: ["Identify variables and controls", "Skip the procedure", "Ignore the hypothesis", "Guess randomly"], answer: "Identify variables and controls" },
    { q: "Time management means:", type: "multiple_choice", options: ["Pacing yourself", "Rushing", "Taking breaks often", "Ignoring time"], answer: "Pacing yourself" },
    { q: "If stuck on a question:", type: "multiple_choice", options: ["Mark it and return later", "Spend 10 minutes on it", "Give up", "Leave it blank"], answer: "Mark it and return later" },
    { q: "Reading all answer choices is important because:", type: "multiple_choice", options: ["The best answer may be last", "It wastes time", "First answer is always right", "It confuses you"], answer: "The best answer may be last" },
    { q: "Checking your work:", type: "multiple_choice", options: ["Catches careless errors", "Wastes time", "Is not helpful", "Changes correct answers"], answer: "Catches careless errors" },
    { q: "Describe a strategy for answering science questions with graphs or data tables.", type: "short_answer", options: null, answer: "First read the title and axis labels to understand what is being shown. Then read the question carefully. Look at the specific data needed to answer. Eliminate wrong answers based on the data." }
  ],
  540030: [ // Science Practice and Review
    { q: "Photosynthesis produces:", type: "multiple_choice", options: ["Glucose and oxygen", "Carbon dioxide and water", "Protein and fat", "Only water"], answer: "Glucose and oxygen" },
    { q: "Newton's first law states:", type: "multiple_choice", options: ["Objects at rest stay at rest unless acted upon", "Force equals mass times acceleration", "Every action has an equal reaction", "Energy cannot be created"], answer: "Objects at rest stay at rest unless acted upon" },
    { q: "The atomic number represents:", type: "multiple_choice", options: ["Number of protons", "Number of neutrons", "Atomic mass", "Number of electrons only"], answer: "Number of protons" },
    { q: "Mitosis results in:", type: "multiple_choice", options: ["Two identical cells", "Four different cells", "One larger cell", "Cell death"], answer: "Two identical cells" },
    { q: "The greenhouse effect is caused by:", type: "multiple_choice", options: ["Gases trapping heat", "Ozone depletion", "Solar flares", "Volcanic eruptions"], answer: "Gases trapping heat" },
    { q: "Kinetic energy is:", type: "multiple_choice", options: ["Energy of motion", "Stored energy", "Heat energy only", "Light energy only"], answer: "Energy of motion" },
    { q: "An atom with more electrons than protons is:", type: "multiple_choice", options: ["Negatively charged", "Positively charged", "Neutral", "Unstable only"], answer: "Negatively charged" },
    { q: "The water cycle is driven by:", type: "multiple_choice", options: ["The Sun's energy", "The Moon", "Earthquakes", "Volcanoes"], answer: "The Sun's energy" },
    { q: "Density equals:", type: "multiple_choice", options: ["Mass divided by volume", "Mass times volume", "Volume divided by mass", "Mass plus volume"], answer: "Mass divided by volume" },
    { q: "Cellular respiration produces:", type: "multiple_choice", options: ["ATP energy", "Glucose", "Oxygen", "Sunlight"], answer: "ATP energy" },
    { q: "Explain the relationship between photosynthesis and cellular respiration.", type: "short_answer", options: null, answer: "Photosynthesis uses sunlight, water, and CO2 to produce glucose and oxygen. Cellular respiration uses glucose and oxygen to produce ATP energy, water, and CO2. They are opposite processes that cycle matter and energy." }
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

console.log(`\nTotal GED-SCI quizzes created: ${totalQuizzes}`);
await connection.end();
