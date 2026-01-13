import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

interface PreviewAnalytic {
  id: number;
  userId: number;
  courseId: number;
  duration: number;
  viewCount: number;
  previewedAt: Date;
  lastViewedAt: Date;
  userName: string;
  userEmail: string;
  courseName: string;
}

export function PreviewAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<PreviewAnalytic[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const getAnalytics = trpc.advancedAnalytics.getPreviewAnalytics.useQuery(
    { courseId: selectedCourse, limit: 100 },
    { enabled: false }
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const result = await getAnalytics.refetch();
        if (result.data) {
          setAnalytics(result.data);
        }
      } catch (error) {
        toast.error("Failed to load preview analytics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedCourse]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const topCourses = analytics
    .reduce(
      (acc, item) => {
        const existing = acc.find((a) => a.courseId === item.courseId);
        if (existing) {
          existing.viewCount += item.viewCount;
          existing.uniqueUsers.add(item.userId);
        } else {
          acc.push({
            courseId: item.courseId,
            courseName: item.courseName,
            viewCount: item.viewCount,
            uniqueUsers: new Set([item.userId]),
          });
        }
        return acc;
      },
      [] as Array<{
        courseId: number;
        courseName: string;
        viewCount: number;
        uniqueUsers: Set<number>;
      }>
    )
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Previews</div>
              <div className="text-2xl font-bold text-blue-600">
                {analytics.reduce((sum, a) => sum + a.viewCount, 0)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Unique Students</div>
              <div className="text-2xl font-bold text-green-600">
                {new Set(analytics.map((a) => a.userId)).size}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Avg Duration</div>
              <div className="text-2xl font-bold text-purple-600">
                {analytics.length > 0
                  ? formatDuration(
                      Math.round(
                        analytics.reduce((sum, a) => sum + a.duration, 0) /
                          analytics.length
                      )
                    )
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Top Courses */}
          {topCourses.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top Previewed Courses
              </h3>
              <div className="space-y-2">
                {topCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{course.courseName}</div>
                      <div className="text-sm text-gray-600">
                        {course.uniqueUsers.size} unique students
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{course.viewCount}</div>
                      <div className="text-xs text-gray-600">previews</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Previews */}
          {analytics.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Recent Preview Activity
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Student</th>
                      <th className="px-3 py-2 text-left">Course</th>
                      <th className="px-3 py-2 text-center">Views</th>
                      <th className="px-3 py-2 text-center">Duration</th>
                      <th className="px-3 py-2 text-left">Last Viewed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.slice(0, 10).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div className="font-medium">{item.userName}</div>
                          <div className="text-xs text-gray-600">
                            {item.userEmail}
                          </div>
                        </td>
                        <td className="px-3 py-2">{item.courseName}</td>
                        <td className="px-3 py-2 text-center">{item.viewCount}</td>
                        <td className="px-3 py-2 text-center">
                          {formatDuration(item.duration)}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {new Date(item.lastViewedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {analytics.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              No preview data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
