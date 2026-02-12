import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonPreview } from "@/components/LessonPreview";
import { QuizPreview } from "@/components/QuizPreview";
import { BookOpen, ClipboardList, Eye } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  passingScore?: number;
}

interface CoursePreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  courseDescription?: string;
  courseCode?: string;
  lessons: Lesson[];
  quizzes?: Quiz[];
  previewLessonId?: number;
  previewQuizId?: number;
}

export function CoursePreviewModal({
  isOpen,
  onOpenChange,
  courseTitle,
  courseDescription,
  courseCode,
  lessons,
  quizzes = [],
  previewLessonId,
  previewQuizId
}: CoursePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "quizzes">("overview");

  const previewLesson = lessons.find(l => l.id === previewLessonId);
  const previewQuiz = quizzes.find(q => q.id === previewQuizId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{courseTitle}</DialogTitle>
              {courseCode && (
                <Badge variant="outline" className="mt-2">
                  {courseCode}
                </Badge>
              )}
            </div>
            <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          </div>
          {courseDescription && (
            <DialogDescription className="mt-4">
              {courseDescription}
            </DialogDescription>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Lessons ({lessons.length})
            </TabsTrigger>
            {quizzes.length > 0 && (
              <TabsTrigger value="quizzes" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Quizzes ({quizzes.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Course Structure</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Lessons</div>
                    <div className="text-2xl font-bold">{lessons.length}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Assessments</div>
                    <div className="text-2xl font-bold">{quizzes.length}</div>
                  </div>
                </div>
              </div>

              {previewLesson && (
                <div>
                  <h3 className="font-semibold mb-2">Preview Lesson</h3>
                  <LessonPreview
                    lessonId={previewLesson.id}
                    title={previewLesson.title}
                    description={previewLesson.description}
                    videoUrl={previewLesson.videoUrl}
                    duration={previewLesson.duration}
                    order={previewLesson.order}
                    isPreview={true}
                  />
                </div>
              )}

              {previewQuiz && (
                <div>
                  <h3 className="font-semibold mb-2">Preview Quiz</h3>
                  <QuizPreview
                    quizId={previewQuiz.id}
                    title={previewQuiz.title}
                    description={previewQuiz.description}
                    questions={previewQuiz.questions}
                    passingScore={previewQuiz.passingScore}
                    isPreview={true}
                  />
                </div>
              )}

              <Button className="w-full" size="lg">
                Enroll in Course
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4 mt-4">
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <LessonPreview
                  key={lesson.id}
                  lessonId={lesson.id}
                  title={lesson.title}
                  description={lesson.description}
                  videoUrl={lesson.videoUrl}
                  duration={lesson.duration}
                  order={lesson.order}
                  isPreview={lesson.id === previewLessonId}
                />
              ))}
            </div>
          </TabsContent>

          {quizzes.length > 0 && (
            <TabsContent value="quizzes" className="space-y-4 mt-4">
              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <QuizPreview
                    key={quiz.id}
                    quizId={quiz.id}
                    title={quiz.title}
                    description={quiz.description}
                    questions={quiz.questions}
                    passingScore={quiz.passingScore}
                    isPreview={quiz.id === previewQuizId}
                  />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
