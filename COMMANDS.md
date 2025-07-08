# Monorepo Command Reference

## Supported Commands (Yarn Berry Only)

- **Start Dev Server:**
  - `yarn workspace @life-command/web dev`
- **Build Web App:**
  - `yarn workspace @life-command/web build`
- **Run E2E Tests:**
  - `yarn workspace @life-command/e2e test`
- **Install Dependencies:**
  - `yarn install --immutable`

## Nonexistent/Unsupported Commands (Do NOT Use)

- `pnpm ...` (monorepo uses Yarn Berry, not pnpm)
- `npm run ...` (do not use npm scripts in this monorepo)
- `bun ...` (not supported)

## Notes
- All commands should be run from the monorepo root unless otherwise specified.
- If you see a command in documentation or scripts that is not listed above, it is likely incorrect for this project.
- The only supported package manager is **Yarn Berry** (v2+), with workspaces.

---

_Last updated: July 8, 2025_
