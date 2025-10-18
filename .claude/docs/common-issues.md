# Common Issues & Solutions

Quick reference for troubleshooting common problems in the PromptQL documentation site.

---

## Build Issues

### ❌ Problem: Docusaurus build fails with broken links

```bash
Error: Docusaurus found broken links!

Please check:
- /docs/some-page.mdx -> links to /nonexistent-page
```

**Why?** Docusaurus validates all internal links during build and fails on broken links.

**Solution**:
- Fix the broken link to point to a valid page
- Remove the link if the target page doesn't exist
- Use `onBrokenLinks: 'warn'` in `docusaurus.config.ts` only for debugging (never commit this)

---

### ❌ Problem: Build fails with "Module not found"

```bash
Error: Cannot find module 'some-package'
```

**Why?** Dependencies aren't installed or yarn.lock is out of sync.

**Solution**:
```bash
rm -rf node_modules yarn.lock
yarn install
```

---

### ❌ Problem: TypeScript errors during build

```bash
Type error: Property 'foo' does not exist on type 'Bar'
```

**Solution**:
```bash
yarn typecheck  # Check types locally
```

Fix TypeScript errors before committing. Common issues:
- Missing type definitions for custom components
- Incorrect prop types in MDX components
- Missing imports

---

## MDX Issues

### ❌ Problem: MDX component not rendering

```mdx
<!-- ❌ Wrong: Component not imported -->
<MyComponent />
```

```mdx
<!-- ✅ Correct: Import component first -->
import MyComponent from '@site/src/components/MyComponent';

<MyComponent />
```

**Why?** MDX requires explicit imports for custom components.

**Solution**: Import all custom components at the top of the MDX file.

---

### ❌ Problem: Front matter not working

```mdx
<!-- ❌ Wrong: Invalid YAML -->
---
sidebar_position: 1
description: This description has: unescaped colons
---
```

```mdx
<!-- ✅ Correct: Quoted strings with special chars -->
---
sidebar_position: 1
description: "This description has: properly quoted colons"
keywords:
  - keyword1
  - keyword2
---
```

**Why?** YAML front matter has strict syntax rules.

**Solution**:
- Quote strings with colons, quotes, or special characters
- Use arrays for multi-value fields like keywords
- Validate YAML syntax

---

### ❌ Problem: Code blocks not highlighting correctly

```mdx
<!-- ❌ Wrong: Invalid language identifier -->
```typescript jsx
code here
`` `
```

```mdx
<!-- ✅ Correct: Use tsx for TypeScript + JSX -->
`` `tsx
code here
`` `
```

**Common language identifiers**:
- `bash` - Shell commands
- `typescript` - TypeScript
- `tsx` - TypeScript + JSX
- `javascript` - JavaScript
- `jsx` - JavaScript + JSX
- `graphql` - GraphQL queries
- `json` - JSON
- `yaml` - YAML config files

---

## Development Server Issues

### ❌ Problem: Dev server won't start

```bash
Error: Port 3000 is already in use
```

**Solution**:
```bash
yarn dev:stop  # Stop any running services
# OR manually kill the process
lsof -ti:3000 | xargs kill -9
yarn start
```

---

### ❌ Problem: OAuth authentication not working locally

```bash
Error: OAuth service not available
```

**Why?** Docker Compose services aren't running.

**Solution**:
```bash
# Check Docker is running
docker ps

# Restart dev environment
yarn dev:stop
yarn start
```

The `yarn start` script automatically starts required Docker services.

---

### ❌ Problem: Changes not showing in browser

**Why?** Hot reload didn't trigger or cache issue.

**Solution**:
1. Save the file again
2. Refresh browser (Cmd/Ctrl + R)
3. Hard refresh (Cmd/Ctrl + Shift + R)
4. Clear Docusaurus cache:
```bash
yarn clear
yarn start
```

---

## Content Issues

### ❌ Problem: Sidebar item not appearing

**Why?**
- Missing `sidebar_position` in front matter
- File not in correct directory
- Sidebar configuration issue

**Solution**:
```mdx
---
sidebar_position: 2
sidebar_label: My Page Title
---
```

Or check `sidebars.ts` for manual sidebar configuration.

---

### ❌ Problem: Images not displaying

```mdx
<!-- ❌ Wrong: Incorrect path -->
![Alt text](./image.png)

<!-- ✅ Correct: Use /img or relative path -->
![Alt text](/img/my-image.png)
```

**Why?** Image paths must be relative to `/static/img` or use absolute paths.

**Solution**:
- Put images in `/static/img/`
- Reference with `/img/filename.png`
- Or use relative paths: `../img/filename.png`

---

### ❌ Problem: Mermaid diagram not rendering

```mdx
<!-- ❌ Wrong: No language identifier -->
`` `
graph TD
  A --> B
`` `

<!-- ✅ Correct: Use mermaid identifier -->
`` `mermaid
graph TD
  A --> B
`` `
```

**Why?** Docusaurus needs the `mermaid` language identifier to render diagrams.

---

## Build & Deploy Issues

### ❌ Problem: Build succeeds locally but fails in CI

**Common causes**:
1. **Environment variables missing**: Check CloudFlare Pages env vars
2. **Node version mismatch**: Ensure CI uses Node 18+
3. **Broken links**: Run `yarn build` locally to catch them

**Solution**:
```bash
# Test production build locally
yarn build

# Serve production build
yarn serve
```

---

### ❌ Problem: Custom build script fails

```bash
Error in custom-build-script.cjs
```

**Why?** The LLM bundle generation failed.

**Solution**:
1. Check `custom-build-script.cjs` for errors
2. Ensure all docs are valid MDX
3. Check build logs for specific file causing issues

---

## Formatting & Linting Issues

### ❌ Problem: Prettier check fails in CI

```bash
Checking formatting...
[warn] docs/some-file.mdx
```

**Solution**:
```bash
yarn format      # Auto-fix formatting
yarn lint        # Verify fixes
```

**Common issues**:
- Inconsistent spacing
- Missing trailing newlines
- Incorrect indentation

---

## Performance Issues

### ❌ Problem: Build takes too long

**Solutions**:
1. **Clear cache**: `yarn clear`
2. **Check for large files**: Optimize images before committing
3. **Reduce build scope**: Use `--no-minify` for faster dev builds

---

### ❌ Problem: Site loads slowly

**Common causes**:
- Large unoptimized images
- Too many external scripts
- Large JavaScript bundles

**Solutions**:
1. Optimize images (use WebP, compress)
2. Lazy load heavy components
3. Check bundle size with build analyzer

---

## Utility Script Issues

### ❌ Problem: CLI docs generation fails

```bash
yarn write-cli-docs
Error: CLI source not found
```

**Why?** The CLI repository must be available or the script needs updating.

**Solution**: Check the `utilities/auto-cli/scaffold.sh` script and ensure it points to the correct CLI source.

---

### ❌ Problem: Metadata docs generation fails

```bash
yarn write-metadata-docs
Error: Schema validation failed
```

**Solution**:
1. Check metadata schema files are valid
2. Review `utilities/generate-metadata-docs/` for errors
3. Ensure all required metadata files exist

---

## Getting Help

If you encounter an issue not covered here:

1. **Check Docusaurus docs**: https://docusaurus.io/docs
2. **Search GitHub issues**: https://github.com/hasura/promptql-docs/issues
3. **Ask the team**: Internal Slack channels
4. **Create an issue**: Document the problem with reproduction steps

---

## Quick Fixes Summary

```bash
# Most common fixes
yarn clear           # Clear Docusaurus cache
yarn dev:stop        # Stop dev services
rm -rf node_modules  # Nuclear option: fresh install
yarn install
yarn start

# Check for issues
yarn typecheck       # TypeScript errors
yarn lint            # Formatting issues
yarn build           # Production build test
```
