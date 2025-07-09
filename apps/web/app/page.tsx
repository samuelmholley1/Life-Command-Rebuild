import { redirect } from "next/navigation";
import { createSupabaseReadOnlyServerClient, createSupabaseServerClient } from "@/lib/supabase/server";
import TaskList from "./task-list";
import { signOut, createTask, updateTaskStatus, deleteTask, updateTaskTitle, setDueDate, setPriority } from "./actions";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTasksQuery } from "./queries";
import { createTaskLogic } from "@life-command/core-logic";
import type { Task } from "@life-command/core-logic";

export default async function HomePage() {
  const supabase = createSupabaseReadOnlyServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Prefetch tasks using TanStack Query
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTasksQuery(supabase));
  const tasks = await queryClient.getQueryData<Task[]>(["tasks"]);

  // If no tasks, insert welcome task and re-fetch
  if (!tasks || tasks.length === 0) {
    // Use a writeable client for creating the welcome task
    const writeableSupabase = createSupabaseServerClient();
    await createTaskLogic(writeableSupabase, {
      title: "Welcome to Life Command!",
      user_id: user.id,
    });
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    await queryClient.prefetchQuery(getTasksQuery(supabase));
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="min-h-screen">
      {/* Header with Sign Out */}
      <header className="mb-8 flex justify-between items-center py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Life Command</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white font-bold bg-gray-600 hover:bg-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-150"
          >
            Sign Out
          </button>
        </form>
      </header>
      
      {/* Main Content */}
      <main>
        <HydrationBoundary state={dehydratedState}>
          <TaskList
            createTaskAction={createTask}
            updateTaskStatusAction={updateTaskStatus}
            deleteTaskAction={deleteTask}
            updateTaskTitleAction={updateTaskTitle}
            setDueDateAction={setDueDate}
            setPriorityAction={setPriority}
          />
        </HydrationBoundary>
      </main>
    </div>
  );
}
