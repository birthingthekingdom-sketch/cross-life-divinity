import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Calendar, DollarSign, CreditCard, AlertTriangle, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Subscription() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const { isAuthenticated } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const { data: subscription, refetch: refetchSubscription } = trpc.payments.getSubscriptionStatus.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: purchases } = trpc.payments.getCoursePurchases.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const cancelSubscription = trpc.payments.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription cancelled successfully");
      setShowCancelDialog(false);
      setCanceling(false);
      refetchSubscription();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel subscription");
      setCanceling(false);
    },
  });

  const handleCancelSubscription = () => {
    setCanceling(true);
    cancelSubscription.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Login Required</CardTitle>
            <CardDescription className="text-slate-300">
              Please log in to view your subscription
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

  const hasActiveSubscription = subscription && subscription.status === "active";
  const completedPurchases = purchases?.filter(p => p.status === "completed") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="text-slate-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">
            Subscription & Payments
          </h1>
          <p className="text-slate-300">
            Manage your subscription and view payment history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Status */}
          <div className="lg:col-span-2 space-y-6">
            {hasActiveSubscription ? (
              <Card className="bg-green-900/20 border-green-700 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        Active Subscription
                      </CardTitle>
                      <CardDescription className="text-green-200">
                        All-Access Subscription
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Current Period</span>
                      </div>
                      <p className="text-white font-semibold">
                        {format(new Date(subscription.currentPeriodStart), "MMM d, yyyy")} -{" "}
                        {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="bg-slate-900/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Monthly Price</span>
                      </div>
                      <p className="text-white font-semibold text-2xl">$49</p>
                    </div>
                  </div>

                  {subscription.cancelAtPeriodEnd ? (
                    <Alert className="bg-amber-900/30 border-amber-700">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <AlertDescription className="text-amber-200">
                        Your subscription will cancel on{" "}
                        {format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}. You'll
                        have access until then.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-blue-900/30 border-blue-700">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <AlertDescription className="text-blue-200">
                        Your subscription will automatically renew on{" "}
                        {format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                {!subscription.cancelAtPeriodEnd && (
                  <CardFooter>
                    <Button
                      onClick={() => setShowCancelDialog(true)}
                      variant="outline"
                      className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                    >
                      Cancel Subscription
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-slate-400" />
                    No Active Subscription
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    You don't have an active subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">
                    Get unlimited access to all 10+ courses with our All-Access Subscription for just $49/month
                  </p>
                  {completedPurchases.length > 0 && (
                    <Alert className="bg-purple-900/30 border-purple-700">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <AlertDescription className="text-purple-200">
                        You have ${(completedPurchases.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)} in
                        credit from previous purchases. Upgrade now to apply it!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="gap-4">
                  <Button
                    onClick={() => navigate("/pricing")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Pricing
                  </Button>
                  {completedPurchases.length > 0 && (
                    <Button
                      onClick={() => navigate("/upgrade")}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Upgrade with Credit
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}

            {/* Purchase History */}
            {completedPurchases.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Purchase History</CardTitle>
                  <CardDescription className="text-slate-300">
                    Your individual course purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedPurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-semibold">Course Purchase</p>
                          <p className="text-sm text-slate-400">
                            {format(new Date(purchase.purchasedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${(purchase.amount / 100).toFixed(2)}</p>
                          <Badge className="bg-green-900/50 text-green-300 border-green-700">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between text-slate-300">
                      <span>Total Spent:</span>
                      <span className="text-white font-semibold text-lg">
                        ${(completedPurchases.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate("/courses")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Browse Courses
                </Button>
                <Button
                  onClick={() => navigate("/pricing")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  View Pricing
                </Button>
                {!hasActiveSubscription && completedPurchases.length > 0 && (
                  <Button
                    onClick={() => navigate("/upgrade")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Upgrade with Credit
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-900/20 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 text-sm space-y-2">
                <p>Have questions about your subscription or payments?</p>
                <p>Contact our support team for assistance.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Cancel Subscription?</DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to cancel your All-Access Subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="bg-amber-900/30 border-amber-700">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <AlertDescription className="text-amber-200">
                You'll lose access to all courses when your current period ends on{" "}
                {subscription && format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}
              </AlertDescription>
            </Alert>
            <p className="text-slate-300 text-sm">
              Your subscription will remain active until the end of your current billing period. You can
              resubscribe at any time.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowCancelDialog(false)}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {canceling ? "Canceling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
