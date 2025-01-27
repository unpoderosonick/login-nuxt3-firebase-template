<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <nav
        class="flex items-center justify-between h-16 max-w-5xl px-4 mx-auto">
        <!-- Branding -->
        <div class="flex items-center space-x-3">
          <img
            src="https://t3.ftcdn.net/jpg/02/14/39/38/360_F_214393844_8TuJzbiHWQT8tRqamM2WZYg2M1XM2fh0.jpg"
            alt="Logo"
            class="rounded-md w-7 h-7" />
          <h1 class="text-lg font-semibold tracking-tight text-gray-900">
            Memory Assitent
          </h1>
        </div>

        <!-- Botón Menú/Perfil -->
        <button
          class="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
            <path
              d="M13.75 6.5a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zM13.75 12.5a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zM13.75 18.5a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z"
              fill="currentColor" />
          </svg>
        </button>
      </nav>
    </header>

    <!-- Barra de Búsqueda -->
    <div class="sticky z-10 py-2 top-16 bg-gray-50">
      <div class="max-w-5xl px-4 mx-auto">
        <div class="relative">
          <input
            type="text"
            placeholder="Buscar en memorias..."
            class="w-full px-4 py-2.5 pr-10 rounded-full border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition" />
          <div class="absolute right-3 top-2.5 text-gray-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M10.25 2.75a7.5 7.5 0 016.005 11.995l5.48 5.48a.75.75 0 01-1.06 1.06l-5.48-5.48A7.5 7.5 0 1110.25 2.75zm0 1.5a6 6 0 100 12 6 6 0 000-12z"
                fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <main class="flex-1 w-full max-w-5xl px-4 mx-auto mt-4">
      <!-- Segmented Control estilo 'píldora' -->
      <div class="flex items-center justify-center mb-6">
        <div class="inline-flex p-1 space-x-1 bg-gray-200 rounded-full">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-800 transition-colors bg-white rounded-full shadow">
            Hoy
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-full hover:bg-gray-100">
            Semana
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-full hover:bg-gray-100">
            Mes
          </button>
        </div>
      </div>

      <!-- Panel de acciones globales (Pendientes y Resumen Diario) -->
      <div class="flex items-center justify-between mb-4">
        <!-- Ver Pendientes (abre panel o modal) -->
        <button
          @click="showGlobalTasks = true"
          class="inline-flex items-center font-medium text-blue-600 transition hover:text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mr-1 size-4">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
          </svg>

          Pendientes
          <span
            v-if="pendingTasksCount > 0"
            class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {{ pendingTasksCount }}
          </span>
        </button>

        <!-- Botón "Resumen Diario" -->
        <button
          @click="openDailySummaryModal"
          class="inline-flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-md shadow hover:bg-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mr-1 size-5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>

          Resumen Diario
        </button>
      </div>

      <!-- Grupo de Grabaciones por fecha -->
      <div class="space-y-8">
        <!-- Supongamos que tenemos un array con las fechas y sus grabaciones -->
        <div v-for="(recordings, dateKey) in groupedByDate" :key="dateKey">
          <!-- Encabezado de fecha -->
          <h2 class="mb-2 font-semibold text-gray-800 text-md">
            {{ formatDate(dateKey) }}
          </h2>

          <!-- Lista de grabaciones para esta fecha -->
          <div class="space-y-4">
            <article
              v-for="recording in recordings"
              :key="recording.id"
              class="p-4 transition bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
              <!-- Cabecera de la tarjeta: hora o título de la grabación -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span class="text-sm font-medium text-gray-700">
                    {{ recording.title || recordingTime(recording.timestamp) }}
                  </span>
                </div>
                <span class="text-xs text-gray-400">
                  {{ recording.duration || "---" }}
                </span>
              </div>

              <!-- Resumen / Contenido de la reunión (IA) -->
              <p class="mb-2 text-sm leading-relaxed text-gray-700">
                {{ recording.summary || "Resumen no disponible" }}
              </p>

              <!-- Acciones -->
              <div
                class="flex items-center justify-between pt-2 mt-4 border-t border-gray-100">
                <!-- Botón Audio -->
                <button
                  @click="playAudio(recording.audioUrl)"
                  class="flex items-center text-sm font-medium text-gray-400 transition hover:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="mr-1 size-4">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>

                  Audio
                </button>
                <div class="flex items-center space-x-4">
                  <!-- Botón Transcripción -->
                  <button
                    class="text-sm font-medium text-gray-400 transition hover:text-gray-600"
                    @click="viewTranscription(recording)">
                    Transcripción
                  </button>
                  <!-- Botón Recordatorio -->
                  <button
                    @click="openReminderModal(recording)"
                    class="text-sm font-medium text-blue-600 transition hover:text-blue-700">
                    Recordatorio
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>

    <!-- Botón de Grabación Flotante -->
    <div class="fixed bottom-6 right-6">
      <button
        class="p-4 text-white transition bg-blue-600 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300">
        <!-- Ícono Micrófono (para iniciar grabación) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
        </svg>
      </button>
    </div>

    <!-- Modal de Recordatorio -->
    <transition name="fade">
      <div
        v-if="showReminderModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="w-full max-w-sm p-6 mx-4 bg-white shadow-xl rounded-xl">
          <h2 class="mb-4 text-lg font-semibold text-gray-800">
            Crear Recordatorio
          </h2>

          <p class="mb-2 text-sm text-gray-700">
            Grabación:
            <strong>{{
              currentRecording ? currentRecording.title : ""
            }}</strong>
          </p>

          <label
            for="reminderTitle"
            class="block mb-1 text-sm font-medium text-gray-600"
            >Título del recordatorio</label
          >
          <input
            id="reminderTitle"
            v-model="reminderTitle"
            type="text"
            class="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Ej: 'Revisar resultados de la reunión'" />

          <div class="flex mb-4 space-x-2">
            <div class="flex-1">
              <label
                for="reminderDate"
                class="block mb-1 text-sm font-medium text-gray-600"
                >Fecha</label
              >
              <input
                id="reminderDate"
                v-model="reminderDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div class="flex-1">
              <label
                for="reminderTime"
                class="block mb-1 text-sm font-medium text-gray-600"
                >Hora</label
              >
              <input
                id="reminderTime"
                v-model="reminderTime"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeReminderModal"
              class="text-gray-600 transition hover:text-gray-800">
              Cancelar
            </button>
            <button
              @click="saveReminder"
              class="font-medium text-blue-600 transition hover:text-blue-700">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Pendientes Globales -->
    <transition name="fade">
      <div
        v-if="showGlobalTasks"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="w-full max-w-md p-6 mx-4 bg-white shadow-xl rounded-xl">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Pendientes</h2>
            <button
              @click="showGlobalTasks = false"
              class="text-gray-500 transition hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div v-if="globalTasks.length === 0">
            <p class="text-sm text-gray-600">No tienes pendientes por ahora.</p>
          </div>
          <ul v-else class="space-y-3">
            <li
              v-for="(task, index) in globalTasks"
              :key="index"
              class="flex items-start justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p class="text-sm font-medium text-gray-800">
                  {{ task.title }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ task.date }} {{ task.time }}
                </p>
              </div>
              <button
                class="text-gray-400 transition hover:text-gray-600"
                @click="completeTask(index)">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 12l2 2l4 -4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!-- Modal de Resumen Diario -->
    <transition name="fade">
      <div
        v-if="showDailySummaryModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="w-full max-w-md p-6 mx-4 bg-white shadow-xl rounded-xl">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Resumen Diario</h2>
            <button
              @click="closeDailySummaryModal"
              class="text-gray-500 transition hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="space-y-3 text-sm leading-relaxed text-gray-700">
            <!-- Aquí mostrarías el resumen consolidado del día -->
            <p v-if="dailySummary">
              {{ dailySummary }}
            </p>
            <p v-else class="text-gray-500">
              No hay resumen disponible para hoy.
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// EJEMPLO de datos:
// Podrías cargarlos desde tu backend,
// o generarlos dinámicamente tras el procesamiento de IA
const recordingsData = [
  {
    id: 1,
    date: "2025-01-28T10:00:00",
    title: "Reunión con Marketing",
    duration: "30 min",
    audioUrl: "/audio/audio1.mp3",
    summary: "Se acordó lanzar nueva campaña...",
    timestamp: "2025-01-28T10:00:00",
  },
  {
    id: 2,
    date: "2025-01-28T12:30:00",
    title: "Llamada con Juan",
    duration: "15 min",
    audioUrl: "/audio/audio2.mp3",
    summary: "Se definieron pasos para el proyecto X...",
    timestamp: "2025-01-28T12:30:00",
  },
  {
    id: 3,
    date: "2025-01-27T09:15:00",
    title: "Sesión de Brainstorming",
    duration: "45 min",
    audioUrl: "/audio/audio3.mp3",
    summary: "Se propusieron nuevas ideas...",
    timestamp: "2025-01-27T09:15:00",
  },
];

// Agrupar grabaciones por fecha (sólo yyyy-mm-dd) para mostrar en la interfaz
function groupRecordingsByDate(data) {
  const groups = {};
  data.forEach((item) => {
    // Extraer sólo la parte de la fecha "YYYY-MM-DD"
    const dateKey = item.date.substring(0, 10);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
  });
  return groups;
}

const groupedByDate = computed(() => groupRecordingsByDate(recordingsData));

// Modal de Recordatorio
const showReminderModal = ref(false);
const reminderTitle = ref("");
const reminderDate = ref("");
const reminderTime = ref("");
const currentRecording = ref(null);

// Pendientes Globales
const showGlobalTasks = ref(false);
const globalTasks = ref([]); // array de { title, date, time }
const pendingTasksCount = computed(() => globalTasks.length);

// Resumen Diario
const showDailySummaryModal = ref(false);
const dailySummary = ref(""); // Guardar el texto del resumen diario

// Abrir/cerrar recordatorio
function openReminderModal(recording) {
  currentRecording.value = recording;
  showReminderModal.value = true;
}
function closeReminderModal() {
  showReminderModal.value = false;
  reminderTitle.value = "";
  reminderDate.value = "";
  reminderTime.value = "";
}

function saveReminder() {
  // Ejemplo de estructura
  const newTask = {
    title: reminderTitle.value || "Recordatorio sin título",
    date: reminderDate.value,
    time: reminderTime.value,
  };
  globalTasks.value.push(newTask);
  closeReminderModal();
}

// Completar o eliminar pendiente
function completeTask(index) {
  globalTasks.value.splice(index, 1);
}

// Daily Summary Modal
function openDailySummaryModal() {
  // Aquí podrías llamar a tu IA para generar el resumen de todas las grabaciones de hoy
  // Por ahora, simulamos un resultado:
  dailySummary.value =
    "Hoy se tuvieron 2 reuniones principales. Principales acuerdos: ... Pendientes: ...";
  showDailySummaryModal.value = true;
}
function closeDailySummaryModal() {
  showDailySummaryModal.value = false;
}

// Helpers
function formatDate(dateString) {
  // Podrías formatear la fecha a algo más legible
  // Por ejemplo, "2025-01-28" -> "28 Ene, 2025"
  const d = new Date(dateString);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function recordingTime(timestamp) {
  // Muestra sólo la hora en hh:mm
  const d = new Date(timestamp);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

// Acciones (placeholder)
function playAudio(url) {
  console.log("Reproduciendo audio:", url);
}
function viewTranscription(recording) {
  console.log("Mostrando transcripción de", recording.title);
}
</script>

<style scoped>
/* Transición para los modales (fade) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tipografía “Apple-like” opcional */
:root {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>
