import { TaskSchema } from './task-schema';

describe('TaskSchema', () => {
  it('validates a correct payload', () => {
    const valid = {
      id: 'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      title: 'Test Task',
      completed: false,
      user_id: 'user-123',
      inserted_at: new Date().toISOString(),
    };
    expect(() => TaskSchema.parse(valid)).not.toThrow();
  });

  it('fails validation for missing title', () => {
    const invalid = {
      id: 'b3b1c2d3-4e5f-6789-0123-456789abcdef',
      completed: false,
      user_id: 'user-123',
      inserted_at: new Date().toISOString(),
    };
    expect(() => TaskSchema.parse(invalid)).toThrow();
  });
});
