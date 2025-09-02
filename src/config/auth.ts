export interface AuthConfig {
  useMockUserAccess: boolean;
  graphqlEndpoint: string;
  enableUserAccessCheck: boolean;
  oauth: {
    hydraAuthUrl: string;
    hydraTokenUrl: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    scope: string;
  };
}

// Environment detection utilities
export const getEnvironmentContext = () => {
  // Use typeof check to safely access process in browser environment
  const isDevelopment = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
                       // Fallback: detect development by checking if we're on localhost
                       (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  const isLocalBuild = typeof process !== 'undefined' && process.env?.DOCUSAURUS_BUILD_TYPE === 'local';
  const releaseMode = typeof process !== 'undefined' ? process.env?.release_mode : undefined;

  // Get PR preview status from Docusaurus customFields (set at build time)
  // This is much more reliable than runtime detection
  let isPRPreview = false;

  if (typeof window !== 'undefined') {
    try {
      // Access the Docusaurus site config that's available globally
      const siteConfig = (window as any).docusaurus?.siteConfig;
      const customFields = siteConfig?.customFields;
      isPRPreview = customFields?.isPreviewPR === true;

      // Debug logging to see what's actually available
      console.log('CustomFields debug:', {
        hasDocusaurus: !!(window as any).docusaurus,
        hasSiteConfig: !!siteConfig,
        hasCustomFields: !!customFields,
        isPreviewPR: customFields?.isPreviewPR,
        allCustomFields: customFields
      });
    } catch (e) {
      console.log('Error accessing customFields:', e);
      // Fallback to false if customFields not available
      isPRPreview = false;
    }
  }

  console.log('Environment detection:', {
    isDevelopment,
    isLocalBuild,
    isPRPreview,
    releaseMode,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A'
  });

  return {
    isDevelopment,
    isLocalBuild,
    isPRPreview,
    isProduction: releaseMode === 'production',
    isStaging: releaseMode === 'staging',
    releaseMode
  };
};

// OAuth2 configuration - environment-specific
const getOAuthConfig = () => {
  const env = getEnvironmentContext();

  // Development/local configuration (using local Hydra)
  if (env.isDevelopment || env.isLocalBuild) {
    return {
      hydraAuthUrl: 'http://localhost:4444/oauth2/auth',
      hydraTokenUrl: 'http://localhost:4444/oauth2/token',
      clientId: 'docusaurus-client',
      clientSecret: 'docusaurus-super-secret',
      redirectUri: 'http://localhost:3001/docs/callback',
      scope: 'openid email'
    };
  }

  // Staging configuration
  if (env.isStaging) {
    return {
      hydraAuthUrl: 'https://oauth.pro.arusah.com/oauth2/auth',
      hydraTokenUrl: 'https://oauth.pro.arusah.com/oauth2/token',
      clientId: 'caba4e74-7d83-441f-88c1-c56a79d5bb87',
      redirectUri: 'https://stage.promptql.io/docs/callback',
      scope: 'openid offline'
    };
  }

  // Production configuration
  return {
    hydraAuthUrl: 'https://oauth.pro.hasura.io/oauth2/auth',
    hydraTokenUrl: 'https://oauth.pro.hasura.io/oauth2/token',
    clientId: 'caba4e74-7d83-441f-88c1-c56a79d5bb87',
    redirectUri: 'https://promptql.io/docs/callback',
    scope: 'openid offline'
  };
};

// Get auth configuration based on environment
export const getAuthConfig = (): AuthConfig => {
  const env = getEnvironmentContext();
  const oauth = getOAuthConfig();

  // Completely disable auth for PR preview environments
  if (env.isPRPreview) {
    console.log('PR preview environment detected - disabling auth completely');
    return {
      useMockUserAccess: true,
      graphqlEndpoint: 'https://data.pro.hasura.io/v1/graphql',
      enableUserAccessCheck: false, // Completely disable auth checks
      oauth
    };
  }

  // Use mock for development and local builds
  if (env.isDevelopment || env.isLocalBuild) {
    console.log('Using development/local auth config with mock user access');
    return {
      useMockUserAccess: true,
      graphqlEndpoint: 'https://data.pro.hasura.io/v1/graphql',
      enableUserAccessCheck: true,
      oauth
    };
  }

  // Staging configuration
  if (env.isStaging) {
    console.log('Using staging auth config with real GraphQL queries');
    return {
      useMockUserAccess: false,
      graphqlEndpoint: 'https://data.pro.arusah.com/v1/graphql',
      enableUserAccessCheck: true,
      oauth
    };
  }

  // Production configuration
  console.log('Using production auth config with real GraphQL queries');
  return {
    useMockUserAccess: false,
    graphqlEndpoint: 'https://data.pro.hasura.io/v1/graphql',
    enableUserAccessCheck: true,
    oauth
  };
};

// GraphQL query for checking user access
// The API will identify the user from cookie since we've configured a webhook on the Hasura side of things that will be forwarded cookies
export const USER_ACCESS_QUERY = `
  query CheckUserAccess {
    ddn_promptql_enabled_users {
      id
      email
    }
  }
`;
