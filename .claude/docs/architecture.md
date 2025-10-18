# Architecture & Tech Stack

## Overview

The PromptQL documentation site is a Docusaurus-based static site for documenting PromptQL and Hasura DDN features. The site includes interactive components, authentication, and is deployed via CloudFlare Pages.

## Core Technologies

### Framework
- **Docusaurus**: 3.7.0 (React-based static site generator)
- **React**: 18.0
- **TypeScript**: 5.2.2
- **Package Manager**: Yarn 4.9.1
- **Node Version**: 18.0.0+

## Key Features

### Documentation System
- MDX support for interactive documentation
- Versioning support (currently using "PromptQL" version)
- Mermaid diagrams for architecture documentation
- Math equations with KaTeX (remark-math + rehype-katex)
- Code syntax highlighting with Prism

### Custom Features
- **Authentication**: OAuth integration via Docker for local development
- **AI Chat Bot**: WebSocket-based docs assistant
- **Analytics**:
  - PostHog for user analytics
  - OpenReplay for session replay
  - Sentry for error monitoring
- **Public Projects**: Embedded PromptQL playground demos

### Styling
- TailwindCSS 3.3.5 + PostCSS
- Custom Docusaurus theming
- Responsive design

## Project Structure

```
promptql-docs/
├── docs/                         # Documentation content (MDX files)
│   ├── ai-primitives/           # AI/ML concepts
│   ├── auth/                    # Authentication guides
│   ├── business-logic/          # Business logic documentation
│   ├── data-sources/            # Data connector guides
│   ├── deployment/              # Deployment guides
│   ├── how-to-build-with-promptql/ # Tutorials
│   ├── metadata/                # Metadata layer docs
│   ├── observability/           # Monitoring & tracing
│   ├── private-ddn/             # Private deployment docs
│   ├── project-configuration/   # Project setup guides
│   ├── promptql-apis/           # API & SDK documentation
│   ├── promptql-playground/     # Playground features
│   ├── recipes/                 # Recipes & tutorials
│   ├── reference/               # CLI & API reference
│   └── index.mdx                # Homepage
│
├── src/                         # Custom React components
│   ├── components/              # Reusable components
│   ├── pages/                   # Custom pages
│   └── theme/                   # Docusaurus theme overrides
│
├── static/                      # Static assets
│   ├── img/                     # Images
│   └── fonts/                   # Custom fonts
│
├── utilities/                   # Build utilities
│   ├── auto-cli/                # CLI docs generator
│   ├── generate-metadata-docs/  # Metadata docs generator
│   ├── improve-front-matter-seo/ # SEO optimizer
│   └── update-cli-version/      # Version updater
│
├── scripts/                     # Development scripts
│   ├── dev.sh                   # Start dev server with OAuth
│   ├── build-local.sh           # Build and serve locally
│   └── stop-dev.sh              # Stop dev services
│
├── docusaurus.config.ts         # Docusaurus configuration
├── sidebars.ts                  # Sidebar structure
├── tailwind.config.cjs          # Tailwind configuration
├── tsconfig.json                # TypeScript config
├── custom-build-script.cjs      # Custom build logic
└── package.json                 # Dependencies & scripts
```

## Key Configuration Files

### docusaurus.config.ts
- Site metadata and URLs
- Plugin configuration
- Theme settings
- Custom fields for:
  - Docs bot WebSocket endpoint
  - Docs server API URL
  - Analytics integrations
  - Environment-specific routing

### sidebars.ts
Defines the documentation sidebar navigation structure

### custom-build-script.cjs
Custom build logic that:
- Generates LLM-optimized documentation bundles
- Handles environment-specific builds
- Processes documentation for AI consumption

## Development Workflow

### Local Development
```bash
yarn start                # Dev server with OAuth (http://localhost:3000)
yarn dev:stop             # Stop dev services
yarn serve                # Serve built files
```

### Content Management
```bash
yarn write-cli-docs       # Auto-generate CLI docs from CLI code
yarn write-metadata-docs  # Auto-generate metadata reference
yarn seo                  # Improve front matter SEO
yarn update-cli-version   # Update CLI version across docs
```

### Quality Checks
```bash
yarn lint                 # Check Prettier formatting
yarn format               # Auto-format with Prettier
yarn typecheck            # TypeScript type checking
```

### Build & Deploy
```bash
yarn build                # Production build (includes LLM bundle)
yarn build:local          # Build + serve locally with auth
```

## Deployment

### CloudFlare Pages
- **Production**: promptql.io/docs
- **Staging**: CF Pages preview deployments
- Environment detected via `CF_PAGES` env var

### Build Process
1. Docusaurus builds static site
2. Custom build script generates LLM documentation bundle
3. Static files deployed to CloudFlare Pages
4. CDN distribution worldwide

## Content Organization

### MDX Files
- All documentation in `/docs` as `.mdx` files
- Front matter for metadata:
  - `sidebar_position`: Order in sidebar
  - `sidebar_label`: Display name
  - `description`: SEO description
  - `keywords`: SEO keywords

### Reusable Components
- Partial MDX files prefixed with `_` (e.g., `_prereqs.mdx`)
- Import and reuse across documentation
- Reduces duplication

### Auto-Generated Content
- CLI reference docs (from CLI source code)
- Metadata reference docs (from metadata schemas)
- Version information

## Key Integrations

### Authentication
- OAuth via Docker Compose for local development
- JWT-based auth in production
- Integrates with Hasura auth service

### AI Chat Bot
- WebSocket connection to docs server
- Context-aware documentation assistant
- Uses PromptQL to query documentation

### Analytics Stack
- **PostHog**: User behavior and feature usage
- **OpenReplay**: Session replay for UX analysis
- **Sentry**: Error tracking and performance monitoring

## Best Practices

### Writing Documentation
- Use MDX for interactive examples
- Include code examples with syntax highlighting
- Add diagrams for complex concepts (Mermaid)
- Follow SEO best practices in front matter

### Component Development
- Follow React/TypeScript best practices
- Keep components in `/src/components`
- Use Docusaurus theme components when possible
- Test in multiple viewports

### Performance
- Optimize images before committing
- Use lazy loading for heavy components
- Keep bundle size small
- Leverage Docusaurus built-in optimizations

## Additional Resources

- [Docusaurus Docs](https://docusaurus.io/)
- [MDX Documentation](https://mdxjs.com/)
- [TailwindCSS Docs](https://tailwindcss.com/)
