<template>
  <div class="login-modal">
    <h1 class="modal-title">Task Manager</h1>
    
    <div class="auth-tabs">
      <button 
        :class="['tab-button', { active: isLogin }]"
        @click="isLogin = true"
      >
        Login
      </button>
      <button 
        :class="['tab-button', { active: !isLogin }]"
        @click="isLogin = false"
      >
        Create Account
      </button>
    </div>

    <!-- Login Form -->
    <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
      <h2 class="form-title">Welcome Back</h2>
      
      <div class="form-group">
        <input 
          v-model="loginForm.email"
          type="email"
          placeholder="Email"
          class="retro-input"
          required
        />
      </div>
      
      <div class="form-group">
        <input 
          v-model="loginForm.password"
          type="password"
          placeholder="Password"
          class="retro-input"
          required
        />
      </div>

      <button type="submit" class="retro-button login-button" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </form>

    <!-- Create Account Form -->
    <form v-else @submit.prevent="handleCreateUser" class="auth-form">
      <h2 class="form-title">Create Account</h2>
      
      <div class="form-group">
        <input 
          v-model="signupForm.username"
          type="text"
          placeholder="Username"
          class="retro-input"
          required
        />
      </div>
      
      <div class="form-group">
        <input 
          v-model="signupForm.email"
          type="email"
          placeholder="Email"
          class="retro-input"
          required
        />
      </div>
      
      <div class="form-group">
        <input 
          v-model="signupForm.password"
          type="password"
          placeholder="Password"
          class="retro-input"
          required
        />
      </div>

      <div class="form-group">
        <input 
          v-model="signupForm.confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="retro-input"
          required
        />
      </div>

      <button type="submit" class="retro-button signup-button" :disabled="loading">
        {{ loading ? "Creating Account..." : "Create Account" }}
      </button>

      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { AuthService } from "../services/authService.js";

const isLogin = ref(true);
const loading = ref(false);
const error = ref("");
const successMessage = ref("");

const loginForm = ref({
  email: "",
  password: "",
});

const signupForm = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleLogin = async () => {
  error.value = "";
  successMessage.value = "";

  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = "Please fill in all fields";
    return;
  }

  loading.value = true;
  try {
    const response = await AuthService.login(
      loginForm.value.email,
      loginForm.value.password
    );
    successMessage.value = "Login successful!";
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    
    // Emit event to parent or redirect
    window.dispatchEvent(new Event("login-success"));
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (err) {
    error.value = err.message || "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
};

const handleCreateUser = async () => {
  error.value = "";
  successMessage.value = "";

  if (
    !signupForm.value.username ||
    !signupForm.value.email ||
    !signupForm.value.password ||
    !signupForm.value.confirmPassword
  ) {
    error.value = "Please fill in all fields";
    return;
  }

  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  if (signupForm.value.password.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }

  loading.value = true;
  try {
    await AuthService.signup(
      signupForm.value.username,
      signupForm.value.email,
      signupForm.value.password
    );
    successMessage.value = "Account created successfully! You can now login.";
    
    setTimeout(() => {
      isLogin.value = true;
      signupForm.value = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    }, 1500);
  } catch (err) {
    error.value = err.message || "Failed to create account. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #1a1a1a;
  padding: 1rem;
  font-family: "Courier New", monospace;
}

.login-modal {
  background: #252525;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-title {
  text-align: center;
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.auth-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tab-button {
  flex: 1;
  background: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #404040;
  padding: 0.6rem;
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  font-weight: 500;
}

.tab-button:hover {
  border-color: #0088ff;
  color: #0088ff;
}

.tab-button.active {
  background: #0088ff;
  color: #ffffff;
  border-color: #0088ff;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-title {
  text-align: center;
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.form-group {
  display: block;
}

.retro-input {
  background: #2a2a2a;
  border: 1px solid #404040;
  color: #e0e0e0;
  padding: 0.35rem 0.4rem;
  font-family: "Courier New", monospace;
  font-size: 0.8rem;
  border-radius: 4px;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.retro-input:focus {
  outline: none;
  border-color: #0088ff;
}

.login-button,
.signup-button {
  background: #0088ff;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1rem;
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled),
.signup-button:hover:not(:disabled) {
  background: #0066cc;
}

.login-button:disabled,
.signup-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #4a1a1a;
  color: #ff6b6b;
  padding: 0.6rem;
  border-radius: 4px;
  border: 1px solid #ff4444;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.5rem;
}

.success-message {
  background: #1a4a1a;
  color: #4caf50;
  padding: 0.6rem;
  border-radius: 4px;
  border: 1px solid #4caf50;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .login-modal {
    padding: 1.5rem;
    max-width: 100%;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .auth-tabs {
    gap: 0.5rem;
  }
}
</style>
