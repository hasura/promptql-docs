import { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '../contexts/AuthContext';
import { getAuthConfig } from '../config/auth';

/**
 * Component that controls sidebar visibility on the index page based on authentication status
 * Adds CSS class to hide sidebar for unauthenticated users only
 */
export const IndexPageSidebarController: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const authConfig = getAuthConfig();
  const location = useLocation();

  useEffect(() => {
    // Don't modify anything if auth is disabled (e.g., PR previews)
    if (authConfig.isAuthDisabled) {
      return;
    }

    if (isLoading) {
      return;
    }

    const body = document.body;
    const className = 'show-sidebar-authenticated';

    // Add data attribute to help with CSS targeting
    body.setAttribute('data-index-page-auth', isAuthenticated ? 'true' : 'false');

    if (isAuthenticated) {
      // Add class to show sidebar for authenticated users
      body.classList.add(className);
    } else {
      // Remove class to hide sidebar for unauthenticated users
      body.classList.remove(className);
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      body.classList.remove(className);
    };
  }, [isAuthenticated, isLoading, authConfig.isAuthDisabled]);

  // This component doesn't render anything
  return null;
};

export default IndexPageSidebarController;
