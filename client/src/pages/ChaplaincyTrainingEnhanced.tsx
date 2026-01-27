import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Users,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Shield,
} from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { CPEAccreditationBadge } from "@/components/CPEAccreditationBadge";

export default function ChaplaincyTrainingEnhanced() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  const cpePathways = [
    {
      title: "Healthcare Chaplaincy",
      description: "Provide spiritual care in hospitals, hospices, and medical facilities",
      icon: <Heart className="h-8 w-8" />,
      focus: "End-of-life care, crisis support, family ministry",
      hours: "400+",
    },
    {
      title: "Military Chaplaincy",
      description: "Support service members and their families",
      icon: <Shield className="h-8 w-8" />,
      focus: "Combat trauma, moral injury, unit cohesion",
      hours: "400+",
    },
    {
      title: "Correctional Chaplaincy",
      description: "Minister to incarcerated individuals",
      icon: <Users className="h-8 w-8" />,
      focus: "Rehabilitation, redemption, justice",
      hours: "400+",
    },
    {
      title: "Corporate Chaplaincy",
      description: "Serve employees in workplace settings",
      icon: <Zap className="h-8 w-8" />,
      focus: "Employee wellbeing, crisis response, ethics",
      hours: "400+",
    },
  ];

  const coreModules = [
    {
      title: "Pastoral Presence & Communication",
      description: "Master active listening, empathy, and authentic presence",
      hours: 40,
    },
    {
      title: "Spiritual Assessment & Care Planning",
      description: "Assess spiritual needs and develop appropriate interventions",
      hours: 40,
    },
    {
      title: "Crisis Intervention & Trauma-Informed Care",
      description: "Respond effectively to crises and support trauma survivors",
      hours: 40,
    },
    {
      title: "Interfaith & Multicultural Competency",
      description: "Serve diverse religious and cultural populations with respect",
      hours: 40,
    },
    {
      title: "Professional Ethics & Boundaries",
      description: "Maintain ethical practice and appropriate professional boundaries",
      hours: 30,
    },
    {
      title: "Theological Reflection & Integration",
      description: "Integrate theology with clinical practice",
      hours: 30,
    },
    {
      title: "Self-Care & Burnout Prevention",
      description: "Develop sustainable practices for long-term ministry",
      hours: 20,
    },
    {
      title: "Grief, Loss & End-of-Life Care",
      description: "Support individuals and families through loss and dying",
      hours: 40,
    },
    {
      title: "Clinical Supervision & Reflective Practice",
      description: "Learn from supervision and develop reflective practice skills",
      hours: 40,
    },
    {
      title: "Institutional Context & Team Collaboration",
      description: "Understand institutional dynamics and work effectively with teams",
      hours: 30,
    },
  ];

  const faqs = [
    {
      question: "What is Clinical Pastoral Education (CPE)?",
      answer:
        "CPE is a structured, supervised program combining theological education with clinical practice in institutional settings. It develops pastoral care competencies through direct experience, reflection, and feedback. Our program requires 400+ clinical hours and includes regular supervision, case studies, and theological reflection.",
    },
    {
      question: "How long does the CPE program take?",
      answer:
        "Our standard CPE program is 12 weeks of full-time study and practice. This includes approximately 400 clinical hours of direct patient/client care, supervision, and professional development. Part-time options may be available for working professionals.",
    },
    {
      question: "What are the prerequisites for CPE?",
      answer:
        "Prerequisites include: (1) Bachelor's degree from an accredited institution, (2) Endorsement from a faith community or spiritual director, (3) Completion of a readiness assessment, (4) Personal interview with program director. We welcome applicants from diverse faith traditions.",
    },
    {
      question: "What will I learn in CPE?",
      answer:
        "You'll develop competencies in pastoral presence, spiritual assessment, crisis intervention, interfaith care, professional ethics, theological reflection, and self-care. You'll work directly with patients/clients, participate in supervision, and reflect on your experiences through case studies and theological writing.",
    },
    {
      question: "What are the career outcomes after CPE?",
      answer:
        "CPE graduates pursue careers as hospital chaplains, military chaplains, prison chaplains, corporate chaplains, hospice chaplains, and spiritual care coordinators. Many continue to advanced CPE programs or specialized chaplaincy certifications.",
    },
    {
      question: "How much does CPE cost?",
      answer:
        "Pricing varies based on program length and setting. Contact our admissions office for current pricing and financial aid options. We offer payment plans and scholarships for qualified candidates.",
    },
    {
      question: "Can I do CPE part-time?",
      answer:
        "Yes, we offer both full-time and part-time options. Part-time programs typically extend over 6-9 months with reduced weekly hours. Contact us to discuss options that fit your schedule.",
    },
    {
      question: "What faith traditions do you serve?",
      answer:
        "We serve chaplains and students from all faith traditions. Our program emphasizes interfaith competency and cultural humility. We have supervisors and mentors from diverse religious backgrounds.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <PublicNav />

      {/* Hero Section */}
      <div className="container py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <Badge className="mx-auto">Clinical Pastoral Education</Badge>
          <h1 className="text-5xl font-bold">Transform Your Ministry Through CPE</h1>
          <p className="text-xl text-muted-foreground">
            Develop professional chaplaincy competencies through supervised clinical practice, theological reflection, and peer learning. Prepare for meaningful ministry in healthcare, military, correctional, and corporate settings.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/cpe-readiness">
              <Button size="lg">
                Take Readiness Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cpe-pathway">
              <Button size="lg" variant="outline">
                View CPE Pathway
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CPE Accreditation Badge */}
      <div className="container">
        <CPEAccreditationBadge cpeHours={30} colorTheme="#7c3aed" />
      </div>

      {/* CPE Pathways */}
      <div className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Chaplaincy Career Pathways</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your chaplaincy specialization and develop expertise in your chosen field
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cpePathways.map((pathway, index) => (
            <Card key={index} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">{pathway.icon}</div>
                  <Badge variant="secondary">{pathway.hours}</Badge>
                </div>
                <CardTitle className="mt-4">{pathway.title}</CardTitle>
                <CardDescription>{pathway.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  <strong>Focus Areas:</strong> {pathway.focus}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Modules */}
      <div className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Core Learning Modules</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive curriculum covering essential chaplaincy competencies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {coreModules.map((module, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{module.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {module.description}
                    </p>
                    <Badge variant="outline">{module.hours} hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Total Program: 400+ clinical hours + supervision + theological reflection
          </p>
        </div>
      </div>

      {/* Resources & Tools */}
      <div className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">CPE Learning Resources</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive materials to support your chaplaincy development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/cpe-readiness">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Readiness Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Evaluate your preparation for CPE with personalized feedback
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cpe-pathway">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">CPE Pathway Map</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize your journey through the CPE program phases
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cpe-glossary">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">CPE Glossary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Essential terms and definitions for chaplaincy practice
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cpe-case-studies">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Case Studies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn from realistic chaplaincy scenarios and discussions
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Program Highlights */}
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Accredited Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our CPE program meets standards set by the Association of Professional Chaplains and Healthcare Chaplaincy Certification Commission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Expert Supervision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn from experienced, credentialed supervisors who provide individual and group supervision throughout the program.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-4" />
              <CardTitle>Holistic Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Develop clinical skills, theological understanding, professional ethics, and personal spiritual growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Find answers to common questions about our CPE program
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="cursor-pointer">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full p-6 text-left hover:bg-accent/50 transition-colors flex items-center justify-between"
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <span className="text-2xl text-muted-foreground">
                  {expandedFAQ === index ? "−" : "+"}
                </span>
              </button>

              {expandedFAQ === index && (
                <div className="px-6 pb-6 border-t">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Begin Your CPE Journey?</CardTitle>
            <CardDescription className="text-lg">
              Take the first step toward professional chaplaincy certification
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-center">
            <Link href="/cpe-readiness">
              <Button size="lg">
                Start Readiness Assessment
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Contact Admissions
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
