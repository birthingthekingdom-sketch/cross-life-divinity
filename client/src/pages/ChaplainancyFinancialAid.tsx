import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { DollarSign, CreditCard, Users, Building2, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface PaymentPlan {
  name: string;
  description: string;
  totalCost: number;
  installments: number;
  monthlyAmount: number;
  interestRate: number;
  icon: React.ReactNode;
}

interface FinancialAidOption {
  title: string;
  description: string;
  amount: string;
  eligibility: string[];
  icon: React.ReactNode;
}

const paymentPlans: PaymentPlan[] = [
  {
    name: "Full Payment",
    description: "Pay the complete program cost upfront and save on processing fees.",
    totalCost: 325,
    installments: 1,
    monthlyAmount: 325,
    interestRate: 0,
    icon: <DollarSign className="h-8 w-8" />
  },
  {
    name: "3-Month Plan",
    description: "Spread your payments over 3 months with minimal interest.",
    totalCost: 330,
    installments: 3,
    monthlyAmount: 110,
    interestRate: 1.5,
    icon: <CreditCard className="h-8 w-8" />
  },
  {
    name: "6-Month Plan",
    description: "Flexible 6-month payment plan to fit your budget.",
    totalCost: 340,
    installments: 6,
    monthlyAmount: 57,
    interestRate: 4.5,
    icon: <CreditCard className="h-8 w-8" />
  },
  {
    name: "12-Month Plan",
    description: "Extended payment plan for maximum flexibility.",
    totalCost: 360,
    installments: 12,
    monthlyAmount: 30,
    interestRate: 10,
    icon: <CreditCard className="h-8 w-8" />
  }
];

const financialAidOptions: FinancialAidOption[] = [
  {
    title: "Ministry Scholarship",
    description: "For full-time ministry leaders and pastors committed to ongoing theological education.",
    amount: "Up to $50 (15% discount)",
    eligibility: [
      "Currently serving in full-time ministry",
      "Endorsed by church or ministry organization",
      "Commitment to continue in ministry"
    ],
    icon: <Award className="h-8 w-8" />
  },
  {
    title: "Employer Sponsorship",
    description: "Many employers sponsor chaplaincy training for their staff. Check with your HR department.",
    amount: "Up to $100+ (30% discount or more)",
    eligibility: [
      "Employed by participating organization",
      "Employer commitment to professional development",
      "Approval from HR or training department"
    ],
    icon: <Building2 className="h-8 w-8" />
  },
  {
    title: "Financial Hardship Grant",
    description: "For individuals facing genuine financial constraints.",
    amount: "Up to $75 (23% discount)",
    eligibility: [
      "Demonstrated financial need",
      "Commitment to complete the program",
      "Application and verification required"
    ],
    icon: <Users className="h-8 w-8" />
  },
  {
    title: "Group Enrollment Discount",
    description: "Organizations enrolling multiple chaplains receive special group rates.",
    amount: "Up to $60 per person (18% discount)",
    eligibility: [
      "Minimum 5 participants from same organization",
      "Coordinated enrollment",
      "Contact for custom pricing"
    ],
    icon: <Users className="h-8 w-8" />
  }
];

export default function ChaplainancyFinancialAid() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is included in the $325 Chaplaincy program cost?",
      answer: "The $325 program cost includes access to all course materials, video lectures, interactive assignments, clinical supervision sessions, peer discussion forums, and a CPD-accredited certificate upon completion. It does not include textbooks or external resources, which are optional."
    },
    {
      question: "Can I change my payment plan after enrollment?",
      answer: "Yes, you can modify your payment plan within the first 7 days of enrollment. After that, changes may be subject to additional fees. Contact our financial aid office for assistance."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No. The prices listed include all program costs. The only additional charges may be for optional textbooks or external resources you choose to purchase. Payment processing fees are included in the total cost."
    },
    {
      question: "How do I apply for a scholarship?",
      answer: "You can apply for scholarships during the enrollment process or contact our financial aid office at financialaid@crosslifedivinity.edu. You'll need to provide documentation of your ministry role or financial need."
    },
    {
      question: "Does my employer offer sponsorship?",
      answer: "Many healthcare facilities, military branches, correctional facilities, and corporate chaplaincy programs sponsor their staff's training. Contact your HR or training department to inquire about sponsorship opportunities."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and digital payment methods. All payments are processed securely through our payment portal."
    },
    {
      question: "Is there a refund policy?",
      answer: "Yes. We offer a 14-day money-back guarantee if you're not satisfied with the program. After 14 days, refunds are prorated based on course completion. See our full refund policy for details."
    },
    {
      question: "Can I get a payment plan extension?",
      answer: "Yes. If you experience financial hardship, contact our financial aid office to discuss extension options. We're committed to helping you complete the program."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="about" />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Chaplaincy Program Financial Aid</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Affordable, flexible payment options and financial assistance to make quality chaplaincy training accessible to everyone.
          </p>
        </div>
      </section>

      {/* Program Cost Overview */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Program Investment</h2>
            <div className="inline-block bg-white rounded-lg p-8 shadow-lg">
              <div className="text-6xl font-bold text-primary mb-2">$325</div>
              <p className="text-xl text-muted-foreground">Complete Chaplaincy Training Program</p>
              <p className="text-sm text-muted-foreground mt-4">CPD-Accredited Certificate Included</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-primary/20">
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-muted-foreground">No hidden fees. Everything included in the program cost.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-primary/20">
              <CardContent className="pt-6 text-center">
                <CreditCard className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Flexible Payment</h3>
                <p className="text-muted-foreground">Choose from 1, 3, 6, or 12-month payment plans.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-primary/20">
              <CardContent className="pt-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Financial Aid</h3>
                <p className="text-muted-foreground">Scholarships and employer sponsorship available.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Plans */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Payment Plan Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {paymentPlans.map((plan, idx) => (
              <Card 
                key={idx}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.name 
                    ? "ring-2 ring-primary shadow-lg" 
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedPlan(selectedPlan === plan.name ? null : plan.name)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-primary">{plan.icon}</div>
                    {plan.interestRate === 0 && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Best Value</Badge>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>

                  <div className="bg-primary/5 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="text-2xl font-bold text-primary">${plan.monthlyAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="text-2xl font-bold">${plan.totalCost}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Installments:</span>
                      <span className="text-sm text-muted-foreground">{plan.installments}</span>
                    </div>
                    {plan.interestRate > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Interest Rate:</span>
                        <span className="text-sm text-muted-foreground">{plan.interestRate}%</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full">
                    Select Plan
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Aid Options */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Financial Aid & Scholarships</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {financialAidOptions.map((option, idx) => (
              <Card key={idx} className="bg-white border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-primary">{option.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold">{option.title}</h3>
                      <p className="text-lg font-semibold text-accent mt-1">{option.amount}</p>
                    </div>
                  </div>

                  <p className="text-foreground/80 mb-4">{option.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Eligibility:</h4>
                    <ul className="space-y-2">
                      {option.eligibility.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-lg p-8 border-l-4 border-primary">
            <h3 className="text-2xl font-bold mb-4">How to Apply for Financial Aid</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-semibold">Complete the enrollment form</p>
                  <p className="text-sm text-muted-foreground">Provide basic information about your chaplaincy goals and background.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-semibold">Select financial aid option</p>
                  <p className="text-sm text-muted-foreground">Choose the scholarship or assistance program you're eligible for.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-semibold">Submit required documentation</p>
                  <p className="text-sm text-muted-foreground">Provide proof of ministry role, employer sponsorship, or financial need as applicable.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <p className="font-semibold">Receive approval and enroll</p>
                  <p className="text-sm text-muted-foreground">Upon approval, your discount is applied and you can begin the program immediately.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Employer Sponsorship */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Employer Sponsorship Program</h2>
              <p className="text-lg text-foreground/80 mb-6">
                Healthcare facilities, military branches, correctional facilities, and corporate organizations can sponsor their chaplains' training.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Bulk Discounts</p>
                    <p className="text-sm text-muted-foreground">Special pricing for organizations enrolling multiple chaplains</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Customized Training</p>
                    <p className="text-sm text-muted-foreground">Tailored curriculum to meet your organization's specific needs</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Progress Tracking</p>
                    <p className="text-sm text-muted-foreground">Monitor your staff's progress and completion rates</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Dedicated Support</p>
                    <p className="text-sm text-muted-foreground">Personalized account management and technical support</p>
                  </div>
                </div>
              </div>
              <Button size="lg">
                Contact for Employer Sponsorship
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-6">Employer Benefits</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-primary mb-1">Cost Savings</p>
                    <p className="text-sm text-muted-foreground">Up to 30% discount per chaplain with group enrollment</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-primary mb-1">Staff Development</p>
                    <p className="text-sm text-muted-foreground">Invest in your chaplains' professional growth and skills</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-primary mb-1">Improved Care Quality</p>
                    <p className="text-sm text-muted-foreground">Better-trained chaplains provide superior spiritual care</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-primary mb-1">Retention</p>
                    <p className="text-sm text-muted-foreground">Professional development supports staff retention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card 
                key={idx}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                    <span className={`text-2xl font-bold text-primary flex-shrink-0 transition-transform ${
                      expandedFAQ === idx ? "rotate-180" : ""
                    }`}>
                      +
                    </span>
                  </div>
                  {expandedFAQ === idx && (
                    <p className="text-foreground/80 mt-4 leading-relaxed">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Payment or Financial Aid?</h2>
          <p className="text-xl text-white/90 mb-8">
            Our financial aid team is here to help. Contact us for personalized assistance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Contact Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/chaplaincy-training">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
