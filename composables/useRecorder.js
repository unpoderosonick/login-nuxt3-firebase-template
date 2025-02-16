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
import { set, del } from "idb-keyval";

export function useRecorder(userId, isProUser) {
  let mediaRecorder = null;
  let audioChunks = [];
  let intervalId = null;
  const isRecording = ref(false);
  const totalRecordedTime = ref(0);
  const maxFreeTime = 3 * 60 * 60 * 1000;

  async function startRecording() {
    if (!isProUser && totalRecordedTime.value >= maxFreeTime) {
      throw new Error("Límite diario alcanzado para usuarios gratuitos.");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });
      mediaRecorder.addEventListener("dataavailable", async (e) => {
        if (e.data.size > 0) {
          const audioBlob = new Blob([e.data], { type: "audio/webm" });
          await saveOrUploadAudio(audioBlob);
        }
      });

      mediaRecorder.start();
      isRecording.value = true;
      intervalId = setInterval(() => mediaRecorder.requestData(), 600000); // Fragmentos de 10 min
    } catch (err) {
      console.error("Error al iniciar grabación:", err);
      throw err;
    }
  }

  async function saveOrUploadAudio(audioBlob) {
    if (!navigator.onLine) {
      await set(`audio-${nanoid()}`, audioBlob);
    } else {
      await uploadAudio(audioBlob);
    }
  }

  async function stopRecording() {
    if (!mediaRecorder) return;
    isRecording.value = false;
    clearInterval(intervalId);
    mediaRecorder.stop();
    totalRecordedTime.value += 600000; // Incrementa el tiempo grabado
  }

  async function uploadAudio(audioBlob) {
    const storage = getStorage();
    const fileName = `recordings/${nanoid()}.webm`;
    const fileRef = storageRef(storage, fileName);
    await uploadBytes(fileRef, audioBlob);
    const downloadURL = await getDownloadURL(fileRef);
    const db = getFirestore();
    await addDoc(collection(db, "recordings"), {
      downloadURL,
      title: `Grabación ${new Date().toLocaleString()}`,
      statusLabel: "Subida",
      statusType: "ready",
      createdAt: serverTimestamp(),
      userId: userId || null,
    });
  }

  async function syncOfflineRecordings() {
    if (navigator.onLine) {
      const keys = await idbKeyval.keys();
      for (const key of keys) {
        const audioBlob = await idbKeyval.get(key);
        if (audioBlob) {
          await uploadAudio(audioBlob);
          await del(key);
        }
      }
    }
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    syncOfflineRecordings,
    totalRecordedTime,
  };
}
