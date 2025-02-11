<template>
  <div
    class="relative p-4 mb-4 transition rounded-md shadow-md bg-white/10 backdrop-blur-md hover:shadow-lg"
    @click="$emit('select')">
    <h4 class="mb-1 font-semibold text-pink-300">{{ title }}</h4>
    <p class="text-xs text-white/70">
      Estado:
      <span class="font-semibold" :class="statusClass">{{ statusLabel }}</span>
    </p>
    <!-- Efecto barra neon a la izquierda -->
    <div
      class="absolute top-0 w-1 h-full -left-1"
      :class="barColorClass + ' blur-md'"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: "Título de la reunión" },
  statusLabel: { type: String, default: "Desconocido" },
  statusType: { type: String, default: "pending" },
  // "pending", "processing", "ready", etc.
});

/*
    De acuerdo a statusType, definimos colores 
    (rosa, cian, amarillo...). Ajusta a tu preferencia.
  */
const statusClass = computed(() => {
  switch (props.statusType) {
    case "ready":
      return "text-lime-400";
    case "processing":
      return "text-yellow-300";
    default:
      return "text-white/70";
  }
});

const barColorClass = computed(() => {
  switch (props.statusType) {
    case "ready":
      return "bg-pink-500";
    case "processing":
      return "bg-cyan-400";
    default:
      return "bg-gray-500";
  }
});
</script>

<style scoped>
/* Personaliza colores o sombras según tu gusto */
</style>
