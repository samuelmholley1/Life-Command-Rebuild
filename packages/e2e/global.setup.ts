import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

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

  // Save the authenticated state (cookies) from the page's context
  await page.context().storageState({ path: storageState as string });
  
  // Close the browser instance
  await browser.close();
}

export default globalSetup;
