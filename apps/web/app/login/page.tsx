import { login, signup } from './actions';
import React from 'react';

export type LoginPageProps = { searchParams?: Record<string, string | string[]> };

const LoginPage: React.FC<LoginPageProps> = ({ searchParams }) => {
  const message = typeof searchParams?.message === 'string' ? searchParams.message : Array.isArray(searchParams?.message) ? searchParams.message[0] : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form action={login} method="POST" className="flex flex-col gap-2 w-80">
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
      {/* We now safely read the message from the prop */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
