import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';
import { ChevronRight, Search, Download, Filter } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminStudents() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  // Fetch all enrolled students
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['admin', 'enrolledStudents'],
    queryFn: async () => {
      const result = await trpc.admin.getEnrolledStudents.query();
      return result || [];
    },
  });

  // Fetch selected student's enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['admin', 'studentEnrollments', selectedStudent],
    queryFn: async () => {
      if (!selectedStudent) return [];
      const result = await trpc.admin.getStudentEnrollments.query({ studentId: selectedStudent });
      return result || [];
    },
    enabled: !!selectedStudent,
  });

  // Fetch selected course progress
  const { data: courseProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['admin', 'studentProgress', selectedStudent, selectedCourse],
    queryFn: async () => {
      if (!selectedStudent || !selectedCourse) return null;
      const result = await trpc.admin.getStudentProgress.query({
        studentId: selectedStudent,
        courseId: selectedCourse,
      });
      return result;
    },
    enabled: !!selectedStudent && !!selectedCourse,
  });

  // Filter students by search term
  const filteredStudents = students.filter(
    (student) =>
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Monitoring</h1>
          <p className="text-gray-600 mt-2">Track student enrollments and course progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Students</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {studentsLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No students found</div>
                ) : (
                  filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => {
                        setSelectedStudent(student.id);
                        setSelectedCourse(null);
                      }}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedStudent === student.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{student.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600 truncate">{student.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {student.enrollmentCount} course{student.enrollmentCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {selectedStudent === student.id && <ChevronRight size={18} className="text-blue-500 mt-1" />}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{selectedStudentData?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedStudentData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Enrolled Courses</p>
                      <p className="font-medium text-gray-900">{selectedStudentData?.enrollmentCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Enrollment Date</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudentData?.createdAt
                          ? format(new Date(selectedStudentData.createdAt), 'MMM dd, yyyy')
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Signed In</p>
                      <p className="font-medium text-gray-900">
                        {selectedStudentData?.lastSignedIn
                          ? format(new Date(selectedStudentData.lastSignedIn), 'MMM dd, yyyy HH:mm')
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enrollments */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollments</h3>
                  {enrollmentsLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading enrollments...</div>
                  ) : enrollments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No course enrollments found</div>
                  ) : (
                    <div className="space-y-2">
                      {enrollments.map((enrollment: any) => (
                        <button
                          key={enrollment.enrollment.id}
                          onClick={() => setSelectedCourse(enrollment.course.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedCourse === enrollment.course.id
                              ? 'bg-blue-50 border-blue-300'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{enrollment.course.title}</p>
                              <p className="text-sm text-gray-600">
                                Enrolled: {format(new Date(enrollment.enrollment.enrolledAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <ChevronRight size={18} className="text-gray-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Course Progress */}
                {selectedCourse && courseProgress && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700">Overall Progress</p>
                          <p className="text-sm font-bold text-gray-900">{courseProgress.progressPercentage}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${courseProgress.progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {courseProgress.completedLessons} of {courseProgress.totalLessons} lessons completed
                        </p>
                      </div>

                      {/* Lesson Breakdown */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Lesson Completion</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {courseProgress.lessons.map((lesson: any, idx: number) => (
                            <div key={lesson.lesson.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    lesson.completed ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                >
                                  {lesson.completed && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{lesson.lesson.title}</p>
                                  {lesson.completedAt && (
                                    <p className="text-xs text-gray-600">
                                      Completed: {format(new Date(lesson.completedAt), 'MMM dd, yyyy')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">Select a student to view their enrollment and progress details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
