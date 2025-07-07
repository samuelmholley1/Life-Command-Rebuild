import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TaskList from "./task-list";
import { signOut, createTask, updateTaskStatus } from "./actions";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTasksQuery } from "./queries";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Prefetch tasks using TanStack Query
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTasksQuery(supabase));
  let tasks = await queryClient.getQueryData<any[]>(["tasks"]);

  // If no tasks, insert welcome task and re-fetch
  if (!tasks || tasks.length === 0) {
    await supabase.from("tasks").insert({
      user_id: user.id,
      title: "Welcome to Life Command!",
      completed: false,
    });
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    await queryClient.prefetchQuery(getTasksQuery(supabase));
  }

  const dehydratedState = dehydrate(queryClient);
  const browserSupabase = createSupabaseBrowserClient();

  return (
    <>
      <form action={signOut} className="mb-6">
        <button type="submit" className="bg-gray-200 text-gray-800 rounded px-3 py-2">
          Sign Out
        </button>
      </form>
      <HydrationBoundary state={dehydratedState}>
        <TaskList
          createTaskAction={createTask}
          updateTaskStatusAction={updateTaskStatus}
          supabase={browserSupabase}
        />
      </HydrationBoundary>
    </>
  );
}
