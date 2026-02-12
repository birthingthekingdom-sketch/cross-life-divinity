import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";

export default function PaymentCancel() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-slate-800/50 border-amber-700 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-amber-900/30 p-4">
              <XCircle className="w-16 h-16 text-amber-400" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white">Payment Cancelled</CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            Your payment was not completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-6 space-y-4">
            <p className="text-slate-300">
              Don't worry - no charges have been made to your account. You can try again whenever you're ready.
            </p>
            
            <div className="pt-4 border-t border-amber-700/50">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Need Help?
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Make sure your payment information is correct</li>
                <li>• Check that your card has sufficient funds</li>
                <li>• Try a different payment method</li>
                <li>• Contact support if you continue to experience issues</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            onClick={() => navigate("/pricing")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
