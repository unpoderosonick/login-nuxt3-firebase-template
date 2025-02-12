// ~/composables/useRecorder.js
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

export function useRecorder(userId) {
  let mediaRecorder = null;
  let audioChunks = [];
  const isRecording = ref(false);

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

      mediaRecorder.start();
      isRecording.value = true;
      console.log("Grabación iniciada.");
    } catch (err) {
      console.error("Error al iniciar grabación:", err);
      throw err;
    }
  }

  function stopRecording() {
    if (!mediaRecorder) return;
    isRecording.value = false;
    console.log("Grabación detenida.");

    return new Promise((resolve, reject) => {
      mediaRecorder.addEventListener(
        "stop",
        async () => {
          try {
            const result = await onRecordingStop();
            resolve(result);
          } catch (err) {
            reject(err);
          } finally {
            mediaRecorder = null;
          }
        },
        { once: true }
      );

      mediaRecorder.stop();
    });
  }

  async function toggleRecording() {
    if (!isRecording.value) {
      await startRecording();
    } else {
      return stopRecording();
    }
  }

  async function onRecordingStop() {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    console.log("Audio Blob listo:", audioBlob);

    const storage = getStorage();
    const fileName = `recordings/${nanoid()}.webm`;
    const fileRef = storageRef(storage, fileName);
    await uploadBytes(fileRef, audioBlob);
    console.log("Grabación subida a Storage:", fileName);

    const downloadURL = await getDownloadURL(fileRef);
    console.log("downloadURL:", downloadURL);

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

    return {
      id: docRef.id,
      downloadURL,
    };
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
