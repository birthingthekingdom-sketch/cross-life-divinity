import { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  courseTitle: string;
  lessonId: number;
  status: "upcoming" | "due-soon" | "overdue" | "completed";
  submissionStatus?: string;
}

export function AssignmentCalendar() {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  // Fetch all assignments with due dates
  const { data: assignments, isLoading } = trpc.assignments.getCalendarAssignments.useQuery();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Loading assignment calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform assignments into calendar events
  const events: CalendarEvent[] = (assignments || [])
    .map((assignment: any) => {
    if (!assignment.dueDate) return null;
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let status: CalendarEvent["status"] = "upcoming";
    if (assignment.submissionStatus === "graded" || assignment.submissionStatus === "submitted") {
      status = "completed";
    } else if (daysDiff < 0) {
      status = "overdue";
    } else if (daysDiff <= 3) {
      status = "due-soon";
    }

    return {
      id: assignment.lessonId,
      title: assignment.lessonTitle,
      start: dueDate,
      end: dueDate,
      courseTitle: assignment.courseTitle,
      lessonId: assignment.lessonId,
      status,
      submissionStatus: assignment.submissionStatus,
    };
  })
  .filter((event) => event !== null) as CalendarEvent[];

  const getEventStyle = (event: CalendarEvent) => {
    const styles: Record<string, { backgroundColor: string; borderColor: string }> = {
      upcoming: { backgroundColor: "#3b82f6", borderColor: "#2563eb" },
      "due-soon": { backgroundColor: "#eab308", borderColor: "#ca8a04" },
      overdue: { backgroundColor: "#ef4444", borderColor: "#dc2626" },
      completed: { backgroundColor: "#22c55e", borderColor: "#16a34a" },
    };

    return {
      style: {
        ...styles[event.status],
        color: "white",
        borderRadius: "4px",
        padding: "2px 4px",
        fontSize: "12px",
      },
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "due-soon":
        return <AlertTriangle className="w-4 h-4" />;
      case "overdue":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "due-soon":
        return "bg-yellow-500";
      case "overdue":
        return "bg-red-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const statusCounts = {
    upcoming: events.filter((e) => e.status === "upcoming").length,
    dueSoon: events.filter((e) => e.status === "due-soon").length,
    overdue: events.filter((e) => e.status === "overdue").length,
    completed: events.filter((e) => e.status === "completed").length,
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Assignment Calendar</h1>
        <p className="text-muted-foreground">
          View all your assignment due dates and track your progress
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.upcoming}</div>
            <p className="text-xs text-muted-foreground">More than 3 days away</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.dueSoon}</div>
            <p className="text-xs text-muted-foreground">Within 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Submitted or graded</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assignment Timeline</CardTitle>
              <CardDescription>Click on an assignment to view details</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("month")}
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button
                variant={view === "agenda" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("agenda")}
              >
                Agenda
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: "600px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={getEventStyle}
              onSelectEvent={(event) => {
                // Navigate to lesson page
                window.location.href = `/lesson/${event.lessonId}`;
              }}
              tooltipAccessor={(event) =>
                `${event.courseTitle} - ${event.title}\nStatus: ${event.status}`
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assignments List */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upcoming Assignments</CardTitle>
          <CardDescription>Sorted by due date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .filter((e) => e.status !== "completed")
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .slice(0, 10)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => (window.location.href = `/lesson/${event.lessonId}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(event.status)} text-white`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.courseTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(event.start, "MMM dd, yyyy")}
                    </p>
                    <Badge variant={event.status === "overdue" ? "destructive" : "secondary"}>
                      {event.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              ))}

            {events.filter((e) => e.status !== "completed").length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <p>No pending assignments! Great work!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
