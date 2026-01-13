import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { Link } from "wouter";
import {
  Shield,
  CheckCircle,
  Clock,
  FileCheck,
  AlertCircle,
  Camera,
  Zap,
  HelpCircle,
  ArrowRight,
  Users,
  Lock,
  BookOpen,
} from "lucide-react";

export default function EnrollmentVerification() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="accreditation" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Enrollment Verification Process</h1>
            <p className="text-xl text-white/90">
              We maintain rigorous verification standards to ensure the integrity of our CLAC-accredited programs and protect our community. Here's how our enrollment verification process works.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Camera className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">ID Photo</h3>
                <p className="text-sm text-muted-foreground">Upload valid government ID</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Instant Access</h3>
                <p className="text-sm text-muted-foreground">Start courses immediately</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Background Check</h3>
                <p className="text-sm text-muted-foreground">CLSOD verification (2-3 weeks)</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Enrollment Complete</h3>
                <p className="text-sm text-muted-foreground">Full access confirmed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How Enrollment Verification Works</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <Card className="border-l-4 border-l-primary overflow-hidden">
              <CardHeader className="bg-primary/5">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-2xl">ID Photo Upload</CardTitle>
                    <p className="text-muted-foreground mt-1">Required for all enrollees</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-foreground">
                    During enrollment, you'll upload a clear photo of your government-issued ID. Accepted forms of identification include:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Driver's License</strong> - U.S. state or international</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>State ID</strong> - Non-driver identification card</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Passport</strong> - U.S. or international passport</span>
                    </li>
                  </ul>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-900">
                      <strong>💡 Tip:</strong> Make sure your ID is current and clearly visible. Photos should show the full ID with all information legible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-l-4 border-l-primary overflow-hidden">
              <CardHeader className="bg-primary/5">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Immediate Course Access</CardTitle>
                    <p className="text-muted-foreground mt-1">Start learning right away</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-foreground">
                    Once you upload your ID photo, you'll receive your access codes immediately and can begin your courses right away. You don't have to wait for background verification to start learning.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900">Instant Access Benefit</p>
                        <p className="text-sm text-green-800 mt-1">
                          You can start completing lessons, taking quizzes, and engaging with course materials immediately upon enrollment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-l-4 border-l-primary overflow-hidden">
              <CardHeader className="bg-primary/5">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Background Verification</CardTitle>
                    <p className="text-muted-foreground mt-1">Conducted by Cross Life School of Divinity</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-foreground">
                    After you submit your ID, our team conducts a comprehensive background verification process. This includes:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Identity Verification</strong> - Confirming your ID is valid and matches enrollment information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Background Check</strong> - Standard background screening for all students</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Enhanced Screening (Chaplaincy Only)</strong> - Additional verification for Chaplaincy training applicants</span>
                    </li>
                  </ul>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-900">Processing Timeline</p>
                        <p className="text-sm text-amber-800 mt-1">
                          Background verification typically takes 2-3 weeks. You'll receive email updates on the status of your verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-l-4 border-l-primary overflow-hidden">
              <CardHeader className="bg-primary/5">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Enrollment Confirmation</CardTitle>
                    <p className="text-muted-foreground mt-1">Full access and certificate eligibility</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-foreground">
                    Once verification is complete and approved, you'll receive official enrollment confirmation. At this point:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Your enrollment status is finalized</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>You're eligible to receive CLAC certificates upon course completion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Full access to all course materials and resources</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chaplaincy Training Special Requirements */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Chaplaincy Training - Enhanced Verification</h2>
          <Card className="border-2 border-primary">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Additional Requirements for Chaplaincy Applicants
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">
                Chaplaincy training requires enhanced verification due to the sensitive nature of the role and the requirement to work with vulnerable populations.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-3">Enhanced Verification Includes:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Full Background Check</strong> - Comprehensive screening including criminal history</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Reference Verification</strong> - Contact with professional or ministerial references</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Ministry Credential Review</strong> - Verification of ministerial standing and credentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Extended Timeline</strong> - May take 3-4 weeks due to additional screening</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These requirements ensure that chaplains are qualified, trustworthy individuals capable of serving in sensitive ministerial and institutional settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ID Verification Failure */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Unable to Verify ID?</h2>
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertCircle className="h-6 w-6" />
                What Happens If We Cannot Verify Your ID
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-amber-900">
              <p>
                If we're unable to verify your identity based on the ID photo you provided, or if your ID cannot be authenticated, we will:
              </p>
              <ol className="space-y-3 ml-4 list-decimal">
                <li>Contact you to request additional documentation or clarification</li>
                <li>Provide you with a grace period to resubmit a clearer ID photo or alternative ID</li>
                <li>If verification cannot be completed after reasonable attempts, issue a full refund of your enrollment fees</li>
              </ol>
              <div className="bg-white rounded-lg p-4 border border-amber-200 mt-4">
                <p className="text-sm">
                  <strong>Important:</strong> We understand that ID verification can sometimes be challenging. Our team will work with you to resolve any issues. If enrollment cannot be completed due to ID verification failure, you'll receive a full refund with no questions asked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Verification FAQs</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can I start courses before my background check is complete?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can start your courses immediately after uploading your ID photo and receiving your access codes. You don't need to wait for the background verification to complete. However, your CLAC certificate will be issued only after verification is complete and approved.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  How long does verification take?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Standard verification typically takes 2-3 weeks. Chaplaincy training verification may take 3-4 weeks due to enhanced screening requirements. You'll receive email updates on the status of your verification.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  What if my ID is expired?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept expired IDs as long as the photo is still clearly recognizable and the ID is a valid government-issued document. However, if your ID is severely damaged or the photo is illegible, we may request an alternative form of ID.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can I use an international ID?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We accept international driver's licenses and passports. Make sure the ID is current and clearly shows your name and photo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Will my personal information be kept confidential?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely. All ID information and background check data are handled with strict confidentiality and stored securely. We comply with all privacy regulations and only use this information for enrollment verification purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  What if I have questions about my verification status?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contact our accreditation team at <a href="mailto:accreditation@crosslifeschoolofdivinity.org" className="text-primary hover:underline">accreditation@crosslifeschoolofdivinity.org</a> with your enrollment ID, and we'll provide you with a status update.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Enroll?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            The enrollment verification process is quick and straightforward. Start your theological education today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/catalog">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Browse Courses
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6">
                Start Enrollment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
