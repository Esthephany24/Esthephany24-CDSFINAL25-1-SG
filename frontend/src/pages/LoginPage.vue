<!-- filepath: frontend/src/pages/LoginPage.vue -->
<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">Iniciar sesión</h2>
      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="contraseña" type="password" required class="form-control" />
        </div>
        <button type="submit" class="auth-btn icon-btn" title="Iniciar sesión">
          <LogIn size="22" />
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LogIn } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import API_BASE_URL from '../services/apiBase';

const router = useRouter();
const email = ref('');
const contraseña = ref('');
const error = ref('');
async function login() {
  error.value = '';
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, contraseña: contraseña.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    router.push('/productos'); // O la ruta que desees tras login
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f8fa;
}
.auth-box {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5rem 2rem;
  min-width: 340px;
  max-width: 380px;
  width: 100%;
}
.auth-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.5rem;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-control {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}
.auth-btn {
  background: #1aa852;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.auth-btn:hover {
  background: #158a41;
}
.error-message {
  color: #e53935;
  text-align: center;
  margin-top: 0.5rem;
}
</style>