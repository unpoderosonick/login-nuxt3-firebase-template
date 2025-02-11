<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white">
    <div class="w-full max-w-sm p-8 bg-white shadow-lg rounded-xl">
      <h1 class="mb-6 text-2xl font-semibold text-center text-gray-800">
        Iniciar Sesión
      </h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="relative">
          <label
            for="email"
            class="block pb-2 text-sm font-semibold text-gray-600"
            >Correo</label
          >
          <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="ejemplo@correo.com"
            class="input-primary" />
        </div>

        <div>
          <label
            for="password"
            class="block pb-2 text-sm font-semibold text-gray-600"
            >Contraseña</label
          >
          <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="••••••••"
            class="input-primary" />
        </div>

        <button type="submit" class="w-full font-medium btn-primary">
          Iniciar Sesión
        </button>
      </form>

      <p class="mt-4 text-sm text-center text-gray-600">
        ¿No tienes una cuenta?
        <a href="/register" class="text-gray-800 hover:underline">Regístrate</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useNuxtApp } from "#app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";

const email = ref("");
const password = ref("");

const { $auth } = useNuxtApp(); // <-- Aquí obtienes la instancia inyectada

async function handleSubmit() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    console.log("Usuario logeado:", userCredential.user);
    // Redirigir al usuario
    useRouter().push("/home");
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    alert("No se pudo iniciar sesión. Verifica tus credenciales.");
  }
}
</script>
