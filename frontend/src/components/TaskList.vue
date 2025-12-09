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

      <div class="timer-inputs">
        <input
          v-model.number="timerDays"
          type="number"
          min="0"
          placeholder="Tage"
          class="retro-input timer-input"
        />
        <input
          v-model.number="timerHours"
          type="number"
          min="0"
          max="23"
          placeholder="Stunden"
          class="retro-input timer-input"
        />
        <input
          v-model.number="timerMinutes"
          type="number"
          min="0"
          max="59"
          placeholder="Minuten"
          class="retro-input timer-input"
        />
      </div>

      <button @click="addTask" class="retro-button">Hinzufügen</button>
    </div>

    <ul class="task-list">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
        :class="getTaskClass(task)"
      >
        <div v-if="editingId === task.id" class="retro-edit">
          <input v-model="editingTitle" class="retro-input" />
          <input v-model="editingDescription" class="retro-input" />

          <div class="timer-inputs">
            <input
              v-model.number="editingTimerDays"
              type="number"
              min="0"
              placeholder="Tage"
              class="retro-input timer-input"
            />
            <input
              v-model.number="editingTimerHours"
              type="number"
              min="0"
              max="23"
              placeholder="Stunden"
              class="retro-input timer-input"
            />
            <input
              v-model.number="editingTimerMinutes"
              type="number"
              min="0"
              max="59"
              placeholder="Minuten"
              class="retro-input timer-input"
            />
          </div>

          <button @click="saveEdit" class="retro-button">Speichern</button>
          <button @click="cancelEdit" class="retro-button">Abbrechen</button>
        </div>

        <div v-else class="task-display">
          <div class="task-content">
            <span :class="{ done: task.completed }">
              {{ task.title }} – {{ task.description }}
            </span>
            <div v-if="task.deadline" class="timer-display">
              ⏱️ {{ formatTimeRemaining(task) }}
            </div>
          </div>
          <div class="task-actions">
            <button @click="startEdit(task)" class="retro-button">
              Bearbeiten
            </button>
            <button @click="deleteTaskHandler(task.id)" class="retro-button">
              Löschen
            </button>
            <button @click="completeTask(task)" class="retro-button complete">
              Abhaken ✅
            </button>
          </div>
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
import { ref, onMounted, watch, onUnmounted } from "vue";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "/src/services/taskService.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/de";

import "/src/components/Taskmanager.css";

dayjs.extend(duration);
dayjs.locale("de");

const tasks = ref([]);
const title = ref("");
const description = ref("");
const timerDays = ref(0);
const timerHours = ref(0);
const timerMinutes = ref(0);

const editingId = ref(null);
const editingTitle = ref("");
const editingDescription = ref("");
const editingTimerDays = ref(0);
const editingTimerHours = ref(0);
const editingTimerMinutes = ref(0);

const motivationMessage = ref("");
const points = ref(parseInt(localStorage.getItem("points") || "0"));

let timerInterval = null;

watch(points, (newVal) => localStorage.setItem("points", newVal));

async function loadTasks() {
  try {
    tasks.value = await getTasks();
  } catch (error) {
    console.error("Failed to load tasks:", error);
    tasks.value = [];
  }
}

function calculateDeadline(days, hours, minutes) {
  return dayjs()
    .add(days, "day")
    .add(hours, "hour")
    .add(minutes, "minute")
    .toISOString();
}

async function addTask() {
  if (!title.value) return;

  try {
    const taskData = {
      title: title.value,
      description: description.value,
    };

    if (timerDays.value || timerHours.value || timerMinutes.value) {
      taskData.deadline = calculateDeadline(
        timerDays.value || 0,
        timerHours.value || 0,
        timerMinutes.value || 0
      );
    }

    await createTask(taskData);

    title.value = "";
    description.value = "";
    timerDays.value = 0;
    timerHours.value = 0;
    timerMinutes.value = 0;

    await loadTasks();
  } catch (error) {
    console.error("Failed to add task:", error);
    alert("Failed to add task: " + error.message);
  }
}

async function deleteTaskHandler(id) {
  try {
    await deleteTask(id);
    await loadTasks();
  } catch (error) {
    console.error("Failed to delete task:", error);
    alert("Failed to delete task: " + error.message);
  }
}

function startEdit(task) {
  editingId.value = task.id;
  editingTitle.value = task.title;
  editingDescription.value = task.description;

  if (task.deadline) {
    const deadline = dayjs(task.deadline);
    const diff = deadline.diff(dayjs(), "minute");

    editingTimerDays.value = Math.floor(diff / (24 * 60));
    editingTimerHours.value = Math.floor((diff % (24 * 60)) / 60);
    editingTimerMinutes.value = diff % 60;
  } else {
    editingTimerDays.value = 0;
    editingTimerHours.value = 0;
    editingTimerMinutes.value = 0;
  }
}

function cancelEdit() {
  editingId.value = null;
  editingTitle.value = "";
  editingDescription.value = "";
  editingTimerDays.value = 0;
  editingTimerHours.value = 0;
  editingTimerMinutes.value = 0;
}

async function saveEdit() {
  try {
    const taskData = {
      title: editingTitle.value,
      description: editingDescription.value,
    };

    if (
      editingTimerDays.value ||
      editingTimerHours.value ||
      editingTimerMinutes.value
    ) {
      taskData.deadline = calculateDeadline(
        editingTimerDays.value || 0,
        editingTimerHours.value || 0,
        editingTimerMinutes.value || 0
      );
    }

    await updateTask(editingId.value, taskData);
    cancelEdit();
    await loadTasks();
  } catch (error) {
    console.error("Failed to save task:", error);
    alert("Failed to save task: " + error.message);
  }
}

async function completeTask(task) {
  try {
    await deleteTask(task.id);

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
  } catch (error) {
    console.error("Failed to complete task:", error);
    alert("Failed to complete task: " + error.message);
  }
}

function getTaskClass(task) {
  if (!task.deadline) return "";

  const hoursRemaining = dayjs(task.deadline).diff(dayjs(), "hour", true);

  if (hoursRemaining < 0) return "task-overdue";
  if (hoursRemaining < 24) return "task-urgent";
  return "task-safe";
}

function formatTimeRemaining(task) {
  if (!task.deadline) return "";

  const deadline = dayjs(task.deadline);
  const now = dayjs();

  if (deadline.isBefore(now)) return "Überfällig!";

  const diff = dayjs.duration(deadline.diff(now));
  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();

  if (days > 0) return `${days}T ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function showConfetti() {
  console.log("🎉 Confetti!");
}

onMounted(() => {
  loadTasks();

  timerInterval = setInterval(() => {
    tasks.value = [...tasks.value];
  }, 60000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>
