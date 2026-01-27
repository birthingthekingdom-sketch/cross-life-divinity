import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Logout() {
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Clear any local state
      window.location.href = "/";
    },
    onError: () => {
      // Even on error, redirect to home
      window.location.href = "/";
    },
  });

  useEffect(() => {
    logoutMutation.mutate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-white/90 text-lg">Logging out...</p>
      </div>
    </div>
  );
}
