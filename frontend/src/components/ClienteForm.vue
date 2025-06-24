<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.dni" placeholder="DNI" :readonly="!!cliente" required />
    <input v-model="form.tipo_cliente" placeholder="Tipo Cliente" required />
    <button type="submit">{{ cliente ? 'Actualizar' : 'Registrar' }}</button>
    <button v-if="cliente" type="button" @click="$emit('cancelar')">Cancelar</button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';
const props = defineProps({ cliente: Object });
const emit = defineEmits(['guardado', 'cancelar']);

const form = reactive({
  dni: '',
  tipo_cliente: ''
});

watch(() => props.cliente, (val) => {
  if (val) Object.assign(form, val);
  else Object.assign(form, { dni: '', tipo_cliente: '' });
}, { immediate: true });

const handleSubmit = async () => {
  const url = props.cliente
    ? `http://localhost:4000/api/clientes/${form.dni}`
    : 'http://localhost:4000/api/clientes';
  const method = props.cliente ? 'PUT' : 'POST';
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  emit('guardado');
};
</script>