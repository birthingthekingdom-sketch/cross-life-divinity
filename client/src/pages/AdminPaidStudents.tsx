import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { format } from 'date-fns';
import { Search, Download, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function AdminPaidStudents() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Protect admin page
  useEffect(() => {
    if (user && user.role !== 'admin') {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  // Fetch all enrolled students
  const { data: students = [], isLoading } = trpc.admin.getEnrolledStudents.useQuery();

  // Filter students by search and payment status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Determine if student is "paid" - has paid for courses or has active enrollments
    const isPaid = student.enrollmentCount && student.enrollmentCount > 0;

    if (filterStatus === 'all') return matchesSearch && isPaid;
    if (filterStatus === 'active') return matchesSearch && isPaid && student.lastActivityAt;
    if (filterStatus === 'inactive') return matchesSearch && isPaid && !student.lastActivityAt;

    return matchesSearch;
  });

  // Calculate statistics
  const totalPaidStudents = students.filter((s) => s.enrollmentCount && s.enrollmentCount > 0).length;
  const activeStudents = filteredStudents.filter((s) => s.lastActivityAt).length;
  const totalRevenue = students.reduce((sum, s) => sum + (s.totalSpent || 0), 0);

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Enrollments', 'Status', 'Last Activity', 'Joined Date'],
      ...filteredStudents.map((s) => [
        s.name || '',
        s.email || '',
        s.enrollmentCount || 0,
        s.lastActivityAt ? 'Active' : 'Inactive',
        s.lastActivityAt ? format(new Date(s.lastActivityAt), 'MMM dd, yyyy') : 'Never',
        format(new Date(s.createdAt), 'MMM dd, yyyy'),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paid-students-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paid Students</h1>
            <p className="text-muted-foreground">Track students with active enrollments and payments</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPaidStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">With active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">From paid students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPaidStudents > 0 ? (students.reduce((sum, s) => sum + (s.enrollmentCount || 0), 0) / totalPaidStudents).toFixed(1) : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per student</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Paid Students List</CardTitle>
            <CardDescription>
              Showing {filteredStudents.length} of {totalPaidStudents} paid students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No paid students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.enrollmentCount || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          {student.lastActivityAt ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {student.lastActivityAt ? format(new Date(student.lastActivityAt), 'MMM dd, yyyy') : 'Never'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(student.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
