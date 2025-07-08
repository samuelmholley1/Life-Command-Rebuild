import { login, signup } from './actions';
import React from 'react';

// Next.js 15+ async dynamic API pattern for searchParams
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string | string[] }>
}) {
  // Await the promise before reading .message
  const { message } = await searchParams;
  let displayMessage: string | undefined;
  if (typeof message === 'string') {
    displayMessage = message;
  } else if (Array.isArray(message)) {
    displayMessage = message[0];
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
        <button type="submit" className="px-2 py-1 rounded-md text-white font-bold bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150">Sign In</button>
        <button formAction={signup} className="px-2 py-1 rounded-md text-white font-bold bg-green-600 hover:bg-green-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150">Sign Up</button>
      </form>
      {displayMessage && <p className="text-red-500 mb-4">{displayMessage}</p>}
    </div>
  );
}
