<template>
  <button
    :class="[
      'flex items-center justify-center w-16 h-16 text-white transition-transform rounded-full shadow-xl focus:outline-none',
      isRecording
        ? 'bg-red-600 animate-pulse'
        : 'bg-gradient-to-br from-pink-600 to-purple-700 hover:scale-105 active:scale-95',
    ]"
    title="Grabar nueva reunión"
    @click="onClick">
    <!-- Ícono micrófono si no está grabando -->
    <svg
      v-if="!isRecording"
      class="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 1v10m0 0a3 3 0 006 0V5
               a3 3 0 00-6 0zM5 10v2a7 7 0 0014 0v-2
               M12 19v4m-4 0h8" />
    </svg>

    <!-- Ícono stop si está grabando -->
    <svg
      v-else
      class="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2" />
    </svg>
  </button>
</template>

<script setup>
const props = defineProps({
  isRecording: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["record"]);

function onClick() {
  emits("record");
}
</script>

<style scoped></style>
