import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, BookOpen, Award, Users, TrendingUp, Clock } from "lucide-react";
import { BridgeAcademyNav } from "@/components/BridgeAcademyNav";

export default function BridgeAcademyDetails() {
  return (
    <div className="min-h-screen bg-background">
      <BridgeAcademyNav currentPage="details" />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Bridge Academy - GED Preparation</h1>
          <p className="text-xl text-blue-100">
            Prepare for your GED exam with comprehensive, expert-crafted lessons and practice tests
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Program Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Program Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-blue-50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                What You'll Learn
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Mathematical Reasoning:</strong> Algebra, geometry, data analysis, and problem-solving</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Reasoning Through Language Arts:</strong> Reading comprehension, grammar, and writing</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Science:</strong> Life science, physical science, and earth/space science</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Social Studies:</strong> History, civics, economics, and geography</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-amber-50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Program Features
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>32 comprehensive lessons (8 per subject)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>180+ practice questions with multiple difficulty levels</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Timed practice quizzes and full exam simulations</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Downloadable study guides and formula sheets</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Success Rates */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Success Metrics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
              <p className="text-sm font-semibold text-gray-700">Pass Rate</p>
              <p className="text-xs text-gray-600 mt-2">Students pass on first attempt</p>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
              <p className="text-sm font-semibold text-gray-700">Student Rating</p>
              <p className="text-xs text-gray-600 mt-2">Based on 500+ reviews</p>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-4xl font-bold text-purple-600 mb-2">8 weeks</div>
              <p className="text-sm font-semibold text-gray-700">Avg. Completion</p>
              <p className="text-xs text-gray-600 mt-2">At recommended pace</p>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-amber-100">
              <div className="text-4xl font-bold text-amber-600 mb-2">24/7</div>
              <p className="text-sm font-semibold text-gray-700">Access</p>
              <p className="text-xs text-gray-600 mt-2">Study anytime, anywhere</p>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="space-y-4">
            <Card className="p-6 border-l-4 border-l-blue-600">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">1</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Enroll in Bridge Academy</h3>
                  <p className="text-gray-600">Choose your subscription plan and start your GED preparation journey</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-blue-600">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">2</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Complete Lessons</h3>
                  <p className="text-gray-600">Work through comprehensive lessons covering all four GED subjects at your own pace</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-blue-600">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">3</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Practice & Review</h3>
                  <p className="text-gray-600">Take practice quizzes and full exam simulations to track your progress</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-blue-600">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">4</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pass Your GED</h3>
                  <p className="text-gray-600">Feel confident and prepared to pass your GED exam on the first attempt</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Study Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Study Tips for Success</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Create a Study Schedule
              </h3>
              <p className="text-gray-600 text-sm">
                Dedicate 1-2 hours per day to studying. Consistency is more important than marathon sessions. Break your study time into focused 30-minute blocks.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Track Your Progress
              </h3>
              <p className="text-gray-600 text-sm">
                Use the practice dashboard to monitor your improvement. Focus on subjects where you score lowest first to maximize your gains.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Join Study Groups
              </h3>
              <p className="text-gray-600 text-sm">
                Connect with other students preparing for the GED. Share tips, ask questions, and motivate each other through the process.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Take Full Practice Tests
              </h3>
              <p className="text-gray-600 text-sm">
                Complete full-length practice exams under timed conditions. This helps you build stamina and get comfortable with the test format.
              </p>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Student Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-blue-50">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The practice questions were exactly like the real GED exam. I felt so prepared!"
              </p>
              <p className="font-semibold text-sm">Maria G.</p>
              <p className="text-xs text-gray-600">Passed with 89% average</p>
            </Card>
            <Card className="p-6 bg-blue-50">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The lessons are clear and easy to understand. I could study at my own pace."
              </p>
              <p className="font-semibold text-sm">James T.</p>
              <p className="text-xs text-gray-600">Passed on first attempt</p>
            </Card>
            <Card className="p-6 bg-blue-50">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The support team was helpful and the study materials were comprehensive."
              </p>
              <p className="font-semibold text-sm">Sarah M.</p>
              <p className="text-xs text-gray-600">Passed with 91% average</p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Pass Your GED?</h2>
          <p className="text-lg mb-6 text-blue-100">
            Start your free 7-day trial today. No credit card required.
          </p>
          <Link href="/courses">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
              Start Your Free Trial
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">How long does it take to complete the program?</h3>
              <p className="text-gray-600">
                Most students complete the program in 6-8 weeks at the recommended pace of 1-2 hours per day. However, you can go faster or slower depending on your schedule.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">What if I don't pass the GED on my first attempt?</h3>
              <p className="text-gray-600">
                Your subscription gives you unlimited access to all materials. You can retake practice tests and review lessons as many times as you need until you feel ready.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Can I download the study materials?</h3>
              <p className="text-gray-600">
                Yes! All study guides, formula sheets, and practice tests can be downloaded for offline study. You can also print them if you prefer physical copies.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Is there a money-back guarantee?</h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day money-back guarantee if you're not satisfied with the program. No questions asked.
              </p>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center py-12 border-t">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you succeed. Contact us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Browse Courses
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
