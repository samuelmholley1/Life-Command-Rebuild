"use client";

import React from 'react';
import { resetPasswordAction } from './actions';
import { useFormState } from 'react-dom';

const initialState = { message: '', status: '' };

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(
    async (
      prevState: { message: string; status: string },
      formData: FormData
    ) => {
      const result = await resetPasswordAction(formData);
      if (result?.error) {
        return { message: result.error, status: 'error' };
      } else if (result?.success) {
        return { message: 'If your email is registered, a reset link has been sent.', status: 'success' };
      }
      return { message: '', status: '' };
    },
    initialState
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="mb-4">Enter your email address and we will send you a password reset link.</p>
      <form action={formAction} className="flex flex-col gap-2 w-80">
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
      {state.message && (
        <p className={state.status === 'error' ? 'text-red-500 mt-4' : 'text-green-600 mt-4'}>{state.message}</p>
      )}
    </div>
  );
}
