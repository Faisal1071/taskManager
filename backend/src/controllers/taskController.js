import * as taskService from "../services/taskService.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await taskService.createTask(title, description);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id);
    if (!task) return res.status(404).json({ error: "Task nicht gefunden" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await taskService.updateTask(
      req.params.id,
      title,
      description
    );

    if (!task) return res.status(404).json({ error: "Task nicht gefunden" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
