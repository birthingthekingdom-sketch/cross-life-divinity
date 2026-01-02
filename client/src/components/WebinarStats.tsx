import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Video, Clock } from "lucide-react";

interface WebinarStatsProps {
  totalWebinars: number;
  upcomingCount: number;
  pastCount: number;
  totalAttendees: number;
}

export function WebinarStats({
  totalWebinars,
  upcomingCount,
  pastCount,
  totalAttendees
}: WebinarStatsProps) {
  const stats = [
    {
      label: "Total Webinars",
      value: totalWebinars,
      icon: Video,
      color: "bg-blue-500/10 text-blue-700"
    },
    {
      label: "Upcoming",
      value: upcomingCount,
      icon: Calendar,
      color: "bg-green-500/10 text-green-700"
    },
    {
      label: "Past Sessions",
      value: pastCount,
      icon: Clock,
      color: "bg-purple-500/10 text-purple-700"
    },
    {
      label: "Total Attendees",
      value: totalAttendees,
      icon: Users,
      color: "bg-orange-500/10 text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {stat.label}
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
