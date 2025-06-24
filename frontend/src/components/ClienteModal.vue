<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingCliente ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
        <button @click="$emit('close')" class="close-button">
          <X class="icon" />
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="$emit('save')" novalidate>
          <div class="form-group">
            <label class="required">DNI</label>
            <select
              v-model="clienteForm.dni"
              :readonly="!!editingCliente"
              :class="{ 'input-error': clienteErrors.dni }"
              required
              :disabled="!!editingCliente"
              @input="$emit('clear-error', 'dni')"
            >
              <option value="">Seleccione DNI</option>
              <option v-for="persona in personas" :key="persona.dni" :value="persona.dni">
                {{ persona.dni }} - {{ persona.nombre }} {{ persona.apellido_paterno }}
              </option>
            </select>
            <transition name="fade">
              <div v-if="clienteErrors.dni" class="error-message">
                {{ clienteErrors.dni }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <label class="required">Tipo Cliente</label>
            <select
              v-model="clienteForm.tipo_cliente"
              :class="{ 'input-error': clienteErrors.tipo_cliente }"
              @input="$emit('clear-error', 'tipo_cliente')"
              required
            >
              <option value="">Seleccione tipo</option>
              <option value="regular">Regular</option>
              <option value="frecuente">Frecuente</option>
            </select>
            <transition name="fade">
              <div v-if="clienteErrors.tipo_cliente" class="error-message">
                {{ clienteErrors.tipo_cliente }}
              </div>
            </transition>
          </div>
          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="button secondary">Cancelar</button>
            <button type="submit" class="button primary" :disabled="isSubmitting">
              <span v-if="isSubmitting">Guardando...</span>
              <span v-else>{{ editingCliente ? 'Actualizar' : 'Crear' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';

defineProps({
  show: Boolean,
  editingCliente: {
    type: Object,
    default: null
  },
  clienteForm: {
    type: Object,
    required: true
  },
  clienteErrors: {
    type: Object,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  personas: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'save', 'clear-error']);
</script>

<style scoped>
@import '../styles/components/CategoryModal.css';
</style>