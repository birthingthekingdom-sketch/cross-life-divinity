import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { Clock, BookOpen, CheckCircle, AlertCircle, ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "wouter";

interface Question {
  id: string;
  number: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
}

interface PracticeTest {
  id: string;
  name: string;
  subject: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface TestResult {
  testId: string;
  testName: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  completedAt: string;
  answers: Record<string, number>;
}

// Mock practice tests data
const PRACTICE_TESTS: PracticeTest[] = [
  {
    id: "math-full-1",
    name: "Full-Length Math Practice Test 1",
    subject: "Mathematics",
    totalQuestions: 50,
    timeLimit: 115,
    description: "Complete GED math assessment covering algebra, geometry, and data analysis",
    difficulty: "intermediate"
  },
  {
    id: "math-full-2",
    name: "Full-Length Math Practice Test 2",
    subject: "Mathematics",
    totalQuestions: 50,
    timeLimit: 115,
    description: "Advanced math practice test with challenging problems",
    difficulty: "advanced"
  },
  {
    id: "lang-full-1",
    name: "Full-Length Language Arts Practice Test 1",
    subject: "Language Arts",
    totalQuestions: 50,
    timeLimit: 150,
    description: "Reading comprehension and writing assessment",
    difficulty: "intermediate"
  },
  {
    id: "lang-full-2",
    name: "Full-Length Language Arts Practice Test 2",
    subject: "Language Arts",
    totalQuestions: 50,
    timeLimit: 150,
    description: "Advanced language arts practice test",
    difficulty: "advanced"
  },
  {
    id: "science-full-1",
    name: "Full-Length Science Practice Test 1",
    subject: "Science",
    totalQuestions: 50,
    timeLimit: 90,
    description: "Life science, physical science, and earth science assessment",
    difficulty: "intermediate"
  },
  {
    id: "social-full-1",
    name: "Full-Length Social Studies Practice Test 1",
    subject: "Social Studies",
    totalQuestions: 50,
    timeLimit: 90,
    description: "History, civics, economics, and geography assessment",
    difficulty: "intermediate"
  }
];

// Mock questions data
const generateMockQuestions = (testId: string, count: number): Question[] => {
  const questions: Question[] = [];
  const subjects = {
    "math-full-1": "Mathematics",
    "math-full-2": "Mathematics",
    "lang-full-1": "Language Arts",
    "lang-full-2": "Language Arts",
    "science-full-1": "Science",
    "social-full-1": "Social Studies"
  };

  const sampleQuestions = {
    "Mathematics": [
      {
        text: "What is 25% of 80?",
        options: ["15", "20", "25", "30"],
        correctAnswer: 1,
        explanation: "25% of 80 = 0.25 × 80 = 20"
      },
      {
        text: "Solve for x: 2x + 5 = 13",
        options: ["2", "3", "4", "5"],
        correctAnswer: 2,
        explanation: "2x + 5 = 13 → 2x = 8 → x = 4"
      },
      {
        text: "What is the area of a rectangle with length 8 and width 5?",
        options: ["13", "26", "40", "64"],
        correctAnswer: 2,
        explanation: "Area = length × width = 8 × 5 = 40"
      }
    ],
    "Language Arts": [
      {
        text: "Which sentence is grammatically correct?",
        options: [
          "She don't like pizza",
          "She doesn't like pizza",
          "She not like pizza",
          "She liking pizza"
        ],
        correctAnswer: 1,
        explanation: "The correct form is 'doesn't' (does not) with third person singular."
      },
      {
        text: "What is the main idea of this passage? [passage provided]",
        options: [
          "The importance of exercise",
          "The history of sports",
          "How to join a gym",
          "The benefits of teamwork"
        ],
        correctAnswer: 3,
        explanation: "The passage emphasizes how working together helps achieve goals."
      }
    ],
    "Science": [
      {
        text: "What is the chemical formula for water?",
        options: ["CO2", "H2O", "O2", "NaCl"],
        correctAnswer: 1,
        explanation: "Water consists of two hydrogen atoms and one oxygen atom."
      },
      {
        text: "Which planet is closest to the sun?",
        options: ["Venus", "Mercury", "Earth", "Mars"],
        correctAnswer: 1,
        explanation: "Mercury is the closest planet to the sun in our solar system."
      }
    ],
    "Social Studies": [
      {
        text: "In what year did the United States declare independence?",
        options: ["1775", "1776", "1783", "1789"],
        correctAnswer: 1,
        explanation: "The Declaration of Independence was signed on July 4, 1776."
      },
      {
        text: "What is the capital of France?",
        options: ["Lyon", "Marseille", "Paris", "Nice"],
        correctAnswer: 2,
        explanation: "Paris is the capital and largest city of France."
      }
    ]
  };

  const subject = subjects[testId as keyof typeof subjects] || "Mathematics";
  const subjectQuestions = sampleQuestions[subject as keyof typeof sampleQuestions] || [];

  for (let i = 0; i < count; i++) {
    const baseQuestion = subjectQuestions[i % subjectQuestions.length];
    questions.push({
      id: `q-${i + 1}`,
      number: i + 1,
      ...baseQuestion,
      subject,
      difficulty: i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard"
    });
  }

  return questions;
};

function TestLobby() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="bridge-academy" />
      
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">GED Practice Tests</h1>
          <p className="text-xl text-white/90">
            Full-length practice tests to prepare for your GED exam
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {PRACTICE_TESTS.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{test.name}</span>
                    <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {test.difficulty}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{test.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>{test.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{test.timeLimit} minutes</span>
                    </div>
                  </div>

                  <Link href={`/bridge-academy/practice-test/${test.id}`}>
                    <Button className="w-full">
                      Start Test
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How Practice Tests Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Assess Your Level</h3>
              <p className="text-muted-foreground">
                Identify your strengths and weaknesses across all GED subjects
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Build Stamina</h3>
              <p className="text-muted-foreground">
                Get accustomed to the time constraints and pacing of the real exam
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Boost Confidence</h3>
              <p className="text-muted-foreground">
                Practice with realistic questions and detailed answer explanations
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TestTaking({ testId }: { testId: string }) {
  const test = PRACTICE_TESTS.find(t => t.id === testId);
  const [questions] = useState<Question[]>(() => generateMockQuestions(testId, test?.totalQuestions || 50));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState((test?.timeLimit || 115) * 60);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (testCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setTestCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testCompleted]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setTestCompleted(true);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    const correctCount = Object.keys(answers).filter(
      qId => answers[qId] === questions.find(q => q.id === qId)?.correctAnswer
    ).length;

    return (
      <div className="min-h-screen bg-background">
        <PublicNav currentPage="bridge-academy" />
        
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center">Test Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-8">
                  <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
                  <div className="text-2xl font-semibold mb-4">
                    {correctCount} out of {questions.length} correct
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Time spent: {formatTime((test?.timeLimit || 115) * 60 - timeRemaining)}
                  </div>
                </div>

                {score >= 80 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-bold text-green-900">Excellent Performance!</h3>
                      <p className="text-green-800">You're well-prepared for the GED exam. Keep practicing to maintain your skills.</p>
                    </div>
                  </div>
                )}

                {score >= 60 && score < 80 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-bold text-blue-900">Good Progress</h3>
                      <p className="text-blue-800">You're on the right track. Focus on the areas where you struggled and practice more.</p>
                    </div>
                  </div>
                )}

                {score < 60 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-bold text-amber-900">Keep Practicing</h3>
                      <p className="text-amber-800">You need more preparation. Review the topics you found challenging and try another practice test.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Answer Review</h3>
              {questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                
                return (
                  <Card key={q.id} className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold">Question {idx + 1}: {q.text}</h4>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="space-y-2 text-sm mb-3">
                        <div><strong>Your answer:</strong> {q.options[userAnswer] || "Not answered"}</div>
                        {!isCorrect && <div><strong>Correct answer:</strong> {q.options[q.correctAnswer]}</div>}
                      </div>
                      <div className="bg-white/50 p-3 rounded text-sm italic">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4">
              <Link href="/bridge-academy/practice-tests">
                <Button variant="outline" className="w-full">
                  Back to Tests
                </Button>
              </Link>
              <Button className="w-full">
                Retake Test
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  if (!test) return <div>Test not found</div>;

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const timeWarning = timeRemaining < 300; // Less than 5 minutes

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav currentPage="bridge-academy" />

      {/* Header with Timer */}
      <div className="bg-white border-b border-border sticky top-24 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">{test.name}</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className={`text-2xl font-bold ${timeWarning ? 'text-red-600' : 'text-primary'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-6">{question.text}</h3>
                
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        answers[question.id] === idx
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[question.id] === idx
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {answers[question.id] === idx && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Submit Test
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex-1"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigator */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Progress: {answeredCount}/{questions.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-full aspect-square rounded-lg font-bold text-sm transition-colors ${
                        idx === currentQuestion
                          ? 'bg-primary text-white'
                          : answers[q.id] !== undefined
                          ? 'bg-green-100 text-green-900 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100" />
                    <span>Unanswered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function BridgeAcademyPracticeTests() {
  const [testInProgress, setTestInProgress] = useState<string | null>(null);

  if (testInProgress) {
    return <TestTaking testId={testInProgress} />;
  }

  return <TestLobby />;
}
