# Life Command – Core App Functionality Overview

> **Required Reading:** This document is foundational for all new agents, engineers, and non-coder stakeholders. Review thoroughly before contributing or making decisions.
> 
> **Agent Onboarding:** All new agents must read the Agent Onboarding Protocol at the top of the README and confirm the current working commands in `COMMANDS.md` before running any commands. If you change or discover a command is outdated, you must update `COMMANDS.md`, notify the user, and update docs as needed. For full onboarding, see the README.

_Last updated: July 9, 2025_

This document provides a high-level, non-technical summary of all major features and flows in the Life Command application. It is intended for executive and non-coder stakeholders (e.g., CTO, product leads) who need a clear understanding of what the app does, how it works, and what is in production.

---

## Core Features

- **Due Dates:** Users can set, edit, and view due dates for tasks. Due dates are validated, displayed in the UI, persist after reload, and are supported in both the UI and AI API. All due date logic is fully tested (unit and E2E) and covered by robust selectors and assertions. See README and COMMANDS.md for canonical usage and protocols.

### 1. Authentication & User Management
- **Sign Up:** Users can create an account with email and password.
- **Sign In:** Users can log in securely.
- **Reset Password:** Users can request a password reset link via email if they forget their password.
- **Session Management:** Secure, persistent sessions with support for server-side rendering (SSR).
- **Test User:** Dedicated E2E test user for automated testing (not used in production).

### 2. Task Management
- **Create Task:** Users can add new tasks with a title and status using a clean, modern input form.
- **Edit Task Title (Inline):** Users can edit a task's title directly in the list. Edits are validated and persisted server-side, with instant UI refresh. Inline editing is robustly E2E tested with stable selectors and works in all browsers.
- **Set Due Date:** Users can set a due date for any task. Due dates are validated, displayed in the UI, and persist after reload. Supported in both UI and AI API.
- **Complete Task:** Mark tasks as completed or active with improved checkbox styling.
- **Delete Task:** Remove tasks securely (with user validation) using clearly styled delete buttons.
- **Filter Tasks:** View all, active, or completed tasks using visually distinct filter buttons with active state indicators.
- **Sort Tasks:** Sort tasks by creation date or alphabetical order using an accessible dropdown.
- **Task Display:** Each task is presented in a clean card layout with proper spacing, shadows, and hover effects.
- **Preserved Task:** One historical test task is always present for auditability/testing (never deleted).
- **Set Priority Levels:** Users can set, edit, and view priority levels for tasks (None, Low, Medium, High, Critical). Priority is validated, displayed in the UI, persists after reload, and is supported in both the UI and AI API. All priority logic is fully tested (unit and E2E) and covered by robust selectors and assertions.

### 3. User Interface & Experience
- **Modern Design System:** Consistent visual language using Tailwind CSS with proper spacing, colors, and typography.
- **Responsive Layout:** Central content column (max-width) with proper padding for optimal reading on all screen sizes.
- **Clear Visual Hierarchy:** Proper heading structure, grouped controls, and intuitive button styling.
- **Accessibility:** Focus states, proper contrast ratios, and semantic HTML throughout.
- **Empty States:** Helpful messaging when no tasks match current filters.
- **Interactive Feedback:** Hover effects, transitions, and clear visual feedback for all user actions.

### 4. Data Security & Privacy
- **Row-Level Security (RLS):** All data is protected at the database level; users can only access their own tasks.
- **No Sensitive Data in Errors:** All user-facing errors are actionable and never leak backend details.
- **Environment Separation:** Test and production data are strictly separated.

### 5. AI Programmatic API
- **API Endpoint:** `/api/commands` provides a secure programmatic interface for external automation and AI systems.
- **Dual Authentication:** Requires both API key (`x-api-key` header) and JWT user authentication (`Authorization: Bearer <token>`) for maximum security.
- **User-Scoped Operations:** All API actions operate within the context of the authenticated user, respecting Row-Level Security (RLS) policies.
- **Supported Actions:** Supports `createTask`, `deleteTask`, `updateTaskCompletion`, `updateTaskTitle`, `setDueDate`, and `setPriority` for automated task management from external systems.
- **Service Layer Architecture:** API calls utilize the same core business logic (`taskService`) as the web UI, ensuring consistent validation and data handling.
- **Security Model:** Never bypasses RLS or user permissions - all operations are performed as the authenticated user.
- **Error Handling:** Comprehensive error responses with appropriate HTTP status codes for reliable integration.

### 6. Testing & Quality
- **E2E Testing:** Automated browser tests cover all critical user flows (login, signup, CRUD, filtering, sorting, inline editing). All selectors are robust and attribute-based to prevent locator staleness. All tests pass in Chromium, Firefox, and Webkit. **CRITICAL: Always run tests in terminal for proper observation.**
- **Unit Testing:** All business logic and UI components are unit tested, including inline editing. **CRITICAL: Always run tests in terminal for proper observation.**
- **React act(...) Protocol:** All async state updates in tests must be wrapped in `act` from `react` to avoid warnings and ensure reliable, future-proof tests. See `task-list.test.tsx` for an example.
- **Manual QA:** Password reset and other flows that require email are manually tested.
- **Zero Tolerance for Errors:** No known lint, type, or runtime errors in production.
- **UI/UX Testing:** All visual improvements validated through comprehensive test suites.

### 7. Deployment & Operations
- **Vercel Deployment:** Zero-config, production-ready deployment pipeline.
- **Monorepo:** All code, configs, and packages managed in a single repository.
- **Yarn Berry:** Modern dependency management for reliability and speed.

---

## User Flows

1. **Sign Up → Confirm Email → Sign In → Create/Manage Tasks (including Edit Title Inline) → Sign Out**
2. **Forgot Password → Request Reset Link → Receive Email → Set New Password → Sign In**
3. **E2E Test User:** Used only for automated tests, never for real data.

---

## Notable Policies & Decisions
- All code, types, and UI use `completed` (never `is_completed`) for task status.
- All navigation in server components uses Next.js `<Link>` for reliability and SSR compatibility.
- Password reset is not E2E tested (requires email inbox), but is covered by manual QA and documented.
- Preserved test data policy ensures one historical task is always present for audit/auditability.
- All task-related Zod schemas are now centralized in `task-schema.ts` for maintainability and clarity.
- Inline editing is implemented with progressive enhancement, robust selectors, and full server validation. All E2E tests pass in all browsers.
- **UI/UX Standards:** Modern design system with consistent spacing, colors, and typography using Tailwind CSS. All interactive elements follow accessibility guidelines with proper focus states and visual feedback.
- **Testing Protocol:** All tests must be run in terminal for proper observation and debugging. No VS Code test runners allowed for reliability.

---

## July 2025: AI API, Service Layer, and Build Reliability
- **AI Programmatic API:** `/api/commands` endpoint for automation/AI, requires both API key and user JWT, always respects user security (RLS).
- **Service Layer:** All business logic is centralized in `core-logic/taskService.ts` and reused by both UI and API for consistency and security.
- **Vercel Build Reliability:** Persistent build failures caused by a misplaced test file in `core-logic` have been resolved. All aggressive workarounds (pre-build.sh, VERCEL_BUILD_NO_TYPECHECK, etc.) have been reverted. The build is now clean, type-safe, and reliable. See `COMMANDS.md` for protocol.
- **Testing:** All E2E and unit tests must be run in terminal. All tests pass in Chromium, Firefox, and Webkit.
- **Docs:** All foundational docs are now the project brain for non-coders and engineers alike.

---

## Features
- Task creation, completion, editing, deletion
- Due date support (with manual SQL migration for E2E)
- **Task Priority Levels** (schema, service, UI, API, docs, and tests complete; E2E migration must be applied manually due to network limitation)
- Filtering, sorting, and inline editing
- AI API integration for all major task actions

## Testing & Migration Status
- **Unit tests:** All pass for Task Priority Levels and Due Dates
- **E2E tests:** Blocked until manual SQL migration for priority column is applied in E2E Supabase project
- **Production:** All migrations must be version-controlled and applied via CLI/CI/CD; manual SQL is only a temporary E2E workaround

## Protocol
- See ENVIRONMENT_FILES.md and COMMANDS.md for up-to-date migration/testing instructions and workarounds
- All agents must follow CTO policy for migrations and environment management

---

For more details, see the README or contact the engineering team.
