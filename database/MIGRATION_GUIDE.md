# Database Migration Guide

## Overview
This guide helps you migrate your existing Task Manager database from the old schema (without user authentication) to the new schema (with user authentication).

## Schema Changes

### Before (Old Schema)
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### After (New Schema)
```sql
-- New users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Updated tasks table with user_id
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## Migration Steps

### Option 1: Fresh Database (Recommended)
If you don't have any existing data or want to start fresh:

1. Drop the old database:
```bash
psql -U devuser -d tasksdb -c "DROP TABLE IF EXISTS tasks;"
```

2. Run the backend - it will automatically create the new schema:
```bash
npm run dev
```

### Option 2: Migrate Existing Data

If you have existing tasks that you want to keep:

#### Step 1: Create users table and update tasks
```sql
-- Run the migration script
psql -U devuser -d tasksdb -f database/migration_add_auth.sql
```

#### Step 2: Create a default admin user (or create users as needed)
```sql
-- Example: Create an admin user
-- Password should be bcrypt-hashed (e.g., using bcryptjs)
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@taskmanager.com', '$2a$10$YOUR_BCRYPT_HASH_HERE')
ON CONFLICT (email) DO NOTHING;
```

#### Step 3: Assign existing tasks to the user
```sql
-- Replace '1' with the actual user_id
UPDATE tasks SET user_id = 1 WHERE user_id IS NULL;
```

#### Step 4: Add NOT NULL constraint
```sql
ALTER TABLE tasks
ALTER COLUMN user_id SET NOT NULL;
```

## Quick Migration Commands

### Using psql directly:

```bash
# Connect to your database
psql -U devuser -d tasksdb

# Then run these commands:
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- Optional: Create admin user (modify as needed)
-- INSERT INTO users (username, email, password) VALUES ('admin', 'admin@example.com', 'hashed_password');

-- Optional: Assign existing tasks to a user
-- UPDATE tasks SET user_id = 1 WHERE user_id IS NULL;

ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
```

## Testing the Migration

After migration, verify the schema:

```sql
-- Check users table
\d users

-- Check updated tasks table
\d tasks

-- Verify foreign key
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'tasks' AND constraint_type = 'FOREIGN KEY';

-- Verify index
\di idx_tasks_user_id
```

## Troubleshooting

### Error: "Cannot add foreign key constraint"
- Make sure all tasks have a valid user_id
- Make sure the user_id column is created first
- Check that the referenced user exists

### Error: "Duplicate key value violates unique constraint"
- Check for duplicate usernames or emails in the users table
- Use `CONFLICT` clause in INSERT statements

### Error: "Column already exists"
- This is normal and expected - the migration script uses `IF NOT EXISTS`
- You can safely run the migration multiple times

## Rollback (if needed)

If you need to rollback to the old schema:

```sql
-- WARNING: This will delete all user data
ALTER TABLE tasks DROP CONSTRAINT fk_tasks_user_id;
DROP TABLE IF EXISTS users;
ALTER TABLE tasks DROP COLUMN IF NOT EXISTS user_id;
```

## Environment Variables

Make sure your `.env` file has:
```
PORT=3000
DB_USER=devuser
DB_HOST=localhost
DB_DATABASE=tasksdb
DB_PASSWORD=devpass
DB_PORT=5432
```

## Next Steps

1. Run the migration
2. Start the backend: `npm run dev`
3. Create user accounts via the frontend login page
4. Existing tasks will work once assigned to a user
