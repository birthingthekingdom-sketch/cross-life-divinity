import * as analytics from './analytics';

/**
 * Convert student engagement data to CSV format
 */
export async function exportStudentEngagementCSV(): Promise<string> {
  const data = await analytics.getStudentEngagementData();
  
  // CSV headers
  const headers = [
    'User ID',
    'Name',
    'Email',
    'Last Login',
    'Days Since Login',
    'Enrolled Courses',
    'Completed Courses',
    'Completion Rate (%)',
    'Average Quiz Score (%)',
    'Quizzes Taken',
    'Status',
    'At Risk',
    'Inactive'
  ];
  
  // Convert data to CSV rows
  const rows = data.map(student => [
    student.userId.toString(),
    escapeCSV(student.userName),
    escapeCSV(student.userEmail),
    student.lastLoginAt ? new Date(student.lastLoginAt).toISOString() : 'Never',
    student.daysSinceLogin !== null ? student.daysSinceLogin.toString() : 'N/A',
    student.enrolledCourses.toString(),
    student.completedCourses.toString(),
    student.completionRate.toFixed(1),
    student.averageQuizScore !== null ? student.averageQuizScore.toFixed(1) : 'N/A',
    student.totalQuizzesTaken.toString(),
    getStudentStatus(student.isAtRisk, student.isInactive),
    student.isAtRisk ? 'Yes' : 'No',
    student.isInactive ? 'Yes' : 'No'
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Convert course completion trends to CSV format
 */
export async function exportCourseCompletionCSV(): Promise<string> {
  const data = await analytics.getCourseCompletionTrends();
  
  // CSV headers
  const headers = [
    'Course ID',
    'Course Code',
    'Course Title',
    'Total Enrolled',
    'Total Completed',
    'Completion Rate (%)',
    'Average Quiz Score (%)'
  ];
  
  // Convert data to CSV rows
  const rows = data.map(course => [
    course.courseId.toString(),
    escapeCSV(course.courseCode),
    escapeCSV(course.courseTitle),
    course.totalEnrolled.toString(),
    course.totalCompleted.toString(),
    course.completionRate.toFixed(1),
    course.averageQuizScore !== null ? course.averageQuizScore.toFixed(1) : 'N/A'
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Convert activity metrics to CSV format
 */
export async function exportActivityMetricsCSV(): Promise<string> {
  const metrics = await analytics.getStudentActivityMetrics();
  
  // CSV headers
  const headers = ['Metric', 'Value'];
  
  // Convert metrics to CSV rows
  const rows = [
    ['Total Students', metrics.totalStudents.toString()],
    ['Active Students (7 days)', metrics.activeStudents.toString()],
    ['Inactive Students (30+ days)', metrics.inactiveStudents.toString()],
    ['At-Risk Students', metrics.atRiskStudents.toString()],
    ['Average Course Completion Rate (%)', metrics.averageCourseCompletion.toFixed(1)],
    ['Average Quiz Score (%)', metrics.averageQuizScore.toFixed(1)]
  ];
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Export comprehensive analytics report with all data
 */
export async function exportComprehensiveAnalyticsCSV(): Promise<string> {
  const [metricsCSV, engagementCSV, trendsCSV] = await Promise.all([
    exportActivityMetricsCSV(),
    exportStudentEngagementCSV(),
    exportCourseCompletionCSV()
  ]);
  
  // Combine all sections with separators
  const sections = [
    '=== ACTIVITY METRICS ===',
    metricsCSV,
    '',
    '=== STUDENT ENGAGEMENT ===',
    engagementCSV,
    '',
    '=== COURSE COMPLETION TRENDS ===',
    trendsCSV
  ];
  
  return sections.join('\n');
}

/**
 * Helper: Escape CSV special characters
 */
function escapeCSV(value: string): string {
  if (!value) return '';
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  return value;
}

/**
 * Helper: Get student status label
 */
function getStudentStatus(isAtRisk: boolean, isInactive: boolean): string {
  if (isAtRisk) return 'At Risk';
  if (isInactive) return 'Inactive';
  return 'Active';
}
