import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Award, Users, BookOpen, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CHAPLAINCY_PRICE = 27500; // $275 in cents

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?type=chaplaincy`,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full" size="lg">
        {isProcessing ? "Processing..." : "Complete Enrollment - $275"}
      </Button>
    </form>
  );
}

export default function ChaplaincyTraining() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createPaymentMutation = trpc.chaplaincy.createPaymentIntent.useMutation({
    onSuccess: (data: any) => {
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to initialize payment");
    },
  });

  const handleEnrollClick = () => {
    if (!user) {
      setLocation("/login?redirect=/chaplaincy-training");
      return;
    }
    createPaymentMutation.mutate();
  };

  const handlePaymentSuccess = () => {
    toast.success("Enrollment successful! Check your email for next steps.");
    setTimeout(() => {
      setLocation("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="text-center md:text-left">
            <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              Professional Certification Program
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Chaplaincy Training & Certification
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Become a certified chaplain and serve in hospitals, military, correctional facilities, and corporate settings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$275</div>
                <div className="text-sm text-primary-foreground/80 line-through">Regular: $400</div>
                <div className="text-xs text-primary-foreground/70">Includes $50 background check</div>
              </div>
              <Button 
                size="lg" 
                onClick={handleEnrollClick}
                disabled={createPaymentMutation.isPending}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                {createPaymentMutation.isPending ? "Loading..." : "Enroll Now"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/chaplain-promo.png" 
              alt="Chaplaincy Training Certification" 
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && clientSecret && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Complete Your Enrollment</CardTitle>
              <CardDescription>Chaplaincy Training - $275</CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
              </Elements>
              <Button 
                variant="ghost" 
                onClick={() => setShowCheckout(false)}
                className="w-full mt-4"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container py-16 space-y-16">
        {/* What You'll Learn */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Crisis Intervention",
                description: "Learn to provide emotional and spiritual support during emergencies and traumatic events"
              },
              {
                icon: Users,
                title: "Pastoral Care",
                description: "Develop skills for one-on-one counseling and group ministry in institutional settings"
              },
              {
                icon: BookOpen,
                title: "Theological Foundations",
                description: "Build a strong theological framework for multi-faith chaplaincy work"
              },
              {
                icon: Award,
                title: "Ethics & Boundaries",
                description: "Understand professional ethics, confidentiality, and appropriate boundaries"
              },
              {
                icon: Users,
                title: "Cultural Competency",
                description: "Minister effectively across diverse religious, cultural, and ethnic backgrounds"
              },
              {
                icon: Clock,
                title: "Self-Care Practices",
                description: "Maintain your own spiritual and emotional health while serving others"
              }
            ].map((item, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Career Opportunities */}
        <section className="bg-accent/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Career Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Healthcare Chaplain",
                description: "Serve in hospitals, hospices, and long-term care facilities providing spiritual care to patients and families",
                settings: ["Hospitals", "Hospice Centers", "Nursing Homes"]
              },
              {
                title: "Military Chaplain",
                description: "Support service members and their families through deployments, transitions, and life challenges",
                settings: ["Armed Forces", "VA Hospitals", "Military Bases"]
              },
              {
                title: "Correctional Chaplain",
                description: "Minister to inmates and staff in prisons and jails, facilitating rehabilitation and spiritual growth",
                settings: ["Prisons", "Jails", "Juvenile Facilities"]
              },
              {
                title: "Corporate Chaplain",
                description: "Provide confidential support to employees in workplace settings, addressing personal and professional challenges",
                settings: ["Corporations", "Industrial Sites", "Business Parks"]
              }
            ].map((career, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{career.title}</CardTitle>
                  <CardDescription>{career.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-muted-foreground">Common Settings:</div>
                    <div className="flex flex-wrap gap-2">
                      {career.settings.map((setting, i) => (
                        <Badge key={i} variant="secondary">{setting}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Program Benefits */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Program Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "CPD-accredited certification recognized by chaplaincy organizations",
              "Comprehensive curriculum covering all aspects of chaplaincy ministry",
              "Background check included in tuition ($50 value)",
              "Flexible online learning - study at your own pace",
              "Lifetime access to course materials and updates",
              "Certificate of completion upon finishing the program",
              "Preparation for professional chaplaincy endorsement",
              "Ongoing support from experienced chaplaincy instructors"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Special Enrollment Pricing</h2>
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <div className="text-5xl font-bold text-primary">$275</div>
                </div>
                <CardDescription className="text-lg">
                  <span className="line-through text-muted-foreground">Regular: $400</span>
                  <span className="ml-2 text-green-600 font-semibold">Save $125!</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span>Chaplaincy Training Course</span>
                    <span className="font-semibold">$350</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Background Check Fee</span>
                    <span className="font-semibold">$50</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Special Price (All Inclusive)</span>
                    <span className="text-primary">$275</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleEnrollClick}
                  disabled={createPaymentMutation.isPending}
                  className="w-full"
                >
                  {createPaymentMutation.isPending ? "Loading..." : "Enroll Now"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  One-time payment • Lifetime access • Certificate included
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-accent/5">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">What Our Graduates Say</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Hear from certified chaplains who have completed our program
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">"</div>
                  <p className="text-muted-foreground mb-6 italic">
                    This program prepared me for real-world chaplaincy in ways I never expected. The practical training and biblical foundation gave me confidence to serve in a hospital setting.
                  </p>
                  <div>
                    <p className="font-semibold">Rev. Michael Thompson</p>
                    <p className="text-sm text-muted-foreground">Hospital Chaplain, Chicago</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">"</div>
                  <p className="text-muted-foreground mb-6 italic">
                    The flexibility of online learning allowed me to complete the program while serving full-time in ministry. The certification opened doors I didn't know existed.
                  </p>
                  <div>
                    <p className="font-semibold">Pastor Sarah Williams</p>
                    <p className="text-sm text-muted-foreground">Correctional Facility Chaplain</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">"</div>
                  <p className="text-muted-foreground mb-6 italic">
                    Outstanding program! The instructors are experienced chaplains who provide real-world insights. I'm now serving as a military chaplain thanks to this training.
                  </p>
                  <div>
                    <p className="font-semibold">Chaplain David Martinez</p>
                    <p className="text-sm text-muted-foreground">U.S. Military Chaplain</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Is this certification recognized?",
                a: "Yes, this program is CPD-accredited and recognized by major chaplaincy organizations. Upon completion, you'll receive a certificate that can be used for professional chaplaincy endorsement."
              },
              {
                q: "What's included in the background check?",
                a: "The $50 background check fee covers a comprehensive criminal background screening required for chaplaincy work in most institutional settings. Instructions will be provided after enrollment."
              },
              {
                q: "How long does the program take?",
                a: "The program is self-paced, typically taking 3-6 months to complete depending on your schedule. You have lifetime access to all materials."
              },
              {
                q: "Do I need prior ministry experience?",
                a: "While ministry experience is helpful, it's not required. The program is designed for both experienced ministers and those new to chaplaincy work."
              },
              {
                q: "Can I get a refund?",
                a: "We offer a 30-day money-back guarantee. If you're not satisfied with the program within the first 30 days, contact us for a full refund."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Chaplaincy Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of certified chaplains serving in hospitals, military, correctional facilities, and corporate settings
          </p>
          <Button 
            size="lg" 
            onClick={handleEnrollClick}
            disabled={createPaymentMutation.isPending}
            className="text-lg px-8 py-6"
          >
            {createPaymentMutation.isPending ? "Loading..." : "Enroll Now for $275"} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </div>
    </div>
  );
}
