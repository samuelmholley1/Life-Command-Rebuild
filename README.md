# life-command-rebuild

[➡️ Project Context: CORE PROJECT TENSION ➡️ MVP Speed vs. "Everything App" Architecture](./PROJECT_CONTEXT.md)

## 🚀 Production-Ready Next.js + Supabase Monorepo

**Deployment Status:**
- ✅ Live on Vercel as of July 7, 2025
- ✅ Yarn Berry monorepo, local packages, and all workspace dependencies are working
- ✅ Vercel auto-detects Next.js app in `apps/web` (no `builds` in `vercel.json`)
- ✅ Root build script: `yarn workspace @life-command/web run build`
- ✅ No custom build/install commands in Vercel dashboard (unless troubleshooting)
- ✅ `.next` excluded from type checking in `tsconfig.json` to avoid Next.js 15 PageProps type errors

**Vercel Project Settings (as of July 7, 2025):**
- Root Directory: monorepo root (not `apps/web`)
- Build Command: (blank, or `yarn workspace @life-command/web run build` if auto-detect fails)
- Output Directory: (blank, or `apps/web/.next` if needed)
- Install Command: (blank, or `yarn install --immutable` if needed)

**Key Lessons:**
- Do not use a `builds` section in `vercel.json` for monorepos—let Vercel auto-detect Next.js
- Keep all workspace dependencies and local packages managed from the monorepo root
- If Vercel fails to detect, set the build command to `yarn workspace @life-command/web run build`
- Exclude `.next` from type checking in `tsconfig.json` to avoid generated type errors

---

A modern, production-ready task management application built with Next.js 15, Supabase, and comprehensive E2E testing. Features a clean monorepo architecture with Yarn Berry workspaces and full TypeScript strictness.

### ✅ Production Status
- **Build Status**: ✅ Zero lint/type errors, clean production builds
- **Testing**: ✅ Comprehensive E2E testing with Playwright (including inline editing, robust selectors, and cross-browser reliability)
- **Deployment**: ✅ Vercel-ready with Yarn Berry monorepo support
- **Type Safety**: ✅ Full TypeScript strictness with proper types
- **Code Quality**: ✅ Zero ESLint warnings, consistent patterns

### 🏗️ Architecture Overview

#### Monorepo Structure
```
apps/
  web/                 # Next.js 15 application
packages/
  core-logic/          # Shared business logic & types (all Zod schemas centralized in task-schema.ts)
  e2e/                 # Playwright E2E tests (robust selectors, all browsers)
  db/                  # Database schema
  tsconfig/            # Shared TypeScript config
  lint-config/         # Shared ESLint config
```

#### Key Features
- **Next.js 15** with App Router and Server Actions
- **Supabase** with proper SSR integration and RLS policies
- **TanStack Query** for optimistic updates and caching
- **Playwright E2E Testing** with secure authentication flow and robust, attribute-based selectors
- **Yarn Berry** workspaces for monorepo management
- **Full TypeScript** with strict mode and proper types
- **Zero-config deployment** to Vercel
- **Inline Editing:** Edit task titles inline with full server validation and instant UI refresh (E2E tested, robust selectors)
- **Centralized Zod Schemas:** All task-related schemas are in `task-schema.ts` for maintainability

---

## Recent Session Progress (July 8, 2025)
### Major UI/UX Enhancement Pass
- **Comprehensive UI/UX Enhancement:** Implemented modern, consistent visual design across all components
  - Global layout with centered content (max-w-4xl), improved typography, and subtle background
  - Enhanced task item styling with cards, shadows, and improved spacing
  - Consistent input field styling with proper focus states and borders
  - Improved button styling with consistent sizing and hover states
  - Better filter controls with grouped layout and clear visual hierarchy
  - Added proper header section with app title and sign-out functionality
  - Implemented empty state messaging for better user experience

### Previous Work (Earlier July 8, 2025)
- Implemented robust, E2E-testable inline editing for task titles (with stable selectors and cross-browser reliability)
- Centralized all task-related Zod schemas in `task-schema.ts` for maintainability
- Added server action for updating task titles with Zod validation
- Updated E2E and unit tests to cover inline editing and ensure robust selectors (no locator staleness)
- Cleaned up schema file structure for clarity
- Updated documentation to reflect new features, architecture, and correct Yarn-only command usage
- All E2E tests now pass in Chromium, Firefox, and Webkit

---

## 🛠️ Monorepo Command Reference (AI/Automation)

### Supported Commands (Yarn Berry Only)
- **Start Dev Server:**
  - `yarn workspace @life-command/web dev`
- **Build Web App:**
  - `yarn workspace @life-command/web build`
- **Run E2E Tests (ALWAYS USE TERMINAL):**
  - `cd packages/e2e && npm test`
- **Run Unit Tests (ALWAYS USE TERMINAL):**
  - `cd apps/web && npm test`

### Testing Guidelines
- **CRITICAL:** Always run tests in terminal for proper observation and debugging
- All E2E tests must pass in Chromium, Firefox, and Webkit before merging
- UI changes must be validated with both E2E and unit tests
- Tests include comprehensive coverage of inline editing, filtering, sorting, and all task flows

### Unsupported Commands
- Do **not** use `npm`, `npx`, or `pnpm` commands in this monorepo except for running tests.
- Do **not** use `yarn` without the `workspace` flag for app scripts.
- Do **not** use VS Code test runners - always run tests in terminal for proper observation.

---

## For AI/Automation
- Always use Yarn Berry workspace commands as above.
- All E2E tests must pass in Chromium, Firefox, and Webkit before merging.
- Inline editing and all task flows are covered by robust, attribute-based E2E tests.

---

For more details, see `APP_FUNCTIONALITY_OVERVIEW.md` and `PROJECT_CONTEXT.md`.
