type CategoryConfig = {
  title: string;
  directories: string[];
  exactMatch: boolean;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  gettingStarted: {
    title: 'Getting Started',
    directories: ['quickstart', 'capabilities', 'how-to-talk-to-promptql', 'decision-making', 'automation'],
    exactMatch: true,
  },
  coreConcepts: {
    title: 'Core Concepts', 
    directories: ['architecture', 'data-modeling', 'data-sources', 'business-logic', 'auth'],
    exactMatch: false,
  },
  buildingApps: {
    title: 'Building Apps',
    directories: ['project-configuration', 'how-to-build-with-promptql', 'promptql-apis', 'promptql-playground'],
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
};
