import type { SupabaseClient } from '@supabase/supabase-js';
import { getTasksLogic } from '@life-command/core-logic';

export function getTasksQuery(supabase: SupabaseClient) {
  return {
    queryKey: ['tasks'],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');
      
      // Use the core logic for fetching tasks
      return await getTasksLogic(supabase, { user_id: user.id });
    },
  };
}
