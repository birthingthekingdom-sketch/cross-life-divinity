import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { GraduationCap, Loader2 } from "lucide-react";
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
      if (enrollmentStatus?.enrolled) {
        setLocation("/dashboard");
      } else {
        setLocation("/enroll");
      }
    }
  }, [loading, isAuthenticated, enrollmentStatus, enrollmentLoading, setLocation]);

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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center text-white">
        <div className="mb-8 inline-block bg-white/10 backdrop-blur-sm p-6 rounded-full">
          <GraduationCap className="h-20 w-20" />
        </div>
        
        <h1 className="text-5xl font-bold mb-4">
          Cross Life School of Divinity
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
          Deepen your faith and expand your theological knowledge through our comprehensive online learning platform.
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>Evangelism & Outreach Strategies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>Prayer & Intercession Principles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>Church History & Traditions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>Spiritual Gifts & Ministry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>Christian Apologetics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>Discipleship & Mentoring</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>Worship & Liturgy</span>
            </li>
          </ul>
        </div>

        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
          onClick={() => window.location.href = getLoginUrl()}
        >
          Sign In to Get Started
        </Button>

        <p className="mt-6 text-sm text-white/70">
          You'll need an access code from your administrator to enroll
        </p>
      </div>
    </div>
  );
}
