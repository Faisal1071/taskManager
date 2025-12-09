-- Migration script: Add authentication to existing Task Manager database
-- This script adds user management and links tasks to users

-- Step 1: Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Add user_id column to tasks table if it doesn't exist
-- Note: If tasks already exist, you'll need to create a default user or handle existing data

-- First, check if user_id column exists, if not add it with a temporary nullable constraint
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- Step 3: Create a default user for existing tasks (optional - adjust email/username as needed)
-- Uncomment and modify if you want to assign existing tasks to a specific user
-- INSERT INTO users (username, email, password) 
-- VALUES ('admin', 'admin@taskmanager.com', '$2a$10$...')
-- ON CONFLICT (email) DO NOTHING;

-- Step 4: Assign existing tasks to a user (if there's existing data)
-- Replace 1 with the actual user_id of the user you created above
-- This is needed if you have existing tasks without user_id
-- UPDATE tasks SET user_id = 1 WHERE user_id IS NULL;

-- Step 5: Add NOT NULL constraint to user_id after data is assigned
-- Uncomment this after you've assigned all existing tasks to users
-- ALTER TABLE tasks
-- ALTER COLUMN user_id SET NOT NULL;

-- Step 6: Add foreign key constraint
ALTER TABLE tasks
ADD CONSTRAINT IF NOT EXISTS fk_tasks_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 7: Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Done! The database is now updated to support user authentication.
-- Note: Make sure to handle any existing task data by assigning them to users.
