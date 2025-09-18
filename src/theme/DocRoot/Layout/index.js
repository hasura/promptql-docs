import React, { useState, useEffect } from 'react';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';
import BrowserOnly from '@docusaurus/BrowserOnly';
import posthog from 'posthog-js';
import { initOpenReplay, startOpenReplayTracking } from '@site/src/components/OpenReplay/OpenReplay';
import { useColorMode } from '@docusaurus/theme-common';
import { useAuth } from '@site/src/contexts/AuthContext';
import { getAuthConfig } from '@site/src/config/auth';
import * as Sentry from '@sentry/react';

export default function DocRootLayout({ children }) {
  const { colorMode } = useColorMode();
  const { isAuthenticated, isLoading } = useAuth();
  const authConfig = getAuthConfig();
  const sidebar = useDocsSidebar();
  const location = useLocation();
  const isBrowser = useIsBrowser();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasInitializedOpenReplay, setHasInitializedOpenReplay] = useState(false);

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
      {/* Only show chatbot for authenticated users or when auth is disabled */}
      {(isAuthenticated || authConfig.isAuthDisabled) && !isLoading && (
        <BrowserOnly>
          {() => {
            const PromptQLChatComponent = React.lazy(() =>
              import("promptql-chat-sdk").then(module => ({ default: module.PromptQLChat }))
            );
            return (
              <React.Suspense fallback={<div>Loading chat...</div>}>
                <PromptQLChatComponent endpoint="https://docsql-proxy-710071984479.us-west2.run.app" themeMode={colorMode} title='DocsQL' primaryColor='var(--chat-user-bg)'/>
              </React.Suspense>
            );
          }}
        </BrowserOnly>
      )}
    </div>
  );
}
