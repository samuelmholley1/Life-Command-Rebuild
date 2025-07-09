import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from './TaskList';

describe('TaskList - Priority', () => {
  it('calls setPriorityAction with correct task ID and priority value', () => {
    const mockSetPriorityAction = jest.fn();
    const mockTask = {
      id: 'task-123',
      title: 'Test Task',
      completed: false,
      priority: 1, // Default priority
    };
    render(
      <TaskList
        tasks={[mockTask]}
        setPriorityAction={mockSetPriorityAction}
      />
    );
    // Simulate user selecting a new priority
    const select = screen.getByTestId('set-priority-select');
    fireEvent.change(select, { target: { value: '3' } }); // Set to High
    expect(mockSetPriorityAction).toHaveBeenCalledTimes(1);
    expect(mockSetPriorityAction).toHaveBeenCalledWith('task-123', 3);
  });
});
