import { test, expect, Page } from '@playwright/test';

// Helper function to create a task to ensure test isolation
const createTask = async (page: Page, title: string) => {
  await page.getByPlaceholder('New task title').fill(title);
  await page.getByRole('button', { name: /add task/i }).click();
  await expect(page.getByText(title)).toBeVisible();
};

test('Core Task Management Flow', async ({ page }) => {
  // Go to the base URL
  await page.goto('/');

  // Assert authentication: 'Sign Out' button is visible
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();

  // Fill in the new task title
  const taskTitle = `My First E2E Task - ${Date.now()}`;
  await page.getByPlaceholder('New task title').fill(taskTitle);

  // Click the 'Add Task' button
  await page.getByRole('button', { name: /add task/i }).click();

  // Assert the new task appears in the document
  await expect(page.getByText(taskTitle)).toBeVisible();
});

test.describe('Task Management', () => {
  test('allows a user to delete a task', async ({ page }) => {
    const taskTitle = `Task to be deleted - ${Date.now()}`;
    await page.goto('/');
    await createTask(page, taskTitle);

    // Locate the specific task item by data-testid and text
    const taskItem = page.getByTestId('task-item').filter({ hasText: taskTitle });

    // Find and click the delete button within that task's scope
    await taskItem.getByRole('button', { name: /delete/i }).click();

    // Assert that the task is no longer visible on the page
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });
});
