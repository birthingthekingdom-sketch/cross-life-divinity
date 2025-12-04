import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, DollarSign, Check, Clock, Award, ArrowRight, Calculator } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Upgrade() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const { data: purchases } = trpc.payments.getCoursePurchases.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: subscription } = trpc.payments.getSubscriptionStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const upgradeToSubscription = trpc.payments.upgradeToSubscription.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create upgrade checkout");
      setLoading(false);
    },
  });

  const handleUpgrade = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to upgrade");
      navigate("/login");
      return;
    }

    if (subscription && subscription.status === "active") {
      toast.info("You already have an active subscription");
      navigate("/dashboard");
      return;
    }

    if (!purchases || purchases.length === 0) {
      toast.error("No previous purchases found");
      navigate("/pricing");
      return;
    }

    setLoading(true);
    upgradeToSubscription.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Login Required</CardTitle>
            <CardDescription className="text-slate-300">
              Please log in to upgrade to a subscription
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const completedPurchases = purchases?.filter(p => p.status === "completed") || [];
  const totalSpent = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
  const creditAmount = totalSpent / 100; // Convert cents to dollars
  const subscriptionPrice = 49;
  const minimumCommitment = 294; // 6 months * $49
  const effectiveFirstPayment = Math.max(0, minimumCommitment - totalSpent / 100);
  const monthsCovered = Math.floor(creditAmount / subscriptionPrice);
  const remainingCredit = creditAmount % subscriptionPrice;

  if (subscription && subscription.status === "active") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/50 border-green-700">
          <CardHeader>
            <CardTitle className="text-white">Already Subscribed</CardTitle>
            <CardDescription className="text-slate-300">
              You already have an active All-Access Subscription
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (completedPurchases.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">No Previous Purchases</CardTitle>
            <CardDescription className="text-slate-300">
              You haven't purchased any courses yet
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/pricing")} className="w-full">
              View Pricing
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-500 text-white hover:bg-purple-400">
            <Sparkles className="w-3 h-3 mr-1" />
            Upgrade Offer
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-4">
            Upgrade to All-Access Subscription
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Get full credit for your previous purchases and unlock unlimited access to all courses
          </p>
        </div>

        {/* Credit Calculation Card */}
        <Card className="max-w-4xl mx-auto mb-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-purple-400" />
              Your Upgrade Credit
            </CardTitle>
            <CardDescription className="text-slate-300 text-lg">
              100% credit applied from your previous course purchases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purchase Summary */}
            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Purchase History</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-300">
                  <span>Courses Purchased:</span>
                  <span className="text-white font-semibold">{completedPurchases.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Spent:</span>
                  <span className="text-white font-semibold">${creditAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-300 pt-3 border-t border-purple-700">
                  <span className="font-semibold">Available Credit:</span>
                  <span className="text-green-400 font-bold text-xl">${creditAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Credit Application */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                How Your Credit Works
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300">
                      Your ${creditAmount.toFixed(2)} credit covers <strong className="text-white">{monthsCovered} month{monthsCovered !== 1 ? "s" : ""}</strong> of subscription
                    </p>
                    {remainingCredit > 0 && (
                      <p className="text-sm text-slate-400 mt-1">
                        Plus ${remainingCredit.toFixed(2)} credit toward your next month
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">
                    {effectiveFirstPayment === 0 ? (
                      <>6-month minimum commitment <strong className="text-green-400">fully covered</strong> by your credit</>
                    ) : (
                      <>First payment: <strong className="text-white">${effectiveFirstPayment.toFixed(2)}</strong> (after credit)</>
                    )}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">
                    After credit is used, continue at $49/month
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                What You Get
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Unlimited access to all 10+ courses</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">All future courses at no extra cost</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">CPD certificates for all courses</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Priority support & live webinars</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">ACH payment option available</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">Cancel anytime after 6 months</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold"
              size="lg"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade Now with Credit
                </>
              )}
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              size="lg"
            >
              Back to Pricing
            </Button>
          </CardFooter>
        </Card>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Upgrade Questions
          </h2>
          <div className="grid gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">What happens to my purchased courses?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Your purchased courses remain accessible. The subscription simply adds unlimited access to all other courses as well.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">When does my credit expire?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Your credit never expires and is automatically applied to your subscription payments until fully used.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Can I cancel after using my credit?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Yes, you can cancel anytime after the 6-month minimum commitment period. Your access continues until the end of your paid period.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
