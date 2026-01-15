import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Eye, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

/**
 * Bridge Academy Students Admin Page
 * Review student enrollments, progress, and completion status
 */

interface StudentEnrollment {
  id: number;
  name: string;
  email: string;
  enrollmentDate: string;
  subscriptionStatus: 'active' | 'cancelled' | 'failed';
  coursesEnrolled: number;
  coursesCompleted: number;
  overallProgress: number;
  averageScore: number;
  lastActivityDate: string;
}

const mockStudents: StudentEnrollment[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    enrollmentDate: '2025-12-15',
    subscriptionStatus: 'active',
    coursesEnrolled: 3,
    coursesCompleted: 1,
    overallProgress: 35,
    averageScore: 78,
    lastActivityDate: '2025-12-30',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    enrollmentDate: '2025-12-18',
    subscriptionStatus: 'active',
    coursesEnrolled: 2,
    coursesCompleted: 0,
    overallProgress: 15,
    averageScore: 0,
    lastActivityDate: '2025-12-28',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    enrollmentDate: '2025-12-10',
    subscriptionStatus: 'cancelled',
    coursesEnrolled: 1,
    coursesCompleted: 0,
    overallProgress: 5,
    averageScore: 0,
    lastActivityDate: '2025-12-20',
  },
];

export default function AdminBridgeAcademyStudents() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || student.subscriptionStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Bridge Academy Students
          </h1>
          <p className="text-muted-foreground mt-1">Monitor student progress and engagement</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStudents.length}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockStudents.filter(s => s.subscriptionStatus === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Paying customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On Trial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockStudents.filter(s => false).length}
              </div>
              <p className="text-xs text-muted-foreground">Free access for all students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  mockStudents.reduce((sum, s) => sum + s.overallProgress, 0) / mockStudents.length
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed Payment</option>
          </select>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollments</CardTitle>
            <CardDescription>View and manage student accounts and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Free Access</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead className="text-right">Courses</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                    <TableHead className="text-right">Avg Score</TableHead>
                    <TableHead className="text-right">Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-sm">{student.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            true
                              ? 'default'
                              : false
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.subscriptionStatus === 'active'
                              ? 'default'
                              : student.subscriptionStatus === 'failed'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {student.subscriptionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {student.coursesCompleted}/{student.coursesEnrolled}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${student.overallProgress}%` }}
                            />
                          </div>
                          <span className="text-sm">{student.overallProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {student.averageScore > 0 ? (
                          <span className="font-semibold">{student.averageScore}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {new Date(student.lastActivityDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{student.name}</DialogTitle>
                                <DialogDescription>{student.email}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Enrollment Date</p>
                                    <p className="font-semibold">{student.enrollmentDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Free Access</p>
                                    <Badge></Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Subscription</p>
                                    <Badge>{student.subscriptionStatus}</Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Last Active</p>
                                    <p className="font-semibold">{student.lastActivityDate}</p>
                                  </div>
                                </div>

                                <div className="pt-4 border-t">
                                  <h4 className="font-semibold mb-3">Course Progress</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm">Mathematical Reasoning</span>
                                      <span className="text-sm font-semibold">45%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button variant="outline" className="flex-1">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
