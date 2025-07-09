-- Add due_date column to tasks table
-- This migration adds a nullable timestampz column for storing task due dates

ALTER TABLE tasks 
ADD COLUMN due_date timestamptz;

-- Add a comment to document the column
COMMENT ON COLUMN tasks.due_date IS 'Optional due date for the task';
