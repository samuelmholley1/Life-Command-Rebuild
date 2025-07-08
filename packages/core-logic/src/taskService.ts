import type { SupabaseClient } from '@supabase/supabase-js';
import { TaskSchema, UpdateTaskSchema, UpdateTaskTitleSchema, DeleteTaskSchema } from './task-schema';

export interface CreateTaskParams {
  title: string;
  user_id: string;
}

export interface UpdateTaskStatusParams {
  id: string;
  completed: boolean;
  user_id: string;
}

export interface UpdateTaskTitleParams {
  id: string;
  title: string;
  user_id: string;
}

export interface DeleteTaskParams {
  id: string;
  user_id: string;
}

export interface GetTasksParams {
  user_id: string;
}

/**
 * Core task creation logic - validates and inserts task
 */
export async function createTaskLogic(supabase: SupabaseClient, params: CreateTaskParams) {
  const parseResult = TaskSchema.pick({ title: true }).safeParse({ title: params.title });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || 'Invalid title');
  }

  const { error } = await supabase.from('tasks').insert({
    user_id: params.user_id,
    title: parseResult.data.title,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Core task status update logic - validates and updates completion status
 */
export async function updateTaskStatusLogic(supabase: SupabaseClient, params: UpdateTaskStatusParams) {
  const parseResult = UpdateTaskSchema.safeParse({
    id: params.id,
    completed: params.completed,
  });
  
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || 'Invalid input');
  }

  const { error } = await supabase
    .from('tasks')
    .update({ completed: parseResult.data.completed })
    .eq('id', parseResult.data.id)
    .eq('user_id', params.user_id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Core task title update logic - validates and updates title
 */
export async function updateTaskTitleLogic(supabase: SupabaseClient, params: UpdateTaskTitleParams) {
  const parseResult = UpdateTaskTitleSchema.safeParse({ 
    id: params.id, 
    title: params.title 
  });
  
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || 'Invalid input');
  }

  const { error } = await supabase
    .from('tasks')
    .update({ title: parseResult.data.title })
    .eq('id', parseResult.data.id)
    .eq('user_id', params.user_id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Core task deletion logic - validates and deletes task
 */
export async function deleteTaskLogic(supabase: SupabaseClient, params: DeleteTaskParams) {
  const parseResult = DeleteTaskSchema.safeParse({ id: params.id });
  
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || 'Invalid id');
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', parseResult.data.id)
    .eq('user_id', params.user_id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Core task fetching logic - gets all tasks for a user
 */
export async function getTasksLogic(supabase: SupabaseClient, params: GetTasksParams) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', params.user_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
