# Life Command – Core App Functionality Overview

_Last updated: July 8, 2025_

This document provides a high-level, non-technical summary of all major features and flows in the Life Command application. It is intended for executive and non-coder stakeholders (e.g., CTO, product leads) who need a clear understanding of what the app does, how it works, and what is in production.

---

## Core Features

### 1. Authentication & User Management
- **Sign Up:** Users can create an account with email and password.
- **Sign In:** Users can log in securely.
- **Reset Password:** Users can request a password reset link via email if they forget their password.
- **Session Management:** Secure, persistent sessions with support for server-side rendering (SSR).
- **Test User:** Dedicated E2E test user for automated testing (not used in production).

### 2. Task Management
- **Create Task:** Users can add new tasks with a title and status.
- **Complete Task:** Mark tasks as completed or active.
- **Delete Task:** Remove tasks securely (with user validation).
- **Filter Tasks:** View all, active, or completed tasks.
- **Sort Tasks:** Sort tasks by creation date or status.
- **Preserved Task:** One historical test task is always present for auditability/testing (never deleted).

### 3. Data Security & Privacy
- **Row-Level Security (RLS):** All data is protected at the database level; users can only access their own tasks.
- **No Sensitive Data in Errors:** All user-facing errors are actionable and never leak backend details.
- **Environment Separation:** Test and production data are strictly separated.

### 4. Testing & Quality
- **E2E Testing:** Automated browser tests cover all critical user flows (login, signup, CRUD, filtering, sorting).
- **Unit Testing:** All business logic and UI components are unit tested.
- **Manual QA:** Password reset and other flows that require email are manually tested.
- **Zero Tolerance for Errors:** No known lint, type, or runtime errors in production.

### 5. Deployment & Operations
- **Vercel Deployment:** Zero-config, production-ready deployment pipeline.
- **Monorepo:** All code, configs, and packages managed in a single repository.
- **Yarn Berry:** Modern dependency management for reliability and speed.

---

## User Flows

1. **Sign Up → Confirm Email → Sign In → Create/Manage Tasks → Sign Out**
2. **Forgot Password → Request Reset Link → Receive Email → Set New Password → Sign In**
3. **E2E Test User:** Used only for automated tests, never for real data.

---

## Notable Policies & Decisions
- All code, types, and UI use `completed` (never `is_completed`) for task status.
- All navigation in server components uses Next.js `<Link>` for reliability and SSR compatibility.
- Password reset is not E2E tested (requires email inbox), but is covered by manual QA and documented.
- Preserved test data policy ensures one historical task is always present for audit/auditability.

---

For more details, see the README or contact the engineering team.
