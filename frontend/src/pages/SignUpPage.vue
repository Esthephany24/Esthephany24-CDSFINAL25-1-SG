<!-- filepath: frontend/src/pages/SignUpPage.vue -->
<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">Registrarse</h2>
      <form @submit.prevent="signup" class="auth-form">
        <div class="form-group">
          <label>DNI</label>
          <input v-model="form.dni" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="form.nombre" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Apellido Paterno</label>
          <input v-model="form.apellido_paterno" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Apellido Materno</label>
          <input v-model="form.apellido_materno" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Fecha de Nacimiento</label>
          <input v-model="form.fecha_nacimiento" type="date" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input v-model="form.telefono" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input v-model="form.direccion" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="form.contraseña" type="password" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Rol</label>
          <select v-model="form.rol" required class="form-control">
            <option value="cliente">Cliente</option>
            <option value="empleado">Empleado</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" class="auth-btn icon-btn" title="Registrarse">
          <UserPlus size="22" />
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserPlus } from 'lucide-vue-next';

const router = useRouter();

const form = ref({
  dni: '', nombre: '', apellido_paterno: '', apellido_materno: '',
  fecha_nacimiento: '', telefono: '', direccion: '', email: '', contraseña: '', rol: 'cliente'
});
const error = ref('');
const success = ref('');

async function signup() {
  error.value = '';
  success.value = '';
  try {
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    success.value = data.message;
    // Guarda el usuario en localStorage (puedes guardar el email, dni, o lo que recibas)
    localStorage.setItem('user', JSON.stringify({
      dni: form.value.dni,
      email: form.value.email,
      nombre: form.value.nombre,
      rol: form.value.rol
    }));
    // Redirigir después de un pequeño delay para mostrar el mensaje
    setTimeout(() => {
      router.push('/productos');
    }, 1200);
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
  max-width: 420px;
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
.success-message {
  color: #13b135;
  text-align: center;
  margin-top: 0.5rem;
}
</style>