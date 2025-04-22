import React from 'react';
import clsx from 'clsx';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';
import Logo from '@site/static/img/logo-light.svg';
import GithubIcon from '@site/static/icons/github.svg';
import TwitterIcon from '@site/static/icons/twitter.svg';
import DiscordIcon from '@site/static/icons/discord.svg';
import YoutubeIcon from '@site/static/icons/youtube.svg';
import LinkedinIcon from '@site/static/icons/linkedin.svg';

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
              <Logo />
            </div>
            <div className={styles.footerCopyright}>© {new Date().getFullYear()} Hasura Inc. All rights reserved</div>
            <div className={styles.footerSocial}>
              <a href="https://github.com/hasura" target="_blank" rel="noopener noreferrer">
                <GithubIcon />
              </a>
              <a href="https://twitter.com/HasuraHQ" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </a>
              <a href="https://discord.com/invite/hasura" target="_blank" rel="noopener noreferrer">
                <DiscordIcon />
              </a>
              <a href="https://www.youtube.com/@HasuraHQ" target="_blank" rel="noopener noreferrer">
                <YoutubeIcon />
              </a>
              <a href="https://www.linkedin.com/company/hasura" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
