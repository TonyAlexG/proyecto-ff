import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA13KmYQvGHpSlzu7tVEJCuYn9YyHep_Hg",
  authDomain: "proyectotony-4d16a.firebaseapp.com",
  projectId: "proyectotony-4d16a",
  storageBucket: "proyectotony-4d16a.firebasestorage.app",
  messagingSenderId: "916609964501",
  appId: "1:916609964501:web:47de47ee51fcdfefbe055c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;