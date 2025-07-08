import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
});
