<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content fila-header">
          <h3>Personas</h3>
          <div class="header-actions">
            <div class="search-container">
              <Search class="search-icon-outside" />
              <div class="search-input-wrapper">
                <input
                  v-model="busqueda"
                  type="text"
                  placeholder="Buscar personas..."
                  class="search-input"
                />
                <button
                  v-if="busqueda"
                  @click="busqueda = ''"
                  class="clear-search-button"
                >
                  <X class="icon-small" />
                </button>
              </div>
            </div>
            <button @click="nuevo" class="button primary">
              <Plus class="icon-small" /> Nueva Persona
            </button>
          </div>
        </div>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Fecha Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="persona in personasFiltradas" :key="persona.dni">
              <td>{{ persona.dni }}</td>
              <td>{{ persona.nombre }}</td>
              <td>{{ persona.apellido_paterno }}</td>
              <td>{{ persona.apellido_materno }}</td>
              <td>{{ persona.fecha_nacimiento }}</td>
              <td>
                <button @click="editar(persona)" class="icon-button edit" title="Editar">
                  <Edit size="18" />
                </button>
                <button @click="pedirConfirmacionEliminar(persona)" class="icon-button delete" title="Eliminar">
                  <Trash size="18" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="personasFiltradas.length === 0" class="empty-state">
        <h4>No hay personas registradas</h4>
      </div>
    </div>

    <!-- Modal de registro/edición -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ editando ? 'Editar Persona' : 'Registrar Persona' }}</h3>
          <button class="close-button" @click="cerrarModal">
            <X class="icon" />
          </button>
        </div>
        <form @submit.prevent="guardarPersona" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label class="required">DNI</label>
              <input
                v-model="form.dni"
                type="text"
                :readonly="editando"
                maxlength="8"
                class="form-control"
                placeholder="Ingrese el DNI"
                required
              />
            </div>
            <div class="form-group">
              <label class="required">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-control"
                placeholder="Ingrese el nombre"
                required
              />
            </div>
            <div class="form-group">
              <label class="required">Apellido Paterno</label>
              <input
                v-model="form.apellido_paterno"
                type="text"
                class="form-control"
                placeholder="Ingrese el apellido paterno"
                required
              />
            </div>
            <div class="form-group">
              <label class="required">Apellido Materno</label>
              <input
                v-model="form.apellido_materno"
                type="text"
                class="form-control"
                placeholder="Ingrese el apellido materno"
                required
              />
            </div>
            <div class="form-group">
              <label class="required">Fecha Nacimiento</label>
              <input
                v-model="form.fecha_nacimiento"
                type="date"
                class="form-control"
                required
              />
            </div>
          </div>
          <div v-if="error" class="error-message">{{ error }}</div>
          <div class="modal-actions">
            <button type="button" class="button secondary" @click="cerrarModal">
              Cancelar
            </button>
            <button type="submit" class="button primary" :disabled="loading">
              <span v-if="loading">Guardando...</span>
              <span v-else>{{ editando ? 'Actualizar' : 'Registrar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal flotante de confirmación de eliminación -->
    <div v-if="showConfirmDelete" class="modal-overlay">
      <div class="modal-container confirm">
        <div class="modal-header">
          <Trash class="icon" style="color:#e53935" />
          <h3>Confirmar eliminación</h3>
          <button class="close-button" @click="showConfirmDelete = false">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <p>¿Seguro que deseas eliminar a la persona con DNI <b>{{ personaAEliminar?.dni }}</b>?</p>
        </div>
        <div class="modal-footer">
          <button class="button secondary" @click="showConfirmDelete = false">Cancelar</button>
          <button class="button danger" @click="eliminarConfirmado">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Mensaje flotante de éxito -->
    <div v-if="showSuccess" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { Plus, X, Edit, Trash, Search } from 'lucide-vue-next';

const personas = ref([]);
const busqueda = ref('');
const showModal = ref(false);
const editando = ref(false);

const form = reactive({
  dni: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: ''
});
const loading = ref(false);
const error = ref('');

// Para confirmación de eliminación
const showConfirmDelete = ref(false);
const personaAEliminar = ref(null);

// Mensaje flotante de éxito
const showSuccess = ref(false);
const successMessage = ref('');

const personasFiltradas = computed(() =>
  personas.value.filter(p =>
    p.dni.includes(busqueda.value) ||
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
);

const cargarPersonas = async () => {
  const res = await fetch('http://localhost:3000/api/personas');
  personas.value = await res.json();
};

function nuevo() {
  Object.assign(form, { dni: '', nombre: '', apellido_paterno: '', apellido_materno: '', fecha_nacimiento: '' });
  editando.value = false;
  showModal.value = true;
}

function editar(persona) {
  Object.assign(form, persona);
  editando.value = true;
  showModal.value = true;
}

async function guardarPersona() {
  loading.value = true;
  error.value = '';
  const method = editando.value ? 'PUT' : 'POST';
  const url = editando.value
    ? `http://localhost:3000/api/personas/${form.dni}`
    : 'http://localhost:3000/api/personas';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  loading.value = false;
  if (res.ok) {
    showModal.value = false;
    cargarPersonas();
    mostrarMensaje(editando.value ? 'Persona actualizada correctamente' : 'Persona registrada correctamente');
  } else {
    error.value = 'Error al guardar. Verifique los datos.';
  }
}

function pedirConfirmacionEliminar(persona) {
  personaAEliminar.value = persona;
  showConfirmDelete.value = true;
}

async function eliminarConfirmado() {
  if (!personaAEliminar.value) return;
  // Aquí puedes hacer la petición real al backend si lo deseas
  await fetch(`http://localhost:3000/api/personas/${personaAEliminar.value.dni}`, {
    method: 'DELETE'
  });
  showConfirmDelete.value = false;
  cargarPersonas();
  mostrarMensaje('Persona eliminada correctamente');
}

function cerrarModal() {
  showModal.value = false;
  error.value = '';
}

function mostrarMensaje(msg) {
  successMessage.value = msg;
  showSuccess.value = true;
  setTimeout(() => showSuccess.value = false, 2200);
}

onMounted(cargarPersonas);
</script>

<style scoped>
@import '../styles/components/ProveedorModal.css';


.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  min-width: 320px;
  max-width: 420px;
  width: 100%;
  padding: 1.5rem;
  position: relative;
  animation: fadeIn 0.2s;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.modal-header .icon {
  font-size: 1.5rem;
}
.modal-body {
  margin-bottom: 1rem;
}
.modal-footer, .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-control {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.error-message {
  color: #e53935;
  font-size: 0.95em;
  margin-bottom: 8px;
}
.button.primary {
  background: hsl(126, 62%, 37%);
  color: #fff;
  white-space: nowrap;
}
.button.secondary {
  background: #eee;
  color: #333;
}
.button.danger {
  background: #e53935;
  color: #fff;
}
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon-button.edit { color: #1aa852; }
.icon-button.delete { color: #e53935; }
.icon-button svg { width: 20px; height: 20px; }
.table-container {
  padding: 0 16px 16px 16px;
  overflow-x: auto;
}
.table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  font-size: 1rem;
}
.table th, .table td {
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
}
.success-message {
  color: #4caf50;
  text-align: center;
  padding: 10px 24px;
  border: 1px solid #4caf50;
  border-radius: 4px;
  margin-top: 10px;
  background: #e8f5e9;
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 2000;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(76,175,80,0.08);
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97);}
  to { opacity: 1; transform: scale(1);}
}
.fila-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* <-- Esto alinea los extremos */
  gap: 1.5rem;
  flex-wrap: wrap;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.fila-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}
.search-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1 1 300px;
  max-width: 350px;
}

.search-icon-outside {
  color: #0ba838;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 8px 36px 8px 16px; /* padding izquierdo normal */
  border-radius: 24px;
  border: 1px solid #d1d5db;
  box-shadow: 0 2px 8px rgba(60,60,60,0.10);
  background: #fff;
  font-size: 1rem;
  transition: box-shadow 0.2s;
}

.clear-search-button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
