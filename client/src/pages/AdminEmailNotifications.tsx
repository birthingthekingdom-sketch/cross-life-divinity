import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Mail, Send, AlertCircle, CheckCircle2, Clock, RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminEmailNotifications() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = trpc.admin.getEmailStats.useQuery();
  const { data: notifications, isLoading: notificationsLoading, refetch } = trpc.admin.getEmailNotifications.useQuery({
    status: selectedType as any,
  });
  const retryMutation = trpc.admin.retryFailedEmail.useMutation({
    onSuccess: () => {
      toast.success("Email retry initiated");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to retry: ${error.message}`);
    },
  });

  if (!user || user.role !== 'admin') {
    setLocation('/');
    return null;
  }

  const isLoading = statsLoading || notificationsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading email notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Sent</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      enrollment: "bg-blue-500",
      lesson_completion: "bg-green-500",
      certificate: "bg-yellow-500",
      assignment_deadline: "bg-orange-500",
      progress_summary: "bg-purple-500",
      forum_reply: "bg-pink-500",
    };
    return <Badge className={colors[type] || "bg-gray-500"}>{type.replace(/_/g, " ")}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Email Notifications</h1>
            <p className="text-muted-foreground mt-1">Monitor email delivery and retry failed sends</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Send className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.sent || 0}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.pending || 0}</div>
              <p className="text-xs text-muted-foreground">Queued for sending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.failed || 0}</div>
              <p className="text-xs text-muted-foreground">Delivery failures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.sent && stats?.sent + stats?.failed > 0
                  ? Math.round((stats.sent / (stats.sent + stats.failed)) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Delivery success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            onClick={() => setSelectedType(null)}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={selectedType === "sent" ? "default" : "outline"}
            onClick={() => setSelectedType("sent")}
            size="sm"
          >
            Sent
          </Button>
          <Button
            variant={selectedType === "pending" ? "default" : "outline"}
            onClick={() => setSelectedType("pending")}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={selectedType === "failed" ? "default" : "outline"}
            onClick={() => setSelectedType("failed")}
            size="sm"
          >
            Failed
          </Button>
        </div>

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Recent email notifications and their delivery status</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications && notifications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notif: any) => (
                      <TableRow key={notif.id}>
                        <TableCell>{getTypeBadge(notif.type)}</TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{notif.subject}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{notif.userEmail}</TableCell>
                        <TableCell>{getStatusBadge(notif.status)}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {notif.sentAt ? new Date(notif.sentAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {notif.status === "failed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryMutation.mutate({ id: notif.id })}
                              disabled={retryMutation.isPending}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No email notifications found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
