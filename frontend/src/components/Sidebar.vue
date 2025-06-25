<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: activeTab === tab.id }"
          @click="goTo(tab.route)"
          class="sidebar-item"
        >
          <component :is="tab.icon" class="sidebar-icon" />
          <span>{{ tab.label }}</span>
        </li>
      </ul>
      <!-- Botones en la parte inferior -->
      <div class="sidebar-bottom">
        <button class="icon-btn" @click="goTo('/login')" title="Iniciar sesión">
          <LogIn size="20" />
        </button>
        <button class="icon-btn" @click="goTo('/signup')" title="Registrarse">
          <UserPlus size="20" />
        </button>
        <button class="icon-btn logout-btn" @click="logout" title="Cerrar sesión">
          <LogOut size="18" />
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { LogIn, UserPlus, LogOut } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  tabs: Array,
  activeTab: String
});

function goTo(route) {
  router.push(route);
}

function logout() {
  localStorage.removeItem('user');
  router.push('/login');
}

const handleLinkClick = () => {
  if (window.innerWidth <= 768) {
    console.log("Cierra sidebar en móvil");
  }
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sidebar-bottom {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.sidebar {
  width: 200px;
  background-color: #f9f9f9;
  padding: 1rem;
}
.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  text-decoration: none;
  color: #333;
}
.sidebar-item.active {
  font-weight: bold;
  background-color: #eee;
}
.icon {
  margin-right: 0.5rem;
}
.logout-btn {
  background: #e53935;
}
.logout-btn:hover {
  background: #d32f2f;
}
</style>
