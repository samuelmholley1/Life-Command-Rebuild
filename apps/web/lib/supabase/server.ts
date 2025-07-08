import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../database.types';

// For Server Actions, Route Handlers, and Middleware
export function createSupabaseServerClient() {
  return createServerClient<Database>(
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
}

// For read-only operations in Server Components
export function createSupabaseReadOnlyServerClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}
