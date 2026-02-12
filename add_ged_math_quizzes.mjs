import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// GED-MATH lesson IDs and quiz data
const quizData = {
  540011: [ // Advanced Algebra
    { q: "What is the solution to 2x + 5 = 15?", type: "multiple_choice", options: ["x = 5", "x = 10", "x = 7.5", "x = 4"], answer: "x = 5" },
    { q: "Factor the expression x² - 9:", type: "multiple_choice", options: ["(x + 3)(x - 3)", "(x + 9)(x - 1)", "(x - 3)²", "(x + 3)²"], answer: "(x + 3)(x - 3)" },
    { q: "Solve for y: 3y - 7 = 2y + 4", type: "multiple_choice", options: ["y = 11", "y = -3", "y = 3", "y = 7"], answer: "y = 11" },
    { q: "What is the value of x in the equation 4(x - 2) = 20?", type: "multiple_choice", options: ["x = 7", "x = 5.5", "x = 4.5", "x = 6"], answer: "x = 7" },
    { q: "Simplify: 3x² + 2x² - x²", type: "multiple_choice", options: ["4x²", "5x²", "6x²", "4x⁴"], answer: "4x²" },
    { q: "Which equation represents a linear relationship?", type: "multiple_choice", options: ["y = x²", "y = 2x + 3", "y = 1/x", "y = √x"], answer: "y = 2x + 3" },
    { q: "Solve the inequality: 2x - 3 > 7", type: "multiple_choice", options: ["x > 5", "x > 2", "x < 5", "x > 10"], answer: "x > 5" },
    { q: "What is the slope of the line y = 4x - 7?", type: "multiple_choice", options: ["4", "-7", "7", "-4"], answer: "4" },
    { q: "Factor completely: x² + 5x + 6", type: "multiple_choice", options: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x - 2)(x - 3)", "(x + 5)(x + 1)"], answer: "(x + 2)(x + 3)" },
    { q: "What is the y-intercept of y = 3x - 5?", type: "multiple_choice", options: ["-5", "3", "5", "-3"], answer: "-5" },
    { q: "Explain the steps to solve a two-step equation like 3x + 5 = 20.", type: "short_answer", options: null, answer: "First subtract 5 from both sides to get 3x = 15, then divide both sides by 3 to get x = 5." }
  ],
  540012: [ // Functions and Graphing
    { q: "What is f(3) if f(x) = 2x + 1?", type: "multiple_choice", options: ["7", "6", "5", "8"], answer: "7" },
    { q: "The graph of y = x² is called a:", type: "multiple_choice", options: ["Line", "Parabola", "Circle", "Hyperbola"], answer: "Parabola" },
    { q: "What is the domain of f(x) = √x?", type: "multiple_choice", options: ["All real numbers", "x ≥ 0", "x > 0", "x ≤ 0"], answer: "x ≥ 0" },
    { q: "If a line has slope 0, it is:", type: "multiple_choice", options: ["Vertical", "Horizontal", "Diagonal", "Undefined"], answer: "Horizontal" },
    { q: "What is the range of f(x) = x²?", type: "multiple_choice", options: ["All real numbers", "y ≥ 0", "y > 0", "y ≤ 0"], answer: "y ≥ 0" },
    { q: "The vertex of y = (x - 2)² + 3 is:", type: "multiple_choice", options: ["(2, 3)", "(-2, 3)", "(2, -3)", "(-2, -3)"], answer: "(2, 3)" },
    { q: "A function is a relation where:", type: "multiple_choice", options: ["Each input has exactly one output", "Each output has exactly one input", "Inputs and outputs are equal", "There are no restrictions"], answer: "Each input has exactly one output" },
    { q: "What is the slope of a vertical line?", type: "multiple_choice", options: ["0", "1", "Undefined", "-1"], answer: "Undefined" },
    { q: "If f(x) = x² and g(x) = x + 1, what is f(g(2))?", type: "multiple_choice", options: ["9", "5", "4", "6"], answer: "9" },
    { q: "The x-intercept is where:", type: "multiple_choice", options: ["y = 0", "x = 0", "y = x", "The line is horizontal"], answer: "y = 0" },
    { q: "Explain how to find the slope of a line given two points.", type: "short_answer", options: null, answer: "Use the formula slope = (y₂ - y₁)/(x₂ - x₁). Subtract the y-coordinates and divide by the difference of the x-coordinates." }
  ],
  540013: [ // Statistics and Probability
    { q: "The mean of 2, 4, 6, 8, 10 is:", type: "multiple_choice", options: ["6", "5", "7", "8"], answer: "6" },
    { q: "The median of 3, 7, 9, 12, 15 is:", type: "multiple_choice", options: ["9", "7", "12", "8"], answer: "9" },
    { q: "The mode of 2, 3, 3, 4, 5, 3 is:", type: "multiple_choice", options: ["3", "2", "4", "5"], answer: "3" },
    { q: "The probability of flipping heads on a fair coin is:", type: "multiple_choice", options: ["1/2", "1/4", "1/3", "2/3"], answer: "1/2" },
    { q: "The range of 5, 10, 15, 20, 25 is:", type: "multiple_choice", options: ["20", "15", "25", "10"], answer: "20" },
    { q: "If you roll a die, what is the probability of getting a 6?", type: "multiple_choice", options: ["1/6", "1/3", "1/2", "1/4"], answer: "1/6" },
    { q: "A bar graph is best used to:", type: "multiple_choice", options: ["Show trends over time", "Compare categories", "Show parts of a whole", "Display continuous data"], answer: "Compare categories" },
    { q: "The probability of an impossible event is:", type: "multiple_choice", options: ["0", "1", "0.5", "-1"], answer: "0" },
    { q: "What measure of central tendency is most affected by outliers?", type: "multiple_choice", options: ["Mean", "Median", "Mode", "Range"], answer: "Mean" },
    { q: "A pie chart shows:", type: "multiple_choice", options: ["Trends over time", "Parts of a whole", "Comparisons between groups", "Scatter data"], answer: "Parts of a whole" },
    { q: "Explain the difference between mean, median, and mode.", type: "short_answer", options: null, answer: "Mean is the average (sum divided by count), median is the middle value when ordered, and mode is the most frequently occurring value." }
  ],
  540014: [ // Measurement and Conversions
    { q: "How many inches are in a foot?", type: "multiple_choice", options: ["12", "10", "6", "3"], answer: "12" },
    { q: "How many centimeters are in a meter?", type: "multiple_choice", options: ["100", "10", "1000", "50"], answer: "100" },
    { q: "The area of a rectangle with length 5 and width 3 is:", type: "multiple_choice", options: ["15", "8", "16", "12"], answer: "15" },
    { q: "How many quarts are in a gallon?", type: "multiple_choice", options: ["4", "2", "8", "16"], answer: "4" },
    { q: "The perimeter of a square with side 4 is:", type: "multiple_choice", options: ["16", "8", "12", "20"], answer: "16" },
    { q: "How many grams are in a kilogram?", type: "multiple_choice", options: ["1000", "100", "10", "10000"], answer: "1000" },
    { q: "The volume of a cube with side 3 is:", type: "multiple_choice", options: ["27", "9", "12", "18"], answer: "27" },
    { q: "How many feet are in a mile?", type: "multiple_choice", options: ["5,280", "1,000", "3,000", "10,000"], answer: "5,280" },
    { q: "The circumference formula for a circle is:", type: "multiple_choice", options: ["2πr", "πr²", "πd²", "2πr²"], answer: "2πr" },
    { q: "How many ounces are in a pound?", type: "multiple_choice", options: ["16", "12", "8", "32"], answer: "16" },
    { q: "Explain how to convert 5 feet to inches.", type: "short_answer", options: null, answer: "Multiply 5 by 12 (since there are 12 inches in a foot) to get 60 inches." }
  ],
  540015: [ // Calculator Strategies
    { q: "On the GED calculator, the square root key is:", type: "multiple_choice", options: ["√", "x²", "^", "/"], answer: "√" },
    { q: "To calculate 5³ on a calculator, you would:", type: "multiple_choice", options: ["Press 5, then ^, then 3", "Press 5 × 5 × 5", "Both A and B work", "Press 3, then ^, then 5"], answer: "Both A and B work" },
    { q: "The order of operations is:", type: "multiple_choice", options: ["PEMDAS", "SADMEP", "MDPEAS", "DAMSEP"], answer: "PEMDAS" },
    { q: "To find 15% of 80 on a calculator:", type: "multiple_choice", options: ["80 × 0.15", "80 ÷ 15", "80 + 15", "80 - 15"], answer: "80 × 0.15" },
    { q: "The memory function on a calculator is useful for:", type: "multiple_choice", options: ["Storing intermediate results", "Clearing the screen", "Changing modes", "Printing"], answer: "Storing intermediate results" },
    { q: "To calculate a negative number squared:", type: "multiple_choice", options: ["Use parentheses: (-3)²", "Just type -3²", "It cannot be done", "Use the +/- key after"], answer: "Use parentheses: (-3)²" },
    { q: "Scientific notation on calculators uses:", type: "multiple_choice", options: ["E or EE key", "The × key", "The ÷ key", "The + key"], answer: "E or EE key" },
    { q: "To find the reciprocal of 4:", type: "multiple_choice", options: ["1 ÷ 4", "4 ÷ 1", "4 × 4", "4 + 1"], answer: "1 ÷ 4" },
    { q: "When should you estimate before using a calculator?", type: "multiple_choice", options: ["Always, to check reasonableness", "Never", "Only for addition", "Only for large numbers"], answer: "Always, to check reasonableness" },
    { q: "The fraction key converts:", type: "multiple_choice", options: ["Decimals to fractions", "Fractions to percentages", "Percentages to decimals", "All of the above"], answer: "Decimals to fractions" },
    { q: "Describe a strategy for checking calculator answers for reasonableness.", type: "short_answer", options: null, answer: "Estimate the answer mentally before calculating, then compare your estimate to the calculator result. If they are very different, recheck your entry." }
  ],
  540016: [ // Non-Calculator Problem Solving
    { q: "What is 25 × 4?", type: "multiple_choice", options: ["100", "80", "125", "75"], answer: "100" },
    { q: "What is 1/2 + 1/4?", type: "multiple_choice", options: ["3/4", "2/6", "1/6", "2/4"], answer: "3/4" },
    { q: "What is 10% of 50?", type: "multiple_choice", options: ["5", "10", "15", "50"], answer: "5" },
    { q: "What is 8²?", type: "multiple_choice", options: ["64", "16", "32", "80"], answer: "64" },
    { q: "Simplify: 3/6", type: "multiple_choice", options: ["1/2", "2/3", "1/3", "3/2"], answer: "1/2" },
    { q: "What is 15 - (-5)?", type: "multiple_choice", options: ["20", "10", "-10", "-20"], answer: "20" },
    { q: "What is 0.5 as a fraction?", type: "multiple_choice", options: ["1/2", "1/4", "1/5", "5/10"], answer: "1/2" },
    { q: "What is √49?", type: "multiple_choice", options: ["7", "8", "6", "9"], answer: "7" },
    { q: "What is 3 × 3 × 3?", type: "multiple_choice", options: ["27", "9", "12", "18"], answer: "27" },
    { q: "What is 75% as a decimal?", type: "multiple_choice", options: ["0.75", "7.5", "0.075", "75"], answer: "0.75" },
    { q: "Explain a mental math strategy for multiplying by 25.", type: "short_answer", options: null, answer: "Divide the number by 4, then multiply by 100. For example, 25 × 12 = (12 ÷ 4) × 100 = 3 × 100 = 300." }
  ],
  540017: [ // Multi-Step Problem Solving
    { q: "A shirt costs $25 and is 20% off. What is the sale price?", type: "multiple_choice", options: ["$20", "$22", "$18", "$23"], answer: "$20" },
    { q: "If you drive 60 mph for 2.5 hours, how far do you travel?", type: "multiple_choice", options: ["150 miles", "120 miles", "180 miles", "100 miles"], answer: "150 miles" },
    { q: "A recipe calls for 2 cups of flour for 12 cookies. How much for 36 cookies?", type: "multiple_choice", options: ["6 cups", "4 cups", "8 cups", "3 cups"], answer: "6 cups" },
    { q: "If tax is 8% on a $50 purchase, what is the total?", type: "multiple_choice", options: ["$54", "$58", "$52", "$56"], answer: "$54" },
    { q: "A worker earns $15/hour. How much for 40 hours?", type: "multiple_choice", options: ["$600", "$550", "$650", "$500"], answer: "$600" },
    { q: "If 3 apples cost $1.50, how much do 10 apples cost?", type: "multiple_choice", options: ["$5.00", "$4.50", "$5.50", "$6.00"], answer: "$5.00" },
    { q: "A room is 12 ft by 10 ft. How many square feet of carpet is needed?", type: "multiple_choice", options: ["120 sq ft", "110 sq ft", "100 sq ft", "130 sq ft"], answer: "120 sq ft" },
    { q: "If you save $50/month, how much in 2 years?", type: "multiple_choice", options: ["$1,200", "$1,000", "$600", "$2,400"], answer: "$1,200" },
    { q: "A car gets 30 mpg. How many gallons for 450 miles?", type: "multiple_choice", options: ["15 gallons", "12 gallons", "18 gallons", "20 gallons"], answer: "15 gallons" },
    { q: "If 5 workers can complete a job in 6 days, how long for 3 workers?", type: "multiple_choice", options: ["10 days", "8 days", "12 days", "9 days"], answer: "10 days" },
    { q: "Describe the steps to solve a multi-step word problem.", type: "short_answer", options: null, answer: "Read carefully, identify what is asked, list known information, determine operations needed, solve step by step, and check if the answer is reasonable." }
  ],
  540018: [ // Real-World Applications
    { q: "Simple interest formula is:", type: "multiple_choice", options: ["I = PRT", "I = P + R + T", "I = P/RT", "I = P × R/T"], answer: "I = PRT" },
    { q: "If you borrow $1000 at 5% for 2 years, simple interest is:", type: "multiple_choice", options: ["$100", "$50", "$150", "$200"], answer: "$100" },
    { q: "A 15% tip on a $40 meal is:", type: "multiple_choice", options: ["$6", "$4", "$8", "$5"], answer: "$6" },
    { q: "If rent is $800/month, yearly rent is:", type: "multiple_choice", options: ["$9,600", "$8,000", "$10,000", "$8,800"], answer: "$9,600" },
    { q: "A 25% discount on $80 saves:", type: "multiple_choice", options: ["$20", "$15", "$25", "$30"], answer: "$20" },
    { q: "If gas costs $3.50/gallon and you need 10 gallons:", type: "multiple_choice", options: ["$35", "$30", "$40", "$25"], answer: "$35" },
    { q: "A salary of $52,000/year is how much per month?", type: "multiple_choice", options: ["$4,333", "$5,200", "$4,000", "$4,500"], answer: "$4,333" },
    { q: "If you work 8 hours at $12/hour with time-and-a-half overtime for 2 hours:", type: "multiple_choice", options: ["$132", "$120", "$144", "$108"], answer: "$132" },
    { q: "A car depreciates 15% from $20,000. New value is:", type: "multiple_choice", options: ["$17,000", "$18,000", "$15,000", "$19,000"], answer: "$17,000" },
    { q: "If a stock rises 10% from $50, new price is:", type: "multiple_choice", options: ["$55", "$60", "$45", "$52"], answer: "$55" },
    { q: "Explain how to calculate a 20% tip on a restaurant bill.", type: "short_answer", options: null, answer: "Multiply the bill by 0.20, or find 10% by moving the decimal one place left, then double it." }
  ],
  540019: [ // Math Test-Taking Strategies
    { q: "On the GED, you should first:", type: "multiple_choice", options: ["Answer easy questions", "Answer hard questions", "Skip all questions", "Guess randomly"], answer: "Answer easy questions" },
    { q: "If stuck on a problem, you should:", type: "multiple_choice", options: ["Mark it and return later", "Spend 10 minutes on it", "Leave it blank", "Panic"], answer: "Mark it and return later" },
    { q: "Eliminating wrong answers helps because:", type: "multiple_choice", options: ["It improves guessing odds", "It wastes time", "It confuses you", "It is not helpful"], answer: "It improves guessing odds" },
    { q: "Reading the question carefully helps avoid:", type: "multiple_choice", options: ["Careless errors", "Correct answers", "Easy questions", "Time savings"], answer: "Careless errors" },
    { q: "Checking your work is important because:", type: "multiple_choice", options: ["It catches mistakes", "It wastes time", "It is not necessary", "It confuses you"], answer: "It catches mistakes" },
    { q: "Time management means:", type: "multiple_choice", options: ["Pacing yourself through the test", "Rushing through everything", "Taking breaks often", "Ignoring the clock"], answer: "Pacing yourself through the test" },
    { q: "Drawing a diagram can help with:", type: "multiple_choice", options: ["Geometry and word problems", "Only algebra", "Nothing", "Only statistics"], answer: "Geometry and word problems" },
    { q: "If an answer seems too easy, you should:", type: "multiple_choice", options: ["Double-check it", "Change it immediately", "Assume it is wrong", "Skip it"], answer: "Double-check it" },
    { q: "Plugging in answer choices works best for:", type: "multiple_choice", options: ["Equations with one variable", "Essays", "Reading passages", "All questions"], answer: "Equations with one variable" },
    { q: "The best way to prepare is:", type: "multiple_choice", options: ["Regular practice", "Cramming the night before", "Not studying", "Only reading notes"], answer: "Regular practice" },
    { q: "Describe a strategy for managing time on the GED math test.", type: "short_answer", options: null, answer: "Divide total time by number of questions for average time per question. Answer easy questions first, mark difficult ones to return to, and save time at the end to review." }
  ],
  540020: [ // Math Practice and Review
    { q: "Solve: 5x - 3 = 17", type: "multiple_choice", options: ["x = 4", "x = 5", "x = 3", "x = 6"], answer: "x = 4" },
    { q: "What is the area of a circle with radius 5? (Use π ≈ 3.14)", type: "multiple_choice", options: ["78.5", "31.4", "25", "50"], answer: "78.5" },
    { q: "What is 3/4 as a percent?", type: "multiple_choice", options: ["75%", "34%", "80%", "70%"], answer: "75%" },
    { q: "If f(x) = 3x - 2, what is f(5)?", type: "multiple_choice", options: ["13", "15", "17", "11"], answer: "13" },
    { q: "The mean of 10, 20, 30, 40, 50 is:", type: "multiple_choice", options: ["30", "25", "35", "40"], answer: "30" },
    { q: "What is 2³ × 2²?", type: "multiple_choice", options: ["32", "16", "64", "8"], answer: "32" },
    { q: "Solve the proportion: 3/4 = x/20", type: "multiple_choice", options: ["15", "12", "16", "18"], answer: "15" },
    { q: "The Pythagorean theorem states:", type: "multiple_choice", options: ["a² + b² = c²", "a + b = c", "a × b = c", "a² - b² = c²"], answer: "a² + b² = c²" },
    { q: "What is -5 × -3?", type: "multiple_choice", options: ["15", "-15", "8", "-8"], answer: "15" },
    { q: "Convert 0.25 to a fraction:", type: "multiple_choice", options: ["1/4", "1/2", "1/5", "2/5"], answer: "1/4" },
    { q: "Explain how to solve a proportion like 2/3 = x/12.", type: "short_answer", options: null, answer: "Cross multiply: 2 × 12 = 3 × x, so 24 = 3x. Divide both sides by 3 to get x = 8." }
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

console.log(`\nTotal GED-MATH quizzes created: ${totalQuizzes}`);
await connection.end();
