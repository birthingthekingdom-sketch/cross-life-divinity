import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Eye, Award } from "lucide-react";

interface CourseCardProps {
  id: number;
  title: string;
  code?: string;
  description?: string;
  cpdHours?: number;
  totalLessons?: number;
  isEnrolled?: boolean;
  onPreview?: () => void;
  onEnroll?: () => void;
  onNavigate?: () => void;
}

export function CourseCard({
  id,
  title,
  code,
  description,
  cpdHours,
  totalLessons,
  isEnrolled = false,
  onPreview,
  onEnroll,
  onNavigate
}: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            {code && (
              <Badge variant="outline" className="mt-2">
                {code}
              </Badge>
            )}
          </div>
          {isEnrolled && (
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
              <Award className="h-3 w-3 mr-1" />
              Enrolled
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="mt-2 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {totalLessons && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {totalLessons} lessons
            </span>
          )}
          {cpdHours && (
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              {cpdHours} CPD hrs
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {onPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          {isEnrolled && onNavigate ? (
            <Button
              size="sm"
              onClick={onNavigate}
              className="flex-1"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Continue
            </Button>
          ) : onEnroll ? (
            <Button
              size="sm"
              onClick={onEnroll}
              className="flex-1"
            >
              Enroll Now
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
