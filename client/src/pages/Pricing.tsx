import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, DollarSign, Calendar, Sparkles, BookOpen, Award, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";
// Price display data
const priceDisplay = {
  subscription: {
    originalPrice: "$79",
    monthly: "$49",
    minimumTotal: "$294",
    minimumMonths: 6,
  },
  individualCourse: {
    originalPrice: "$129",
    price: "$89",
    total10Courses: "$890",
  },
  savings: {
    amount: "$596",
    percentage: 67,
  },
};

export default function Pricing() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<"subscription" | "course" | null>(null);

  const { data: courses } = trpc.courses.listAll.useQuery();
  const { data: subscription } = trpc.payment.getSubscriptionStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: purchases } = trpc.payment.getCoursePurchases.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createSubscriptionCheckout = trpc.payment.createSubscriptionCheckout.useMutation({
    onSuccess: (data: any) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create checkout session");
      setLoading(null);
    },
  });

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe");
      return;
    }

    if (subscription) {
      toast.info("You already have an active subscription");
      navigate("/dashboard");
      return;
    }

    setLoading("subscription");
    createSubscriptionCheckout.mutate();
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  const hasActiveSub = !!subscription && subscription.status === "active";
  const purchasedCount = purchases?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-500 text-white hover:bg-red-600 text-lg px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Limited-Time Offer - Lock In This Rate Forever!
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-4">
            Seminary-Level Theological Education
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose between individual course purchases or unlimited access to all 10+ courses with our All-Access Subscription
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Individual Courses */}
          <Card className="relative border-2 border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-blue-400" />
                <Badge variant="outline" className="text-slate-300 border-slate-600">
                  Pay Once
                </Badge>
              </div>
              <CardTitle className="text-3xl text-white">Individual Courses</CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Purchase courses one at a time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl text-slate-500 line-through">{priceDisplay.individualCourse.originalPrice}</span>
                  <span className="text-5xl font-bold text-white">{priceDisplay.individualCourse.price}</span>
                  <span className="text-slate-400">per course</span>
                </div>
                <p className="text-sm text-green-400 font-semibold">Save $40 per course!</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Lifetime access to purchased course</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">All lessons, quizzes, and assignments</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">CPD-accredited certificate upon completion</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Discussion forums and peer reviews</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">One-time payment, no recurring fees</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400">
                  <strong className="text-white">All 10 courses:</strong> {priceDisplay.individualCourse.total10Courses}
                </p>
              </div>

              {purchasedCount > 0 && (
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    You've purchased {purchasedCount} course{purchasedCount > 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleBrowseCourses}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </CardFooter>
          </Card>

          {/* All-Access Subscription */}
          <Card className="relative border-2 border-amber-500 bg-gradient-to-br from-amber-900/20 to-slate-800/50 backdrop-blur shadow-2xl shadow-amber-500/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-amber-500 text-slate-900 px-6 py-1 text-sm font-bold">
                BEST VALUE
              </Badge>
            </div>
            <CardHeader className="pt-8">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-amber-400" />
                <Badge variant="outline" className="text-amber-300 border-amber-600">
                  Most Popular
                </Badge>
              </div>
              <CardTitle className="text-3xl text-white">All-Access Subscription</CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Unlimited access to all courses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl text-slate-500 line-through">{priceDisplay.subscription.originalPrice}</span>
                  <span className="text-5xl font-bold text-white">{priceDisplay.subscription.monthly}</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-sm text-green-400 font-semibold">Save $30/month - Lock in this rate forever!</p>
              </div>

              <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-200 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">6-Month Minimum</span>
                </div>
                <p className="text-sm text-amber-300">
                  {priceDisplay.subscription.minimumTotal} total, then month-to-month
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">Unlimited access to all 10+ courses</strong>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">All future courses included at no extra cost</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">CPD certificates for all completed courses</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Priority support and live webinars</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">ACH payment option available</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Cancel anytime after 6 months</span>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-700/50">
                <div className="flex items-center gap-2 text-green-400">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">
                    Save {priceDisplay.savings.amount} ({priceDisplay.savings.percentage}%) vs buying all courses
                  </span>
                </div>
              </div>

              {hasActiveSub && (
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                  <p className="text-sm text-green-200 font-semibold">
                    ✓ Active Subscription
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubscribe}
                disabled={loading === "subscription" || hasActiveSub}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
                size="lg"
              >
                {loading === "subscription" ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : hasActiveSub ? (
                  "Already Subscribed"
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Start Subscription
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Upgrade Option */}
        {purchasedCount > 0 && !hasActiveSub && (
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Already Purchased Courses? Get Credit!
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Upgrade to All-Access Subscription and receive full credit for your previous purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-6">
                <p className="text-white mb-2">
                  You've spent <strong className="text-purple-300">${(purchasedCount * 89).toFixed(2)}</strong> on {purchasedCount} course{purchasedCount > 1 ? "s" : ""}
                </p>
                <p className="text-slate-300">
                  Upgrade now and get <strong className="text-green-400">${(purchasedCount * 89).toFixed(2)} credit</strong> applied to your first subscription payment!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate("/upgrade")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade with Credit
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">What's included in each course?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Each course includes comprehensive video lessons, reading materials, quizzes, written assignments, peer reviews, discussion forums, and a CPD-accredited certificate upon completion.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Can I cancel my subscription?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Yes! After the 6-month minimum commitment, you can cancel anytime. Your access continues until the end of your current billing period.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                We accept all major credit cards for both individual courses and subscriptions. ACH bank payments are also available for subscriptions.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">How does the upgrade credit work?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                If you've purchased individual courses and want to upgrade to the All-Access Subscription, you'll receive 100% credit for your previous purchases applied to your subscription.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
