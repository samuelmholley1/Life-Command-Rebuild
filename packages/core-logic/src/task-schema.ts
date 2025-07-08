import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean(),
});

export const UpdateTaskSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean(),
});

export const UpdateTaskTitleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
});

export const DeleteTaskSchema = z.object({
  id: z.string().uuid(),
});

export type Task = z.infer<typeof TaskSchema>;
