import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, Mail, Users } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminEmailExport() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  
  const { data: courses } = trpc.courses.listAll.useQuery();
  const { data: emailData, isLoading } = trpc.admin.getStudentEmails.useQuery({
    filterType,
    courseId: selectedCourseId ? parseInt(selectedCourseId) : undefined
  });

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
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

  const handleExportCSV = () => {
    if (!emailData || emailData.length === 0) {
      toast.error("No email data to export");
      return;
    }

    // Create CSV content
    const headers = ["Name", "Email", "Enrollment Date", "Enrolled Courses"];
    const rows = emailData.map((student: any) => [
      student.name || "N/A",
      student.email,
      new Date(student.enrolledAt).toLocaleDateString(),
      student.courseCount || 0
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `student-emails-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${emailData.length} student emails`);
  };

  const handleCopyEmails = () => {
    if (!emailData || emailData.length === 0) {
      toast.error("No emails to copy");
      return;
    }

    const emails = emailData.map((s: any) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success(`Copied ${emailData.length} emails to clipboard`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Email Export</h1>
          <p className="text-muted-foreground mt-1">
            Export student emails for marketing and announcements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{emailData?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Filter Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold capitalize">
                {filterType === "all" ? "All Students" : filterType === "course" ? "By Course" : "Active Only"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ready to Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{emailData?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
            <CardDescription>
              Select which students to include in the export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="active">Active Students Only</SelectItem>
                    <SelectItem value="course">By Course</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filterType === "course" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Course</label>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course: any) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Export Actions</CardTitle>
            <CardDescription>
              Download or copy student emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleExportCSV} 
              disabled={isLoading || !emailData || emailData.length === 0}
              className="w-full md:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            
            <Button 
              onClick={handleCopyEmails} 
              variant="outline"
              disabled={isLoading || !emailData || emailData.length === 0}
              className="w-full md:w-auto ml-0 md:ml-2"
            >
              <Mail className="h-4 w-4 mr-2" />
              Copy Emails to Clipboard
            </Button>

            {emailData && emailData.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {emailData.length} student email{emailData.length !== 1 ? 's' : ''} ready to export
              </p>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        {emailData && emailData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
              <CardDescription>
                First 10 students in the export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emailData.slice(0, 10).map((student: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{student.name || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {student.courseCount || 0} course{student.courseCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
                {emailData.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    ... and {emailData.length - 10} more
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
