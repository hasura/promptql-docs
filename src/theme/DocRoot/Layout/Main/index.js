import React from 'react';
import clsx from 'clsx';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';
export default function DocRootLayoutMain({ hiddenSidebarContainer, children }) {
  const sidebar = useDocsSidebar();
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
              <img src="/img/logo-light.svg" alt="Hasura" />
            </div>
            <div className={styles.footerCopyright}>© {new Date().getFullYear()} Hasura Inc. All rights reserved</div>
            <div className={styles.footerSocial}>
              <a href="https://github.com/hasura" target="_blank" rel="noopener noreferrer">
                <img src="/icons/github.svg" alt="GitHub" />
              </a>
              <a href="https://twitter.com/HasuraHQ" target="_blank" rel="noopener noreferrer">
                <img src="/icons/twitter.svg" alt="X (Twitter)" />
              </a>
              <a href="https://discord.com/invite/hasura" target="_blank" rel="noopener noreferrer">
                <img src="/icons/discord.svg" alt="Discord" />
              </a>
              <a href="https://www.youtube.com/@HasuraHQ" target="_blank" rel="noopener noreferrer">
                <img src="/icons/youtube.svg" alt="YouTube" />
              </a>
              <a href="https://www.linkedin.com/company/hasura" target="_blank" rel="noopener noreferrer">
                <img src="/icons/linkedin.svg" alt="LinkedIn" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
