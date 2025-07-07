This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# life-command-rebuild

## Dependency Injection for Testable Components

This monorepo uses a dependency injection (DI) pattern for components that interact with Supabase or server actions, such as the `TaskList` component. Instead of importing Supabase clients or server actions directly inside components, all such dependencies are passed as props from the parent. This enables robust, isolated unit and integration testing with Jest, and avoids issues with ESM-only libraries and SSR/server actions in Next.js.

### Why?
- **Testability:** Allows components to be tested in isolation by passing mocks for Supabase clients and server actions, without requiring Jest to parse ESM-only code.
- **SSR Compatibility:** Prevents runtime errors and import issues when running tests or server-side code.
- **Consistency:** Ensures all data-fetching and mutation logic can be mocked or replaced in tests, making the codebase more maintainable.

### How to Use
- When creating a component that needs to interact with Supabase or server actions, accept those dependencies as props.
- In the parent (e.g., `app/page.tsx`), create the Supabase client and import server actions, then pass them as props to the child component.
- In tests, provide simple mocks for these dependencies.
- Manual Jest mocks for Supabase clients are located in `apps/web/lib/supabase/__mocks__`.

### Example
```tsx
// In app/page.tsx
<TaskList supabaseClient={supabase} createTaskAction={createTask} updateTaskStatusAction={updateTaskStatus} />

// In tests
render(<TaskList supabaseClient={mockClient} createTaskAction={mockCreate} updateTaskStatusAction={mockUpdate} />)
```

This pattern is required for robust testing and should be followed for all components that interact with Supabase or server actions.
