import { pool } from "../db.js";

export const getAllTasks = async () => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
  return result.rows;
};

export const createTask = async (title, description) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
    [title, description]
  );
  return result.rows[0];
};

export const deleteTask = async (id) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const updateTask = async (id, title, description) => {
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *",
    [title, description, id]
  );
  return result.rows[0];
};
