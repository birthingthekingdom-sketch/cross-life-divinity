import React from 'react';

export type BadgeType = 'lesson-master' | 'course-complete' | 'perfect-quiz' | 'streak' | 'first-course';

interface AchievementBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  tooltip?: string;
}

const badgeConfig = {
  'lesson-master': {
    icon: '📚',
    label: 'Lesson Master',
    color: 'bg-blue-100 border-blue-300',
    textColor: 'text-blue-700'
  },
  'course-complete': {
    icon: '🏆',
    label: 'Course Complete',
    color: 'bg-green-100 border-green-300',
    textColor: 'text-green-700'
  },
  'perfect-quiz': {
    icon: '⭐',
    label: 'Perfect Quiz',
    color: 'bg-yellow-100 border-yellow-300',
    textColor: 'text-yellow-700'
  },
  'streak': {
    icon: '🔥',
    label: 'Learning Streak',
    color: 'bg-orange-100 border-orange-300',
    textColor: 'text-orange-700'
  },
  'first-course': {
    icon: '🎓',
    label: 'First Course',
    color: 'bg-purple-100 border-purple-300',
    textColor: 'text-purple-700'
  }
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  size = 'md',
  showLabel = true,
  tooltip
}) => {
  const config = badgeConfig[type];
  
  const sizeClass = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }[size];

  const labelSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];

  return (
    <div className="flex flex-col items-center gap-1" title={tooltip || config.label}>
      <div className={`${sizeClass} ${config.color} border-2 rounded-full flex items-center justify-center font-bold`}>
        {config.icon}
      </div>
      {showLabel && (
        <span className={`${labelSizeClass} ${config.textColor} font-semibold text-center whitespace-nowrap`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default AchievementBadge;
