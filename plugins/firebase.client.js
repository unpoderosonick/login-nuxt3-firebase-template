// plugins/firebase.client.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default defineNuxtPlugin(() => {
  // Verifica que estamos en el lado del cliente
  if (!process.client) return;

  // Tomamos la configuración desde runtimeConfig
  const config = useRuntimeConfig();

  // Estructura de tu config: config.public.firebase = { ... }
  const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
    measurementId: config.public.firebase.measurementId,
  };

  // Inicializamos la app de Firebase con la config
  const app = initializeApp(firebaseConfig);

  // Instanciamos los servicios que necesites
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Retornamos para poder acceder vía useNuxtApp().$auth, etc.
  return {
    provide: {
      firebase: app, // opcional si quieres referirte a la instancia
      auth, // -> $auth
      db, // -> $db
      storage, // -> $storage
    },
  };
});
