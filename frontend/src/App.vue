<template>
  <div class="dashboard">
    <!-- Componente de carga global -->
    <GlobalLoading />
    
    <!-- Sidebar -->
    <Sidebar 
      :active-tab="activeTab" 
      :tabs="tabs"
    />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Navbar -->
      <Navbar :user="currentUser" />
      
      <!-- Main Content Area -->
      <main class="content">
        <div class="content-container">
          <!-- Router View for Dynamic Page Content -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Package, Layers, Tag, Truck, User, Users, FileText, LogOut } from 'lucide-vue-next';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import GlobalLoading from './components/GlobalLoading.vue';
import { provideLoading } from './composables/useLoading';

const route = useRoute();
const router = useRouter();

// Proveer el estado de carga global
const { startLoading, stopLoading } = provideLoading();

// Configurar el manejo de carga en el router
router.beforeEach((to, from, next) => {
  startLoading('Cargando...');
  next();
});

router.afterEach(() => {
  // Pequeño retraso para evitar parpadeo
  setTimeout(() => {
    stopLoading();
  }, 100);
});

// Datos del usuario actual
const currentUser = ref({
  name: 'Admin',
  email: 'erika@chavez.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
});

// Pestañas de navegación
const tabs = [
  { id: 'productos', label: 'Productos', icon: Package, route: '/productos' },
  { id: 'lineas', label: 'Líneas', icon: Layers, route: '/lineas' },
  { id: 'categorias', label: 'Categorías', icon: Tag, route: '/categorias' },
  { id: 'proveedores', label: 'Proveedores', icon: Truck, route: '/proveedores' },
  { id: 'personas', label: 'Personas', icon: User, route: '/personas' },
  { id: 'clientes', label: 'Clientes', icon: Users, route: '/clientes' },
  { id: 'contratos', label: 'Contratos', icon: FileText, route: '/contratos' }, // Nueva pestaña para Contratos
];

// Pestaña activa basada en la ruta actual
const activeTab = computed(() => {
  const path = route.path;
  if (path.startsWith('/productos')) return 'productos';
  if (path.startsWith('/lineas')) return 'lineas';
  if (path.startsWith('/categorias')) return 'categorias';
  if (path.startsWith('/proveedores')) return 'proveedores';
  if (path.startsWith('/personas')) return 'personas';
  if (path.startsWith('/clientes')) return 'clientes';
  if (path.startsWith('/contratos')) return 'contratos'; // Nueva condición para Contratos
  return 'productos';
});

// Redirigir a la ruta de productos por defecto
onMounted(() => {
  if (route.path === '/') {
    router.push('/productos');
  }
});

// Función para cerrar sesión
function logout() {
  // Lógica para cerrar sesión (borrar token, redirigir, etc)
}
</script>

<style>
@import './styles/App.css';
</style>
