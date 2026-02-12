import React from 'react';

interface CourseProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CourseProgressBar: React.FC<CourseProgressBarProps> = ({
  progress,
  showLabel = true,
  size = 'md'
}) => {
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  const textClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];

  // Determine color based on progress
  const getProgressColor = (percent: number) => {
    if (percent === 0) return 'bg-gray-300';
    if (percent < 33) return 'bg-red-500';
    if (percent < 66) return 'bg-yellow-500';
    if (percent < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const progressColor = getProgressColor(progress);

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${progressColor} h-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className={`mt-1 ${textClass} font-medium text-gray-700`}>
          {Math.round(progress)}% Complete
        </div>
      )}
    </div>
  );
};

export default CourseProgressBar;
