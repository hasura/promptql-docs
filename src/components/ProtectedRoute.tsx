import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  // Set up timer for delayed loader
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, 5000);

      return () => {
        clearTimeout(timer);
        setShowLoader(false);
      };
    } else {
      setShowLoader(false);
    }
  }, [isLoading]);

  // Allow callback path to pass through without authentication
  if (location.pathname === '/docs/callback') {
    return <>{children}</>;
  }

  if (isLoading) {
    if (!showLoader) {
      return null;
    }

    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner">
          <div className="auth-loading-dot"></div>
          <div className="auth-loading-dot"></div>
          <div className="auth-loading-dot"></div>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h1>Authentication Required</h1>
        <p>You need to be authenticated to access the PromptQL documentation.</p>
        <button
          onClick={login}
          className="auth-button"
        >
          <span>🔐</span>
          Sign In with Hasura Cloud
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
