<template>
  <!-- Si la info del usuario sigue cargando -->
  <div
    v-if="isLoading"
    class="flex items-center justify-center h-screen text-center text-white bg-black">
    <p class="text-lg">Cargando...</p>
  </div>

  <!-- Pantalla principal: estilo cyberpunk -->
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

    <!-- Header: Título y botón “JP” -->
    <HeaderCyberpunk @toggleMenu="toggleSideMenu" />

    <!-- Menú Lateral (SideMenuCyberpunk) -->
    <SideMenuCyberpunk
      :showMenu="showSideMenu"
      @close="toggleSideMenu"
      @logout="handleLogout" />

    <!-- Contenido principal, z-0 para que el botón flotante se superponga -->
    <main class="relative z-0 flex-1 px-4 pt-4 pb-20">
      <!-- Saludo con userName (Firebase Auth) -->
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

        <!-- Cada grabación se muestra en un RecordingCard -->
        <RecordingCard
          v-for="record in filteredRecordings"
          :key="record.id"
          :title="record.title"
          :statusLabel="record.statusLabel"
          :statusType="record.statusType"
          @select="goToRecording(record)" />
      </section>
    </main>

    <!-- Botón flotante para grabar (z-50 para quedar sobre el contenido) -->
    <div class="absolute z-50 bottom-16 right-6">
      <FloatingRecordButton
        :isRecording="isRecording"
        @record="toggleRecording" />
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

// Nuestro composable de grabación
import { useRecorder } from "~/composables/useRecorder.js";

// Componentes
import HeaderCyberpunk from "~/components/HeaderCyberpunk.vue";
import SideMenuCyberpunk from "~/components/SideMenuCyberpunk.vue";
import SearchBarCyberpunk from "~/components/SearchBarCyberpunk.vue";
import RecordingCard from "~/components/RecordingCard.vue";
import FloatingRecordButton from "~/components/FloatingRecordButton.vue";

// Proteger la ruta con middleware "auth"
definePageMeta({ middleware: "auth" });

// Control del menú lateral
const showSideMenu = ref(false);
function toggleSideMenu() {
  showSideMenu.value = !showSideMenu.value;
}

// Estado de carga + nombre del usuario
const isLoading = ref(true);
const userName = ref("Usuario desconocido");
let currentUserUid = null;

// Al montar, verificamos la autenticación
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || user.email || "Usuario";
      currentUserUid = user.uid;
    } else {
      userName.value = "Invitado";
    }
    isLoading.value = false;
  });
});

// Logout
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

// Búsqueda y almacenamiento local de grabaciones
const searchTerm = ref("");
const recordings = ref([]);

// Filtrar por título
const filteredRecordings = computed(() => {
  if (!searchTerm.value) return recordings.value;
  return recordings.value.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Navegar a vista de detalle (opcional, no implementado aquí)
function goToRecording(record) {
  alert(`Abrir detalle de: ${record.title}`);
  // router.push(`/recording/${record.id}`)
}

// ========== LÓGICA DE GRABACIÓN (COMPOSABLE) ==========

// Pasamos el userId (opcional) para que se guarde en Firestore
const { isRecording, startRecording, stopRecording, toggleRecording } =
  useRecorder(currentUserUid);

// Reemplazamos la función toggleRecording para “inyectar” la parte
// donde añadimos la nueva grabación localmente cuando termina
async function toggleRecordingOverride() {
  // Llamamos a la función original
  await toggleRecording();

  // Si paramos la grabación, "onRecordingStop" se dispara en el composable,
  // sube el archivo, crea doc en Firestore y retorna { id, downloadURL }.
  // Para capturar eso, podemos interceptar la promesa en "stopRecording"
  // y retornarla. Sin embargo, MediaRecorder "stop" es un evento asíncrono.

  // Una forma es sobrescribir "stopRecording" en el composable para que
  // retorne la data. O "emitir" un custom event.
  // Con la API actual, "onRecordingStop" no expone un callback.
  // Para hacerlo simple, podemos "escuchar" un event en el composable
  // o meter la lógica aquí.
  // => EJEMPLO rápido: Forzamos un setTimeout y consultamos Firestore
  // a posteriori. (No ideal, pero demostratvo.)
}

// En este ejemplo, para no complicar,
// usaremos "toggleRecording" tal cual, sin interceptar.
// **Si** quieres ver la nueva grabación al instante,
// lo ideal es "emitir" un custom event cuando se cree el doc en Firestore
// o hacer un "setInterval" para re-consultar las grabaciones.

// Por simplicidad, lo dejaremos así.
// De todas formas, "toggleRecording"
// ya sube la grabación y crea el doc.

// Reemplaza en el template:
function toggleRecordingWrapper() {
  toggleRecordingOverride();
}
</script>

<style scoped>
.text-neon-pink {
  color: #ff00b3;
}
</style>
