export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return; // Middleware no se ejecuta en el servidor

  const token = useCookie("auth_token");

  // Redirige a /login si no hay token y está intentando acceder a una página protegida
  if (!token.value && to.path !== "/login" && to.path !== "/register") {
    return navigateTo("/login");
  }

  // Redirige a /home si ya está autenticado y está intentando acceder a /login o /register
  if (token.value && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/home");
  }
});
