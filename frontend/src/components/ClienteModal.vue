<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content fila-header">
          <h3>Clientes</h3>
          <div class="header-actions">
            <div class="search-container">
              <Search class="search-icon-outside" />
              <div class="search-input-wrapper">
                <input
                  v-model="busqueda"
                  type="text"
                  placeholder="Buscar clientes..."
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
              <Plus class="icon-small" /> Registrar Cliente
            </button>
          </div>
        </div>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Tipo Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.dni">
              <td>{{ cliente.dni }}</td>
              <td>{{ cliente.tipo_cliente }}</td>
              <td>
                <button @click="editar(cliente)" class="icon-button edit" title="Editar">
                  <Edit size="18" />
                </button>
                <button @click="pedirConfirmacionEliminar(cliente)" class="icon-button delete" title="Eliminar">
                  <Trash size="18" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="clientesFiltrados.length === 0" class="empty-state">
          <h4>No hay clientes registrados</h4>
        </div>
      </div>
    </div>

    <!-- Modal de registro/edición -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ editando ? 'Editar Cliente' : 'Registrar Cliente' }}</h3>
          <button class="close-button" @click="cerrarModal">
            <X class="icon" />
          </button>
        </div>
        <form @submit.prevent="guardarCliente" novalidate>
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
              <div v-if="errores.dni" class="error-message">{{ errores.dni }}</div>
            </div>
            <div class="form-group">
              <label class="required">Tipo Cliente</label>
              <select
                v-model="form.tipo_cliente"
                required
                class="form-control"
              >
                <option value="">Seleccione tipo</option>
                <option value="regular">Regular</option>
                <option value="frecuente">Frecuente</option>
              </select>
              <div v-if="errores.tipo_cliente" class="error-message">{{ errores.tipo_cliente }}</div>
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
          <p>¿Seguro que deseas eliminar al cliente con DNI <b>{{ clienteAEliminar?.dni }}</b>?</p>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { Plus, X, Edit, Trash, Search } from 'lucide-vue-next';

const clientes = ref([]);
const busqueda = ref('');
const showModal = ref(false);
const editando = ref(false);

const form = reactive({
  dni: '',
  tipo_cliente: ''
});
const errores = reactive({});
const loading = ref(false);
const error = ref('');

// Para confirmación de eliminación
const showConfirmDelete = ref(false);
const clienteAEliminar = ref(null);

// Mensaje flotante de éxito
const showSuccess = ref(false);
const successMessage = ref('');

const clientesFiltrados = computed(() =>
  clientes.value.filter(c =>
    c.dni.includes(busqueda.value) ||
    c.tipo_cliente.toLowerCase().includes(busqueda.value.toLowerCase())
  )
);

const cargarClientes = async () => {
  const res = await fetch('http://localhost:3000/api/clientes');
  clientes.value = await res.json();
};

function nuevo() {
  Object.assign(form, { dni: '', tipo_cliente: '' });
  Object.keys(errores).forEach(k => errores[k] = '');
  editando.value = false;
  showModal.value = true;
}

function editar(cliente) {
  Object.assign(form, cliente);
  Object.keys(errores).forEach(k => errores[k] = '');
  editando.value = true;
  showModal.value = true;
}

async function guardarCliente() {
  if (!validarClienteForm()) return;
  loading.value = true;
  error.value = '';
  const method = editando.value ? 'PUT' : 'POST';
  const url = editando.value
    ? `http://localhost:3000/api/clientes/${form.dni}`
    : 'http://localhost:3000/api/clientes';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  loading.value = false;
  if (res.ok) {
    showModal.value = false;
    cargarClientes();
    mostrarMensaje(editando.value ? 'Cliente actualizado correctamente' : 'Cliente registrado correctamente');
  } else {
    error.value = 'Error al guardar. Verifique los datos.';
  }
}

function pedirConfirmacionEliminar(cliente) {
  clienteAEliminar.value = cliente;
  showConfirmDelete.value = true;
}

async function eliminarConfirmado() {
  if (!clienteAEliminar.value) return;
  await fetch(`http://localhost:3000/api/clientes/${clienteAEliminar.value.dni}`, {
    method: 'DELETE'
  });
  showConfirmDelete.value = false;
  cargarClientes();
  mostrarMensaje('Cliente eliminado correctamente');
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

function validarClienteForm() {
  let valido = true;
  Object.keys(errores).forEach(k => errores[k] = '');
  if (!form.dni) {
    errores.dni = 'El DNI es obligatorio';
    valido = false;
  }
  if (!form.tipo_cliente) {
    errores.tipo_cliente = 'El tipo de cliente es obligatorio';
    valido = false;
  }
  return valido;
}

onMounted(cargarClientes);
</script>

<style scoped>
@import '../styles/components/ProveedorModal.css';

.fila-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  color: rgb(17, 179, 63);
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
  padding: 8px 36px 8px 16px;
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
.table-container {
  padding: 0 16px 16px 16px;
  overflow-x: auto;
}
.table {
  width: 100%;
  min-width: 500px; /* antes 700px, ahora más angosta */
  border-collapse: collapse;
  font-size: 1rem;
}
.table th, .table td {
  padding: 8px 8px; /* antes 10px 14px, ahora más compacto */
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
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
.icon-button.edit { color: #13b135; }
.icon-button.delete { color: #e53935; }
.icon-button svg { width: 20px; height: 20px; }
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
</style>