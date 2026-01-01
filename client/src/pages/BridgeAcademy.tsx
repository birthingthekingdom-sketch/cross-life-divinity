import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle, Users, Award, ArrowRight, Share2, ArrowLeft } from "lucide-react";
import { BridgeAcademyNav } from "@/components/BridgeAcademyNav";

export function BridgeAcademy() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/bridge-academy/:subject");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
  const gedSubjects = [
    {
      id: "rla",
      title: "Reasoning Through Language Arts",
      subtitle: "Reading, Writing & Grammar",
      description: "Master reading comprehension, grammar, writing, and vocabulary for the GED test.",
      icon: "📚",
      topics: 8,
      color: "from-blue-500 to-blue-600",
      features: ["Reading Comprehension", "Grammar & Punctuation", "Writing Skills", "Vocabulary"],
    },
    {
      id: "math",
      title: "Mathematical Reasoning",
      subtitle: "Algebra, Geometry & Data",
      description: "Learn algebra, geometry, data analysis, and problem-solving for the GED test.",
      icon: "🧮",
      topics: 8,
      color: "from-purple-500 to-purple-600",
      features: ["Algebra Basics", "Geometry", "Data Analysis", "Word Problems"],
    },
    {
      id: "science",
      title: "Science",
      subtitle: "Life, Physical & Earth Science",
      description: "Explore life science, physical science, and earth science for the GED test.",
      icon: "🔬",
      topics: 8,
      color: "from-green-500 to-green-600",
      features: ["Biology & Genetics", "Physics & Chemistry", "Earth Science", "Scientific Method"],
    },
    {
      id: "social-studies",
      title: "Social Studies",
      subtitle: "History, Civics & Economics",
      description: "Study U.S. history, civics, economics, and geography for the GED test.",
      icon: "🌍",
      topics: 8,
      color: "from-amber-500 to-amber-600",
      features: ["U.S. History", "Civics & Government", "Economics", "Geography"],
    },
  ];

  const benefits = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Expert-Crafted Lessons",
      description: "Comprehensive, professionally-designed lessons covering all GED topics with clear explanations",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "10+ Question Quizzes",
      description: "Test your knowledge with comprehensive quizzes for each topic (70% to pass)",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "GED Prep Certificate",
      description: "Earn a professional certificate upon completing all 4 subjects",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "$50 Referral Bonus",
      description: "Earn $50 credits for each friend who signs up via your referral link",
    },
  ];

  // If subject is selected from URL, show course detail
  const selectedSubject = params?.subject;
  if (match && selectedSubject && !["dashboard", "details", "study-materials", "progress", "diplomas", "course"].includes(selectedSubject)) {
    const subject = gedSubjects.find(s => s.id === selectedSubject);
    if (subject) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <BridgeAcademyNav />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => navigate("/bridge-academy")}
                className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Bridge Academy
              </button>
              <div className={`bg-gradient-to-r ${subject.color} p-8 rounded-lg text-white mb-8`}>
                <div className="text-5xl mb-4">{subject.icon}</div>
                <h1 className="text-4xl font-bold mb-2">{subject.title}</h1>
                <p className="text-white/90 text-lg">{subject.subtitle}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold mb-4">About This Subject</h2>
                  <p className="text-foreground/70 mb-6 leading-relaxed">{subject.description}</p>
                  <h3 className="text-lg font-semibold mb-4">What You'll Learn:</h3>
                  <ul className="space-y-3 mb-8">
                    {subject.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Card className="p-6 sticky top-20">
                    <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
                    <p className="text-foreground/70 mb-6 text-sm">Begin your GED prep journey with comprehensive lessons, practice questions, and expert guidance.</p>
                    <Link href={`/bridge-academy/course/${subject.id}`}>
                      <Button className="w-full" size="lg">
                        Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-xs text-foreground/60 mb-3">Topics Covered</p>
                      <p className="text-2xl font-bold text-primary">{subject.topics}</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BridgeAcademyNav />
      {/* Hero Section with Image */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Hero Image */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/bridge-academy-hero.png" 
              alt="Bridge Academy - GED Prep" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Bridge Academy
            </h1>
            <p className="text-xl text-foreground/70 mb-6">
              Affordable GED Prep to Transform Your Future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-2xl font-bold text-primary">$19/month</div>
              <div className="text-foreground/60">Self-paced • 4 GED Subjects • Lifetime Access</div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Start 7-Day Free Trial</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">4</div>
              <div className="text-sm text-foreground/70">GED Subjects</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">32</div>
              <div className="text-sm text-foreground/70">Topics</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">320+</div>
              <div className="text-sm text-foreground/70">Quiz Questions</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-sm text-foreground/70">Retakes</div>
            </Card>
          </div>
        </div>
      </section>

      {/* GED Subjects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The 4 GED Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gedSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCourse(subject.id)}
              >
                <div className={`bg-gradient-to-r ${subject.color} p-6 text-white`}>
                  <div className="text-4xl mb-2">{subject.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{subject.title}</h3>
                  <p className="text-white/90">{subject.subtitle}</p>
                </div>
                <div className="p-6">
                  <p className="text-foreground/70 mb-4">{subject.description}</p>
                  <div className="space-y-2 mb-6">
                    {subject.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/bridge-academy/${subject.id}`}>
                    <Button className="w-full">
                      Explore Topic <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="text-primary flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-foreground/70">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <Share2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Earn $50 Referral Credits</h2>
          <p className="text-lg text-foreground/70 mb-6">
            Share your referral link with friends. When they sign up, you get $50 in credits to use toward any course or subscription.
          </p>
          <div className="bg-white p-6 rounded-lg border border-border mb-6">
            <p className="text-sm text-foreground/60 mb-2">How it works:</p>
            <ol className="text-left space-y-2 max-w-md mx-auto">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Get your unique referral link in your dashboard</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Share with friends, family, or on social media</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>They sign up → You get $50 credits</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Use credits for any course or subscription</span>
              </li>
            </ol>
          </div>
          <Link href="/login">
            <Button size="lg">Get Your Referral Link</Button>
          </Link>
        </div>
      </section>

      {/* Quick Links to GED Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">GED Program Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/bridge-academy/details">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold mb-2">Program Overview</h3>
                <p className="text-foreground/70 mb-4">Learn about Bridge Academy, success rates, and how the program works</p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
            <Link href="/bridge-academy/study-materials">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">Study Materials</h3>
                <p className="text-foreground/70 mb-4">Download study guides, practice tests, and formula sheets for all subjects</p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  Download <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
            <Link href="/bridge-academy/progress">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Progress Dashboard</h3>
                <p className="text-foreground/70 mb-4">Track your exam readiness and get personalized study recommendations</p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  View <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Future?</h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of students preparing for the GED with Bridge Academy. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">Start Free Trial</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
