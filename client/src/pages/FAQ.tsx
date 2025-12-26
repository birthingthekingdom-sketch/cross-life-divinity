import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Footer } from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I enroll in a course?",
    answer: "Simply create an account, browse our course catalog, and select the course you want to take. You can purchase individual courses for $89 each, subscribe to our All-Access plan for $49/month to access all 18 courses, or choose a 3-course bundle for $299. We also offer 0% interest payment plans with 6-month installments to make education more affordable."
  },
  {
    question: "What is the All-Access Subscription?",
    answer: "Our All-Access Subscription gives you unlimited access to all 18 CLAC-accredited courses for just $49/month (limited-time offer, regular price $79/month). You can study at your own pace, switch between courses, and access all content as long as your subscription is active. This includes access to 180+ lessons, quizzes, assignments, and discussion forums."
  },
  {
    question: "Are the courses accredited?",
    answer: "Yes! All our courses are accredited by the Cross Life Accreditation Council (CLAC), our internal accreditation framework that meets rigorous standards for theological education. Upon successful completion, you'll receive a CLAC-accredited certificate recognized by churches, ministries, and organizations worldwide. We're working toward national accreditation, and all current students will have the option to upgrade their certificates at no cost when we achieve this milestone."
  },
  {
    question: "How long do I have access to a course?",
    answer: "Individual course purchases provide lifetime access. All-Access Subscription members have unlimited access to all courses as long as their subscription is active. You can study at your own pace with no time limits on course completion."
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "You can cancel your All-Access Subscription anytime. You'll retain access until the end of your current billing period. Any certificates earned before cancellation remain valid. You can resubscribe later to regain access."
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 7-day money-back guarantee on all purchases. If you're not satisfied within 7 days of purchase, contact our support team for a full refund. After 7 days, no refunds are available, but you can cancel your subscription anytime to stop future charges."
  },
  {
    question: "How do I receive my certificate?",
    answer: "Certificates are automatically generated when you complete all course requirements (lessons, quizzes, and assignments with a minimum 70% grade). You can download your CLAC-accredited certificate as a PDF from your dashboard, print it, or share it digitally. Each certificate includes a unique verification code and QR code that employers and organizations can use to verify your completion."
  },
  {
    question: "What are the technical requirements?",
    answer: "You need a computer, tablet, or smartphone with internet access and a modern web browser (Chrome, Firefox, Safari, or Edge). Our platform is mobile-responsive, so you can study on any device."
  },
  {
    question: "Can I study offline?",
    answer: "Currently, our courses require an internet connection to access video lessons and interactive content. We recommend bookmarking lessons and taking notes for offline review."
  },
  {
    question: "How does the referral program work?",
    answer: "Share your unique referral link with friends and ministry colleagues. When someone registers and makes their first purchase using your link, you'll receive a $50 credit applied to your account. Credits can be used toward future course purchases or subscription payments."
  },
  {
    question: "What are Learning Paths?",
    answer: "Learning Paths are carefully curated course sequences designed to guide your theological education from beginner to advanced levels. We offer three paths: Beginner (6 courses, 5-6 months), Intermediate (4 courses, 4-5 months), and Advanced (5 courses, 5-6 months). Each path is $199 with a 0% interest payment plan option at $33.17/month for 6 months. Learning Paths provide structure and progression to build your theological knowledge systematically."
  },
  {
    question: "Can I purchase course bundles?",
    answer: "Yes! We offer three-course bundles for $299 (save $88 from the $387 regular price). You can choose any 3 courses from our catalog to create your own custom bundle. We also offer structured Learning Paths ($199 each) that guide you through 4-6 carefully sequenced courses for comprehensive theological education."
  },
  {
    question: "How long does it take to complete a course?",
    answer: "Each course contains 10 lessons and typically takes 4-8 weeks to complete at a recommended pace of 3-5 hours per week. However, you can study at your own pace with no time limits. Learning Paths range from 5-6 months depending on the track. Most students complete a course while maintaining their regular ministry responsibilities."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes! Churches and ministry organizations can contact us for group enrollment discounts. We offer special pricing for groups of 5 or more students."
  },
  {
    question: "Can I interact with other students?",
    answer: "Absolutely! Each course has a dedicated discussion forum where you can ask questions, share insights, and connect with fellow students. You can also join cohort groups based on your learning path for peer support and accountability."
  },
  {
    question: "Who teaches the courses?",
    answer: "Our courses are developed by experienced theologians, seminary professors, and ministry leaders with decades of combined experience in biblical education and practical ministry."
  },
  {
    question: "Will I have assignments and quizzes?",
    answer: "Yes, each course includes quizzes to test your knowledge and practical assignments to apply what you've learned. All assessments are designed to reinforce learning and prepare you for real-world ministry."
  },
  {
    question: "Can I lock in the current pricing?",
    answer: "Yes! Our limited-time offer allows you to lock in the $49/month subscription rate ($199 for Learning Paths, $299 for bundles) forever. Once you enroll at these rates, your pricing is locked in even if we raise prices in the future. Register now to secure these rates before they increase."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Find answers to common questions about enrollment, pricing, certificates, and more.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-accent/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <CardContent className="pt-0 pb-6 px-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <p className="text-lg">
                  Email us at{" "}
                  <a href="mailto:support@clsod.org" className="text-primary font-semibold hover:underline">
                    support@clsod.org
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
