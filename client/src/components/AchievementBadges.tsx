import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Zap, Target, Trophy } from "lucide-react";

interface AchievementBadgesProps {
  courseName: string;
  progressPercentage: number;
}

interface MilestoneBadge {
  threshold: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const milestones: MilestoneBadge[] = [
  {
    threshold: 25,
    label: "Getting Started",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-800 border-blue-300",
    description: "25% completion"
  },
  {
    threshold: 50,
    label: "Halfway There",
    icon: <Target className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-800 border-purple-300",
    description: "50% completion"
  },
  {
    threshold: 75,
    label: "Almost Done",
    icon: <Award className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-800 border-amber-300",
    description: "75% completion"
  },
  {
    threshold: 100,
    label: "Master",
    icon: <Trophy className="w-5 h-5" />,
    color: "bg-green-100 text-green-800 border-green-300",
    description: "100% completion"
  }
];

export function AchievementBadges({ courseName, progressPercentage }: AchievementBadgesProps) {
  const earnedBadges = milestones.filter(m => progressPercentage >= m.threshold);
  const nextBadge = milestones.find(m => progressPercentage < m.threshold);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievements for {courseName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Badges Earned
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {earnedBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-3 rounded-lg border-2 bg-gradient-to-b from-white to-gray-50"
                  style={{
                    borderColor: badge.color.split(" ")[3],
                  }}
                >
                  <div className={`p-3 rounded-full mb-2 ${badge.color}`}>
                    {badge.icon}
                  </div>
                  <p className="text-sm font-semibold text-center text-foreground">
                    {badge.label}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Badge */}
        {nextBadge && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Next Badge
            </h3>
            <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gray-200 text-gray-600">
                  {nextBadge.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {nextBadge.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {nextBadge.description}
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {progressPercentage}% / {nextBadge.threshold}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (progressPercentage / nextBadge.threshold) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Badges Earned */}
        {progressPercentage === 100 && (
          <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200">
            <p className="text-sm text-green-800 font-semibold text-center">
              🎉 Congratulations! You've earned all badges for {courseName}!
            </p>
          </div>
        )}

        {/* Badge Progress Overview */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            All Badges
          </h3>
          <div className="space-y-2">
            {milestones.map((badge, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${badge.color}`}>
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {badge.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </div>
                {progressPercentage >= badge.threshold ? (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Earned
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600">
                    Locked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
