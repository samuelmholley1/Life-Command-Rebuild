// confirm-e2e-user.js
require('dotenv').config({ path: './packages/e2e/.env' });
const fetch = require('node-fetch');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = process.env.E2E_EMAIL;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !EMAIL) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

async function confirmUser() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      apiKey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const { users } = await res.json();
  const user = users.find(u => u.email === EMAIL);
  if (!user) {
    console.error('User not found.');
    process.exit(1);
  }
  const userId = user.id;
  const patchRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'PATCH',
    headers: {
      apiKey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_confirm: true }),
  });
  if (patchRes.ok) {
    console.log('User confirmed successfully.');
  } else {
    const err = await patchRes.text();
    console.error('Failed to confirm user:', err);
    process.exit(1);
  }
}

confirmUser();
