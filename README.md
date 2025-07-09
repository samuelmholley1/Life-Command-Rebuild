# life-command-rebuild

> **Agent Onboarding Protocol (Read First!)**
> 
> All new agents must:
> - Read and confirm the current working commands in `COMMANDS.md` before running any terminal commands or scripts.
> - If you change, deprecate, or discover a command is outdated, you must:
>   1. Update `COMMANDS.md` immediately.
>   2. Notify the user of the change and reason.
>   3. Update this README and any other relevant documentation if the change is significant.
> - Never run deprecated or failing commands. Always keep documentation and users up to date.
> - As your first message, reply: "I ACCEPT. Here are the foundational pieces of context I consider most important: ..." and summarize the most critical points from each doc. Concisely describe your persona as Chief Software Engineer for non-coder founder assisted by AI CTO, and provide current accurate commands from `COMMANDS.md`.

[➡️ Project Context: CORE PROJECT TENSION ➡️ MVP Speed vs. "Everything App" Architecture](./PROJECT_CONTEXT.md)

---

## 📚 Foundational Documents
- `README.md` (this file)
- `PROJECT_CONTEXT.md`
- `APP_FUNCTIONALITY_OVERVIEW.md`
- `COMMANDS.md`

These are the project brain and required context for all engineering work. Do not proceed without reviewing them.

---

## 🚀 Production-Ready Next.js + Supabase Monorepo

**Deployment Status:**
- ✅ Live on Vercel as of July 7, 2025
- ✅ Yarn Berry monorepo, local packages, and all workspace dependencies are working
- ✅ Vercel auto-detects Next.js app in `apps/web` (no `builds` in `vercel.json`)
- ✅ Root build script: `yarn workspace @life-command/web run build`
- ✅ No custom build/install commands in Vercel dashboard (unless troubleshooting)
- ✅ `.next` excluded from type checking in `tsconfig.json` to avoid Next.js 15 PageProps type errors

**Vercel Project Settings:**
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

## 🏗️ Monorepo Structure
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

---

## 🛠️ Command Reference (Yarn Berry Only)
- **Start Dev Server:** `yarn workspace @life-command/web dev`
- **Build Web App:** `yarn workspace @life-command/web build`
- **Run E2E Tests:** `cd packages/e2e && npm test`
- **Run Unit Tests:** `cd apps/web && npm test`
- **Install Dependencies:** `yarn install --immutable`

See `COMMANDS.md` for the canonical, up-to-date list. Any changes must be reflected there and in this README.

**Unsupported commands:**
- `pnpm ...`, `bun ...`, `yarn workspace @life-command/e2e test`, VS Code test runners, or integrated tools (not supported)
- Do **not** use `yarn` without the `workspace` flag for app scripts
- Do **not** use `npm`, `npx`, or `pnpm` except for running tests

---

## 🧪 Testing Protocol
- **CRITICAL:** Always run tests in terminal for proper observation and debugging
- All E2E tests must pass in Chromium, Firefox, and Webkit before merging
- UI changes must be validated with both E2E and unit tests
- All async state updates in tests must be wrapped in `act` from `react` to avoid warnings (see `apps/web/app/task-list.test.tsx` for an example)

---

## 🔑 Key Features & Architecture
- **Next.js 15** with App Router and Server Actions
- **Supabase** with SSR integration and RLS policies
- **TanStack Query** for optimistic updates and caching
- **Playwright E2E Testing** with robust, attribute-based selectors
- **Yarn Berry** workspaces for monorepo management
- **Full TypeScript** with strict mode and proper types
- **Zero-config deployment** to Vercel
- **Inline Editing:** Edit task titles inline with full server validation and instant UI refresh
- **Centralized Zod Schemas:** All task-related schemas are in `task-schema.ts`
- **Service Layer:** All business logic is centralized in `core-logic/taskService.ts` and reused by both UI and API
- **AI Programmatic API:** Secure endpoint `/api/commands` for automation/AI, requires both API key and user JWT, always respects user security (RLS)

---

## 🌐 Environment Files
- `.env.e2e`: E2E (test) Supabase project and test user info (used for E2E tests)
- `apps/web/.env.local`: Production Supabase project info (used for deployed/production app)
- `/packages/e2e/.env.e2e`: E2E Supabase project and test user info (for E2E tests only)
- `/apps/web/.env.local`: Production Supabase project info (for local/prod app only)

**Never run migrations or destructive tests against the production environment!**

See `ENVIRONMENT_FILES.md` for more details and usage instructions.

---

## 📈 Recent Progress & Changelog
- Major UI/UX enhancement: modern, consistent visual design, improved layout, and robust empty states
- Inline editing for task titles: E2E tested, robust selectors, cross-browser reliability
- Centralized all task-related Zod schemas in `task-schema.ts`
- All E2E and unit tests now pass in Chromium, Firefox, and Webkit
- All foundational docs are now the project brain for non-coders and engineers alike
- **July 2025:** Persistent Vercel build failures caused by a misplaced test file in `core-logic` have been resolved. All aggressive workarounds (pre-build.sh, VERCEL_BUILD_NO_TYPECHECK, etc.) have been reverted. The build is now clean, type-safe, and reliable. See `COMMANDS.md` for protocol.

---

- **Exception (July 2025):** One-time manual SQL was run directly on the E2E Supabase DB to add the `due_date` column for test coverage, and on the production Supabase DB to fix legacy migration history issues. All future schema changes must use version-controlled migrations only.

For more details, see `APP_FUNCTIONALITY_OVERVIEW.md` and `PROJECT_CONTEXT.md`.

# README

_Last updated: July 9, 2025_

## Project Overview
- Task management with due dates and priority levels
- E2E and unit tests for all major features
- **Manual SQL workaround required for E2E migrations if IPv6-only project**

## Migration Protocol
- All schema changes must be version-controlled and applied via CLI/CI/CD for production
- If E2E project is IPv6-only and CLI cannot connect, apply migration SQL manually in the Supabase dashboard (see ENVIRONMENT_FILES.md)

## Testing Protocol
- E2E: `yarn e2e` (after manual migration if needed)
- Unit: `cd apps/web && npm test`

## Environment Files
- `.env.e2e`: E2E credentials (see ENVIRONMENT_FILES.md)
- `.env.production`: Production credentials
- `apps/web/.env.local`: Local/prod app credentials

## Status
- Task Priority Levels: Code, UI, docs, and unit tests complete; E2E tests blocked until manual migration is applied
- Due Dates: Fully integrated and tested
- **Build Reliability:** All Vercel build workarounds have been removed. The build is now clean, type-safe, and reliable. See `COMMANDS.md` for protocol.

---

For full onboarding and CTO policy, see ENVIRONMENT_FILES.md and COMMANDS.md.
