import Cookies from 'js-cookie';
import { getAuthConfig } from '../../config/auth';
import { checkUserAccess } from './userAccess';

/**
 * Generate random state for OAuth2 security
 */
export const generateState = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Initiate OAuth login flow
 */
export const initiateLogin = () => {
  const authConfig = getAuthConfig();

  // Don't initiate OAuth flow if auth is disabled (e.g., PR previews)
  if (authConfig.isAuthDisabled) {
    console.log('Auth is disabled - skipping OAuth flow');
    return;
  }

  const state = generateState();
  sessionStorage.setItem('oauth_state', state);

  // Store the current path to redirect back after login
  const currentPath = window.location.pathname;
  if (currentPath !== '/docs/login/') {
    sessionStorage.setItem('redirect_after_login', currentPath);
  }

  const authUrl = new URL(authConfig.oauth.hydraAuthUrl);
  authUrl.searchParams.append('client_id', authConfig.oauth.clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', authConfig.oauth.scope);
  authUrl.searchParams.append('redirect_uri', authConfig.oauth.redirectUri);
  authUrl.searchParams.append('state', state);

  window.location.href = authUrl.toString();
};

/**
 * Handle OAuth callback and complete authentication
 */
export const handleAuthCallback = async (code: string, state: string): Promise<string> => {
  const authConfig = getAuthConfig();

  try {
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Exchange authorization code for access token
    console.log('Exchanging code:', code);
    console.log('Redirect URI:', authConfig.oauth.redirectUri);

    // Prepare headers and body based on client authentication method
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const bodyParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: authConfig.oauth.redirectUri,
      client_id: authConfig.oauth.clientId,
    });

    // Only add Authorization header if client secret is provided (for local development)
    if (authConfig.oauth.clientSecret) {
      headers['Authorization'] = `Basic ${btoa(`${authConfig.oauth.clientId}:${authConfig.oauth.clientSecret}`)}`;
    }

    const tokenResponse = await fetch(authConfig.oauth.hydraTokenUrl, {
      method: 'POST',
      headers,
      body: bodyParams,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange error:', errorText);
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token data received:', tokenData);
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('No access token received from token exchange');
    }

    // Check if user has access using the access token
    // The GraphQL API will identify the user from the Authorization header
    const hasAccess = await checkUserAccess(accessToken);
    if (!hasAccess) {
      throw new Error(`While you have a Hasura Cloud account, it looks like you don't have access to PromptQL. Please contact your AI strategist to allowlist your email for reading through the documentation and for creating PromptQL projects.`);
    }

    return accessToken;

  } catch (error) {
    console.error('Auth callback error:', error);
    throw error;
  }
};

/**
 * Complete the authentication process after successful callback
 */
export const completeAuthentication = (accessToken: string) => {
  // Store access token in cookies - this is all we need for GraphQL API requests
  Cookies.set('hasura-lux', accessToken, { expires: 1 }); 

  // Clean up session storage
  sessionStorage.removeItem('oauth_state');

  // Redirect to original destination or home
  const redirectPath = sessionStorage.getItem('redirect_after_login') || '/docs/index/';
  sessionStorage.removeItem('redirect_after_login');
  window.location.href = redirectPath;
};
