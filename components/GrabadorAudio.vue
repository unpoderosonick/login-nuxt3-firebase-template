<template>
  <div
    class="relative p-4 text-white border rounded-md shadow-lg bg-black/30 backdrop-blur-lg border-pink-500/50">
    <!-- Líneas neón decorativas -->
    <div class="absolute inset-0 pointer-events-none z-[-1]">
      <!-- Efecto 'scan line' sutil -->
      <div
        class="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_2px] opacity-10"></div>
    </div>

    <!-- Título estilo cyberpunk -->
    <h2
      class="text-xl font-bold mb-4 tracking-wide text-pink-400 drop-shadow-[0_0_4px_rgba(255,0,127,0.7)] uppercase"
      style="font-family: 'Orbitron', sans-serif">
      Grabador Neón
    </h2>

    <!-- Si no está grabando -->
    <div v-if="!isRecording" class="flex flex-col items-center">
      <button
        @click="handleStart"
        class="px-6 py-2 font-semibold text-white transition-transform rounded shadow-xl bg-gradient-to-r from-pink-600 to-purple-700 hover:scale-105">
        Iniciar Grabación
      </button>
    </div>

    <!-- Si está grabando -->
    <div v-else class="flex flex-col items-center">
      <p class="mb-2 font-medium text-cyan-400">
        Grabando... ({{ formatDuration(recordDuration) }})
      </p>
      <button
        @click="handleStop"
        class="px-6 py-2 font-semibold text-white transition-transform rounded shadow-xl bg-gradient-to-r from-red-600 to-pink-700 hover:scale-105">
        Detener
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAudioRecorder } from "~/composables/useAudioRecorder.js";

// Emite 'audioReady' cuando pare la grabación
const emit = defineEmits(["audioReady"]);

// Usamos el composable
const { isRecording, recordDuration, startRecording, stopRecording } =
  useAudioRecorder();

/**
 * Métodos para la UI
 */
async function handleStart() {
  await startRecording();
}

async function handleStop() {
  const blob = await stopRecording();
  if (blob) {
    emit("audioReady", blob);
  }
}

/**
 * Formatea la duración en mm:ss
 */
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
</script>

<style scoped>
/* Puedes importar fuentes o usar tailwind.config.js
     para un tema más retro-futurista.
     Ejemplo de posible import (global):
     @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
  */
</style>
