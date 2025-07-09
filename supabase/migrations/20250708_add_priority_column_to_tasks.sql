-- Add priority column to tasks table
ALTER TABLE tasks
ADD COLUMN priority integer DEFAULT 0;

COMMENT ON COLUMN tasks.priority IS 'Priority level for the task (0=None, 1=Low, 2=Medium, 3=High, 4=Critical)';
