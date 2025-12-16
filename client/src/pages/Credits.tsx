import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { trpc } from "@/lib/trpc";
import { 
  Award, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  TrendingUp
} from "lucide-react";

// Course credit data with future accreditation equivalents
const CREDIT_EQUIVALENTS = {
  // Current CLAC credits and future semester hour equivalents
  // 10 lessons = 20 CLAC Hours = 2 semester credit hours (when accredited)
  standardCourse: {
    clacHours: 20,
    futureSemesterCredits: 2,
    lessons: 10,
  },
  chaplaincyProgram: {
    clacHours: 65,
    futureSemesterCredits: 6,
    lessons: 30, // Approximate for full program
  }
};

// Learning path credit totals
const LEARNING_PATHS = [
  {
    name: "New Believer Foundation",
    courses: 6,
    totalClacHours: 120,
    futureSemesterCredits: 12,
    level: "Beginner",
  },
  {
    name: "Ministry Preparation Track",
    courses: 4,
    totalClacHours: 80,
    futureSemesterCredits: 8,
    level: "Intermediate",
  },
  {
    name: "Theological Studies",
    courses: 4,
    totalClacHours: 80,
    futureSemesterCredits: 8,
    level: "Advanced",
  },
];

export default function Credits() {
  const { data: courses, isLoading } = trpc.courses.listAll.useQuery();

  // Filter out chaplaincy courses for main course list
  const regularCourses = courses?.filter((c: any) => !c.code.startsWith('CHAP')) || [];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="about" />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Award className="h-12 w-12" />
            <h1 className="text-5xl font-bold">Credits & Certification</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Understand how CLAC credits work and what they'll mean when Cross Life School of Divinity 
            achieves full accreditation.
          </p>
        </div>
      </section>

      {/* Certificate Upgrade Promise Banner */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Certificate Upgrade Promise</h2>
                <p className="text-white/90">
                  When CLSD achieves full accreditation, your certificates will be automatically upgraded at no additional cost!
                </p>
              </div>
            </div>
            <Link href="/accreditation">
              <Button variant="secondary" size="lg">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Understanding Credits */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">How Credits Work</Badge>
            <h2 className="text-4xl font-bold mb-4">Understanding CLAC Credits</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cross Life Accreditation Council (CLAC) credits represent your learning achievement and 
              professional development hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Current: CLAC Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Each course earns you <strong>20 CLAC Hours</strong> of professional development credit, 
                  recognized for continuing education purposes.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-primary">20 CLAC Hours</p>
                  <p className="text-sm text-muted-foreground">per standard course</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-500">
              <CardHeader>
                <Badge className="mb-2 bg-green-500">Coming Soon</Badge>
                <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Future: Semester Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Upon full accreditation, your CLAC hours will convert to <strong>semester credit hours</strong> 
                  transferable to other institutions.
                </p>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">2 Semester Credits</p>
                  <p className="text-sm text-muted-foreground">per standard course (projected)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Your Investment Protected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your certificates are stored permanently. When accreditation is achieved, 
                  upgrades happen <strong>automatically</strong>.
                </p>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-accent">Free Upgrade</p>
                  <p className="text-sm text-muted-foreground">no additional cost</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Credits Chart */}
      <section className="py-16 bg-accent/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Course Credits</Badge>
            <h2 className="text-4xl font-bold mb-4">Credits by Course</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each course provides CLAC hours now, with projected semester credit equivalents upon accreditation.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Course</th>
                      <th className="px-6 py-4 text-center font-semibold">Code</th>
                      <th className="px-6 py-4 text-center font-semibold">Lessons</th>
                      <th className="px-6 py-4 text-center font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <Award className="h-4 w-4" />
                          CLAC Hours
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        <div className="flex flex-col items-center">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            Future Credits
                          </span>
                          <span className="text-xs font-normal opacity-80">(Upon Accreditation)</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {regularCourses.map((course: any, index: number) => (
                      <tr key={course.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{course.title}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="outline">{course.code}</Badge>
                        </td>
                        <td className="px-6 py-4 text-center text-muted-foreground">
                          {course.totalLessons || 10}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                            {course.cpdHours || 20}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                            {Math.round((course.cpdHours || 20) / 10)} credits*
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  * Future semester credit equivalents are projected based on standard academic conversion rates. 
                  Actual credits will be determined upon achieving full accreditation.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chaplaincy Program Credits */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-500">Professional Certification</Badge>
            <h2 className="text-4xl font-bold mb-4">Chaplaincy Training Credits</h2>
          </div>

          <Card className="max-w-2xl mx-auto border-2 border-blue-500">
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle className="text-2xl">Chaplaincy Training & Certification Program</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Current</p>
                  <p className="text-3xl font-bold text-blue-600">65</p>
                  <p className="text-sm font-medium">CLAC Hours</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground mb-1">Future (Upon Accreditation)</p>
                  <p className="text-3xl font-bold text-green-600">6</p>
                  <p className="text-sm font-medium">Semester Credits*</p>
                </div>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Comprehensive chaplaincy training curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Healthcare, military, correctional, and corporate settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Professional certification upon completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Background check included</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/chaplaincy-training">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Learn More About Chaplaincy Training
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learning Path Credits */}
      <section className="py-16 bg-accent/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Learning Paths</Badge>
            <h2 className="text-4xl font-bold mb-4">Structured Learning Path Credits</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete a full learning path to maximize your credits and demonstrate comprehensive knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {LEARNING_PATHS.map((path, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                  {path.level}
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl">{path.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Courses</span>
                      <span className="font-semibold">{path.courses}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">CLAC Hours</span>
                      <span className="font-semibold text-primary">{path.totalClacHours}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-lg">
                      <span className="text-green-700">Future Credits*</span>
                      <span className="font-bold text-green-700">{path.futureSemesterCredits}</span>
                    </div>
                  </div>
                  <Link href="/learning-paths">
                    <Button variant="outline" className="w-full mt-6">
                      View Path Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            * Future semester credits are projected equivalents upon achieving full accreditation.
          </p>
        </div>
      </section>

      {/* Total Potential Credits */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Maximum Achievement</Badge>
            <h2 className="text-4xl font-bold mb-4">Complete All Courses</h2>
          </div>

          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">All 18 Courses</p>
                  <p className="text-5xl font-bold text-primary">360</p>
                  <p className="text-lg font-medium">CLAC Hours</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                  <span className="md:hidden text-muted-foreground">converts to</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Upon Accreditation</p>
                  <p className="text-5xl font-bold text-green-600">36</p>
                  <p className="text-lg font-medium">Semester Credits*</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-white rounded-lg text-center">
                <p className="text-muted-foreground">
                  <Star className="inline h-5 w-5 text-yellow-500 mr-1" />
                  That's equivalent to approximately <strong>one full year</strong> of seminary education!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Earning Credits Today</h2>
          <p className="text-xl text-white/90 mb-8">
            Begin your theological education now. Your credits are protected by our Certificate Upgrade Promise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
