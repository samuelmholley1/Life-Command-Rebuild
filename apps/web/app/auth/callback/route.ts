import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    redirect('/login?message=Missing+code');
  }
  // Use the async cookies adapter as in lib/supabase/server.ts
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: Record<string, unknown>) {
          const cookieStore = await cookies();
          cookieStore.set({ name, value, ...options });
        },
        async remove(name: string, options: Record<string, unknown>) {
          const cookieStore = await cookies();
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }
  redirect('/');
}
