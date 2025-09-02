import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/docs/';
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner">
          <div className="auth-loading-dot"></div>
          <div className="auth-loading-dot"></div>
          <div className="auth-loading-dot"></div>
        </div>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="auth-login-container">
      <div className="auth-login-card">
        <h1>Welcome to PromptQL Docs</h1>
        <p>
          Sign in with your Hasura Cloud account to access the PromptQL documentation.
        </p>

        <button
          onClick={login}
          className="auth-button"
        >
          <span>🔐</span>
          Sign In with Hasura Cloud
        </button>

        <div className="auth-login-footer">
          <p>
            Don't have a Hasura Cloud account?{' '}
            <a
              href="https://cloud.hasura.io/signup"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
