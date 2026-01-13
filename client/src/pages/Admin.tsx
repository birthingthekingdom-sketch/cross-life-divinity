import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { BookOpen, Code, Edit, GraduationCap, Key, Loader2, Mail, Plus, Settings, Users, Video, BarChart3, FileCheck, AlertCircle, CheckCircle2, Clock, DollarSign, MessageCircle } from "lucide-react";
import AssignCoursesDialog from "@/components/AssignCoursesDialog";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Admin() {
  const { user } = useAuth();
  const [newAccessCode, setNewAccessCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAccessCode, setSelectedAccessCode] = useState<{ id: number; code: string } | null>(null);

  const { data: courses } = trpc.courses.listAll.useQuery();
  const { data: accessCodes, refetch: refetchAccessCodes } = trpc.admin.getAccessCodes.useQuery();
  const { data: allFollowUps } = trpc.admin.getAllFollowUps.useQuery();
  
  // Calculate follow-up metrics
  const now = new Date();
  const pendingFollowUps = allFollowUps?.filter(f => f.status === 'pending') || [];
  const overdueFollowUps = pendingFollowUps.filter(f => f.dueDate && new Date(f.dueDate) < now);
  const completedThisWeek = allFollowUps?.filter(f => {
    if (f.status !== 'completed' || !f.completedAt) return false;
    const completedDate = new Date(f.completedAt);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return completedDate >= weekAgo;
  }) || [];

  const createAccessCodeMutation = trpc.admin.createAccessCode.useMutation({
    onSuccess: () => {
      toast.success("Access code created successfully!");
      setNewAccessCode("");
      setIsDialogOpen(false);
      refetchAccessCodes();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create access code");
    },
  });

  const toggleAccessCodeMutation = trpc.admin.toggleAccessCode.useMutation({
    onSuccess: () => {
      toast.success("Access code updated!");
      refetchAccessCodes();
    },
  });

  const handleCreateAccessCode = () => {
    if (!newAccessCode.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    createAccessCodeMutation.mutate({ code: newAccessCode.trim().toUpperCase() });
  };

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage courses, lessons, and student access
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/admin/bulk-import">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5" />
                  Bulk Import Lessons
                </CardTitle>
                <CardDescription>
                  Upload multiple lessons at once via CSV
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/email-config">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure SMTP server for email notifications
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/email-export">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  Export Student Emails
                </CardTitle>
                <CardDescription>
                  Download student emails for marketing campaigns
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/chat">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5" />
                  Chat Dashboard
                </CardTitle>
                <CardDescription>
                  View and respond to student inquiries
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/follow-ups">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Student Follow-Ups
                </CardTitle>
                <CardDescription>
                  Track and manage student engagement
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/webinars">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Video className="h-5 w-5" />
                  Webinar Management
                </CardTitle>
                <CardDescription>
                  Schedule and manage live online sessions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5" />
                  Student Analytics
                </CardTitle>
                <CardDescription>
                  Track engagement and identify at-risk students
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/grading">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileCheck className="h-5 w-5" />
                  Assignment Grading
                </CardTitle>
                <CardDescription>
                  Review and grade student assignment submissions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/revenue">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Revenue & Payments
                </CardTitle>
                <CardDescription>
                  Monitor subscriptions, purchases, and revenue metrics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/bundles">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Course Bundles
                </CardTitle>
                <CardDescription>
                  Manage thematic course groupings and collections
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/learning-paths">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5" />
                  Learning Paths
                </CardTitle>
                <CardDescription>
                  Create and manage structured course sequences
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active courses in the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Access Codes</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accessCodes?.filter(ac => ac.isActive).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Active access codes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses?.reduce((sum, c) => sum + c.totalLessons, 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Follow-Ups Summary Widget */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Follow-Ups
                </CardTitle>
                <CardDescription>
                  Track student engagement and pending actions
                </CardDescription>
              </div>
              <Link href="/admin/follow-ups">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingFollowUps.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="p-2 bg-red-500 rounded-full">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overdueFollowUps.length}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="p-2 bg-green-500 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedThisWeek.length}</p>
                  <p className="text-sm text-muted-foreground">Completed This Week</p>
                </div>
              </div>
            </div>
            
            {overdueFollowUps.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  ⚠️ You have {overdueFollowUps.length} overdue follow-up{overdueFollowUps.length !== 1 ? 's' : ''} that need attention
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access Codes Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Access Codes</CardTitle>
                <CardDescription>
                  Manage student enrollment access codes
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Access Code</DialogTitle>
                    <DialogDescription>
                      Create a new access code for student enrollment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Access Code</Label>
                      <Input
                        id="code"
                        placeholder="e.g., CLSD2024"
                        value={newAccessCode}
                        onChange={(e) => setNewAccessCode(e.target.value.toUpperCase())}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCreateAccessCode}
                      disabled={createAccessCodeMutation.isPending}
                    >
                      {createAccessCodeMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Code"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessCodes?.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono font-semibold">{code.code}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          code.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {code.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(code.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAccessCode({ id: code.id, code: code.code });
                            setAssignDialogOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Assign Courses
                        </Button>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`toggle-${code.id}`} className="text-sm">
                            {code.isActive ? "Deactivate" : "Activate"}
                          </Label>
                          <Switch
                            id={`toggle-${code.id}`}
                            checked={code.isActive}
                            onCheckedChange={(checked) =>
                              toggleAccessCodeMutation.mutate({
                                id: code.id,
                                isActive: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Courses List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  View and manage course content
                </CardDescription>
              </div>
              <Link href="/admin/bulk-import">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Bulk Import Lessons
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses?.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: course.colorTheme }}
                    >
                      {course.code.substring(3)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.code} • {course.totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/course/${course.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                    <Link href={`/course/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 justify-start" disabled>
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">View Students</div>
                  <div className="text-xs text-muted-foreground">Coming soon</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start" disabled>
                <Code className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Edit Course Content</div>
                  <div className="text-xs text-muted-foreground">Coming soon</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Assignment Dialog */}
      {selectedAccessCode && (
        <AssignCoursesDialog
          accessCodeId={selectedAccessCode.id}
          accessCode={selectedAccessCode.code}
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          onSuccess={refetchAccessCodes}
        />
      )}
    </DashboardLayout>
  );
}
