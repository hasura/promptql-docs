import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  contactInfo?: string;
  className?: string;
}

/**
 * Access denied component for users who authenticate successfully but don't have access
 * Shows a nicer error page than the generic error message
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Access Not Available",
  message = "Thanks for signing in. It looks like you’re not a PromptQL user yet.",
  contactInfo = "Please contact your AI strategist to grant you access for reading through the documentation and for creating PromptQL projects.",
  className = ""
}) => {
  const { logout } = useAuth();

  const handleTryDifferentAccount = () => {
    logout();
    // After logout, user will be redirected to login
  };

  return (
    <div className={`access-denied-container ${className}`}>
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <span>🔒</span>
        </div>
        <h1>{title}</h1>
        <div className="access-denied-content">
          <p className="access-denied-message">{message}</p>
          <p className="access-denied-contact">{contactInfo}</p>
        </div>
        <div className="access-denied-actions">
          <button
            onClick={handleTryDifferentAccount}
            className="auth-button access-denied-button"
          >
            Try Different Account
          </button>
          <a
            href="https://promptql.io"
            target="_blank"
            rel="noopener noreferrer"
            className="access-denied-link"
          >
            Learn More About PromptQL
          </a>
        </div>
        <div className="access-denied-footer">
          <p>
            Need help? Visit our{' '}
            <a
              href="https://forum.promptql.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PromptQL Forum
            </a>{' '}
            or contact your sales representative.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
