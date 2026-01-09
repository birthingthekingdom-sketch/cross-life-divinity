import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ShoppingCart, Check, Clock, Award, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Courses() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const { isAuthenticated } = useAuth();
  const [purchasingCourseId, setPurchasingCourseId] = useState<number | null>(null);

  const { data: courses, isLoading } = trpc.courses.listAll.useQuery();
  const { data: purchases } = trpc.payment.getCoursePurchases.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: subscription } = trpc.payment.getSubscriptionStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: enrollments } = trpc.courses.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createCoursePurchaseCheckout = trpc.payment.createCourseCheckout.useMutation({
    onSuccess: (data: any) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create checkout session");
      setPurchasingCourseId(null);
    },
  });

  const handlePurchaseCourse = (courseId: number) => {
    if (!isAuthenticated) {
      toast.error("Please log in to purchase courses");
      navigate("/login");
      return;
    }

    setPurchasingCourseId(courseId);
    createCoursePurchaseCheckout.mutate({ courseId });
  };

  const isPurchased = (courseId: number) => {
    return purchases?.some((p: any) => p.courseId === courseId && p.status === "completed");
  };

  const isEnrolled = (courseId: number) => {
    return enrollments?.some(e => e.id === courseId);
  };

  const hasActiveSubscription = subscription && subscription.status === "active";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/pricing")}
            variant="ghost"
            className="text-slate-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
          <h1 className="text-5xl font-bold text-white mb-4">
            Browse Individual Courses
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Purchase courses individually for $89 each, or save 67% with an All-Access Subscription
          </p>
        </div>

        {/* Subscription Banner */}
        {hasActiveSubscription && (
          <Card className="mb-8 bg-green-900/30 border-green-700">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-semibold">You have an active All-Access Subscription</p>
                  <p className="text-green-200">You already have access to all courses below</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => {
            const purchased = isPurchased(course.id);
            const enrolled = isEnrolled(course.id);
            const canPurchase = !purchased && !hasActiveSubscription && !enrolled;

            return (
              <Card
                key={course.id}
                className={`border-2 ${
                  enrolled || purchased || hasActiveSubscription
                    ? "border-green-700 bg-green-900/40"
                    : "border-slate-700 bg-slate-800/70"
                } backdrop-blur hover:shadow-xl transition-shadow`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={
                        enrolled || purchased || hasActiveSubscription
                          ? "bg-green-900/50 text-green-300 border-green-700"
                          : "bg-blue-900/50 text-blue-300 border-blue-700"
                      }
                    >
                      {course.code}
                    </Badge>
                    {(enrolled || purchased || hasActiveSubscription) && (
                      <Badge className="bg-green-600 text-white">
                        <Check className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-white">{course.title}</CardTitle>
                  <CardDescription className="text-slate-300 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.cpdHours} CPD hours</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">$89</span>
                      <span className="text-slate-400">one-time</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-300">
                      <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Includes CPD certificate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {canPurchase ? (
                    <Button
                      onClick={() => handlePurchaseCourse(course.id)}
                      disabled={purchasingCourseId === course.id}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {purchasingCourseId === course.id ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Purchase Course
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Go to Course
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* CTA to Subscription */}
        <Card className="mt-12 bg-gradient-to-r from-amber-900/30 to-purple-900/30 border-amber-500/50">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Want Access to All Courses?
            </h3>
            <p className="text-slate-300 mb-6">
              Save 67% with our All-Access Subscription - just $49/month for unlimited access
            </p>
            <Button
              onClick={() => navigate("/pricing")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
              size="lg"
            >
              View Subscription Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
