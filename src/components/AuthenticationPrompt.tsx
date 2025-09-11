import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuthConfig } from '../config/auth';

interface AuthenticationPromptProps {
  title?: string;
  className?: string;
}

/**
 * Authentication prompt component that can be embedded in pages
 * Shows login prompt for unauthenticated users, nothing for authenticated users
 */
export const AuthenticationPrompt: React.FC<AuthenticationPromptProps> = ({
  title = "Access full documentation",
  className = ""
}) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const authConfig = getAuthConfig();
  const isBrowser = typeof window !== 'undefined';
  const initialAccessDenied = isBrowser && (() => {
    try { return sessionStorage.getItem('access_denied') === '1'; } catch { return false; }
  })();
  const [isAccessDenied] = React.useState<boolean>(Boolean(initialAccessDenied));
  const handleTryAgain = React.useCallback(() => {
    try { if (isBrowser) sessionStorage.removeItem('access_denied'); } catch {}
    login();
  }, [login, isBrowser]);


  // If auth is disabled (e.g., PR previews), don't show anything
  if (authConfig.isAuthDisabled) {
    return null;
  }

  // Don't show anything while loading or if already authenticated
  if (isLoading || isAuthenticated) {
    return null;
  }

  // If the OAuth callback determined the user lacks access, show an access denied message
  if (isAccessDenied) {
    return (
      <div className={`auth-prompt-container ${className}`}>
        <div className="auth-prompt-card">
          <h3>Access Not Available</h3>
          <p>
            Thanks for signing in. It looks like you’re not a PromptQL user yet.
          </p>
          <p>
            Please contact your AI strategist to grant you access for reading through the documentation and for creating PromptQL projects.
          </p>
          <div className="auth-prompt-buttons">
            <button
              onClick={handleTryAgain}
              className="auth-button auth-prompt-button"
            >
              Try signing in again
            </button>
            <div className="auth-prompt-separator">or</div>
            <a
              href="https://promptql.io/book-demo?utm_source=docs&utm_medium=auth_prompt_existing_account&utm_campaign=documentation"
              target="_blank"
              rel="noopener noreferrer"
              className="auth-button-secondary"
            >
              Learn more about PromptQL
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`auth-prompt-container ${className}`}>
      <div className="auth-prompt-card">
        <h3>{title}</h3>
        <p>
          Sign in to access the CLI, API reference, tutorials, and all docs.
        </p>
        <div className="auth-prompt-buttons">
          <button
            onClick={login}
            className="auth-button auth-prompt-button"
          >
            Sign in with PromptQL
          </button>
          <div className="auth-prompt-separator">or</div>
          <a
            href="https://promptql.io/book-demo?utm_source=docs&utm_medium=auth_prompt&utm_campaign=documentation"
            target="_blank"
            rel="noopener noreferrer"
            className="auth-button-secondary"
          >
            Talk to Sales
          </a>
        </div>
        <p className="auth-prompt-subtitle">
          New to PromptQL? Contact Sales to learn more about our product and get started.
        </p>
      </div>
    </div>
  );
};

export default AuthenticationPrompt;
