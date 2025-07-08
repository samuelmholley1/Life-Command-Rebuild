"use client";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasksQuery } from "./queries";
import type { Task } from "@life-command/core-logic";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface TaskListProps {
  createTaskAction: (formData: FormData) => Promise<void>;
  updateTaskStatusAction: (formData: FormData) => Promise<void>;
  deleteTaskAction: (formData: FormData) => Promise<void>;
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
    <form ref={formRef} action={action} className="flex gap-2 mt-4">
      <input
        type="text"
        name="title"
        placeholder="New task title"
        required
        className="border rounded px-3 py-2 flex-1"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-3 py-2"
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
}: TaskListProps) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery(getTasksQuery(supabase));

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
      <ul className="mb-4">
        {tasks.map((task: Task) => (
          <li
            key={task.id}
            className="py-1 border-b last:border-b-0 flex items-center gap-2"
            data-testid="task-item"
          >
            <form
              className="flex items-center gap-2 w-full"
              onSubmit={(e) => e.preventDefault()}
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
              />
              <span
                className={
                  task.completed ? "line-through text-gray-400" : ""
                }
              >
                {task.title}
              </span>
              <button
                type="button"
                data-testid={`delete-task-${task.id}`}
                aria-label="Delete"
                onClick={() => {
                  const formData = new FormData();
                  formData.append('id', task.id);
                  deleteTaskAction(formData);
                }}
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      <AddTaskForm createTaskAction={createTaskAction} />
    </div>
  );
}
