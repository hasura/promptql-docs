# Development Guide

## Development Environment Setup

### Prerequisites
- Yarn 4.9.1+
- Node 18.0.0+
- Docker & Docker Compose (for OAuth authentication in development)

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/hasura/promptql-docs.git
cd promptql-docs

# 2. Install dependencies
yarn install

# 3. Start development server (includes OAuth setup)
yarn start  # Runs on http://localhost:3000
```

### Development Commands
```bash
yarn start                # Development server with OAuth auth
yarn dev:stop             # Stop development services
yarn build                # Production build (includes LLM bundle generation)
yarn build:local          # Production build + serve locally with auth
yarn serve                # Serve previously built files
yarn typecheck            # TypeScript type checking
yarn lint                 # Check code formatting
yarn format               # Auto-format code with Prettier
yarn clear                # Clear Docusaurus cache

# Utilities
yarn write-cli-docs       # Auto-generate CLI documentation
yarn write-metadata-docs  # Auto-generate metadata documentation
yarn seo                  # Improve front matter SEO
yarn update-cli-version   # Update CLI version references in docs
```

## Documentation Structure

### File Organization
```
docs/
├── ai-primitives/        # AI/ML concepts documentation
├── auth/                 # Authentication documentation
├── business-logic/       # Business logic guides
├── data-sources/         # Data connector documentation
├── deployment/           # Deployment guides
├── help/                 # Help/support documentation
├── architecture.mdx      # Architecture overview
├── automation.mdx        # Automation docs
└── [392 total doc files]

src/
├── components/           # React components (44 .tsx files)
│   ├── Benchmark/
│   ├── CustomFooter/
│   ├── OpenReplay/
│   └── ProtectedRoute.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx   # OAuth2 authentication logic
├── theme/                # Docusaurus theme customization
│   ├── Root.tsx
│   └── Layout/
├── pages/                # Custom React pages
│   ├── login.tsx
│   └── callback.tsx
└── css/                  # Custom stylesheets

static/
└── img/                  # Static images and assets

utilities/                # Helper scripts and tools
├── create-docs-ticket/
├── generate-metadata-docs/
├── improve-front-matter-seo/
├── one-click-llm/
└── update-cli-version/
```

## Writing Documentation

### Documentation Standards
- Use Markdown (.md) or MDX (.mdx) for all documentation
- Add proper frontmatter to all pages
- Use relative links for internal documentation
- Include alt text for all images
- Test all code examples
- Follow existing documentation patterns

### Page Template
```markdown
---
title: Feature Name
description: Brief description for SEO (under 160 chars)
sidebar_position: 1
---

# Feature Name

[Introduction paragraph explaining the feature]

## Prerequisites

[What users need before following this guide]

- Requirement 1
- Requirement 2

## Getting Started

### Step 1: [Action]

[Detailed instructions]

\```language
// Code example
\```

### Step 2: [Action]

[More instructions]

## Configuration

[Configuration options and settings]

## Examples

### Basic Example

[Simple use case with code]

### Advanced Example

[Complex use case with code]

## Troubleshooting

### Common Issue 1

**Problem**: [Description]

**Solution**: [How to fix]

## Related

- [Link to related documentation](./related-doc.md)

## Next Steps

[What users should do next]
```

### Frontmatter Guidelines
```markdown
---
title: Page Title                      # Required: Displayed in navigation and page title
description: Brief page description    # Required: Used for SEO and page metadata
sidebar_position: 1                    # Optional: Controls order in sidebar
---
```

## Code Examples

### Example Guidelines
- All code examples must use proper syntax highlighting
- Include language identifier in code blocks
- Test examples to ensure they work
- Show complete, working examples
- Include error handling where relevant
- Use realistic variable names

### Example Format
```markdown
\```typescript
import { Something } from 'package';

// Clear comment explaining what this does
const result = await doSomething({
  param: 'value'
});

console.log(result);
\```
```

### Supported Languages
- TypeScript/JavaScript
- GraphQL
- JSON
- YAML
- Bash/Shell
- SQL
- Python
- Many more via Prism

## React Components

### Custom Components

The docs use custom React components for interactive content:

```tsx
import { MyComponent } from '@site/src/components/MyComponent';

<MyComponent prop="value" />
```

### Component Guidelines
- Place components in `src/components/`
- Use TypeScript for all components
- Export from component directory
- Include prop documentation
- Test components work in MDX

## Styling

### Using Tailwind CSS

```tsx
<div className="flex gap-4 p-6">
  <span>Content</span>
</div>
```

### Custom CSS
- Custom styles in `src/css/custom.css`
- Use CSS variables for theming
- Prefer Tailwind utilities when possible
- Follow existing style patterns

## Images and Assets

### Image Guidelines
- Place images in `static/img/`
- Use descriptive filenames
- Optimize images (< 200KB preferred)
- Always include alt text
- Use appropriate image formats (PNG for screenshots, SVG for diagrams)

### Image Usage
```markdown
![Alt text describing the image](/img/path/to/image.png)
```

### Taking Screenshots
- Use 1920x1080 resolution for desktop
- Capture only relevant content
- Use realistic demo data
- Ensure clean UI state
- Annotate if needed

## Authentication (Development)

### OAuth2 Setup
The docs site uses OAuth2 authentication in development:

**Services:**
- **Hydra OAuth2 Server** - Mock provider (ports 4444/4445)
- **Login/Consent App** - Mock login UI

**Starting Dev Server:**
```bash
yarn start  # Automatically starts Docker containers and Docusaurus
```

**Public Routes (No Auth):**
- `/` (landing)
- `/docs/` (docs landing)
- `/login`
- `/docs/callback`

**Protected Routes:**
- All other routes require authentication

## TypeScript Standards

### Type Checking
```bash
yarn typecheck  # Check TypeScript types
```

### TypeScript Guidelines
- Use proper types (avoid `any`)
- Define interfaces for props
- Use type imports when appropriate
- Follow existing type patterns

## Build Process

### Production Build
```bash
yarn build
```

**Build Process:**
1. Runs `docusaurus build`
2. Generates `llms-full.txt` (LLM documentation bundle)
3. Copies docs JSON schema to `/build/docs-schema.json`

### Testing Build Locally
```bash
yarn build:local  # Build + serve with auth for testing
```

## Quality Checks

### Pre-Commit Checklist
- [ ] All documentation builds successfully
- [ ] No TypeScript errors
- [ ] Code is properly formatted (Prettier)
- [ ] All links work
- [ ] Images display properly
- [ ] Code examples are tested
- [ ] Frontmatter is complete
- [ ] SEO metadata is optimized

### Running Checks
```bash
yarn lint                 # Check formatting
yarn format               # Auto-format
yarn typecheck            # Check types
yarn build                # Verify build
```

## SEO Optimization

### SEO Best Practices
- Clear, descriptive page titles
- Concise meta descriptions (< 160 chars)
- Proper heading hierarchy (H1 → H2 → H3)
- Descriptive URLs
- Internal linking
- Alt text for images

### SEO Utility
```bash
yarn seo  # Improve front matter SEO automatically
```

## Accessibility (A11Y)

### A11Y Requirements
- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Add alt text to all images
- Proper heading hierarchy

### A11Y Example
```markdown
![Clear description of what the image shows](/img/screenshot.png)
```

## Link Management

### Internal Links
```markdown
- Use relative paths: [Related Guide](./related-guide.md)
- Link to sections: [Section](#section-heading)
- Cross-reference: [Other Doc](../other/doc.md)
```

### External Links
```markdown
- Include full URLs: [External](https://example.com)
- Open in new tab if appropriate
- Verify links work
```

## Git Workflow

### Branch Naming
```bash
docs/DOC-123-short-description
```

### Commit Messages
```bash
git commit -m "docs: add authentication guide

- Added OAuth2 setup instructions
- Included troubleshooting section
- Added code examples"
```

## Common Issues

### Build Fails
**Problem**: Documentation fails to build

**Solutions:**
1. Check for broken MDX syntax
2. Verify all imports exist
3. Check frontmatter format
4. Review error messages in build output

### Links Break
**Problem**: Internal links don't work

**Solutions:**
1. Use relative paths (`./file.md` not `/docs/file.md`)
2. Verify target file exists
3. Check for typos in paths
4. Test links in dev server

### Images Don't Display
**Problem**: Images not showing

**Solutions:**
1. Verify image is in `static/img/`
2. Check path starts with `/img/` not `/static/img/`
3. Verify filename is correct
4. Check image file exists

## Development Workflow

### Typical Workflow
1. Create branch: `docs/DOC-123-feature-name`
2. Start dev server: `yarn start`
3. Make changes to documentation
4. Test locally at `http://localhost:3000`
5. Run quality checks
6. Create pull request
7. Address review feedback
8. Merge when approved

### Hot Reload
- Documentation changes hot-reload automatically
- Component changes may require restart
- Config changes require restart

## Reference

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
