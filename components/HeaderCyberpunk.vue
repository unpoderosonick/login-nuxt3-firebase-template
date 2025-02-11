<template>
  <header class="relative flex items-center justify-between h-16 px-4">
    <!-- Título / Logo “cyberpunk” -->
    <h1
      class="text-2xl font-bold tracking-wider text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,127,0.8)] uppercase"
      style="font-family: 'Orbitron', sans-serif">
      NeoMeetings
    </h1>

    <!-- Ícono de usuario (botón) -->
    <button
      class="p-2 text-sm font-semibold tracking-wider uppercase transition rounded-md bg-white/10 hover:bg-white/20"
      title="Configuración / Perfil"
      @click="$emit('toggleMenu')">
      JP
    </button>
  </header>
</template>

<script setup>
// Este componente emite un evento `toggleMenu` cuando clicas en “JP”.
// El padre (index.vue) podrá controlar la apertura de un menú lateral o similar.
</script>

<style scoped>
/* Ejemplo de color custom (definido en tailwind.config.js o inline) */
.text-neon-pink {
  color: #ff00b3;
}
</style>
