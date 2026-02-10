import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "oauth">("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      setLocation("/");
    },
    onError: (error) => {
      setError(error.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
    },
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    loginMutation.mutate({ email, password });
  };

  const handleOAuthLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cross Life School of Divinity
          </h1>
          <p className="text-gray-600">Access Your Courses</p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setLoginMethod("email");
              setError("");
            }}
            className={`flex-1 pb-3 font-medium transition-colors ${
              loginMethod === "email"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Email/Password
          </button>
          <button
            onClick={() => {
              setLoginMethod("oauth");
              setError("");
            }}
            className={`flex-1 pb-3 font-medium transition-colors ${
              loginMethod === "oauth"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            OAuth
          </button>
        </div>

        {/* Email/Password Login */}
        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {isLoading ? "Logging in..." : "Sign in with Email"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Use your existing account credentials to access your purchased courses.
            </p>
          </form>
        )}

        {/* OAuth Login */}
        {loginMethod === "oauth" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Sign in with your Manus account
            </p>
            <Button
              onClick={handleOAuthLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Sign in with Manus OAuth
            </Button>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Having trouble logging in?
            <br />
            Contact: studio6817@yahoo.com
            <br />
            Phone: (312) 300-3295
          </p>
        </div>
      </Card>
    </div>
  );
}
