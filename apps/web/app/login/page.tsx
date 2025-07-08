import { login, signup } from './actions';
import React from 'react';

export type LoginPageProps = { searchParams?: Record<string, string | string[]> };

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  // Ensure searchParams is treated as a plain object or Record for safe access
  const params = searchParams as Record<string, string | string[] | undefined>;
  let message: string | undefined;

  // Now, safely access properties without triggering the warning
  if (params && params.message !== undefined) {
    if (typeof params.message === 'string') {
      message = params.message;
    } else if (Array.isArray(params.message) && params.message.length > 0) {
      message = params.message[0];
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form action={login} className="flex flex-col gap-2 w-80">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2">Sign In</button>
        <button formAction={signup} className="bg-green-600 text-white rounded px-3 py-2">Sign Up</button>
      </form>
      {message && <p className="text-red-500 mb-4">{message}</p>}
    </div>
  );
};

export default LoginPage;
