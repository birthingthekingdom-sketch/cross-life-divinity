import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface QuizResult {
  id: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  topicId?: number;
  topicName?: string;
}

interface AnalyticsProps {
  quizResults: QuizResult[];
  practiceAttempts?: any[];
}

export function QuizResultsAnalytics({ quizResults, practiceAttempts = [] }: AnalyticsProps) {
  // Calculate trend
  const calculateTrend = () => {
    if (quizResults.length < 2) return null;

    const recent = quizResults.slice(0, 5).reverse();
    const firstScore = recent[0].percentage;
    const lastScore = recent[recent.length - 1].percentage;
    const trend = lastScore - firstScore;

    return {
      trend,
      direction: trend > 0 ? "up" : trend < 0 ? "down" : "stable",
    };
  };

  // Calculate statistics
  const calculateStats = () => {
    if (quizResults.length === 0) {
      return {
        averageScore: 0,
        passRate: 0,
        bestScore: 0,
        worstScore: 0,
        totalAttempts: 0,
      };
    }

    const percentages = quizResults.map(q => q.percentage);
    const passed = quizResults.filter(q => q.passed).length;

    return {
      averageScore: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
      passRate: Math.round((passed / quizResults.length) * 100),
      bestScore: Math.max(...percentages),
      worstScore: Math.min(...percentages),
      totalAttempts: quizResults.length,
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    const recent = quizResults.slice(0, 10).reverse();
    return recent.map((q, index) => ({
      attempt: `Attempt ${index + 1}`,
      score: q.percentage,
      passed: q.passed ? 100 : 0,
    }));
  };

  // Prepare difficulty distribution
  const prepareDifficultyData = () => {
    const easyCount = practiceAttempts.filter(a => a.difficulty === "easy").length;
    const mediumCount = practiceAttempts.filter(a => a.difficulty === "medium").length;
    const hardCount = practiceAttempts.filter(a => a.difficulty === "hard").length;

    return [
      { name: "Easy", value: easyCount, color: "#10b981" },
      { name: "Medium", value: mediumCount, color: "#f59e0b" },
      { name: "Hard", value: hardCount, color: "#ef4444" },
    ].filter(d => d.value > 0);
  };

  const stats = calculateStats();
  const trend = calculateTrend();
  const chartData = prepareChartData();
  const difficultyData = prepareDifficultyData();

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across {stats.totalAttempts} attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.passRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {quizResults.filter(q => q.passed).length} of {stats.totalAttempts} passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.bestScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Your highest score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Worst Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {stats.worstScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Your lowest score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              {trend?.direction === "up" ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : trend?.direction === "down" ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <Minus className="w-5 h-5 text-gray-600" />
              )}
              <span className={`text-2xl font-bold ${
                trend?.direction === "up" ? "text-green-600" :
                trend?.direction === "down" ? "text-red-600" :
                "text-gray-600"
              }`}>
                {trend?.trend && trend.trend > 0 ? "+" : ""}{Math.round(trend?.trend || 0)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Recent trend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Progression */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score Progression</CardTitle>
              <CardDescription>Your recent quiz scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attempt" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    dot={{ fill: "#3b82f6" }}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Difficulty Distribution */}
        {difficultyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Practice Difficulty Distribution</CardTitle>
              <CardDescription>Your practice attempts by difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Results Table */}
      {quizResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Quiz Results</CardTitle>
            <CardDescription>Your latest quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizResults.slice(0, 10).map((result, index) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Quiz {index + 1}</span>
                      {result.passed ? (
                        <Badge className="bg-green-600 text-xs">Passed</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-xs">Needs Review</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(result.submittedAt).toLocaleDateString()} at{" "}
                      {new Date(result.submittedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                      {result.percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.score}/{result.totalQuestions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
