<template>
  <div class="page-container">
    <div class="card">
      
      
    </div>
    <!-- Aquí solo llamas al modal -->
    <ContratoModal
      :show="showModal"
      :editando="editando"
      :form="form"
      :empleados="empleados"
      @save="guardarContrato"
      @close="cerrarModal"
    />
    <!-- Puedes agregar un modal de confirmación y mensaje flotante igual que en personas/clientes -->
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, X, Edit, Trash, Search } from 'lucide-vue-next';
import ContratoModal from '../components/ContratoModal.vue';
import API_BASE_URL from '../services/apiBase';

const contratos = ref([]);
const empleados = ref([]);
const busqueda = ref('');
const showModal = ref(false);
const editando = ref(false);
const contratoSeleccionado = ref({});
const cargarContratos = async () => {
  const res = await fetch(`${API_BASE_URL}/contratos`);
  contratos.value = await res.json();
};
const cargarEmpleados = async () => {
  const res = await fetch(`${API_BASE_URL}/empleados`);
  empleados.value = await res.json();
};
onMounted(() => {
  cargarContratos();
  cargarEmpleados();
});
function nuevo() {
  contratoSeleccionado.value = { cod_empleado: '', fecha_inicio: '', fecha_fin: '', salario_men: '', observaciones: '', estado: 'activo' };
  editando.value = false;
  showModal.value = true;
}
function editar(contrato) {
  contratoSeleccionado.value = { ...contrato };
  editando.value = true;
  showModal.value = true;
}
async function guardarContrato(contrato) {
  const method = editando.value ? 'PUT' : 'POST';
  const url = editando.value
    ? `${API_BASE_URL}/contratos/${contrato.cod_contrato}`
    : `${API_BASE_URL}/contratos`;
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contrato)
  });
  showModal.value = false;
  cargarContratos();
}
function cerrarModal() {
  showModal.value = false;
}
const contratosFiltrados = computed(() =>
  contratos.value.filter(c =>
    String(c.cod_contrato).includes(busqueda.value) ||
    (c.nombre_completo || '').toLowerCase().includes(busqueda.value.toLowerCase())
  )
);
</script>
<style scoped>
/* Usa los estilos de tus otras páginas para header, tabla, modal, etc. */
</style>