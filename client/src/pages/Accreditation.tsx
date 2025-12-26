import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { 
  Shield, 
  BookOpen, 
  Users, 
  Scale, 
  GraduationCap, 
  FileCheck, 
  TrendingUp, 
  Monitor, 
  HeartHandshake, 
  ClipboardList, 
  DollarSign, 
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Phone,
  ArrowRight,
  Building2
} from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { useState } from "react";

// Collapsible Standard Component
function StandardSection({ 
  number, 
  title, 
  icon: Icon, 
  description, 
  requirements 
}: { 
  number: string;
  title: string;
  icon: React.ElementType;
  description: string;
  requirements: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Standard {number}</p>
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="font-semibold mb-2">Key Requirements:</p>
            <ul className="space-y-2">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// FAQ Item Component
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
        <div className="pb-4 text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Accreditation() {
  const standards = [
    {
      number: "I",
      title: "Institutional Purpose",
      icon: Target,
      description: "CLSD maintains a clear mission statement that guides all institutional decisions. Our mission is to provide high-quality, CLAC-accredited theological education that empowers ministry leaders worldwide to deepen their biblical knowledge, strengthen their ministry skills, and transform their communities through the gospel of Jesus Christ.",
      requirements: [
        "Written mission statement approved by governing board",
        "Specific, measurable institutional objectives",
        "Theological foundation consistent with historic Christian orthodoxy",
        "Regular review of mission effectiveness"
      ]
    },
    {
      number: "II",
      title: "Organizational Leadership",
      icon: Users,
      description: "CLSD is governed by a Board of Directors that exercises fiduciary responsibility and ensures mission fulfillment. Qualified administrators manage day-to-day operations.",
      requirements: [
        "Governing board with diverse expertise",
        "Qualified administrative leadership",
        "Written policies for all significant operations",
        "Systematic planning processes"
      ]
    },
    {
      number: "III",
      title: "Fiscal Responsibility",
      icon: DollarSign,
      description: "CLSD maintains sound financial practices including budgeting, accounting, and appropriate reserves. The governing board exercises oversight of institutional finances.",
      requirements: [
        "Positive operating results",
        "Adequate financial reserves",
        "Sound financial management practices",
        "Board oversight of finances"
      ]
    },
    {
      number: "IV",
      title: "Ethical Operations",
      icon: Scale,
      description: "CLSD represents itself accurately in all communications and treats all stakeholders fairly. We are forthright about our accreditation status.",
      requirements: [
        "Truthful representation in all materials",
        "Clear accreditation disclosure",
        "Fair treatment of all stakeholders",
        "Conflict of interest policies"
      ]
    },
    {
      number: "V",
      title: "Academic Programs",
      icon: BookOpen,
      description: "All CLSD programs are well-designed with clear learning outcomes and coherent curriculum. Courses maintain appropriate academic rigor and theological integrity.",
      requirements: [
        "Clear program purposes and learning outcomes",
        "Curriculum aligned with outcomes",
        "Appropriate academic rigor",
        "Regular curriculum review"
      ]
    },
    {
      number: "VI",
      title: "Instructional Personnel",
      icon: GraduationCap,
      description: "CLSD faculty possess appropriate academic credentials and ministry experience for their teaching assignments. Faculty engage in ongoing professional development.",
      requirements: [
        "Qualified faculty for all courses",
        "Sufficient faculty to deliver programs effectively",
        "Ongoing faculty development",
        "Regular faculty evaluation"
      ]
    },
    {
      number: "VII",
      title: "Educational Effectiveness",
      icon: TrendingUp,
      description: "CLSD systematically assesses student achievement of learning outcomes and uses assessment data for program improvement.",
      requirements: [
        "Defined learning outcomes at all levels",
        "Systematic assessment of student learning",
        "Student achievement standards and monitoring",
        "Assessment-driven improvement"
      ]
    },
    {
      number: "VIII",
      title: "Learning Support Systems",
      icon: Monitor,
      description: "CLSD provides reliable technology infrastructure, adequate library resources, and accessible course materials to support student learning.",
      requirements: [
        "Reliable learning management system",
        "Access to library and information resources",
        "All required course materials provided",
        "Technical support available"
      ]
    },
    {
      number: "IX",
      title: "Learner Assistance",
      icon: HeartHandshake,
      description: "CLSD provides academic support, technical support, and responsive communication to help students succeed.",
      requirements: [
        "Academic support services",
        "Timely technical support",
        "Effective student communication",
        "Complaint resolution procedures"
      ]
    },
    {
      number: "X",
      title: "Enrollment Practices",
      icon: ClipboardList,
      description: "CLSD maintains clear admissions criteria and provides accurate, complete information to prospective students before enrollment.",
      requirements: [
        "Published admissions requirements",
        "Complete enrollment information",
        "Clear enrollment procedures",
        "Student orientation"
      ]
    },
    {
      number: "XI",
      title: "Financial Transparency",
      icon: FileCheck,
      description: "All CLSD tuition and fees are clearly disclosed before enrollment. Our refund policy is fair and consistently applied.",
      requirements: [
        "Complete tuition and fee disclosure",
        "Fair, published refund policy",
        "No hidden charges",
        "Responsible financial practices"
      ]
    },
    {
      number: "XII",
      title: "Institutional Advancement",
      icon: Target,
      description: "CLSD regularly assesses institutional effectiveness and engages in strategic planning. We demonstrate continuous improvement based on assessment findings.",
      requirements: [
        "Regular institutional assessment",
        "Strategic planning with measurable goals",
        "Documented improvement initiatives",
        "Culture of continuous improvement"
      ]
    }
  ];

  const faqs = [
    {
      question: "What is CLAC?",
      answer: "The Cross Life Accreditation Council (CLAC) is the internal accrediting body for Cross Life School of Divinity. CLAC establishes and maintains quality standards for educational programs, institutional operations, and student services. CLAC standards are designed to meet or exceed those established by nationally recognized accrediting agencies."
    },
    {
      question: "How does CLSD meet CLAC standards?",
      answer: "CLSD demonstrates compliance with all 12 CLAC standards through: (1) Clear Mission & Purpose - Our mission statement guides all institutional decisions and is regularly reviewed for effectiveness, (2) Qualified Faculty - All instructors possess relevant academic credentials and demonstrated ministry experience, (3) Rigorous Curriculum - Each course includes defined learning outcomes, substantive content, and comprehensive assessments, (4) Student Support Services - We provide responsive student services, grievance procedures, and academic advising, (5) Ethical Operations - We maintain truthful representation in all communications and clearly disclose our accreditation status, (6) Financial Accountability - Sound financial practices with board oversight ensure institutional sustainability, (7) Continuous Improvement - We systematically assess student learning outcomes and institutional effectiveness, making data-driven improvements annually. Our complete CLAC Standards Manual documents how we meet each of the 12 standards in detail."
    },
    {
      question: "Is CLSD accredited?",
      answer: "CLSD is accredited by the Cross Life Accreditation Council (CLAC), an internal accrediting body. CLSD is NOT accredited by agencies recognized by the U.S. Department of Education or the Council for Higher Education Accreditation (CHEA)."
    },
    {
      question: "What's the difference between CLAC accreditation and national accreditation?",
      answer: "National accreditation (such as DEAC, ABHE, or TRACS) is granted by external agencies recognized by the U.S. Department of Education. Nationally accredited institutions may offer federal financial aid, and credits typically transfer more easily. CLAC accreditation is internal to CLSD. It demonstrates our commitment to quality standards but is not recognized by the U.S. Department of Education."
    },
    {
      question: "Will my credits transfer to other schools?",
      answer: "Credits earned at CLSD may not transfer to other institutions. Each receiving institution makes its own decisions about accepting transfer credits. Some Christian colleges do accept credits from non-accredited institutions on a case-by-case basis. We recommend contacting your intended transfer institution directly to inquire about their policies."
    },
    {
      question: "Can I get federal financial aid (FAFSA)?",
      answer: "No. Federal financial aid (FAFSA) is only available at institutions accredited by agencies recognized by the U.S. Department of Education. CLSD is not eligible for federal financial aid programs. However, CLSD offers internal financial aid through CLAC for qualified students—see below."
    },
    {
      question: "What financial aid options does CLSD offer?",
      answer: "While federal financial aid is not available, CLSD offers comprehensive internal financial aid through the Cross Life Accreditation Council (CLAC). Our tuition assistance program includes: (1) Payment Plans - spread your tuition over 6 months with 0% interest, (2) Ministry Scholarships - partial tuition assistance for active ministry workers, (3) Need-Based Aid - financial assistance based on demonstrated financial need, and (4) Church Partnership Discounts - reduced rates for students sponsored by partner churches. Contact financialaid@crosslifeschoolofdivinity.org to learn about your options and apply for assistance."
    },
    {
      question: "Why isn't CLSD nationally accredited?",
      answer: "National accreditation requires significant time and financial investment. As a young institution committed to affordable education, we have chosen to establish rigorous internal standards first while building toward national accreditation as we mature. Our goal is to pursue recognition by a national accrediting agency within the next 3-5 years."
    },
    {
      question: "How do I know CLSD is legitimate?",
      answer: "We demonstrate legitimacy through transparency (we clearly disclose our accreditation status), published standards (our complete CLAC Standards Manual is publicly available), accountability (we publish annual reports on institutional effectiveness), quality faculty (our instructors have documented credentials and experience), and student outcomes (we track and report student achievement data)."
    },
    {
      question: "Is a CLSD certificate worth anything?",
      answer: "The value of any credential depends on how you use it. CLSD certificates demonstrate completion of rigorous theological coursework, knowledge of biblical and theological content, and commitment to ministry preparation. Many employers, churches, and ministry organizations value demonstrated knowledge and commitment regardless of accreditation status. Plus, when CLSD achieves national accreditation, your certificate can be upgraded to reflect our new status at no additional cost."
    },
    {
      question: "Will CLSD ever become nationally accredited?",
      answer: "Yes, pursuing national accreditation is part of our strategic plan. We are building the institutional infrastructure, documentation, and track record necessary to apply for recognition by a national accrediting agency. Our target is to begin the application process within 3-5 years."
    },
    {
      question: "Will my certificate be upgraded when CLSD achieves national accreditation?",
      answer: "Yes! We are committed to our students' long-term success. When CLSD achieves national accreditation, all prior students who completed courses under CLAC standards will be eligible to have their certificates upgraded to reflect our nationally accredited status. This is our promise to you: your investment in theological education today will be recognized and honored when we achieve national accreditation. We maintain complete records of all student achievements specifically for this purpose."
    },
    {
      question: "What if I have a complaint?",
      answer: "CLSD maintains a formal complaint resolution process. Students may file complaints regarding academic matters, student services, or institutional operations. Contact us at accreditation@crosslifeschoolofdivinity.org to file a complaint."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="accreditation" />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-12 w-12" />
            <h1 className="text-5xl font-bold">Accreditation & Quality Assurance</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Cross Life School of Divinity is committed to educational excellence and institutional integrity. 
            We operate under the Cross Life Accreditation Council (CLAC) framework, maintaining rigorous standards 
            equivalent to nationally recognized accrediting agencies.
          </p>
        </div>
      </section>

      {/* Accreditation Status - Important Disclosure */}
      <section className="py-12 bg-amber-50 border-y-4 border-amber-400">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">Important Accreditation Disclosure</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-lg mb-4">
                  <strong>Cross Life School of Divinity is accredited by the Cross Life Accreditation Council (CLAC)</strong>, 
                  an internal accrediting body established to ensure educational quality and institutional integrity.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-semibold">
                    CLSD is NOT accredited by agencies recognized by the U.S. Department of Education or the 
                    Council for Higher Education Accreditation (CHEA).
                  </p>
                </div>
                <h3 className="font-semibold text-lg mb-3">What this means for students:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Credits may not transfer to other institutions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Federal financial aid (FAFSA) is not available</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Credentials may not be recognized by all employers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Some graduate schools may not accept CLSD credits</span>
                  </div>
                </div>

                {/* Internal Financial Aid Notice */}
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-800 font-semibold text-lg mb-2">
                        CLAC Internal Financial Aid Available
                      </p>
                      <p className="text-green-700">
                        While federal financial aid (FAFSA) is not available, <strong>CLSD offers internal financial aid 
                        through the Cross Life Accreditation Council for qualified students</strong>. Our tuition assistance 
                        program includes payment plans, ministry scholarships, and need-based aid to help make theological 
                        education accessible to those called to serve.
                      </p>
                      <p className="text-green-700 mt-2">
                        <strong>Contact us</strong> at <a href="mailto:financialaid@crosslifeschoolofdivinity.org" className="underline hover:text-green-900">financialaid@crosslifeschoolofdivinity.org</a> to 
                        learn about your financial aid options.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We DO Offer */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We DO Offer</h2>
          {/* Certificate Upgrade Promise - Featured */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary rounded-full p-4">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-xl font-bold text-primary mb-2">Certificate Upgrade Promise</h3>
                  <p className="text-muted-foreground">
                    <strong>Your investment is protected.</strong> When CLSD achieves national accreditation, 
                    all prior students will be eligible to have their certificates upgraded to reflect our 
                    nationally accredited status—<strong>at no additional cost</strong>. We maintain complete 
                    records of all student achievements specifically for this purpose.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Rigorous Standards</h3>
                <p className="text-sm text-muted-foreground">
                  Quality standards documented in the CLAC Standards Manual
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Qualified Faculty</h3>
                <p className="text-sm text-muted-foreground">
                  Instructors with relevant credentials and ministry experience
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Student Support</h3>
                <p className="text-sm text-muted-foreground">
                  Grievance procedures and responsive student services
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Continuous Improvement</h3>
                <p className="text-sm text-muted-foreground">
                  Commitment to excellence and future national accreditation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CLAC Standards */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">CLAC Standards</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The Cross Life Accreditation Council maintains 12 comprehensive standards covering all aspects 
              of institutional operation. Click each standard to learn more.
            </p>
          </div>
          <div className="grid gap-4">
            {standards.map((standard) => (
              <StandardSection key={standard.number} {...standard} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices Statement */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Commitment to Excellence</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Educational Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Curriculum Design:</strong> All courses are developed by qualified faculty 
                  with relevant credentials and ministry experience. Each course includes clearly defined learning outcomes, 
                  substantive content, varied instructional methods, and rigorous assessments.
                </p>
                <p>
                  <strong className="text-foreground">Faculty Excellence:</strong> Our instructors possess appropriate academic 
                  credentials and demonstrated ministry expertise. Faculty engage in ongoing professional development and are 
                  evaluated regularly on teaching effectiveness.
                </p>
                <p>
                  <strong className="text-foreground">Assessment of Learning:</strong> We systematically assess student achievement 
                  through multiple methods including examinations, research papers, and practical ministry projects.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Ethical Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Truthful Representation:</strong> All marketing materials accurately represent 
                  our programs, outcomes, and institutional characteristics. We do not make misleading claims about accreditation, 
                  career outcomes, or credential recognition.
                </p>
                <p>
                  <strong className="text-foreground">Fair Treatment:</strong> We treat all students, faculty, and staff fairly 
                  and without discrimination. Policies are applied consistently, and grievance procedures provide recourse for 
                  those who believe they have been treated unfairly.
                </p>
                <p>
                  <strong className="text-foreground">Transparency:</strong> We are forthright about our accreditation status, 
                  clearly disclosing that CLSD is accredited by CLAC and not by agencies recognized by the U.S. Department of Education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Transfer Credit Pathways Section */}
      <section className="py-16 bg-blue-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-10 w-10 text-primary" />
              <h2 className="text-4xl font-bold">Pathways to Higher Education</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              While CLSD credits may not automatically transfer, several accredited Christian colleges and universities 
              have policies for accepting credits from non-accredited institutions. Here are examples of schools that 
              may accept CLSD coursework:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Liberty University */}
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Liberty University
                </CardTitle>
                <p className="text-sm text-muted-foreground">Lynchburg, VA • SACSCOC Accredited</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Maintains an "Approved Unaccredited Institutions" list with pre-approved course equivalencies. 
                  One of the largest Christian universities accepting non-accredited credits.
                </p>
                <a href="https://www.liberty.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm flex items-center gap-1 hover:underline">
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            {/* Global Christian University */}
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Global Christian University
                </CardTitle>
                <p className="text-sm text-muted-foreground">Dallas, TX • ABHE Accredited</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Accepts up to 25% of degree units from non-accredited programs. Has formal agreements 
                  with several non-accredited ministry schools.
                </p>
                <a href="https://globalcu.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm flex items-center gap-1 hover:underline">
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            {/* Calvary University */}
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Calvary University
                </CardTitle>
                <p className="text-sm text-muted-foreground">Kansas City, MO • HLC & ABHE Accredited</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Accepts Bible language courses from non-accredited institutions after proficiency exam. 
                  Other courses evaluated case-by-case.
                </p>
                <a href="https://calvary.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm flex items-center gap-1 hover:underline">
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            {/* Trinity Bible College */}
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Trinity Bible College
                </CardTitle>
                <p className="text-sm text-muted-foreground">Ellendale, ND • ABHE Accredited</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Accepts limited credits from non-accredited institutions after students demonstrate 
                  satisfactory academic performance.
                </p>
                <a href="https://trinitybiblecollege.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm flex items-center gap-1 hover:underline">
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            {/* Carolina Christian College */}
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Carolina Christian College
                </CardTitle>
                <p className="text-sm text-muted-foreground">Winston-Salem, NC • TRACS Accredited</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Accepts credits from unaccredited schools on a case-by-case basis. 
                  Submit course syllabi for evaluation.
                </p>
                <a href="https://carolina.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm flex items-center gap-1 hover:underline">
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            {/* Southern Baptist Theological Seminary */}
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Southern Baptist Seminary
                </CardTitle>
                <p className="text-sm text-muted-foreground">Louisville, KY • ATS & SACSCOC Accredited</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Considers credits from non-accredited institutions on a case-by-case basis. 
                  Submit detailed course documentation for evaluation.
                </p>
                <a href="https://sbts.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-primary text-sm flex items-center gap-1 hover:underline">
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-primary/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-2">Important Note About Transfer Credits</p>
                <p className="text-sm text-muted-foreground">
                  Transfer credit acceptance is always at the discretion of the receiving institution. 
                  We strongly recommend contacting your intended transfer school directly to inquire about their 
                  specific policies for accepting credits from non-accredited institutions. CLSD is actively 
                  pursuing formal articulation agreements with these and other institutions to create clear 
                  transfer pathways for our graduates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real stories from ministry leaders who chose quality education over accreditation labels
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-white shadow-lg border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6">
                  "I was initially concerned about the accreditation status, but the depth of biblical teaching 
                  and practical ministry training I received far exceeded what I expected. My church has seen 
                  real growth since applying what I learned. The education speaks for itself."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">PM</span>
                  </div>
                  <div>
                    <p className="font-semibold">Pastor Marcus J.</p>
                    <p className="text-sm text-muted-foreground">Senior Pastor, Atlanta, GA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-white shadow-lg border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6">
                  "As a bi-vocational minister, I needed flexible, affordable training. CLSD delivered 
                  seminary-quality content at a fraction of the cost. The Greek word studies and 
                  theological depth rival programs costing ten times as much. Accreditation is just a label—
                  transformation is what matters."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">DT</span>
                  </div>
                  <div>
                    <p className="font-semibold">Deacon Thomas R.</p>
                    <p className="text-sm text-muted-foreground">Youth Ministry Director, Chicago, IL</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-white shadow-lg border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6">
                  "I chose CLSD because of their transparency about accreditation and their commitment 
                  to quality. The Certificate Upgrade Promise gave me confidence that my investment is 
                  protected. Now I'm equipped to teach and lead with biblical authority. That's worth 
                  more than any credential."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">SW</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sister Wanda K.</p>
                    <p className="text-sm text-muted-foreground">Women's Ministry Leader, Houston, TX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Quote Highlight */}
          <div className="mt-12 bg-primary/10 rounded-2xl p-8 text-center max-w-4xl mx-auto">
            <blockquote className="text-xl italic text-foreground mb-4">
              "The measure of theological education isn't the accreditation on the wall—it's the 
              transformation in the heart and the fruit in the ministry. CLSD delivers both."
            </blockquote>
            <p className="text-primary font-semibold">— Dr. James H., CLSD Advisory Board Member</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} {...faq} />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Questions About Accreditation?</h2>
            <p className="text-lg text-muted-foreground">
              We're committed to transparency. Contact us with any questions about our accreditation status or quality standards.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <a href="mailto:accreditation@crosslifeschoolofdivinity.org" className="text-primary hover:underline">
                      accreditation@crosslifeschoolofdivinity.org
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  For questions about CLAC standards, compliance, or accreditation status.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">File a Complaint</h3>
                    <p className="text-muted-foreground">Formal complaint process available</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  If you have concerns about your educational experience, contact us to initiate the complaint resolution process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Theological Journey?</h2>
          <p className="text-xl text-white/90 mb-8">
            Despite our current accreditation status, we're committed to providing quality theological education 
            that prepares you for effective ministry.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Learning Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
