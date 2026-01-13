'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Edit, Eye, Plus, Search, Trash2, CheckCircle2, Clock, Users, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

/**
 * Bridge Academy Courses Admin Page
 * Review, edit, and manage all GED courses and topics
 */

interface BridgeAcademyCourseData {
  id: number;
  code: string;
  title: string;
  description: string | null;
  colorTheme: string;
  totalLessons: number;
  topics: Array<{
    id: number;
    title: string;
    topicOrder: number;
    quizQuestions: number;
    practiceQuestions: number;
    totalQuestions: number;
  }>;
  totalQuizQuestions: number;
  totalPracticeQuestions: number;
}

export default function AdminBridgeAcademyCourses() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<BridgeAcademyCourseData | null>(null);
  const [courses, setCourses] = useState<BridgeAcademyCourseData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Bridge Academy courses
  const { data: bridgeAcademyCourses, isLoading, error } = trpc.admin.getBridgeAcademyCourses.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  useEffect(() => {
    if (bridgeAcademyCourses) {
      setCourses(bridgeAcademyCourses);
      setLoading(false);
    }
  }, [bridgeAcademyCourses]);

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalLessons = courses.reduce((sum, c) => sum + c.totalLessons, 0);
  const totalQuizQuestions = courses.reduce((sum, c) => sum + c.totalQuizQuestions, 0);
  const totalPracticeQuestions = courses.reduce((sum, c) => sum + c.totalPracticeQuestions, 0);

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
            <p className="text-muted-foreground mt-1">Manage and review all GED courses and topics</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalQuizQuestions}</div>
              <p className="text-xs text-muted-foreground">10+ per topic</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Practice Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalPracticeQuestions}</div>
              <p className="text-xs text-muted-foreground">50+ per topic</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">GED Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{courses.length}</div>
              <p className="text-xs text-muted-foreground">Math, RLA, Science, Social Studies</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses or topics..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Table */}
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading courses...</span>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Bridge Academy Courses</CardTitle>
              <CardDescription>{filteredCourses.length} courses found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-center">Topics</TableHead>
                      <TableHead className="text-center">Quiz Q's</TableHead>
                      <TableHead className="text-center">Practice Q's</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No courses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCourses.map((course) => (
                        <TableRow key={course.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">{course.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{course.code}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium">{course.totalLessons}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium text-blue-600">{course.totalQuizQuestions}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium text-green-600">{course.totalPracticeQuestions}</span>
                          </TableCell>
                          <TableCell className="text-right">
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
                              {selectedCourse?.id === course.id && (
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>{selectedCourse.title}</DialogTitle>
                                    <DialogDescription>{selectedCourse.description}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold mb-3">Topics</h3>
                                      <div className="space-y-2">
                                        {selectedCourse.topics.map((topic) => (
                                          <div key={topic.id} className="p-3 border rounded-lg">
                                            <div className="font-medium">{topic.title}</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                              {topic.quizQuestions} quiz questions • {topic.practiceQuestions} practice questions
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              )}
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
