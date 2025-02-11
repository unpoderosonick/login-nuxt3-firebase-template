<template>
  <!-- Si la info de Firebase se está cargando, mostramos mensaje de carga -->
  <div
    v-if="isLoading"
    class="flex items-center justify-center h-screen text-center text-white bg-black">
    <p class="text-lg">Cargando...</p>
  </div>

  <!-- De lo contrario, renderizamos la interfaz completa -->
  <div
    v-else
    class="relative flex flex-col min-h-screen overflow-hidden text-white bg-gradient-to-b from-black via-gray-900 to-black">
    <!-- Líneas neon (decoración) -->
    <div class="absolute top-0 left-0 w-1/3 h-1 bg-pink-500 blur-[1px]"></div>
    <div class="absolute top-0 left-0 w-1 h-1/3 bg-cyan-400 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1/3 h-1 bg-cyan-500 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1 h-1/3 bg-pink-400 blur-[1px]"></div>

    <!-- Header Cyberpunk -->
    <HeaderCyberpunk @toggleMenu="toggleSideMenu" />

    <!-- Menú Lateral (SideMenuCyberpunk) -->
    <SideMenuCyberpunk
      :showMenu="showSideMenu"
      @close="toggleSideMenu"
      @logout="handleLogout" />

    <!-- Contenido principal -->
    <main class="relative z-10 flex-1 px-4 pt-4 pb-20">
      <!-- Saludo con nombre de usuario de Firebase -->
      <section class="mb-4">
        <h2
          class="text-3xl font-extrabold text-neon-pink mb-1 drop-shadow-[0_0_6px_rgba(255,0,127,0.8)]"
          style="font-family: 'Audiowide', sans-serif">
          ¡Bienvenido, {{ userName }}!
        </h2>
        <p class="text-sm tracking-wide text-white/80">
          Registra tus reuniones en la ciudad del neón y el cromo.
        </p>
      </section>

      <!-- Barra de búsqueda (ejemplo) -->
      <section class="mb-6">
        <SearchBarCyberpunk v-model="searchTerm" />
      </section>

      <!-- Lista de grabaciones (ejemplo, puedes quitar si no lo necesitas ahora) -->
      <section>
        <h3
          class="text-xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_6px_rgba(0,255,255,0.7)]"
          style="font-family: 'Orbitron', sans-serif">
          Últimas Grabaciones
        </h3>

        <RecordingCard
          v-for="record in filteredRecordings"
          :key="record.id"
          :title="record.title"
          :statusLabel="record.statusLabel"
          :statusType="record.statusType"
          @select="goToRecording(record)" />
      </section>
    </main>

    <!-- Botón flotante para grabar -->
    <div class="absolute bottom-16 right-6">
      <FloatingRecordButton @record="startRecording" />
    </div>

    <!-- Efecto 'scan lines' (CRT) -->
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_2px] opacity-10"></div>
  </div>
</template>

<script setup>
// Informa que se use el middleware 'auth' para proteger esta página
definePageMeta({
  middleware: "auth",
});

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "~/composables/useAuth";

// Para mostrar/ocultar el menú lateral
const showSideMenu = ref(false);
function toggleSideMenu() {
  showSideMenu.value = !showSideMenu.value;
}

// Nombre de usuario y estado de carga
const userName = ref("Usuario desconocido");
const isLoading = ref(true);

// Al montarse el componente, detectamos si hay usuario logueado
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || user.email || "Usuario";
    } else {
      userName.value = "Invitado";
    }
    isLoading.value = false;
  });
});

// Obtenemos la función logout desde nuestro composable
const { logout } = useAuth();
const router = useRouter();

// Manejo del logout (se llamará desde SideMenuCyberpunk con @logout="handleLogout")
async function handleLogout() {
  try {
    await logout();
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
  }
}

// Lógica de búsqueda (ejemplo)
const searchTerm = ref("");

// Grabaciones de ejemplo (puedes cargarlas de Firestore o tu API en otro onMounted)
const recordings = ref([
  // { id: 'abc', title: 'Reunión de Ventas', statusLabel: 'Transcripción lista', statusType: 'ready' },
  // { id: 'def', title: 'Proyecto Alpha', statusLabel: 'Procesando...', statusType: 'processing' },
]);

// Computed para filtrar grabaciones
const filteredRecordings = computed(() => {
  if (!searchTerm.value) return recordings.value;
  return recordings.value.filter((record) =>
    record.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Acciones de grabaciones
function goToRecording(record) {
  // Podrías hacer: router.push(`/recording/${record.id}`)
  alert(`Abrir detalle de: ${record.title}`);
}

// Iniciar grabación
function startRecording() {
  alert("Iniciando grabación...");
}
</script>

<style scoped>
/* Si deseas estilos personalizados extra:
.text-neon-pink {
  color: #ff00b3;
}
*/
</style>
