import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { Clock, DollarSign, Globe, Users, BookOpen, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";

export default function WhyOnlineLearning() {
  const benefits = [
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Study at your own pace and on your own schedule. Balance theological education with work, family, and ministry responsibilities without sacrificing quality or depth.",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      title: "Affordable Education",
      description: "Access seminary-quality theological education at a fraction of traditional costs. No relocation expenses, no campus fees, and transparent pricing with no hidden charges.",
      color: "text-green-600"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Study from anywhere in the world with just an internet connection. Connect with students and instructors from diverse backgrounds and cultures worldwide.",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "Supportive Community",
      description: "Engage with a vibrant online community of ministry leaders, participate in discussion forums, and build meaningful connections with peers on the same spiritual journey.",
      color: "text-orange-600"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Content",
      description: "Access extensive course materials, video lectures, interactive quizzes, and resources that you can review repeatedly at your own pace for deeper learning.",
      color: "text-red-600"
    },
    {
      icon: Zap,
      title: "Practical Application",
      description: "Immediately apply what you learn to your ministry. Assignments are designed to help you integrate biblical knowledge into real-world ministry situations.",
      color: "text-yellow-600"
    }
  ];

  const testimonials = [
    {
      name: "Pastor James Mitchell",
      role: "Senior Pastor, Grace Community Church",
      text: "The online format allowed me to continue leading my church while deepening my theological knowledge. The flexibility was exactly what I needed.",
      image: "👨‍💼"
    },
    {
      name: "Dr. Sarah Johnson",
      role: "Missionary, Sub-Saharan Africa",
      text: "Being overseas, I thought quality theological education was out of reach. This platform connected me with world-class instruction and a global community of believers.",
      image: "👩‍💼"
    },
    {
      name: "Marcus Williams",
      role: "Youth Pastor & Full-time Employee",
      text: "I was skeptical about online learning, but the interactive content and supportive community made it feel like a real classroom experience. Highly recommended!",
      image: "👨‍💻"
    },
    {
      name: "Rev. Elizabeth Chen",
      role: "Church Planter, Urban Ministry",
      text: "The CPD-accredited certificates have been invaluable for my ministry credibility. The quality rivals traditional seminaries at a fraction of the cost.",
      image: "👩‍🏫"
    }
  ];

  const comparison = [
    {
      feature: "Cost",
      online: "$500-$2,000 per course",
      traditional: "$15,000-$50,000+ per year"
    },
    {
      feature: "Schedule",
      online: "Learn anytime, anywhere",
      traditional: "Fixed class times and location"
    },
    {
      feature: "Relocation",
      online: "No relocation needed",
      traditional: "Must relocate to campus"
    },
    {
      feature: "Work/Ministry",
      online: "Continue your current role",
      traditional: "Often requires pause in ministry"
    },
    {
      feature: "Duration",
      online: "Complete at your pace (3-5 years typical)",
      traditional: "Fixed 3-4 year program"
    },
    {
      feature: "Accreditation",
      online: "CPD-accredited certificates",
      traditional: "Institutional accreditation"
    },
    {
      feature: "Global Access",
      online: "Study from anywhere",
      traditional: "Limited to local institutions"
    },
    {
      feature: "Community",
      online: "Global peer network",
      traditional: "Local campus community"
    }
  ];

  const faqs = [
    {
      question: "Is online theological education as rigorous as traditional seminary?",
      answer: "Absolutely. Our courses are designed with the same academic rigor as traditional seminaries. We use the same teaching methods, require the same depth of study, and our certificates are CPD-accredited. The main difference is flexibility and accessibility, not quality."
    },
    {
      question: "How much time should I dedicate to studying each week?",
      answer: "Most students dedicate 10-15 hours per week per course, though this varies based on your pace and learning style. The beauty of online learning is that you can adjust this based on your schedule. Some students study intensively for a few months, while others spread their learning over a longer period."
    },
    {
      question: "Will I have interaction with instructors?",
      answer: "Yes! Our instructors are actively engaged in the learning community. You can ask questions in discussion forums, attend live Q&A sessions, and receive feedback on assignments. While it's different from in-person office hours, many students find the asynchronous format allows for more thoughtful interaction."
    },
    {
      question: "Can I interact with other students?",
      answer: "Definitely. Our discussion forums are vibrant spaces where students share insights, ask questions, and build relationships. Many students form study groups and continue friendships long after completing courses. You'll be part of a global community of ministry leaders."
    },
    {
      question: "What if I need to take a break from studies?",
      answer: "Life happens! You can pause your studies and resume when ready. We understand that ministry and family responsibilities sometimes require flexibility. Contact our support team to discuss your situation."
    },
    {
      question: "How do I know if online learning is right for me?",
      answer: "Online learning works best if you're self-motivated, have reliable internet access, and can dedicate consistent time to studying. If you prefer face-to-face interaction and structured schedules, traditional seminary might be better. However, many people are surprised by how engaging and community-oriented online learning can be."
    },
    {
      question: "What technology do I need?",
      answer: "You'll need a computer or tablet with internet access. Our platform works on Windows, Mac, iOS, and Android. A webcam and microphone are helpful for live sessions, but not always required. We provide technical support to help you get set up."
    },
    {
      question: "Can I get financial aid for online courses?",
      answer: "Yes! We offer various payment plans, scholarship opportunities, and financial aid options. Check our Financial Aid page for more information about available assistance programs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="why-online" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Why Online Theological Education?</h1>
          <p className="text-xl text-white/90 max-w-3xl mb-8">
            Discover how online learning is revolutionizing access to quality theological education, making seminary-level training available to ministry leaders worldwide.
          </p>
          <Link href="/catalog">
            <button className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              Explore Our Courses
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Key Benefits of Online Learning</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Online theological education combines academic excellence with practical flexibility, allowing you to grow spiritually and intellectually without sacrificing your current ministry or family responsibilities.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`${benefit.color} mb-4`}>
                      <Icon className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Online vs Traditional Comparison */}
      <section className="py-20 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Online vs. Traditional Seminary</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            See how online theological education compares to traditional residential seminary programs.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-left font-semibold">Online Learning</th>
                  <th className="px-6 py-4 text-left font-semibold">Traditional Seminary</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-semibold text-foreground">{row.feature}</td>
                    <td className="px-6 py-4 text-green-700 font-medium flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {row.online}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">What Our Students Say</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Hear from ministry leaders who have transformed their education and ministry through online learning.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 italic leading-relaxed">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground text-lg mb-16">
            Have questions about online theological education? We've got answers.
          </p>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-3 text-primary">{faq.question}</h3>
                  <p className="text-foreground/80 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of ministry leaders who are transforming their education and impact through online theological learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <button className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-lg font-semibold transition-colors">
                Browse Courses
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
