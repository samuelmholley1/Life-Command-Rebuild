import { z } from 'zod';

export const UpdateTaskTitleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
});
