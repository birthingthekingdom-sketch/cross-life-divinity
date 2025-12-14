import { useState } from "react";
import { useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TuitionAgreement } from "@/components/TuitionAgreement";
import { FinanceOptionsChart } from "@/components/FinanceOptionsChart";
import { Loader2, CreditCard, Calendar } from "lucide-react";
import { toast } from "sonner";
import { PAYMENT_PLANS, PRICING } from "@shared/const";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

type PlanType = 'LEARNING_PATH' | 'BUNDLE_3_COURSE' | 'CHAPLAINCY_TRAINING';

interface CheckoutFormProps {
  planType: PlanType;
  paymentMethod: 'full' | 'plan';
  itemId?: number;
  onBack: () => void;
}

function CheckoutForm({ planType, paymentMethod, itemId, onBack }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // Navigation handled by Stripe redirect

  const createPlan = trpc.paymentPlan.createPlan.useMutation();
  const confirmPlan = trpc.paymentPlan.confirmPlan.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please accept the Tuition Assistance Agreement");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'plan') {
        // Create payment plan with Stripe subscription
        const result = await createPlan.mutateAsync({
          planType,
          bundleId: planType === 'BUNDLE_3_COURSE' ? itemId : undefined,
          learningPathId: planType === 'LEARNING_PATH' ? itemId : undefined,
        });

        // Confirm payment with Stripe
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success?planId=${result.planId}`,
          },
        });

        if (error) {
          toast.error(error.message || "Payment failed");
          setIsProcessing(false);
        }
      } else {
        // Handle full payment (existing flow)
        toast.info("Full payment flow not yet implemented");
        setIsProcessing(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
      setIsProcessing(false);
    }
  };

  const config = PAYMENT_PLANS[planType];
  const pricing = planType === 'LEARNING_PATH' ? PRICING.LEARNING_PATH :
                  planType === 'BUNDLE_3_COURSE' ? PRICING.BUNDLE_3_COURSE :
                  PRICING.CHAPLAINCY_TRAINING;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-slate-300">
            <span>Plan Type:</span>
            <span className="font-semibold text-white">{planType.replace(/_/g, ' ')}</span>
          </div>
          {paymentMethod === 'plan' ? (
            <>
              <div className="flex justify-between text-slate-300">
                <span>First Payment (Today):</span>
                <span className="font-semibold text-white">${config.monthly.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Monthly Payment:</span>
                <span className="font-semibold text-white">${config.monthly.toFixed(2)} × {config.months} months</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-slate-700">
                <span>Total:</span>
                <span>${pricing.toFixed(2)}</span>
              </div>
              <p className="text-sm text-green-400">✓ 0% Interest - No hidden fees</p>
            </>
          ) : (
            <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-slate-700">
              <span>Total Due Today:</span>
              <span>${pricing.toFixed(2)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tuition Agreement */}
      {paymentMethod === 'plan' && (
        <TuitionAgreement
          programName={planType.replace(/_/g, ' ')}
          totalAmount={pricing}
          monthlyAmount={config.monthly}
          months={config.months}
          onAcceptChange={setAgreedToTerms}
          accepted={agreedToTerms}
        />
      )}

      {/* Stripe Payment Element */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing || (paymentMethod === 'plan' && !agreedToTerms)}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              {paymentMethod === 'plan' ? `Pay First Month ($${config.monthly.toFixed(2)})` : `Pay $${pricing.toFixed(2)}`}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function PaymentPlanCheckout() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const planType = params.get('type') as PlanType;
  const itemId = params.get('itemId') ? parseInt(params.get('itemId')!) : undefined;

  const [paymentMethod, setPaymentMethod] = useState<'full' | 'plan'>('plan');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const createPlan = trpc.paymentPlan.createPlan.useMutation({
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!planType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Invalid Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">Missing plan type. Please return to the pricing page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = PAYMENT_PLANS[planType];
  const pricing = planType === 'LEARNING_PATH' ? PRICING.LEARNING_PATH :
                  planType === 'BUNDLE_3_COURSE' ? PRICING.BUNDLE_3_COURSE :
                  PRICING.CHAPLAINCY_TRAINING;

  const handleContinue = () => {
    if (paymentMethod === 'plan') {
      createPlan.mutate({
        planType,
        bundleId: planType === 'BUNDLE_3_COURSE' ? itemId : undefined,
        learningPathId: planType === 'LEARNING_PATH' ? itemId : undefined,
      });
    } else {
      // For full payment, navigate to existing checkout
      toast.info("Full payment checkout coming soon");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Complete Your Purchase
        </h1>

        {!showCheckout ? (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Choose Payment Method</CardTitle>
                <CardDescription className="text-slate-300">
                  Select how you'd like to pay for your {planType.replace(/_/g, ' ').toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'full' | 'plan')}>
                  <div className="space-y-4">
                    {/* Payment Plan Option */}
                    <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'plan' ? 'border-green-500 bg-green-900/20' : 'border-slate-700 hover:border-slate-600'
                    }`} onClick={() => setPaymentMethod('plan')}>
                      <RadioGroupItem value="plan" id="plan" className="mt-1" />
                      <Label htmlFor="plan" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-green-400" />
                          <span className="font-semibold text-white text-lg">6-Month Payment Plan</span>
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">0% Interest</span>
                        </div>
                        <p className="text-slate-300 mb-2">
                          ${config.monthly.toFixed(2)}/month for {config.months} months
                        </p>
                        <p className="text-sm text-slate-400">
                          First payment due today, then monthly. No interest, no hidden fees.
                        </p>
                      </Label>
                    </div>

                    {/* Full Payment Option */}
                    <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'full' ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 hover:border-slate-600'
                    }`} onClick={() => setPaymentMethod('full')}>
                      <RadioGroupItem value="full" id="full" className="mt-1" />
                      <Label htmlFor="full" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-white text-lg">Pay in Full</span>
                        </div>
                        <p className="text-slate-300 mb-2">
                          ${pricing.toFixed(2)} one-time payment
                        </p>
                        <p className="text-sm text-slate-400">
                          Complete your purchase today with a single payment.
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Finance Options Chart */}
            <FinanceOptionsChart />

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={createPlan.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
            >
              {createPlan.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                `Continue to Payment`
              )}
            </Button>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              planType={planType}
              paymentMethod={paymentMethod}
              itemId={itemId}
              onBack={() => setShowCheckout(false)}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
