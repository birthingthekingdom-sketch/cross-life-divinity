import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, Mail, Calendar, BookOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminStudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const { data: students, isLoading } = trpc.admin.getAllStudents.useQuery();
  const { data: studentDetails } = trpc.admin.getStudentDetails.useQuery(
    { studentId: selectedStudent! },
    { enabled: selectedStudent !== null }
  );

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(student =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Student Management
        </h1>
        <p className="text-gray-600 mt-2">View and manage all student accounts and their course progress</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
          <CardDescription>Click on a student to view detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Signed In</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name || "N/A"}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{format(new Date(student.createdAt), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(student.lastSignedIn), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStudent(student.id)}
                        >
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

      {/* Student Details Dialog */}
      <Dialog open={selectedStudent !== null} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View student information and course progress</DialogDescription>
          </DialogHeader>

          {studentDetails && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">{studentDetails.student?.name || "N/A"}</span>
                </div>
                <div className="text-sm text-gray-600">{studentDetails.student?.email}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Joined {format(new Date(studentDetails.student?.createdAt || ""), "MMM dd, yyyy")}
                </div>
              </div>

              {/* Enrolled Courses */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4" />
                  Enrolled Courses ({studentDetails.enrollments?.length || 0})
                </h3>
                {studentDetails.enrollments && studentDetails.enrollments.length > 0 ? (
                  <div className="space-y-2">
                    {studentDetails.enrollments.map((enrollment: any) => {
                      const progress = studentDetails.progress?.find(
                        (p: any) => p.courseId === enrollment.courseId
                      );
                      return (
                        <div key={enrollment.courseId} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{enrollment.courseName}</p>
                              <p className="text-sm text-gray-500">{enrollment.courseCode}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">
                                {progress?.progressPercentage || 0}%
                              </p>
                              <p className="text-sm text-gray-500">
                                {progress?.completedLessons || 0}/{progress?.totalLessons || 0} lessons
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress?.progressPercentage || 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Enrolled: {format(new Date(enrollment.enrolledAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No courses enrolled</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
