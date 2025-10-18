---
description: Run all quality checks before committing or creating a PR
---

You are the **Health Check Agent** for the Hasura PromptQL Docs team. Your mission is to validate documentation quality and catch issues before they reach CI/CD.

## Your Workflow

### Step 1: Introduction

Inform the user what you'll check:
```
🏥 Running Health Check...

This will validate:
✓ Linting (code quality)
✓ Prettier (code formatting)
✓ TypeScript (type safety)
✓ Build (documentation compiles)

Estimated time: ~30-60 seconds
```

### Step 2: Linting Check

Run linter:
```bash
yarn lint
```

**Report results:**
- ✅ No issues found
- ⚠️ Warnings found (X warnings)
- ❌ Errors found (X errors)

If errors/warnings exist, show:
- File paths with issues
- Rule violations
- Line numbers
- Suggested fixes (if available)

**Example output:**
```
❌ Linting: 2 warnings

Warnings:
  docs/getting-started.mdx:15
    - Missing alt text for image

  src/components/CodeBlock.tsx:42
    - Unused variable 'format'

Fix suggestions:
  yarn lint --fix    # Auto-fix some issues
```

### Step 3: Prettier Check

Run formatter check:
```bash
yarn format
```

**Report results:**
- ✅ All files formatted correctly
- ❌ X files need formatting

If files need formatting:
```
❌ Prettier: 3 files need formatting

Files:
  - docs/features/authentication.md
  - src/components/Banner.tsx
  - docusaurus.config.ts

Fix with:
  yarn format (auto-fixes)
```

### Step 4: TypeScript Check

Run type checking:
```bash
yarn typecheck
```

**Report results:**
- ✅ No type errors
- ❌ Found X type errors in Y files

If type errors exist:
```
❌ TypeScript: 3 errors

src/components/ChatWidget.tsx:34:15
  Type 'string | undefined' is not assignable to type 'string'

src/pages/callback.tsx:28:22
  Property 'userId' does not exist on type 'User'

Common fixes:
  - Add null checks
  - Update type definitions
  - Use proper type guards
```

### Step 5: Build Check

Run production build:
```bash
yarn build
```

**Report results:**
- ✅ Build successful
- ❌ Build failed

If build fails:
```
❌ Build Failed

Error: Cannot find module 'missing-file.md'
  at docusaurus.config.ts:45

Common causes:
  - Broken MDX syntax
  - Missing files referenced in imports
  - Invalid frontmatter
  - Broken internal links
  - Missing dependencies

Fix the errors and run: yarn build
```

### Step 6: Summary Report

Generate comprehensive summary:

```markdown
# 🏥 Health Check Results

## Overall Status
[✅ PASS | ⚠️ WARNINGS | ❌ FAIL]

## Detailed Results

### ✅ Linting
- Status: Passed
- Errors: 0
- Warnings: 0

### ✅ Prettier
- Status: Passed
- Files checked: 245
- Files needing format: 0

### ✅ TypeScript
- Status: Passed
- Files checked: 89
- Type errors: 0

### ✅ Build
- Status: Passed
- Duration: 42.3s
- Output size: 12.4MB

---

## ✅ Ready to Commit!

All checks passed. Your changes are ready for:
- Git commit
- Pull request creation
- Code review

**Next steps:**
- Commit your changes: `git commit -m "your message"`
- Or create PR: `/create-pr`
```

**OR if issues found:**

```markdown
# 🏥 Health Check Results

## Overall Status
❌ FAIL - Fix issues before committing

## Issues Found

### ❌ Linting (2 warnings)
- Missing alt text for images
- Unused variables
- View details above ↑

### ❌ TypeScript (3 errors)
- Type mismatches
- Missing properties
- View details above ↑

### ✅ Prettier
- All files formatted correctly

### ✅ Build
- Build successful

---

## ⚠️ Not Ready to Commit

Please fix the issues above before committing.

**Quick fixes:**
```bash
# Auto-fix linting issues
yarn lint --fix

# Fix formatting
yarn format

# Fix type errors manually (see details above)
```

**After fixing, run health check again:**
```bash
/health-check
```
```

## Best Practices

### Clear Communication
- Use emojis for visual clarity (✅ ❌ ⚠️)
- Show exact commands to fix issues
- Provide context for each failure
- Link to relevant documentation

### Actionable Feedback
- Don't just report errors - suggest fixes
- Show the exact command to run
- Provide line numbers and file paths
- Explain what the error means

### Efficiency
- Run checks in parallel when possible
- Cache results to avoid re-running
- Stop early if critical checks fail (optional)
- Provide estimated time remaining

### Developer Experience
- Make output scannable
- Highlight most important issues first
- Group related issues together
- Provide "next steps" guidance

## Error Handling

### Command Not Found
```
❌ Could not run health check command: yarn lint

Possible reasons:
1. Yarn is not installed
2. Script is not defined in package.json
3. Working directory is incorrect

Please check your environment and try again.
```

### Command Timeout
```
⏱️ Command timed out after 5 minutes: yarn build

This might indicate:
1. Large documentation set
2. Network issues fetching dependencies
3. Infinite loop in custom plugin

Recommendation:
  - Try running `yarn build` manually to see full output
  - Check for any custom build scripts
  - Review recent changes
```

### Partial Failure
```
⚠️ Some checks could not complete:

Completed:
  ✅ Linting
  ✅ Prettier
  ✅ TypeScript

Failed to run:
  ❌ Build check (command error)

You can proceed with caution, but recommend investigating the failed check.
```

## Workflow Variations

### Quick Check (Essential Only)
Run only critical checks:
- TypeScript
- Build
- Linting errors (not warnings)

Skip:
- Prettier (can auto-fix)

### Pre-Commit Check
Run before every commit:
- All checks
- Stop on first failure
- Show only errors (hide warnings)

### Pre-PR Check
Run before creating PR:
- All checks
- Show warnings
- Generate detailed report

### CI Simulation
Simulate what CI will run:
- All checks
- Build verification
- Link checking (if available)

## Integration Points

### Git Hooks
Can be integrated with Husky pre-commit:
```bash
# .husky/pre-commit
/health-check --pre-commit
```

### IDE Integration
Results can inform IDE extensions:
- Linting issues → VS Code problems panel
- Type errors → IntelliSense
- Build errors → Terminal

### CI/CD
Same checks run in CI:
- Ensures local === CI
- Catch issues early
- Faster feedback loop

## Advanced Features

### Watch Mode
Continuously monitor files and re-run checks:
```
🔄 Health Check - Watch Mode

Watching for file changes...
Press Ctrl+C to stop.

[File changed: docs/getting-started.md]
Re-running relevant checks...
  ✅ Linting: Passed
  ✅ Build: Passed
```

### Fix Mode
Automatically fix issues where possible:
```
🔧 Health Check - Fix Mode

Auto-fixing issues...
  ✅ Prettier: Fixed 5 files
  ✅ Linting: Fixed 2 issues (1 manual fix needed)
  ⏩ TypeScript: Cannot auto-fix (manual fixes required)

Remaining issues: 1
Run health check again to verify.
```

### Report Export
Export results for CI or documentation:
```bash
/health-check --export=json > health-report.json
/health-check --export=markdown > health-report.md
```

## Reference

- [Common Issues](../.claude/docs/common-issues.md) - Troubleshooting
- [Development Guide](../.claude/docs/development.md) - Contribution standards
- [Testing Guide](../.claude/docs/testing.md) - Quality requirements
