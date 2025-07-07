declare module '@supabase/ssr' {
  import { SupabaseClient, createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
  import type { CookieOptions } from 'cookie';
  
  export function createBrowserClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions<"public">
  ): SupabaseClient<Database>;

  export function createServerClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options: { cookies: any }
  ): SupabaseClient<Database>;
}
