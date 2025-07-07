import { login, signup } from './actions';

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      {searchParams?.error && (
        <div className="mb-4 text-red-600">{decodeURIComponent(searchParams.error)}</div>
      )}
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
      </form>
      <form action={signup} method="POST" className="flex flex-col gap-2 w-80 mt-6">
        <h2 className="text-lg font-semibold">Or Sign Up</h2>
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
        <button type="submit" className="bg-green-600 text-white rounded px-3 py-2">Sign Up</button>
      </form>
    </div>
  );
}
