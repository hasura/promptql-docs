import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuthConfig } from '../config/auth';

interface AuthenticationPromptProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Authentication prompt component that can be embedded in pages
 * Shows login prompt for unauthenticated users, nothing for authenticated users
 */
export const AuthenticationPrompt: React.FC<AuthenticationPromptProps> = ({
  title = "Access Full Documentation",
  description = "Sign in to access the complete PromptQL documentation and interactive features.",
  className = ""
}) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const authConfig = getAuthConfig();

  // If auth is disabled (e.g., PR previews), don't show anything
  if (authConfig.isAuthDisabled) {
    return null;
  }

  // Don't show anything while loading or if already authenticated
  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className={`auth-prompt-container ${className}`}>
      <div className="auth-prompt-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <button
          onClick={login}
          className="auth-button auth-prompt-button"
        >
          <span>🔐</span>
          Sign In with Hasura Cloud
        </button>
      </div>
    </div>
  );
};

export default AuthenticationPrompt;
