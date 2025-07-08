// create-e2e-user.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './packages/e2e/.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  // Try to sign up (will error if user exists)
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error && !error.message.includes('already registered')) {
    console.error('Failed to create E2E user:', error.message);
    process.exit(1);
  } else {
    console.log('E2E user created or already exists:', email);
  }
}

main();
