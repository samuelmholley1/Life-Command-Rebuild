require('dotenv').config({ path: '../../.env.e2e' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (error) {
    console.error('Login failed:', error.message);
    process.exit(1);
  } else {
    console.log('Login successful! User:', data.user);
    process.exit(0);
  }
}

testLogin();
