<template>
  <transition name="slide">
    <div
      v-if="showMenu"
      class="fixed top-0 right-0 z-40 w-64 h-full p-4 shadow-2xl bg-white/20 backdrop-blur-md">
      <h2 class="mb-2 font-bold text-white">Configuración</h2>
      <ul class="space-y-2 text-sm text-white/90">
        <li>Cuenta</li>
        <li>Notificaciones</li>
        <li>Privacidad</li>
        <li>Suscripción</li>
        <li @click="$emit('logout')" class="cursor-pointer hover:text-pink-300">
          Cerrar sesión
        </li>
      </ul>
      <!-- Botón para cerrar menú -->
      <button
        class="absolute top-2 right-2 text-white/70 hover:text-white/100"
        @click="$emit('close')">
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  showMenu: { type: Boolean, default: false },
});

const emits = defineEmits(["close", "logout"]);
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}
</style>
