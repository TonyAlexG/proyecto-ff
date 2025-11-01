import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Encabezado from "./components/Encabezado";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Productos from "./views/Productos";
import Catalogo from "./views/Catalogo";
import { useEffect } from "react";
import { db } from "./database/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

const App = () => {
  useEffect(() => {
    const probarFirebase = async () => {
      try {
        await addDoc(collection(db, 'prueba'), {
          mensaje: 'Conexión verificada - ' + new Date().toLocaleDateString(),
          fecha: new Date()
        });
        console.log('✅ Firebase conectado correctamente');
      } catch (error) {
        console.error('❌ Error Firebase:', error);
      }
    };
    probarFirebase();
  }, []);

  return (
    <Router>
      <Encabezado />
      <main className="margen-superior-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} /> {/* ← SOLO UNA VEZ */}
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;