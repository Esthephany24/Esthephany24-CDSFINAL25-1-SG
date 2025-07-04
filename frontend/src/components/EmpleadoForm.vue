<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.dni" placeholder="DNI" required />
    <input v-model="form.contraseña" placeholder="Contraseña" required />
    <label>
      Administrador
      <input type="checkbox" v-model="form.es_administrador" />
    </label>
    <button type="submit">{{ empleado ? 'Actualizar' : 'Registrar' }}</button>
    <button v-if="empleado" type="button" @click="$emit('cancelar')">Cancelar</button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';
import API_BASE_URL from '../services/apiBase';

const props = defineProps({ empleado: Object });
const emit = defineEmits(['guardado', 'cancelar']);

const form = reactive({
  dni: '',
  contraseña: '',
  es_administrador: false
});

watch(() => props.empleado, (val) => {
  if (val) Object.assign(form, val);
  else Object.assign(form, { dni: '', contraseña: '', es_administrador: false });
}, { immediate: true });

const handleSubmit = async () => {
  const url = props.empleado
    ? `${API_BASE_URL}/empleados/${props.empleado.cod_empleado}`
    : `${API_BASE_URL}/empleados`;
  const method = props.empleado ? 'PUT' : 'POST';
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  emit('guardado');
};
</script>