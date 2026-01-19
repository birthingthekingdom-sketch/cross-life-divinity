/**
 * Adaptive Learning Path Recommendation Engine
 */

export interface TopicRecommendation {
  topicId: number;
  topicTitle: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  action: 'review' | 'practice' | 'advance';
}

export function generateLearningPathRecommendation(
  currentTopicScore: number,
  completedTopics: number,
  totalTopics: number,
  averageCourseScore: number,
  weakAreas: { topicId: number; topicTitle: string; averageScore: number }[]
): TopicRecommendation | null {
  const percentage = Math.round((currentTopicScore / 100) * 100);

  if (percentage < 70) {
    return {
      topicId: 0,
      topicTitle: 'Current Topic Review',
      reason: `Your score of ${percentage}% indicates you need more practice with this material. Review the lesson and try the quiz again.`,
      priority: 'high',
      action: 'review',
    };
  }

  if (weakAreas.length > 0 && averageCourseScore < 80) {
    const weakestArea = weakAreas.reduce((prev, current) =>
      prev.averageScore < current.averageScore ? prev : current
    );

    return {
      topicId: weakestArea.topicId,
      topicTitle: weakestArea.topicTitle,
      reason: `You scored ${Math.round(weakestArea.averageScore)}% on "${weakestArea.topicTitle}". Reviewing this weak area will strengthen your overall performance.`,
      priority: 'high',
      action: 'practice',
    };
  }

  if (completedTopics < totalTopics) {
    if (percentage >= 90) {
      return {
        topicId: completedTopics + 1,
        topicTitle: 'Next Topic',
        reason: `Excellent work! You scored ${percentage}% on this topic. You're ready to advance to the next lesson.`,
        priority: 'medium',
        action: 'advance',
      };
    } else if (percentage >= 80) {
      return {
        topicId: completedTopics + 1,
        topicTitle: 'Next Topic',
        reason: `Great job! You scored ${percentage}% on this topic. You can move forward to the next lesson.`,
        priority: 'medium',
        action: 'advance',
      };
    } else {
      return {
        topicId: completedTopics + 1,
        topicTitle: 'Next Topic',
        reason: `You passed this topic with ${percentage}%. You're ready to move to the next lesson.`,
        priority: 'low',
        action: 'advance',
      };
    }
  }

  return {
    topicId: 0,
    topicTitle: 'Practice Tests',
    reason: `You've completed all topics! Take a full-length practice test to prepare for the actual GED exam.`,
    priority: 'medium',
    action: 'advance',
  };
}

export function calculateWeakAreas(
  topicScores: { topicId: number; topicTitle: string; averageScore: number }[]
): { topicId: number; topicTitle: string; averageScore: number }[] {
  const courseAverage =
    topicScores.reduce((sum, t) => sum + t.averageScore, 0) / topicScores.length;

  return topicScores
    .filter((topic) => topic.averageScore < courseAverage)
    .sort((a, b) => a.averageScore - b.averageScore);
}

export function getMotivationalMessage(
  averageScore: number,
  completionPercentage: number
): string {
  if (averageScore >= 90 && completionPercentage >= 80) {
    return "🌟 Outstanding progress! You're on track to ace the GED exam. Keep up the excellent work!";
  } else if (averageScore >= 80 && completionPercentage >= 60) {
    return "🎯 Great progress! You're doing well. Stay focused and you'll reach your GED goals.";
  } else if (averageScore >= 70 && completionPercentage >= 40) {
    return "💪 Good effort! You're making steady progress. Keep practicing to improve your scores.";
  } else if (completionPercentage < 25) {
    return "🚀 You're just getting started! Complete more lessons and quizzes to build your skills.";
  } else {
    return "📚 Keep going! Every quiz brings you closer to GED success. Don't give up!";
  }
}
