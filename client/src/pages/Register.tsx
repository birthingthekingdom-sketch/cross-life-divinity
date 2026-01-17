import { useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function Register() {
  useEffect(() => {
    // Redirect to OAuth login for registration
    window.location.href = getLoginUrl();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to sign up...</p>
    </div>
  );
}
