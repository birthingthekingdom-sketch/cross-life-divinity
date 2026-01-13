import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { Calendar, CheckCircle, Clock, BookOpen, Target, AlertCircle, ArrowRight, Download } from "lucide-react";
import { Link } from "wouter";

interface StudyPlan {
  id: string;
  name: string;
  duration: number; // in weeks
  hoursPerWeek: number;
  description: string;
  schedule: StudySession[];
}

interface StudySession {
  week: number;
  day: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  completed: boolean;
}

interface UserStudyPlan {
  planId: string;
  startDate: string;
  endDate: string;
  completedSessions: number;
  totalSessions: number;
  progress: number;
  sessions: StudySession[];
}

// Pre-defined study plans
const STUDY_PLANS: StudyPlan[] = [
  {
    id: "4-week-intensive",
    name: "4-Week Intensive Prep",
    duration: 4,
    hoursPerWeek: 20,
    description: "Fast-track preparation for students with some background knowledge. Requires 20 hours per week.",
    schedule: [
      // Week 1
      { week: 1, day: "Monday", subject: "Mathematics", topic: "Algebra Fundamentals", duration: 120, completed: false },
      { week: 1, day: "Tuesday", subject: "Language Arts", topic: "Reading Comprehension", duration: 120, completed: false },
      { week: 1, day: "Wednesday", subject: "Science", topic: "Life Science Basics", duration: 120, completed: false },
      { week: 1, day: "Thursday", subject: "Social Studies", topic: "U.S. History Overview", duration: 120, completed: false },
      { week: 1, day: "Friday", subject: "Mathematics", topic: "Geometry Essentials", duration: 120, completed: false },
      { week: 1, day: "Saturday", subject: "Language Arts", topic: "Writing Skills", duration: 120, completed: false },
      { week: 1, day: "Sunday", subject: "Review & Practice", topic: "Week 1 Review", duration: 120, completed: false },
      
      // Week 2
      { week: 2, day: "Monday", subject: "Mathematics", topic: "Data Analysis", duration: 120, completed: false },
      { week: 2, day: "Tuesday", subject: "Language Arts", topic: "Grammar & Syntax", duration: 120, completed: false },
      { week: 2, day: "Wednesday", subject: "Science", topic: "Physical Science", duration: 120, completed: false },
      { week: 2, day: "Thursday", subject: "Social Studies", topic: "Civics & Government", duration: 120, completed: false },
      { week: 2, day: "Friday", subject: "Mathematics", topic: "Problem Solving", duration: 120, completed: false },
      { week: 2, day: "Saturday", subject: "Language Arts", topic: "Essay Writing", duration: 120, completed: false },
      { week: 2, day: "Sunday", subject: "Review & Practice", topic: "Week 2 Review", duration: 120, completed: false },
      
      // Week 3
      { week: 3, day: "Monday", subject: "Mathematics", topic: "Advanced Algebra", duration: 120, completed: false },
      { week: 3, day: "Tuesday", subject: "Language Arts", topic: "Critical Reading", duration: 120, completed: false },
      { week: 3, day: "Wednesday", subject: "Science", topic: "Earth & Space Science", duration: 120, completed: false },
      { week: 3, day: "Thursday", subject: "Social Studies", topic: "Economics", duration: 120, completed: false },
      { week: 3, day: "Friday", subject: "Mathematics", topic: "Practice Test 1", duration: 120, completed: false },
      { week: 3, day: "Saturday", subject: "Language Arts", topic: "Practice Test 1", duration: 120, completed: false },
      { week: 3, day: "Sunday", subject: "Review & Practice", topic: "Week 3 Review", duration: 120, completed: false },
      
      // Week 4
      { week: 4, day: "Monday", subject: "Science", topic: "Practice Test 1", duration: 120, completed: false },
      { week: 4, day: "Tuesday", subject: "Social Studies", topic: "Practice Test 1", duration: 120, completed: false },
      { week: 4, day: "Wednesday", subject: "Full-Length", topic: "Diagnostic Test", duration: 300, completed: false },
      { week: 4, day: "Thursday", subject: "Review", topic: "Weak Areas Review", duration: 180, completed: false },
      { week: 4, day: "Friday", subject: "Full-Length", topic: "Final Practice Test", duration: 300, completed: false },
      { week: 4, day: "Saturday", subject: "Review", topic: "Final Review", duration: 180, completed: false },
      { week: 4, day: "Sunday", subject: "Rest", topic: "Rest Day", duration: 0, completed: false },
    ]
  },
  {
    id: "8-week-standard",
    name: "8-Week Standard Prep",
    duration: 8,
    hoursPerWeek: 12,
    description: "Balanced preparation program. Ideal for most students. Requires 12 hours per week.",
    schedule: [
      // Simplified for brevity - in real app would have full 8 weeks
      { week: 1, day: "Monday", subject: "Mathematics", topic: "Number Sense & Operations", duration: 90, completed: false },
      { week: 1, day: "Wednesday", subject: "Language Arts", topic: "Reading Comprehension", duration: 90, completed: false },
      { week: 1, day: "Friday", subject: "Science", topic: "Scientific Reasoning", duration: 90, completed: false },
      { week: 1, day: "Sunday", subject: "Social Studies", topic: "Civics Basics", duration: 90, completed: false },
    ]
  },
  {
    id: "12-week-relaxed",
    name: "12-Week Relaxed Prep",
    duration: 12,
    hoursPerWeek: 8,
    description: "Extended preparation with flexible pacing. Perfect for working professionals. Requires 8 hours per week.",
    schedule: [
      { week: 1, day: "Tuesday", subject: "Mathematics", topic: "Foundations", duration: 60, completed: false },
      { week: 1, day: "Thursday", subject: "Language Arts", topic: "Reading Basics", duration: 60, completed: false },
      { week: 1, day: "Saturday", subject: "Science", topic: "Intro to Science", duration: 60, completed: false },
    ]
  }
];

function PlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  if (selectedPlan) {
    const plan = STUDY_PLANS.find(p => p.id === selectedPlan);
    if (!plan) return null;
    return <StudyScheduleView plan={plan} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="bridge-academy" />
      
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">GED Study Schedules</h1>
          <p className="text-xl text-white/90">
            Choose a personalized study plan that fits your timeline and learning pace
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {STUDY_PLANS.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-6 flex-1">{plan.description}</p>
                  
                  <div className="space-y-3 mb-6 bg-primary/5 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{plan.duration} weeks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{plan.hoursPerWeek} hours/week</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{plan.schedule.length} study sessions</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full"
                  >
                    Choose This Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How Study Schedules Help</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Structured Learning</h3>
                <p className="text-muted-foreground">
                  Follow a proven curriculum designed by GED experts to ensure comprehensive coverage of all topics.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Time Management</h3>
                <p className="text-muted-foreground">
                  Know exactly how much time to spend on each topic and when to take practice tests.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your progress and stay motivated with visual completion indicators.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <AlertCircle className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Flexible Pacing</h3>
                <p className="text-muted-foreground">
                  Adjust your schedule as needed. Pause, extend, or accelerate your learning based on your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StudyScheduleView({ plan }: { plan: StudyPlan }) {
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  const weekSessions = plan.schedule.filter(s => s.week === currentWeek);
  const totalSessions = plan.schedule.length;
  const completedCount = completedSessions.length;
  const progressPercent = Math.round((completedCount / totalSessions) * 100);

  const toggleSession = (index: number) => {
    setCompletedSessions(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getTotalHours = (sessions: StudySession[]) => {
    return sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="bridge-academy" />
      
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{plan.name}</h1>
              <p className="text-white/90">
                {plan.duration} weeks • {plan.hoursPerWeek} hours/week
              </p>
            </div>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              <Download className="mr-2 h-4 w-4" />
              Download Schedule
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Progress Overview */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
                  <p className="text-3xl font-bold text-primary">{progressPercent}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sessions Completed</p>
                  <p className="text-3xl font-bold">{completedCount}/{totalSessions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Week</p>
                  <p className="text-3xl font-bold">{currentWeek}/{plan.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Week's Hours</p>
                  <p className="text-3xl font-bold">{getTotalHours(weekSessions).toFixed(1)}h</p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Week Navigation */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: plan.duration }, (_, i) => i + 1).map(week => (
              <button
                key={week}
                onClick={() => setCurrentWeek(week)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  currentWeek === week
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week {week}
              </button>
            ))}
          </div>

          {/* Study Sessions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Week {currentWeek} Schedule</h2>
            
            {weekSessions.map((session, idx) => {
              const sessionIndex = plan.schedule.indexOf(session);
              const isCompleted = completedSessions.includes(sessionIndex);
              
              return (
                <Card key={idx} className={isCompleted ? "bg-green-50 border-green-200" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleSession(sessionIndex)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                          isCompleted
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className={`font-bold text-lg ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                              {session.day}: {session.subject}
                            </h3>
                            <p className="text-muted-foreground">{session.topic}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              {session.duration} min
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                            {session.subject}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tips Section */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Study Tips for Success
              </h3>
              <ul className="space-y-2 text-sm text-blue-900">
                <li>• Find a quiet study space free from distractions</li>
                <li>• Take breaks every 25-30 minutes (Pomodoro technique)</li>
                <li>• Review previous material regularly to reinforce learning</li>
                <li>• Don't skip practice tests - they're crucial for exam readiness</li>
                <li>• Adjust your schedule if you fall behind - consistency matters more than speed</li>
                <li>• Join study groups for motivation and accountability</li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8 flex gap-4">
            <Link href="/bridge-academy/practice-tests">
              <Button variant="outline" className="flex-1">
                Take a Practice Test
              </Button>
            </Link>
            <Button className="flex-1">
              Save & Continue
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function BridgeAcademyStudySchedule() {
  return <PlanSelection />;
}
