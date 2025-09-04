import { getAuthConfig, USER_ACCESS_QUERY } from '../../config/auth';
import { refreshAccessToken } from './sessionManager';

/**
 * Check if user has access with environment-aware implementation
 */
export const checkUserAccess = async (token: string): Promise<boolean> => {
  const authConfig = getAuthConfig();
  
  // Use mock for development and local builds
  if (authConfig.useMockUserAccess) {
    return true;
  }
  
  // For production/staging, use GraphQL query
  if (!authConfig.enableUserAccessCheck) {
    return true;
  }
  
  try {
    let currentToken = token;

    // First attempt with the provided token
    let response = await fetch(authConfig.graphqlEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Hasura-Client-Name': 'promptql-docs',
        'Authorization': `Bearer ${currentToken}`,
      },
      body: JSON.stringify({
        query: USER_ACCESS_QUERY,
        variables: {}
      })
    });

    // If the request failed with 401 (unauthorized), try to refresh the token
    if (response.status === 401) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        currentToken = newToken;
        // Retry the request with the new token
        response = await fetch(authConfig.graphqlEndpoint, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Hasura-Client-Name': 'promptql-docs',
            'Authorization': `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            query: USER_ACCESS_QUERY,
            variables: {}
          })
        });
      } else {
        return false;
      }
    }

    if (!response.ok) {
      // Fail closed - deny access if we can't verify
      return false;
    }

    const data = await response.json();

    if (data.errors) {
      return false;
    }

    const enabledUsers = data.data?.ddn_promptql_enabled_users || [];
    const hasAccess = enabledUsers.length > 0;

    return hasAccess;
    
  } catch (error) {
    // Fail closed - deny access on error
    return false;
  }
};


