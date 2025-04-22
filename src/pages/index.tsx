import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            placeItems: `center`,
          }}
        >
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <Link className="button button--primary button--lg" id="hasura-promptql-docs-main-button" to="/index">
            Hasura PromptQL Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Hasura gives you instant GraphQL APIs on your data sources. Point Hasura to your preferred internal and external data sources, setup relationships and security rules on your data models across sources and get a managed unified GraphQL API to build modern applications, instantly."
    >
      <HomepageHeader />
      <main></main>
    </Layout>
  );
}
