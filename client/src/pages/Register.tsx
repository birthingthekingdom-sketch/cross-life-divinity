import { useEffect } from "react";
import { getLoginUrl } from "@/const";

export default function Register() {
  useEffect(() => {
    // Extract courseId from URL if present
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');
    
    // Store courseId in sessionStorage so it persists through OAuth redirect
    if (courseId) {
      sessionStorage.setItem('enrollmentCourseId', courseId);
    }
    
    // Redirect to OAuth login for registration
    window.location.href = getLoginUrl();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to sign up...</p>
    </div>
  );
}
