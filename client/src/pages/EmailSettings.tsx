import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Bell, Award, Calendar, TrendingUp, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function EmailSettings() {
  const { data: preferences, isLoading } = trpc.emailNotifications.getPreferences.useQuery();
  const updateMutation = trpc.emailNotifications.updatePreferences.useMutation();

  const [settings, setSettings] = useState({
    enrollmentEmails: true,
    lessonCompletionEmails: true,
    certificateEmails: true,
    assignmentDeadlineEmails: true,
    progressSummaryEmails: true,
    forumReplyEmails: true,
  });

  useEffect(() => {
    if (preferences) {
      setSettings(preferences);
    }
  }, [preferences]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(settings);
      toast.success("Email preferences saved successfully!");
    } catch (error: any) {
      toast.error(`Failed to save preferences: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg">
        <div className="container py-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Email Notifications</h1>
          <p className="text-white/90 text-lg">Manage your email notification preferences</p>
        </div>
      </div>

      <div className="container py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Preferences
            </CardTitle>
            <CardDescription>
              Choose which email notifications you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enrollment Emails */}
            <div className="flex items-start justify-between space-x-4">
              <div className="flex items-start gap-3 flex-1">
                <Bell className="h-5 w-5 text-primary mt-1" />
                <div>
                  <Label htmlFor="enrollment" className="text-base font-semibold">
                    Enrollment Confirmation
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive a welcome email when you enroll in a new course
                  </p>
                </div>
              </div>
              <Switch
                id="enrollment"
                checked={settings.enrollmentEmails}
                onCheckedChange={() => handleToggle("enrollmentEmails")}
              />
            </div>

            <div className="border-t" />

            {/* Lesson Completion Emails */}
            <div className="flex items-start justify-between space-x-4">
              <div className="flex items-start gap-3 flex-1">
                <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <Label htmlFor="lesson" className="text-base font-semibold">
                    Lesson Completion
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified when you complete a lesson with progress updates
                  </p>
                </div>
              </div>
              <Switch
                id="lesson"
                checked={settings.lessonCompletionEmails}
                onCheckedChange={() => handleToggle("lessonCompletionEmails")}
              />
            </div>

            <div className="border-t" />

            {/* Certificate Emails */}
            <div className="flex items-start justify-between space-x-4">
              <div className="flex items-start gap-3 flex-1">
                <Award className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <Label htmlFor="certificate" className="text-base font-semibold">
                    Certificate Generation
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive an email when your course certificate is ready
                  </p>
                </div>
              </div>
              <Switch
                id="certificate"
                checked={settings.certificateEmails}
                onCheckedChange={() => handleToggle("certificateEmails")}
              />
            </div>

            <div className="border-t" />

            {/* Assignment Deadline Emails */}
            <div className="flex items-start justify-between space-x-4">
              <div className="flex items-start gap-3 flex-1">
                <Calendar className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <Label htmlFor="deadline" className="text-base font-semibold">
                    Assignment Deadlines
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get reminders about upcoming assignment due dates
                  </p>
                </div>
              </div>
              <Switch
                id="deadline"
                checked={settings.assignmentDeadlineEmails}
                onCheckedChange={() => handleToggle("assignmentDeadlineEmails")}
              />
            </div>

            <div className="border-t" />

            {/* Progress Summary Emails */}
            <div className="flex items-start justify-between space-x-4">
              <div className="flex items-start gap-3 flex-1">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <Label htmlFor="progress" className="text-base font-semibold">
                    Weekly Progress Summary
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive a weekly summary of your learning progress
                  </p>
                </div>
              </div>
              <Switch
                id="progress"
                checked={settings.progressSummaryEmails}
                onCheckedChange={() => handleToggle("progressSummaryEmails")}
              />
            </div>

            <div className="border-t" />

            {/* Forum Reply Emails */}
            <div className="flex items-start justify-between space-x-4">
              <div className="flex items-start gap-3 flex-1">
                <MessageSquare className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <Label htmlFor="forum" className="text-base font-semibold">
                    Forum Replies
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified when someone replies to your forum topics
                  </p>
                </div>
              </div>
              <Switch
                id="forum"
                checked={settings.forumReplyEmails}
                onCheckedChange={() => handleToggle("forumReplyEmails")}
              />
            </div>

            <div className="border-t pt-6">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="w-full"
              >
                {updateMutation.isPending ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">About Email Notifications</p>
                <p>
                  We'll send emails to the address associated with your account. You can
                  update your preferences at any time. Important account and security
                  notifications will always be sent regardless of your preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
