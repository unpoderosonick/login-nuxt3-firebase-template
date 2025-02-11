// composables/useAuth.js
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export function useAuth() {
  if (!process.client) {
    return {
      login: () => {
        throw new Error("Auth no disponible en el servidor.");
      },
      register: () => {
        throw new Error("Auth no disponible en el servidor.");
      },
      logout: () => {
        throw new Error("Auth no disponible en el servidor.");
      },
      getUserData: () => {
        throw new Error("Firestore no disponible en el servidor.");
      },
    };
  }

  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: "lax",
  });
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      token.value = await userCredential.user.getIdToken();
      console.log("Usuario logeado:", userCredential.user);
      router.push("/home"); // Redirigir al home después del login
      return userCredential.user;
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      token.value = await userCredential.user.getIdToken();
      console.log("Usuario registrado y logeado:", userCredential.user);
      router.push("/home"); // Redirigir al home después del registro
      return userCredential.user;
    } catch (error) {
      console.error("Error al registrar:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      token.value = null;
      console.log("Usuario deslogueado");
      router.push("/login"); // Redirigir al login después del logout
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    }
  };

  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.error("No se encontró el documento del usuario.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error.message);
      throw error;
    }
  };

  return { login, register, logout, getUserData };
}
