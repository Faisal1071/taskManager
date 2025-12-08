import express from "express";
import {
  getTasks,
  addTask,
  removeTask,
  editTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", addTask);
router.delete("/:id", removeTask);
router.put("/:id", editTask);

export default router;
