<template>
  <div
    class="relative min-h-screen overflow-hidden text-white bg-gradient-to-b from-black via-gray-900 to-black">
    <!-- Efectos neon decorativos -->
    <div class="absolute top-0 left-0 w-1/3 h-1 bg-pink-500 blur-[1px]"></div>
    <div class="absolute top-0 left-0 w-1 h-1/3 bg-cyan-400 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1/3 h-1 bg-cyan-500 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1 h-1/3 bg-pink-400 blur-[1px]"></div>

    <!-- Contenido principal -->
    <main class="relative z-10 max-w-3xl px-4 pt-10 mx-auto">
      <!-- Botón de volver -->
      <button
        @click="router.go(-1)"
        class="flex items-center mb-8 text-sm text-pink-300 transition-colors hover:text-cyan-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver a grabaciones
      </button>

      <!-- Encabezado -->
      <h1
        class="mb-6 text-4xl font-extrabold text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]"
        style="font-family: 'Orbitron', sans-serif">
        {{ recordingData.title || "Grabación desconocida" }}
      </h1>

      <!-- Tarjeta de detalles -->
      <div
        class="p-6 mb-8 border rounded-lg shadow-2xl bg-black/30 backdrop-blur-lg border-pink-500/50">
        <!-- Reproductor de audio (sin estilos personalizados) -->
        <div class="mb-6">
          <audio
            v-if="recordingData.downloadURL"
            :src="recordingData.downloadURL"
            controls
            class="w-full"></audio>
        </div>

        <!-- Metadatos compactos -->
        <div class="flex gap-4 mb-6 text-sm">
          <div class="p-3 rounded-md bg-gray-900/20">
            <p class="text-cyan-400">Estado:</p>
            <p :class="statusColorClass" class="font-semibold">
              {{ recordingData.statusLabel || "Subida" }}
              <!-- Valor por defecto corregido -->
            </p>
          </div>

          <div class="p-3 rounded-md bg-gray-900/20">
            <p class="text-cyan-400">Fecha:</p>
            <p class="text-pink-300">
              {{ formatDate(recordingData.createdAt?.toDate()) }}
            </p>
          </div>
        </div>

        <!-- Barra de búsqueda -->
        <div class="mb-6">
          <SearchBarCyberpunk v-model="searchTerm" @search="highlightMatches" />
        </div>

        <!-- Resumen y Acuerdos (sección unificada) -->
        <div class="mb-6">
          <h2 class="mb-3 text-lg font-bold text-cyan-400">
            Resumen y Acuerdos
          </h2>
          <div
            v-if="
              recordingData.summary ||
              (recordingData.tasks && recordingData.tasks.length > 0)
            "
            class="p-4 rounded-md bg-gray-900/20">
            <!-- Resumen -->
            <div v-if="recordingData.summary" class="mb-4">
              <p class="text-sm leading-relaxed text-white/80">
                {{ recordingData.summary }}
              </p>
            </div>

            <!-- Acuerdos y tareas -->
            <div
              v-if="recordingData.tasks && recordingData.tasks.length > 0"
              class="space-y-2">
              <div
                v-for="(task, index) in recordingData.tasks"
                :key="index"
                class="flex items-center p-3 rounded-md bg-gray-900/30">
                <input
                  type="checkbox"
                  v-model="task.completed"
                  class="mr-3 text-pink-400 rounded focus:ring-pink-500" />
                <p class="text-sm text-white/80">{{ task.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="p-4 text-center rounded-md bg-gray-900/20">
            <p class="text-white/60">No hay resumen ni acuerdos disponibles</p>
          </div>
        </div>

        <!-- Transcripción con resaltado -->
        <div
          v-if="recordingData.transcript"
          class="p-4 rounded-md bg-gray-900/20">
          <h2 class="mb-3 text-lg font-bold text-cyan-400">
            Transcripción Completa
          </h2>
          <p
            class="font-mono text-sm leading-relaxed text-white/80"
            v-html="highlightedTranscript"></p>
        </div>

        <!-- Mensaje si no hay transcripción -->
        <div v-else class="p-4 text-center rounded-md bg-gray-900/20">
          <p class="text-white/60">No hay transcripción disponible</p>
        </div>
      </div>
    </main>

    <!-- Efecto scan lines -->
    <div
      class="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_2px] opacity-10"></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "#imports";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import SearchBarCyberpunk from "~/components/SearchBarCyberpunk.vue";
import { useSearchTranscript } from "~/composables/useSearchTranscript";

const route = useRoute();
const router = useRouter();
const recordingId = route.params.id;

const isLoading = ref(true);
const recordingData = ref({});
const searchTerm = ref("");

// Color según estado
const statusColorClass = computed(() => {
  switch (recordingData.value.statusType) {
    case "ready":
      return "text-lime-400";
    case "processing":
      return "text-yellow-400";
    default:
      return "text-pink-400";
  }
});

// Formatear fecha
const formatDate = (date) => {
  if (!date) return "Fecha desconocida";
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
};

// Composable para buscar en la transcripción
const { highlightedTranscript } = useSearchTranscript(
  recordingData,
  searchTerm
);

// Cargar datos
onMounted(async () => {
  try {
    const db = getFirestore();
    const docRef = doc(db, "recordings", recordingId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      recordingData.value = {
        id: snapshot.id,
        title: data.title || `Grabación ${new Date().toLocaleString()}`,
        downloadURL: data.downloadURL || "",
        statusLabel: data.statusLabel || "Subida", // Valor por defecto corregido
        statusType: data.statusType || "ready", // Valor por defecto corregido
        createdAt: data.createdAt,
        transcript: data.transcript || "",
        summary: data.summary || "",
        tasks: data.tasks || [],
      };
    }
  } catch (error) {
    console.error("Error cargando grabación:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Audiowide&display=swap");

.text-neon-pink {
  color: #ff00b3;
}
</style>
