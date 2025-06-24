<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Clientes</h3>
          <button @click="nuevo" class="button primary">
            <Plus class="icon-small" />
            Registrar Cliente
          </button>
        </div>
      </div>
      <div class="table-container">
        <input
          v-model="busqueda"
          placeholder="Buscar por DNI o tipo de cliente"
          class="buscador"
        />
        <table class="table">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Tipo Cliente</th>
              <th class="actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.dni">
              <td>{{ cliente.dni }}</td>
              <td>{{ cliente.tipo_cliente }}</td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="editar(cliente)" class="icon-button edit" title="Editar">
                    <Edit size="18" />
                  </button>
                  <button @click="confirmarEliminar(cliente)" class="icon-button delete" title="Eliminar">
                    <Trash size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="clientesFiltrados.length === 0" class="empty-state">
          <h4>No hay clientes registrados</h4>
        </div>
      </div>
      <ClienteModal
        :show="editando"
        :editingCliente="clienteEditando"
        :clienteForm="clienteForm"
        :clienteErrors="clienteErrors"
        :isSubmitting="isSubmitting"
        :personas="personas"
        @save="guardarCliente"
        @close="cerrarModal"
        @clear-error="clearError"
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
import ClienteModal from './ClienteModal.vue';
import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

const clientes = ref([]);
const personas = ref([]);
const busqueda = ref('');
const editando = ref(false);
const clienteEditando = ref(null);

const showDeleteModal = ref(false);
const confirmarDni = ref(null);
const deleteMessage = ref('');

const clienteForm = reactive({
  dni: '',
  tipo_cliente: ''
});
const clienteErrors = reactive({});
const isSubmitting = ref(false);
const successMessage = ref('');
const showSuccess = ref(false);

const clientesFiltrados = computed(() =>
  clientes.value.filter(c =>
    c.dni.includes(busqueda.value) ||
    c.tipo_cliente.toLowerCase().includes(busqueda.value.toLowerCase())
  )
);

const cargarClientes = async () => {
  const res = await fetch('http://localhost:4000/api/clientes');
  clientes.value = await res.json();
  editando.value = false;
};

const cargarPersonas = async () => {
  const res = await fetch('http://localhost:4000/api/personas');
  personas.value = await res.json();
};

const editar = (cliente) => {
  Object.assign(clienteForm, cliente);
  clienteEditando.value = { ...cliente };
  editando.value = true;
};

const guardarCliente = async () => {
  if (!validarClienteForm()) return;
  isSubmitting.value = true;
  const method = clienteEditando.value ? 'PUT' : 'POST';
  const url = clienteEditando.value
    ? `http://localhost:4000/api/clientes/${clienteEditando.value.dni}`
    : 'http://localhost:4000/api/clientes';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clienteForm)
  });

  isSubmitting.value = false;
  if (res.ok) {
    cargarClientes();
    mostrarMensaje(clienteEditando.value ? 'Cliente actualizado correctamente' : 'Cliente registrado correctamente');
    cerrarModal();
  } else {
    const errorData = await res.json();
    Object.keys(errorData).forEach(key => {
      clienteErrors[key] = Array.isArray(errorData[key])
        ? errorData[key].join(', ')
        : errorData[key];
    });
  }
};

const cerrarModal = () => {
  editando.value = false;
  clienteEditando.value = null;
  Object.assign(clienteForm, { dni: '', tipo_cliente: '' });
  Object.keys(clienteErrors).forEach(key => {
    clienteErrors[key] = [];
  });
};

const clearError = (field) => {
  clienteErrors[field] = [];
};

const confirmarEliminar = (cliente) => {
  confirmarDni.value = cliente.dni;
  deleteMessage.value = `¿Deseas eliminar al cliente con DNI ${cliente.dni}?`;
  showDeleteModal.value = true;
};

const eliminar = (dni) => {
  showDeleteModal.value = false;
  // Elimina solo del array local, NO del backend
  clientes.value = clientes.value.filter(cliente => cliente.dni !== dni);
  mostrarMensaje('Cliente eliminado de la página (no de la base de datos)');
};

const nuevo = () => {
  clienteEditando.value = null;
  Object.assign(clienteForm, { dni: '', tipo_cliente: '' });
  Object.keys(clienteErrors).forEach(key => {
    clienteErrors[key] = [];
  });
  editando.value = true;
};

function mostrarMensaje(mensaje) {
  successMessage.value = mensaje;
  showSuccess.value = true;
  setTimeout(() => { showSuccess.value = false; }, 2500);
}

function validarClienteForm() {
  let valido = true;
  Object.keys(clienteErrors).forEach(k => clienteErrors[k] = '');
  if (!clienteForm.dni) {
    clienteErrors.dni = 'El DNI es obligatorio';
    valido = false;
  }
  if (!clienteForm.tipo_cliente) {
    clienteErrors.tipo_cliente = 'El tipo de cliente es obligatorio';
    valido = false;
  }
  return valido;
}

onMounted(() => {
  cargarClientes();
  cargarPersonas();
});
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

.buscador {
  margin-bottom: 16px;
  padding: 8px;
  width: 250px;
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
</style>