import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { Link } from "wouter";
import {
  Award,
  CheckCircle,
  FileText,
  Users,
  BookOpen,
  Zap,
  ArrowRight,
  HelpCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full py-4 flex items-center justify-between text-left hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold pr-4">{question}</span>
        {isOpen ? (
          <Zap className="h-5 w-5 flex-shrink-0" />
        ) : (
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-muted-foreground space-y-2">
          {answer.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LifeExperienceCredits() {
  const faqs = [
    {
      question: "What types of experience qualify for PLA?",
      answer: "Qualifying experience includes: professional ministry roles (pastor, chaplain, missionary), volunteer service (church leadership, community service), military training, professional certifications, and relevant work experience. Each claim is evaluated individually based on demonstrated competency.",
    },
    {
      question: "How many credits can I earn through PLA?",
      answer: "Students can earn up to 30 CLAC hours (approximately 15 semester credits) through Prior Learning Assessment. This typically represents up to 25% of a degree program. The exact amount depends on the scope and depth of your documented experience.",
    },
    {
      question: "What's the process for applying for PLA?",
      answer: "1) Complete the PLA application form\n2) Submit documentation of your experience (certificates, letters, portfolios)\n3) Write a narrative describing your learning\n4) Participate in an assessment interview\n5) Receive evaluation results\n6) Credits are posted to your transcript",
    },
    {
      question: "How much does PLA cost?",
      answer: "PLA assessment fee is $150 per evaluation. This is a one-time fee that covers the review of your portfolio, assessment interview, and credit determination. You only pay for the credits you actually earn.",
    },
    {
      question: "How long does the PLA process take?",
      answer: "The typical PLA evaluation takes 4-6 weeks from submission to final decision. This includes portfolio review, assessment interview scheduling, and credit determination. Rush evaluations are available for an additional fee.",
    },
    {
      question: "Can I combine PLA with other programs?",
      answer: "Yes! You can combine Prior Learning Assessment credits with our regular courses, financial aid, and other programs. Many students use PLA to accelerate their degree completion while maintaining academic rigor.",
    },
    {
      question: "Will PLA credits transfer to other institutions?",
      answer: "PLA credits appear on your CLSD transcript and may transfer to other institutions at their discretion. We recommend contacting your target institution before starting PLA to confirm their transfer policies.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Gather Documentation",
      description: "Collect evidence of your learning: certificates, letters of recommendation, work samples, portfolios",
      icon: FileText,
    },
    {
      number: "2",
      title: "Complete Application",
      description: "Fill out the PLA application form and submit your documentation package",
      icon: CheckCircle,
    },
    {
      number: "3",
      title: "Write Narrative",
      description: "Describe how your experience aligns with course learning outcomes",
      icon: BookOpen,
    },
    {
      number: "4",
      title: "Assessment Interview",
      description: "Participate in a 30-60 minute conversation with an assessor about your experience",
      icon: Users,
    },
    {
      number: "5",
      title: "Receive Credits",
      description: "Get your evaluation results and have credits posted to your transcript",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="accreditation" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Life Experience Credits</h1>
            <p className="text-xl text-white/90">
              Prior Learning Assessment (PLA) allows you to earn college credit for your professional ministry experience, volunteer service, and demonstrated competencies.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="pt-8">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Up to 30 Credits</h3>
                <p className="text-muted-foreground">
                  Earn up to 30 CLAC hours through documented experience
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">4-6 Week Process</h3>
                <p className="text-muted-foreground">
                  Fast evaluation from application to credit posting
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Affordable</h3>
                <p className="text-muted-foreground">
                  Only $150 per evaluation, only pay for credits earned
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What Qualifies */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">What Qualifies for PLA?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Professional Experience</h3>
                <ul className="space-y-3">
                  {[
                    "Pastoral ministry roles",
                    "Chaplaincy experience",
                    "Missionary work",
                    "Church leadership positions",
                    "Ministry training programs",
                    "Professional certifications",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Volunteer & Community Service</h3>
                <ul className="space-y-3">
                  {[
                    "Church volunteer leadership",
                    "Community outreach programs",
                    "Mentoring and discipleship",
                    "Counseling experience",
                    "Teaching and training",
                    "Administrative leadership",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12">The PLA Process</h2>
            <div className="space-y-6">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center mb-16">
            <h3 className="text-2xl font-bold mb-4">Ready to Earn Credits for Your Experience?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start your Prior Learning Assessment today and get credit for what you already know.
            </p>
            <Button size="lg">
              Apply for PLA
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/20">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>
          <div className="bg-background rounded-lg border border-border p-8">
            <div className="space-y-0">
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
