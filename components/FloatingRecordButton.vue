<template>
  <button
    class="flex items-center justify-center w-16 h-16 text-white transition-transform rounded-full shadow-xl bg-gradient-to-br from-pink-600 to-purple-700 hover:scale-105 active:scale-95"
    title="Grabar nueva reunión"
    @click="$emit('record')">
    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 1v10m0 0a3 3 0 006 0V5
             a3 3 0 00-6 0zM5 10v2a7 7 0 0014 0v-2
             M12 19v4m-4 0h8" />
    </svg>
  </button>
</template>

<script setup>
// Emite un evento "record" cuando se pulsa el botón
</script>

<style scoped>
/* Ajusta gradientes o estilos a tu preferencia. */
</style>
