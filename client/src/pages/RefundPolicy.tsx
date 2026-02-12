import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { Link } from "wouter";
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  XCircle,
  ArrowRight,
  Shield,
  FileText,
} from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="accreditation" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-xl text-white/90">
              We stand behind the quality of our courses. If you're not satisfied, we offer a straightforward 14-day refund policy with no questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">14-Day Window</h3>
                <p className="text-sm text-muted-foreground">Request refunds within 14 days of enrollment</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <DollarSign className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Full Refund</h3>
                <p className="text-sm text-muted-foreground">Get 100% of paid tuition back</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <RefreshCw className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">2-3 Weeks</h3>
                <p className="text-sm text-muted-foreground">Processing time for refunds</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Policy */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Refund Policy Overview</h2>

          <Card className="border-2 border-primary mb-8">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Our Commitment to You
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground mb-4">
                Cross Life School of Divinity is committed to providing high-quality theological education. If you enroll in a course and find that it doesn't meet your expectations or needs, we offer a straightforward refund policy to ensure your satisfaction.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900">
                  <strong>Our Promise:</strong> If you're not satisfied with your course within 14 days of enrollment, you can request a full refund of your tuition with no questions asked.
                </p>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-bold mb-6">Refund Eligibility</h3>

          {/* Eligible for Refund */}
          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="h-6 w-6" />
                You're Eligible for a Refund If:
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You request a refund within <strong>14 days of your enrollment date</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You experience <strong>technical issues</strong> that prevent you from accessing course materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>The <strong>course is cancelled</strong> by Cross Life School of Divinity</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You <strong>cannot verify your identity</strong> during the enrollment verification process</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You are on a <strong>payment plan</strong> and request cancellation within 14 days</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Not Eligible for Refund */}
          <Card className="mb-8 border-l-4 border-l-red-500">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-900">
                <XCircle className="h-6 w-6" />
                Non-Refundable Items:
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>CLAC Certificates</strong> - Once issued, certificates cannot be refunded</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Background Check Fees</strong> - For Chaplaincy training ($50 background check fee is non-refundable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Late Refund Requests</strong> - Requests made after 14 days of enrollment</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Completed Courses</strong> - Once you've completed more than 50% of a course, refunds are not available</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Refund by Plan Type */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Refunds by Plan Type</h2>

          <div className="space-y-6">
            {/* Individual Courses */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl">Individual Courses ($89)</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-foreground">
                  <strong>Refund Amount:</strong> Full tuition ($89) refunded to original payment method
                </p>
                <p className="text-foreground">
                  <strong>Eligibility:</strong> 14 days from enrollment date, or if course is cancelled
                </p>
                <p className="text-muted-foreground text-sm">
                  If you've completed more than 50% of the course, refunds are not available. However, you can continue accessing the course materials.
                </p>
              </CardContent>
            </Card>

            {/* 3-Course Bundles */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl">3-Course Bundles ($299)</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-foreground">
                  <strong>Refund Amount:</strong> Full bundle price ($299) refunded to original payment method
                </p>
                <p className="text-foreground">
                  <strong>Eligibility:</strong> 14 days from enrollment date, or if any course in the bundle is cancelled
                </p>
                <p className="text-muted-foreground text-sm">
                  If you've started one course and want to continue with others, contact our support team to discuss partial refund options.
                </p>
              </CardContent>
            </Card>

            {/* Learning Paths */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl">Learning Paths ($399)</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-foreground">
                  <strong>Refund Amount:</strong> Full path price ($399) refunded to original payment method
                </p>
                <p className="text-foreground">
                  <strong>Eligibility:</strong> 14 days from enrollment date, or if the path is cancelled
                </p>
                <p className="text-muted-foreground text-sm">
                  Learning Paths are structured sequences. If you've completed the first course, you may be eligible for a partial refund for remaining courses.
                </p>
              </CardContent>
            </Card>

            {/* Payment Plans */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl">Payment Plan Refunds</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-foreground">
                  <strong>Refund Amount:</strong> Full refund of all paid amounts; remaining payments waived
                </p>
                <p className="text-foreground">
                  <strong>Eligibility:</strong> 14 days from enrollment date
                </p>
                <p className="text-muted-foreground text-sm">
                  If you're on a 6-month payment plan and request a refund within 14 days, you'll receive a full refund of all payments made to date, and no further payments will be charged.
                </p>
              </CardContent>
            </Card>

            {/* All-Access Subscription */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl">All-Access Subscription ($49/month)</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <p className="text-foreground">
                  <strong>Refund Amount:</strong> Full refund of current month's subscription; subscription cancelled
                </p>
                <p className="text-foreground">
                  <strong>Eligibility:</strong> 14 days from subscription start date
                </p>
                <p className="text-muted-foreground text-sm">
                  You can cancel your subscription anytime. If you cancel within 14 days, you'll receive a full refund of the current month's payment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Request a Refund */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">How to Request a Refund</h2>

          <div className="space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                  <CardTitle>Contact Our Support Team</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-foreground mb-3">
                  Email us at <a href="mailto:support@crosslifeschoolofdivinity.org" className="text-primary hover:underline font-semibold">support@crosslifeschoolofdivinity.org</a> with your refund request.
                </p>
                <p className="text-muted-foreground text-sm">
                  Include your enrollment ID, course name, and reason for requesting a refund.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                  <CardTitle>Verification & Approval</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-foreground mb-3">
                  Our team will verify that your request meets our refund policy criteria.
                </p>
                <p className="text-muted-foreground text-sm">
                  We'll respond to your request within 1-2 business days with approval or additional information needed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                  <CardTitle>Refund Processing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-foreground mb-3">
                  Once approved, your refund will be processed to your original payment method.
                </p>
                <p className="text-muted-foreground text-sm">
                  Refunds typically appear in your account within 2-3 weeks, depending on your financial institution.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                  <CardTitle>Course Access Revoked</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-foreground mb-3">
                  After refund approval, your access to course materials will be removed.
                </p>
                <p className="text-muted-foreground text-sm">
                  You'll receive a confirmation email when your access has been revoked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Circumstances */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Special Circumstances</h2>

          <div className="space-y-6">
            {/* Technical Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Technical Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground">
                  If you experience technical problems that prevent you from accessing course materials or completing coursework, we'll work to resolve the issue.
                </p>
                <p className="text-muted-foreground text-sm">
                  If the issue cannot be resolved and significantly impacts your learning experience, you may be eligible for a refund or course credit. Contact our support team to discuss your options.
                </p>
              </CardContent>
            </Card>

            {/* Course Cancellation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Course Cancellation by CLSD
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground">
                  If Cross Life School of Divinity cancels a course, all enrolled students will receive a full refund automatically.
                </p>
                <p className="text-muted-foreground text-sm">
                  We'll notify you of the cancellation and process your refund within 5 business days. You'll have the option to enroll in an alternative course or receive a full refund.
                </p>
              </CardContent>
            </Card>

            {/* ID Verification Failure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  ID Verification Failure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground">
                  If we cannot verify your identity during the enrollment verification process, you'll receive a full refund of your tuition.
                </p>
                <p className="text-muted-foreground text-sm">
                  Our team will work with you to resolve any ID verification issues. If verification cannot be completed after reasonable attempts, a full refund will be issued automatically.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Refund FAQs</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  How long do I have to request a refund?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You have 14 days from your enrollment date to request a refund. The 14-day period starts on the date you enroll and receive your access codes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can I get a refund after I've started the course?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, as long as you request the refund within 14 days of enrollment. However, if you've completed more than 50% of the course, you may not be eligible for a full refund. Contact our support team to discuss your specific situation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  How long does it take to receive my refund?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Refunds are typically processed within 2-3 weeks after approval. The exact timeline depends on your financial institution. Some banks may take longer to process the refund.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can I get a refund for a certificate I received?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No, CLAC certificates are non-refundable once issued. However, if you request a refund before completing the course, you won't receive a certificate.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  What about the background check fee for Chaplaincy training?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The $50 background check fee for Chaplaincy training is non-refundable. However, the tuition for the course itself is refundable within 14 days of enrollment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can I cancel my payment plan and get a refund?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, if you're on a payment plan and request cancellation within 14 days of enrollment, you'll receive a full refund of all payments made, and no further payments will be charged.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  What if I have questions about my refund request?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contact our support team at <a href="mailto:support@crosslifeschoolofdivinity.org" className="text-primary hover:underline">support@crosslifeschoolofdivinity.org</a> or call <a href="tel:312-300-3295" className="text-primary hover:underline">(312) 300-3295</a>. We're happy to help!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Enroll with Confidence</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our 14-day refund policy means you can try our courses risk-free. If they're not right for you, we'll refund your tuition with no questions asked.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/catalog">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Browse Courses
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/comparison">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6">
                Compare Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
