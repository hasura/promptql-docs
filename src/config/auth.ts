export interface AuthConfig {
  useMockUserAccess: boolean;
  graphqlEndpoint: string;
  enableUserAccessCheck: boolean;
  isAuthDisabled: boolean;
  oauth: {
    hydraAuthUrl: string;
    hydraTokenUrl: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    scope: string;
  };
}

// Import the generated Docusaurus config
import siteConfig from '@generated/docusaurus.config';

// Environment detection utilities
export const getEnvironmentContext = () => {
  // Get release mode and other config from Docusaurus customFields
  const releaseMode = siteConfig.customFields?.releaseMode as string | undefined;
  const isPreviewPR = (siteConfig.customFields?.isPreviewPR as boolean) || false;

  // Environment detection based purely on build-time configuration
  const isDevelopment = releaseMode === 'development';
  const isLocalBuild = false; 
  const isPRPreview = isPreviewPR;
  const isStaging = releaseMode === 'staging';
  const isProduction = releaseMode === 'production';

  console.log('Environment detection:', {
    isDevelopment,
    isLocalBuild,
    isPRPreview,
    releaseMode,
    isStaging,
    isProduction
  });

  return {
    isDevelopment,
    isLocalBuild,
    isPRPreview,
    isStaging,
    isProduction,
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
      isAuthDisabled: true, // Hide auth UI completely
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
      isAuthDisabled: false, // Auth UI enabled for development
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
      isAuthDisabled: false, // Auth UI enabled for staging
      oauth
    };
  }

  // Production configuration
  console.log('Using production auth config with real GraphQL queries');
  return {
    useMockUserAccess: false,
    graphqlEndpoint: 'https://data.pro.hasura.io/v1/graphql',
    enableUserAccessCheck: true,
    isAuthDisabled: false, // Auth UI enabled for production
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
