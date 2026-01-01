import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Play,
  BarChart3,
  TrendingUp
} from "lucide-react";

interface Topic {
  id: number;
  title: string;
  description?: string;
  topicOrder: number;
  khanaAcademyPlaylistId?: string;
  studyGuideUrl?: string;
}

interface TopicProgress {
  topicId: number;
  completed: boolean;
  quizzesPassed: number;
  averageScore: number;
  lastAttempt?: string;
}

export default function BridgeAcademyCourseDetail() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/bridge-academy/course/:courseId");
  const [courseData, setCourseData] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const courseId = params?.courseId;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/bridge-academy/course/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourseData(data.course);
          setTopics(data.topics);
          setProgress(data.progress);
        }
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/bridge-academy")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bridge Academy
          </Button>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Course not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate course statistics
  const totalTopics = topics.length;
  const completedTopics = progress.filter(p => p.completed).length;
  const courseProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const averageScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.averageScore, 0) / progress.length)
    : 0;

  // Get topic progress
  const getTopicProgress = (topicId: number) => {
    return progress.find(p => p.topicId === topicId);
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/bridge-academy")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bridge Academy
          </Button>

          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {courseData.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {courseData.description}
            </p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">{courseProgress}%</div>
                <Progress value={courseProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completedTopics} of {totalTopics} topics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(averageScore)}`}>
                  {averageScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all quizzes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {totalTopics}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available to study
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={completedTopics === totalTopics ? "bg-green-600" : "bg-blue-600"}>
                  {completedTopics === totalTopics ? "Completed" : "In Progress"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Topics List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Course Topics</h2>
          <div className="space-y-3">
            {topics.map((topic, index) => {
              const topicProg = getTopicProgress(topic.id);
              const isCompleted = topicProg?.completed;

              return (
                <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Topic Number */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-secondary text-foreground"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                        </div>
                      </div>

                      {/* Topic Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {topic.title}
                            </h3>
                            {topic.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {topic.description}
                              </p>
                            )}
                          </div>
                          {isCompleted && (
                            <Badge className="bg-green-600 flex-shrink-0">Completed</Badge>
                          )}
                        </div>

                        {/* Topic Stats */}
                        {topicProg && (
                          <div className="grid grid-cols-3 gap-3 bg-secondary/50 p-3 rounded-lg mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Quizzes Passed</p>
                              <p className="font-semibold">{topicProg.quizzesPassed}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Avg Score</p>
                              <p className={`font-semibold ${getScoreColor(topicProg.averageScore)}`}>
                                {topicProg.averageScore}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Last Attempt</p>
                              <p className="text-xs font-medium">
                                {topicProg.lastAttempt
                                  ? new Date(topicProg.lastAttempt).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/bridge-academy/quiz/${topic.id}`)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Take Quiz
                          </Button>
                          {topic.studyGuideUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(topic.studyGuideUrl, "_blank")}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Study Guide
                            </Button>
                          )}
                          {topic.khanaAcademyPlaylistId && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(
                                `https://www.khanacademy.org/search?q=${encodeURIComponent(topic.title)}`,
                                "_blank"
                              )}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Khan Academy
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Study Resources */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Study Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-2">Available for Each Topic:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Khan Academy videos for concept review</li>
                <li>✓ Downloadable study guides with key concepts</li>
                <li>✓ Practice questions to reinforce learning</li>
                <li>✓ Official GED quizzes to test your knowledge</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
