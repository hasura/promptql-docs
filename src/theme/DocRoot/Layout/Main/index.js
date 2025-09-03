import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import { useAuth } from '@site/src/contexts/AuthContext';
import { getAuthConfig } from '@site/src/config/auth';
import styles from './styles.module.css';
import Logo from '@site/static/img/logo-light.svg';
import GithubIcon from '@site/static/icons/github.svg';
import TwitterIcon from '@site/static/icons/twitter.svg';
import DiscourseIcon from '@site/static/icons/discourse.svg';
import YoutubeIcon from '@site/static/icons/youtube.svg';
import LinkedinIcon from '@site/static/icons/linkedin.svg';
import PromptQlIcon from '@site/static/img/icon-light.svg';

export default function DocRootLayoutMain({ hiddenSidebarContainer, children }) {
  const sidebar = useDocsSidebar();
  const { isAuthenticated, isLoading, login } = useAuth();
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

  // Define public paths that don't require authentication
  const publicPaths = [
    '/',           // Landing page
    '/docs/',      // Landing page with docs prefix
    '/login',      // Login page
  ];

  // Check if current path is public or callback
  const isPublicPath = publicPaths.some(path => {
    if (path === '/' || path === '/docs/') {
      return location.pathname === '/' || location.pathname === '/docs/';
    }
    return location.pathname.startsWith(path);
  });

  // Allow callback path to pass through without authentication
  const isCallbackPath = location.pathname === '/docs/callback';

  // Determine if content should be protected
  const shouldProtectContent = !isPublicPath && !isCallbackPath && !authConfig.isAuthDisabled;

  // Render loading state if needed
  if (shouldProtectContent && isLoading && showLoader) {
    return (
      <main
        className={clsx(styles.docMainContainer, (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced)}
      >
        <div
          className={clsx(
            'container padding-top--md padding-bottom--lg',
            styles.docItemWrapper,
            hiddenSidebarContainer && styles.docItemWrapperEnhanced
          )}
        >
          <div className="auth-loading">
            <div className="auth-loading-spinner">
              <div className="auth-loading-dot"></div>
              <div className="auth-loading-dot"></div>
              <div className="auth-loading-dot"></div>
            </div>
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  // Render authentication required state
  if (shouldProtectContent && !isAuthenticated) {
    return (
      <main
        className={clsx(styles.docMainContainer, (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced)}
      >
        <div
          className={clsx(
            'container padding-top--md padding-bottom--lg',
            styles.docItemWrapper,
            hiddenSidebarContainer && styles.docItemWrapperEnhanced
          )}
        >
          <div className="auth-required">
            <div>
              <h1>Secure Client Login</h1>
              <p>Access to these pages is limited to verified client organizations. Please sign in with your work email to proceed.</p>
              <button
                onClick={login}
                className="auth-button"
              >
                <span>🔐</span>
                Sign In with Hasura Cloud
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Render normal content
  return (
    <main
      className={clsx(styles.docMainContainer, (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced)}
    >
      <div
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
      >
        {children}
        <div id="hasura-footer" className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <Logo />
            </div>
            <div className={styles.footerCopyright}>© {new Date().getFullYear()} Hasura Inc. All rights reserved</div>
            <div className={styles.footerSocial}>
              <a href="https://promptql.io" target="_blank" rel="noopener noreferrer">
                <PromptQlIcon />
              </a>
              <a href="https://github.com/hasura" target="_blank" rel="noopener noreferrer">
                <GithubIcon />
              </a>
              <a href="https://x.com/PromptQL" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </a>
              <a href="https://forum.promptql.io" target="_blank" rel="noopener noreferrer">
                <DiscourseIcon />
              </a>
              <a href="https://www.youtube.com/@PromptQL" target="_blank" rel="noopener noreferrer">
                <YoutubeIcon />
              </a>
              <a href="https://www.linkedin.com/company/promptql-io" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
