<template>
  <!-- Pantalla de carga -->
  <div
    v-if="isLoading"
    class="flex items-center justify-center h-screen text-center text-white bg-black">
    <p class="text-lg">Cargando...</p>
  </div>

  <!-- Pantalla principal (cyberpunk) -->
  <div
    v-else
    class="relative flex flex-col min-h-screen overflow-hidden text-white bg-gradient-to-b from-black via-gray-900 to-black">
    <!-- Decoración: Líneas neon -->
    <div class="absolute top-0 left-0 w-1/3 h-1 bg-pink-500 blur-[1px]"></div>
    <div class="absolute top-0 left-0 w-1 h-1/3 bg-cyan-400 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1/3 h-1 bg-cyan-500 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1 h-1/3 bg-pink-400 blur-[1px]"></div>

    <!-- Header y Menú lateral -->
    <HeaderCyberpunk @toggleMenu="toggleSideMenu" />
    <SideMenuCyberpunk
      :showMenu="showSideMenu"
      @close="toggleSideMenu"
      @logout="handleLogout" />

    <!-- Contenido principal -->
    <main class="relative z-0 flex-1 px-4 pt-4 pb-20">
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

      <!-- Barra de búsqueda -->
      <section class="mb-6">
        <SearchBarCyberpunk v-model="searchTerm" />
      </section>

      <!-- Lista de grabaciones -->
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

    <!-- Botón flotante para grabar (posición fija) -->
    <div class="fixed z-50 bottom-16 right-6">
      <FloatingRecordButton
        :isRecording="isRecordingComputed"
        @record="toggleRecordingWrapper" />
    </div>

    <!-- Efecto 'scan lines' (CRT) -->
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_2px] opacity-10"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { definePageMeta, useRouter } from "#imports";

// Composables
import { useUserCurrentState } from "~/composables/useUserCurrentState";
import { useUserCurrentRecordings } from "~/composables/useUserCurrentRecordings";
import { useAuth } from "~/composables/useAuth";
import { useRecorder } from "~/composables/useRecorder";

// Componentes
import HeaderCyberpunk from "~/components/HeaderCyberpunk.vue";
import SideMenuCyberpunk from "~/components/SideMenuCyberpunk.vue";
import SearchBarCyberpunk from "~/components/SearchBarCyberpunk.vue";
import RecordingCard from "~/components/RecordingCard.vue";
import FloatingRecordButton from "~/components/FloatingRecordButton.vue";

// Configuración de ruta protegida
definePageMeta({ middleware: "auth" });

const router = useRouter();

/* ==================== Estado del usuario ==================== */
const { currentUser, isLoading } = useUserCurrentState();

const userName = computed(() => {
  return currentUser.value
    ? currentUser.value.displayName || currentUser.value.email || "Usuario"
    : "Usuario desconocido";
});

const currentUserId = computed(() => currentUser.value?.uid || null);

/* ==================== Grabaciones del usuario ==================== */
const { recordings, subscribe } = useUserCurrentRecordings(currentUserId);

watch(currentUserId, (newUid) => {
  if (newUid) subscribe();
});

/* ==================== Búsqueda y filtrado ==================== */
const searchTerm = ref("");
const filteredRecordings = computed(() => {
  if (!searchTerm.value) return recordings.value;
  return recordings.value.filter((record) =>
    record.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

/* ==================== Menú lateral ==================== */
const showSideMenu = ref(false);
const toggleSideMenu = () => (showSideMenu.value = !showSideMenu.value);

/* ==================== Grabación de audio ==================== */
const recorder = ref(null);
watch(currentUserId, (newUid) => {
  if (newUid) recorder.value = useRecorder(newUid);
});

const isRecordingComputed = computed(
  () => recorder.value?.isRecording.value || false
);

/* ==================== Autenticación ==================== */
const { logout } = useAuth();
const handleLogout = async () => {
  try {
    await logout();
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
  }
};

/* ==================== Navegación a detalles ==================== */
const goToRecording = (record) => {
  router.push(`/recording/${record.id}`);
};

/* ==================== Control de grabación ==================== */
const toggleRecordingWrapper = async () => {
  if (!recorder.value) {
    console.warn("Recorder no inicializado");
    return;
  }

  if (!isRecordingComputed.value) {
    await recorder.value.toggleRecording();
  } else {
    const result = await recorder.value.toggleRecording();
    if (result?.id && result?.downloadURL) {
      recordings.value.unshift({
        id: result.id,
        title: `Grabación ${new Date().toLocaleString()}`,
        downloadURL: result.downloadURL,
        statusLabel: "Subida",
        statusType: "ready",
      });
    }
  }
};
</script>

<style scoped>
.text-neon-pink {
  color: #ff00b3;
}
</style>
