// ~/composables/useUserCurrentRecordings.js
import { ref } from "vue";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export function useUserCurrentRecordings(userId) {
  const recordings = ref([]);
  let unsubscribe = null;

  function subscribe() {
    if (unsubscribe) unsubscribe();
    if (!userId.value) return;

    const db = getFirestore();
    const colRef = collection(db, "recordings");
    const qRef = query(
      colRef,
      where("userId", "==", userId.value),
      orderBy("createdAt", "desc")
    );

    unsubscribe = onSnapshot(
      qRef,
      (snapshot) => {
        recordings.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      },
      (error) => {
        console.error("Error en la suscripción a grabaciones:", error);
      }
    );
  }

  return { recordings, subscribe };
}
