import React, { useState, useEffect } from 'react';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';
import posthog from 'posthog-js';
import { initOpenReplay, startOpenReplayTracking } from '@site/src/components/OpenReplay/OpenReplay';
import { ChatWidget } from '@site/src/components/Bot';
import { useColorMode } from '@docusaurus/theme-common';
import { useAuth } from '@site/src/contexts/AuthContext';
import { getAuthConfig } from '@site/src/config/auth';
import * as Sentry from '@sentry/react';

export default function DocRootLayout({ children }) {
  const { colorMode } = useColorMode();
  const { isAuthenticated } = useAuth();
  const sidebar = useDocsSidebar();
  const location = useLocation();
  const isBrowser = useIsBrowser();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasInitializedOpenReplay, setHasInitializedOpenReplay] = useState(false);
  const authConfig = getAuthConfig();

  useEffect(() => {
    if (isBrowser && !hasInitialized) {
      Sentry.init({
        dsn: "https://5f0380cc3f997fa07e9b8bfd46ce87b7@o417608.ingest.us.sentry.io/4508382452318208",
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        beforeSend(event) {
          return event;
        },
      });
      (async () => {
        try {
          await initOpenReplay();
          setHasInitializedOpenReplay(true);
        } catch (error) {
          console.error('Failed to initialize OpenReplay:', error);
        }
      })();

      posthog.init('phc_MZpdcQLGf57lyfOUT0XA93R3jaCxGsqftVt4iI4MyUY', {
        api_host: 'https://analytics-posthog.hasura-app.io',
      });

      setHasInitialized(true);
    }
  }, [isBrowser, hasInitialized]);

  useEffect(() => {
    if (isBrowser && hasInitializedOpenReplay && window.location.hostname != 'localhost') {
      startOpenReplayTracking();
    }
  }, [hasInitializedOpenReplay]);

  useEffect(() => {
    if (isBrowser && hasInitialized) {
      posthog.capture('$pageview');
    }

    const getUser = async () => {
      try {
        // const user = await fetchUser();
        // TODO: When the CORS domains in Lux are updated, uncomment this and test on stage.hasura.io
        // posthog.identify(user.data.users[0]?.id, { email: user.data.users[0]?.email });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, [location]);

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

  const isCallbackPath = location.pathname === '/docs/callback';

  // Show ChatWidget if auth is disabled, on public paths, or if user is authenticated
  const shouldShowChatWidget = authConfig.isAuthDisabled || isPublicPath || isCallbackPath || isAuthenticated;

  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />
      <div className={styles.docRoot}>
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>{children}</DocRootLayoutMain>
      </div>
      {shouldShowChatWidget && (
        <ChatWidget
          apiEndpoint="https://pql-docs-bot-710071984479.us-west2.run.app/"
          theme={colorMode}
          brandColor="var(--chat-bubble-brand)"
          placeholder="Ask me about PromptQL..."
          welcomeMessage="Hi! I'm here to help you with PromptQL. What would you like to know?"
        />
      )}
    </div>
  );
}
