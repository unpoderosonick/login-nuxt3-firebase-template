// composables/useAudioRecorder.js
import { ref, onUnmounted } from "vue";

export function useAudioRecorder() {
  const isRecording = ref(false);
  const recordDuration = ref(0);
  let recordInterval = null;
  let mediaRecorder = null;
  let audioChunks = [];

  /**
   * Inicia la grabación
   */
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start();
      isRecording.value = true;

      // Iniciar conteo de segundos
      recordDuration.value = 0;
      recordInterval = setInterval(() => {
        recordDuration.value++;
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar la grabación:", error);
      alert("No se pudo acceder al micrófono. Verifica permisos.");
    }
  }

  /**
   * Detiene la grabación y retorna el Blob
   */
  function stopRecording() {
    return new Promise((resolve) => {
      if (!mediaRecorder) {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioChunks = [];
        mediaRecorder = null;
        isRecording.value = false;

        // Paramos conteo
        clearInterval(recordInterval);
        recordInterval = null;

        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }

  // Limpieza al desmontar
  onUnmounted(() => {
    if (recordInterval) clearInterval(recordInterval);
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  });

  return {
    isRecording,
    recordDuration,
    startRecording,
    stopRecording,
  };
}
