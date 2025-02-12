<template>
  <div
    v-if="isLoading"
    class="flex items-center justify-center h-screen text-center text-white bg-black">
    <p class="text-lg">Cargando...</p>
  </div>

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
    <main class="relative z-0 flex-1 px-4 pt-4 pb-20">
      <!-- Saludo con userName de Firebase -->
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

    <!-- Botón flotante (z-50) -->
    <div class="absolute z-50 bottom-16 right-6">
      <FloatingRecordButton
        :isRecording="isRecording"
        @record="toggleRecording" />
    </div>

    <!-- Efecto scan lines -->
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_2px] opacity-10"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { definePageMeta, useRouter } from "#imports";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "~/composables/useAuth";

// Nuestro composable de grabación
import { useRecorder } from "~/composables/useRecorder.js";

// COMPONENTES
import HeaderCyberpunk from "~/components/HeaderCyberpunk.vue";
import SideMenuCyberpunk from "~/components/SideMenuCyberpunk.vue";
import SearchBarCyberpunk from "~/components/SearchBarCyberpunk.vue";
import RecordingCard from "~/components/RecordingCard.vue";
import FloatingRecordButton from "~/components/FloatingRecordButton.vue";

// Protegemos la página con middleware auth
definePageMeta({ middleware: "auth" });

// side menu
const showSideMenu = ref(false);
function toggleSideMenu() {
  showSideMenu.value = !showSideMenu.value;
}

// loading + userName (Firebase)
const isLoading = ref(true);
const userName = ref("Usuario desconocido");

// Al montar, escuchamos Auth
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

// Logout
const { logout } = useAuth();
const router = useRouter();
async function handleLogout() {
  try {
    await logout();
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
  }
}

// Búsqueda + grabaciones (ejemplo)
const searchTerm = ref("");
const recordings = ref([]);

const filteredRecordings = computed(() => {
  if (!searchTerm.value) return recordings.value;
  return recordings.value.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

function goToRecording(record) {
  alert(`Detalle de la grabación: ${record.title}`);
}

// ============== USE RECORDER ===============
const { isRecording, toggleRecording, startRecording, stopRecording } =
  useRecorder();

/**
 * Si deseas, podrías “enganchar” el momento en que
 * se sube la grabación y hacer algo con la respuesta
 * (p.ej. meter un nuevo recording en la lista).
 *
 * Para ello, ajusta `onRecordingStop()` dentro del composable
 * para que retorne un objeto, y aquí lo capturas.
 */
</script>

<style scoped>
.text-neon-pink {
  color: #ff00b3;
}
</style>
