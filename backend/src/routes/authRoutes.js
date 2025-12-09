import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

/**
 * POST /auth/signup
 * Create a new user account
 */
router.post("/signup", signup);

/**
 * POST /auth/login
 * Login user and return JWT token
 */
router.post("/login", login);

export default router;
