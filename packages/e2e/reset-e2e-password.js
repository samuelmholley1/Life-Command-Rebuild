require('dotenv').config({ path: '../../.env.e2e' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const E2E_USER_ID = '86cab5ea-99c7-48bc-98e6-36f74f3a106c';
const NEW_E2E_PASSWORD = 'e2e-test-password';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function resetPassword() {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(E2E_USER_ID, { password: NEW_E2E_PASSWORD });
    if (error) {
      console.error('Failed to update password:', error);
      process.exit(1);
    }
    console.log(`Password for E2E user ${E2E_USER_ID} successfully updated to '${NEW_E2E_PASSWORD}'.`);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

resetPassword();
