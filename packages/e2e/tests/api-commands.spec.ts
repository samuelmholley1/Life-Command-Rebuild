import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE_URL = 'http://localhost:3000';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!;

test.describe('AI Programmatic API', () => {
  let userJwtToken: string;

  test.beforeAll(async ({ request }) => {
    // Get JWT token by logging in through the E2E login endpoint
    const loginResponse = await request.post(`${API_BASE_URL}/api/e2e-login`, {
      data: {
        email: process.env.E2E_EMAIL!,
        password: process.env.E2E_PASSWORD!,
      }
    });

    if (!loginResponse.ok()) {
      throw new Error(`E2E login failed: ${loginResponse.status()}`);
    }

    const { session } = await loginResponse.json();
    if (!session?.access_token) {
      throw new Error('Failed to get access token from login response');
    }

    userJwtToken = session.access_token;
  });

  test('should reject requests without API key', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'createTask',
        payload: { title: 'Test Task' }
      }
    });

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should reject requests without JWT token', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
      },
      data: {
        action: 'createTask',
        payload: { title: 'Test Task' }
      }
    });

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toContain('Missing or invalid authorization header');
  });

  test('should reject requests with invalid JWT token', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': 'Bearer invalid-jwt-token',
      },
      data: {
        action: 'createTask',
        payload: { title: 'Test Task' }
      }
    });

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toContain('Invalid JWT token');
  });

  test('should create task via API and persist in database', async ({ request, page }) => {
    const uniqueTitle = `API Test Task - ${Date.now()}`;
    
    // Create task via API
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'createTask',
        payload: { title: uniqueTitle }
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.message).toBe('Task created');

    // Verify task appears in UI
    await page.goto('/');
    await expect(page.getByText(uniqueTitle)).toBeVisible();
  });

  test('should delete task via API and remove from UI', async ({ request, page }) => {
    const uniqueTitle = `API Delete Test Task - ${Date.now()}`;
    
    // First create a task via UI to get its ID
    await page.goto('/');
    await page.getByPlaceholder('New task title').fill(uniqueTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for task to appear and get its ID
    const taskItem = await page.locator('[data-testid="task-item"]').filter({ hasText: uniqueTitle }).first();
    await expect(taskItem).toBeVisible();
    const taskId = await taskItem.getAttribute('data-task-id');
    
    if (!taskId) {
      throw new Error('Could not get task ID from created task');
    }

    // Delete task via API
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'deleteTask',
        payload: { id: taskId }
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.message).toBe('Task deleted');

    // Verify task is removed from UI
    await page.goto('/');
    await expect(page.getByText(uniqueTitle)).not.toBeVisible();
  });

  test('should update task completion via API and reflect in UI', async ({ request, page }) => {
    const uniqueTitle = `API Completion Test Task - ${Date.now()}`;
    
    // Create task via UI
    await page.goto('/');
    await page.getByPlaceholder('New task title').fill(uniqueTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Get task ID
    const taskItem = await page.locator('[data-testid="task-item"]').filter({ hasText: uniqueTitle }).first();
    await expect(taskItem).toBeVisible();
    const taskId = await taskItem.getAttribute('data-task-id');
    
    if (!taskId) {
      throw new Error('Could not get task ID from created task');
    }

    // Update completion via API
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'updateTaskCompletion',
        payload: { id: taskId, completed: true }
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.message).toBe('Task completion updated');

    // Verify completion status in UI
    await page.goto('/');
    const updatedTaskItem = page.locator('[data-testid="task-item"]').filter({ hasText: uniqueTitle });
    const checkbox = updatedTaskItem.locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();
  });

  test('should update task title via API and reflect in UI', async ({ request, page }) => {
    const originalTitle = `API Title Test Task - ${Date.now()}`;
    const newTitle = `Completely New Title - ${Date.now()}`;
    
    // Create task via UI
    await page.goto('/');
    await page.getByPlaceholder('New task title').fill(originalTitle);
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Get task ID
    const taskItem = await page.locator('[data-testid="task-item"]').filter({ hasText: originalTitle }).first();
    await expect(taskItem).toBeVisible();
    const taskId = await taskItem.getAttribute('data-task-id');
    
    if (!taskId) {
      throw new Error('Could not get task ID from created task');
    }

    // Update title via API
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'updateTaskTitle',
        payload: { id: taskId, title: newTitle }
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.message).toBe('Task title updated');

    // Verify new title appears and old title is gone
    await page.goto('/');
    await expect(page.getByText(newTitle)).toBeVisible();
    await expect(page.getByText(originalTitle)).not.toBeVisible();
  });

  test('should reject unknown actions', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'unknownAction',
        payload: { data: 'test' }
      }
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toBe('Unknown action');
  });

  test('should validate payload schema for createTask', async ({ request }) => {
    // Test missing title
    const response1 = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'createTask',
        payload: {}
      }
    });

    expect(response1.status()).toBe(400);
    const responseBody1 = await response1.json();
    expect(responseBody1.status).toBe('error');
    // Accept either error message format
    expect(responseBody1.message).toMatch(/Required|Title is required/);

    // Test empty title
    const response2 = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'createTask',
        payload: { title: '' }
      }
    });

    expect(response2.status()).toBe(400);
    const responseBody2 = await response2.json();
    expect(responseBody2.status).toBe('error');
    // Accept either error message format
    expect(responseBody2.message).toMatch(/Required|Title is required/);
  });

  test('should validate payload schema for updateTaskCompletion', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/commands`, {
      headers: {
        'x-api-key': INTERNAL_API_KEY,
        'Authorization': `Bearer ${userJwtToken}`,
      },
      data: {
        action: 'updateTaskCompletion',
        payload: { id: 'invalid-uuid', completed: true }
      }
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('error');
    expect(responseBody.message).toContain('Invalid uuid');
  });
});
