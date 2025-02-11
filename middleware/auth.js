// middleware/auth.js
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importar getAuth y onAuthStateChanged

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;

  const auth = getAuth(); // Usar getAuth para obtener la instancia de autenticación
  const token = useCookie("auth_token");

  // Esperar a que Firebase verifique el estado de autenticación
  await new Promise((resolve) => onAuthStateChanged(auth, resolve));

  // Si no hay token ni usuario autenticado, redirigir a /login
  if (
    !token.value &&
    !auth.currentUser &&
    to.path !== "/login" &&
    to.path !== "/register"
  ) {
    return navigateTo("/login");
  }

  // Si hay token o usuario autenticado y se intenta acceder a /login o /register, redirigir a /home
  if (
    (token.value || auth.currentUser) &&
    (to.path === "/login" || to.path === "/register")
  ) {
    return navigateTo("/home");
  }
});
