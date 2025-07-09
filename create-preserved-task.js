// create-preserved-task.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.e2e') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const email = process.env.E2E_EMAIL;
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password: process.env.E2E_PASSWORD,
  });
  if (error || !user) {
    console.error('Failed to login as E2E user:', error?.message);
    process.exit(1);
  }
  const { data, error: insertError } = await supabase.from('tasks').insert([
    {
      user_id: user.id,
      title: '[PRESERVE] July 8, 2025 Historical Test Task',
      completed: false,
      created_at: new Date().toISOString(),
    },
  ]);
  if (insertError) {
    console.error('Failed to create preserved task:', insertError.message);
    process.exit(1);
  }
  console.log('Preserved task created:', data);
}

main();
