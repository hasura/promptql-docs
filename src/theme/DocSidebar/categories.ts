export const CATEGORY_CONFIG = {
  gettingStarted: {
    title: 'Getting Started',
    directories: ['quickstart', 'how-to-talk-to-promptql', 'capabilities', 'decision-making', 'automation'],
    exactMatch: true,
  },
  coreConcepts: {
    title: 'Core Concepts', 
    directories: ['data-modeling', 'data-sources', 'business-logic'],
    exactMatch: false,
  },
  buildingApps: {
    title: 'Building Apps',
    directories: ['how-to-build-with-promptql', 'promptql-apis', 'promptql-playground'],
    exactMatch: true,
  },
  deployment: {
    title: 'Deployment & Operations',
    directories: ['deployment', 'observability', 'private-ddn'],
    exactMatch: true,
  },
  guides: {
    title: 'Guides & Recipes',
    directories: ['recipes'],
    exactMatch: true,
  },
  reference: {
    title: 'Reference',
    directories: ['reference', 'billing', 'help'],
    exactMatch: true,
  },
} as const;
