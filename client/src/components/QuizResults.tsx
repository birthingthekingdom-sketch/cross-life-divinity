import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  AlertCircle,
  Lightbulb,
  Target
} from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  difficulty: string;
  passed: boolean;
  answers: Array<{
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
  }>;
  previousAverage?: number;
}

export function QuizResults({
  score,
  totalQuestions,
  percentage,
  timeSpent,
  difficulty,
  passed,
  answers,
  previousAverage = 0,
}: QuizResultsProps) {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = answers.filter((a) => !a.isCorrect).length;
  const improvement = percentage - previousAverage;
  const avgTimePerQuestion = Math.round(timeSpent / totalQuestions);

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { label: "Excellent", color: "text-green-600" };
    if (percentage >= 80) return { label: "Good", color: "text-blue-600" };
    if (percentage >= 70) return { label: "Satisfactory", color: "text-yellow-600" };
    return { label: "Needs Improvement", color: "text-red-600" };
  };

  const getRecommendations = () => {
    const recs: string[] = [];

    if (percentage < 70) {
      recs.push("Review the course materials and focus on weak areas");
    }
    if (percentage >= 80 && percentage < 90) {
      recs.push("You're close to mastery! Review the questions you missed");
    }
    if (percentage >= 90) {
      recs.push("Excellent work! Try harder difficulty questions");
    }
    if (avgTimePerQuestion > 180) {
      recs.push("Try to answer questions more quickly while maintaining accuracy");
    }
    if (incorrectCount > totalQuestions / 2) {
      recs.push("Consider reviewing the topic before attempting another quiz");
    }

    return recs;
  };

  const performance = getPerformanceLevel();
  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center justify-between">
            <span>Performance Summary</span>
            <span className={`text-2xl font-bold ${performance.color}`}>
              {performance.label}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Score</p>
              <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Correct</p>
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Incorrect</p>
              <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg Time/Q</p>
              <p className="text-3xl font-bold text-purple-600">
                {Math.floor(avgTimePerQuestion / 60)}:{(avgTimePerQuestion % 60).toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Accuracy</span>
              <span className="text-muted-foreground">{correctCount}/{totalQuestions}</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          {/* Improvement Indicator */}
          {previousAverage > 0 && (
            <div className="mt-4 p-3 bg-secondary/50 rounded-lg flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${improvement >= 0 ? "text-green-600" : "text-red-600"}`} />
              <span className="text-sm">
                {improvement >= 0 ? "📈" : "📉"} 
                {" "}Compared to previous: {improvement > 0 ? "+" : ""}{improvement}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Difficulty & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quiz Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Difficulty</span>
                <Badge className={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={passed ? "default" : "secondary"}>
                  {passed ? "Passed" : "Did Not Pass"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Time</span>
                <span className="font-semibold">
                  {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Answer Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Correct Answers</span>
                  <span className="font-semibold text-green-600">{correctCount}</span>
                </div>
                <Progress value={(correctCount / totalQuestions) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Incorrect Answers</span>
                  <span className="font-semibold text-red-600">{incorrectCount}</span>
                </div>
                <Progress value={(incorrectCount / totalQuestions) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-2 border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span className="text-amber-900">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Answer Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Answer Summary
          </CardTitle>
          <CardDescription>
            Review your answers to understand your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Correct Answers</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              <p className="text-sm text-green-700 mt-1">
                {Math.round((correctCount / totalQuestions) * 100)}% accuracy
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">Incorrect Answers</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
              <p className="text-sm text-red-700 mt-1">
                {Math.round((incorrectCount / totalQuestions) * 100)}% need review
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
