<template>
    <nav class="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div>
        <h1 class="text-xl font-bold">
          <nuxt-link to="/">Mi App</nuxt-link>
        </h1>
      </div>
      <ul class="flex space-x-4">
        <li v-if="!isAuthenticated">
          <nuxt-link to="/login" class="hover:underline">Iniciar sesión</nuxt-link>
        </li>
        <li v-if="!isAuthenticated">
          <nuxt-link to="/register" class="hover:underline">Registrarse</nuxt-link>
        </li>
        <li v-if="isAuthenticated">
          <nuxt-link to="/home" class="hover:underline">Inicio</nuxt-link>
        </li>
        <li v-if="isAuthenticated">
          <button @click="handleLogout" class="hover:underline">Cerrar sesión</button>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { useAuth } from "~/composables/useAuth";
  import { useRouter } from "vue-router";
  
  const isAuthenticated = ref(false); // Estado de autenticación
  const { logout } = useAuth(); // Función de logout
  const router = useRouter();
  
  onMounted(() => {
    const auth = getAuth();
  
    // Escucha cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      isAuthenticated.value = !!user; // Actualiza el estado según si hay un usuario autenticado
    });
  });
  
  const handleLogout = async () => {
    await logout(); // Cierra sesión
    router.push("/login"); // Redirige al login
  };
  </script>
  
  <style scoped>
  nav {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  