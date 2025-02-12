import { ref } from "vue";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { nanoid } from "nanoid";

/**
 * useRecorder composable
 * - Graba audio con MediaRecorder
 * - Sube la grabación a Firebase Storage
 * - Crea un documento en Firestore con la URL y metadatos
 *
 * Retorna:
 *  - isRecording (ref)
 *  - startRecording, stopRecording, toggleRecording
 */
export function useRecorder(userId) {
  let mediaRecorder = null;
  let audioChunks = [];
  const isRecording = ref(false);

  /**
   * Inicia la grabación solicitando permisos de audio
   */
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

      // Cuando se detiene la grabación, subimos el archivo
      mediaRecorder.addEventListener("stop", onRecordingStop);

      mediaRecorder.start();
      isRecording.value = true;
      console.log("Grabación iniciada.");
    } catch (err) {
      console.error("Error al iniciar grabación:", err);
      throw err;
    }
  }

  /**
   * Detiene la grabación (dispara 'stop')
   */
  function stopRecording() {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    isRecording.value = false;
    console.log("Grabación detenida.");
  }

  /**
   * Alterna entre iniciar y detener grabación
   */
  async function toggleRecording() {
    if (!isRecording.value) {
      await startRecording();
    } else {
      stopRecording();
    }
  }

  /**
   * Se dispara cuando finaliza la grabación:
   * - Crea el Blob
   * - Sube a Storage
   * - Crea doc en Firestore
   * - Retorna { id, downloadURL }
   */
  async function onRecordingStop() {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    console.log("Audio Blob listo:", audioBlob);

    try {
      // 1) Subir a Firebase Storage
      const storage = getStorage();
      const fileName = `recordings/${nanoid()}.webm`;
      const fileRef = storageRef(storage, fileName);
      await uploadBytes(fileRef, audioBlob);
      console.log("Grabación subida a Storage:", fileName);

      // 2) Obtener la URL de descarga
      const downloadURL = await getDownloadURL(fileRef);
      console.log("downloadURL:", downloadURL);

      // 3) Crear doc en Firestore
      const db = getFirestore();
      const recordingsCol = collection(db, "recordings");
      const docRef = await addDoc(recordingsCol, {
        downloadURL,
        title: `Grabación ${new Date().toLocaleString()}`,
        status: "ready",
        createdAt: serverTimestamp(),
        userId: userId || null,
      });
      console.log("Documento Firestore creado:", docRef.id);

      // 4) Retornamos la info al componente
      return {
        id: docRef.id,
        downloadURL,
      };
    } catch (error) {
      console.error("Error subiendo grabación a Firebase:", error);
      throw error;
    }
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
