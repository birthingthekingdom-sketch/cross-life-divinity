import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, DollarSign, CheckCircle2 } from "lucide-react";
import { PAYMENT_PLANS, PRICING } from "@shared/const";
import { toast } from "sonner";

type PlanType = 'LEARNING_PATH' | 'BUNDLE_3_COURSE' | 'CHAPLAINCY_TRAINING';

export function PaymentPlanCheckout() {
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const rawType = params.get('type');
  
  // Map URL parameter to internal type
  const planType = (rawType === 'BUNDLE' ? 'BUNDLE_3_COURSE' : rawType) as PlanType;
  const itemId = params.get('itemId') ? parseInt(params.get('itemId')!) : undefined;
  
  const [paymentMethod, setPaymentMethod] = useState<'payment_plan' | 'full_payment'>('payment_plan');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get selected course IDs from sessionStorage for bundle purchases
  const selectedCourseIds = planType === 'BUNDLE_3_COURSE' 
    ? JSON.parse(sessionStorage.getItem('selectedCourseIds') || '[]')
    : [];

  const createCheckoutSession = trpc.paymentPlan.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      console.log('✅ Checkout session created:', data);
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
        setIsProcessing(false);
      }
    },
    onError: (error) => {
      console.error('❌ Checkout session creation failed:', error);
      toast.error(error.message || "Failed to create checkout session");
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (!planType || !['LEARNING_PATH', 'BUNDLE_3_COURSE', 'CHAPLAINCY_TRAINING'].includes(planType)) {
      navigate("/pricing");
    }
  }, [planType, navigate]);

  if (!planType) {
    return null;
  }

  const planConfig = PAYMENT_PLANS[planType];
  const pricing = planType === 'LEARNING_PATH' ? PRICING.LEARNING_PATH :
                  planType === 'BUNDLE_3_COURSE' ? PRICING.BUNDLE_3_COURSE :
                  PRICING.CHAPLAINCY_TRAINING;
  
  // Convert cents to dollars and format - EXPLICIT CONVERSION
  const monthlyCents = planConfig?.monthly || 0;
  const monthlyPrice = Number((monthlyCents / 100).toFixed(2));
  const monthlyPriceDisplay = `${monthlyPrice.toFixed(2)}`;
  
  console.log('💰 Payment Plan Debug:', {
    planType,
    planConfig,
    monthlyCents,
    monthlyPrice,
    monthlyPriceDisplay
  });

  const handleContinueToPayment = () => {
    console.log('🔵 handleContinueToPayment called');
    console.log('Payment method:', paymentMethod);
    console.log('Plan type:', planType);
    console.log('Item ID:', itemId);
    console.log('Selected course IDs:', selectedCourseIds);
    
    setIsProcessing(true);

    // Prepare input based on plan type
    const input: any = {
      planType,
      paymentMethod,
    };

    // Add item IDs based on plan type
    if (planType === 'BUNDLE_3_COURSE') {
      input.bundleId = itemId;
      // Only add selectedCourseIds if they exist (optional for bundle)
      if (selectedCourseIds && selectedCourseIds.length > 0) {
        input.selectedCourseIds = selectedCourseIds;
      }
    } else if (planType === 'LEARNING_PATH') {
      input.learningPathId = itemId;
    }

    console.log('Creating checkout session with input:', input);

    // Create Stripe Checkout Session
    createCheckoutSession.mutate(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Complete Your Purchase
        </h1>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                {planType === 'LEARNING_PATH' && 'Learning Path'}
                {planType === 'BUNDLE_3_COURSE' && '3-Course Bundle'}
                {planType === 'CHAPLAINCY_TRAINING' && 'Chaplaincy Training'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                Choose your payment option
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-white">
                <span className="text-lg">Total Price:</span>
                <span className="text-2xl font-bold">${pricing}</span>
              </div>
              {planType === 'BUNDLE_3_COURSE' && selectedCourseIds.length > 0 && (
                <div className="text-sm text-gray-300">
                  <p className="font-semibold mb-1">Selected Courses:</p>
                  <p>{selectedCourseIds.length} courses selected</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                {/* Payment Plan Option */}
                <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-white/20 hover:border-blue-400 transition-colors cursor-pointer bg-white/5 mb-4">
                  <RadioGroupItem value="payment_plan" id="payment_plan" className="mt-1" />
                  <Label htmlFor="payment_plan" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-semibold text-lg">
                        Payment Plan - ${monthlyPriceDisplay}/month
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {planConfig.months} monthly payments • 0% interest
                    </p>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>No credit check required</span>
                    </div>
                  </Label>
                </div>

                {/* Full Payment Option */}
                <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-white/20 hover:border-blue-400 transition-colors cursor-pointer bg-white/5">
                  <RadioGroupItem value="full_payment" id="full_payment" className="mt-1" />
                  <Label htmlFor="full_payment" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-white font-semibold text-lg">
                        Pay in Full - ${pricing}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      One-time payment • Immediate access
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinueToPayment}
              disabled={isProcessing}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  Continue to Payment
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center text-gray-300 text-sm">
            <p>🔒 Secure payment powered by Stripe</p>
            <p className="mt-2">Your payment information is encrypted and secure</p>
            <p className="mt-2 text-xs">You will be redirected to Stripe's secure checkout page</p>
          </div>
        </div>
      </div>
    </div>
  );
}
