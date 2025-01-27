<template>
  <div class="text-center mt-10">
    <h1 class="text-4xl font-bold">¡Bienvenido a Nuxt 3!</h1>
    <p class="text-lg mt-4">Tu configuración inicial está lista.</p>
    <nuxt-link to="/login" class="text-blue-500 underline">Ir al Login</nuxt-link>
  </div>
</template>


<script>
// Asignar middleware de autenticación
export default {
  middleware: "auth",
};
</script>