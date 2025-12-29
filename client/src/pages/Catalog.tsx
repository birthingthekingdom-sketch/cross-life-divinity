import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { BookOpen, GraduationCap, Clock, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";

export default function Catalog() {
  const { data: bundles, isLoading: bundlesLoading } = trpc.bundles.getActiveBundles.useQuery();
  const { data: paths, isLoading: pathsLoading } = trpc.bundles.getActiveLearningPaths.useQuery();
  const { data: courses, isLoading: coursesLoading } = trpc.courses.listAll.useQuery();

  const isLoading = bundlesLoading || pathsLoading || coursesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
        <div className="container py-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">Course Catalog</h1>
            <p className="text-xl text-white/90 mb-6">
              Explore our comprehensive theological education programs. Browse by learning paths, course bundles, or individual courses.
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Content */}
      <div className="container py-12">
        <Tabs defaultValue="paths" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="bundles">Course Bundles</TabsTrigger>
            <TabsTrigger value="courses">All Courses</TabsTrigger>
          </TabsList>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl font-bold mb-3">Structured Learning Paths</h2>
              <p className="text-muted-foreground text-lg">
                Follow a guided sequence of courses designed to help you achieve specific ministry goals, from beginner to advanced levels.
              </p>
            </div>
            <div className="grid gap-6 max-w-5xl mx-auto">
              {paths?.map((path: any) => (
                <Card key={path.id} className="hover:shadow-xl transition-all">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${
                            path.level === 'beginner' ? 'bg-green-100 text-green-800' :
                            path.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {path.level.charAt(0).toUpperCase() + path.level.slice(1)}
                          </Badge>
                          {path.duration && (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {path.duration}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl mb-2">{path.name}</CardTitle>
                        <CardDescription className="text-base">{path.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {path.goal && (
                      <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                        <div className="text-sm font-semibold mb-1">Learning Goal</div>
                        <div className="text-sm text-muted-foreground">{path.goal}</div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Includes {path.courses.length} courses:</div>
                      {path.courses.slice(0, 3).map((course: any) => (
                        <div key={course.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          {course.title}
                        </div>
                      ))}
                      {path.courses.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          + {path.courses.length - 3} more courses
                        </div>
                      )}
                    </div>
                    <Link href="/register">
                      <Button className="w-full mt-4">
                        Start This Path
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Course Bundles Tab */}
          <TabsContent value="bundles" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl font-bold mb-3">Thematic Course Bundles</h2>
              <p className="text-muted-foreground text-lg">
                Explore related courses grouped by ministry focus areas and theological themes.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles?.map((bundle: any) => (
                <Card key={bundle.id} className="hover:shadow-xl transition-all">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary">Bundle</Badge>
                    </div>
                    <CardTitle className="text-xl">{bundle.name}</CardTitle>
                    <CardDescription>{bundle.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="text-sm font-semibold">
                        {bundle.courses.length} courses included:
                      </div>
                      <div className="space-y-1">
                        {bundle.courses.map((course: any) => (
                          <div key={course.id} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="line-clamp-1">{course.title}</span>
                          </div>
                        ))}
                      </div>
                      {bundle.price > 0 && (
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="text-2xl font-bold text-primary">${(bundle.price / 100).toFixed(0)}</div>
                              {bundle.discountPercentage > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Save {bundle.discountPercentage}% vs individual courses
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <Link href="/register">
                        <Button variant="outline" className="w-full mt-2">
                          Purchase Bundle
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* All Courses Tab */}
          <TabsContent value="courses" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl font-bold mb-3">All Courses</h2>
              <p className="text-muted-foreground text-lg">
                Browse our complete catalog of {courses?.length || 0} theological courses covering essential ministry topics.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course: any) => (
                <Card key={course.id} className="hover:shadow-xl transition-all">
                  <CardHeader 
                    className="text-white min-h-[140px]"
                    style={{ backgroundColor: course.colorTheme }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-white/20 text-white">{course.code}</Badge>
                      {course.cpdHours > 0 && (
                        <Badge variant="secondary" className="bg-white/90">
                          <Award className="h-3 w-3 mr-1" />
                          {course.cpdHours} CPD
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription className="text-sm mb-4 line-clamp-2">
                      {course.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.totalLessons} lessons
                      </div>
                      {course.estimatedHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.estimatedHours}h
                        </div>
                      )}
                    </div>
                    <Link href="/register">
                      <Button variant="outline" className="w-full">
                        Enroll Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join Cross Life School of Divinity today and start your theological education with expert instruction and comprehensive curriculum.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
