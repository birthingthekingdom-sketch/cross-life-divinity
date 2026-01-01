import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle, Users, Award, ArrowRight, Share2 } from "lucide-react";

export function BridgeAcademy() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
            Share your referral link with friends. When they sign up, you BOTH get $50 in credits to use toward any course or subscription.
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
                <span>They sign up → Both of you get $50 credits</span>
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

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Start your GED prep journey today. $19/month, cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Start Free Trial</Button>
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
                Yes! Bridge Academy is available as an add-on to any CLSOD course, path, or subscription. Just add it to your account for $19/month.
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
                Bridge Academy is a monthly subscription ($19/month). You can cancel anytime. Contact us for custom payment arrangements if needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
