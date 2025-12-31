import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Edit, Eye, Plus, Search, Trash2, CheckCircle2, Clock, Users } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';

/**
 * Bridge Academy Courses Admin Page
 * Review, edit, and manage all 12 GED lessons
 */

interface BridgeAcademyCourse {
  id: number;
  title: string;
  subject: 'Mathematical Reasoning' | 'Reasoning Through Language Arts' | 'Science' | 'Social Studies';
  lessonNumber: number;
  status: 'draft' | 'published' | 'archived';
  estimatedMinutes: number;
  enrolledStudents: number;
  completionRate: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

const mockCourses: BridgeAcademyCourse[] = [
  {
    id: 1,
    title: 'Fundamentals & Basic Operations',
    subject: 'Mathematical Reasoning',
    lessonNumber: 1,
    status: 'published',
    estimatedMinutes: 45,
    enrolledStudents: 24,
    completionRate: 85,
    averageScore: 78,
    createdAt: '2025-12-15',
    updatedAt: '2025-12-30',
  },
  {
    id: 2,
    title: 'Algebra & Equations',
    subject: 'Mathematical Reasoning',
    lessonNumber: 2,
    status: 'published',
    estimatedMinutes: 50,
    enrolledStudents: 22,
    completionRate: 72,
    averageScore: 75,
    createdAt: '2025-12-16',
    updatedAt: '2025-12-30',
  },
  {
    id: 3,
    title: 'Geometry & Problem Solving',
    subject: 'Mathematical Reasoning',
    lessonNumber: 3,
    status: 'draft',
    estimatedMinutes: 55,
    enrolledStudents: 0,
    completionRate: 0,
    averageScore: 0,
    createdAt: '2025-12-17',
    updatedAt: '2025-12-30',
  },
];

export default function AdminBridgeAcademyCourses() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<BridgeAcademyCourse | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to access this page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || course.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['Mathematical Reasoning', 'Reasoning Through Language Arts', 'Science', 'Social Studies'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Bridge Academy Courses
            </h1>
            <p className="text-muted-foreground mt-1">Manage and review all 12 GED lessons</p>
          </div>
          <Link href="/admin/bridge-academy/create-course">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Lesson
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 subjects × 3 lessons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockCourses.filter(c => c.status === 'published').length}
              </div>
              <p className="text-xs text-muted-foreground">Ready for students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockCourses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  mockCourses.filter(c => c.status === 'published').reduce((sum, c) => sum + c.completionRate, 0) /
                    mockCourses.filter(c => c.status === 'published').length
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Across all lessons</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Course Catalog</CardTitle>
            <CardDescription>Review and manage all Bridge Academy lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                    <TableHead className="text-right">Completion</TableHead>
                    <TableHead className="text-right">Avg Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === 'published'
                              ? 'default'
                              : course.status === 'draft'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{course.estimatedMinutes} min</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {course.enrolledStudents}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {course.completionRate > 0 ? (
                            <>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${course.completionRate}%` }}
                                />
                              </div>
                              <span className="text-sm">{course.completionRate}%</span>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {course.enrolledStudents > 0 ? (
                          <span className="font-semibold">{course.averageScore}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCourse(course)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{course.title}</DialogTitle>
                                <DialogDescription>{course.subject}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Subject</p>
                                    <p className="font-semibold">{course.subject}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge>{course.status}</Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-semibold">{course.estimatedMinutes} minutes</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Enrolled Students</p>
                                    <p className="font-semibold">{course.enrolledStudents}</p>
                                  </div>
                                </div>
                                <div className="pt-4 border-t">
                                  <p className="text-sm font-semibold mb-2">Preview Content</p>
                                  <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                                    [Lesson content preview would appear here]
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Link href={`/admin/bridge-academy/edit-course/${course.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>

                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
