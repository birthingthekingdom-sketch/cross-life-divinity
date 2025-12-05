import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { GraduationCap, Loader2, Check, BookOpen, Award, Users } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: enrollmentStatus, isLoading: enrollmentLoading } = trpc.auth.checkEnrollment.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (!loading && isAuthenticated && !enrollmentLoading) {
      // Redirect admins to admin panel
      if (user?.role === 'admin') {
        setLocation("/admin");
      } else if (enrollmentStatus?.enrolled) {
        setLocation("/dashboard");
      } else {
        setLocation("/enroll");
      }
    }
  }, [loading, isAuthenticated, user, enrollmentStatus, enrollmentLoading, setLocation]);

  if (loading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/90">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Promotional Image */}
      <section className="relative h-[600px] overflow-hidden">
        <img 
          src="/promo-hero.png" 
          alt="Study Theology at Your Own Pace" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Transform Your Ministry Through Biblical Excellence
              </h1>
              <p className="text-xl text-white/90 mb-8">
                CPD-accredited courses designed for ministry leaders. Study at your own pace with expert instruction.
              </p>
              <div className="flex gap-4">
                <Link href="/pricing">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">
                    View Pricing
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Highlight Section */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/promo-pricing.png" 
                alt="$49/Month All-Access Subscription" 
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">All-Access Subscription</h2>
              <div className="text-5xl font-bold text-accent mb-4">$49<span className="text-2xl text-muted-foreground">/month</span></div>
              <p className="text-xl text-muted-foreground mb-6">
                Get unlimited access to all 14 seminary-quality courses with one affordable subscription
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Unlimited access to all courses and lessons</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">CPD-accredited certificates upon completion</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">New courses added regularly</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Study at your own pace, anytime, anywhere</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Cross Life School of Divinity?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-block bg-accent/10 p-4 rounded-full mb-4">
                <BookOpen className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Seminary-Quality Education</h3>
              <p className="text-muted-foreground">
                Comprehensive courses developed by experienced theologians and ministry leaders
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block bg-accent/10 p-4 rounded-full mb-4">
                <Award className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">CPD Accredited</h3>
              <p className="text-muted-foreground">
                Earn recognized certificates that demonstrate your commitment to professional development
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block bg-accent/10 p-4 rounded-full mb-4">
                <Users className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Join Thousands of Leaders</h3>
              <p className="text-muted-foreground">
                Connect with a global community of ministry leaders pursuing excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join ministry leaders worldwide who are deepening their faith and expanding their impact
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/70">
            Start with individual courses at $89 each or subscribe for unlimited access at $49/month
          </p>
        </div>
      </section>
    </div>
  );
}
