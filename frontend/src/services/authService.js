import CryptoJS from "crypto-js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Encryption key (in production, this should be more secure)
const ENCRYPTION_KEY = "task-manager-secret-key-2024";

class AuthService {
  /**
   * Encrypt password using AES encryption
   * @param {string} password - Plain text password
   * @returns {string} Encrypted password
   */
  static encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  }

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password (will be encrypted)
   * @returns {Promise<Object>} User token and data
   */
  static async login(email, password) {
    const encryptedPassword = this.encryptPassword(password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: encryptedPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  }

  /**
   * Create a new user account
   * @param {string} username - Username
   * @param {string} email - User email
   * @param {string} password - User password (will be encrypted)
   * @returns {Promise<Object>} Created user data
   */
  static async signup(username, email, password) {
    const encryptedPassword = this.encryptPassword(password);

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password: encryptedPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    return await response.json();
  }

  /**
   * Logout user
   */
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Check if user is logged in
   * @returns {boolean}
   */
  static isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null}
   */
  static getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get auth token
   * @returns {string|null}
   */
  static getToken() {
    return localStorage.getItem("token");
  }
}

export { AuthService };
