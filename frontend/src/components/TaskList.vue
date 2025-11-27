<template>
  <div>
    <h1>Task Liste</h1>

    <div class="form">
      <input v-model="title" placeholder="Titel" />
      <input v-model="description" placeholder="Beschreibung" />
      <button @click="addTask">Hinzufügen</button>
    </div>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} – {{ task.description }}
        <button @click="deleteTask(task.id)">Löschen</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const tasks = ref([]);
const title = ref("");
const description = ref("");

async function loadTasks() {
  try {
    const res = await fetch("http://localhost:3000/tasks");
    if (!res.ok) throw new Error("Fehler beim Laden der Tasks");
    tasks.value = await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function addTask() {
  if (!title.value) return;
  try {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
      }),
    });
    if (!res.ok) throw new Error("Fehler beim Hinzufügen");
    await loadTasks();
    title.value = "";
    description.value = "";
  } catch (err) {
    console.error(err);
  }
}

async function deleteTask(id) {
  try {
    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Fehler beim Löschen");
    await loadTasks();
  } catch (err) {
    console.error(err);
  }
}

onMounted(loadTasks);
</script>

<style scoped>
.form {
  margin-bottom: 1rem;
}

input {
  margin-right: 0.5rem;
}

button {
  margin-left: 0.5rem;
}
</style>
