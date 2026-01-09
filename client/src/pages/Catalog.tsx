import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BookOpen, Clock, Award, ArrowRight, BookMarked } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";

export default function Catalog() {
  const [activeTab, setActiveTab] = useState<'all' | 'theological' | 'ged'>('all');
  const { data: theologicalCourses, isLoading: theologicalLoading } = trpc.courses.listAll.useQuery();
  const { data: gedCourses, isLoading: gedLoading } = trpc.courses.listGed.useQuery();
  
  const coursesLoading = theologicalLoading || gedLoading;
  const displayedCourses = activeTab === 'theological' ? (theologicalCourses || []) : activeTab === 'ged' ? (gedCourses || []) : [...(theologicalCourses || []), ...(gedCourses || [])];

  if (coursesLoading) {
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
      <PublicNav currentPage="courses" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
        <div className="container py-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">Course Catalog</h1>
            <p className="text-xl text-white/90 mb-6">
              Browse our complete catalog of 20 theological courses and 4 GED preparation courses covering essential ministry and educational topics.
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

      {/* Filtering Tabs */}
      <div className="container py-8">
        <div className="flex gap-3 justify-center flex-wrap mb-8">
          <Button 
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="px-6"
          >
            All Courses
          </Button>
          <Button 
            variant={activeTab === 'theological' ? 'default' : 'outline'}
            onClick={() => setActiveTab('theological')}
            className="px-6"
          >
            Theological Courses ({theologicalCourses?.length || 0})
          </Button>
          <Button 
            variant={activeTab === 'ged' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ged')}
            className="px-6"
          >
            <BookMarked className="h-4 w-4 mr-2" />
            GED Preparation ({gedCourses?.length || 0})
          </Button>
        </div>
      </div>

      {/* Theological Courses Section */}
      {(activeTab === 'all' || activeTab === 'theological') && (theologicalCourses?.length || 0) > 0 && (
        <div className="container py-12 border-t">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-3">Theological Courses</h2>
            <p className="text-muted-foreground text-lg">
              Browse our {theologicalCourses?.length || 0} theological courses covering essential ministry topics.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(theologicalCourses || []).map((course: any) => (
            <Card key={course.id} className="hover:shadow-xl transition-all bg-blue-50 border-blue-200">
              <CardHeader 
                className="bg-primary text-white min-h-[140px]"
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
                <CardDescription className="text-sm mb-4 line-clamp-2 text-foreground/80">
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
            </Card>          ))}
          </div>
        </div>
      )}

      {/* GED Preparation Section */}
      {(activeTab === 'all' || activeTab === 'ged') && (gedCourses?.length || 0) > 0 && (
        <div className="container py-12 border-t">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookMarked className="h-8 w-8 text-amber-600" />
              <h2 className="text-3xl font-bold">Bridge Academy - GED Preparation</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Prepare for your GED exam with our comprehensive {gedCourses?.length || 0} subject courses covering all four GED test areas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(gedCourses || []).map((course: any) => (
              <Card key={course.id} className="hover:shadow-xl transition-all bg-amber-50 border-amber-200">
                <CardHeader 
                  className="bg-amber-600 text-white min-h-[140px]"
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
                  <CardDescription className="text-sm mb-4 line-clamp-2 text-foreground/80">
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
        </div>
      )}

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
