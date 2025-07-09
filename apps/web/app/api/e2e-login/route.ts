import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // --- ADD DEBUG LOGGING HERE ---
  console.log('--- E2E Login API Route Called ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Supabase URL Loaded:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Anon Key Loaded:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No');
  // --- END DEBUG LOGGING ---

  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();
  console.log('E2E LOGIN DEBUG: request body', body);
  const { email, password } = body;
  if (!email || !password) {
    console.log('E2E LOGIN DEBUG: Missing credentials', { email, password });
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.log('E2E LOGIN DEBUG: Supabase error', error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Return session and user on success
  const { session, user } = data;
  if (!session || !user) {
    console.log('E2E LOGIN DEBUG: Session or user missing', { session, user });
    return NextResponse.json({ error: 'Login successful but session data missing.' }, { status: 500 });
  }

  console.log('E2E LOGIN DEBUG: Success', { user });
  return NextResponse.json({ session, user }, { status: 200 });
}
