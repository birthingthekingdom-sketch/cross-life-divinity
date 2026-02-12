import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

/**
 * Bridge Academy Analytics Admin Page
 * Performance metrics, completion rates, and student insights
 */

export default function AdminBridgeAcademyAnalytics() {
  const { user } = useAuth();

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Bridge Academy Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Performance metrics and student insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">68%</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Quiz Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76</div>
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-xs text-muted-foreground">FREE with enrollment</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Subject */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Subject</CardTitle>
            <CardDescription>Average completion rates and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: 'Mathematical Reasoning', completion: 72, score: 78, students: 45 },
                { subject: 'Reasoning Through Language Arts', completion: 68, score: 75, students: 42 },
                { subject: 'Science', completion: 65, score: 74, students: 38 },
                { subject: 'Social Studies', completion: 62, score: 72, students: 31 },
              ].map(item => (
                <div key={item.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">{item.students} students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{item.completion}% completion</p>
                      <p className="text-xs text-muted-foreground">Avg score: {item.score}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Completion</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.completion}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(item.score / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trial to Paid Conversion</CardTitle>
              <CardDescription>7-day trial conversion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Trials Started</span>
                    <span className="text-sm font-bold">156</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Converted to Paid</span>
                    <span className="text-sm font-bold">124</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '79%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Conversion Rate</span>
                    <Badge className="bg-green-100 text-green-800">79.5%</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Strong conversion indicates effective trial experience and course value
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Health</CardTitle>
              <CardDescription>Subscription and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Active Subscriptions</span>
                  <Badge className="bg-green-100 text-green-800">124</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Failed Payments</span>
                  <Badge className="bg-red-100 text-red-800">8</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Cancelled</span>
                  <Badge className="bg-gray-100 text-gray-800">24</Badge>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Monthly Revenue</span>
                    <span className="font-bold">$2,356</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Churn Rate</span>
                    <span className="font-bold text-red-600">15.4%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* At-Risk Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              At-Risk Students
            </CardTitle>
            <CardDescription>Students with low engagement or failed payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Michael Brown', reason: 'No activity for 10 days', status: 'inactive' },
                { name: 'Emily Davis', reason: 'Payment failed 3 times', status: 'payment_failed' },
                { name: 'James Wilson', reason: 'Low quiz scores (avg 45)', status: 'low_performance' },
              ].map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.reason}</p>
                  </div>
                  <Badge
                    variant={
                      student.status === 'payment_failed'
                        ? 'destructive'
                        : student.status === 'low_performance'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {student.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
