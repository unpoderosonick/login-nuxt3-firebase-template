// ~/composables/useRecorder.js

import { ref } from "vue";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";

export function useRecorder() {
  let mediaRecorder = null;
  let audioChunks = [];
  const isRecording = ref(false);

  // Iniciar grabación
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      });

      mediaRecorder.addEventListener("stop", onRecordingStop);

      mediaRecorder.start();
      isRecording.value = true;
      console.log("Grabación iniciada.");
    } catch (err) {
      console.error("Error al iniciar grabación:", err);
      throw err;
    }
  }

  // Detener grabación
  function stopRecording() {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    isRecording.value = false;
    console.log("Grabación detenida.");
  }

  // Al detener la grabación, subimos el archivo a Firebase Storage
  async function onRecordingStop() {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    console.log("Audio Blob listo:", audioBlob);

    // Subir a Firebase Storage
    try {
      const storage = getStorage();
      const fileName = `recordings/${nanoid()}.webm`;
      const fileRef = storageRef(storage, fileName);
      await uploadBytes(fileRef, audioBlob);
      console.log("Grabación subida a Storage:", fileName);

      // Retornamos algún dato para que el componente decida
      // Por ejemplo, un objeto con la ruta subido, etc.
      return {
        fileName,
        blob: audioBlob,
      };
    } catch (error) {
      console.error("Error subiendo a Firebase Storage:", error);
      throw error;
    }
  }

  // Toggle
  async function toggleRecording() {
    if (!isRecording.value) {
      await startRecording();
    } else {
      stopRecording();
    }
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
