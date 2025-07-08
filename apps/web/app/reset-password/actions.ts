"use server";
import { createSupabaseServerClient } from "../../lib/supabase/server";
// import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    return { error: "Please enter a valid email address." };
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_SUPABASE_RESET_REDIRECT_URL || undefined,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
