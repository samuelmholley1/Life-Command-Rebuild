import React from 'react';

export default function ResetPasswordPage() {
  // This page should be wired to your Supabase password reset flow.
  // For now, it just displays a placeholder message.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="mb-4">Enter your email address and we will send you a password reset link.</p>
      <form className="flex flex-col gap-2 w-80">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="px-2 py-1 rounded-md text-white font-bold bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
