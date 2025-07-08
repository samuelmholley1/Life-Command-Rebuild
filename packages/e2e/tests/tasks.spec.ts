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

test.describe('Task Filtering and Sorting', () => {
  test('filters tasks by active/completed/all', async ({ page }) => {
    await page.goto('/');
    // Create tasks
    const activeTitle = `Active E2E Task - ${Date.now()}`;
    const completedTitle = `Completed E2E Task - ${Date.now()}`;
    await page.getByPlaceholder('New task title').fill(activeTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(activeTitle)).toBeVisible(); // Wait for active task
    await page.getByPlaceholder('New task title').fill(completedTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText(completedTitle)).toBeVisible(); // Wait for completed task
    // Debug: print all task items before marking completed
    const allTaskItems = await page.locator('[data-testid="task-item"]').allTextContents();
    console.log('DEBUG: All task items before marking completed:', allTaskItems);
    // Mark one as completed
    const completedCheckbox = page.getByTestId('task-item').filter({ hasText: completedTitle }).getByRole('checkbox');
    await completedCheckbox.check();
    // All
    await expect(page.getByText(activeTitle)).toBeVisible();
    await expect(page.getByText(completedTitle)).toBeVisible();
    // Active
    await page.getByRole('button', { name: /active/i }).click();
    await expect(page.getByText(activeTitle)).toBeVisible();
    await expect(page.getByText(completedTitle)).not.toBeVisible();
    // Completed
    await page.getByRole('button', { name: /completed/i }).click();
    await expect(page.getByText(completedTitle)).toBeVisible();
    await expect(page.getByText(activeTitle)).not.toBeVisible();
    // All again
    await page.getByRole('button', { name: /^all$/i }).click();
    await expect(page.getByText(activeTitle)).toBeVisible();
    await expect(page.getByText(completedTitle)).toBeVisible();
  });

  test('sorts tasks by newest, oldest, A-Z, Z-A', async ({ page }) => {
    await page.goto('/');
    // Create tasks with unique titles
    const titles = [
      `Charlie E2E - ${Date.now()}`,
      `Alpha E2E - ${Date.now()}`,
      `Bravo E2E - ${Date.now()}`,
    ];
    for (const title of titles) {
      await page.getByPlaceholder('New task title').fill(title);
      await page.getByRole('button', { name: /add task/i }).click();
      await expect(page.getByText(title)).toBeVisible(); // Wait for each task
    }
    // Get all task items and filter to only those created in this test
    let items = await page.locator('[data-testid="task-item"]').allTextContents();
    const relevant = items.filter(item => titles.some(t => item.includes(t)));
    // Newest (default)
    expect(relevant[0]).toMatch(new RegExp(titles[2])); // Last created
    expect(relevant[1]).toMatch(new RegExp(titles[1]));
    expect(relevant[2]).toMatch(new RegExp(titles[0]));
    // Oldest
    await page.getByLabel('Sort tasks').selectOption('oldest');
    items = await page.locator('[data-testid="task-item"]').allTextContents();
    const relevantOldest = items.filter(item => titles.some(t => item.includes(t)));
    expect(relevantOldest[0]).toMatch(new RegExp(titles[0]));
    expect(relevantOldest[1]).toMatch(new RegExp(titles[1]));
    expect(relevantOldest[2]).toMatch(new RegExp(titles[2]));
    // A-Z
    await page.getByLabel('Sort tasks').selectOption('az');
    items = await page.locator('[data-testid="task-item"]').allTextContents();
    const relevantAZ = items.filter(item => titles.some(t => item.includes(t)));
    expect(relevantAZ[0]).toMatch(/Alpha/);
    expect(relevantAZ[1]).toMatch(/Bravo/);
    expect(relevantAZ[2]).toMatch(/Charlie/);
    // Z-A
    await page.getByLabel('Sort tasks').selectOption('za');
    items = await page.locator('[data-testid="task-item"]').allTextContents();
    const relevantZA = items.filter(item => titles.some(t => item.includes(t)));
    expect(relevantZA[0]).toMatch(/Charlie/);
    expect(relevantZA[1]).toMatch(/Bravo/);
    expect(relevantZA[2]).toMatch(/Alpha/);
  });
});
