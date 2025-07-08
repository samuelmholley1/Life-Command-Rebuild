import { test, expect, Page } from '@playwright/test';

const PRESERVED_TASK_PREFIX = '[PRESERVE]';

// Helper function to create a task to ensure test isolation
const createTask = async (page: Page, title: string) => {
  await page.getByPlaceholder('New task title').fill(title);
  await page.getByRole('button', { name: /add task/i }).click();
  // Wait for the new task item to appear and get its id (robust for Firefox)
  const taskItem = await page.locator('[data-testid="task-item"]').filter({ hasText: title }).first();
  await expect(taskItem).toBeVisible({ timeout: 10000 }); // Ensure visibility before getting attribute
  const taskId = await taskItem.getAttribute('data-task-id');
  return taskId;
};

// Helper to filter out preserved tasks from a list of task items
const filterPreservedTasks = (items: string[]) =>
  items.filter(item => !item.trim().startsWith(PRESERVED_TASK_PREFIX));

test('Core Task Management Flow', async ({ page }) => {
  // Go to the base URL
  await page.goto('/');

  // Assert authentication: 'Sign Out' button is visible
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();

  // Fill in the new task title
  const taskTitle = `My First E2E Task - ${Date.now()}`;
  const taskId = await createTask(page, taskTitle);
  // Assert the new task appears in the document
  await expect(page.locator('[data-testid="task-item"][data-task-id="' + taskId + '"]')).toBeVisible();
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
    // Also assert that no preserved task is affected
    const allTaskItems = await page.locator('[data-testid="task-item"]').allTextContents();
    const preserved = allTaskItems.filter(item => item.trim().startsWith(PRESERVED_TASK_PREFIX));
    expect(preserved.length).toBeLessThanOrEqual(1);
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });

  test('allows a user to edit a task title inline and persist the change', async ({ page }) => {
    await page.goto('/');
    const timestamp = Date.now();
    const originalTitle = `Task to be edited - ${timestamp}`;
    const updatedTitle = `Updated Task Title - ${timestamp}`;
    // Create a new unique task and get its id
    const taskId = await createTask(page, originalTitle);
    // Locate the specific task item by stable data-task-id
    const taskItem = page.locator('[data-testid="task-item"][data-task-id="' + taskId + '"]');
    // Click the task title span to activate inline editing
    await taskItem.locator('span').click();
    // Find the input for editing by test id and data-task-id
    const editInput = page.locator('input[data-testid="edit-title-input"][data-task-id="' + taskId + '"]');
    await expect(editInput).toBeVisible();
    // Clear and type the new title
    await editInput.fill(updatedTitle);
    // Press Enter to save
    await editInput.press('Enter');
    // Assert that the old title is no longer visible
    await expect(page.getByText(originalTitle)).not.toBeVisible();
    // Assert that the new title is visible
    await expect(page.getByText(updatedTitle)).toBeVisible();
    // Reload the page
    await page.reload();
    // Assert that the new title is still visible after reload
    await expect(page.getByText(updatedTitle)).toBeVisible();
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
    // Wait for active task to appear robustly
    await expect(page.getByText(activeTitle)).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('New task title').fill(completedTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    // Wait for completed task to appear robustly (longer timeout)
    await expect(page.getByText(completedTitle)).toBeVisible({ timeout: 10000 });
    // Debug: print all task items before marking completed
    let allTaskItems = await page.locator('[data-testid="task-item"]').allTextContents();
    allTaskItems = filterPreservedTasks(allTaskItems);
    console.log('DEBUG: All task items before marking completed (excluding preserved):', allTaskItems);
    // Mark one as completed
    const completedCheckbox = page.getByTestId('task-item').filter({ hasText: completedTitle }).getByRole('checkbox');
    await completedCheckbox.check();
    // All
    await expect(page.getByText(activeTitle)).toBeVisible();
    await expect(page.getByText(completedTitle)).toBeVisible();
    // Active
    await page.getByRole('button', { name: /active/i }).click();
    // Only the active task should be visible (excluding preserved)
    let visibleTasks = await page.locator('[data-testid="task-item"]').allTextContents();
    visibleTasks = filterPreservedTasks(visibleTasks);
    expect(visibleTasks.some(t => t.includes(activeTitle))).toBe(true);
    expect(visibleTasks.some(t => t.includes(completedTitle))).toBe(false);
    // Completed
    await page.getByRole('button', { name: /completed/i }).click();
    visibleTasks = await page.locator('[data-testid="task-item"]').allTextContents();
    visibleTasks = filterPreservedTasks(visibleTasks);
    expect(visibleTasks.some(t => t.includes(completedTitle))).toBe(true);
    expect(visibleTasks.some(t => t.includes(activeTitle))).toBe(false);
    // All again
    await page.getByRole('button', { name: /^all$/i }).click();
    visibleTasks = await page.locator('[data-testid="task-item"]').allTextContents();
    visibleTasks = filterPreservedTasks(visibleTasks);
    expect(visibleTasks.some(t => t.includes(activeTitle))).toBe(true);
    expect(visibleTasks.some(t => t.includes(completedTitle))).toBe(true);
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
      await expect(page.getByText(title)).toBeVisible({ timeout: 10000 }); // Wait for each task with longer timeout
    }
    // Get all task items and filter to only those created in this test, excluding preserved
    let items = await page.locator('[data-testid="task-item"]').allTextContents();
    items = filterPreservedTasks(items);
    const relevant = items.filter(item => titles.some(t => item.includes(t)));
    // Newest (default)
    expect(relevant[0]).toMatch(new RegExp(titles[2])); // Last created
    expect(relevant[1]).toMatch(new RegExp(titles[1]));
    expect(relevant[2]).toMatch(new RegExp(titles[0]));
    // Oldest
    await page.getByLabel('Sort tasks').selectOption('oldest');
    items = await page.locator('[data-testid="task-item"]').allTextContents();
    items = filterPreservedTasks(items);
    const relevantOldest = items.filter(item => titles.some(t => item.includes(t)));
    expect(relevantOldest[0]).toMatch(new RegExp(titles[0]));
    expect(relevantOldest[1]).toMatch(new RegExp(titles[1]));
    expect(relevantOldest[2]).toMatch(new RegExp(titles[2]));
    // A-Z
    await page.getByLabel('Sort tasks').selectOption('az');
    items = await page.locator('[data-testid="task-item"]').allTextContents();
    items = filterPreservedTasks(items);
    const relevantAZ = items.filter(item => titles.some(t => item.includes(t)));
    expect(relevantAZ[0]).toMatch(/Alpha/);
    expect(relevantAZ[1]).toMatch(/Bravo/);
    expect(relevantAZ[2]).toMatch(/Charlie/);
    // Z-A
    await page.getByLabel('Sort tasks').selectOption('za');
    items = await page.locator('[data-testid="task-item"]').allTextContents();
    items = filterPreservedTasks(items);
    const relevantZA = items.filter(item => titles.some(t => item.includes(t)));
    expect(relevantZA[0]).toMatch(/Charlie/);
    expect(relevantZA[1]).toMatch(/Bravo/);
    expect(relevantZA[2]).toMatch(/Alpha/);
  });
});
