import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BookOpen, Clock, Award, ArrowRight, Play, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";

export default function Catalog() {
  const { data: courses, isLoading: coursesLoading } = trpc.courses.listAll.useQuery();

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
              Browse our complete catalog of 17 theological courses covering essential ministry topics.
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

      {/* All Courses */}
      <div className="container py-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl font-bold mb-3">All Courses</h2>
          <p className="text-muted-foreground text-lg">
            Browse our complete catalog of {courses?.filter((c: any) => !c.code.startsWith('CHAP')).length || 0} theological courses covering essential ministry topics.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.filter((course: any) => !course.code.startsWith('CHAP')).map((course: any) => {
            const isComingSoon = ['DIV108', 'DIV109', 'DIV110'].includes(course.code);
            return (
            <Card key={course.id} className="hover:shadow-xl transition-all bg-blue-50 border-blue-200 relative overflow-hidden">
              <div className="relative bg-black/10 h-40 overflow-hidden group">
                {course.videoUrl ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <Play className="h-12 w-12 text-white/60" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                {isComingSoon && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="font-bold text-primary">Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
              <CardHeader 
                className="bg-primary text-white min-h-[100px]"
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
                <Link href={isComingSoon ? '#' : '/register'}>
                  <Button variant="outline" className="w-full" disabled={isComingSoon}>
                    {isComingSoon ? 'Coming Soon' : 'Enroll Now'}
                    {!isComingSoon && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </Link>
              </CardContent>
            </Card>
            );
          })}
        </div>
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
