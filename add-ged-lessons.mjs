// Using built-in fetch (Node 18+)

const API_URL = 'https://3000-i9nxlz0y9rbipwws2kmnd-df6539f8.us2.manus.computer/api/trpc';

const GED_LESSONS = {
  'GED-MATH': [
    { title: 'Number Sense and Operations', content: 'Understanding integers, fractions, decimals, percentages, and basic arithmetic operations. Learn how to work with positive and negative numbers, order of operations, and real-world applications.' },
    { title: 'Algebraic Thinking', content: 'Introduction to variables, expressions, equations, and functions. Learn to solve linear equations, work with polynomials, and understand algebraic relationships.' },
    { title: 'Geometry and Measurement', content: 'Explore shapes, angles, area, volume, and the Pythagorean theorem. Understand coordinate geometry and how to apply geometric concepts to real-world problems.' },
    { title: 'Data Analysis and Probability', content: 'Learn to interpret graphs, charts, and statistical data. Understand mean, median, mode, and basic probability concepts.' },
    { title: 'Functions and Patterns', content: 'Understand function notation, domain and range, and how to identify patterns in sequences and data.' },
    { title: 'Rational Expressions and Equations', content: 'Work with fractions containing variables, solve rational equations, and understand asymptotes.' },
    { title: 'Quadratic Functions', content: 'Master quadratic equations, parabolas, and the quadratic formula. Learn to factor and complete the square.' },
    { title: 'Exponential and Radical Expressions', content: 'Understand exponent rules, radicals, and rational exponents. Learn to simplify and solve equations with these expressions.' },
  ],
  'GED-RLA': [
    { title: 'Reading Comprehension Strategies', content: 'Learn techniques to understand main ideas, supporting details, and author\'s purpose. Practice identifying tone, bias, and inference in texts.' },
    { title: 'Vocabulary in Context', content: 'Develop skills to determine word meanings from context clues. Learn prefixes, suffixes, and root words to expand vocabulary.' },
    { title: 'Grammar Fundamentals', content: 'Master sentence structure, parts of speech, and basic grammar rules. Understand subjects, predicates, and sentence types.' },
    { title: 'Punctuation and Mechanics', content: 'Learn correct use of commas, semicolons, colons, apostrophes, and other punctuation marks. Understand capitalization rules.' },
    { title: 'Writing Process and Organization', content: 'Develop skills in planning, drafting, revising, and editing. Learn to organize ideas logically and create coherent paragraphs.' },
    { title: 'Argumentative Writing', content: 'Learn to construct arguments with evidence, counterarguments, and logical reasoning. Understand persuasive techniques and how to support claims.' },
    { title: 'Literary Analysis', content: 'Analyze themes, characters, plot, and literary devices in fiction. Learn to interpret symbolism and author\'s craft.' },
    { title: 'Informational Text Analysis', content: 'Understand how to analyze non-fiction texts, identify key information, and evaluate credibility of sources.' },
  ],
  'GED-SCI': [
    { title: 'Life Science Fundamentals', content: 'Introduction to cells, genetics, evolution, and ecology. Understand the structure and function of living organisms.' },
    { title: 'Human Body Systems', content: 'Learn about the circulatory, respiratory, digestive, nervous, and other body systems. Understand how they work together to maintain health.' },
    { title: 'Physical Science Basics', content: 'Explore matter, energy, forces, and motion. Understand atoms, elements, and basic chemistry concepts.' },
    { title: 'Earth and Space Science', content: 'Learn about Earth\'s structure, weather systems, the water cycle, and basic astronomy. Understand plate tectonics and geological processes.' },
    { title: 'Chemical Reactions and Bonding', content: 'Understand how atoms bond, chemical equations, and types of reactions. Learn about acids, bases, and pH.' },
    { title: 'Energy and Waves', content: 'Explore kinetic and potential energy, conservation of energy, and properties of waves including sound and light.' },
    { title: 'Ecosystems and Biodiversity', content: 'Understand food chains, food webs, population dynamics, and biodiversity. Learn about human impact on ecosystems.' },
    { title: 'Scientific Method and Inquiry', content: 'Learn to design experiments, collect data, analyze results, and draw conclusions. Understand the importance of scientific evidence.' },
  ],
  'GED-SS': [
    { title: 'Early American History', content: 'Explore Native American civilizations, European exploration, colonial America, and the founding of the United States.' },
    { title: 'American Revolution and Constitution', content: 'Understand the causes and events of the American Revolution, the Declaration of Independence, and the Constitution.' },
    { title: 'Westward Expansion and Civil War', content: 'Learn about manifest destiny, slavery, the Civil War, and Reconstruction. Understand the causes and consequences of these periods.' },
    { title: 'Industrial Revolution and Progressive Era', content: 'Explore industrialization, immigration, labor movements, and reform movements in America.' },
    { title: 'American Imperialism and World Wars', content: 'Understand American expansion, World War I, the Great Depression, and World War II.' },
    { title: 'Cold War and Modern America', content: 'Learn about the Cold War, space race, civil rights movement, and contemporary American history.' },
    { title: 'World History and Civilizations', content: 'Explore major world civilizations, empires, and global historical events that shaped our world.' },
    { title: 'Civics and Government', content: 'Understand the structure of government, the three branches, voting, rights and responsibilities, and the political process.' },
  ],
};

async function getCourseIds() {
  try {
    const response = await fetch(`${API_URL}/courses.list`);
    const data = await response.json();
    
    if (!data.result || !data.result.data) {
      throw new Error('Failed to fetch courses');
    }
    
    const courseMap = {};
    for (const course of data.result.data) {
      if (course.code in GED_LESSONS) {
        courseMap[course.code] = course.id;
      }
    }
    
    return courseMap;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

async function addLessonsToCourse(courseId, lessons) {
  try {
    const response = await fetch(`${API_URL}/lessons.bulkCreate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: {
          courseId,
          lessons
        }
      })
    });
    
    const data = await response.json();
    return data.result?.data || null;
  } catch (error) {
    console.error(`Error adding lessons to course ${courseId}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Fetching GED course IDs...');
  const courseMap = await getCourseIds();
  
  console.log('Found courses:', courseMap);
  
  let totalAdded = 0;
  
  for (const [courseCode, courseId] of Object.entries(courseMap)) {
    const lessons = GED_LESSONS[courseCode];
    console.log(`\nAdding ${lessons.length} lessons to ${courseCode}...`);
    
    try {
      await addLessonsToCourse(courseId, lessons);
      totalAdded += lessons.length;
      console.log(`✓ Added ${lessons.length} lessons to ${courseCode}`);
    } catch (error) {
      console.error(`✗ Failed to add lessons to ${courseCode}`);
    }
  }
  
  console.log(`\n✓ Total lessons added: ${totalAdded}`);
}

main().catch(console.error);
