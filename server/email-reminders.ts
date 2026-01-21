import { notifyOwner } from "./_core/notification";

interface ProgressReminderData {
  userName: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  courses: any[];
}

/**
 * Send a weekly progress reminder email to a student
 */
export async function sendProgressReminderEmail(
  userEmail: string,
  data: ProgressReminderData
): Promise<void> {
  const { userName, progressPercentage, completedLessons, totalLessons, courses } = data;

  // Build course progress list
  const courseProgressList = courses
    .map((course) => {
      const courseProgress = course.completedLessons > 0 
        ? Math.round((course.completedLessons / course.totalLessons) * 100)
        : 0;
      return `${course.courseName}: ${course.completedLessons}/${course.totalLessons} lessons (${courseProgress}%)`;
    })
    .join("\n");

  const emailContent = `
Dear ${userName},

We hope you're making great progress in your GED preparation journey! Here's your weekly progress update:

📊 Overall Progress: ${progressPercentage}%
✅ Lessons Completed: ${completedLessons} out of ${totalLessons}

Course Breakdown:
${courseProgressList}

${
  progressPercentage === 100
    ? "🎉 Congratulations! You've completed all lessons! Don't forget to take the practice tests to prepare for the real GED exam."
    : progressPercentage >= 75
    ? "🌟 You're almost done! Keep up the momentum and finish strong."
    : progressPercentage >= 50
    ? "💪 You're halfway there! Continue studying consistently to reach your goals."
    : "🚀 Great start! Keep going and maintain your study schedule."
}

Next Steps:
1. Review any lessons you found challenging
2. Take practice quizzes to test your knowledge
3. Set a goal to complete the remaining lessons this week

Keep up the excellent work!

Best regards,
Cross Life School of Divinity - Bridge Academy Team
`;

  // Send email using the notification system
  try {
    await notifyOwner({
      title: `Progress Reminder for ${userName}`,
      content: `Student ${userName} (${userEmail}) has completed ${completedLessons}/${totalLessons} lessons (${progressPercentage}%)`,
    });
  } catch (error) {
    console.error("Failed to send progress reminder email:", error);
    throw error;
  }
}

/**
 * Send a motivational email when student reaches a milestone
 */
export async function sendMilestoneEmail(
  userEmail: string,
  userName: string,
  milestone: number,
  courseName: string
): Promise<void> {
  const milestoneMessages: Record<number, string> = {
    25: "Getting Started! 🚀 You've completed 25% of the course.",
    50: "Halfway There! 💪 You're 50% done with the course.",
    75: "Almost Done! 🌟 You're 75% through the course.",
    100: "Congratulations! 🎉 You've completed the entire course!",
  };

  const message = milestoneMessages[milestone] || `You've reached ${milestone}% completion!`;

  const emailContent = `
Dear ${userName},

${message}

Course: ${courseName}

You're doing amazing! Keep up the great work and continue your GED preparation journey.

${
  milestone === 100
    ? "Now that you've completed all lessons, we recommend taking our full-length practice tests to prepare for the actual GED exam."
    : "Keep studying consistently to reach the next milestone!"
}

Best regards,
Cross Life School of Divinity - Bridge Academy Team
`;

  try {
    await notifyOwner({
      title: `Milestone Achievement: ${userName} - ${milestone}% in ${courseName}`,
      content: `Student ${userName} has reached ${milestone}% completion in ${courseName}`,
    });
  } catch (error) {
    console.error("Failed to send milestone email:", error);
    throw error;
  }
}

/**
 * Send a reminder to inactive students
 */
export async function sendInactivityReminder(
  userEmail: string,
  userName: string,
  daysSinceLastActivity: number
): Promise<void> {
  const emailContent = `
Dear ${userName},

We noticed you haven't studied in the last ${daysSinceLastActivity} days. We miss you!

Your GED preparation journey is important, and consistent study is key to success. Here are some tips to get back on track:

1. Set a specific study time each day
2. Start with just 15-30 minutes if you're busy
3. Review the lessons you've already completed
4. Take a practice quiz to refresh your knowledge

Remember, you've already made progress - let's keep that momentum going!

Log in to your Bridge Academy account and continue your studies today.

Best regards,
Cross Life School of Divinity - Bridge Academy Team
`;

  try {
    await notifyOwner({
      title: `Inactivity Reminder for ${userName}`,
      content: `Student ${userName} has been inactive for ${daysSinceLastActivity} days`,
    });
  } catch (error) {
    console.error("Failed to send inactivity reminder:", error);
    throw error;
  }
}
