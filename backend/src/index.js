import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/tasks", taskRoutes);

app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
