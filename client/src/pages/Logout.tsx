import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Logout() {
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem("manus-runtime-user-info");
      // Redirect to home page with a small delay to ensure cookies are cleared
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    },
    onError: () => {
      // Even on error, clear local storage and redirect to home
      localStorage.removeItem("manus-runtime-user-info");
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    },
  });

  useEffect(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-white/90 text-lg">Logging out...</p>
      </div>
    </div>
  );
}
