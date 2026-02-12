import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Download, RefreshCw } from "lucide-react";

export default function AdminAttendance() {
  const { toast } = useToast();
  const [webinarId, setWebinarId] = useState<number | null>(null);
  const [selectedAttendees, setSelectedAttendees] = useState<Set<number>>(new Set());
  const [attendanceStatus, setAttendanceStatus] = useState<"attended" | "no_show" | "excused">("attended");

  // Fetch webinars
  const webinarsQuery = trpc.webinars.listWebinars.useQuery();
  const webinars = webinarsQuery.data || [];

  // Fetch attendance records
  const attendanceQuery = trpc.attendance.getWebinarAttendance.useQuery(
    { webinarId: webinarId || 0 },
    { enabled: !!webinarId }
  );
  const attendance = attendanceQuery.data || [];

  // Fetch attendance stats
  const statsQuery = trpc.attendance.getAttendanceStats.useQuery(
    { webinarId: webinarId || 0 },
    { enabled: !!webinarId }
  );
  const stats = statsQuery.data;

  // Mutations
  const markAttendanceMutation = trpc.attendance.markAttendance.useMutation({
    onSuccess: () => {
      toast({ title: "Success", description: "Attendance marked successfully" });
      attendanceQuery.refetch();
      statsQuery.refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const bulkMarkMutation = trpc.attendance.bulkMarkAttendance.useMutation({
    onSuccess: () => {
      toast({ title: "Success", description: "Attendance marked for all selected students" });
      setSelectedAttendees(new Set());
      attendanceQuery.refetch();
      statsQuery.refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleToggleAttendee = (userId: number) => {
    const newSelected = new Set(selectedAttendees);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedAttendees(newSelected);
  };

  const handleBulkMark = () => {
    if (selectedAttendees.size === 0 || !webinarId) {
      toast({ title: "Error", description: "Please select at least one student", variant: "destructive" });
      return;
    }

    const attendees = Array.from(selectedAttendees).map((userId) => ({
      userId,
      status: attendanceStatus,
    }));

    bulkMarkMutation.mutate({ webinarId, attendees });
  };

  const handleExportCSV = () => {
    if (!webinarId) {
      toast({ title: "Error", description: "Please select a webinar", variant: "destructive" });
      return;
    }
    // Note: exportAttendanceCSV is a query, not a mutation - use refetch instead
    // For now, we'll skip this until the API is properly set up
    toast({ title: "Info", description: "CSV export coming soon" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Webinar Attendance Tracking</h1>
        <p className="text-gray-600">Mark and manage student attendance for webinars</p>
      </div>

      {/* Webinar Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Webinar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {webinars.map((webinar) => (
                <button
                  key={webinar.id}
                  onClick={() => setWebinarId(webinar.id)}
                  className={`p-4 text-left border-2 rounded-lg transition ${
                    webinarId === webinar.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold">{webinar.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(webinar.scheduledAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Registered</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Attended</p>
                <p className="text-2xl font-bold text-green-600">{stats.attended}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">No Show</p>
                <p className="text-2xl font-bold text-red-600">{stats.noShow}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Excused</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.excused}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Records */}
      {webinarId && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Student Attendance</CardTitle>
                <CardDescription>Mark attendance for each student</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => attendanceQuery.refetch()}
                  disabled={attendanceQuery.isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Bulk Actions */}
              <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value as any)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="attended">Mark as Attended</option>
                  <option value="no_show">Mark as No Show</option>
                  <option value="excused">Mark as Excused</option>
                </select>
                <Button
                  onClick={handleBulkMark}
                  disabled={selectedAttendees.size === 0 || bulkMarkMutation.isPending}
                >
                  Mark {selectedAttendees.size} Selected
                </Button>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">
                        <Checkbox
                          checked={selectedAttendees.size === attendance.length && attendance.length > 0}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedAttendees(new Set(attendance.map((a) => a.userId)));
                            } else {
                              setSelectedAttendees(new Set());
                            }
                          }}
                        />
                      </th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Marked At</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <Checkbox
                            checked={selectedAttendees.has(record.userId)}
                            onChange={() => handleToggleAttendee(record.userId)}
                          />
                        </td>
                        <td className="p-2">{record.userName || "N/A"}</td>
                        <td className="p-2 text-sm">{record.userEmail || "N/A"}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              record.status === "attended"
                                ? "default"
                                : record.status === "no_show"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm">
                          {record.markedAt ? new Date(record.markedAt).toLocaleString() : "Not marked"}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                markAttendanceMutation.mutate({
                                  webinarId: record.webinarId,
                                  userId: record.userId,
                                  status: "attended",
                                })
                              }
                            >
                              ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                markAttendanceMutation.mutate({
                                  webinarId: record.webinarId,
                                  userId: record.userId,
                                  status: "no_show",
                                })
                              }
                            >
                              ✗
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {attendance.length === 0 && (
                <p className="text-center text-gray-600 py-8">No attendance records found</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
