import * as taskService from "../services/taskService.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all tasks for the authenticated user
 */
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await taskService.getUserTasks(userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.userId;
    const task = await taskService.createTask(title, description, deadline, userId);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const task = await taskService.deleteTask(req.params.id, userId);
    if (!task) return res.status(404).json({ error: "Task nicht gefunden" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.userId;

    const task = await taskService.updateTask(
      req.params.id,
      title,
      description,
      deadline,
      userId
    );

    if (!task) return res.status(404).json({ error: "Task nicht gefunden" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
