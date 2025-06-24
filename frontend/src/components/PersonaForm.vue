<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.dni" placeholder="DNI" :readonly="!!persona" required />
    <input v-model="form.nombre" placeholder="Nombre" required />
    <input v-model="form.apellido_paterno" placeholder="Apellido Paterno" required />
    <input v-model="form.apellido_materno" placeholder="Apellido Materno" required />
    <input v-model="form.fecha_nacimiento" type="date" required />
    <button type="submit">{{ persona ? 'Actualizar' : 'Registrar' }}</button>
    <button v-if="persona" type="button" @click="$emit('cancelar')">Cancelar</button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';
const props = defineProps({ persona: Object });
const emit = defineEmits(['guardado', 'cancelar']);

const form = reactive({
  dni: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: ''
});

watch(() => props.persona, (val) => {
  if (val) Object.assign(form, val);
  else Object.assign(form, { dni: '', nombre: '', apellido_paterno: '', apellido_materno: '', fecha_nacimiento: '' });
}, { immediate: true });

const handleSubmit = async () => {
  const url = props.persona
    ? `http://localhost:4000/api/personas/${form.dni}`
    : 'http://localhost:4000/api/personas';
  const method = props.persona ? 'PUT' : 'POST';
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  emit('guardado');
};
</script>