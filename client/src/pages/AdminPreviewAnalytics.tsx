import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminPreviewAnalytics() {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Fetch dashboard data
  const dashboardQuery = trpc.previewAnalytics.getPreviewAnalyticsDashboard.useQuery();
  const dashboard = dashboardQuery.data;

  // Fetch course-specific analytics
  const courseAnalyticsQuery = trpc.previewAnalytics.getCoursePreviewAnalytics.useQuery(
    { courseId: selectedCourseId || 0 },
    { enabled: !!selectedCourseId }
  );
  const courseAnalytics = courseAnalyticsQuery.data;

  // Fetch conversion funnel
  const funnelQuery = trpc.previewAnalytics.getConversionFunnel.useQuery();
  const funnel = funnelQuery.data;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Preview Analytics</h1>
        <p className="text-gray-600">Track preview engagement and conversion metrics</p>
      </div>

      {/* Overview Stats */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Preview Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalPreviewEvents}</div>
              <p className="text-xs text-gray-600">All preview interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalConversions}</div>
              <p className="text-xs text-gray-600">Preview → Enrollment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.overallConversionRate}%</div>
              <p className="text-xs text-gray-600">Overall rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Courses Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalCourses}</div>
              <p className="text-xs text-gray-600">Active courses</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conversion Funnel */}
      {funnel && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Preview engagement to enrollment flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Previews</span>
                    <span className="text-sm font-bold">{funnel.totalPreviews}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 flex items-center px-3">
                    <div className="text-white text-sm font-semibold">100%</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Unique Previews</span>
                    <span className="text-sm font-bold">{funnel.uniquePreviews}</span>
                  </div>
                  <div
                    className="bg-blue-500 rounded-full h-8 flex items-center px-3"
                    style={{
                      width: `${funnel.totalPreviews > 0 ? (funnel.uniquePreviews / funnel.totalPreviews) * 100 : 0}%`,
                    }}
                  >
                    <div className="text-white text-sm font-semibold">
                      {funnel.totalPreviews > 0 ? Math.round((funnel.uniquePreviews / funnel.totalPreviews) * 100) : 0}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Conversions</span>
                    <span className="text-sm font-bold">{funnel.totalConversions}</span>
                  </div>
                  <div
                    className="bg-green-500 rounded-full h-8 flex items-center px-3"
                    style={{
                      width: `${funnel.uniquePreviews > 0 ? (funnel.totalConversions / funnel.uniquePreviews) * 100 : 0}%`,
                    }}
                  >
                    <div className="text-white text-sm font-semibold">
                      {funnel.uniquePreviews > 0
                        ? Math.round((funnel.totalConversions / funnel.uniquePreviews) * 100)
                        : 0}
                      %
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600">Course Views</p>
                  <p className="text-xl font-bold">{funnel.eventBreakdown.views}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quiz Attempts</p>
                  <p className="text-xl font-bold">{funnel.eventBreakdown.quizAttempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lesson Views</p>
                  <p className="text-xl font-bold">{funnel.eventBreakdown.lessonViews}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Study Guides</p>
                  <p className="text-xl font-bold">{funnel.eventBreakdown.studyGuideDownloads}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course-by-Course Breakdown */}
      {dashboard && (
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Preview metrics by course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.courseMetrics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Course</th>
                        <th className="text-right p-2">Views</th>
                        <th className="text-right p-2">Quiz Attempts</th>
                        <th className="text-right p-2">Conversions</th>
                        <th className="text-right p-2">Conversion Rate</th>
                        <th className="text-right p-2">Avg Time (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.courseMetrics.map((metric: any) => (
                        <tr
                          key={metric.courseId}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedCourseId(metric.courseId)}
                        >
                          <td className="p-2">
                            <button className="text-blue-600 hover:underline">Course {metric.courseId}</button>
                          </td>
                          <td className="text-right p-2 font-semibold">{metric.views}</td>
                          <td className="text-right p-2">{metric.quizAttempts}</td>
                          <td className="text-right p-2 font-semibold">{metric.conversions || 0}</td>
                          <td className="text-right p-2">
                            <Badge variant={metric.conversionRate > 10 ? "default" : "secondary"}>
                              {metric.conversionRate}%
                            </Badge>
                          </td>
                          <td className="text-right p-2">{metric.avgTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">No preview data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course-Specific Analytics */}
      {selectedCourseId && courseAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Course {selectedCourseId} - Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{courseAnalytics.totalViews}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quiz Attempts</p>
                <p className="text-2xl font-bold">{courseAnalytics.quizAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-green-600">{courseAnalytics.conversions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{courseAnalytics.conversionRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Preview Time</p>
                <p className="text-2xl font-bold">{courseAnalytics.avgPreviewTime}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Days to Convert</p>
                <p className="text-2xl font-bold">{courseAnalytics.avgConversionDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
