import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Enroll() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [accessCode, setAccessCode] = useState("");
  
  const enrollMutation = trpc.auth.enroll.useMutation({
    onSuccess: (data) => {
      if (data.alreadyEnrolled) {
        toast.success("You're already enrolled!");
      } else {
        toast.success("Successfully enrolled! Welcome to Cross Life School of Divinity.");
      }
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid access code. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    enrollMutation.mutate({ accessCode: accessCode.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Cross Life School of Divinity</CardTitle>
            <CardDescription className="text-base mt-2">
              Enter your access code to begin your theological education
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode" className="text-sm font-semibold">
                Access Code
              </Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-semibold tracking-wider"
                disabled={enrollMutation.isPending}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              <strong className="text-foreground">Welcome, {user?.name || "Student"}!</strong>
              <br />
              Please enter the access code provided by your administrator to access the course materials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
