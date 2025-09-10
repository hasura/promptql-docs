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
export const storeSession = (
  accessToken: string,
  refreshToken?: string,
  accessTokenExpiresInSeconds?: number
): void => {
  // Align cookie expiry with the token's actual lifetime (fallback to 1 day)
  const accessTokenExpires: number | Date =
    typeof accessTokenExpiresInSeconds === 'number' && isFinite(accessTokenExpiresInSeconds) && accessTokenExpiresInSeconds > 0
      ? new Date(Date.now() + accessTokenExpiresInSeconds * 1000)
      : 1; // days

  Cookies.set('hasura-lux', accessToken, { expires: accessTokenExpires });
  if (refreshToken) {
    Cookies.set('hasura-lux-refresh', refreshToken, { expires: 7 }); // 7 days
  }
};

/**
 * Clear user session data
 */
export const clearSession = (): void => {
  Cookies.remove('hasura-lux');
  Cookies.remove('hasura-lux-refresh');
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('hasura-lux-refresh');

  if (!refreshToken) {
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

    const tokenResponse = await fetch(authConfig.oauth.hydraTokenUrl, {
      method: 'POST',
      headers,
      body: bodyParams,
    });

    if (!tokenResponse.ok) {
      // Clear invalid tokens
      clearSession();
      return null;
    }

    const tokenData = await tokenResponse.json();
    const newAccessToken = tokenData.access_token;
    const newRefreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in; // seconds

    if (!newAccessToken) {
      clearSession();
      return null;
    }

    // Store the new tokens and align cookie expiry with access token lifetime
    storeSession(newAccessToken, newRefreshToken, expiresIn);

    return newAccessToken;
  } catch (error) {
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
