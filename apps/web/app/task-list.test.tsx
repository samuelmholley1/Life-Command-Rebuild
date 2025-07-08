import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import TaskList from './task-list';

jest.mock('@tanstack/react-query');

describe('TaskList', () => {
  const mockedUseQuery = useQuery as jest.Mock;

  it('renders tasks from useQuery', () => {
    mockedUseQuery.mockReturnValue({
      data: [{ id: '42', title: 'Pure Test Task', completed: false }],
      isLoading: false,
    });
    const mockCreate = jest.fn();
    const mockUpdate = jest.fn();

    render(
      <TaskList
        createTaskAction={mockCreate}
        updateTaskStatusAction={mockUpdate}
      />
    );
    expect(screen.getByText('Pure Test Task')).toBeInTheDocument();
  });

  it('should call the deleteTask action with the correct task id when delete is clicked', () => {
    mockedUseQuery.mockReturnValue({
      data: [
        { id: '1', title: 'First Task', completed: false },
        { id: '2', title: 'Second Task', completed: false },
      ],
      isLoading: false,
    });
    const mockCreate = jest.fn();
    const mockUpdate = jest.fn();
    const mockDelete = jest.fn();

    render(
      <TaskList
        createTaskAction={mockCreate}
        updateTaskStatusAction={mockUpdate}
        deleteTaskAction={mockDelete}
      />
    );

    const deleteButton = screen.getByTestId('delete-task-2');
    fireEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete.mock.calls[0][0].get('id')).toBe('2');
  });
});
