# Workflows & SDLC

This document covers the multi-agent software development lifecycle (SDLC) workflow, Linear integration, and pull request process.

---

## Multi-Agent Workflow Overview

The Docs team follows a phased approach to feature development with specialized "agent" roles:

```
Linear Issue + Figma Design
    ↓
Planning Agent → Create implementation plan
    ↓
Development Agent → Implement feature
    ↓
Testing Agent → Write tests
    ↓
Review Agent → Code review
    ↓
PR Agent → Create pull request
    ↓
CI/CD → Deploy
```

---

## Phase 1: Planning Agent

**Role**: Analyze requirements, create implementation plan, identify affected components

### Linear Integration

- Review Linear issue details, acceptance criteria, and attached designs
- Reference issue number in all planning documents
- Update Linear with plan and estimated scope

### Issue Estimates

The Docs team uses a simple S/M/L estimation scale:

- **Small (S)**: Simple changes, quick wins, minor bug fixes **(1-2 days)**
- **Medium (M)**: Standard features, moderate complexity **(3-5 days)**
- **Large (L)**: Complex features, major refactors, multi-component work **(1-2 weeks)**

Estimates help with sprint planning. Consider:
- Complexity of implementation
- Number of components/files affected
- Testing requirements
- Design/polish work needed
- Dependencies on other work

### Creating Projects and Issues in Linear

When planning a multi-milestone project:

#### 1. Plan Before Creating
- Collaborate to plan out milestones and features
- Break down vague requirements into concrete issues
- Calculate milestone dates and timelines
- Get approval on the plan before creating in Linear

####2. Create Project First
```typescript
// Use mcp__linear-server__create_project
{
  name: "Self-Service Admin Experience",
  team: "Docs Team",
  lead: "jane@company.com",
  priority: 2, // 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low
  state: "planned",
  startDate: "2025-01-15",
  targetDate: "2025-04-15",
  summary: "Enable team admins to self-manage members and billing",
  description: "[Full description with milestones]"
}
```

**Project Description Template**:
```markdown
## [Project Name]

Enable [target users] to [achieve goal] through [solution approach].

## Milestones

**Milestone 1** (Date - Date): [Milestone Name]
- [Key deliverables]
- Target: [Target audience/outcome]

**Milestone 2** (Date - Date): [Milestone Name]
- [Key deliverables]
- Target: [Target audience/outcome]

## Key Features
- [Feature 1]
- [Feature 2]
```

#### 3. Create Milestones in Linear UI

⚠️ **Note**: The Linear MCP server doesn't yet expose milestone creation, so:
- Create milestones manually in Linear UI: Project → Milestones tab
- Set name, target date, and description for each milestone
- Link issues to milestones for progress tracking

#### 4. Create Epic/Parent Issues
- Create one epic per milestone
- Link to project via `project` parameter
- Set due dates matching milestone dates
- Reference milestone in description

**Create all epics in parallel** for efficiency.

#### 5. Create Feature Issues
```typescript
// Use mcp__linear-server__create_issue
{
  team: "Docs Team",
  project: "project-id",
  parentId: "epic-id",
  title: "Feature: User management table",
  description: "[See template below]",
  assignee: "john@company.com",
  estimate: 3, // 2=S, 3=M, 5=L
  state: "Triage"
}
```

**Issue Template**:
```markdown
## [Issue Title]

[Brief description of what needs to be done]

## Current State
[Describe existing state - new work, enhancement, or refactor?]

## Tasks
- [ ] [Specific task 1]
- [ ] [Specific task 2]
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Update documentation

## Acceptance Criteria
* [Criterion 1: User can do X]
* [Criterion 2: System behaves as Y when Z]
* [Criterion 3: Edge case W is handled]

## Technical Notes
[Implementation considerations, dependencies]

## Design
[Link to Figma if applicable]
```

**Create all features in parallel** for efficiency.

#### 6. Move Issues from Triage to Todo
```typescript
// Use mcp__linear-server__update_issue
{ id: "issue-id", state: "Todo" }
```

New issues default to "Triage". Move to "Todo" when ready for development.

### Figma Integration

- Review design files for UI/UX specifications
- Note component requirements, spacing, colors, interactions
- Identify new vs. existing components

### Planning Checklist

- [ ] Linear issue analyzed
- [ ] Figma designs reviewed (if applicable)
- [ ] Feature location determined (`app/features/*`)
- [ ] State management approach decided
- [ ] Component reuse identified
- [ ] Test strategy defined
- [ ] Breaking changes flagged
- [ ] Accessibility considered

---

## Phase 2: Development Agent

**Role**: Implement features following established patterns and conventions

See [Development Guide](./development.md) for detailed coding standards.

### Development Checklist

- [ ] Used correct path aliases (`@console/*` and `@/*`)
- [ ] Followed import restrictions
- [ ] Added `data-testid` to interactive elements
- [ ] Implemented proper error handling
- [ ] Added loading states
- [ ] Handled empty states
- [ ] Validated inputs with Zod
- [ ] No security vulnerabilities
- [ ] Accessible markup
- [ ] Mobile responsive (if applicable)

---

## Phase 3: Testing Agent

**Role**: Create comprehensive test coverage (unit + E2E)

See [Testing Guide](./testing.md) for detailed testing patterns.

### Testing Checklist

- [ ] Unit tests for new components
- [ ] Unit tests for new hooks
- [ ] Unit tests for utility functions
- [ ] E2E tests for critical user flows
- [ ] Updated HAR files if needed
- [ ] All tests passing locally
- [ ] Coverage maintained/improved

---

## Phase 4: Review Agent

**Role**: Code review for quality, security, and standards compliance

### Review Focus Areas

1. **Code Quality**
   - [ ] Follows TypeScript strict mode
   - [ ] No `any` types (warnings allowed, errors flagged)
   - [ ] Proper error handling
   - [ ] Meaningful variable names
   - [ ] Functions are focused and testable
   - [ ] No code duplication

2. **Security Review**
   - [ ] No XSS vulnerabilities
   - [ ] No hardcoded secrets or credentials
   - [ ] Input validation with Zod
   - [ ] No `dangerouslySetInnerHTML`
   - [ ] Sanitized markdown/HTML rendering

3. **Performance**
   - [ ] No unnecessary re-renders
   - [ ] Proper memoization where needed
   - [ ] Lazy loading for large components
   - [ ] No circular dependencies

4. **Accessibility**
   - [ ] Semantic HTML
   - [ ] ARIA labels present
   - [ ] Keyboard navigation works
   - [ ] Color contrast meets WCAG standards

5. **Testing**
   - [ ] Tests are meaningful
   - [ ] Edge cases covered
   - [ ] Error states tested

6. **Documentation**
   - [ ] Complex logic has comments
   - [ ] JSDoc for public APIs
   - [ ] README updates if needed

### Review Commands

```bash
bun lint                        # ESLint check
bun format:check                # Prettier check
bun type-check                  # TypeScript check
bun circular-dependencies:check # Circular deps check
bun test                        # Unit tests
```

---

## Phase 5: PR Agent

**Role**: Create pull request with comprehensive description

### PR Title Format

```
<type>: <description>

Examples:
feat: add user profile settings page
fix: resolve authentication timeout issue
refactor: improve error handling in chat feature
docs: update setup instructions
```

### PR Description Template

```markdown
## Linear Issue
Fixes: [LIN-XXX](https://linear.app/hasura/issue/LIN-XXX)

## Summary
Brief description of changes and why they're needed.

## Changes
- Bullet list of key changes
- Component modifications
- New features added

## Figma Design
[Link to Figma if applicable]

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Tested in GraphQL mode
- [ ] Tested in PromptQL mode (if applicable)
- [ ] Accessibility tested
- [ ] Mobile responsive (if applicable)

## Screenshots/Videos
[Add visual proof of changes]

## Breaking Changes
- List any breaking changes
- Migration guide if needed

## Security Considerations
- Any security implications
- Data handling changes

## Deployment Notes
- Environment variable changes
- Infrastructure changes
```

### Commit Message Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Enforced by commitlint

### Required Checks (GitHub Actions)

- ✅ Lint (ESLint + Prettier)
- ✅ Type Check (TypeScript)
- ✅ Unit Tests (Vitest)
- ✅ E2E Tests (Playwright) - requires `run-tests` label
- ✅ Circular Dependencies Check
- ✅ HAR PAT Check
- ✅ Security Scan (Trivy)
- ✅ Build Success

### Labels

- `run-tests` - Required to trigger E2E tests
- Add feature-specific labels
- Add `breaking-change` if applicable

### PR Checklist

- [ ] Linear issue linked
- [ ] Figma design linked (if applicable)
- [ ] Clear description of changes
- [ ] Screenshots/videos included
- [ ] Tests documented
- [ ] Breaking changes noted
- [ ] `run-tests` label added
- [ ] All CI checks passing

---

## CI/CD Pipeline

### On Pull Request

1. **Lint**: ESLint + Prettier checks
2. **Type Check**: TypeScript compilation
3. **Unit Tests**: Vitest tests
4. **E2E Tests**: Playwright (requires `run-tests` label)
5. **Circular Dependency Check**: Prevents circular imports
6. **HAR PAT Check**: Validates HAR file security
7. **Security Scan**: Trivy vulnerability scanning
8. **Build**: Production build test

### On Merge to Main

- All PR checks
- Deploy to staging (if merge to `release/staging`)
- Deploy to production (if merge to `release/production`)

### Deployment Branches

- `release/staging` → console.arusah.com, promptql.console.arusah.com
- `release/production` → console.hasura.io, promptql.console.hasura.io
- `release/white-label` → Customer white-label domains
- `release/hasura` → hasura.ql.app

### Pre-commit Hooks (Husky + lint-staged)

- Prettier formatting on staged files
- ESLint on staged TypeScript files
- Commitlint for conventional commits

---

## Linear Milestones vs Projects vs Epics

- **Projects**: High-level initiatives with overall timeline and scope
- **Milestones**: Specific date-based checkpoints within projects (create in Linear UI)
- **Epics**: Parent issues that organize related features (created via MCP tools)

**Use all three together**: Project → Milestones → Epics → Feature Issues

---

## Best Practices

### Creating Issues
- Always plan collaboratively before creating in Linear
- Create all issues in parallel when possible (multiple tool calls in one message)
- Move issues from "Triage" to "Todo" after creation
- Use parent/child relationships for organization
- Link issues to milestones for tracking
- Include clear current state and acceptance criteria

### During Development
- Commit frequently with meaningful messages
- Keep PRs focused and reasonably sized
- Update Linear issue status as you progress
- Ask for help early if blocked

### Code Review
- Review your own code first
- Run all checks locally before pushing
- Respond to feedback promptly
- Be open to suggestions and improvements

---

## Agent Collaboration

- **Planning → Development**: Detailed task breakdown, file structure
- **Development → Testing**: Components, hooks, test IDs documented
- **Testing → Review**: Coverage reports, test results
- **Review → PR**: Feedback incorporated, standards verified
- **PR → CI/CD**: Automated validation, deployment

---

## Quick Reference

### Must-Run Before PR
```bash
bun lint                        # ESLint
bun format:check                # Prettier
bun type-check                  # TypeScript
bun test                        # Unit tests
bun circular-dependencies:check # Circular deps
```

### Available Slash Commands
- `/create-linear-project` - Create Linear projects from planning docs
