import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { createTaskLogic } from '@life-command/core-logic';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Check API key authentication
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request payload
    const body = await request.json();
    const { action, payload } = body;

    // For API requests, we need a JWT token to authenticate as a specific user
    const authToken = request.headers.get('authorization');
    if (!authToken || !authToken.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'error', message: 'Missing or invalid authorization header. Expected: Bearer <jwt_token>' },
        { status: 401 }
      );
    }

    const jwt = authToken.replace('Bearer ', '');

    // Create a Supabase client with the provided JWT
    const supabase = createSupabaseServerClient();
    
    // Set the session using the provided JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid JWT token or user not found' },
        { status: 401 }
      );
    }

    switch (action) {
      case 'createTask': {
        // Validate the payload
        if (!payload?.title || typeof payload.title !== 'string' || payload.title.trim() === '') {
          return NextResponse.json(
            { status: 'error', message: 'Invalid payload: title must be a non-empty string' },
            { status: 400 }
          );
        }

        // Use the core business logic with the authenticated user's Supabase client
        await createTaskLogic(supabase, {
          title: payload.title,
          user_id: user.id,
        });

        // Revalidate the home page cache
        revalidatePath('/');

        return NextResponse.json(
          { status: 'success', message: 'Task created', user_id: user.id },
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
