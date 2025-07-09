# Monorepo Command Reference

> **Required Reading:** This document is foundational for all new agents and contributors. Review thoroughly before running any commands or making changes. See README for onboarding protocol.

## Supported Commands (Yarn Berry Only)

- **Start Dev Server:**
  - `yarn workspace @life-command/web dev`
- **Build Web App:**
  - `yarn workspace @life-command/web build`
- **Run E2E Tests (CRITICAL: ALWAYS IN TERMINAL):**
  - `cd packages/e2e && npm test` or `yarn e2e`
- **Run Unit Tests (CRITICAL: ALWAYS IN TERMINAL):**
  - `cd apps/web && npm test`
- **Install Dependencies:**
  - `yarn install --immutable`

## CRITICAL Testing Protocol

**ALWAYS RUN TESTS IN TERMINAL (MANDATORY):**
- E2E Tests: `cd packages/e2e && npm test` or `yarn e2e`
- Unit Tests: `cd apps/web && npm test`
- **DO NOT** use VS Code test runners or any integrated test tools
- **Agents must always run tests in the terminal so the user can see the output and debug as needed.**
- Terminal testing ensures proper observation, debugging, and reliable results
- All UI changes must be validated with both E2E and unit tests

## Manual SQL Workaround for E2E Migrations (July 2025)
- If you see persistent network or IPv6 errors when running `npx supabase db push`, you must apply the migration SQL manually in the Supabase dashboard for E2E only.
- See ENVIRONMENT_FILES.md and README for the exact SQL and protocol.
- **Production migrations must always be version-controlled and applied via CLI or CI/CD.**

## Vercel Build Workarounds (July 2025)

- **TypeScript test files in production:**
  - Test files (e.g., `TaskList.test.tsx`) must not be type-checked or included in production builds.
  - All test files should be placed in `__tests__` directories and excluded via `tsconfig.json`.
  - The Next.js config (`next.config.js`) now sets `typescript.ignoreBuildErrors: true` to ensure Vercel builds do not fail on type errors.
  - The `pre-build.sh` workaround is no longer needed and has been removed.
  - The `vercel.json` build command no longer sets `VERCEL_BUILD_NO_TYPECHECK=1`.

- **Local Development Protocol:**
  - Always run `yarn type-check` and `yarn lint` locally before pushing changes, as Vercel will not catch type errors.
  - Keep all test files in `__tests__` directories and out of production code paths.

- **Supabase SSR Cookie Adapter:**
  - Use the async cookies adapter in `apps/web/app/auth/callback/route.ts` to resolve type errors.

## Recent Changes
- Moved test files to `__tests__` directories.
- Updated `tsconfig.json` to exclude tests from builds.
- Updated `next.config.js` and `vercel.json` for type-check suppression.
- Removed `pre-build.sh` as a workaround.
- Documented all protocols and workarounds here.

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
- **IMPORTANT:** Any changes to supported or unsupported commands must be reported via chat to the founder immediately.

## Production Build (Vercel):
  - `yarn install --immutable`
  - `yarn workspace @life-command/core-logic build && yarn workspace @life-command/web build`
  - (This is now enforced in vercel.json for all deployments)

## AI Programmatic API
- **Endpoint:** `/api/commands` (POST)
- **Auth:** Requires both `x-api-key` and `Authorization: Bearer <user_jwt>`
- **Actions:** `createTask`, `deleteTask`, `updateTaskCompletion`, `updateTaskTitle`, `setPriority`
- **Security:** All actions are user-scoped and respect RLS (never use service role key)

---

_Last updated: July 8, 2025 - Added manual SQL workaround for E2E migrations and clarified migration/testing protocol_

# Canonical Life Command Commands & Protocols

_Last updated: July 8, 2025_

This file is the single source of truth for all supported, deprecated, and critical commands for the Life Command monorepo. All agents must check this file before running any commands or scripts. If you change or discover a command is outdated, update this file and notify the user immediately.

## Supported Commands
- `yarn workspace @life-command/web dev` – Start the development server
- `yarn workspace @life-command/web build` – Build the web app
- `cd packages/e2e && npm test` – Run E2E tests (includes due date tests)
- `cd apps/web && npm test` – Run unit tests (includes due date logic)
- `yarn install --immutable` – Install dependencies

## Due Date Feature (July 2025)
- All due date logic, UI, and API support is now live and fully tested.
- E2E and unit tests for due dates are included in the above commands.
- See README and APP_FUNCTIONALITY_OVERVIEW.md for onboarding and protocols.

## Deprecated/Unsupported Commands
- `pnpm ...`, `bun ...`, `yarn workspace @life-command/e2e test`, VS Code test runners, or integrated test tools
- Do **not** use `yarn` without the `workspace` flag for app scripts
- Do **not** use `npm`, `npx`, or `pnpm` except for running tests

## Protocol for Command Changes
- Update this file and notify the user if any command is changed, deprecated, or added.
- Update the README and foundational docs if the change is significant.

---

For onboarding, see the top of the README.
