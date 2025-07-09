# Environment Files & CTO Policy

_Last updated: July 8, 2025_

This document describes all environment files and the CTO policy for migrations and test/production separation.

## Environment Files
- `.env`: E2E (test) Supabase project and test user info (used for E2E tests)
- `apps/web/.env.local`: Production Supabase project info (used for deployed/production app)
- `/packages/e2e/.env`: E2E Supabase project and test user info (for E2E tests only)
- `/apps/web/.env.local`: Production Supabase project info (for local/prod app only)

## Due Date Migration (July 2025)
- The `due_date` column was added to the E2E database via a one-time manual SQL migration (see README for CTO policy).
- All future migrations for E2E and production must use migration files and CLI.
- Never run migrations or destructive tests against the production environment.

## CTO Policy
- All agents must follow the onboarding protocol in the README.
- All environment and migration changes must be documented here and in the README if significant.

---

For onboarding and protocols, see the top of the README.
