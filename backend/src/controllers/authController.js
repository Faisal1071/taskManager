import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { pool } from "../db.js";
import { getDb, isUsingRealDb } from "../database.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ENCRYPTION_KEY = "task-manager-secret-key-2024";

/**
 * Decrypt password sent from frontend
 */
const decryptPassword = (encryptedPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error("Failed to decrypt password");
  }
};

/**
 * Generate JWT token
 */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Sign up a new user
 */
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Decrypt password from frontend
    const decryptedPassword = decryptPassword(password);

    const db = getDb();

    // Check if user already exists
    const existingUserByEmail = await db.findUserByEmail(email);
    const existingUserByUsername = await db.findUserByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

    // Create user
    const user = await db.createUser(username, email, hashedPassword);
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Decrypt password from frontend
    const decryptedPassword = decryptPassword(password);

    const db = getDb();

    // Find user
    const user = await db.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(decryptedPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
