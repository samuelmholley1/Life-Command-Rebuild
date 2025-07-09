import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import {
  createTaskLogic,
  deleteTaskLogic,
  updateTaskCompletionLogic,
  updateTaskTitleLogic,
  updateTaskDueDateLogic,
  CreateTaskSchema,
  DeleteTaskSchema,
  UpdateTaskCompletionSchema,
  UpdateTaskTitleSchema,
  SetDueDateSchema,
} from '@life-command/core-logic';

export async function POST(request: NextRequest) {
  try {
    // API Key Authentication
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { action, payload } = body;

    // JWT Authentication
    const authToken = request.headers.get('authorization');
    if (!authToken || !authToken.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'error', message: 'Missing or invalid authorization header. Expected: Bearer <jwt_token>' },
        { status: 401 }
      );
    }
    const jwt = authToken.replace('Bearer ', '');
    const supabase = createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid JWT token or user not found' },
        { status: 401 }
      );
    }

    // Command Execution
    switch (action) {
      case 'createTask': {
        const parseResult = CreateTaskSchema.safeParse(payload);
        if (!parseResult.success) {
          return NextResponse.json(
            { status: 'error', message: parseResult.error.errors[0]?.message || 'Invalid payload' },
            { status: 400 }
          );
        }
        await createTaskLogic(supabase, { title: payload.title, user_id: user.id });
        return NextResponse.json(
          { status: 'success', message: 'Task created' },
          { status: 200 }
        );
      }
      case 'deleteTask': {
        const parseResult = DeleteTaskSchema.safeParse(payload);
        if (!parseResult.success) {
          return NextResponse.json(
            { status: 'error', message: parseResult.error.errors[0]?.message || 'Invalid payload' },
            { status: 400 }
          );
        }
        await deleteTaskLogic(supabase, { id: payload.id, user_id: user.id });
        return NextResponse.json(
          { status: 'success', message: 'Task deleted' },
          { status: 200 }
        );
      }
      case 'updateTaskCompletion': {
        const parseResult = UpdateTaskCompletionSchema.safeParse(payload);
        if (!parseResult.success) {
          return NextResponse.json(
            { status: 'error', message: parseResult.error.errors[0]?.message || 'Invalid payload' },
            { status: 400 }
          );
        }
        await updateTaskCompletionLogic(supabase, { id: payload.id, completed: payload.completed, user_id: user.id });
        return NextResponse.json(
          { status: 'success', message: 'Task completion updated' },
          { status: 200 }
        );
      }
      case 'updateTaskTitle': {
        const parseResult = UpdateTaskTitleSchema.safeParse(payload);
        if (!parseResult.success) {
          return NextResponse.json(
            { status: 'error', message: parseResult.error.errors[0]?.message || 'Invalid payload' },
            { status: 400 }
          );
        }
        await updateTaskTitleLogic(supabase, { id: payload.id, title: payload.title, user_id: user.id });
        return NextResponse.json(
          { status: 'success', message: 'Task title updated' },
          { status: 200 }
        );
      }
      case 'setDueDate': {
        const parseResult = SetDueDateSchema.safeParse(payload);
        if (!parseResult.success) {
          return NextResponse.json(
            { status: 'error', message: parseResult.error.errors[0]?.message || 'Invalid payload' },
            { status: 400 }
          );
        }
        await updateTaskDueDateLogic(supabase, { id: payload.id, due_date: payload.due_date });
        return NextResponse.json(
          { status: 'success', message: 'Due date set' },
          { status: 200 }
        );
      }
      default: {
        return NextResponse.json(
          { status: 'error', message: 'Unknown action' },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('API command error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
