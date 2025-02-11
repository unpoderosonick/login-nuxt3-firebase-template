// composables/useAuth.js

import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export function useAuth() {
  // Si estás en el servidor, no haces nada (igual que antes)
  if (!process.client) {
    return {
      login: () => {
        throw new Error("No disponible en SSR.");
      },
      register: () => {
        throw new Error("No disponible en SSR.");
      },
      logout: () => {
        throw new Error("No disponible en SSR.");
      },
      getUserData: () => {
        throw new Error("No disponible en SSR.");
      },
    };
  }

  // 1) Usar la instancia que inyectó tu plugin
  const { $auth, $db } = useNuxtApp();

  // 2) Tu lógica con la cookie
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  // 3) Router
  const router = useRouter();

  // 4) Funciones de login, registro, etc., usando $auth y $db
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      );
      token.value = await userCredential.user.getIdToken();
      router.push("/home");
      return userCredential.user;
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      );
      token.value = await userCredential.user.getIdToken();
      console.log("Usuario registrado:", userCredential.user);
      router.push("/home");
      return userCredential.user;
    } catch (error) {
      console.error("Error al registrar:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut($auth);
      token.value = null;
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    }
  };

  const getUserData = async (uid) => {
    try {
      // Fíjate que ahora usas $db
      const userDoc = await getDoc(doc($db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.error("No se encontró el documento del usuario.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error.message);
      throw error;
    }
  };

  return { login, register, logout, getUserData };
}
