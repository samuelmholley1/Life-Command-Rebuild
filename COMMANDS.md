# Monorepo Command Reference

## Supported Commands (Yarn Berry Only)

- **Start Dev Server:**
  - `yarn workspace @life-command/web dev`
- **Build Web App:**
  - `yarn workspace @life-command/web build`
- **Run E2E Tests (CRITICAL: ALWAYS IN TERMINAL):**
  - `cd packages/e2e && npm test`
- **Run Unit Tests (CRITICAL: ALWAYS IN TERMINAL):**
  - `cd apps/web && npm test`
- **Install Dependencies:**
  - `yarn install --immutable`

## CRITICAL Testing Protocol

**ALWAYS RUN TESTS IN TERMINAL:**
- E2E Tests: `cd packages/e2e && npm test`
- Unit Tests: `cd apps/web && npm test`
- **DO NOT** use VS Code test runners or any integrated test tools
- Terminal testing ensures proper observation, debugging, and reliable results
- All UI changes must be validated with both E2E and unit tests

## Nonexistent/Unsupported Commands (Do NOT Use)

- `pnpm ...` (monorepo uses Yarn Berry, not pnpm)
- `yarn workspace @life-command/e2e test` (use direct npm command in terminal instead)
- VS Code test runners or integrated testing tools
- `bun ...` (not supported)

## Notes
- All commands should be run from the monorepo root unless otherwise specified for testing.
- Testing commands must be run from their specific package directories in terminal.
- If you see a command in documentation or scripts that is not listed above, it is likely incorrect for this project.
- The only supported package manager is **Yarn Berry** (v2+), with workspaces.

---

_Last updated: July 8, 2025 - Added critical testing protocol requirements_
