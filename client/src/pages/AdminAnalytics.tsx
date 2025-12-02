import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Users, TrendingUp, AlertTriangle, CheckCircle2, Activity, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'courses'>('overview');

  const { data: metrics, isLoading: metricsLoading } = trpc.admin.getActivityMetrics.useQuery();
  const { data: studentEngagement, isLoading: engagementLoading } = trpc.admin.getStudentEngagement.useQuery();
  const { data: courseTrends, isLoading: trendsLoading } = trpc.admin.getCourseCompletionTrends.useQuery();
  
  const exportStudentEngagementMutation = trpc.admin.exportStudentEngagementCSV.useQuery(undefined, { enabled: false });
  const exportCourseCompletionMutation = trpc.admin.exportCourseCompletionCSV.useQuery(undefined, { enabled: false });
  const exportActivityMetricsMutation = trpc.admin.exportActivityMetricsCSV.useQuery(undefined, { enabled: false });
  const exportComprehensiveMutation = trpc.admin.exportComprehensiveAnalyticsCSV.useQuery(undefined, { enabled: false });
  
  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${filename}`);
  };
  
  const handleExportStudentEngagement = async () => {
    const result = await exportStudentEngagementMutation.refetch();
    if (result.data?.csv) {
      downloadCSV(result.data.csv, `student-engagement-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };
  
  const handleExportCourseCompletion = async () => {
    const result = await exportCourseCompletionMutation.refetch();
    if (result.data?.csv) {
      downloadCSV(result.data.csv, `course-completion-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };
  
  const handleExportActivityMetrics = async () => {
    const result = await exportActivityMetricsMutation.refetch();
    if (result.data?.csv) {
      downloadCSV(result.data.csv, `activity-metrics-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };
  
  const handleExportComprehensive = async () => {
    const result = await exportComprehensiveMutation.refetch();
    if (result.data?.csv) {
      downloadCSV(result.data.csv, `comprehensive-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  if (!user || user.role !== 'admin') {
    setLocation('/');
    return null;
  }

  const isLoading = metricsLoading || engagementLoading || trendsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Sort students by risk level
  const atRiskStudents = studentEngagement?.filter(s => s.isAtRisk) || [];
  const inactiveStudents = studentEngagement?.filter(s => s.isInactive) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Activity Analytics</h1>
            <p className="text-muted-foreground mt-1">Track engagement, identify at-risk students, and monitor course completion trends</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportComprehensive}
              disabled={exportComprehensiveMutation.isFetching}
            >
              <Download className="h-4 w-4 mr-2" />
              {exportComprehensiveMutation.isFetching ? 'Exporting...' : 'Export All Data'}
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === 'overview'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('students')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === 'students'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Student Engagement
          </button>
          <button
            onClick={() => setSelectedView('courses')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === 'courses'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Course Trends
          </button>
        </div>

        {/* Overview Metrics */}
        {selectedView === 'overview' && metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{metrics.activeStudents}</div>
                  <p className="text-xs text-muted-foreground">Logged in within 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inactive Students</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{metrics.inactiveStudents}</div>
                  <p className="text-xs text-muted-foreground">No login in 30+ days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{metrics.atRiskStudents}</div>
                  <p className="text-xs text-muted-foreground">Low scores or incomplete courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{metrics.averageCourseCompletion.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Across all lessons</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Quiz Score</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{metrics.averageQuizScore.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Across all quizzes</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    At-Risk Students
                  </CardTitle>
                  <CardDescription>Students with low quiz scores (&lt;60%) or low completion rates (&lt;30%)</CardDescription>
                </CardHeader>
                <CardContent>
                  {atRiskStudents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No at-risk students identified</p>
                  ) : (
                    <div className="space-y-2">
                      {atRiskStudents.slice(0, 5).map((student) => (
                        <div key={student.userId} className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                          <div>
                            <p className="text-sm font-medium">{student.userName || student.userEmail}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.averageQuizScore !== null && `Quiz: ${student.averageQuizScore.toFixed(1)}%`}
                              {student.averageQuizScore !== null && ' • '}
                              Completion: {student.completionRate.toFixed(1)}%
                            </p>
                          </div>
                          <Badge variant="destructive">At Risk</Badge>
                        </div>
                      ))}
                      {atRiskStudents.length > 5 && (
                        <button
                          onClick={() => setSelectedView('students')}
                          className="text-sm text-primary hover:underline"
                        >
                          View all {atRiskStudents.length} at-risk students →
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Inactive Students
                  </CardTitle>
                  <CardDescription>Students who haven't logged in for 30+ days</CardDescription>
                </CardHeader>
                <CardContent>
                  {inactiveStudents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">All students are active</p>
                  ) : (
                    <div className="space-y-2">
                      {inactiveStudents.slice(0, 5).map((student) => (
                        <div key={student.userId} className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                          <div>
                            <p className="text-sm font-medium">{student.userName || student.userEmail}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.daysSinceLogin !== null 
                                ? `Last login: ${student.daysSinceLogin} days ago`
                                : 'Never logged in'}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-orange-600 text-orange-600">Inactive</Badge>
                        </div>
                      ))}
                      {inactiveStudents.length > 5 && (
                        <button
                          onClick={() => setSelectedView('students')}
                          className="text-sm text-primary hover:underline"
                        >
                          View all {inactiveStudents.length} inactive students →
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Student Engagement Table */}
        {selectedView === 'students' && studentEngagement && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Engagement Details</CardTitle>
                  <CardDescription>Detailed engagement metrics for all students</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportStudentEngagement}
                  disabled={exportStudentEngagementMutation.isFetching}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportStudentEngagementMutation.isFetching ? 'Exporting...' : 'Export CSV'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Completion %</TableHead>
                      <TableHead>Avg Quiz Score</TableHead>
                      <TableHead>Quizzes Taken</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentEngagement.map((student) => (
                      <TableRow key={student.userId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.userName || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{student.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.lastLoginAt ? (
                            <div>
                              <p className="text-sm">{new Date(student.lastLoginAt).toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {student.daysSinceLogin} days ago
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>{student.enrolledCourses}</TableCell>
                        <TableCell>{student.completedCourses}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${Math.min(student.completionRate, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm">{student.completionRate.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.averageQuizScore !== null ? (
                            <span className={student.averageQuizScore < 60 ? 'text-red-600 font-semibold' : ''}>
                              {student.averageQuizScore.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{student.totalQuizzesTaken}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {student.isAtRisk && <Badge variant="destructive">At Risk</Badge>}
                            {student.isInactive && <Badge variant="outline" className="border-orange-600 text-orange-600">Inactive</Badge>}
                            {!student.isAtRisk && !student.isInactive && <Badge variant="outline" className="border-green-600 text-green-600">Active</Badge>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Completion Trends */}
        {selectedView === 'courses' && courseTrends && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Course Completion Trends
                  </CardTitle>
                  <CardDescription>Enrollment and completion statistics by course</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCourseCompletion}
                  disabled={exportCourseCompletionMutation.isFetching}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportCourseCompletionMutation.isFetching ? 'Exporting...' : 'Export CSV'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Avg Quiz Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseTrends.map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell className="font-medium">{course.courseTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.courseCode}</Badge>
                        </TableCell>
                        <TableCell>{course.totalEnrolled}</TableCell>
                        <TableCell>{course.totalCompleted}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${Math.min(course.completionRate, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{course.completionRate.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {course.averageQuizScore !== null ? (
                            <span>{course.averageQuizScore.toFixed(1)}%</span>
                          ) : (
                            <span className="text-muted-foreground">No quizzes</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
