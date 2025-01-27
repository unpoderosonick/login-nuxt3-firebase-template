import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

  const token = useCookie("auth_token");
  const auth = getAuth();
  const db = getFirestore();

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      token.value = await userCredential.user.getIdToken();
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
