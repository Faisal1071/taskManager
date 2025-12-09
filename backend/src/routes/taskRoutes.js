import express from "express";
import {
  getTasks,
  getUserTasks,
  addTask,
  removeTask,
  editTask,
} from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTasks);

/**
 * Get all tasks for the authenticated user
 * Requires: Authorization header with Bearer token
 */
router.get("/user/tasks", authenticateToken, getUserTasks);

/**
 * Create new task (requires authentication)
 */
router.post("/", authenticateToken, addTask);

/**
 * Update task (requires authentication)
 */
router.put("/:id", authenticateToken, editTask);

/**
 * Delete task (requires authentication)
 */
router.delete("/:id", authenticateToken, removeTask);

export default router;
