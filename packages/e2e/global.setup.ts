import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are loaded for the setup script
dotenv.config({ path: path.resolve(__dirname, './.env') });

async function globalSetup(config: FullConfig) {
  // Get the base URL and storage state path from the config
  const { baseURL, storageState } = config.projects[0].use;
  
  // Launch a new browser instance
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Make a POST request to our dedicated login endpoint
  const response = await page.request.post(`${baseURL}/api/e2e-login`, {
    data: {
      email: 'samuelmholley@gmail.com',
      password: process.env.TEST_PASSWORD!,
    }
  });

  // Check that the login was successful
  if (!response.ok()) {
    throw new Error(`E2E login failed via API route: ${response.status()}`);
  }

  // Parse tokens and user from response
  const { session, user: sessionUser } = await response.json(); // Destructure session and user

  if (!session || !sessionUser) {
    throw new Error('E2E login API did not return session or user data.');
  }

  // Assign accessToken and refreshToken from the session object
  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  // Save the authenticated state (cookies) from the page's context
  await page.context().storageState({ path: storageState as string });

  // Clean up all tasks for the authenticated user
  if (accessToken) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );
    // Use supabase.auth.getUser() to confirm the user context
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    if (getUserError || !user) {
      console.error('E2E global setup: Failed to retrieve user for cleanup:', getUserError?.message);
      throw new Error('E2E global setup: Could not retrieve test user for database cleanup.');
    }
    console.log(`E2E global setup: Retrieved user ID for cleanup: ${user.id}`); // Debug log
    try {
      // Aggressive debug logging before deletion
      // 1. Retrieve and log all existing tasks for the test user
      const { data: tasksBefore, error: selectError } = await supabase
        .from('tasks')
        .select('id, title')
        .eq('user_id', user.id);
      if (selectError) {
        console.error('E2E global setup: Error fetching tasks before deletion:', JSON.stringify(selectError, null, 2));
      } else {
        console.log(`E2E global setup: Tasks for user ${user.id} before deletion:`, tasksBefore);
      }
      // 2. Log the user.id being used for deletion
      console.log(`E2E global setup: Deleting tasks for user_id: ${user.id}`);
      // 3. Perform the delete and log the full error object if any
      const { error: deleteError } = await supabase.from('tasks').delete().eq('user_id', user.id);
      if (deleteError) {
        console.error(`E2E global setup: Failed to delete tasks for user ${user.id}:`, JSON.stringify(deleteError, null, 2));
      } else {
        console.log(`E2E global setup: Successfully deleted all tasks for user ${user.id}.`);
      }
      // 4. Log a count of tasks after the delete attempt
      const { count: tasksAfterCount, error: countError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (countError) {
        console.error('E2E global setup: Error fetching task count after deletion:', JSON.stringify(countError, null, 2));
      } else {
        console.log(`E2E global setup: Task count for user ${user.id} after deletion:`, tasksAfterCount);
      }
    } catch (err: any) {
      console.error(`E2E global setup: Error during task deletion for user ${user.id}:`, err.message);
    }
  } else {
    console.warn('E2E global setup: Could not clean up tasks, missing accessToken');
  }

  // Close the browser instance
  await browser.close();
}

export default globalSetup;
