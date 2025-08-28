// Authentication debugging utilities
import { getEnvironmentContext, getAuthConfig } from '../config/auth';

export interface AuthDebugInfo {
  environment: {
    isDevelopment: boolean;
    isLocalBuild: boolean;
    isProduction: boolean;
    isStaging: boolean;
    releaseMode: string | undefined;
    nodeEnv: string | undefined;
    buildType: string | undefined;
  };
  config: {
    useMockUserAccess: boolean;
    graphqlEndpoint: string;
    enableUserAccessCheck: boolean;
  };
  recommendations: string[];
}

/**
 * Get comprehensive debugging information about the current authentication context
 */
export const getAuthDebugInfo = (): AuthDebugInfo => {
  const env = getEnvironmentContext();
  const config = getAuthConfig();
  
  const recommendations: string[] = [];
  
  // Add recommendations based on context
  if (env.isDevelopment) {
    recommendations.push('Development mode: Using mock authentication for faster development');
    recommendations.push('All users will be granted access automatically');
  }
  
  if (env.isLocalBuild) {
    recommendations.push('Local build mode: Using mock authentication for local testing');
    recommendations.push('This simulates production build behavior with local auth services');
  }
  
  if (env.isProduction || env.isStaging) {
    recommendations.push('Production/Staging mode: Using real GraphQL queries for user access');
    recommendations.push('Ensure GraphQL endpoint and headers are properly configured');
    
    if (!config.enableUserAccessCheck) {
      recommendations.push('⚠️  User access check is disabled - all authenticated users will have access');
    }
  }
  
  if (!env.isDevelopment && !env.isLocalBuild && !env.isProduction && !env.isStaging) {
    recommendations.push('⚠️  Unknown environment context - defaulting to production behavior');
    recommendations.push('Consider setting NODE_ENV, BUILD_TYPE, or release_mode environment variables');
  }
  
  return {
    environment: {
      isDevelopment: env.isDevelopment,
      isLocalBuild: env.isLocalBuild,
      isProduction: env.isProduction,
      isStaging: env.isStaging,
      releaseMode: env.releaseMode,
      nodeEnv: typeof process !== 'undefined' ? process.env?.NODE_ENV : 'unknown',
      buildType: typeof process !== 'undefined' ? process.env?.DOCUSAURUS_BUILD_TYPE : 'unknown',
    },
    config,
    recommendations
  };
};

/**
 * Log authentication debug information to console
 */
export const logAuthDebugInfo = (): void => {
  const debugInfo = getAuthDebugInfo();
  
  console.group('🔐 Authentication Context Debug Info');
  
  console.group('📊 Environment');
  console.log('Development:', debugInfo.environment.isDevelopment);
  console.log('Local Build:', debugInfo.environment.isLocalBuild);
  console.log('Production:', debugInfo.environment.isProduction);
  console.log('Staging:', debugInfo.environment.isStaging);
  console.log('NODE_ENV:', debugInfo.environment.nodeEnv);
  console.log('BUILD_TYPE:', debugInfo.environment.buildType);
  console.log('release_mode:', debugInfo.environment.releaseMode);
  console.groupEnd();
  
  console.group('⚙️  Configuration');
  console.log('Use Mock Access:', debugInfo.config.useMockUserAccess);
  console.log('GraphQL Endpoint:', debugInfo.config.graphqlEndpoint);
  console.log('Enable Access Check:', debugInfo.config.enableUserAccessCheck);
  console.groupEnd();
  
  if (debugInfo.recommendations.length > 0) {
    console.group('💡 Recommendations');
    debugInfo.recommendations.forEach(rec => console.log(rec));
    console.groupEnd();
  }
  
  console.groupEnd();
};

/**
 * Validate that the current environment is properly configured
 */
export const validateAuthEnvironment = (): { isValid: boolean; issues: string[] } => {
  const debugInfo = getAuthDebugInfo();
  const issues: string[] = [];
  
  // Check for conflicting environment variables
  if (debugInfo.environment.isDevelopment && debugInfo.environment.isLocalBuild) {
    issues.push('Both NODE_ENV=development and BUILD_TYPE=local are set - this may cause unexpected behavior');
  }
  
  // Check for production readiness
  if ((debugInfo.environment.isProduction || debugInfo.environment.isStaging) && 
      debugInfo.config.useMockUserAccess) {
    issues.push('Production/Staging environment is using mock authentication - this should not happen');
  }
  
  // Check GraphQL endpoint
  if (!debugInfo.config.useMockUserAccess && 
      debugInfo.config.graphqlEndpoint.includes('TODO')) {
    issues.push('GraphQL endpoint contains TODO - update with actual endpoint URL');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// Environment variable declarations for TypeScript
declare const process: {
  env: {
    NODE_ENV?: string;
    BUILD_TYPE?: string;
    release_mode?: string;
  };
};
