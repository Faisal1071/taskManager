import { AuthService } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API = `${API_URL}/tasks`;

/**
 * Get the Authorization header with JWT token
 */
const getAuthHeader = () => {
  const token = AuthService.getToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

export async function getTasks() {
  try {
    const res = await fetch(`${API}/user/tasks`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function createTask(task) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function updateTask(id, task) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function deleteTask(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      throw new Error(`Failed to delete task: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
