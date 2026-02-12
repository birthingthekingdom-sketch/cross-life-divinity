import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ExternalLink, Play, Video } from "lucide-react";
import { useLocation } from "wouter";

export default function Webinars() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: upcomingWebinars, isLoading: loadingUpcoming } = trpc.webinars.listWebinars.useQuery({ upcomingOnly: true });
  const { data: allWebinars, isLoading: loadingAll } = trpc.webinars.listWebinars.useQuery({ upcomingOnly: false });

  if (!user) {
    setLocation('/');
    return null;
  }

  const pastWebinars = allWebinars?.filter((w: any) => {
    const scheduledDate = new Date(w.scheduledAt);
    const endTime = new Date(scheduledDate.getTime() + (w.duration * 60000));
    return endTime < new Date();
  }) || [];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const scheduledDate = new Date(date);
    const diff = scheduledDate.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return 'starting soon';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Webinars</h1>
          <p className="text-muted-foreground mt-1">Join our online sessions and watch recordings</p>
        </div>

        {/* Upcoming Webinars */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Sessions</h2>
          {loadingUpcoming ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading webinars...</p>
            </div>
          ) : upcomingWebinars && upcomingWebinars.length > 0 ? (
            <div className="grid gap-4">
              {upcomingWebinars.map((webinar: any) => (
                <Card key={webinar.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{webinar.title}</CardTitle>
                          <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                            <Calendar className="h-3 w-3 mr-1" />
                            {getTimeUntil(webinar.scheduledAt)}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(webinar.scheduledAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(webinar.scheduledAt)} ({webinar.duration} min)
                          </span>
                        </CardDescription>
                      </div>
                      
                      <Button asChild>
                        <a href={webinar.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  {webinar.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{webinar.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Webinars</h3>
                <p className="text-muted-foreground">
                  Check back later for scheduled online sessions
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Webinars with Recordings */}
        {pastWebinars.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Past Sessions & Recordings</h2>
            <div className="grid gap-4">
              {pastWebinars.map((webinar: any) => (
                <Card key={webinar.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{webinar.title}</CardTitle>
                          <Badge variant="outline" className="text-muted-foreground">
                            Past Session
                          </Badge>
                        </div>
                        <CardDescription>
                          {formatDate(webinar.scheduledAt)} at {formatTime(webinar.scheduledAt)}
                        </CardDescription>
                      </div>
                      
                      {webinar.recordingUrl && (
                        <Button variant="outline" asChild>
                          <a href={webinar.recordingUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4 mr-2" />
                            Watch Recording
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  {webinar.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{webinar.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
