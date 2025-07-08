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

  // Parse tokens from response
  const { accessToken, refreshToken, user } = await response.json();

  // Save the authenticated state (cookies) from the page's context
  await page.context().storageState({ path: storageState as string });

  // Clean up all tasks for the authenticated user
  if (accessToken && user?.id) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );
    try {
      const { error } = await supabase.from('tasks').delete().eq('user_id', user.id);
      if (error) {
        console.error('E2E global setup: Failed to delete tasks for test user:', error.message);
      } else {
        console.log('E2E global setup: Successfully deleted all tasks for test user.');
      }
    } catch (err) {
      console.error('E2E global setup: Exception during task cleanup:', err);
    }
  } else {
    console.warn('E2E global setup: Could not clean up tasks, missing accessToken or user.id');
  }

  // Close the browser instance
  await browser.close();
}

export default globalSetup;
