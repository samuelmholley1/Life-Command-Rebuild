# Environment Files & CTO Policy

_Last updated: July 8, 2025_

This document describes all environment files and the CTO policy for migrations and test/production separation.

## Environment Files
- `.env.e2e`: E2E (test) Supabase project and test user info (used for all E2E tests and scripts). Includes database pw for Supabase CLI commands.
- `.env.production`: Production Supabase project info (used for production deployments and CI)
- `apps/web/.env.local`: Production Supabase project info (used for local development and Vercel deploys)

## Due Date & Priority Column Migrations (July 2025)
- The `due_date` and `priority` columns were added to the E2E database via one-time manual SQL migrations (see README for CTO policy and workaround for IPv6-only E2E projects).
- All future migrations for E2E and production must use migration files and CLI, except when direct connection is not possible (as with this E2E project).
- Never run migrations or destructive tests against the production environment.

## CTO Policy
- All agents must follow the onboarding protocol in the README.
- All environment and migration changes must be documented here and in the README if significant.
- If CLI migrations are not possible due to network or IPv6 issues, manual SQL must be applied in the Supabase dashboard for E2E only. Production must always use version-controlled migrations.

---

For onboarding and protocols, see the top of the README.
