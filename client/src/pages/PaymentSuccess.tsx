import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, Award, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [paymentType, setPaymentType] = useState<"subscription" | "course" | null>(null);

  useEffect(() => {
    // Get payment type from URL params
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    
    if (type === "subscription" || type === "course") {
      setPaymentType(type);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-slate-800/50 border-green-700 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-900/30 p-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white">Payment Successful!</CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            {paymentType === "subscription"
              ? "Your All-Access Subscription is now active"
              : "Your course purchase is complete"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentType === "subscription" ? (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-green-400" />
                What's Next?
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>You now have unlimited access to all 10+ courses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Start learning immediately - all courses are unlocked</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Earn CPD certificates for every course you complete</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Access live webinars and priority support</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-green-700/50">
                <p className="text-sm text-slate-400">
                  A confirmation email has been sent to your registered email address with your subscription details.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                What's Next?
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Your course is now available in your dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Start learning at your own pace with lifetime access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Complete all lessons and quizzes to earn your CPD certificate</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Join the discussion forums to connect with other students</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-blue-700/50">
                <p className="text-sm text-slate-400">
                  A confirmation email has been sent to your registered email address with your purchase receipt.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
          {paymentType === "course" && (
            <Button
              onClick={() => navigate("/courses")}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              size="lg"
            >
              Browse More Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
