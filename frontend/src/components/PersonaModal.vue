<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ editingPersona ? 'Editar Persona' : 'Nueva Persona' }}</h3>
        <button @click="$emit('close')" class="close-button">
          <X class="icon" />
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="$emit('save')" novalidate>
          <div class="form-group">
            <label class="required">DNI</label>
            <input
              v-model="personaForm.dni"
              type="text"
              :readonly="!!editingPersona"
              :class="{ 'input-error': personaErrors.dni }"
              placeholder="Ingrese el DNI"
              maxlength="8"
              @input="$emit('clear-error', 'dni')"
              required
            />
            <transition name="fade">
              <div v-if="personaErrors.dni" class="error-message">
                {{ personaErrors.dni }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <label class="required">Nombre</label>
            <input
              v-model="personaForm.nombre"
              type="text"
              :class="{ 'input-error': personaErrors.nombre }"
              placeholder="Ingrese el nombre"
              @input="$emit('clear-error', 'nombre')"
              required
            />
            <transition name="fade">
              <div v-if="personaErrors.nombre" class="error-message">
                {{ personaErrors.nombre }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <label class="required">Apellido Paterno</label>
            <input
              v-model="personaForm.apellido_paterno"
              type="text"
              :class="{ 'input-error': personaErrors.apellido_paterno }"
              placeholder="Ingrese el apellido paterno"
              @input="$emit('clear-error', 'apellido_paterno')"
              required
            />
            <transition name="fade">
              <div v-if="personaErrors.apellido_paterno" class="error-message">
                {{ personaErrors.apellido_paterno }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <label class="required">Apellido Materno</label>
            <input
              v-model="personaForm.apellido_materno"
              type="text"
              :class="{ 'input-error': personaErrors.apellido_materno }"
              placeholder="Ingrese el apellido materno"
              @input="$emit('clear-error', 'apellido_materno')"
              required
            />
            <transition name="fade">
              <div v-if="personaErrors.apellido_materno" class="error-message">
                {{ personaErrors.apellido_materno }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <label class="required">Fecha de Nacimiento</label>
            <input
              v-model="personaForm.fecha_nacimiento"
              type="date"
              :class="{ 'input-error': personaErrors.fecha_nacimiento }"
              @input="$emit('clear-error', 'fecha_nacimiento')"
              required
            />
            <transition name="fade">
              <div v-if="personaErrors.fecha_nacimiento" class="error-message">
                {{ personaErrors.fecha_nacimiento }}
              </div>
            </transition>
          </div>
          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="button secondary">Cancelar</button>
            <button type="submit" class="button primary" :disabled="isSubmitting">
              <span v-if="isSubmitting">Guardando...</span>
              <span v-else>{{ editingPersona ? 'Actualizar' : 'Crear' }}</span>
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
  editingPersona: {
    type: Object,
    default: null
  },
  personaForm: {
    type: Object,
    required: true
  },
  personaErrors: {
    type: Object,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'save', 'clear-error']);

const eliminar = async (dni) => {
  showDeleteModal.value = false;
  await fetch(`http://localhost:4000/api/personas/${dni}`, { method: 'DELETE' });
  cargarPersonas();
  mostrarMensaje('Persona eliminada con éxito');
  cerrarModal();
};
</script>

<style scoped>
@import '../styles/components/CategoryModal.css';
</style>

<script>
export default {
  methods: {
    async guardarPersona() {
      this.isSubmitting = true;
      const res = await fetch('/api/personas', {
        method: this.editingPersona ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.personaForm)
      });
      this.isSubmitting = false;

      if (res.ok) {
        mostrarMensaje('Persona creada con éxito');
        cerrarModal();
        cargarPersonas();
      } else {
        const errorData = await res.json();
        this.personaErrors = errorData.errors || {};
      }
    }
  }
};
</script>