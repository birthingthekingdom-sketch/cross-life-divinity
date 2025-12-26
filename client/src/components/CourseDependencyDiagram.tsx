import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  isRequired?: boolean;
  courseOrder?: number;
}

interface CourseDependencyDiagramProps {
  courses: Course[];
  completedCourseIds?: number[];
  level: string;
}

export function CourseDependencyDiagram({ courses, completedCourseIds = [], level }: CourseDependencyDiagramProps) {
  const [sortedCourses, setSortedCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Sort courses by order
    const sorted = [...courses].sort((a, b) => (a.courseOrder || 0) - (b.courseOrder || 0));
    setSortedCourses(sorted);
  }, [courses]);

  const isCompleted = (courseId: number) => completedCourseIds.includes(courseId);
  const isLocked = (index: number) => {
    // First course is never locked
    if (index === 0) return false;
    // Check if previous course is completed
    return !isCompleted(sortedCourses[index - 1]?.id);
  };

  const getLevelColor = () => {
    switch (level) {
      case 'beginner':
        return 'from-green-500 to-emerald-600';
      case 'intermediate':
        return 'from-blue-500 to-indigo-600';
      case 'advanced':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  if (sortedCourses.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Course Progression Roadmap
      </h3>
      
      <div className="relative">
        {/* Vertical line connecting courses */}
        <div className={`absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b ${getLevelColor()} opacity-20`} />
        
        <div className="space-y-4">
          {sortedCourses.map((course, index) => {
            const completed = isCompleted(course.id);
            const locked = isLocked(index);
            
            return (
              <div key={course.id} className="relative flex items-start gap-4">
                {/* Course number circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                    completed 
                      ? `bg-gradient-to-br ${getLevelColor()}` 
                      : locked
                      ? 'bg-gray-400'
                      : `bg-gradient-to-br ${getLevelColor()} opacity-60`
                  }`}>
                    {completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : locked ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Course card */}
                <div className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  completed
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                    : locked
                    ? 'bg-gray-50 dark:bg-gray-900/20 border-gray-300 opacity-60'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${locked ? 'text-gray-500' : ''}`}>
                        {course.title}
                      </h4>
                      {course.isRequired && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {completed ? (
                        <Badge className="bg-green-600">Completed</Badge>
                      ) : locked ? (
                        <Badge variant="secondary">Locked</Badge>
                      ) : (
                        <Badge variant="outline">Available</Badge>
                      )}
                    </div>
                  </div>
                  
                  {locked && index > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete "{sortedCourses[index - 1].title}" to unlock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-green-600 text-green-600" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-gray-400 text-gray-400" />
          <span>Locked</span>
        </div>
      </div>
    </Card>
  );
}
