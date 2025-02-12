// ~/composables/useUserCurrentState.js
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useUserCurrentState() {
  const currentUser = ref(null);
  const isLoading = ref(true);

  onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user;
      isLoading.value = false;
    });
  });

  return { currentUser, isLoading };
}
