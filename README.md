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
- **Testing**: ✅ Comprehensive E2E testing with Playwright (including inline editing)
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
  e2e/                 # Playwright E2E tests
  db/                  # Database schema
  tsconfig/            # Shared TypeScript config
  lint-config/         # Shared ESLint config
```

#### Key Features
- **Next.js 15** with App Router and Server Actions
- **Supabase** with proper SSR integration and RLS policies
- **TanStack Query** for optimistic updates and caching
- **Playwright E2E Testing** with secure authentication flow and inline editing
- **Yarn Berry** workspaces for monorepo management
- **Full TypeScript** with strict mode and proper types
- **Zero-config deployment** to Vercel
- **Inline Editing:** Edit task titles inline with full server validation and instant UI refresh

---

## Recent Session Progress (July 8, 2025)
- Implemented inline editing for task titles with progressive enhancement and server validation
- Centralized all task-related Zod schemas in `task-schema.ts` for maintainability
- Updated E2E and unit tests to cover inline editing
- Cleaned up schema file structure for clarity
