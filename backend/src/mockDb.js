/**
 * Mock database for testing without PostgreSQL
 * Stores data in memory
 */

let users = [];
let tasks = [];
let nextUserId = 1;
let nextTaskId = 1;

export const mockDb = {
  // Users operations
  async findUserByEmail(email) {
    return users.find(u => u.email === email);
  },

  async findUserByUsername(username) {
    return users.find(u => u.username === username);
  },

  async createUser(username, email, password) {
    const user = {
      id: nextUserId++,
      username,
      email,
      password,
      created_at: new Date(),
    };
    users.push(user);
    return user;
  },

  // Tasks operations
  async getUserTasks(userId) {
    return tasks.filter(t => t.user_id === userId).sort((a, b) => b.created_at - a.created_at);
  },

  async createTask(title, description, userId) {
    const task = {
      id: nextTaskId++,
      user_id: userId,
      title,
      description,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };
    tasks.push(task);
    return task;
  },

  async updateTask(id, userId, title, description) {
    const task = tasks.find(t => t.id === id && t.user_id === userId);
    if (!task) return null;
    
    task.title = title;
    task.description = description;
    task.updated_at = new Date();
    return task;
  },

  async deleteTask(id, userId) {
    const index = tasks.findIndex(t => t.id === id && t.user_id === userId);
    if (index === -1) return null;
    
    const task = tasks[index];
    tasks.splice(index, 1);
    return task;
  },

  // For testing/reset
  reset() {
    users = [];
    tasks = [];
    nextUserId = 1;
    nextTaskId = 1;
  },

  getState() {
    return { users, tasks };
  },
};
