import { useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function Login() {
  useEffect(() => {
    // Redirect to OAuth login
    window.location.href = getLoginUrl();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to login...</p>
    </div>
  );
}
