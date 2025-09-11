import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import OriginalLayout from '@theme-original/Layout';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

interface LayoutProps {
  children: React.ReactNode;
}

// Layout component that uses the auth context (provided by Root)
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isLoading } = useAuth();
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

  // Define public paths that don't require authentication
  const publicPaths = [
    '/',           // Landing page
    '/docs/',      // Landing page with docs prefix
    '/docs/index', // Main docs index page (with embedded auth prompt)
    '/login',      // Login page
  ];

  // Check if current path is public
  const isPublicPath = publicPaths.some(path => {
    if (path === '/' || path === '/docs/') {
      return location.pathname === '/' || location.pathname === '/docs/';
    }
    if (path === '/docs/index') {
      return location.pathname === '/docs/index' || location.pathname === '/docs/index/';
    }
    return location.pathname.startsWith(path);
  });

  // Show loading state during auth initialization
  if (isLoading) {
    if (!showLoader) {
      return <OriginalLayout>{null}</OriginalLayout>;
    }

    return (
      <OriginalLayout>
        <div className="auth-loading">
          <div className="auth-loading-spinner">
            <div className="auth-loading-dot"></div>
            <div className="auth-loading-dot"></div>
            <div className="auth-loading-dot"></div>
          </div>
          <p>Loading...</p>
        </div>
      </OriginalLayout>
    );
  }

  // If it's a public path, render without protection
  if (isPublicPath) {
    return <OriginalLayout>{children}</OriginalLayout>;
  }

  // For all other paths (including callback), use ProtectedRoute which handles callback internally
  return (
    <OriginalLayout>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </OriginalLayout>
  );
};

export default Layout;
