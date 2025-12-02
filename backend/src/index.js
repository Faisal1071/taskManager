import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task nicht gefunden" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task nicht gefunden" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
