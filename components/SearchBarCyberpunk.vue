<template>
  <div class="relative group">
    <!-- Input con efectos neón -->
    <div
      class="relative flex items-center p-3 transition-all duration-300 border rounded-lg bg-black/30 backdrop-blur-lg border-pink-500/50 hover:border-pink-400 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-500/20">
      <!-- Ícono Lupa cyberpunk -->
      <div class="flex-shrink-0 mr-3">
        <svg
          class="w-6 h-6 text-pink-400 transition-colors group-hover:text-pink-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>

      <!-- Campo de entrada -->
      <input
        type="text"
        placeholder="Buscar en las grabaciones..."
        class="flex-1 font-mono text-base tracking-wide bg-transparent outline-none placeholder:text-gray-400 text-cyan-100"
        v-model="searchTerm"
        @input="onInput"
        @keyup.enter="$emit('search')" />
    </div>

    <!-- Efecto de brillo dinámico -->
    <div
      class="absolute inset-0 transition-opacity rounded-lg pointer-events-none opacity-20 group-hover:opacity-30 bg-gradient-to-r from-pink-500/30 to-cyan-500/30"></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:modelValue", "search"]);

const searchTerm = ref(props.modelValue);

function onInput() {
  emits("update:modelValue", searchTerm.value);
}

watch(
  () => props.modelValue,
  (newVal) => {
    searchTerm.value = newVal;
  }
);
</script>

<style scoped>
/* Efecto de texto neón para el placeholder */
input::placeholder {
  text-shadow: 0 0 8px rgba(255, 0, 127, 0.3);
}

/* Personalización de la scrollbar para consistencia */
input::-webkit-search-cancel-button {
  filter: hue-rotate(180deg);
}
</style>
