import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Search, Users, BarChart3, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminCourseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const { data: courses, isLoading, refetch } = trpc.admin.getAllCoursesWithStats.useQuery();
  const { data: courseEnrollments } = trpc.admin.getCourseEnrollments.useQuery(
    { courseId: selectedCourse! },
    { enabled: selectedCourse !== null }
  );

  const toggleCourseMutation = trpc.admin.toggleCourseStatus.useMutation({
    onSuccess: () => {
      toast.success("Course status updated");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update course status");
    },
  });

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter(course =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleToggleCourse = (courseId: number, currentStatus: boolean) => {
    toggleCourseMutation.mutate({ courseId, isActive: !currentStatus });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Course Management
        </h1>
        <p className="text-gray-600 mt-2">Manage courses, view enrollment numbers, and monitor student progress</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by course name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
          <CardDescription>Click on a course to view detailed enrollment information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No courses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="text-center">Enrollments</TableHead>
                    <TableHead className="text-center">Lessons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course: any) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.courseCode}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          <Users className="h-3 w-3" />
                          {course.enrollmentCount || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{course.totalLessons || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={course.isActive !== false}
                            onCheckedChange={() =>
                              handleToggleCourse(course.id, course.isActive !== false)
                            }
                            disabled={toggleCourseMutation.isPending}
                          />
                          <span className="text-sm">
                            {course.isActive !== false ? "Active" : "Disabled"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCourse(course.id)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Details Dialog */}
      <Dialog open={selectedCourse !== null} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Enrollment Details</DialogTitle>
            <DialogDescription>View all students enrolled in this course and their progress</DialogDescription>
          </DialogHeader>

          {courseEnrollments && courseEnrollments.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Total Enrolled</p>
                      <p className="text-3xl font-bold text-blue-600">{courseEnrollments.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Avg Progress</p>
                      <p className="text-3xl font-bold text-green-600">
                        {Math.round(
                          courseEnrollments.reduce((sum: number, e: any) => sum + (e.progressPercentage || 0), 0) /
                            courseEnrollments.length
                        )}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Completed</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {courseEnrollments.filter((e: any) => e.progressPercentage === 100).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Progress</TableHead>
                      <TableHead className="text-center">Lessons Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseEnrollments.map((enrollment: any) => (
                      <TableRow key={enrollment.userId}>
                        <TableCell className="font-medium">{enrollment.userName || "N/A"}</TableCell>
                        <TableCell>{enrollment.userEmail}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${enrollment.progressPercentage || 0}%` }}
                              />
                            </div>
                            <span className="font-semibold text-sm min-w-[40px]">
                              {enrollment.progressPercentage || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {enrollment.completedLessons || 0}/{enrollment.totalLessons || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No students enrolled in this course yet</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
