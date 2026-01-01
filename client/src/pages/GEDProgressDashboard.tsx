import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BookOpen, Target, Award, AlertCircle, CheckCircle } from "lucide-react";

interface SubjectProgress {
  name: string;
  icon: string;
  score: number;
  targetScore: number;
  lessonsCompleted: number;
  totalLessons: number;
  practiceQuestions: number;
  lastPracticeDate: string;
  readinessLevel: "beginner" | "intermediate" | "advanced" | "exam-ready";
}

interface RecommendedStudyPath {
  subject: string;
  topic: string;
  difficulty: string;
  estimatedTime: string;
  priority: "high" | "medium" | "low";
}

const subjectProgress: SubjectProgress[] = [
  {
    name: "Mathematical Reasoning",
    icon: "📐",
    score: 72,
    targetScore: 85,
    lessonsCompleted: 6,
    totalLessons: 8,
    practiceQuestions: 45,
    lastPracticeDate: "Today",
    readinessLevel: "intermediate",
  },
  {
    name: "Reasoning Through Language Arts",
    icon: "📝",
    score: 81,
    targetScore: 85,
    lessonsCompleted: 7,
    totalLessons: 8,
    practiceQuestions: 52,
    lastPracticeDate: "Yesterday",
    readinessLevel: "advanced",
  },
  {
    name: "Science",
    icon: "🔬",
    score: 68,
    targetScore: 85,
    lessonsCompleted: 5,
    totalLessons: 8,
    practiceQuestions: 38,
    lastPracticeDate: "2 days ago",
    readinessLevel: "beginner",
  },
  {
    name: "Social Studies",
    icon: "🌍",
    score: 75,
    targetScore: 85,
    lessonsCompleted: 6,
    totalLessons: 8,
    practiceQuestions: 42,
    lastPracticeDate: "3 days ago",
    readinessLevel: "intermediate",
  },
];

const recommendedPaths: RecommendedStudyPath[] = [
  {
    subject: "Science",
    topic: "Life Science - Human Body Systems",
    difficulty: "Medium",
    estimatedTime: "45 minutes",
    priority: "high",
  },
  {
    subject: "Mathematical Reasoning",
    topic: "Quadratic Equations & Functions",
    difficulty: "Hard",
    estimatedTime: "60 minutes",
    priority: "high",
  },
  {
    subject: "Science",
    topic: "Physical Science - Energy & Motion",
    difficulty: "Medium",
    estimatedTime: "50 minutes",
    priority: "medium",
  },
  {
    subject: "Social Studies",
    topic: "U.S. Government & Civics",
    difficulty: "Medium",
    estimatedTime: "40 minutes",
    priority: "medium",
  },
];

const readinessColors: Record<string, string> = {
  "beginner": "bg-red-100 text-red-800",
  "intermediate": "bg-amber-100 text-amber-800",
  "advanced": "bg-blue-100 text-blue-800",
  "exam-ready": "bg-green-100 text-green-800",
};

const readinessLabels: Record<string, string> = {
  "beginner": "Beginner",
  "intermediate": "Intermediate",
  "advanced": "Advanced",
  "exam-ready": "Exam Ready",
};

export default function GEDProgressDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const overallScore = Math.round(
    subjectProgress.reduce((sum, s) => sum + s.score, 0) / subjectProgress.length
  );
  const overallReadiness =
    overallScore >= 85 ? "exam-ready" : overallScore >= 75 ? "advanced" : "intermediate";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">GED Progress Dashboard</h1>
          <p className="text-xl text-blue-100">
            Track your exam readiness and get personalized study recommendations
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Overall Progress Card */}
        <section className="mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">OVERALL SCORE</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-blue-600">{overallScore}</span>
                  <span className="text-gray-600">/100</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">EXAM READINESS</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      readinessColors[overallReadiness]
                    }`}
                  >
                    {readinessLabels[overallReadiness]}
                  </span>
                  {overallScore >= 85 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">PROGRESS</p>
                <div className="flex items-center gap-2">
                  <Progress value={overallScore} className="flex-1" />
                  <span className="text-sm font-semibold text-gray-700 w-8">
                    {overallScore}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Subject Progress */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Subject Performance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {subjectProgress.map((subject, index) => (
              <Card
                key={index}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  setSelectedSubject(
                    selectedSubject === subject.name ? null : subject.name
                  )
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{subject.icon}</span>
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      Lessons: {subject.lessonsCompleted}/{subject.totalLessons}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      readinessColors[subject.readinessLevel]
                    }`}
                  >
                    {readinessLabels[subject.readinessLevel]}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Current Score</span>
                      <span className="text-sm font-bold text-blue-600">
                        {subject.score}/100
                      </span>
                    </div>
                    <Progress value={subject.score} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Target Score</span>
                      <span className="text-sm font-bold text-green-600">
                        {subject.targetScore}/100
                      </span>
                    </div>
                    <Progress value={subject.targetScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Practice Questions</p>
                      <p className="text-lg font-bold">{subject.practiceQuestions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Last Practice</p>
                      <p className="text-sm font-semibold">{subject.lastPracticeDate}</p>
                    </div>
                  </div>
                </div>

                {selectedSubject === subject.name && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <Button className="w-full" variant="outline" size="sm">
                      View Detailed Analysis
                    </Button>
                    <Button className="w-full" size="sm">
                      Practice More Questions
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Study Paths */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Recommended Study Path</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Based on your current performance, focus on these areas to improve your exam
            readiness
          </p>

          <div className="space-y-4">
            {recommendedPaths.map((path, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{path.topic}</h3>
                    <p className="text-sm text-gray-600">{path.subject}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        path.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : path.priority === "medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {path.priority === "high"
                        ? "High Priority"
                        : path.priority === "medium"
                          ? "Medium Priority"
                          : "Low Priority"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Difficulty</p>
                    <p className="font-semibold">{path.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Estimated Time</p>
                    <p className="font-semibold">{path.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Expected Improvement</p>
                    <p className="font-semibold">+3-5 points</p>
                  </div>
                </div>

                <Button className="w-full">Start Learning</Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Study Statistics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Study Statistics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 text-center bg-blue-50">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600 mb-1">24</p>
              <p className="text-sm text-gray-600">Lessons Completed</p>
              <p className="text-xs text-gray-500 mt-2">75% of total</p>
            </Card>
            <Card className="p-6 text-center bg-green-50">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600 mb-1">177</p>
              <p className="text-sm text-gray-600">Practice Questions</p>
              <p className="text-xs text-gray-500 mt-2">98% accuracy avg</p>
            </Card>
            <Card className="p-6 text-center bg-purple-50">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600 mb-1">12</p>
              <p className="text-sm text-gray-600">Study Days</p>
              <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
            </Card>
            <Card className="p-6 text-center bg-amber-50">
              <Target className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-600 mb-1">8</p>
              <p className="text-sm text-gray-600">Days to Exam</p>
              <p className="text-xs text-gray-500 mt-2">Scheduled date</p>
            </Card>
          </div>
        </section>

        {/* Exam Readiness Assessment */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Exam Readiness Assessment</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Your Strengths</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Strong performance in Language Arts (81/100)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Consistent study habits with 12 study days</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>High accuracy on practice questions (98%)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Areas for Improvement</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Science needs improvement (68/100) - focus on life science</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Math quadratic equations require more practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Social Studies practice needed - only 42 questions completed</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="text-center py-8 border-t">
          <h2 className="text-2xl font-bold mb-4">Ready for Your Exam?</h2>
          <p className="text-gray-600 mb-6">
            You're making great progress! Continue with your study plan or take a full
            practice test.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Continue Learning
            </Button>
            <Button size="lg" variant="outline">
              Take Full Practice Test
            </Button>
            <Button size="lg" variant="outline">
              Schedule Exam Date
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
