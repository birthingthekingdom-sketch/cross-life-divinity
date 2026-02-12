import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Users, MessageCircle, UserPlus, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function CohortGroups() {
  const utils = trpc.useUtils();
  const { data: cohorts, isLoading } = trpc.cohorts.getActiveCohorts.useQuery();
  const { data: myCohorts } = trpc.cohorts.getMyCohorts.useQuery();

  const joinMutation = trpc.cohorts.joinCohort.useMutation({
    onSuccess: () => {
      toast.success("Successfully joined cohort group!");
      utils.cohorts.getActiveCohorts.invalidate();
      utils.cohorts.getMyCohorts.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to join: ${error.message}`);
    },
  });

  const leaveMutation = trpc.cohorts.leaveCohort.useMutation({
    onSuccess: () => {
      toast.success("Successfully left cohort group");
      utils.cohorts.getActiveCohorts.invalidate();
      utils.cohorts.getMyCohorts.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to leave: ${error.message}`);
    },
  });

  const isMember = (cohortId: number) => {
    return myCohorts?.some((c: any) => c.id === cohortId);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cohort groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg">
        <div className="container py-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-3">Student Cohort Groups</h1>
          <p className="text-white/90 text-lg max-w-3xl">
            Join a cohort group to connect with fellow students, share insights, and support each other on your learning journey.
          </p>
        </div>
      </div>

      {/* My Cohorts */}
      {myCohorts && myCohorts.length > 0 && (
        <div className="container py-8">
          <h2 className="text-2xl font-bold mb-6">My Cohort Groups</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {myCohorts.map((cohort: any) => (
              <Link key={cohort.id} href={`/cohort/${cohort.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/30">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      {cohort.pathLevel && (
                        <Badge className={getLevelColor(cohort.pathLevel)}>
                          {cohort.pathLevel}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="ml-auto">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Joined
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{cohort.name}</CardTitle>
                    {cohort.pathName && (
                      <CardDescription className="text-sm">
                        {cohort.pathName}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {cohort.description || "Connect with your peers in this cohort group"}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{cohort.memberCount} members</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Available Cohorts */}
      <div className="container py-8">
        <h2 className="text-2xl font-bold mb-6">
          {myCohorts && myCohorts.length > 0 ? "Join More Cohorts" : "Available Cohort Groups"}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cohorts?.filter((c: any) => !isMember(c.id)).map((cohort: any) => (
            <Card key={cohort.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  {cohort.pathLevel && (
                    <Badge className={getLevelColor(cohort.pathLevel)}>
                      {cohort.pathLevel}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{cohort.name}</CardTitle>
                {cohort.pathName && (
                  <CardDescription className="text-sm">
                    {cohort.pathName}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {cohort.description || "Connect with your peers in this cohort group"}
                </p>
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{cohort.memberCount} / {cohort.maxMembers} members</span>
                  </div>
                  {cohort.memberCount >= cohort.maxMembers && (
                    <Badge variant="secondary">Full</Badge>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => joinMutation.mutate({ cohortId: cohort.id })}
                  disabled={joinMutation.isPending || cohort.memberCount >= cohort.maxMembers}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {joinMutation.isPending ? "Joining..." : "Join Cohort"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {cohorts?.filter((c: any) => !isMember(c.id)).length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Available Cohorts</h3>
            <p className="text-muted-foreground">
              Check back later for new cohort groups to join.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
