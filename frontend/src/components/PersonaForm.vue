<template>
  <form @submit.prevent="$emit('save')" novalidate>
    <div class="form-group">
      <label class="required">DNI</label>
      <input
        v-model="personaForm.dni"
        type="text"
        :readonly="!!personaForm.id"
        :class="{ 'input-error': personaErrors.dni }"
        placeholder="Ingrese el DNI"
        maxlength="8"
        @input="$emit('clear-error', 'dni')"
        required
      />
      <div v-if="personaErrors.dni" class="error-message">{{ personaErrors.dni }}</div>
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
      <div v-if="personaErrors.nombre" class="error-message">{{ personaErrors.nombre }}</div>
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
      <div v-if="personaErrors.apellido_paterno" class="error-message">{{ personaErrors.apellido_paterno }}</div>
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
      <div v-if="personaErrors.apellido_materno" class="error-message">{{ personaErrors.apellido_materno }}</div>
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
      <div v-if="personaErrors.fecha_nacimiento" class="error-message">{{ personaErrors.fecha_nacimiento }}</div>
    </div>

    <div class="modal-actions">
      <button type="submit" class="button primary" :disabled="isSubmitting">
        <span v-if="isSubmitting">Guardando...</span>
        <span v-else>Guardar</span>
      </button>
    </div>
  </form>
</template>

<script setup>
defineProps({
  personaForm: Object,
  personaErrors: Object,
  isSubmitting: Boolean
});
defineEmits(['save', 'clear-error']);
</script>
