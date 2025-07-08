import { login, signup } from './actions';
import React from 'react';

export type LoginPageProps = { searchParams?: Record<string, string | string[]> };

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  let message: string | undefined;

  // Explicitly check for existence and then type
  if (searchParams && 'message' in searchParams) {
    if (typeof searchParams.message === 'string') {
      message = searchParams.message;
    } else if (Array.isArray(searchParams.message) && searchParams.message.length > 0) {
      message = searchParams.message[0];
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
