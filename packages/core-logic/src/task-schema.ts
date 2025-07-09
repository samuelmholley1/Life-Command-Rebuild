import { z } from 'zod';

// Priority levels: 0=None, 1=Low, 2=Medium, 3=High, 4=Critical
export const PriorityLevel = {
  0: 'None',
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Critical',
} as const;

export const SetPrioritySchema = z.object({
  id: z.string().uuid(),
  priority: z.number().int().min(0).max(4),
});

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean(),
  due_date: z.string().datetime().nullable().optional(),
  priority: z.number().int().min(0).max(4).default(0).optional(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
});

export const UpdateTaskSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean(),
});

export const UpdateTaskCompletionSchema = z.object({
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

export const SetDueDateSchema = z.object({
  id: z.string().uuid(),
  due_date: z.string().nullable().refine((val) => {
    if (val === null) return true;
    // Accept both date (YYYY-MM-DD) and datetime formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    return dateRegex.test(val) || datetimeRegex.test(val);
  }, 'Must be a valid date (YYYY-MM-DD) or datetime format'),
});

export type Task = z.infer<typeof TaskSchema>;
