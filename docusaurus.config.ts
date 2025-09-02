import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

require('dotenv').config();

const DOCS_SERVER_ROOT_URLS = {
  development: 'localhost:8000',
  production: 'website-api.hasura.io',
  staging: 'website-api.stage.hasura.io',
};

const DOCS_SERVER_URLS = {
  development: `http://${DOCS_SERVER_ROOT_URLS.development}`,
  production: `https://${DOCS_SERVER_ROOT_URLS.production}/docs-services/docs-server`,
  staging: `https://${DOCS_SERVER_ROOT_URLS.staging}/docs-services/docs-server`,
};

const BOT_ROUTES = {
  development: `ws://${DOCS_SERVER_ROOT_URLS.development}/bot/query`,
  production: `wss://${DOCS_SERVER_ROOT_URLS.production}/docs-services/docs-server/bot/query`,
  staging: `wss://${DOCS_SERVER_ROOT_URLS.staging}/docs-services/docs-server/bot/query`,
};

const config: Config = {
  title: 'PromptQL Docs',
  tagline: 'Talk to all your data accurately with natural language',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://promptql.io',

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.CF_PAGES === '1' ? '/' : '/docs',
  trailingSlash: true,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hasura', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  staticDirectories: ['static', 'public'],

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  customFields: {
    docsBotEndpointURL: (() => {
      if (process.env.CF_PAGES === '1') {
        return BOT_ROUTES.staging; // if we're on CF pages, use the staging environment
      } else {
        const mode = process.env.release_mode;
        if (mode === 'staging') {
          return BOT_ROUTES.production; // use production route for staging
        }
        return BOT_ROUTES[mode ?? 'development'];
      }
    })(),
    docsServerURL: (() => {
      if (process.env.CF_PAGES === '1') {
        return DOCS_SERVER_URLS.staging; // if we're on CF pages, use the staging environment
      } else {
        const mode = process.env.release_mode;
        if (mode === 'staging') {
          return DOCS_SERVER_URLS.production; // use production route for staging
        }
        return DOCS_SERVER_URLS[mode ?? 'development'];
      }
    })(),
    hasuraVersion: "promptql",
    DEV_TOKEN: process.env.DEV_TOKEN,
    isPreviewPR: process.env.CF_PAGES === '1' && process.env.release_mode !== 'production' && process.env.release_mode !== 'staging',
    openReplayIngestPoint: 'https://analytics-openreplay.hasura-app.io/ingest',
    openReplayProjectKey: 'x5WnKn7RdPjizi93Vp5I',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          editUrl: ({ docPath }) => `https://github.com/hasura/promptql-docs/edit/main/docs/${docPath}`,
          breadcrumbs: true,
          // showLastUpdateAuthor: true,
          // showLastUpdateTime: true,
          lastVersion: 'current',
          versions: {
            current: {
              label: 'PromptQL',
              badge: true,
            },
          },
          sidebarCollapsible: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        googleTagManager: {
          containerId: 'GTM-PF5MQ2Z',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    async function tailwind(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    // Replace with your project's social card
    image: 'img/og-promptql.jpg',
    algolia: {
      appId: 'FWSSPB5BLA',
      // Public API key: it is safe to commit it
      apiKey: '2d6b3d71bbd36bdc4e6244526db0c13a',
      indexName: 'promptql',
    },
    navbar: {
      title: '',
      hideOnScroll: true,
      logo: {
        alt: 'PromptQL Logo',
        src: 'img/pql-logo-large.svg',
        href: '/index',
        srcDark: '/img/pql-logo-large-dark-mode.svg',
      },
      items: [
      ],
    },
    prism: {
      theme: prismThemes.dracula,
      additionalLanguages: ['json', 'typescript', 'bash', 'yaml'],
    },
    
  } satisfies Preset.ThemeConfig,
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
      rel: 'stylesheet',
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
      rel: 'stylesheet',
    },
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
