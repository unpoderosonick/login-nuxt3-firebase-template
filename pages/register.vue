<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white">
    <div class="w-full max-w-sm p-8 bg-white shadow-lg rounded-xl">
      <h1 class="mb-6 text-2xl font-semibold text-center text-gray-800">
        Crear Cuenta
      </h1>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label
            for="firstName"
            class="block pb-2 text-sm font-medium text-gray-600">
            Primer Nombre
          </label>
          <input
            id="firstName"
            type="text"
            v-model="firstName"
            required
            placeholder="Tu nombre"
            class="input-primary" />
        </div>

        <div>
          <label for="language" class="block text-sm font-medium text-gray-600">
            Idioma
          </label>

          <select
            id="language"
            v-model="language"
            required
            class="select-primary">
            <option value="" disabled>Selecciona un idioma</option>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>

        <div>
          <label
            for="email"
            class="block pb-2 text-sm font-medium text-gray-600">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="Correo electrónico"
            class="input-primary" />
        </div>

        <div>
          <label
            for="password"
            class="block pb-2 text-sm font-medium text-gray-600">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="Contraseña"
            class="input-primary" />
        </div>

        <div>
          <label
            for="phone"
            class="block pb-2 text-sm font-medium text-gray-600">
            Número de Celular
          </label>
          <input
            id="phone"
            type="tel"
            v-model="phone"
            required
            placeholder="+51 987654321"
            class="input-primary" />
        </div>

        <div>
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="acceptPrivacyPolicy"
              required
              class="w-4 h-4" />
            <span class="text-sm text-gray-600">
              Acepto la
              <a href="#" class="text-gray-600 underline hover:underline"
                >Política de Privacidad</a
              >
            </span>
          </label>
        </div>

        <div>
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="acceptMarketing" class="w-4 h-4" />
            <span class="text-sm text-gray-600">
              Acepto el
              <a href="#" class="text-gray-600 underline hover:underline"
                >Tratamiento de datos
              </a>
            </span>
          </label>
        </div>

        <button type="submit" class="w-full font-medium btn-primary">
          Crear Cuenta
        </button>
      </form>
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          ¿Ya tienes una cuenta?
          <a
            href="#"
            @click.prevent="redirectToLogin"
            class="text-gray-600 underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Datos reactivos
const email = ref(""); // Correo electrónico
const password = ref(""); // Contraseña
const firstName = ref(""); // Primer nombre
const language = ref(""); // Idioma preferido
const phone = ref(""); // Número de celular
const acceptPrivacyPolicy = ref(false); // Aceptación de la política de privacidad
const acceptMarketing = ref(false); // Aceptación de recibir publicidad

// Router
const router = useRouter();

// Lógica del registro
const handleRegister = async () => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // Actualiza el perfil del usuario con el nombre
    await updateProfile(userCredential.user, {
      displayName: firstName.value,
    });

    // Guarda la información adicional en Firestore
    const db = getFirestore();
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      email: email.value,
      firstName: firstName.value,
      phone: phone.value,
      language: language.value,
      acceptPrivacyPolicy: acceptPrivacyPolicy.value,
      acceptMarketing: acceptMarketing.value,
      createdAt: new Date().toISOString(),
    });

    alert("¡Cuenta creada exitosamente!");

    // Redirige al login después del registro exitoso
    router.push("/login");
  } catch (error) {
    console.error("Error al registrar:", error);
    alert(
      "Hubo un error al registrar la cuenta. Por favor, intenta nuevamente."
    );
  }
};

// Redirige al login
const redirectToLogin = () => {
  router.push("/login");
};
</script>
