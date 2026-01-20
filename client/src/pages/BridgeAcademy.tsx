import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicNav } from "@/components/PublicNav";
import { BookOpen, CheckCircle, Users, Award, ArrowRight, Share2, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export function BridgeAcademy() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/bridge-academy/:subject");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(params?.subject || null);
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const enrollBridgeAcademyFree = trpc.payment.enrollBridgeAcademyFree.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in Bridge Academy!");
      setTimeout(() => navigate("/bridge-academy"), 1000);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to enroll in Bridge Academy");
    },
  });

  const handleEnrollBridgeAcademy = () => {
    if (!isAuthenticated) {
      navigate("/pricing");
      return;
    }
    enrollBridgeAcademyFree.mutate();
  };

  useEffect(() => {
    if (params?.subject) {
      setSelectedCourse(params.subject);
    }
  }, [params?.subject]);

  const gedSubjects = [
    {
      id: "rla",
      title: "Reasoning Through Language Arts",
      subtitle: "Reading, Writing & Grammar",
      description: "Master reading comprehension, grammar, writing, and vocabulary for the GED test. We prepare you to pass this critical section and earn your GED diploma.",
      icon: "📚",
      topics: 8,
      color: "from-blue-500 to-blue-600",
      features: ["Reading Comprehension", "Grammar & Punctuation", "Writing Skills", "Vocabulary"],
    },
    {
      id: "math",
      title: "Mathematical Reasoning",
      subtitle: "Algebra, Geometry & Data",
      description: "Learn algebra, geometry, data analysis, and problem-solving for the GED test. We guide you through every step to master the math section.",
      icon: "🧮",
      topics: 8,
      color: "from-purple-500 to-purple-600",
      features: ["Algebra Basics", "Geometry", "Data Analysis", "Word Problems"],
    },
    {
      id: "science",
      title: "Science",
      subtitle: "Life, Physical & Earth Science",
      description: "Explore life science, physical science, and earth science for the GED test. Our comprehensive support system helps you succeed on exam day.",
      icon: "🔬",
      topics: 8,
      color: "from-green-500 to-green-600",
      features: ["Biology & Genetics", "Physics & Chemistry", "Earth Science", "Scientific Method"],
    },
    {
      id: "social-studies",
      title: "Social Studies",
      subtitle: "History, Civics & Economics",
      description: "Study U.S. history, civics, economics, and geography for the GED test. We prepare you to pass and earn your diploma with confidence.",
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
      description: "Share your referral link with friends. When they enroll, you get $50 in credits",
    },
  ];

  // If a subject is selected, show the course details view
  if (selectedCourse) {
    const subject = gedSubjects.find(s => s.id === selectedCourse);
    if (!subject) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <PublicNav currentPage="bridge-academy" />
          <div className="p-4">
            <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/bridge-academy")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bridge Academy
            </Button>
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Subject not found</p>
            </Card>
          </div>
        </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <PublicNav currentPage="bridge-academy" />
        {/* Back Button */}
        <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/bridge-academy")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bridge Academy
            </Button>
          </div>
        </div>

        {/* Course Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{subject.icon}</div>
              <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
                {subject.title}
              </h1>
              <p className="text-xl text-foreground/70 mb-6">
                {subject.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="text-2xl font-bold text-green-600">FREE BONUS</div>
                <div className="text-foreground/60">Included with any course enrollment</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">Enroll in a Course</Button>
                </Link>
                <Link href="/bridge-academy/rla">
                  <Button size="lg" variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>

            {/* Course Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">What You'll Learn</h3>
                <ul className="space-y-3">
                  {subject.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-lg mb-4">Course Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Topics Covered</p>
                    <p className="text-2xl font-bold text-primary">{subject.topics}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Duration</p>
                    <p className="text-lg font-semibold">4-6 weeks</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-green-600">FREE with enrollment</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <PublicNav currentPage="bridge-academy" />
      {/* Hero Section with Image */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Hero Image */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/bridge-academy-hero.jpg" 
              alt="Bridge Academy - Global Community Online Learning" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="text-center mb-12">
            {/* Bridge Academy Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src="/bridge-academy-logo.png" 
                alt="Bridge Academy Logo" 
                className="h-32 w-auto object-contain"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Bridge Academy
            </h1>
            <p className="text-xl text-foreground/70 mb-6">
              Affordable GED Prep to Transform Your Future
            </p>
            
            {/* GED Messaging Section */}
            <div className="bg-white rounded-lg border border-primary/20 p-8 my-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary mb-2">Prepare to Pass</p>
                  <p className="text-foreground/70">We prepare you to pass the GED test and earn your diploma.</p>
                </div>
                <div className="text-center border-l border-r border-primary/10 px-6">
                  <p className="text-lg font-semibold text-primary mb-2">Complete Guidance</p>
                  <p className="text-foreground/70">We guide you through every step of the GED process.</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary mb-2">Comprehensive Support</p>
                  <p className="text-foreground/70">Get your GED Diploma with our comprehensive support system.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-2xl font-bold text-green-600">FREE BONUS</div>
              <div className="text-foreground/60">Included with any course enrollment • 4 GED Subjects • Lifetime Access</div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="bg-primary hover:bg-primary/90">Enroll in a Course</Button>
              </Link>
              <Link href="/bridge-academy/rla">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
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
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/bridge-academy/${subject.id}`)}
                  >
                    Explore Topic <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
          <h2 className="text-3xl font-bold mb-4">Share & Earn $50 Referral Credits</h2>
          <p className="text-lg text-foreground/70 mb-6">
            Share your referral link with friends. When they enroll in Bridge Academy, you get $50 in credits to use toward any course or subscription.
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
                <span>They enroll in Bridge Academy → You get $50 credits</span>
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

      {/* GED Success Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Your Path to GED Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Pass the GED Test</h3>
              <p className="text-foreground/70">We prepare you to pass the GED test and earn your diploma with our expert-crafted lessons and comprehensive quizzes.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <div className="text-4xl mb-4">🛤️</div>
              <h3 className="font-semibold text-lg mb-2">Step-by-Step Guidance</h3>
              <p className="text-foreground/70">We guide you through every step of the GED process, from foundational concepts to test-day readiness.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold text-lg mb-2">Complete Support System</h3>
              <p className="text-foreground/70">Get your GED Diploma with our comprehensive support system, including lifetime access and unlimited retakes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Get Bridge Academy FREE when you enroll in any theological course. No additional cost!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg">Enroll in a Course</Button>
            </Link>
            <Link href="/bridge-academy/rla">
              <Button size="lg" variant="outline">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I add Bridge Academy to my existing CLSOD enrollment?</h3>
              <p className="text-foreground/70">
                Yes! Bridge Academy is automatically included FREE with any CLSOD course, path, or subscription enrollment. No additional cost needed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens after I complete Bridge Academy?</h3>
              <p className="text-foreground/70">
                You'll earn a GED Prep Completion Certificate. We recommend taking the official GED test through Pearson VUE to earn your official GED credential.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I retake quizzes?</h3>
              <p className="text-foreground/70">
                Yes! You can retake any quiz unlimited times. Each attempt has different questions, so you can keep practicing until you master the material.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How long does it take to complete?</h3>
              <p className="text-foreground/70">
                It's completely self-paced! Most students complete one subject in 2-3 weeks, so all 4 subjects typically take 8-12 weeks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer payment plans?</h3>
              <p className="text-foreground/70">
                Bridge Academy is completely FREE as a bonus with your course enrollment. As long as you're enrolled in any CLSOD course, you have full access to Bridge Academy at no additional cost.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
