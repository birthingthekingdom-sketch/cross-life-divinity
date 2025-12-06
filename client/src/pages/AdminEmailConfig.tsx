import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Send, Settings, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminEmailConfig() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: config, isLoading } = trpc.admin.getEmailConfig.useQuery();
  const saveConfigMutation = trpc.admin.setEmailConfig.useMutation();
  const testEmailMutation = trpc.admin.testEmail.useMutation();

  const [formData, setFormData] = useState({
    host: "",
    port: "587",
    secure: false,
    user: "",
    pass: "",
  });

  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    if (config) {
      setFormData({
        host: config.host || "",
        port: String(config.port || 587),
        secure: config.secure || false,
        user: config.user || "",
        pass: "", // Don't populate password for security
      });
    }
  }, [config]);

  if (!user || user.role !== 'admin') {
    setLocation('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      await saveConfigMutation.mutateAsync({
        host: formData.host,
        port: parseInt(formData.port),
        secure: formData.secure,
        user: formData.user,
        pass: formData.pass,
      });
      toast.success("Email configuration saved successfully!");
    } catch (error: any) {
      toast.error(`Failed to save configuration: ${error.message}`);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    try {
      await testEmailMutation.mutateAsync({ to: testEmail });
      toast.success(`Test email sent to ${testEmail}!`);
    } catch (error: any) {
      toast.error(`Failed to send test email: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading configuration...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Configuration</h1>
          <p className="text-muted-foreground mt-1">Configure SMTP settings for automated email notifications</p>
        </div>

        <div className="grid gap-6 max-w-3xl">
          {/* SMTP Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SMTP Server Settings
              </CardTitle>
              <CardDescription>
                Configure your email server for sending automated notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">SMTP Host</Label>
                  <Input
                    id="host"
                    name="host"
                    placeholder="smtp.gmail.com"
                    value={formData.host}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    e.g., smtp.gmail.com, smtp.sendgrid.net
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    name="port"
                    type="number"
                    placeholder="587"
                    value={formData.port}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Usually 587 (TLS) or 465 (SSL)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user">Email Address</Label>
                <Input
                  id="user"
                  name="user"
                  type="email"
                  placeholder="your-email@gmail.com"
                  value={formData.user}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  The email address that will send notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pass">Password / App Password</Label>
                <Input
                  id="pass"
                  name="pass"
                  type="password"
                  placeholder="Enter password or app-specific password"
                  value={formData.pass}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  For Gmail, use an App Password (not your regular password)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="secure"
                  name="secure"
                  checked={formData.secure}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="secure" className="cursor-pointer">
                  Use SSL (port 465)
                </Label>
              </div>

              <Button
                onClick={handleSave}
                disabled={saveConfigMutation.isPending}
                className="w-full"
              >
                {saveConfigMutation.isPending ? "Saving..." : "Save Configuration"}
              </Button>
            </CardContent>
          </Card>

          {/* Test Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Test Email Configuration
              </CardTitle>
              <CardDescription>
                Send a test email to verify your SMTP settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={handleTestEmail}
                disabled={testEmailMutation.isPending || !formData.host || !formData.user}
                variant="outline"
                className="w-full"
              >
                {testEmailMutation.isPending ? "Sending..." : "Send Test Email"}
              </Button>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Mail className="h-5 w-5" />
                Gmail Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-blue-900 dark:text-blue-300">
              <p className="font-semibold">To use Gmail for sending emails:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to your Google Account settings</li>
                <li>Enable 2-Step Verification if not already enabled</li>
                <li>Go to Security → App passwords</li>
                <li>Generate a new app password for "Mail"</li>
                <li>Use that 16-character password in the Password field above</li>
                <li>Set Host to: smtp.gmail.com</li>
                <li>Set Port to: 587</li>
                <li>Leave SSL unchecked (use TLS)</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
