// ~/composables/useAudioStorage.js
import { set, get, del } from "idb-keyval";

export function useAudioStorage() {
  const saveAudio = async (id, audioBlob) => await set(id, audioBlob);
  const getAudio = async (id) => await get(id);
  const deleteAudio = async (id) => await del(id);

  return { saveAudio, getAudio, deleteAudio };
}
