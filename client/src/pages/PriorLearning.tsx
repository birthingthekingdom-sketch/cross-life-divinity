import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Award, Clock, DollarSign, FileText, Users, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function PriorLearning() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav currentPage="prior-learning" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-8 w-8 text-accent" />
              <span className="text-accent font-semibold text-lg">Recognition of Experience</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Credit for Life Experience
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Your ministry experience matters. Earn up to 30% of your certificate credits through Prior Learning Assessment (PLA) 
              and accelerate your path to graduation while saving time and money.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Apply for PLA Credits
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Prior Learning Assessment?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We recognize that your years of ministry have taught you valuable skills and knowledge. 
              PLA allows you to demonstrate that learning and receive academic credit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Save Time</CardTitle>
                <CardDescription>
                  Graduate faster by reducing the number of courses you need to take
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Earn up to 12 credits (30% of program) for your documented ministry experience, 
                  allowing you to focus on core theological studies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Save Money</CardTitle>
                <CardDescription>
                  Pay significantly less for PLA credits than regular coursework
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  PLA assessment fee is $50 per credit vs. $150 per credit for courses. 
                  Save up to $1,200 with maximum PLA credits!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Get Recognition</CardTitle>
                <CardDescription>
                  Your ministry experience is valued and formally recognized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We honor your years of service by awarding academic credit for demonstrated 
                  competencies in ministry, leadership, and pastoral care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How Prior Learning Assessment Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A simple three-step process to earn credit for your ministry experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="relative">
              <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Submit Application</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Complete PLA application form</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Submit detailed resume/CV</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Provide ministry portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Include 2-3 reference letters</span>
                </li>
              </ul>
              <p className="mt-4 text-sm font-semibold">Application Fee: $25</p>
            </div>

            <div className="relative">
              <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">Academic Review</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Dean evaluates your experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Verifies references and documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Determines credit equivalencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Awards specific course credits</span>
                </li>
              </ul>
              <p className="mt-4 text-sm font-semibold">Review Time: 2-3 weeks</p>
            </div>

            <div className="relative">
              <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Credits Applied</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Receive credit award notification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Pay assessment fee per credit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Credits added to your transcript</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Complete remaining coursework</span>
                </li>
              </ul>
              <p className="mt-4 text-sm font-semibold">Assessment Fee: $50 per credit</p>
            </div>
          </div>

          <div className="bg-accent/10 border-2 border-accent/20 rounded-lg p-8 text-center">
            <p className="text-lg font-semibold mb-2">
              Important: PLA credits are applied <span className="text-accent">toward</span> your certificate requirements
            </p>
            <p className="text-muted-foreground">
              You must still complete required coursework to earn your certificate. PLA reduces the number of courses 
              you need to take, but ensures you receive a complete theological education from Cross Life School of Divinity.
            </p>
          </div>
        </div>
      </section>

      {/* Credit Limits & Requirements */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Credit Limits & Requirements</h2>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    Maximum PLA Credits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Maximum credits via PLA:</span>
                    <span className="font-bold">12 credits (30%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Minimum coursework required:</span>
                    <span className="font-bold">28 credits (70%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total for certificate:</span>
                    <span className="font-bold">40 credits</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Eligibility Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Minimum 3 years of documented ministry experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Verifiable leadership roles in ministry settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Strong references from ministry leaders or pastors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Demonstrated competency in specific ministry areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Currently enrolled in a certificate program at CLSD</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">What Courses Qualify?</h2>
              
              <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">✓ PLA-Eligible Courses</CardTitle>
                  <CardDescription>These courses may be awarded via Prior Learning Assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• MIN101: Evangelism and Discipleship</li>
                    <li>• MIN102: Discipleship Training</li>
                    <li>• LED201: Christian Leadership</li>
                    <li>• PAS101: Homiletics (Preaching)</li>
                    <li>• PAS201: Pastoral Counseling</li>
                    <li>• MIN201: Fivefold Ministry</li>
                    <li>• MIN301: Deliverance Ministry</li>
                    <li>• WOR101: Biblical Worship</li>
                    <li>• SPR101: Prayer and Intercession</li>
                    <li>• SPR201: Discovering Spiritual Gifts</li>
                    <li>• PAS301: Church Administration</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">✗ Core Courses (Must Be Taken)</CardTitle>
                  <CardDescription>These courses require completion through coursework</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• BIB101: Old Testament Survey</li>
                    <li>• BIB102: New Testament Survey</li>
                    <li>• THE201: Systematic Theology</li>
                    <li>• BIB201: Biblical Hermeneutics</li>
                    <li>• THE301: Fundamentals of Apologetics</li>
                    <li>• DIV101: Understanding Prophecy</li>
                    <li>• Final Capstone Course</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Core biblical and theological courses ensure all students receive foundational 
                    theological education regardless of prior experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See exactly how much you can save with Prior Learning Assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Regular Course Pricing</CardTitle>
                <CardDescription>Standard tuition for coursework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span>Per Credit:</span>
                  <span className="font-bold">$150</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>12 Credits:</span>
                  <span className="font-bold">$1,800</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>40 Credits (Full Program):</span>
                  <span className="font-bold text-2xl">$6,000</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent border-2">
              <CardHeader>
                <CardTitle className="text-accent">PLA Pricing</CardTitle>
                <CardDescription>Assessment fees for life experience credits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span>Application Fee:</span>
                  <span className="font-bold">$25</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>Per Credit Assessment:</span>
                  <span className="font-bold">$50</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>12 PLA Credits:</span>
                  <span className="font-bold text-2xl text-accent">$625</span>
                </div>
                <div className="bg-accent/10 rounded-lg p-4 mt-4">
                  <p className="text-center font-bold text-accent text-xl">Save $1,175!</p>
                  <p className="text-center text-sm text-muted-foreground mt-1">
                    With maximum PLA credits
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl">Example: Pastor with 10 Years Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Without PLA:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• 40 credits × $150 = $6,000</li>
                      <li>• All courses required</li>
                      <li>• Longer time to completion</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-accent">With PLA:</h4>
                    <ul className="space-y-2">
                      <li>• 12 PLA credits = $625</li>
                      <li>• 28 course credits × $150 = $4,200</li>
                      <li className="font-bold">• Total: $4,825 (Save $1,175!)</li>
                      <li>• Graduate faster</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Required Documentation */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Required Documentation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Prepare these materials for your PLA application
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Ministry Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Detailed Resume/CV:</strong> Include all ministry positions, dates, responsibilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Ministry Timeline:</strong> Chronological overview of your service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Reflective Essay:</strong> 500-1000 words on your ministry journey and learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Supporting Documents:</strong> Certificates, ordination papers, program materials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-accent mb-2" />
                <CardTitle>References & Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Reference Letters:</strong> 2-3 letters from pastors, ministry leaders, or supervisors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Contact Information:</strong> Verifiable references with phone/email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Ordination/Credentials:</strong> Copies of official ministry credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span><strong>Church Affiliation:</strong> Documentation of church/organization involvement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Can I get a certificate through PLA alone without taking any courses?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <strong>No.</strong> PLA credits are applied <em>toward</em> your certificate requirements, not as a replacement 
                  for the entire program. You must complete a minimum of 70% of the program (28 credits) through coursework, 
                  including all core biblical and theological courses. This ensures you receive a complete theological education 
                  and maintains the academic integrity of our certificates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How long does the PLA review process take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Academic Dean typically completes portfolio reviews within 2-3 weeks of receiving your complete application. 
                  You'll receive a detailed notification of credit awards and can then proceed with your remaining coursework.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What if I don't have formal ministry credentials?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Formal ordination or credentials are not required. We evaluate all documented ministry experience including 
                  volunteer ministry, lay leadership, missionary work, church planting, and other forms of Christian service. 
                  Strong references and a detailed portfolio are most important.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I apply for PLA after I've already started taking courses?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can apply for PLA at any time during your enrollment. However, we recommend applying early so you 
                  can plan your remaining coursework efficiently. PLA credits cannot be awarded for courses you've already completed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What happens if my PLA application is denied or I receive fewer credits than expected?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Academic Dean provides detailed feedback on all PLA decisions. If you receive fewer credits than anticipated, 
                  you'll understand exactly why and what additional documentation might strengthen a future application. 
                  The $25 application fee is non-refundable, but you only pay the $50 per-credit assessment fee for credits actually awarded.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Will PLA credits appear differently on my transcript?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, PLA credits are noted as "Prior Learning Assessment" or "Life Experience Credit" on your transcript 
                  to distinguish them from course-based credits. This is standard practice in higher education and maintains 
                  transparency about how credits were earned.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Credit for Your Experience?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join Cross Life School of Divinity and accelerate your theological education while honoring 
            your years of faithful ministry service.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                Enroll Now & Apply for PLA
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View All Pricing Options
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-white/80">
            Questions? Contact us at{" "}
            <a href="mailto:support@crosslifeschoolofdivinity.org" className="underline hover:text-white">
              support@crosslifeschoolofdivinity.org
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
