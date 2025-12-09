import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { initializeDatabase } from "./database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize database tables on startup
initializeDatabase().catch(err => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
