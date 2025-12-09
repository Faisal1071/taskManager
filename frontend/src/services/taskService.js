const API = "http://localhost:3000/tasks";

export async function getTasks() {
  const res = await fetch(API);
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  return res.json();
}
