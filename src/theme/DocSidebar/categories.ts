type CategoryConfig = {
  title: string;
  directories: string[];
  exactMatch: boolean;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  gettingStarted: {
    title: 'Getting Started',
    directories: ['quickstart', 'capabilities', 'how-to-talk-to-promptql', 'decision-making', 'automation', 'evals'],
    exactMatch: true,
  },
  coreConcepts: {
    title: 'Core Concepts', 
    directories: ['architecture', 'metadata', 'ai-primitives'],
    exactMatch: false,
  },
  buildingApps: {
    title: 'Building Apps',
    directories: ['create-a-project', 'data-sources', 'create-and-run-builds', 'evaluate-accuracy', 'configure-your-project', 'business-logic', 'create-automations', 'promptql-apis'],
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
