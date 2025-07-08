import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { act } from 'react';
import TaskList from './task-list';

jest.mock('@tanstack/react-query');

const mockedUseQuery = useQuery as jest.Mock;
const mockedUseMutation = useMutation as jest.Mock;

describe('TaskList', () => {
  beforeEach(() => {
    mockedUseMutation.mockImplementation(({ mutationFn }: { mutationFn: (args: FormData) => void }) => ({
      mutate: (args: FormData) => mutationFn(args),
    }));
  });

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
        deleteTaskAction={jest.fn()}
      />
    );
    expect(screen.getByText('Pure Test Task')).toBeInTheDocument();
  });

  it('toggles completion and calls updateTaskStatusAction', () => {
    mockedUseQuery.mockReturnValue({
      data: [{ id: '1', title: 'Toggle Me', completed: false }],
      isLoading: false,
    });
    const mockCreate = jest.fn();
    const mockUpdate = jest.fn();
    render(
      <TaskList
        createTaskAction={mockCreate}
        updateTaskStatusAction={mockUpdate}
        deleteTaskAction={jest.fn()}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate.mock.calls[0][0].get('id')).toBe('1');
    expect(mockUpdate.mock.calls[0][0].get('completed')).toBe('true');
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

  it('filters tasks by active/completed/all', () => {
    mockedUseQuery.mockReturnValue({
      data: [
        { id: '1', title: 'Active Task', completed: false },
        { id: '2', title: 'Completed Task', completed: true },
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
    // Default: All
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    // Filter: Active
    fireEvent.click(screen.getByRole('button', { name: /active/i }));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).toBeNull();
    // Filter: Completed
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.queryByText('Active Task')).toBeNull();
    // Filter: All
    fireEvent.click(screen.getByRole('button', { name: /^all$/i }));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  it('sorts tasks by newest, oldest, A-Z, Z-A', () => {
    mockedUseQuery.mockReturnValue({
      data: [
        { id: '1', title: 'Bravo', completed: false, created_at: '2025-07-06T10:00:00Z' },
        { id: '2', title: 'Alpha', completed: false, created_at: '2025-07-07T10:00:00Z' },
        { id: '3', title: 'Charlie', completed: false, created_at: '2025-07-05T10:00:00Z' },
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
    // Default: Newest
    const items = screen.getAllByTestId('task-item');
    expect(items[0]).toHaveTextContent('Alpha'); // Newest
    expect(items[1]).toHaveTextContent('Bravo');
    expect(items[2]).toHaveTextContent('Charlie');
    // Oldest
    fireEvent.change(screen.getByLabelText(/sort tasks/i), { target: { value: 'oldest' } });
    const oldestItems = screen.getAllByTestId('task-item');
    expect(oldestItems[0]).toHaveTextContent('Charlie');
    expect(oldestItems[1]).toHaveTextContent('Bravo');
    expect(oldestItems[2]).toHaveTextContent('Alpha');
    // A-Z
    fireEvent.change(screen.getByLabelText(/sort tasks/i), { target: { value: 'az' } });
    const azItems = screen.getAllByTestId('task-item');
    expect(azItems[0]).toHaveTextContent('Alpha');
    expect(azItems[1]).toHaveTextContent('Bravo');
    expect(azItems[2]).toHaveTextContent('Charlie');
    // Z-A
    fireEvent.change(screen.getByLabelText(/sort tasks/i), { target: { value: 'za' } });
    const zaItems = screen.getAllByTestId('task-item');
    expect(zaItems[0]).toHaveTextContent('Charlie');
    expect(zaItems[1]).toHaveTextContent('Bravo');
    expect(zaItems[2]).toHaveTextContent('Alpha');
  });

  it('allows inline editing of a task title and calls updateTaskTitleAction', async () => {
    mockedUseQuery.mockReturnValue({
      data: [{ id: '99', title: 'Editable Task', completed: false }],
      isLoading: false,
    });
    const mockCreate = jest.fn();
    const mockUpdateStatus = jest.fn();
    const mockDelete = jest.fn();
    const mockUpdateTitle = jest.fn();

    render(
      <TaskList
        createTaskAction={mockCreate}
        updateTaskStatusAction={mockUpdateStatus}
        deleteTaskAction={mockDelete}
        updateTaskTitleAction={mockUpdateTitle}
      />
    );
    // Click the task title to activate editing
    fireEvent.click(screen.getByTestId('task-title'));
    // Input should appear with original value
    const input = screen.getByTestId('edit-title-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Editable Task');
    // Change the value
    fireEvent.change(input, { target: { value: 'New Title' } });
    // Press Enter and await state update
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });
    // Should call updateTaskTitleAction with correct id and new title
    expect(mockUpdateTitle).toHaveBeenCalledTimes(1);
    const formData = mockUpdateTitle.mock.calls[0][0];
    expect(formData.get('id')).toBe('99');
    expect(formData.get('title')).toBe('New Title');
  });
});
