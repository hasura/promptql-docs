import { getAuthConfig, USER_ACCESS_QUERY } from '../../config/auth';

/**
 * Check if user has access with environment-aware implementation
 */
export const checkUserAccess = async (token: string): Promise<boolean> => {
  const authConfig = getAuthConfig();
  
  // Use mock for development and local builds
  if (authConfig.useMockUserAccess) {
    console.log('Using mock user access check (development/local build)');
    return true;
  }
  
  // For production/staging, use GraphQL query
  if (!authConfig.enableUserAccessCheck) {
    console.log('User access check disabled');
    return true;
  }
  
  try {
    const response = await fetch(authConfig.graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Hasura-Client-Name': 'promptql-docs',
      },
      body: JSON.stringify({
        query: USER_ACCESS_QUERY,
        variables: {}
      })
    });
    
    if (!response.ok) {
      console.error('GraphQL query failed:', response.statusText);
      // Fail closed - deny access if we can't verify
      return false;
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return false;
    }
    
    const enabledUsers = data.data?.ddn_promptql_enabled_users || [];
    const hasAccess = enabledUsers.length > 0;

    console.log(`User access check result: ${hasAccess}`);
    return hasAccess;
    
  } catch (error) {
    console.error('Error checking user access:', error);
    // Fail closed - deny access on error
    return false;
  }
};


