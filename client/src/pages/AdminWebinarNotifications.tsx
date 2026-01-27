import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminWebinarNotifications() {
  const { toast } = useToast();
  const [webinarId, setWebinarId] = useState<number | null>(null);
  const [recordingUrl, setRecordingUrl] = useState("");

  // Fetch webinars
  const webinarsQuery = trpc.webinars.listWebinars.useQuery();
  const webinars = webinarsQuery.data || [];

  // Fetch notification history
  const historyQuery = trpc.webinarNotifications.getNotificationHistory.useQuery(
    { webinarId: webinarId || 0 },
    { enabled: !!webinarId }
  );
  const history = historyQuery.data || [];

  // Fetch notification stats
  const statsQuery = trpc.webinarNotifications.getNotificationStats.useQuery(
    { webinarId: webinarId || 0 },
    { enabled: !!webinarId }
  );
  const stats = statsQuery.data;

  // Mutations
  const scheduleRemindersMutation = trpc.webinarNotifications.scheduleReminders.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Sent ${data.successCount} reminders (${data.failureCount} failed)`,
      });
      historyQuery.refetch();
      statsQuery.refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const sendRecordingNotificationsMutation = trpc.webinarNotifications.sendRecordingNotifications.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Sent ${data.successCount} recording notifications (${data.failureCount} failed)`,
      });
      setRecordingUrl("");
      historyQuery.refetch();
      statsQuery.refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const retryFailedMutation = trpc.webinarNotifications.retryFailedNotifications.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Retried ${data.retriedCount} notifications (${data.successCount} now sent)`,
      });
      historyQuery.refetch();
      statsQuery.refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleScheduleReminders = () => {
    if (!webinarId) {
      toast({ title: "Error", description: "Please select a webinar", variant: "destructive" });
      return;
    }
    scheduleRemindersMutation.mutate({ webinarId });
  };

  const handleSendRecordingNotifications = () => {
    if (!webinarId) {
      toast({ title: "Error", description: "Please select a webinar", variant: "destructive" });
      return;
    }
    if (!recordingUrl) {
      toast({ title: "Error", description: "Please enter a recording URL", variant: "destructive" });
      return;
    }
    sendRecordingNotificationsMutation.mutate({ webinarId, recordingUrl });
  };

  const handleRetryFailed = () => {
    if (!webinarId) {
      toast({ title: "Error", description: "Please select a webinar", variant: "destructive" });
      return;
    }
    retryFailedMutation.mutate({ webinarId });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Webinar Notifications</h1>
        <p className="text-gray-600">Manage email notifications for webinars</p>
      </div>

      {/* Webinar Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Webinar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webinars.map((webinar) => (
              <button
                key={webinar.id}
                onClick={() => setWebinarId(webinar.id)}
                className={`p-4 text-left border-2 rounded-lg transition ${
                  webinarId === webinar.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold">{webinar.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(webinar.scheduledAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.successRate}%</p>
              </div>
            </div>

            {/* Breakdown by Type */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">24h Reminders</p>
                <p className="text-xl font-bold">{stats.byType.reminder_24h}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">1h Reminders</p>
                <p className="text-xl font-bold">{stats.byType.reminder_1h}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Recording Available</p>
                <p className="text-xl font-bold">{stats.byType.recording_available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {webinarId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Send 24-Hour Reminders
              </CardTitle>
              <CardDescription>Notify all registered students 24 hours before webinar</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleScheduleReminders}
                disabled={scheduleRemindersMutation.isPending}
                className="w-full"
              >
                {scheduleRemindersMutation.isPending ? "Sending..." : "Send Reminders"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Send Recording Notifications
              </CardTitle>
              <CardDescription>Notify students that recording is available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="url"
                placeholder="Enter recording URL"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <Button
                onClick={handleSendRecordingNotifications}
                disabled={sendRecordingNotificationsMutation.isPending || !recordingUrl}
                className="w-full"
              >
                {sendRecordingNotificationsMutation.isPending ? "Sending..." : "Send Recording Link"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Failed Notifications */}
      {stats && stats.failed > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <CardTitle>Failed Notifications</CardTitle>
              </div>
              <Badge variant="destructive">{stats.failed}</Badge>
            </div>
            <CardDescription>Some notifications failed to send. You can retry them.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleRetryFailed}
              disabled={retryFailedMutation.isPending}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Failed Notifications
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notification History */}
      {webinarId && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>Recent notifications for this webinar</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => historyQuery.refetch()}
                disabled={historyQuery.isLoading}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Student</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Sent At</th>
                      <th className="text-left p-2">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((notification: any) => (
                      <tr key={notification.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <p className="font-semibold">{notification.userName || "N/A"}</p>
                            <p className="text-xs text-gray-600">{notification.userEmail}</p>
                          </div>
                        </td>
                        <td className="p-2 text-xs">
                          <Badge variant="outline">{notification.notificationType}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              notification.status === "sent"
                                ? "default"
                                : notification.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {notification.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-xs">
                          {notification.sentAt ? new Date(notification.sentAt).toLocaleString() : "-"}
                        </td>
                        <td className="p-2 text-xs text-red-600">
                          {notification.failureReason || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">No notifications sent yet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
