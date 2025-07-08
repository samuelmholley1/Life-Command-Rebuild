'use server';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { TaskSchema, UpdateTaskSchema, DeleteTaskSchema } from '@life-command/core-logic';

export async function createTask(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const title = formData.get('title');
  const parseResult = TaskSchema.pick({ title: true }).safeParse({ title });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || 'Invalid title');
  }

  await supabase.from('tasks').insert({
    user_id: user.id,
    title: parseResult.data.title,
  });

  revalidatePath('/');
}

export async function updateTaskStatus(formData: FormData) {
  const id = formData.get('id');
  const completed = formData.get('completed');
  const parseResult = UpdateTaskSchema.safeParse({
    id,
    completed: completed === 'true',
  });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || 'Invalid input');
  }
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  await supabase
    .from('tasks')
    .update({ completed: parseResult.data.completed })
    .eq('id', parseResult.data.id)
    .eq('user_id', user.id);
  revalidatePath('/');
}

export async function deleteTask(formData: FormData) {
  const id = formData.get('id');
  const parseResult = DeleteTaskSchema.safeParse({ id });
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0]?.message || 'Invalid id');
  }
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', parseResult.data.id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  // Optionally, you could revalidatePath('/') here if needed
  // revalidatePath('/');
  // Redirect to login page
  // @ts-expect-error: globalThis.redirect is only available in the E2E test environment, not in production or type definitions
  return globalThis?.redirect ? globalThis.redirect('/login') : (await import('next/navigation')).redirect('/login');
}
