import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '../contexts/AuthContext';
import { getAuthConfig } from '../config/auth';
import DocsIndexContent from './DocsIndexContent';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const authConfig = getAuthConfig();

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

  // If auth is disabled (e.g., PR previews), allow access without authentication
  if (authConfig.isAuthDisabled) {
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
      <div className="container margin-vert--lg">
        <DocsIndexContent showSidebarController={false} showTitle={true} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
