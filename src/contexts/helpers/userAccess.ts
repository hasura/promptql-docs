import { getAuthConfig, USER_ACCESS_QUERY } from '../../config/auth';

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
    const response = await fetch(authConfig.graphqlEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Hasura-Client-Name': 'promptql-docs',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: USER_ACCESS_QUERY,
        variables: {},
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    if (Array.isArray(data?.errors)) {
      const accessDenied = data.errors.some((e: any) => e?.extensions?.code === 'access-denied');
      if (accessDenied) return false;
      return false;
    }

    const enabled = Boolean(data?.data?.checkUserPromptQLAccess?.promptql_enabled);
    return enabled;
  } catch (_error) {
    return false;
  }
};


