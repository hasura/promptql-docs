export const CATEGORY_CONFIG = {
  gettingStarted: {
    title: 'Getting Started',
    directories: ['quickstart', 'how-to-talk-to-promptql', 'what-can-promptql-do', 'decision-making', 'automation', 'add-context', 'autograph'],
    exactMatch: true,
  },
  coreConcepts: {
    title: 'Core Concepts', 
    directories: ['architecture', 'semantic-metadata', 'ai-primitives', 'data-sources', 'business-logic', 'auth', 'use-cases'],
    exactMatch: false,
  },
  buildingApps: {
    title: 'Building Apps',
    directories: ['project-configuration', 'how-to-build-with-promptql', 'how-to-build-your-semantic-layer', 'promptql-apis', 'tutorials'],
    exactMatch: true,
  },
  deployment: {
    title: 'Deployment & Operations',
    directories: ['deployment', 'observability', 'private-ddn', 'troubleshooting'],
    exactMatch: true,
  },
  guides: {
    title: 'Guides & Recipes',
    directories: ['recipes'],
    exactMatch: true,
  },
  reference: {
    title: 'Reference',
    directories: ['reference', 'help'],
    exactMatch: true,
  },
} as const;
