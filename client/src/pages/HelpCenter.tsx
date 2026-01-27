import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { Link } from "wouter";
import {
  Search,
  BookOpen,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
          <ChevronUp className="h-5 w-5 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0" />
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

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I access my courses?",
      answer: "After enrollment, log in to your student dashboard using your email and password. You'll see all your enrolled courses listed. Click on any course to view lessons, quizzes, and assignments. Your progress is automatically saved as you complete each lesson.",
    },
    {
      question: "How long do I have access to courses?",
      answer: "You have lifetime access to all courses you enroll in. There's no expiration date. You can take as long as you need to complete the material and return anytime to review lessons or refresh your knowledge.",
    },
    {
      question: "What if I need technical support?",
      answer: "Our technical support team is available Monday-Friday, 9 AM - 5 PM EST. You can reach us via email at support@crosslifedivinity.com or call 1-800-CLSD-HELP. We typically respond to emails within 24 hours.",
    },
    {
      question: "Can I download course materials?",
      answer: "Yes! Most course materials can be downloaded for offline access. Lesson PDFs, study guides, and supplementary materials are available in the course resources section. Videos are streamable but cannot be downloaded.",
    },
    {
      question: "How do I submit assignments?",
      answer: "Each course has an assignments section. Click on the assignment, read the instructions, and upload your completed work. You can submit before the deadline and make revisions. Your instructor will grade and provide feedback within 5-7 business days.",
    },
    {
      question: "What happens if I don't pass a quiz?",
      answer: "You can retake quizzes multiple times. There's no penalty for retaking. We recommend reviewing the lesson material before your next attempt. Your highest score is recorded for your final grade.",
    },
    {
      question: "How do I get my certificate?",
      answer: "Certificates are automatically generated once you complete all lessons, pass all quizzes (70% minimum), and submit all assignments. You'll receive an email notification with a download link. Certificates are CLAC-accredited and include CPD hours.",
    },
    {
      question: "Can I get a refund?",
      answer: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with your course, request a refund within 14 days of enrollment with no questions asked. See our Refund Policy page for complete details.",
    },
    {
      question: "Is there student support available?",
      answer: "Absolutely! We provide academic support including study guides, tutoring sessions, and one-on-one instructor consultations. You can also join our student community forums to connect with other learners and share insights.",
    },
    {
      question: "How do I update my profile information?",
      answer: "Log into your student dashboard and click on 'Account Settings' or 'My Profile'. You can update your name, email, phone number, and other information. Changes take effect immediately.",
    },
  ];

  const categories = [
    {
      title: "Getting Started",
      icon: Zap,
      topics: [
        "Creating your account",
        "Logging in and accessing courses",
        "Navigating the student dashboard",
        "Understanding course structure",
      ],
    },
    {
      title: "Course Navigation",
      icon: BookOpen,
      topics: [
        "Viewing lessons and materials",
        "Submitting assignments",
        "Taking quizzes",
        "Tracking your progress",
      ],
    },
    {
      title: "Certificates & Credentials",
      icon: CheckCircle,
      topics: [
        "Earning your certificate",
        "Downloading certificates",
        "Certificate verification",
        "CPD hours and accreditation",
      ],
    },
    {
      title: "Account & Billing",
      icon: AlertCircle,
      topics: [
        "Updating account information",
        "Payment methods",
        "Refunds and cancellations",
        "Financial aid options",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="help" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-white/90">
              Find answers to common questions and get support for your learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.topics.map((topic) => (
                        <li key={topic} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          • {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* Contact Support */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Still Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Response time: 24 hours
                </p>
                <a
                  href="mailto:support@crosslifedivinity.com"
                  className="text-primary hover:underline font-medium"
                >
                  support@crosslifedivinity.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Phone Support</h3>
                <p className="text-muted-foreground mb-4">
                  Mon-Fri, 9 AM - 5 PM EST
                </p>
                <a
                  href="tel:1-800-2573-4357"
                  className="text-primary hover:underline font-medium"
                >
                  1-800-CLSD-HELP
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Available during business hours
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
