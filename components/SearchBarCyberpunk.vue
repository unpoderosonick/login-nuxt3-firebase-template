<template>
  <div class="flex items-center p-2 rounded-md bg-white/10 backdrop-blur-sm">
    <!-- Ícono Lupa -->
    <div class="flex-shrink-0 mr-2">
      <svg
        class="w-6 h-6 text-cyan-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6a4 4 0 014 4c0 .88-.285 1.69-.76 2.35l4.3 4.3
               a1 1 0 01-1.42 1.42l-4.3-4.3A3.99 3.99 0 016 10
               a4 4 0 014-4z" />
      </svg>
    </div>
    <!-- Input de búsqueda -->
    <input
      type="text"
      placeholder="Buscar transcripciones..."
      class="flex-1 text-sm text-white bg-transparent outline-none placeholder-white/60"
      v-model="searchTerm"
      @input="onInput" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Modelo de búsqueda (reactivo)
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:modelValue"]);

const searchTerm = ref(props.modelValue);

// Emitimos el valor cada vez que cambia
function onInput() {
  emits("update:modelValue", searchTerm.value);
}

// Si las props cambian externamente, sincronizamos
watch(
  () => props.modelValue,
  (newVal) => {
    searchTerm.value = newVal;
  }
);
</script>

<style scoped>
/* Podrías personalizar aún más el estilo */
</style>
