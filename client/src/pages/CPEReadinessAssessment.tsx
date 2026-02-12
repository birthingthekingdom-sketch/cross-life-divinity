import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, TrendingUp, BookOpen, Heart, Shield, Users, Brain } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";

interface AssessmentQuestion {
  id: number;
  category: string;
  question: string;
  options: {
    value: number;
    text: string;
    description: string;
  }[];
}

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  icon: React.ReactNode;
  description: string;
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    category: "Emotional Resilience",
    question: "How do you typically respond to emotionally challenging situations?",
    options: [
      { value: 1, text: "I become overwhelmed and struggle to function", description: "Difficulty managing emotions" },
      { value: 2, text: "I manage but feel stressed and drained", description: "Some emotional management" },
      { value: 3, text: "I handle them well with appropriate support", description: "Good emotional management" },
      { value: 4, text: "I process emotions effectively and maintain perspective", description: "Excellent emotional resilience" },
    ],
  },
  {
    id: 2,
    category: "Emotional Resilience",
    question: "How do you handle grief and loss?",
    options: [
      { value: 1, text: "I avoid thinking about it or become depressed", description: "Avoidance or depression" },
      { value: 2, text: "I struggle but eventually process it", description: "Delayed processing" },
      { value: 3, text: "I process it with support from others", description: "Healthy processing with support" },
      { value: 4, text: "I can hold both sadness and meaning simultaneously", description: "Integrated grief response" },
    ],
  },
  {
    id: 3,
    category: "Emotional Resilience",
    question: "Do you have healthy ways to manage stress?",
    options: [
      { value: 1, text: "No, I struggle with stress management", description: "No healthy coping strategies" },
      { value: 2, text: "Somewhat, but inconsistently", description: "Inconsistent coping" },
      { value: 3, text: "Yes, I have several strategies I use regularly", description: "Multiple coping strategies" },
      { value: 4, text: "Yes, and I model healthy practices for others", description: "Exemplary stress management" },
    ],
  },
  {
    id: 4,
    category: "Spiritual Foundation",
    question: "How would you describe your personal spiritual foundation?",
    options: [
      { value: 1, text: "I'm unsure about my spiritual beliefs", description: "Unclear spiritual foundation" },
      { value: 2, text: "I have some spiritual beliefs but they're not deeply integrated", description: "Developing spiritual foundation" },
      { value: 3, text: "I have a solid spiritual foundation that guides my life", description: "Strong spiritual foundation" },
      { value: 4, text: "My spirituality is deeply integrated and sustains my ministry", description: "Deeply integrated spirituality" },
    ],
  },
  {
    id: 5,
    category: "Spiritual Foundation",
    question: "How comfortable are you with spiritual practices like prayer or meditation?",
    options: [
      { value: 1, text: "I rarely engage in spiritual practices", description: "Minimal spiritual practice" },
      { value: 2, text: "I practice occasionally but not consistently", description: "Inconsistent practice" },
      { value: 3, text: "I have regular spiritual practices", description: "Regular spiritual practice" },
      { value: 4, text: "Spiritual practices are central to my daily life", description: "Deeply committed practice" },
    ],
  },
  {
    id: 6,
    category: "Spiritual Foundation",
    question: "How do you handle spiritual doubt or questions?",
    options: [
      { value: 1, text: "I avoid or suppress spiritual questions", description: "Avoidance of doubt" },
      { value: 2, text: "I struggle with doubt but try to work through it", description: "Struggling with doubt" },
      { value: 3, text: "I can hold questions while maintaining faith", description: "Integrated doubt and faith" },
      { value: 4, text: "I embrace questions as part of spiritual growth", description: "Growth-oriented approach to doubt" },
    ],
  },
  {
    id: 7,
    category: "Interpersonal Skills",
    question: "How would you rate your ability to listen empathetically?",
    options: [
      { value: 1, text: "I struggle to listen without judgment or advice-giving", description: "Limited listening skills" },
      { value: 2, text: "I listen but sometimes get distracted or impatient", description: "Developing listening skills" },
      { value: 3, text: "I listen well and can hold space for others", description: "Good listening skills" },
      { value: 4, text: "I listen deeply and help others feel truly heard", description: "Excellent empathetic listening" },
    ],
  },
  {
    id: 8,
    category: "Interpersonal Skills",
    question: "How do you handle conflict or disagreement?",
    options: [
      { value: 1, text: "I avoid conflict or become defensive", description: "Conflict avoidance" },
      { value: 2, text: "I can engage but sometimes react emotionally", description: "Developing conflict skills" },
      { value: 3, text: "I handle conflict respectfully and seek understanding", description: "Good conflict management" },
      { value: 4, text: "I facilitate difficult conversations with wisdom and compassion", description: "Excellent conflict resolution" },
    ],
  },
  {
    id: 9,
    category: "Interpersonal Skills",
    question: "How comfortable are you with people from different backgrounds and beliefs?",
    options: [
      { value: 1, text: "I feel uncomfortable or judgmental around difference", description: "Discomfort with diversity" },
      { value: 2, text: "I'm learning to appreciate diversity", description: "Developing cultural competency" },
      { value: 3, text: "I'm comfortable with diverse people and perspectives", description: "Good cultural competency" },
      { value: 4, text: "I actively seek to understand and learn from difference", description: "Excellent cultural humility" },
    ],
  },
  {
    id: 10,
    category: "Theological Understanding",
    question: "How would you describe your theological knowledge?",
    options: [
      { value: 1, text: "I have limited theological education", description: "Limited theological background" },
      { value: 2, text: "I have some theological knowledge but gaps remain", description: "Developing theological knowledge" },
      { value: 3, text: "I have solid theological education and understanding", description: "Good theological foundation" },
      { value: 4, text: "I have strong theological education and can apply it contextually", description: "Strong theological foundation" },
    ],
  },
  {
    id: 11,
    category: "Theological Understanding",
    question: "How do you integrate theology with practical ministry?",
    options: [
      { value: 1, text: "I struggle to connect theology with real-world situations", description: "Limited integration" },
      { value: 2, text: "I can make some connections but inconsistently", description: "Developing integration" },
      { value: 3, text: "I can reflect theologically on pastoral situations", description: "Good theological reflection" },
      { value: 4, text: "I naturally integrate theology with pastoral care", description: "Excellent theological integration" },
    ],
  },
  {
    id: 12,
    category: "Theological Understanding",
    question: "How comfortable are you with theological diversity?",
    options: [
      { value: 1, text: "I believe my tradition is the only correct one", description: "Exclusive theology" },
      { value: 2, text: "I respect other traditions but believe mine is superior", description: "Developing openness" },
      { value: 3, text: "I respect diverse theological perspectives", description: "Good theological openness" },
      { value: 4, text: "I actively learn from diverse theological traditions", description: "Excellent theological openness" },
    ],
  },
  {
    id: 13,
    category: "Professional Readiness",
    question: "How would you rate your understanding of professional ethics?",
    options: [
      { value: 1, text: "I have limited understanding of professional ethics", description: "Limited ethics knowledge" },
      { value: 2, text: "I understand basic ethics but have gaps", description: "Developing ethics knowledge" },
      { value: 3, text: "I understand professional ethics and can apply them", description: "Good ethics understanding" },
      { value: 4, text: "I have strong ethics knowledge and model ethical practice", description: "Excellent ethics foundation" },
    ],
  },
  {
    id: 14,
    category: "Professional Readiness",
    question: "How comfortable are you with professional boundaries?",
    options: [
      { value: 1, text: "I struggle to maintain appropriate boundaries", description: "Boundary challenges" },
      { value: 2, text: "I understand boundaries but sometimes struggle to maintain them", description: "Developing boundary skills" },
      { value: 3, text: "I maintain appropriate professional boundaries", description: "Good boundary management" },
      { value: 4, text: "I model excellent boundary practices", description: "Excellent boundary management" },
    ],
  },
  {
    id: 15,
    category: "Professional Readiness",
    question: "How do you respond to feedback and supervision?",
    options: [
      { value: 1, text: "I become defensive or resistant to feedback", description: "Defensive response to feedback" },
      { value: 2, text: "I can receive feedback but sometimes struggle with it", description: "Developing receptivity" },
      { value: 3, text: "I welcome feedback and use it to improve", description: "Good receptivity to feedback" },
      { value: 4, text: "I actively seek feedback and integrate it into practice", description: "Excellent receptivity to feedback" },
    ],
  },
  {
    id: 16,
    category: "Self-Awareness",
    question: "How well do you understand your own biases and triggers?",
    options: [
      { value: 1, text: "I'm not very aware of my biases", description: "Limited self-awareness" },
      { value: 2, text: "I'm beginning to recognize some of my biases", description: "Developing self-awareness" },
      { value: 3, text: "I understand most of my biases and work to address them", description: "Good self-awareness" },
      { value: 4, text: "I have strong self-awareness and actively work on growth", description: "Excellent self-awareness" },
    ],
  },
  {
    id: 17,
    category: "Self-Awareness",
    question: "How do you handle your own limitations and vulnerabilities?",
    options: [
      { value: 1, text: "I deny or minimize my limitations", description: "Denial of limitations" },
      { value: 2, text: "I acknowledge limitations but struggle to accept them", description: "Developing acceptance" },
      { value: 3, text: "I accept my limitations and seek support when needed", description: "Good self-acceptance" },
      { value: 4, text: "I embrace my limitations as part of my humanity", description: "Excellent self-acceptance" },
    ],
  },
  {
    id: 18,
    category: "Self-Awareness",
    question: "How committed are you to ongoing personal and professional growth?",
    options: [
      { value: 1, text: "I'm not particularly interested in growth", description: "Limited growth orientation" },
      { value: 2, text: "I'm willing to grow but don't prioritize it", description: "Developing growth orientation" },
      { value: 3, text: "I'm committed to ongoing growth and development", description: "Good growth commitment" },
      { value: 4, text: "I'm deeply committed to lifelong learning and growth", description: "Excellent growth commitment" },
    ],
  },
];

export default function CPEReadinessAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (value: number) => {
    setResponses({ ...responses, [ASSESSMENT_QUESTIONS[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(responses).length === ASSESSMENT_QUESTIONS.length) {
      setShowResults(true);
    }
  };

  const calculateScores = (): CategoryScore[] => {
    const categories: Record<string, { total: number; count: number }> = {};

    ASSESSMENT_QUESTIONS.forEach((q) => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, count: 0 };
      }
      if (responses[q.id]) {
        categories[q.category].total += responses[q.id];
        categories[q.category].count += 1;
      }
    });

    const iconMap: Record<string, React.ReactNode> = {
      "Emotional Resilience": <Heart className="h-6 w-6" />,
      "Spiritual Foundation": <BookOpen className="h-6 w-6" />,
      "Interpersonal Skills": <Users className="h-6 w-6" />,
      "Theological Understanding": <Brain className="h-6 w-6" />,
      "Professional Readiness": <Shield className="h-6 w-6" />,
      "Self-Awareness": <TrendingUp className="h-6 w-6" />,
    };

    const descriptionMap: Record<string, string> = {
      "Emotional Resilience": "Ability to manage emotions and handle stress",
      "Spiritual Foundation": "Personal spiritual depth and practice",
      "Interpersonal Skills": "Ability to connect with and understand others",
      "Theological Understanding": "Theological knowledge and integration",
      "Professional Readiness": "Professional competency and ethics",
      "Self-Awareness": "Understanding of self and commitment to growth",
    };

    return Object.entries(categories).map(([name, data]) => ({
      name,
      score: Math.round(data.total),
      maxScore: data.count * 4,
      percentage: Math.round((data.total / (data.count * 4)) * 100),
      icon: iconMap[name] || <CheckCircle2 className="h-6 w-6" />,
      description: descriptionMap[name] || "",
    }));
  };

  const scores = calculateScores();
  const overallScore = Math.round(
    (scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
  );

  const getReadinessLevel = (score: number): { level: string; color: string; description: string } => {
    if (score >= 90) return { level: "Excellent", color: "bg-green-100 text-green-800", description: "You are well-prepared for CPE" };
    if (score >= 75) return { level: "Good", color: "bg-blue-100 text-blue-800", description: "You have solid preparation with some areas to develop" };
    if (score >= 60) return { level: "Developing", color: "bg-yellow-100 text-yellow-800", description: "You have potential but should focus on key areas" };
    return { level: "Needs Work", color: "bg-red-100 text-red-800", description: "Consider additional preparation before CPE" };
  };

  const readinessLevel = getReadinessLevel(overallScore);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <PublicNav />
        <div className="container py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Overall Score */}
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl mb-4">{overallScore}%</CardTitle>
                <Badge className={`${readinessLevel.color} text-lg px-4 py-2 mx-auto`}>
                  {readinessLevel.level}
                </Badge>
                <CardDescription className="text-lg mt-4">
                  {readinessLevel.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Category Scores */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Category Breakdown</h2>
              <div className="grid gap-4">
                {scores.map((score) => (
                  <Card key={score.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {score.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{score.name}</h3>
                            <p className="text-sm text-muted-foreground">{score.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">{score.percentage}%</div>
                          <div className="text-sm text-muted-foreground">{score.score}/{score.maxScore}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${score.percentage}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scores
                  .filter((s) => s.percentage < 75)
                  .map((score) => (
                    <div key={score.name} className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-semibold mb-2">{score.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        This area scored {score.percentage}%. Consider focusing on development here before or during CPE.
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        {score.name === "Emotional Resilience" && (
                          <>
                            <li>Develop regular stress management practices</li>
                            <li>Consider counseling or therapy to process emotions</li>
                            <li>Build a support network before CPE</li>
                          </>
                        )}
                        {score.name === "Spiritual Foundation" && (
                          <>
                            <li>Establish consistent spiritual practices</li>
                            <li>Engage in spiritual direction or mentoring</li>
                            <li>Explore your faith questions in depth</li>
                          </>
                        )}
                        {score.name === "Interpersonal Skills" && (
                          <>
                            <li>Take communication or counseling skills courses</li>
                            <li>Practice active listening in relationships</li>
                            <li>Seek feedback from trusted mentors</li>
                          </>
                        )}
                        {score.name === "Theological Understanding" && (
                          <>
                            <li>Take theology courses or seminars</li>
                            <li>Read foundational theological texts</li>
                            <li>Engage in theological discussion groups</li>
                          </>
                        )}
                        {score.name === "Professional Readiness" && (
                          <>
                            <li>Study professional ethics and boundaries</li>
                            <li>Review chaplaincy standards and competencies</li>
                            <li>Seek mentoring from experienced chaplains</li>
                          </>
                        )}
                        {score.name === "Self-Awareness" && (
                          <>
                            <li>Engage in personal therapy or counseling</li>
                            <li>Practice journaling and reflection</li>
                            <li>Seek feedback from trusted colleagues</li>
                          </>
                        )}
                      </ul>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Based on your assessment results:</p>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Review the recommendations above for your lower-scoring areas</li>
                  <li>Create a development plan addressing key areas</li>
                  <li>Consider additional preparation or training as needed</li>
                  <li>Discuss your results with a mentor or supervisor</li>
                  <li>When ready, enroll in the CPE Chaplaincy Training program</li>
                </ol>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setResponses({});
                }}
              >
                Retake Assessment
              </Button>
              <Button
                onClick={() => {
                  // Navigate to enrollment or resources
                  window.location.href = "/chaplaincy-training";
                }}
              >
                Enroll in CPE Program
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const isAnswered = responses[question.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <PublicNav />
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">CPE Readiness Assessment</h1>
            <p className="text-xl text-muted-foreground">
              Evaluate your preparation for Clinical Pastoral Education
            </p>
          </div>

          {/* Progress */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</span>
                  <span className="text-muted-foreground">{Math.round(((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="mb-8">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">
                {question.category}
              </Badge>
              <CardTitle className="text-2xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={responses[question.id]?.toString() || ""} onValueChange={(value) => handleResponse(parseInt(value))}>
                <div className="space-y-4">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="mt-1" />
                      <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                        <div className="font-semibold">{option.text}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!isAnswered}
                size="lg"
              >
                View Results
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
