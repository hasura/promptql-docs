import Cookies from 'js-cookie';
import { checkUserAccess } from './userAccess';
import { getAuthConfig } from '../../config/auth';

export interface User {
  id: string;
  email: string;
  name?: string;
}

/**
 * Initialize authentication state from stored session
 */
export const initializeAuthFromSession = async (): Promise<User | null> => {
  try {
    const accessToken = Cookies.get('hasura-lux');

    if (accessToken) {
      const hasAccess = await checkUserAccess(accessToken);

      if (hasAccess) {
        // Return a minimal user object - we don't need actual user data
        return { id: 'authenticated', email: 'authenticated' };
      } else {
        // Clear invalid session
        clearSession();
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error('Error initializing auth from session:', error);
    // Clear potentially corrupted session
    clearSession();
    return null;
  }
};

/**
 * Store user session data
 */
export const storeSession = (accessToken: string, refreshToken?: string): void => {
  Cookies.set('hasura-lux', accessToken, { expires: 1 }); // 1 day
  if (refreshToken) {
    Cookies.set('hasura-lux-refresh', refreshToken, { expires: 7 }); // 7 days
  }
  // We no longer store user_info - the GraphQL API identifies users from the token
};

/**
 * Clear user session data
 */
export const clearSession = (): void => {
  Cookies.remove('hasura-lux');
  Cookies.remove('hasura-lux-refresh');
  // No longer need to remove user_info cookie
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('hasura-lux-refresh');

  if (!refreshToken) {
    console.log('No refresh token available');
    return null;
  }

  const authConfig = getAuthConfig();

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const bodyParams = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
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
      console.error('Token refresh failed:', tokenResponse.statusText);
      // Clear invalid tokens
      clearSession();
      return null;
    }

    const tokenData = await tokenResponse.json();
    const newAccessToken = tokenData.access_token;
    const newRefreshToken = tokenData.refresh_token;

    if (!newAccessToken) {
      console.error('No access token received from refresh');
      clearSession();
      return null;
    }

    // Store the new tokens
    storeSession(newAccessToken, newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearSession();
    return null;
  }
};

/**
 * Perform logout and redirect
 */
export const performLogout = (): void => {
  clearSession();
  // Redirect to docs index page
  window.location.href = '/docs/index/';
};
