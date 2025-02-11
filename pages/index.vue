<template>
  <!-- Contenedor principal con fondo degradado y elementos neon -->
  <div
    class="relative flex flex-col min-h-screen overflow-hidden text-white bg-gradient-to-b from-black via-gray-900 to-black">
    <!-- Líneas neon (decoración) -->
    <div class="absolute top-0 left-0 w-1/3 h-1 bg-pink-500 blur-[1px]"></div>
    <div class="absolute top-0 left-0 w-1 h-1/3 bg-cyan-400 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1/3 h-1 bg-cyan-500 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1 h-1/3 bg-pink-400 blur-[1px]"></div>

    <!-- Header (cyberpunk) -->
    <HeaderCyberpunk @toggleMenu="toggleSideMenu" />

    <!-- Contenido principal -->
    <main class="relative z-10 flex-1 px-4 pt-4 pb-20">
      <!-- Sección de bienvenida -->
      <section class="mb-4">
        <h2
          class="text-3xl font-extrabold text-neon-pink mb-1 drop-shadow-[0_0_6px_rgba(255,0,127,0.8)]"
          style="font-family: 'Audiowide', sans-serif">
          ¡Bienvenido, Juan!
        </h2>
        <p class="text-sm tracking-wide text-white/80">
          Registra tus reuniones en la ciudad del neón y el cromo.
        </p>
      </section>

      <!-- Barra de búsqueda -->
      <section class="mb-6">
        <SearchBarCyberpunk v-model="searchTerm" />
      </section>

      <!-- Listado de grabaciones -->
      <section>
        <h3
          class="text-xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_6px_rgba(0,255,255,0.7)]"
          style="font-family: 'Orbitron', sans-serif">
          Últimas Grabaciones
        </h3>

        <!-- Mostramos las grabaciones filtradas -->
        <RecordingCard
          v-for="(rec, idx) in filteredRecordings"
          :key="idx"
          :title="rec.title"
          :statusLabel="rec.status"
          :statusType="rec.statusType"
          @select="goToRecording(rec)" />
      </section>
    </main>

    <!-- Botón flotante: Grabar -->
    <div class="absolute bottom-16 right-6">
      <FloatingRecordButton @record="handleRecordButton" />
    </div>

    <!-- Menú lateral (opcional) -->
    <SideMenuCyberpunk
      :showMenu="showSideMenu"
      @close="toggleSideMenu"
      @logout="logoutUser" />

    <!-- Efecto 'scan lines' / 'CRT' -->
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_2px] opacity-10"></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Import de componentes
import HeaderCyberpunk from "@/components/HeaderCyberpunk.vue";
import SearchBarCyberpunk from "@/components/SearchBarCyberpunk.vue";
import RecordingCard from "@/components/RecordingCard.vue";
import FloatingRecordButton from "@/components/FloatingRecordButton.vue";
import SideMenuCyberpunk from "@/components/SideMenuCyberpunk.vue";

// Control del menú lateral
const showSideMenu = ref(false);
function toggleSideMenu() {
  showSideMenu.value = !showSideMenu.value;
}

// Búsqueda
const searchTerm = ref("");

// Estado de las grabaciones
const recordings = ref([
  // Ejemplo de grabaciones iniciales
  {
    title: "Reunión Ventas 10/02",
    status: "Transcripción lista",
    statusType: "ready",
    audioURL: null,
  },
  {
    title: "Proyecto Alpha 09/02",
    status: "Procesando...",
    statusType: "processing",
    audioURL: null,
  },
]);

// Lógica de filtrado básico
const filteredRecordings = computed(() => {
  if (!searchTerm.value) return recordings.value;
  return recordings.value.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Manejo de grabación con la API del navegador
const isRecording = ref(false);
let mediaRecorder = null;
let audioChunks = [];
let recordingCount = 2; // ya tenemos 2 ejemplos, en tu caso ajusta a 0 o a la longitud real

async function startRecording() {
  try {
    // Solicitar permisos
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Crear MediaRecorder
    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      // Unimos los chunks en un Blob
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioURL = URL.createObjectURL(audioBlob);

      // Creamos un nuevo objeto "grabación"
      recordingCount++;
      const newTitle = `Grabación ${recordingCount} - ${new Date().toLocaleString()}`;
      recordings.value.unshift({
        title: newTitle,
        status: "Grabación guardada", // o "Procesando..." si enviarás a un backend
        statusType: "ready",
        audioURL,
      });

      // Aquí podrías subir el Blob a tu backend para la transcripción
      // Ejemplo:
      // uploadAudioToServer(audioBlob).then(response => { ... })
    });

    // Iniciamos la grabación
    mediaRecorder.start();
    isRecording.value = true;
  } catch (err) {
    console.error("Error al iniciar grabación:", err);
    alert("No se pudo acceder al micrófono.");
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    isRecording.value = false;
  }
}

// Función para un solo botón Start/Stop
function handleRecordButton() {
  if (!isRecording.value) {
    startRecording();
  } else {
    stopRecording();
  }
}

// Ir al detalle de la reunión (placeholder)
function goToRecording(rec) {
  if (rec.audioURL) {
    alert(`Reproduciendo: ${rec.title}\nURL: ${rec.audioURL}`);
    // Podrías abrir un modal con <audio :src="rec.audioURL" controls></audio>
  } else {
    alert(`Abriendo detalle de: ${rec.title}`);
  }
}

// Cerrar sesión (opcional)
function logoutUser() {
  alert("Cerrando sesión...");
}
</script>

<style scoped>
.text-neon-pink {
  color: #ff00b3;
}
</style>
