export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// OAuth login URL - redirects to Manus OAuth portal
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  
  if (!oauthPortalUrl || !appId) {
    console.error('OAuth configuration missing');
    return '/login';
  }
  
  // Ensure we're using the OAuth authorization endpoint, not the homepage
  const baseUrl = oauthPortalUrl.endsWith('/') ? oauthPortalUrl.slice(0, -1) : oauthPortalUrl;
  const oauthEndpoint = baseUrl.includes('/oauth') ? baseUrl : `${baseUrl}/oauth/authorize`;
  
  return `${oauthEndpoint}?app_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
};
