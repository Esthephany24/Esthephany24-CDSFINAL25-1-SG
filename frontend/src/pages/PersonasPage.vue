<template>
  <div class="page-container">
    
    <PersonaModal
      :show="showModal"
      :persona="personaSeleccionada"
      :editando="editando"
      @close="showModal = false"
      @save="guardarPersona"
    />
    <ConfirmDeleteModal
      :show="showDeleteModal"
      message="¿Seguro que deseas eliminar esta persona?"
      @confirm="eliminarPersonaConfirmado"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, X, Edit, Trash } from 'lucide-vue-next';
import PersonaService from '../services/personaService';
import PersonaModal from '../components/PersonaModal.vue';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';

const personas = ref([]);
const showModal = ref(false);
const editando = ref(false);
const personaSeleccionada = ref({});
const orden = ref({ campo: 'dni', asc: true });
const busqueda = ref('');

// Para eliminar
const showDeleteModal = ref(false);
const personaAEliminar = ref(null);

const cargarPersonas = async () => {
  personas.value = await PersonaService.obtenerTodas();
};

onMounted(cargarPersonas);

function nuevo() {
  personaSeleccionada.value = { dni: '', nombre: '', apellido_paterno: '', apellido_materno: '', fecha_nacimiento: '' };
  editando.value = false;
  showModal.value = true;
}
function abrirModalEditar(persona) {
  personaSeleccionada.value = { ...persona };
  editando.value = true;
  showModal.value = true;
}
async function guardarPersona(persona) {
  if (editando.value) {
    await PersonaService.actualizar(persona.dni, persona);
  } else {
    await PersonaService.crear(persona);
  }
  showModal.value = false;
  cargarPersonas();
}
function confirmarEliminar(persona) {
  personaAEliminar.value = persona;
  showDeleteModal.value = true;
}
async function eliminarPersonaConfirmado() {
  if (personaAEliminar.value) {
    await PersonaService.eliminar(personaAEliminar.value.dni);
    showDeleteModal.value = false;
    cargarPersonas();
  }
}
function ordenarPor(campo) {
  if (orden.value.campo === campo) {
    orden.value.asc = !orden.value.asc;
  } else {
    orden.value.campo = campo;
    orden.value.asc = true;
  }
}
const personasOrdenadas = computed(() => {
  return [...personas.value].sort((a, b) => {
    const campo = orden.value.campo;
    if (a[campo] < b[campo]) return orden.value.asc ? -1 : 1;
    if (a[campo] > b[campo]) return orden.value.asc ? 1 : -1;
    return 0;
  });
});
function cerrarModal() {
  // Cierra el modal y limpia los datos
  showModal.value = false;
  personaEditando.value = null;
}
function onGuardado() {
  // Recarga la lista y cierra el modal
  cargarPersonas();
  cerrarModal();
}
</script>

<style scoped>
@import '../styles/pages/LinesPage.css';
.icon-button.edit {
  color: #1976d2;
}
.icon-button.delete {
  color: #e53935;
}
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
}
.icon-button:hover {
  opacity: 0.7;
}
.search-container {
  position: relative;
  display: inline-block;
}
.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0.5rem;
}
.search-icon {
  color: #999;
  margin-right: 0.5rem;
}
.search-input {
  border: none;
  background: none;
  outline: none;
  padding: 0;
  width: 200px;
}
.clear-search-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  margin-left: 0.5rem;
}
.clear-search-button:hover {
  color: #333;
}
</style>
