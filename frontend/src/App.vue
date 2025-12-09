<template>
  <div id="app">
    <div v-if="isLoggedIn" class="app-with-logout">
      <button class="logout-button" @click="handleLogout">Logout</button>
      <TaskList />
    </div>
    <Login v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TaskList from "./components/TaskList.vue";
import Login from "./components/Login.vue";
import { AuthService } from "./services/authService.js";

const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = AuthService.isLoggedIn();
  
  // Listen for login success event
  window.addEventListener("login-success", () => {
    isLoggedIn.value = true;
  });
});

const handleLogout = () => {
  AuthService.logout();
  isLoggedIn.value = false;
};
</script>

<style scoped>
.app-with-logout {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.logout-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff4444;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s;
  z-index: 100;
}

.logout-button:hover {
  background: #cc0000;
}
</style>
