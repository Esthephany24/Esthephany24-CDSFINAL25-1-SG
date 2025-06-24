<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Personas</h3>
          <button @click="nuevo" class="button primary">
            <Plus class="icon-small" />
            Registrar Persona
          </button>
        </div>
      </div>
      <div class="table-container">
        <input
          v-model="busqueda"
          placeholder="Buscar por DNI o nombre"
          class="buscador"
        />
        <table class="table">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Fecha Nacimiento</th>
              <th class="actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="persona in personasFiltradas" :key="persona.dni">
              <td>{{ persona.dni }}</td>
              <td>{{ persona.nombre }}</td>
              <td>{{ persona.apellido_paterno }}</td>
              <td>{{ persona.apellido_materno }}</td>
              <td>{{ persona.fecha_nacimiento }}</td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="editar(persona)" class="icon-button edit" title="Editar">
                    <Edit size="18" />
                  </button>
                  <button @click="confirmarEliminar(persona)" class="icon-button delete" title="Eliminar">
                    <Trash size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="personas.length === 0" class="empty-state">
          <h4>No hay personas registradas</h4>
        </div>
      </div>
      <PersonaModal
        :show="editando"
        :editingPersona="personaEditando"
        :personaForm="personaForm"
        :personaErrors="personaErrors"
        :isSubmitting="isSubmitting"
        @save="guardarPersona"
        @close="cerrarModal"
        @clear-error="clearError"
        @guardado="onGuardado"
      />
      <ConfirmDeleteModal
        :show="showDeleteModal"
        :message="deleteMessage"
        @close="showDeleteModal = false"
        @confirm="eliminar(confirmarDni)"
      />
      <div v-if="showSuccess" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Edit, Trash, Plus } from 'lucide-vue-next';
import PersonaModal from './PersonaModal.vue';
import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

const personas = ref([]);
const editando = ref(false);
const personaEditando = ref(null);

const showDeleteModal = ref(false);
const confirmarDni = ref(null);
const deleteMessage = ref('');

const personaForm = reactive({
  dni: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: ''
});
const personaErrors = reactive({});
const isSubmitting = ref(false);
const successMessage = ref('');
const showSuccess = ref(false);
const busqueda = ref('');

const personasFiltradas = computed(() =>
  personas.value.filter(p =>
    p.dni.includes(busqueda.value) ||
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
);

const cargarPersonas = async () => {
  const res = await fetch('http://localhost:4000/api/personas');
  personas.value = await res.json();
  editando.value = false;
};

const editar = (persona) => {
  Object.assign(personaForm, {
    ...persona,
    fecha_nacimiento: persona.fecha_nacimiento
      ? persona.fecha_nacimiento.substring(0, 10)
      : ''
  });
  personaEditando.value = { ...persona };
  editando.value = true;
};

const guardarPersona = async () => {
  if (!validarPersonaForm()) return;
  isSubmitting.value = true;
  const method = personaEditando.value ? 'PUT' : 'POST';
  const url = personaEditando.value
    ? `http://localhost:4000/api/personas/${personaEditando.value.dni}`
    : 'http://localhost:4000/api/personas';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personaForm)
  });

  isSubmitting.value = false;
  if (res.ok) {
    cargarPersonas();
    mostrarMensaje(personaEditando.value ? 'Persona actualizada correctamente' : 'Persona registrada correctamente');
    cerrarModal();
  } else {
    const errorData = await res.json();
    Object.keys(errorData).forEach(key => {
      personaErrors[key] = Array.isArray(errorData[key])
        ? errorData[key].join(', ')
        : errorData[key];
    });
  }
};

const cerrarModal = () => {
  editando.value = false;
  personaEditando.value = null;
  Object.assign(personaForm, { dni: '', nombre: '', apellido_paterno: '', apellido_materno: '', fecha_nacimiento: '' });
  Object.keys(personaErrors).forEach(key => {
    personaErrors[key] = [];
  });
};

const clearError = (field) => {
  personaErrors[field] = [];
};

const confirmarEliminar = (persona) => {
  confirmarDni.value = persona.dni;
  deleteMessage.value = `¿Deseas eliminar a la persona con DNI ${persona.dni}?`;
  showDeleteModal.value = true;
};

const eliminar = (dni) => {
  showDeleteModal.value = false;
  personas.value = personas.value.filter(persona => persona.dni !== dni);
  mostrarMensaje('Persona eliminada de la página (no de la base de datos)');
};

const nuevo = () => {
  personaEditando.value = null;
  Object.assign(personaForm, { dni: '', nombre: '', apellido_paterno: '', apellido_materno: '', fecha_nacimiento: '' });
  Object.keys(personaErrors).forEach(key => {
    personaErrors[key] = [];
  });
  editando.value = true;
};

function mostrarMensaje(mensaje) {
  successMessage.value = mensaje;
  showSuccess.value = true;
  setTimeout(() => { showSuccess.value = false; }, 2500);
}

function onGuardado() {
  mostrarMensaje('Persona creada con éxito');
  cargarPersonas();
  cerrarModal();
}

function validarPersonaForm() {
  let valido = true;
  Object.keys(personaErrors).forEach(k => personaErrors[k] = '');
  if (!personaForm.dni) {
    personaErrors.dni = 'El DNI es obligatorio';
    valido = false;
  }
  if (!personaForm.nombre) {
    personaErrors.nombre = 'El nombre es obligatorio';
    valido = false;
  }
  if (!personaForm.apellido_paterno) {
    personaErrors.apellido_paterno = 'El apellido paterno es obligatorio';
    valido = false;
  }
  if (!personaForm.apellido_materno) {
    personaErrors.apellido_materno = 'El apellido materno es obligatorio';
    valido = false;
  }
  if (!personaForm.fecha_nacimiento) {
    personaErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    valido = false;
  }
  return valido;
}

onMounted(cargarPersonas);
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background-color: #f5f5f5;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-container {
  padding: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.actions {
  width: 100px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.icon-button.edit {
  color: #4caf50;
}

.icon-button.delete {
  color: #f44336;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.success-message {
  color: #4caf50;
  text-align: center;
  padding: 10px;
  border: 1px solid #4caf50;
  border-radius: 4px;
  margin-top: 10px;
  background: #e8f5e9;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.buscador {
  margin-bottom: 16px;
  padding: 8px;
  width: 250px;
}
</style>