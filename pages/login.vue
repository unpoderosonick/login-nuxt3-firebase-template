<template>
  <div>
    <LoginForm />
  </div>
</template>
<script setup>
import LoginForm from "~/components/auth/LoginForm.vue";

// Asigna el middleware de redirección
definePageMeta({
  middleware: "auth",
});
</script>
