<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";

onMounted(() => {
  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    immediate: true,
    onRegistered(r) {
      console.log("Service Worker registrado:", r);
    },
    onOfflineReady() {
      console.log("La app está lista para usarse offline.");
    },
    onNeedRefresh() {
      console.log("Hay una nueva versión disponible.");
    },
  });
});
</script>
