import { createRouter, createWebHistory } from 'vue-router';
import ProductsPage from '../pages/ProductsPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import SignUpPage from '../pages/SignUpPage.vue';

const routes = [
  {
    path: '/productos',
    name: 'Productos',
    component: ProductsPage
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/signup',
    component: SignUpPage
  },
  {
    path: '/lineas',
    component: () => import('../pages/LinesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categorias',
    component: () => import('../pages/CategoriesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/proveedores',
    component: () => import('../pages/ProveedoresPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/personas',
    component: () => import('../pages/PersonasPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clientes',
    component: () => import('../pages/ClientesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/contratos',
    component: () => import('../pages/ContratosPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/productos'
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Solo permite acceso libre a productos, login y signup
  const isAuthenticated = !!localStorage.getItem('user'); // O tu lógica de sesión
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
