<template>
  <div v-if="isLoading" class="text-center">
    <p>Cargando...</p>
  </div>
  <div v-else class="space-y-4">
    <h1 class="text-2xl font-bold">
      ¡Hola, {{ userName || "Usuario desconocido" }}!
    </h1>
    <button
      @click="handleLogout"
      class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
      Cerrar sesión
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const { logout } = useAuth(); // Función para cerrar sesión
const router = useRouter();
const userName = ref(""); // Nombre del usuario
const isLoading = ref(true); // Estado de carga

onMounted(() => {
  const auth = getAuth();

  // Monitorea el estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || "Usuario desconocido"; // Obtiene el nombre del usuario
      isLoading.value = false; // Finaliza el estado de carga
    } else {
      router.push("/login"); // Redirige al login si no está autenticado
    }
  });
});

const handleLogout = async () => {
  try {
    await logout(); // Llama al método de logout
    router.push("/login"); // Redirige al login
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
  }
};
</script>

<script>
// Asignar middleware de autenticación
export default {
  middleware: "auth",
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
