import { test, expect } from '@playwright/test';

test('Core Task Management Flow', async ({ page }) => {
  // Go to the base URL
  await page.goto('/');

  // Assert authentication: 'Sign Out' button is visible
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();

  // Fill in the new task title
  const taskTitle = 'My First E2E Task';
  await page.getByPlaceholder('New task title').fill(taskTitle);

  // Click the 'Add Task' button
  await page.getByRole('button', { name: /add task/i }).click();

  // Assert the new task appears in the document
  await expect(page.getByText(taskTitle)).toBeVisible();
});
