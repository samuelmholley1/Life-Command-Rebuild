import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import TaskList from './task-list';

jest.mock('@tanstack/react-query');

const mockedUseQuery = useQuery as jest.Mock;
const mockedUseMutation = useMutation as jest.Mock;

describe('TaskList', () => {
  beforeEach(() => {
    mockedUseMutation.mockImplementation(({ mutationFn }: { mutationFn: (args: any) => void }) => ({
      mutate: (args: any) => mutationFn(args),
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
});
