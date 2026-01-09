import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Link } from "wouter";

export default function Admin() {
  // All hooks must be at the top, before any conditional logic
  const { user } = useAuth();
  const [, setLocation] = useLocation();
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

  // Protect admin page - only admins can access (useEffect after all hooks)
  useEffect(() => {
    if (user && user.role !== 'admin') {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  // Show loading or redirect state
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleCreateAccessCode = () => {
    if (!newAccessCode.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    createAccessCodeMutation.mutate({ code: newAccessCode });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage courses, access codes, and student progress</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Access Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accessCodes?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Available codes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingFollowUps.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueFollowUps.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

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

        {/* Access Codes Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                <div>
                  <CardTitle>Access Codes</CardTitle>
                  <CardDescription>Manage course enrollment access codes</CardDescription>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Access Code</DialogTitle>
                    <DialogDescription>
                      Generate a new access code for course enrollment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="code">Access Code</Label>
                      <Input
                        id="code"
                        placeholder="e.g., SPRING2024"
                        value={newAccessCode}
                        onChange={(e) => setNewAccessCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCreateAccessCode}
                      disabled={createAccessCodeMutation.isPending}
                    >
                      {createAccessCodeMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Create
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessCodes?.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono">{code.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {code.isActive ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(code.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={code.isActive}
                          onCheckedChange={() =>
                            toggleAccessCodeMutation.mutate({ codeId: code.id })
                          }
                          disabled={toggleAccessCodeMutation.isPending}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAccessCode(code) || setAssignDialogOpen(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Assign Courses Dialog */}
        {selectedAccessCode && (
          <AssignCoursesDialog
            accessCodeId={selectedAccessCode.id}
            accessCode={selectedAccessCode.code}
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            onSuccess={refetchAccessCodes}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
