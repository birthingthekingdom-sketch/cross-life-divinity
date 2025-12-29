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
    answer: "Simply create an account, browse our course catalog, and click 'Enroll' on any course. You can purchase individual courses for $89 each or subscribe to our All-Access plan for $49/month to access all 17 courses."
  },
  {
    question: "What is the All-Access Subscription?",
    answer: "Our All-Access Subscription gives you unlimited access to all 17 CPD-accredited courses for just $49/month (limited-time offer, regular price $79/month). You can study at your own pace, switch between courses, and access all content as long as your subscription is active."
  },
  {
    question: "Are the courses accredited?",
    answer: "Yes! All our courses are accredited by the Continuing Professional Development (CPD) Standards Office. Upon successful completion, you'll receive a CPD-accredited certificate recognized by churches, ministries, and organizations worldwide."
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
    answer: "We offer a 30-day money-back guarantee on individual course purchases. If you're not satisfied within 30 days of purchase, contact our support team for a full refund. Subscription refunds are prorated based on usage."
  },
  {
    question: "How do I receive my certificate?",
    answer: "Certificates are automatically generated when you complete all course requirements (lessons, quizzes, and assignments). You can download your CPD-accredited certificate as a PDF from your dashboard and share it digitally or print it."
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
    answer: "Learning Paths are curated course sequences designed to guide your theological education from beginner to advanced levels. We offer three paths: New Believer Foundation (6 courses), Ministry Preparation Track (4 courses), and Advanced Theological Studies (5 courses)."
  },
  {
    question: "Can I purchase course bundles?",
    answer: "Yes! We offer three course bundles at discounted rates: Ministry Leadership Track ($199), Spiritual Warfare & Deliverance ($199), and Biblical Foundations ($199). Bundles save you 25% compared to purchasing courses individually."
  },
  {
    question: "How long does it take to complete a course?",
    answer: "Course length varies, but most courses take 4-8 weeks to complete at a recommended pace of 3-5 hours per week. You can study faster or slower based on your schedule. Learning Paths range from 3-12 months depending on the track."
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
    answer: "Yes! Our limited-time offer allows you to lock in the $49/month subscription rate or $89 per course pricing forever. Register now to secure these rates before they increase."
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
