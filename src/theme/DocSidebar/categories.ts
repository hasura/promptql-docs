export const CATEGORY_CONFIG = {
  gettingStarted: {
    title: 'Getting Started',
    directories: ['quickstart', 'data-source-patterns', 'how-to-build-with-promptql'],
    exactMatch: true,
  },
  coreConcepts: {
    title: 'Talk to Your Data', 
    directories: ['how-to-talk-to-promptql', 'promptql-playground', 'promptql-apis'],
    exactMatch: false,
  },
  buildingApps: {
    title: 'Modeling Data',
    directories: ['data-modeling', 'data-sources', 'business-logic', 'auth', 'project-configuration'],
    exactMatch: true,
  },
  deployment: {
    title: 'Operations & Deployment',
    directories: ['deployment', 'observability', 'private-ddn'],
    exactMatch: true,
  },
  guides: {
    title: 'Recipes',
    directories: ['recipes'],
    exactMatch: true,
  },
  reference: {
    title: 'Reference & Help',
    directories: ['reference', 'billing', 'help'],
    exactMatch: true,
  },
} as const;
