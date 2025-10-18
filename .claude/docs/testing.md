# Testing Guide

## Testing Philosophy

The PromptQL documentation site testing focuses on:
- **Content validation**: Ensuring docs build without errors
- **Link integrity**: No broken internal or external links
- **Component testing**: Custom React components work correctly
- **Visual regression**: Screenshots match expected appearance
- **Accessibility**: Documentation is accessible to all users

---

## Build Validation (Primary Testing)

### Production Build Test
The most important test is ensuring the site builds successfully:

```bash
yarn build
```

This validates:
- ✅ All MDX files parse correctly
- ✅ All internal links resolve
- ✅ All imports are valid
- ✅ TypeScript compiles without errors
- ✅ Custom build script runs successfully

**Run before every commit and PR.**

---

## Link Checking

### Internal Links
Docusaurus automatically validates internal links during build:

```bash
yarn build
# Will fail if any internal links are broken
```

### External Links
For checking external links, use a link checker tool periodically:

```bash
# After building
npx linkinator build/ --recurse --skip "localhost|127.0.0.1"
```

**Best practices**:
- Check external links monthly
- Update or remove dead links
- Consider using archived versions for critical references

---

## TypeScript Type Checking

Ensure all TypeScript code (custom components, config files) is type-safe:

```bash
yarn typecheck
```

**What it checks**:
- Custom React components in `/src`
- Docusaurus config files
- Theme overrides
- Plugin configurations

---

## Linting & Formatting

### Prettier Formatting
```bash
yarn lint          # Check formatting
yarn format        # Auto-fix formatting
```

**Checks**:
- Consistent spacing and indentation
- Trailing newlines
- Line length limits (where applicable)
- Quote consistency

**Run before committing** to avoid CI failures.

---

## Testing Custom Components

### Manual Component Testing

For custom React components in `/src/components`:

1. **Create a test page**:
```bash
# Create src/pages/component-test.tsx
```

2. **Import and test the component**:
```tsx
import React from 'react';
import MyComponent from '@site/src/components/MyComponent';

export default function ComponentTest() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Component Test Page</h1>
      <MyComponent />
    </div>
  );
}
```

3. **View at** `http://localhost:3000/component-test`

4. **Test**:
- Visual appearance
- Interactions (clicks, hovers)
- Responsive behavior
- Different states (loading, error, success)

### Component Checklist
- [ ] Renders without console errors
- [ ] Works on mobile viewport
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Handles error states gracefully
- [ ] Loading states work correctly
- [ ] TypeScript types are correct

---

## Visual Regression Testing

### Manual Visual Testing

For visual changes, test across viewports:

**Desktop** (1920x1080)
- Full navigation visible
- Content layout correct
- Code blocks render properly

**Tablet** (768x1024)
- Mobile nav toggle works
- Content remains readable
- Images scale appropriately

**Mobile** (375x667)
- Touch targets adequate size
- No horizontal scroll
- Content stacks correctly

### Browser Testing

Test in multiple browsers:
- ✅ Chrome (primary)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Focus areas**:
- Code syntax highlighting
- Mermaid diagrams
- Custom components
- Authentication flow

---

## Accessibility Testing

### Manual Accessibility Checks

**Keyboard Navigation**:
```
Tab       - Navigate forward
Shift+Tab - Navigate backward
Enter     - Activate links/buttons
Esc       - Close modals/dropdowns
```

**Screen Reader Testing**:
- Use VoiceOver (Mac) or NVDA (Windows)
- Navigate through documentation
- Ensure all content is announced
- Check ARIA labels on interactive elements

### Accessibility Checklist
- [ ] All images have alt text
- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] Links have descriptive text (not "click here")
- [ ] Color contrast meets WCAG AA standards
- [ ] Forms have proper labels
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Automated Accessibility
Use browser extensions for quick checks:
- **axe DevTools** (Chrome/Firefox)
- **Lighthouse** (Chrome DevTools → Audits)

---

## Testing Interactive Features

### Authentication Flow
```bash
# Test local OAuth
yarn start
# Navigate to docs requiring auth
# Verify login flow works
```

**Test scenarios**:
- [ ] Login redirects correctly
- [ ] Protected pages require auth
- [ ] Logout works
- [ ] Session persists on refresh

### AI Chat Bot
- [ ] WebSocket connects successfully
- [ ] Bot responds to queries
- [ ] Error states handled gracefully
- [ ] Conversation history works

### Search Functionality
- [ ] Search returns relevant results
- [ ] Search keyboard shortcuts work (Cmd/Ctrl + K)
- [ ] Search highlights matched terms

---

## Testing Auto-Generated Content

### CLI Documentation
```bash
yarn write-cli-docs
```

**Verify**:
- [ ] All CLI commands documented
- [ ] Examples are correct
- [ ] Links work
- [ ] Formatting consistent

### Metadata Documentation
```bash
yarn write-metadata-docs
```

**Verify**:
- [ ] All metadata types documented
- [ ] Schema examples valid
- [ ] Cross-references work

---

## Testing Deployment

### Local Production Build
```bash
yarn build:local
```

This tests:
- Production build process
- Authentication in production mode
- Static asset serving
- Environment-specific configs

**Access at**: `http://localhost:3000`

### CloudFlare Pages Preview
Every PR creates a preview deployment:

1. Check PR for CloudFlare Pages comment
2. Visit preview URL
3. Test navigation and features
4. Verify environment-specific behavior

---

## SEO Testing

### Front Matter Validation
Check every new/edited page has proper SEO:

```mdx
---
sidebar_position: 1
sidebar_label: Page Title
description: "Clear, concise description for search results"
keywords:
  - keyword1
  - keyword2
  - keyword3
---
```

### SEO Checklist
- [ ] Description is 50-160 characters
- [ ] Keywords are relevant
- [ ] Title is clear and descriptive
- [ ] No duplicate descriptions across pages

### Test with Tools
- **Lighthouse SEO Audit**: Chrome DevTools
- **Meta Tag Checker**: View page source

---

## Performance Testing

### Build Performance
```bash
time yarn build
```

**Benchmarks**:
- Full build: < 5 minutes (typical)
- Incremental build: < 30 seconds

If builds are slow:
- Clear cache: `yarn clear`
- Check for large files
- Review custom build script

### Runtime Performance
Use Chrome DevTools Lighthouse:

```bash
yarn build:local
# Open http://localhost:3000
# Run Lighthouse audit
```

**Target scores**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

---

## Testing Utilities

### CLI Docs Generator
```bash
cd utilities/auto-cli
./scaffold.sh
```

**Verify**:
- Script runs without errors
- Generated docs are valid MDX
- Examples work correctly

### Metadata Docs Generator
```bash
cd utilities/generate-metadata-docs
npm run start
```

**Verify**:
- Schema validation passes
- Generated docs build successfully
- Links are valid

### SEO Improver
```bash
yarn seo
```

**Review**:
- Suggested changes make sense
- Front matter improvements applied
- No formatting broken

---

## Pre-Commit Testing Checklist

Before committing changes:

```bash
# 1. Format code
yarn format

# 2. Check formatting
yarn lint

# 3. Type check
yarn typecheck

# 4. Build test
yarn build
```

**All must pass** before pushing to remote.

---

## Pre-PR Testing Checklist

Before creating a PR:

- [ ] Local build succeeds (`yarn build`)
- [ ] Type checking passes (`yarn typecheck`)
- [ ] Formatting is correct (`yarn lint`)
- [ ] Tested in browser (desktop + mobile)
- [ ] Links work (internal and external)
- [ ] Images display correctly
- [ ] No console errors
- [ ] SEO metadata present
- [ ] Accessibility checked
- [ ] Authentication works (if applicable)

---

## CI/CD Testing

### Automated Checks
On every PR, CI runs:

1. **Install**: Dependencies installation
2. **Type Check**: TypeScript validation
3. **Lint**: Prettier formatting check
4. **Build**: Production build test

**All must pass** before merge.

### Manual Verification
After CI passes:

1. Review CloudFlare Pages preview
2. Test navigation and links
3. Verify visual appearance
4. Check mobile responsiveness

---

## Regression Testing

When making significant changes:

### Before Changes
```bash
yarn build
yarn serve
# Take screenshots of affected pages
```

### After Changes
```bash
yarn build
yarn serve
# Compare screenshots
# Verify no unintended changes
```

---

## Testing Best Practices

### Documentation Changes
- Always build locally before committing
- Test links in both development and production builds
- Review changes in browser, not just editor
- Check mobile view for responsive issues

### Component Changes
- Test all component states
- Verify TypeScript types
- Check accessibility
- Test in multiple browsers

### Configuration Changes
- Test both development and production builds
- Verify environment-specific behavior
- Check CloudFlare Pages preview
- Ensure analytics still work

---

## Quick Test Commands

```bash
# Full test suite
yarn format && yarn lint && yarn typecheck && yarn build

# Quick validation
yarn build

# Component testing
yarn start
# Navigate to /component-test

# Production testing
yarn build:local

# Clean slate
yarn clear && yarn start
```

---

## Additional Resources

- [Docusaurus Testing Docs](https://docusaurus.io/docs/testing)
- [MDX Specification](https://mdxjs.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
