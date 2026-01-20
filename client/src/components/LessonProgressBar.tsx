import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  courseTitle?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LessonProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  courseTitle,
  showPercentage = true,
  size = 'md',
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Determine colors based on progress
  const getProgressColor = () => {
    if (percentage === 0) return 'bg-gray-300';
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  return (
    <div className="w-full">
      {courseTitle && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">{courseTitle}</h3>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-600">
              {percentage}% ({completed}/{total})
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`${getProgressColor()} h-full rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {!courseTitle && showPercentage && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {completed}/{total} lessons completed
        </div>
      )}
    </div>
  );
};

/**
 * Multi-course progress display component
 */
interface MultiCourseProgressProps {
  courses: Array<{
    id: number;
    code: string;
    title: string;
    totalLessons: number;
    completedLessons: number;
    completionPercentage: number;
  }>;
  onCourseClick?: (courseId: number) => void;
}

export const MultiCourseProgress: React.FC<MultiCourseProgressProps> = ({
  courses,
  onCourseClick,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">GED Course Progress</h2>
      
      {courses.length === 0 ? (
        <p className="text-gray-600">No GED courses enrolled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onCourseClick?.(course.id)}
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Course Code: {course.code}</p>
              </div>
              
              <LessonProgressBar
                completed={course.completedLessons}
                total={course.totalLessons}
                showPercentage={true}
                size="md"
              />
              
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">{course.completedLessons}</span> of{' '}
                  <span className="font-semibold">{course.totalLessons}</span> lessons completed
                </p>
                <p className="mt-1">
                  <span className="font-bold text-lg text-blue-600">{course.completionPercentage}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
