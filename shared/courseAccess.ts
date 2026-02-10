/**
 * Course Access Control
 * Determines which courses a user can access based on their subscription tier
 */

export type SubscriptionTier = 'admin' | 'bridge_academy' | 'theology_subscription' | 'none';

// Bridge Academy (GED) course codes
const BRIDGE_ACADEMY_COURSES = ['BA-MATH', 'BA-RLA', 'BA-SCI', 'BA-SS'];

// Theology subscription course codes (all theology courses)
const THEOLOGY_COURSES = [
  'CHA101', // Chaplaincy Training
  'BIB102', // New Testament Survey
  'BIB101', // Old Testament Survey
  'THE201', // Systematic Theology
  'BIB103', // Biblical Hermeneutics
  'DIV101', // Understanding Prophecy
  'THE301', // Fundamentals of Apologetics
  'DIV102', // Deliverance Ministry
  'MIN101', // Evangelism and Discipleship
  'MIN102', // Discipleship Training
  'SPR101', // Prayer and Intercession
  'LED202', // Christian Leadership
  'PAS201', // Pastoral Counseling
  'PAS301', // Church Administration
  'PAS101', // Homiletics
  'SPR201', // Discovering Spiritual Gifts
  'WOR101', // Biblical Worship
  'DIV111', // Capstone Project
  'DIV112', // Christology
  'DIV113', // Contemporary Theological Issues
];

/**
 * Get allowed course codes for a subscription tier
 */
export function getAllowedCourseCodes(tier: SubscriptionTier): string[] {
  switch (tier) {
    case 'admin':
      // Admins can access everything
      return [...BRIDGE_ACADEMY_COURSES, ...THEOLOGY_COURSES];
    case 'bridge_academy':
      // Bridge Academy students can only access GED courses
      return BRIDGE_ACADEMY_COURSES;
    case 'theology_subscription':
      // Theology subscription students can access all theology courses
      return THEOLOGY_COURSES;
    case 'none':
    default:
      // No access
      return [];
  }
}

/**
 * Check if a user can access a specific course
 */
export function canAccessCourse(
  courseCode: string,
  subscriptionTier: SubscriptionTier
): boolean {
  const allowedCourses = getAllowedCourseCodes(subscriptionTier);
  return allowedCourses.includes(courseCode);
}

/**
 * Filter courses based on user's subscription tier
 */
export function filterCoursesByAccess(
  courses: Array<{ code: string; [key: string]: any }>,
  subscriptionTier: SubscriptionTier
): Array<{ code: string; [key: string]: any }> {
  const allowedCourses = getAllowedCourseCodes(subscriptionTier);
  return courses.filter(course => allowedCourses.includes(course.code));
}

/**
 * Get subscription tier display name
 */
export function getSubscriptionTierName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'admin':
      return 'Administrator';
    case 'bridge_academy':
      return 'Bridge Academy (Free)';
    case 'theology_subscription':
      return 'Theology Subscription ($49/month)';
    case 'none':
    default:
      return 'No Access';
  }
}
