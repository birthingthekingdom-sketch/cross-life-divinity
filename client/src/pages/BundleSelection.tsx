import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { BookOpen, Clock, Award, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { useToast } from "@/hooks/use-toast";

export default function BundleSelection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const { data: courses, isLoading } = trpc.courses.listAll.useQuery();
  const createCheckout = trpc.payment.createBundleCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: "Checkout Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleCourse = (courseId: number) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else if (selectedCourses.length < 3) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      toast({
        title: "Maximum Reached",
        description: "You can only select 3 courses for this bundle.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (selectedCourses.length !== 3) {
      toast({
        title: "Selection Required",
        description: "Please select exactly 3 courses to continue.",
        variant: "destructive",
      });
      return;
    }

    createCheckout.mutate({
      courseIds: selectedCourses,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <PublicNav currentPage="courses" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="container py-12">
          <div className="max-w-4xl">
            <Badge className="bg-white/20 text-white mb-4">3-Course Bundle - $299</Badge>
            <h1 className="text-5xl font-bold mb-4">Choose Your 3 Courses</h1>
            <p className="text-xl text-white/90 mb-6">
              Select any 3 courses from our catalog and save $88. You'll get lifetime access to all lessons, quizzes, and CPD certificates.
            </p>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>One-time payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>CPD certificates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Progress */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">
                {selectedCourses.length} / 3 Selected
              </div>
              {selectedCourses.length < 3 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Select {3 - selectedCourses.length} more course{3 - selectedCourses.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {selectedCourses.length === 3 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready to checkout!</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground line-through">$387</div>
                <div className="text-2xl font-bold text-primary">$299</div>
              </div>
              <Button 
                size="lg"
                disabled={selectedCourses.length !== 3 || createCheckout.isPending}
                onClick={handleCheckout}
              >
                {createCheckout.isPending ? "Processing..." : "Proceed to Checkout"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course: any) => {
            const isSelected = selectedCourses.includes(course.id);
            const canSelect = selectedCourses.length < 3 || isSelected;

            return (
              <Card 
                key={course.id} 
                className={`hover:shadow-xl transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                } ${!canSelect ? 'opacity-50' : ''}`}
                onClick={() => canSelect && toggleCourse(course.id)}
              >
                <CardHeader 
                  className={`${isSelected ? 'bg-primary' : 'bg-primary/80'} text-white min-h-[140px] relative`}
                >
                  <div className="absolute top-4 right-4">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => canSelect && toggleCourse(course.id)}
                      className="h-6 w-6 border-2 border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-2 pr-8">
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
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                  {isSelected && (
                    <div className="mt-4 p-2 bg-primary/10 rounded-lg flex items-center gap-2 text-primary text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Selected for bundle
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">
                {selectedCourses.length === 3 ? 'Ready to complete your purchase?' : `Select ${3 - selectedCourses.length} more course${3 - selectedCourses.length !== 1 ? 's' : ''}`}
              </div>
              <div className="text-sm text-muted-foreground">
                Save $88 with this bundle • Lifetime access • CPD certificates included
              </div>
            </div>
            <Button 
              size="lg"
              disabled={selectedCourses.length !== 3 || createCheckout.isPending}
              onClick={handleCheckout}
            >
              {createCheckout.isPending ? "Processing..." : "Checkout - $299"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
