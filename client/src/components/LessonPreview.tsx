import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Play, Download, Clock, BookOpen } from "lucide-react";

interface LessonPreviewProps {
  lessonId: number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isPreview?: boolean;
}

export function LessonPreview({
  lessonId,
  title,
  description,
  videoUrl,
  duration,
  order,
  isPreview = false
}: LessonPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={isPreview ? "border-dashed border-primary/50" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Lesson {order}</Badge>
              {isPreview && (
                <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                  Preview
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-2">{description}</CardDescription>
            )}
          </div>
          {videoUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {isExpanded && videoUrl && (
        <CardContent className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden">
            <VideoPlayer url={videoUrl} />
          </div>
          {duration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration} minutes</span>
            </div>
          )}
        </CardContent>
      )}

      {!isExpanded && (
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {videoUrl && (
              <span className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                Video lesson
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {duration} min
              </span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
