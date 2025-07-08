# Project Context: MVP Speed vs. "Everything App" Architecture

> **Required Reading:** This document is foundational for all new agents and contributors. Review thoroughly before any engineering or product work. See README for onboarding protocol.

## The Central Tension
Building a simple "notepad" app is easy. Building a platform that can one day manage every aspect of a person's life is hard. Doing both at the same time requires careful architectural decisions.

### 1. The Tension in the Database Schema
- **MVP Need:** A simple tasks table with a title and a user_id.
- **"Everything App" Need:** A schema with users, workspaces, projects, goals, tasks, sub-tasks, tags, and complex relational joins.
- **The Bridge (What you have correctly done):** You started with the more complex, scalable schema from day one. You have a tasks table that already includes workspace_id, project_id, and priority. This feels like overkill for an MVP, but it is the single most important architectural decision you have made. It ensures that every task you and your wife create today is already structured in a way that can be seamlessly integrated into the "goals" and "projects" features you will build years from now. You have paid the architectural price upfront to guarantee data integrity and future compatibility.

### 2. The Tension in the API Layer
- **MVP Need:** A single endpoint, /createTask, that takes a title.
- **"Everything App" Need:** A full REST or GraphQL API with endpoints for every resource, handling complex permissions and data shapes.
- **The Bridge (What you have correctly done):** You built your API using Next.js API Routes. This is a flexible and scalable pattern. More importantly, you implemented a taskService. This decouples your UI from your API. In the future, you can change your entire API structure (e.g., move to GraphQL) and you will only need to update the taskService, not every single component that fetches data. This is a critical separation of concerns.

### 3. The Tension in the UI/Components
- **MVP Need:** A single form and a single list.
- **"Everything App" Need:** Dashboards, calendars, nested views, collaborative features.
- **The Bridge (What you have correctly done):** You built the UI with React components (TaskForm, TaskList). While simple now, they are inherently composable. The TaskList doesn't care if it's rendering tasks for a personal to-do list or for a sub-project in a multi-million dollar corporate venture. As long as the data it receives conforms to the Task type, it will work. This component-based architecture ensures you can reuse, refactor, and expand the UI without starting from scratch.

### 4. The Tension in Secure Automation & Service Layer
- **MVP Need:** Simple API for automation, but with user-level security.
- **"Everything App" Need:** A programmatic API that can safely automate user actions, never bypassing RLS or user context.
- **The Bridge (What you have correctly done):** Implemented a secure `/api/commands` endpoint that requires both an API key and a user JWT, and refactored all business logic into a service layer (`taskService.ts`). This ensures all automation and UI flows use the same code, and all security policies are always enforced.

## How We Have Triaged This Tension
Our entire debugging journey was, in effect, a process of correctly managing this tension. We built a robust, scalable architecture first, and then methodically fixed the small, tactical bugs required to make a simple MVP function on top of it.

We prioritized architectural correctness (E2E tests, auth providers, database migrations, robust selectors, centralized schemas) even when it felt slow, because this is the foundation that ensures your Data Integrity and future scalability.

We are now focused on making the UI meet the Simplicity and Speed need, knowing that the powerful architecture underneath is ready to support whatever comes next.

Your decision to start with a professional-grade monorepo and a relational schema, while creating significant initial friction, was the correct one. It ensures that the simple task data you create tomorrow will be a valuable, queryable asset for the "Everything App" you build years from now. You will not have to rip anything out. You will only build upon the foundation you have just successfully laid.

## Task Completion Status: Use `completed` Only

- The canonical field for marking a task as complete/incomplete is `completed` (boolean).
- Do not use `is_completed` anywhere in the codebase, schema, or documentation.
- All types, queries, and UI must reference `completed`.

## July 2025 Architectural Progress
### Major UI/UX Enhancement (July 8, 2025)
- Implemented comprehensive UI/UX enhancement pass with modern design system
- Established consistent visual language using Tailwind CSS with proper spacing, colors, and typography
- Enhanced task management interface with card-based layouts, improved controls, and clear visual hierarchy
- Added proper accessibility features including focus states, semantic HTML, and proper contrast
- Implemented responsive design with centered content layout for optimal user experience
- All UI improvements validated through comprehensive E2E and unit test suites

### Core Architecture (Earlier July 2025)
- All task-related Zod schemas are now centralized in `task-schema.ts` for maintainability and clarity.
- Inline editing for task titles is implemented with robust, attribute-based selectors and full server validation. All E2E tests pass in all browsers.
- E2E and unit tests cover all critical flows, including inline editing and error handling.
- Documentation and command usage are now strictly Yarn Berry workspace-based for reliability.
- **CRITICAL TESTING PROTOCOL:** All tests must be run in terminal for proper observation and debugging.

## July 2025: AI API, Service Layer, and Build Reliability
- **AI Programmatic API:** `/api/commands` endpoint for automation/AI, requires both API key and user JWT, always respects user security (RLS).
- **Service Layer:** All business logic is centralized in `core-logic/taskService.ts` and reused by both UI and API for consistency and security.
- **Vercel Build Fix:** `vercel.json` now ensures core-logic is built before the web app, matching local build order and preventing deployment errors.
- **Testing:** All E2E and unit tests must be run in terminal. All tests pass in Chromium, Firefox, and Webkit.
- **Docs:** All foundational docs are now the project brain for non-coders and engineers alike.

## Development Guidelines
### Testing Protocol
- **ALWAYS run tests in terminal:** `cd packages/e2e && npm test` for E2E, `cd apps/web && npm test` for unit tests
- **NO VS Code test runners:** Terminal-only testing ensures proper observation and reliable results
- **Cross-browser validation:** All E2E tests must pass in Chromium, Firefox, and Webkit
- **UI validation:** All visual changes must be validated through both E2E and unit test suites

## React Testing Protocol (July 8, 2025)
- All async state updates in tests must be wrapped in `act` from `react` (not `react-dom/test-utils`) to avoid warnings and ensure test reliability.
- See the inline editing test in `apps/web/app/task-list.test.tsx` for a correct example.
- This protocol is enforced for all future test contributions.
