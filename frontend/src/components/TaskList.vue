<template>
  <div class="retro-container">
    <h1 class="retro-title">💾 Task Manager</h1>

    <div class="form retro-form">
      <input v-model="title" placeholder="Titel" class="retro-input" />
      <input
        v-model="description"
        placeholder="Beschreibung"
        class="retro-input"
      />
      <button @click="addTask" class="retro-button">Hinzufügen</button>
    </div>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <!-- Edit-Modus -->
        <div v-if="editingId === task.id" class="retro-edit">
          <input v-model="editingTitle" class="retro-input" />
          <input v-model="editingDescription" class="retro-input" />
          <button @click="saveEdit" class="retro-button">Speichern</button>
          <button @click="cancelEdit" class="retro-button">Abbrechen</button>
        </div>

        <div v-else class="task-display">
          <span :class="{ done: task.completed }"
            >{{ task.title }} – {{ task.description }}</span
          >
          <button @click="startEdit(task)" class="retro-button">
            Bearbeiten
          </button>
          <button @click="deleteTask(task.id)" class="retro-button">
            Löschen
          </button>
          <button @click="completeTask(task)" class="retro-button complete">
            Abhaken ✅
          </button>
        </div>
      </li>
    </ul>

    <div v-if="motivationMessage" class="motivation retro-motivation">
      🎉 {{ motivationMessage }}
    </div>

    <div class="points retro-points">Punkte: {{ points }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const tasks = ref([]);
const title = ref("");
const description = ref("");

const editingId = ref(null);
const editingTitle = ref("");
const editingDescription = ref("");

const motivationMessage = ref("");
const points = ref(parseInt(localStorage.getItem("points") || "0"));

watch(points, (newVal) => localStorage.setItem("points", newVal));

async function loadTasks() {
  const res = await fetch("http://localhost:3000/tasks");
  tasks.value = await res.json();
}

async function addTask() {
  if (!title.value) return;
  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
    }),
  });
  title.value = "";
  description.value = "";
  await loadTasks();
}

async function deleteTask(id) {
  await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
  await loadTasks();
}

function startEdit(task) {
  editingId.value = task.id;
  editingTitle.value = task.title;
  editingDescription.value = task.description;
}
function cancelEdit() {
  editingId.value = null;
  editingTitle.value = "";
  editingDescription.value = "";
}
async function saveEdit() {
  await fetch(`http://localhost:3000/tasks/${editingId.value}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: editingTitle.value,
      description: editingDescription.value,
    }),
  });
  cancelEdit();
  await loadTasks();
}

async function completeTask(task) {
  await fetch(`http://localhost:3000/tasks/${task.id}`, { method: "DELETE" });
  const messages = [
    "Du bist ein Held! 🦸‍♂️",
    "Mission erfüllt! ✅",
    "Level up! 🎮",
    "Task besiegt! ⚔️",
  ];
  motivationMessage.value =
    messages[Math.floor(Math.random() * messages.length)];
  points.value += 10;
  showConfetti();
  tasks.value = tasks.value.filter((t) => t.id !== task.id);
  setTimeout(() => (motivationMessage.value = ""), 3000);
}

function showConfetti() {
  console.log("🎉 Confetti!");
}

onMounted(loadTasks);
</script>

<style scoped>
.retro-container {
  font-family: "Courier New", monospace;
  background: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.retro-title {
  text-align: center;
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 2rem;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.retro-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 700px;
}
.retro-input {
  background: #2a2a2a;
  border: 1px solid #404040;
  color: #e0e0e0;
  padding: 0.75rem;
  font-family: "Courier New", monospace;
  font-size: 0.95rem;
  flex: 1 1 200px;
  min-width: 150px;
  border-radius: 4px;
  transition: border-color 0.2s;
}
.retro-input:focus {
  outline: none;
  border-color: #0088ff;
}
.retro-button {
  background: #0088ff;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-family: "Courier New", monospace;
  font-size: 0.95rem;
  cursor: pointer;
  transition: 0.2s;
  flex-shrink: 0;
  border-radius: 4px;
  font-weight: 500;
}
.retro-button:hover {
  background: #0066cc;
}

.task-list {
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 700px;
}
.task-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #333;
  background: #252525;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}
.task-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}
.task-display > span {
  flex: 1 1 200px;
  min-width: 150px;
  line-height: 1.5;
}
.done {
  text-decoration: line-through;
  color: #666;
}

.retro-edit {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.retro-motivation {
  font-size: 1.1rem;
  color: #4caf50;
  margin-top: 1.5rem;
  text-align: center;
  font-weight: 500;
}
.retro-points {
  margin-top: 1rem;
  font-weight: 600;
  color: #0088ff;
  font-size: 1.1rem;
}

.complete {
  background: #4caf50;
  color: #ffffff;
}
.complete:hover {
  background: #45a049;
}

@media (max-width: 768px) {
  .retro-title {
    font-size: 1.4rem;
  }
  .retro-input,
  .retro-button {
    flex: 1 1 100%;
    font-size: 0.9rem;
  }
  .task-display {
    flex-direction: column;
    align-items: stretch;
  }
  .task-display > span {
    flex: 1 1 auto;
    margin-bottom: 0.5rem;
  }
  .retro-button {
    width: 100%;
  }
  .retro-container {
    padding: 1rem;
  }
}
</style>
