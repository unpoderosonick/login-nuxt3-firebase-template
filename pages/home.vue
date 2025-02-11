<template>
  <div v-if="isLoading" class="text-center">
    <p>Cargando...</p>
  </div>
  <div v-else class="space-y-4">
    <h1 class="text-2xl font-bold">¡Hola, {{ userName }}!</h1>
    <button
      @click="handleLogout"
      class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
      Cerrar sesión
    </button>
  </div>
</template>

<script setup>
// Se indica que esta página utiliza el middleware 'auth'
definePageMeta({
  middleware: "auth",
});

import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const { logout } = useAuth();
const router = useRouter();
const userName = ref("Usuario desconocido");
const isLoading = ref(true);

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || "Usuario desconocido";
    }
    isLoading.value = false;
  });
});

const handleLogout = async () => {
  try {
    await logout();
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
  }
};
</script>

<style scoped>
div {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
</style>
