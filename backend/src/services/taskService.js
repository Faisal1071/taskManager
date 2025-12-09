import { getDb } from "../database.js";

const getDatabase = () => getDb();

export const getAllTasks = async () => {
  const db = getDatabase();
  return await db.getUserTasks(1); // Mock returns user 1's tasks
};

/**
 * Get all tasks for a specific user
 */
export const getUserTasks = async (userId) => {
  const db = getDatabase();
  return await db.getUserTasks(userId);
};

export const createTask = async (title, description, deadline, userId) => {
  const db = getDatabase();
  return await db.createTask(title, description, userId);
};

export const deleteTask = async (id, userId) => {
  const db = getDatabase();
  return await db.deleteTask(id, userId);
};

export const updateTask = async (id, title, description, deadline, userId) => {
  const db = getDatabase();
  return await db.updateTask(id, userId, title, description);
};
