export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// DISABLED: OAuth removed - using custom email/password authentication only
// Redirect to login page instead of OAuth
export const getLoginUrl = () => {
  return "/login";
};
