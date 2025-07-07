import type { SupabaseClient } from '@supabase/supabase-js';

export function getTasksQuery(supabase: SupabaseClient) {
  return {
    queryKey: ['tasks'],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return tasks || [];
    },
  };
}
