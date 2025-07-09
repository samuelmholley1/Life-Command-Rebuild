'use server';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  createTaskLogic, 
  updateTaskStatusLogic, 
  updateTaskTitleLogic, 
  deleteTaskLogic, 
  updateTaskDueDateLogic,
  updateTaskPriorityLogic, 
  SetPrioritySchema 
} from '@life-command/core-logic';

export async function createTask(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const title = formData.get('title') as string;
  
  // Call the core logic, passing the authenticated client and user ID
  await createTaskLogic(supabase, { title, user_id: user.id });

  revalidatePath('/');
}

export async function updateTaskStatus(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get('id') as string;
  const completed = formData.get('completed') === 'true';
  
  // Call the core logic, passing the authenticated client and user ID
  await updateTaskStatusLogic(supabase, { id, completed, user_id: user.id });

  revalidatePath('/');
}

export async function updateTaskTitle(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  
  // Call the core logic, passing the authenticated client and user ID
  await updateTaskTitleLogic(supabase, { id, title, user_id: user.id });

  revalidatePath('/');
}

export async function deleteTask(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get('id') as string;
  
  // Call the core logic, passing the authenticated client and user ID
  await deleteTaskLogic(supabase, { id, user_id: user.id });

  revalidatePath('/');
}

export async function setDueDate(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get('id') as string;
  let due_date = formData.get('due_date') as string | null;
  if (due_date === '') due_date = null;

  await updateTaskDueDateLogic(supabase, { id, due_date });
  revalidatePath('/');
}

export async function setPriority(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get('id') as string;
  const priority = Number(formData.get('priority'));
  if (!SetPrioritySchema.safeParse({ id, priority }).success) {
    throw new Error('Invalid priority or id');
  }
  await updateTaskPriorityLogic(supabase, { id, priority });
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
