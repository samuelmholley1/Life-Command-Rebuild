# Load .env.e2e and run Supabase migration and E2E tests
export $(cat .env.e2e | xargs) && npx supabase db push && yarn e2e
