"use client";
import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasksQuery } from "./queries";
import type { Task } from "@life-command/core-logic";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface TaskListProps {
  createTaskAction: (formData: FormData) => Promise<void>;
  updateTaskStatusAction: (formData: FormData) => Promise<void>;
  deleteTaskAction: (formData: FormData) => Promise<void>;
  updateTaskTitleAction?: (formData: FormData) => Promise<void>;
  setDueDateAction?: (formData: FormData) => Promise<void>;
}

function AddTaskForm({
  createTaskAction,
}: {
  createTaskAction: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    await createTaskAction(formData);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={action} className="flex gap-2 mb-6">
      <input
        type="text"
        name="title"
        placeholder="New task title"
        required
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-md text-white font-bold bg-blue-500 hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
      >
        Add Task
      </button>
    </form>
  );
}

export default function TaskList({
  createTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
  updateTaskTitleAction,
  setDueDateAction,
}: TaskListProps) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery(getTasksQuery(supabase));

  // Filtering state
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  // Sorting state
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Handler for delete action
  const handleDelete = async (taskId: string) => {
    const formData = new FormData();
    formData.append('id', taskId);
    await deleteTaskAction(formData);
  };

  // Handler for due date change
  const handleDueDateChange = async (taskId: string, newDueDate: string) => {
    const formData = new FormData();
    formData.append('id', taskId);
    formData.append('due_date', newDueDate);
    if (setDueDateAction) {
      await setDueDateAction(formData);
    }
  };

  // Apply filter
  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Apply sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'newest') return (b.created_at || '').localeCompare(a.created_at || '');
    if (sort === 'oldest') return (a.created_at || '').localeCompare(b.created_at || '');
    if (sort === 'az') return a.title.localeCompare(b.title);
    if (sort === 'za') return b.title.localeCompare(a.title);
    return 0;
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("completed", String(completed));
      await updateTaskStatusAction(formData);
      return { id, completed };
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData(["tasks"], (old: Task[] = []) =>
        old.map((task) => (task.id === id ? { ...task, completed } : task))
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div>
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white rounded-lg shadow-sm">
        <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
        <button
          className={`px-4 py-2 rounded-md font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 ${filter === 'all' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setFilter('all')}
          type="button"
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-md font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 ${filter === 'active' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setFilter('active')}
          type="button"
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded-md font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 ${filter === 'completed' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setFilter('completed')}
          type="button"
        >
          Completed
        </button>
        {/* Sorting Controls */}
        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <select
            className="px-3 py-2 rounded-md border border-gray-300 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 hover:bg-gray-50"
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as "newest" | "oldest" | "az" | "za")}
            aria-label="Sort tasks"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>
      </div>
      <div className="space-y-2 mb-6">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found. Add your first task below!</p>
          </div>
        ) : (
          sortedTasks.map((task: Task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow duration-150"
              data-testid="task-item"
              data-task-id={task.id}
            >
              <form
                className="flex items-center gap-3 flex-1"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (editingId === task.id && updateTaskTitleAction) {
                    const formData = new FormData(e.currentTarget);
                    await updateTaskTitleAction(formData);
                    setEditingId(null);
                  }
                }}
              >
                <input type="hidden" name="id" value={task.id} />
                <input
                  type="checkbox"
                  name="completed"
                  checked={task.completed}
                  onChange={(e) => {
                    mutation.mutate({
                      id: task.id,
                      completed: e.currentTarget.checked,
                    });
                  }}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                {editingId === task.id ? (
                  <input
                    ref={editInputRef}
                    data-testid="edit-title-input"
                    data-task-id={task.id}
                    name="title"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={async (e) => {
                      if (updateTaskTitleAction) {
                        const formData = new FormData(e.currentTarget.form!);
                        await updateTaskTitleAction(formData);
                      }
                      setEditingId(null);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && updateTaskTitleAction) {
                        const form = (e.target as HTMLInputElement).form;
                        if (form) {
                          const formData = new FormData(form);
                          await updateTaskTitleAction(formData);
                        }
                        setEditingId(null);
                      }
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <span
                    className={`flex-1 cursor-pointer ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                    data-testid="task-title"
                    onClick={() => {
                      setEditingId(task.id);
                      setEditingTitle(task.title);
                    }}
                  >
                    {task.title}
                  </span>
                )}
              </form>
              {/* Due Date UI - NO FORM, direct handler */}
              {setDueDateAction && (
                <div className="flex items-center gap-2" style={{ marginLeft: 8 }}>
                  <input
                    type="date"
                    data-testid="set-due-date-input"
                    defaultValue={task.due_date ? task.due_date.slice(0, 10) : ''}
                    onBlur={e => handleDueDateChange(task.id, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleDueDateChange(task.id, e.currentTarget.value);
                      }
                    }}
                    className="border border-gray-300 rounded-md p-1 text-sm"
                  />
                </div>
              )}
              {task.due_date && (
                <span data-testid="due-date-display" className="ml-2 text-xs text-gray-600">
                  Due: {task.due_date.slice(0, 10)}
                </span>
              )}
              {/* Delete Button - NO FORM, direct handler */}
              <button
                type="button"
                data-testid={`delete-task-${task.id}`}
                aria-label="Delete"
                className="px-3 py-1 rounded-md text-white font-medium bg-red-500 hover:bg-red-600 ml-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      <AddTaskForm createTaskAction={createTaskAction} />
    </div>
  );
}
