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
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CHAPLAINCY_PRICE = 32500; // $325 in cents

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
        return_url: `${window.location.origin}/dashboard?chaplaincy=success`,
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
        {isProcessing ? "Processing..." : "Complete Enrollment - $325"}
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
    toast.success("Enrollment successful! Redirecting to your dashboard...");
    setLocation("/dashboard?chaplaincy=success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <PublicNav />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              Professional Certification Program
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Become a Certified Chaplain Assistant
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Professional chaplaincy certification with just a high school diploma. Master crisis intervention, spiritual first aid, CISM, and ethical chaplaincy practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$325</div>
                <div className="text-sm text-primary-foreground/80 line-through">Regular: $400</div>
                <div className="text-xs text-primary-foreground/70">$275 Course + $50 Background Check</div>
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
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && clientSecret && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Complete Your Enrollment</CardTitle>
              <CardDescription>Chaplaincy Training - $325</CardDescription>
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
                title: "Critical Incident Stress Management (CISM)",
                description: "Learn evidence-based techniques for managing acute stress reactions and supporting individuals after traumatic events"
              },
              {
                icon: Users,
                title: "Spiritual First Aid",
                description: "Develop skills to provide immediate spiritual and emotional support during crises and emergencies"
              },
              {
                icon: BookOpen,
                title: "Pastoral Care & Counseling",
                description: "Master one-on-one counseling and group ministry techniques in institutional settings"
              },
              {
                icon: Award,
                title: "Ethics & Confidentiality",
                description: "Understand professional ethics, legal confidentiality requirements, and appropriate professional boundaries"
              },
              {
                icon: Users,
                title: "Cultural & Interfaith Competency",
                description: "Minister effectively across diverse religious, cultural, and ethnic backgrounds with sensitivity and respect"
              },
              {
                icon: Clock,
                title: "Self-Care & Resilience",
                description: "Maintain your own spiritual and emotional health while providing compassionate care to others"
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
              "CCA (Certified Chaplain Assistant) certification pathway - high school diploma only requirement",
              "Comprehensive curriculum covering CISM, spiritual first aid, ethics, and chaplaincy practice",
              "Background check included in tuition ($50 value)",
              "Flexible online learning - study at your own pace",
              "Lifetime access to course materials and updates",
              "Certificate of completion upon finishing the program",
              "Preparation for CCA professional certification with ACCC",
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
                  <div className="text-5xl font-bold text-primary">$325</div>
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
                    <span className="text-primary">$325</span>
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

            {/* Certified Chaplain Assistant (CCA) Focus */}
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Certified Chaplain Assistant (CCA) Certification</h2>
          <p className="text-center text-lg text-muted-foreground mb-8">This program prepares you for professional CCA (Certified Chaplain Assistant) certification with the Association of Certified Christian Chaplains (ACCC). Perfect for those with a high school diploma who want to become certified chaplains.</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* CCA Requirements */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  CCA Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Education Requirement</h4>
                  <p className="text-muted-foreground mb-3">High school diploma with some college credit. No bachelor's degree required - making professional chaplaincy certification accessible to more people.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Core Competencies</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Crisis intervention and CISM</li>
                    <li>• Spiritual first aid and pastoral care</li>
                    <li>• Ethical practice and confidentiality</li>
                    <li>• Professional boundaries</li>
                    <li>• Interfaith and cultural sensitivity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* CCA Certification Pathway */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  CCA Certification Pathway
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Program Focus</h4>
                  <p className="text-muted-foreground mb-3">This course provides comprehensive training in CISM, spiritual first aid, ethics, and chaplaincy practice - all essential skills for CCA certification.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Next Steps</h4>
                  <ol className="space-y-1 text-sm text-muted-foreground">
                    <li>1. Complete this comprehensive course</li>
                    <li>2. Apply for CCA certification with ACCC</li>
                    <li>3. Pass CCA competencies exam</li>
                    <li>4. Earn your CCA credential</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CCA Professional Organizations */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">CCA Professional Organizations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  name: "ACCC",
                  full: "Association of Certified Christian Chaplains",
                  desc: "Issues CCA (Certified Chaplain Assistant) credentials for those with high school diploma"
                },
                {
                  name: "ACPE",
                  full: "Association for Clinical Pastoral Education",
                  desc: "Provides advanced CPE training for those pursuing full chaplain certification"
                }
              ].map((org, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">{org.name}</CardTitle>
                    <CardDescription className="text-xs">{org.full}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{org.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chicago Area CCA Employer Organizations */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">Chicago Area Chaplaincy Employers</h3>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              After earning your CCA certification, you can work as a Certified Chaplain Assistant at these recognized Chicago-area organizations:
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                {
                  name: "Advocate Christ Medical Center",
                  location: "Oak Lawn, IL",
                  focus: "Healthcare Chaplaincy"
                },
                {
                  name: "Northwestern Memorial Hospital",
                  location: "Chicago, IL",
                  focus: "Hospital Chaplaincy"
                },
                {
                  name: "Stroger Hospital of Cook County",
                  location: "Chicago, IL",
                  focus: "Urban Healthcare Chaplaincy"
                },
                {
                  name: "Illinois Department of Corrections",
                  location: "Multiple Locations",
                  focus: "Correctional Chaplaincy"
                },
                {
                  name: "Loyola University Medical Center",
                  location: "Maywood, IL",
                  focus: "Healthcare & Hospice Chaplaincy"
                },
                {
                  name: "Presence Resurrection Medical Center",
                  location: "Chicago, IL",
                  focus: "Hospital Chaplaincy"
                }
              ].map((org, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription>{org.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{org.focus}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Contact these organizations directly to inquire about CPE internship opportunities. Our program prepares you with the foundational knowledge needed for successful CPE training.
            </p>
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
            {createPaymentMutation.isPending ? "Loading..." : "Enroll Now for $325"} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </div>
      <Footer />
    </div>
  );
}
