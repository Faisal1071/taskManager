import { pool } from "./db.js";
import { mockDb } from "./mockDb.js";

let useRealDatabase = true;

/**
 * Initialize database tables
 * Creates users and tasks tables if they don't exist
 * Falls back to mock database if real DB is unavailable
 */
export const initializeDatabase = async () => {
  try {
    // Test connection to real database
    await pool.query("SELECT NOW()");
    useRealDatabase = true;
    console.log("✓ Connected to PostgreSQL database");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create tasks table with userid
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on user_id for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    `);

    console.log("✓ Database tables initialized successfully");
  } catch (error) {
    console.warn("⚠ PostgreSQL not available, using mock database");
    console.warn(`  Error: ${error.message}`);
    useRealDatabase = false;
  }
};

/**
 * Create a database abstraction wrapper
 * Automatically handles both real DB (pool) and mock DB
 */
class DatabaseAbstraction {
  async query(sql, params) {
    if (useRealDatabase) {
      return pool.query(sql, params);
    }
    throw new Error("Direct query not supported in mock mode");
  }

  async findUserByEmail(email) {
    return mockDb.findUserByEmail(email);
  }

  async findUserByUsername(username) {
    return mockDb.findUserByUsername(username);
  }

  async createUser(username, email, password) {
    return mockDb.createUser(username, email, password);
  }

  async getUserTasks(userId) {
    return mockDb.getUserTasks(userId);
  }

  async createTask(title, description, userId) {
    return mockDb.createTask(title, description, userId);
  }

  async updateTask(id, userId, title, description) {
    return mockDb.updateTask(id, userId, title, description);
  }

  async deleteTask(id, userId) {
    return mockDb.deleteTask(id, userId);
  }
}

const dbAbstraction = new DatabaseAbstraction();

/**
 * Get database abstraction layer
 */
export const getDb = () => {
  return dbAbstraction;
};

/**
 * Check if using real database
 */
export const isUsingRealDb = () => {
  return useRealDatabase;
};
