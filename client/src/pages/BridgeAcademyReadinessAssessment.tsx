import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Zap,
  Target,
  Clock
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topicId: number;
  topicName: string;
}

interface AssessmentResult {
  score: number;
  percentage: number;
  readinessLevel: 'beginner' | 'intermediate' | 'advanced';
  recommendedPlan: '4week' | '8week' | '12week';
  strengths: string[];
  weaknesses: string[];
}

export default function BridgeAcademyReadinessAssessment() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [courseId, setCourseId] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes for 20 questions

  // Parse course ID from URL or props
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("courseId");
    const name = params.get("courseName");
    if (id) {
      setCourseId(parseInt(id));
      setCourseName(name || "GED Subject");
    }
  }, []);

  // Load readiness assessment questions
  useEffect(() => {
    if (!courseId) return;

    const loadQuestions = async () => {
      try {
        // Generate 20 sample questions (2 per topic, 10 topics)
        const sampleQuestions: QuizQuestion[] = [
          {
            id: 1,
            question: "What is the main purpose of the introduction in an essay?",
            options: [
              "To provide background information and state the thesis",
              "To summarize the main points",
              "To conclude the argument",
              "To provide citations"
            ],
            correctAnswer: "To provide background information and state the thesis",
            explanation: "The introduction sets up the essay by providing context and stating the main argument.",
            topicId: 1,
            topicName: "Reading & Writing"
          },
          {
            id: 2,
            question: "Which of the following is a complete sentence?",
            options: [
              "Running down the street",
              "The cat sat on the mat",
              "Because of the rain",
              "After the movie ended"
            ],
            correctAnswer: "The cat sat on the mat",
            explanation: "A complete sentence needs a subject and a predicate. 'The cat sat on the mat' has both.",
            topicId: 1,
            topicName: "Reading & Writing"
          },
          {
            id: 3,
            question: "What is 25% of 80?",
            options: ["16", "20", "25", "32"],
            correctAnswer: "20",
            explanation: "25% of 80 = 0.25 × 80 = 20",
            topicId: 2,
            topicName: "Mathematical Reasoning"
          },
          {
            id: 4,
            question: "If a rectangle has a length of 10 and a width of 5, what is its area?",
            options: ["15", "30", "50", "100"],
            correctAnswer: "50",
            explanation: "Area of a rectangle = length × width = 10 × 5 = 50",
            topicId: 2,
            topicName: "Mathematical Reasoning"
          },
          {
            id: 5,
            question: "What is the primary role of the legislative branch?",
            options: [
              "To enforce laws",
              "To make laws",
              "To interpret laws",
              "To execute laws"
            ],
            correctAnswer: "To make laws",
            explanation: "The legislative branch (Congress) is responsible for creating and passing laws.",
            topicId: 3,
            topicName: "Social Studies"
          },
          {
            id: 6,
            question: "Which document outlines the structure of the U.S. government?",
            options: [
              "The Declaration of Independence",
              "The Constitution",
              "The Bill of Rights",
              "The Federalist Papers"
            ],
            correctAnswer: "The Constitution",
            explanation: "The Constitution is the supreme law of the United States and establishes the structure of government.",
            topicId: 3,
            topicName: "Social Studies"
          },
          {
            id: 7,
            question: "What is the process by which plants convert sunlight into chemical energy?",
            options: [
              "Respiration",
              "Photosynthesis",
              "Fermentation",
              "Decomposition"
            ],
            correctAnswer: "Photosynthesis",
            explanation: "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create glucose and oxygen.",
            topicId: 4,
            topicName: "Science"
          },
          {
            id: 8,
            question: "Which of the following is a prokaryote?",
            options: [
              "Plant cell",
              "Animal cell",
              "Bacterial cell",
              "Fungal cell"
            ],
            correctAnswer: "Bacterial cell",
            explanation: "Prokaryotes are single-celled organisms without a nucleus, such as bacteria.",
            topicId: 4,
            topicName: "Science"
          },
          {
            id: 9,
            question: "What is the capital of France?",
            options: ["Lyon", "Paris", "Marseille", "Toulouse"],
            correctAnswer: "Paris",
            explanation: "Paris is the capital and largest city of France.",
            topicId: 5,
            topicName: "Geography"
          },
          {
            id: 10,
            question: "Which ocean is the largest?",
            options: [
              "Atlantic Ocean",
              "Indian Ocean",
              "Arctic Ocean",
              "Pacific Ocean"
            ],
            correctAnswer: "Pacific Ocean",
            explanation: "The Pacific Ocean is the largest ocean on Earth.",
            topicId: 5,
            topicName: "Geography"
          },
          {
            id: 11,
            question: "What does DNA stand for?",
            options: [
              "Deoxyribonucleic Acid",
              "Dynamic Nuclear Acid",
              "Deoxyribose Nucleotide Acid",
              "Deoxyribose Nuclear Acid"
            ],
            correctAnswer: "Deoxyribonucleic Acid",
            explanation: "DNA stands for Deoxyribonucleic Acid and carries genetic instructions for life.",
            topicId: 4,
            topicName: "Science"
          },
          {
            id: 12,
            question: "Which of the following best describes a metaphor?",
            options: [
              "A comparison using 'like' or 'as'",
              "A direct comparison without using 'like' or 'as'",
              "A repeated sound at the beginning of words",
              "An exaggeration for effect"
            ],
            correctAnswer: "A direct comparison without using 'like' or 'as'",
            explanation: "A metaphor is a figure of speech that directly compares two unlike things.",
            topicId: 1,
            topicName: "Reading & Writing"
          },
          {
            id: 13,
            question: "Solve: 3x + 5 = 20",
            options: ["x = 5", "x = 10", "x = 15", "x = 25"],
            correctAnswer: "x = 5",
            explanation: "3x + 5 = 20 → 3x = 15 → x = 5",
            topicId: 2,
            topicName: "Mathematical Reasoning"
          },
          {
            id: 14,
            question: "What is the probability of rolling a 3 on a standard six-sided die?",
            options: ["1/6", "1/3", "1/2", "2/3"],
            correctAnswer: "1/6",
            explanation: "There is one favorable outcome (rolling a 3) out of six possible outcomes.",
            topicId: 2,
            topicName: "Mathematical Reasoning"
          },
          {
            id: 15,
            question: "Which war resulted in the abolition of slavery in the United States?",
            options: [
              "Revolutionary War",
              "War of 1812",
              "Civil War",
              "Spanish-American War"
            ],
            correctAnswer: "Civil War",
            explanation: "The Civil War (1861-1865) resulted in the abolition of slavery through the 13th Amendment.",
            topicId: 3,
            topicName: "Social Studies"
          },
          {
            id: 16,
            question: "What is the chemical formula for water?",
            options: ["H2O", "CO2", "O2", "H2O2"],
            correctAnswer: "H2O",
            explanation: "Water consists of two hydrogen atoms and one oxygen atom.",
            topicId: 4,
            topicName: "Science"
          },
          {
            id: 17,
            question: "Which continent is the smallest?",
            options: ["Europe", "Australia", "Antarctica", "South America"],
            correctAnswer: "Australia",
            explanation: "Australia is the smallest continent by area.",
            topicId: 5,
            topicName: "Geography"
          },
          {
            id: 18,
            question: "What is the main idea of a paragraph?",
            options: [
              "The first sentence",
              "The last sentence",
              "The central point or theme",
              "All of the above"
            ],
            correctAnswer: "The central point or theme",
            explanation: "The main idea is the central point that the paragraph is trying to communicate.",
            topicId: 1,
            topicName: "Reading & Writing"
          },
          {
            id: 19,
            question: "If a car travels 60 miles in 2 hours, what is its average speed?",
            options: ["20 mph", "30 mph", "40 mph", "60 mph"],
            correctAnswer: "30 mph",
            explanation: "Average speed = distance ÷ time = 60 ÷ 2 = 30 mph",
            topicId: 2,
            topicName: "Mathematical Reasoning"
          },
          {
            id: 20,
            question: "What is the primary function of the judicial branch?",
            options: [
              "To make laws",
              "To enforce laws",
              "To interpret laws and ensure they are constitutional",
              "To execute laws"
            ],
            correctAnswer: "To interpret laws and ensure they are constitutional",
            explanation: "The judicial branch interprets laws and determines their constitutionality.",
            topicId: 3,
            topicName: "Social Studies"
          }
        ];

        setQuestions(sampleQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load questions:", error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [courseId]);

  // Timer countdown
  useEffect(() => {
    if (submitted || loading) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, loading]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctCount = 0;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const topicScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach(q => {
      if (!topicScores[q.topicName]) {
        topicScores[q.topicName] = { correct: 0, total: 0 };
      }
      topicScores[q.topicName].total++;

      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
        topicScores[q.topicName].correct++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);

    // Determine strengths and weaknesses
    Object.entries(topicScores).forEach(([topic, scores]) => {
      const topicPercentage = Math.round((scores.correct / scores.total) * 100);
      if (topicPercentage >= 75) {
        strengths.push(topic);
      } else if (topicPercentage < 50) {
        weaknesses.push(topic);
      }
    });

    // Determine readiness level and recommended plan
    let readinessLevel: 'beginner' | 'intermediate' | 'advanced';
    let recommendedPlan: '4week' | '8week' | '12week';

    if (percentage >= 80) {
      readinessLevel = 'advanced';
      recommendedPlan = '4week';
    } else if (percentage >= 60) {
      readinessLevel = 'intermediate';
      recommendedPlan = '8week';
    } else {
      readinessLevel = 'beginner';
      recommendedPlan = '12week';
    }

    const assessmentResult: AssessmentResult = {
      score: correctCount,
      percentage,
      readinessLevel,
      recommendedPlan,
      strengths,
      weaknesses
    };

    // Save to backend
    try {
      const response = await fetch("/api/bridge-academy/readiness-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId || 0,
          score: correctCount,
          percentage,
          strengths,
          weaknesses
        })
      });

      if (response.ok) {
        setResult(assessmentResult);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to save assessment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/bridge-academy")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Assessment Complete!</CardTitle>
              <CardDescription>Here's your personalized readiness report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {result.percentage}%
                </div>
                <p className="text-lg text-muted-foreground">
                  You scored {result.score} out of {questions.length} questions
                </p>
              </div>

              {/* Readiness Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Readiness Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="text-lg py-1 px-3" variant={
                      result.readinessLevel === 'advanced' ? 'default' :
                      result.readinessLevel === 'intermediate' ? 'secondary' :
                      'outline'
                    }>
                      {result.readinessLevel.charAt(0).toUpperCase() + result.readinessLevel.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Recommended Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="text-lg py-1 px-3">
                      {result.recommendedPlan === '4week' ? '4-Week Plan' :
                       result.recommendedPlan === '8week' ? '8-Week Plan' :
                       '12-Week Plan'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Your Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Weaknesses */}
              {result.weaknesses.length > 0 && (
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                      Areas to Focus On
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recommendation */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                    Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-700 dark:text-blue-400">
                  <p>
                    Based on your assessment results, we recommend the <strong>{result.recommendedPlan === '4week' ? '4-week' : result.recommendedPlan === '8week' ? '8-week' : '12-week'} study plan</strong>. 
                    This plan is tailored to your current knowledge level and will help you prepare effectively for the GED exam.
                  </p>
                </CardContent>
              </Card>

              <Button 
                onClick={() => navigate("/bridge-academy/student-dashboard")}
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>No Assessment Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The readiness assessment is not available at this time.</p>
            <Button onClick={() => navigate("/bridge-academy")}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/bridge-academy")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5 text-primary" />
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <Badge variant="outline">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </Badge>
            </div>
            <Progress 
              value={((currentQuestionIndex + 1) / questions.length) * 100} 
              className="h-2"
            />
          </CardHeader>
        </Card>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            <CardDescription>
              Topic: {currentQuestion.topicName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestion.id] || ""} 
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${idx}`}
                    />
                    <Label 
                      htmlFor={`option-${idx}`}
                      className="cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3 justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={!isAnswered}
              className="flex-1"
            >
              Submit Assessment
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1"
            >
              Next Question
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 p-4 bg-card rounded-lg border">
          <p className="text-sm font-semibold mb-3">Quick Navigation</p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-full h-10 rounded text-sm font-medium transition-colors ${
                  idx === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : answers[q.id]
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
