import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function AdminEmailSettings() {
  const [, navigate] = useLocation();
  const { data: emailConfig, refetch } = trpc.admin.getEmailConfig.useQuery();
  
  const [host, setHost] = useState("smtp.gmail.com");
  const [port, setPort] = useState(587);
  const [secure, setSecure] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const setEmailConfigMutation = trpc.admin.setEmailConfig.useMutation({
    onSuccess: () => {
      toast.success("Email configuration saved!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save configuration");
    },
  });

  const testEmailMutation = trpc.admin.testEmail.useMutation({
    onSuccess: () => {
      toast.success("Test email sent successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send test email");
    },
  });

  const handleSaveConfig = () => {
    if (!host || !port || !user || !pass) {
      toast.error("Please fill in all fields");
      return;
    }

    setEmailConfigMutation.mutate({
      host,
      port,
      secure,
      user,
      pass
    });
  };

  const handleTestEmail = () => {
    if (!testEmail) {
      toast.error("Please enter an email address");
      return;
    }

    testEmailMutation.mutate({ to: testEmail });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">Email Settings</h1>
          <p className="text-muted-foreground">
            Configure email automation for student notifications
          </p>
        </div>

        {emailConfig?.configured && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Mail className="h-5 w-5" />
                <span className="font-semibold">Email is configured and ready</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                Sending from: {emailConfig.user}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Gmail SMTP Configuration</CardTitle>
            <CardDescription>
              Enter your Gmail credentials to enable automated emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📧 Gmail Setup Instructions
              </h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                <li>Go to your Google Account settings</li>
                <li>Enable 2-Step Verification if not already enabled</li>
                <li>Go to Security → App Passwords</li>
                <li>Generate a new app password for "Mail"</li>
                <li>Use that 16-character password below (not your regular Gmail password)</li>
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP Host</Label>
                <Input
                  id="host"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={port}
                  onChange={(e) => setPort(parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="secure"
                checked={secure}
                onCheckedChange={setSecure}
              />
              <Label htmlFor="secure">
                Use SSL/TLS (enable for port 465, disable for port 587)
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">Gmail Address</Label>
              <Input
                id="user"
                type="email"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="your-email@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass">Gmail App Password</Label>
              <Input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="16-character app password"
              />
              <p className="text-xs text-muted-foreground">
                This is NOT your regular Gmail password. Use the app password generated in Google Account settings.
              </p>
            </div>

            <Button
              onClick={handleSaveConfig}
              disabled={setEmailConfigMutation.isPending}
              className="w-full"
            >
              {setEmailConfigMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {emailConfig?.configured && (
          <Card>
            <CardHeader>
              <CardTitle>Test Email</CardTitle>
              <CardDescription>
                Send a test email to verify your configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Recipient Email</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <Button
                onClick={handleTestEmail}
                disabled={testEmailMutation.isPending}
                variant="outline"
              >
                {testEmailMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
