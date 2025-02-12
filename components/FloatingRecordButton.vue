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
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-8">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
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
