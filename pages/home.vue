<template>
  <!-- Pantalla de carga -->
  <div
    v-if="isLoading"
    class="flex items-center justify-center h-screen text-center text-white bg-black">
    <p class="text-lg">Cargando...</p>
  </div>

  <!-- Pantalla principal (cyberpunk) -->
  <div
    v-else
    class="relative flex flex-col min-h-screen overflow-hidden text-white bg-gradient-to-b from-black via-gray-900 to-black">
    <!-- Líneas neon (decoración) -->
    <div class="absolute top-0 left-0 w-1/3 h-1 bg-pink-500 blur-[1px]"></div>
    <div class="absolute top-0 left-0 w-1 h-1/3 bg-cyan-400 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1/3 h-1 bg-cyan-500 blur-[1px]"></div>
    <div
      class="absolute bottom-0 right-0 w-1 h-1/3 bg-pink-400 blur-[1px]"></div>

    <!-- Header principal -->
    <HeaderCyberpunk @toggleMenu="toggleSideMenu" />

    <!-- Menú Lateral -->
    <SideMenuCyberpunk
      :showMenu="showSideMenu"
      @close="toggleSideMenu"
      @logout="handleLogout" />

    <!-- Contenido principal -->
    <main class="relative z-0 flex-1 px-4 pt-4 pb-20">
      <section class="mb-4">
        <h2
          class="text-3xl font-extrabold text-neon-pink mb-1 drop-shadow-[0_0_6px_rgba(255,0,127,0.8)]"
          style="font-family: 'Audiowide', sans-serif">
          ¡Bienvenido, {{ userName }}!
        </h2>
        <p class="text-sm tracking-wide text-white/80">
          Registra tus reuniones en la ciudad del neón y el cromo.
        </p>
      </section>

      <!-- Barra de búsqueda -->
      <section class="mb-6">
        <SearchBarCyberpunk v-model="searchTerm" />
      </section>

      <!-- Lista de grabaciones (tarjetas) -->
      <section>
        <h3
          class="text-xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_6px_rgba(0,255,255,0.7)]"
          style="font-family: 'Orbitron', sans-serif">
          Últimas Grabaciones
        </h3>

        <RecordingCard
          v-for="record in filteredRecordings"
          :key="record.id"
          :title="record.title"
          :statusLabel="record.statusLabel"
          :statusType="record.statusType"
          @select="goToRecording(record)" />
      </section>
    </main>

    <!-- Botón flotante para grabar -->
    <div class="absolute z-50 bottom-16 right-6">
      <!-- Se usa la propiedad computada para enviar un booleano -->
      <FloatingRecordButton
        :isRecording="isRecordingComputed"
        @record="toggleRecordingWrapper" />
    </div>

    <!-- Efecto 'scan lines' (CRT) -->
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_2px] opacity-10"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { definePageMeta, useRouter } from "#imports";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "~/composables/useAuth";
import { useRecorder } from "~/composables/useRecorder.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// Componentes de la interfaz
import HeaderCyberpunk from "~/components/HeaderCyberpunk.vue";
import SideMenuCyberpunk from "~/components/SideMenuCyberpunk.vue";
import SearchBarCyberpunk from "~/components/SearchBarCyberpunk.vue";
import RecordingCard from "~/components/RecordingCard.vue";
import FloatingRecordButton from "~/components/FloatingRecordButton.vue";

// Protegemos la ruta con middleware 'auth'
definePageMeta({ middleware: "auth" });

/* ----------------- Variables reactivas y funciones de UI ----------------- */
const showSideMenu = ref(false);
function toggleSideMenu() {
  showSideMenu.value = !showSideMenu.value;
}

const isLoading = ref(true);
const userName = ref("Usuario desconocido");
const searchTerm = ref("");
const recordings = ref([]);
let currentUserUid = null;
let recorder = null;
let unsubscribeFn = null;

const filteredRecordings = computed(() => {
  if (!searchTerm.value) return recordings.value;
  return recordings.value.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

/* ----------------- Autenticación y suscripción ----------------- */
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || user.email || "Usuario";
      currentUserUid = user.uid;

      // Instanciamos el recorder cuando ya tenemos el UID
      recorder = useRecorder(currentUserUid);
      // Suscribimos a Firestore para mostrar las grabaciones del usuario
      subscribeToRecordings();
    } else {
      userName.value = "Invitado";
      currentUserUid = null;
      recordings.value = [];
      recorder = null;
    }
    isLoading.value = false;
  });
});

/* ----------------- Propiedad Computada ----------------- */
// Esta propiedad extrae el valor booleano del ref interno recorder.isRecording
const isRecordingComputed = computed(() => {
  return recorder ? recorder.isRecording.value : false;
});

/* ----------------- Firestore: Suscripción a grabaciones ----------------- */
function subscribeToRecordings() {
  if (unsubscribeFn) unsubscribeFn(); // Cancelamos suscripción previa
  if (!currentUserUid) return;

  const db = getFirestore();
  const colRef = collection(db, "recordings");
  const qRef = query(
    colRef,
    where("userId", "==", currentUserUid),
    orderBy("createdAt", "desc")
  );

  unsubscribeFn = onSnapshot(
    qRef,
    (snapshot) => {
      recordings.value = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          statusLabel: "Subida",
          statusType: "ready",
          ...data,
        };
      });
    },
    (err) => {
      console.error("onSnapshot error =>", err);
    }
  );
}

/* ----------------- Logout y Navegación ----------------- */
const { logout } = useAuth();
const router = useRouter();

async function handleLogout() {
  try {
    await logout();
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
  }
}

/* ----------------- Funciones de interacción ----------------- */
function goToRecording(record) {
  // Aquí podrías redirigir a una vista de detalle de la grabación
  alert(`Detalle de la grabación: ${record.title}`);
}

async function toggleRecordingWrapper() {
  if (!recorder) {
    console.warn("No se ha instanciado el recorder porque no hay uid.");
    return;
  }

  // Si no está grabando, inicia; de lo contrario, detiene la grabación
  if (!recorder.isRecording.value) {
    await recorder.toggleRecording();
  } else {
    const result = await recorder.toggleRecording();
    if (result && result.id && result.downloadURL) {
      // Agregamos la grabación a la lista para mostrarla inmediatamente
      recordings.value.unshift({
        id: result.id,
        title: `Grabación ${new Date().toLocaleString()}`,
        downloadURL: result.downloadURL,
        statusLabel: "Subida",
        statusType: "ready",
      });
    }
  }
}
</script>

<style scoped>
.text-neon-pink {
  color: #ff00b3;
}
</style>
