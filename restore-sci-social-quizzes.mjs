import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Starting Science & Social Studies Quiz Restoration...\n');

// GED SCIENCE Quiz Data (lesson IDs 540021-540030)
const scienceQuizzes = {
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
    { q: "A bar graph is best used for:", type: "multiple_choice", options: ["Comparing categories", "Showing trends over time", "Displaying parts of a whole", "Showing relationships"], answer: "Comparing categories" },
    { q: "A line graph shows:", type: "multiple_choice", options: ["Trends over time", "Comparisons between groups", "Parts of a whole", "Categories only"], answer: "Trends over time" },
    { q: "A pie chart displays:", type: "multiple_choice", options: ["Parts of a whole", "Trends over time", "Comparisons between groups", "Relationships"], answer: "Parts of a whole" },
    { q: "The x-axis on a graph typically shows:", type: "multiple_choice", options: ["Independent variable", "Dependent variable", "Time periods", "Categories"], answer: "Independent variable" },
    { q: "The y-axis on a graph typically shows:", type: "multiple_choice", options: ["Dependent variable", "Independent variable", "Time", "Categories"], answer: "Dependent variable" },
    { q: "A scatter plot shows:", type: "multiple_choice", options: ["Relationship between two variables", "Trends over time", "Comparisons between groups", "Parts of a whole"], answer: "Relationship between two variables" },
    { q: "Data that is spread out is:", type: "multiple_choice", options: ["Dispersed", "Concentrated", "Linear", "Clustered"], answer: "Dispersed" },
    { q: "A correlation shows:", type: "multiple_choice", options: ["Relationship between variables", "Cause and effect", "Time periods", "Categories"], answer: "Relationship between variables" },
    { q: "An outlier is:", type: "multiple_choice", options: ["A data point far from others", "A typical data point", "An average", "A trend"], answer: "A data point far from others" },
    { q: "The mode is:", type: "multiple_choice", options: ["The most frequent value", "The middle value", "The average", "The range"], answer: "The most frequent value" },
    { q: "Explain how to interpret a line graph showing temperature changes over a month.", type: "short_answer", options: null, answer: "Look at the x-axis for dates and y-axis for temperature. Follow the line to see how temperature changes over time. Identify peaks (high temperatures), valleys (low temperatures), and overall trends (increasing, decreasing, or stable)." }
  ],
  540029: [ // Science Test-Taking Strategies
    { q: "When taking a science test, you should first:", type: "multiple_choice", options: ["Read all questions carefully", "Answer the hardest questions", "Skip all questions", "Guess randomly"], answer: "Read all questions carefully" },
    { q: "If unsure about an answer, you should:", type: "multiple_choice", options: ["Mark it and return later", "Guess immediately", "Leave it blank", "Change your first answer"], answer: "Mark it and return later" },
    { q: "Diagrams in science tests are:", type: "multiple_choice", options: ["Helpful for understanding", "Confusing", "Not important", "Only for decoration"], answer: "Helpful for understanding" },
    { q: "When answering multiple choice, you should:", type: "multiple_choice", options: ["Eliminate wrong answers first", "Pick the first answer", "Always pick C", "Skip difficult ones"], answer: "Eliminate wrong answers first" },
    { q: "Short answer questions require:", type: "multiple_choice", options: ["Clear, concise explanations", "One-word answers", "Long essays", "No explanation"], answer: "Clear, concise explanations" },
    { q: "When interpreting data, you should:", type: "multiple_choice", options: ["Look at labels and units", "Guess the meaning", "Ignore small differences", "Skip the data"], answer: "Look at labels and units" },
    { q: "Scientific vocabulary is important because:", type: "multiple_choice", options: ["It ensures precise communication", "It makes answers longer", "It is not important", "It confuses readers"], answer: "It ensures precise communication" },
    { q: "Time management on a science test means:", type: "multiple_choice", options: ["Pacing yourself through questions", "Rushing through everything", "Spending all time on one question", "Ignoring the clock"], answer: "Pacing yourself through questions" },
    { q: "If you don't know an answer, you should:", type: "multiple_choice", options: ["Use logic and eliminate options", "Leave it blank", "Write anything", "Panic"], answer: "Use logic and eliminate options" },
    { q: "Checking your work is important because:", type: "multiple_choice", options: ["It catches careless errors", "It wastes time", "It is not necessary", "It confuses you"], answer: "It catches careless errors" },
    { q: "Describe a strategy for answering difficult science questions.", type: "short_answer", options: null, answer: "Read carefully, identify what is being asked, use process of elimination to remove wrong answers, think about related concepts, and if still unsure, make an educated guess based on remaining options." }
  ],
  540030: [ // Science Practice and Review
    { q: "Photosynthesis produces:", type: "multiple_choice", options: ["Glucose and oxygen", "Carbon dioxide and water", "Proteins and fats", "Minerals and vitamins"], answer: "Glucose and oxygen" },
    { q: "Cellular respiration breaks down:", type: "multiple_choice", options: ["Glucose to release energy", "Proteins to build cells", "Fats to create heat", "Water to release hydrogen"], answer: "Glucose to release energy" },
    { q: "The human circulatory system includes:", type: "multiple_choice", options: ["Heart, blood, and blood vessels", "Lungs and trachea", "Stomach and intestines", "Brain and nerves"], answer: "Heart, blood, and blood vessels" },
    { q: "The respiratory system's main function is:", type: "multiple_choice", options: ["Gas exchange", "Digestion", "Circulation", "Movement"], answer: "Gas exchange" },
    { q: "The nervous system controls:", type: "multiple_choice", options: ["Body functions and responses", "Digestion only", "Movement only", "Breathing only"], answer: "Body functions and responses" },
    { q: "Gravity is:", type: "multiple_choice", options: ["A force that attracts objects", "A type of energy", "A chemical reaction", "A wave"], answer: "A force that attracts objects" },
    { q: "Velocity is:", type: "multiple_choice", options: ["Speed in a direction", "Speed only", "Distance only", "Time only"], answer: "Speed in a direction" },
    { q: "Energy cannot be:", type: "multiple_choice", options: ["Created or destroyed", "Transferred", "Transformed", "Used"], answer: "Created or destroyed" },
    { q: "An atom consists of:", type: "multiple_choice", options: ["Protons, neutrons, and electrons", "Protons only", "Electrons only", "Molecules"], answer: "Protons, neutrons, and electrons" },
    { q: "The periodic table organizes:", type: "multiple_choice", options: ["Chemical elements", "Compounds", "Molecules", "Atoms only"], answer: "Chemical elements" },
    { q: "Explain the relationship between photosynthesis and cellular respiration.", type: "short_answer", options: null, answer: "Photosynthesis uses sunlight to create glucose and oxygen from carbon dioxide and water. Cellular respiration breaks down glucose to release energy, consuming oxygen and producing carbon dioxide and water. They are complementary processes." }
  ]
};

// GED SOCIAL STUDIES Quiz Data (lesson IDs 540031-540040)
const socialQuizzes = {
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
    { q: "The Fourth Amendment protects against:", type: "multiple_choice", options: ["Unreasonable search and seizure", "Cruel punishment", "Self-incrimination", "Double jeopardy"], answer: "Unreasonable search and seizure" },
    { q: "The Fifth Amendment includes:", type: "multiple_choice", options: ["Right against self-incrimination", "Right to bear arms", "Freedom of speech", "Right to vote"], answer: "Right against self-incrimination" },
    { q: "The Sixth Amendment guarantees:", type: "multiple_choice", options: ["Right to a fair trial", "Freedom of speech", "Right to vote", "Freedom of religion"], answer: "Right to a fair trial" },
    { q: "The Eighth Amendment prohibits:", type: "multiple_choice", options: ["Cruel and unusual punishment", "Slavery", "Discrimination", "Unreasonable searches"], answer: "Cruel and unusual punishment" },
    { q: "The 13th Amendment abolished:", type: "multiple_choice", options: ["Slavery", "Segregation", "Discrimination", "Voting restrictions"], answer: "Slavery" },
    { q: "The 19th Amendment granted:", type: "multiple_choice", options: ["Women the right to vote", "Voting rights to all races", "Citizenship to immigrants", "Freedom of speech"], answer: "Women the right to vote" },
    { q: "The 26th Amendment lowered the voting age to:", type: "multiple_choice", options: ["18", "16", "20", "21"], answer: "18" },
    { q: "The Bill of Rights includes:", type: "multiple_choice", options: ["First 10 Amendments", "All Amendments", "Amendments 11-27", "Constitutional preamble"], answer: "First 10 Amendments" },
    { q: "Explain why the Bill of Rights was important to the founding of the United States.", type: "short_answer", options: null, answer: "The Bill of Rights protected individual liberties and limited government power. It was added to the Constitution to ensure that citizens' fundamental rights to free speech, religion, assembly, and due process were protected from government interference." }
  ],
  540035: [ // Branches of Government
    { q: "The legislative branch includes:", type: "multiple_choice", options: ["Congress (Senate and House)", "President and Cabinet", "Supreme Court", "State governors"], answer: "Congress (Senate and House)" },
    { q: "The executive branch is headed by:", type: "multiple_choice", options: ["The President", "The Speaker of the House", "The Chief Justice", "The Senate Majority Leader"], answer: "The President" },
    { q: "The judicial branch includes:", type: "multiple_choice", options: ["Supreme Court and federal courts", "Congress", "The President", "State legislatures"], answer: "Supreme Court and federal courts" },
    { q: "The Senate has:", type: "multiple_choice", options: ["100 members (2 per state)", "435 members", "9 justices", "50 members"], answer: "100 members (2 per state)" },
    { q: "The House of Representatives has:", type: "multiple_choice", options: ["435 members based on population", "100 members", "9 justices", "50 members"], answer: "435 members based on population" },
    { q: "The President's term lasts:", type: "multiple_choice", options: ["4 years", "6 years", "8 years", "Life"], answer: "4 years" },
    { q: "A President can serve a maximum of:", type: "multiple_choice", options: ["2 terms (8 years)", "3 terms", "4 terms", "Unlimited"], answer: "2 terms (8 years)" },
    { q: "The Supreme Court has:", type: "multiple_choice", options: ["9 justices", "7 justices", "11 justices", "15 justices"], answer: "9 justices" },
    { q: "Checks and balances ensure:", type: "multiple_choice", options: ["No single branch has too much power", "The President rules alone", "Congress makes all decisions", "The courts control everything"], answer: "No single branch has too much power" },
    { q: "Impeachment is a power of:", type: "multiple_choice", options: ["Congress", "The President", "The Supreme Court", "State governors"], answer: "Congress" },
    { q: "Explain how the system of checks and balances works in the U.S. government.", type: "short_answer", options: null, answer: "Each branch of government has powers to limit the others. For example, Congress passes laws but the President can veto them, and the Supreme Court can rule laws unconstitutional. This prevents any one branch from becoming too powerful." }
  ],
  540036: [ // Global Economics and Trade
    { q: "Capitalism is an economic system based on:", type: "multiple_choice", options: ["Private ownership and free markets", "Government control", "Shared resources", "Barter only"], answer: "Private ownership and free markets" },
    { q: "Socialism emphasizes:", type: "multiple_choice", options: ["Collective or government ownership", "Private ownership", "Individual profit", "Barter systems"], answer: "Collective or government ownership" },
    { q: "Supply and demand affect:", type: "multiple_choice", options: ["Prices", "Production", "Employment", "All of the above"], answer: "All of the above" },
    { q: "Inflation is:", type: "multiple_choice", options: ["Increase in prices over time", "Decrease in prices", "Stable prices", "Fixed exchange rates"], answer: "Increase in prices over time" },
    { q: "Unemployment occurs when:", type: "multiple_choice", options: ["People cannot find jobs", "Everyone has jobs", "Prices are stable", "Trade increases"], answer: "People cannot find jobs" },
    { q: "Imports are:", type: "multiple_choice", options: ["Goods brought into a country", "Goods sent out of a country", "Domestic products", "Services only"], answer: "Goods brought into a country" },
    { q: "Exports are:", type: "multiple_choice", options: ["Goods sent out of a country", "Goods brought in", "Domestic consumption", "Services only"], answer: "Goods sent out of a country" },
    { q: "A trade deficit occurs when:", type: "multiple_choice", options: ["Imports exceed exports", "Exports exceed imports", "Trade is balanced", "No trade occurs"], answer: "Imports exceed exports" },
    { q: "Tariffs are:", type: "multiple_choice", options: ["Taxes on imported goods", "Taxes on exports", "Income taxes", "Sales taxes"], answer: "Taxes on imported goods" },
    { q: "Globalization involves:", type: "multiple_choice", options: ["Increased international trade and cultural exchange", "Isolation of countries", "Reduced trade", "Local markets only"], answer: "Increased international trade and cultural exchange" },
    { q: "Explain how supply and demand determine prices in a market economy.", type: "short_answer", options: null, answer: "When demand for a product increases and supply stays the same, prices rise. When supply increases and demand stays the same, prices fall. When supply and demand are balanced, prices stabilize. This interaction determines market prices." }
  ],
  540037: [ // World History and Cultures
    { q: "The Renaissance began in:", type: "multiple_choice", options: ["Italy", "France", "Spain", "Germany"], answer: "Italy" },
    { q: "The Industrial Revolution started in:", type: "multiple_choice", options: ["Britain", "France", "Germany", "America"], answer: "Britain" },
    { q: "The French Revolution occurred in:", type: "multiple_choice", options: ["1789", "1776", "1815", "1848"], answer: "1789" },
    { q: "The Enlightenment emphasized:", type: "multiple_choice", options: ["Reason and science", "Religious authority", "Tradition only", "Monarchy"], answer: "Reason and science" },
    { q: "Imperialism refers to:", type: "multiple_choice", options: ["One country controlling others", "Trade agreements", "Cultural exchange", "Military alliances"], answer: "One country controlling others" },
    { q: "World War I ended in:", type: "multiple_choice", options: ["1918", "1914", "1920", "1922"], answer: "1918" },
    { q: "World War II ended in:", type: "multiple_choice", options: ["1945", "1939", "1941", "1950"], answer: "1945" },
    { q: "The Cold War was between:", type: "multiple_choice", options: ["USA and Soviet Union", "Britain and Germany", "France and Russia", "China and Japan"], answer: "USA and Soviet Union" },
    { q: "Decolonization refers to:", type: "multiple_choice", options: ["Independence of former colonies", "Expansion of empires", "Trade partnerships", "Military alliances"], answer: "Independence of former colonies" },
    { q: "Globalization has led to:", type: "multiple_choice", options: ["Increased cultural and economic connections", "Isolation of countries", "Reduced trade", "Local self-sufficiency"], answer: "Increased cultural and economic connections" },
    { q: "Explain the impact of the Industrial Revolution on world history.", type: "short_answer", options: null, answer: "The Industrial Revolution transformed economies from agricultural to industrial, increased production and wealth, created new social classes, led to urbanization, and eventually spread globally, reshaping society and laying the foundation for the modern world." }
  ],
  540038: [ // Document Analysis and Primary Sources
    { q: "A primary source is:", type: "multiple_choice", options: ["A firsthand account from the time period", "An interpretation by historians", "A textbook", "A modern analysis"], answer: "A firsthand account from the time period" },
    { q: "A secondary source is:", type: "multiple_choice", options: ["An interpretation by historians", "A firsthand account", "Original documents", "Eyewitness testimony"], answer: "An interpretation by historians" },
    { q: "When analyzing documents, you should consider:", type: "multiple_choice", options: ["Author, date, purpose, and context", "Only the main idea", "Only the author", "Only the date"], answer: "Author, date, purpose, and context" },
    { q: "Bias in a document means:", type: "multiple_choice", options: ["A one-sided perspective", "Factual accuracy", "Neutral reporting", "Objective analysis"], answer: "A one-sided perspective" },
    { q: "Historical context helps us:", type: "multiple_choice", options: ["Understand events in their time period", "Ignore the past", "Judge people by modern standards", "Avoid learning from history"], answer: "Understand events in their time period" },
    { q: "Credibility of a source depends on:", type: "multiple_choice", options: ["Author expertise, evidence, and corroboration", "How old it is", "How long it is", "How famous the author is"], answer: "Author expertise, evidence, and corroboration" },
    { q: "Corroboration means:", type: "multiple_choice", options: ["Multiple sources confirming information", "One source only", "Recent sources", "Official sources"], answer: "Multiple sources confirming information" },
    { q: "A propaganda document is:", type: "multiple_choice", options: ["Designed to persuade or manipulate", "Factually accurate", "Neutral reporting", "Objective analysis"], answer: "Designed to persuade or manipulate" },
    { q: "When comparing documents, look for:", type: "multiple_choice", options: ["Similarities and differences in perspective", "Only similarities", "Only differences", "The longest document"], answer: "Similarities and differences in perspective" },
    { q: "Interpreting documents requires:", type: "multiple_choice", options: ["Critical thinking and analysis", "Accepting everything at face value", "Ignoring the author's perspective", "Only reading the conclusion"], answer: "Critical thinking and analysis" },
    { q: "Explain how to evaluate the credibility of a historical document.", type: "short_answer", options: null, answer: "Consider the author's expertise and potential bias, check if the information is corroborated by other sources, examine the date and context, look for evidence and reasoning, and assess whether the author had firsthand knowledge or was reporting secondhand information." }
  ],
  540039: [ // Social Studies Test-Taking Strategies
    { q: "When taking a social studies test, start by:", type: "multiple_choice", options: ["Reading all questions carefully", "Answering the hardest questions first", "Guessing randomly", "Skipping the essay"], answer: "Reading all questions carefully" },
    { q: "For multiple choice questions, you should:", type: "multiple_choice", options: ["Eliminate obviously wrong answers", "Pick the first answer", "Always choose the longest answer", "Skip difficult ones"], answer: "Eliminate obviously wrong answers" },
    { q: "Essay questions require:", type: "multiple_choice", options: ["Clear thesis, evidence, and explanation", "One sentence answers", "No organization", "Only opinions"], answer: "Clear thesis, evidence, and explanation" },
    { q: "Document-based questions ask you to:", type: "multiple_choice", options: ["Analyze sources and support arguments", "Memorize facts", "Ignore the documents", "Write opinions only"], answer: "Analyze sources and support arguments" },
    { q: "Dates and events are important because:", type: "multiple_choice", options: ["They show chronological order and cause-effect", "They are not important", "They are only for memorization", "They confuse the topic"], answer: "They show chronological order and cause-effect" },
    { q: "Maps and charts in social studies tests:", type: "multiple_choice", options: ["Provide important information to interpret", "Are decorative only", "Should be ignored", "Are always easy"], answer: "Provide important information to interpret" },
    { q: "Vocabulary in social studies is important for:", type: "multiple_choice", options: ["Precise communication of concepts", "Making answers longer", "Impressing the teacher", "Confusing the reader"], answer: "Precise communication of concepts" },
    { q: "Time management on a test means:", type: "multiple_choice", options: ["Allocating time to each question type", "Rushing through everything", "Spending all time on one question", "Ignoring the clock"], answer: "Allocating time to each question type" },
    { q: "If you don't know an answer, you should:", type: "multiple_choice", options: ["Use context clues and logic", "Leave it blank", "Write anything", "Panic"], answer: "Use context clues and logic" },
    { q: "Reviewing your answers helps:", type: "multiple_choice", options: ["Catch careless errors", "Waste time", "Lower your score", "Confuse you"], answer: "Catch careless errors" },
    { q: "Describe a strategy for answering difficult essay questions on a social studies test.", type: "short_answer", options: null, answer: "Read the question carefully to understand what is being asked. Brainstorm main points and evidence. Write a clear thesis statement. Organize your response with an introduction, body paragraphs with evidence, and a conclusion. Review for clarity and accuracy." }
  ],
  540040: [ // Social Studies Practice and Review
    { q: "The three branches of government are:", type: "multiple_choice", options: ["Legislative, Executive, Judicial", "Federal, State, Local", "Senate, House, Courts", "President, Congress, Military"], answer: "Legislative, Executive, Judicial" },
    { q: "The Constitution establishes:", type: "multiple_choice", options: ["The framework for U.S. government", "Laws only", "The President's powers", "Congressional districts"], answer: "The framework for U.S. government" },
    { q: "Federalism means:", type: "multiple_choice", options: ["Power shared between national and state governments", "All power with the national government", "All power with state governments", "Power with local governments only"], answer: "Power shared between national and state governments" },
    { q: "The Great Depression was caused by:", type: "multiple_choice", options: ["Stock market crash and bank failures", "World War I", "Inflation only", "Government spending"], answer: "Stock market crash and bank failures" },
    { q: "The Civil Rights Movement addressed:", type: "multiple_choice", options: ["Racial discrimination and inequality", "Economic issues only", "Foreign policy", "Environmental concerns"], answer: "Racial discrimination and inequality" },
    { q: "Manifest Destiny was the belief that:", type: "multiple_choice", options: ["US should expand to the Pacific", "Slavery was justified", "Native Americans should rule", "Isolationism was best"], answer: "US should expand to the Pacific" },
    { q: "The Monroe Doctrine stated that:", type: "multiple_choice", options: ["Europe should not interfere in Americas", "US should expand to Europe", "Colonialism was good", "Trade was unnecessary"], answer: "Europe should not interfere in Americas" },
    { q: "Sectionalism refers to:", type: "multiple_choice", options: ["Loyalty to one's region over the nation", "National unity", "International cooperation", "Local government"], answer: "Loyalty to one's region over the nation" },
    { q: "Westward expansion led to:", type: "multiple_choice", options: ["Conflict with Native Americans", "Peace and harmony", "Reduced settlement", "European colonization"], answer: "Conflict with Native Americans" },
    { q: "The Industrial Revolution changed:", type: "multiple_choice", options: ["Production methods and society", "Only transportation", "Only agriculture", "Only communication"], answer: "Production methods and society" },
    { q: "Explain the relationship between the American Revolution and the Declaration of Independence.", type: "short_answer", options: null, answer: "The Declaration of Independence (1776) justified the American Revolution by stating that colonists had the right to rebel against unjust government. It outlined reasons for independence and established principles of natural rights and self-government that guided the Revolutionary War." }
  ]
};

let totalInserted = 0;

// Insert Science quizzes
console.log('=== Inserting GED Science Quizzes ===\n');
for (const [lessonId, questions] of Object.entries(scienceQuizzes)) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
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
      totalInserted++;
    } catch (error) {
      console.error(`Error inserting quiz for lesson ${lessonId}:`, error.message);
    }
  }
  console.log(`✅ Added ${questions.length} quizzes for Science lesson ${lessonId}`);
}

// Insert Social Studies quizzes
console.log('\n=== Inserting GED Social Studies Quizzes ===\n');
for (const [lessonId, questions] of Object.entries(socialQuizzes)) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
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
      totalInserted++;
    } catch (error) {
      console.error(`Error inserting quiz for lesson ${lessonId}:`, error.message);
    }
  }
  console.log(`✅ Added ${questions.length} quizzes for Social Studies lesson ${lessonId}`);
}

console.log(`\n✅ Total quiz questions inserted: ${totalInserted}`);
console.log('✅ GED Science & Social Studies quizzes restoration complete!');
await connection.end();
