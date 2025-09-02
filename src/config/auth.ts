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

  console.log('Environment detection:', { isDevelopment, isLocalBuild, releaseMode, hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A' });

  return {
    isDevelopment,
    isLocalBuild,
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

  // Staging/Production configuration (using Control Plan Services OAuth)
  const baseUrl = env.isProduction
    ? 'https://promptql.io'
    : 'https://stage.promptql.io';

  return {
    hydraAuthUrl: 'https://oauth.pro.arusah.com/oauth2/auth',
    hydraTokenUrl: 'https://oauth.pro.arusah.com/oauth2/token',
    clientId: 'caba4e74-7d83-441f-88c1-c56a79d5bb87',
    redirectUri: `${baseUrl}/docs/callback`,
    scope: 'openid offline'
  };
};

// Get auth configuration based on environment
export const getAuthConfig = (): AuthConfig => {
  const env = getEnvironmentContext();
  const oauth = getOAuthConfig();

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

  // Production/staging configuration
  console.log('Using production auth config with real GraphQL queries');
  return {
    useMockUserAccess: false,
    graphqlEndpoint: 'https://data.pro.hasura.io/v1/graphql',
    enableUserAccessCheck: true,
    oauth
  };
};

// GraphQL query for checking user access
// The API will identify the user from the Authorization header token since we've configured a webhook on the Hasura side of things
export const USER_ACCESS_QUERY = `
  query CheckUserAccess {
    ddn_promptql_enabled_users {
      id
      email
    }
  }
`;
