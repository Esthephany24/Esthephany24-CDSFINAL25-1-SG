<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.ruc" placeholder="RUC" required />
    <input v-model="form.nombre" placeholder="Nombre" required />
    <button type="submit">Registrar Proveedor</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  ruc: '',
  nombre: ''
});

const handleSubmit = async () => {
  await fetch('http://localhost:4000/api/proveedores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  alert('Proveedor registrado');
};
</script>