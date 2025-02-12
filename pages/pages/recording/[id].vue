<template>
  <div class="min-h-screen p-6 text-white bg-black">
    <h1 class="mb-4 text-2xl font-bold">Detalle de Grabación</h1>
    <div v-if="isLoading">Cargando...</div>
    <div v-else-if="recordingData">
      <p class="mb-2">Título: {{ recordingData.title }}</p>
      <!-- Reproductor de audio -->
      <audio
        v-if="recordingData.downloadURL"
        :src="recordingData.downloadURL"
        controls
        class="mb-4"></audio>
      <p v-if="recordingData.status">Estado: {{ recordingData.status }}</p>
      <!-- Transcripción si la tuvieras -->
      <div v-if="recordingData.transcript">
        <h2 class="mt-4 text-lg font-semibold">Transcripción</h2>
        <p>{{ recordingData.transcript }}</p>
      </div>
    </div>
    <div v-else>
      <p>No se encontró la grabación.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "#imports";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const route = useRoute();
const recordingId = route.params.id;

const isLoading = ref(true);
const recordingData = ref(null);

// Al montar, consultamos Firestore (colección "recordings" + doc = recordingId)
onMounted(async () => {
  try {
    const db = getFirestore();
    const docRef = doc(db, "recordings", recordingId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      recordingData.value = snapshot.data();
    }
  } catch (err) {
    console.error("Error cargando la grabación:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>
