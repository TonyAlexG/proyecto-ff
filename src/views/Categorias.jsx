import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseConfig";
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import TablaCategorias from "../components/categories/TablaCategorias";
import ModalRegistroCategoria from "../components/categories/ModalRegistroCategoria";
import ModalEliminacionCategoria from "../components/categories/ModalEliminacionCategoria";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: ""
  });

  const categoriesCollection = collection(db, "categories");

  const cargarCategorias = async () => {
    try {
      const consulta = await getDocs(categoriesCollection);
      const datosCategorias = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(datosCategorias);
      setCategoriasFiltradas(datosCategorias);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = categories.filter(
      (categoria) =>
        categoria.nombre.toLowerCase().includes(texto) ||
        categoria.descripcion.toLowerCase().includes(texto)
    );
    setCategoriasFiltradas(filtradas);
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    setMostrarModal(false);

    try {
      await addDoc(categoriesCollection, nuevaCategoria);
      setNuevaCategoria({ nombre: "", descripcion: "" });
      cargarCategorias();
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      alert("Error al agregar la categoría: " + error.message);
    }
  };

  const eliminarCategoria = async () => {
    try {
      await deleteDoc(doc(db, "categories", categoriaAEliminar.id));
      setMostrarModalEliminar(false);
      setCategoriaAEliminar(null);
      cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const manejarEliminar = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminar(true);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh',
      padding: '2rem',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      {/* TÍTULO */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontWeight: 'bold', margin: 0, fontSize: '1.5rem' }}>Gestión de Categorías</h4>
      </div>
      
      {/* BOTÓN Y BÚSQUEDA */}
      <Row style={{ marginBottom: '2rem', width: '100%' }}>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            onClick={() => setMostrarModal(true)}
            style={{ width: "100%", padding: '10px' }}
          >
            Agregar categoría
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      {/* TABLA - OCUPA TODO EL ANCHO */}
      <div style={{ 
        width: '95%', 
        overflowX: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: 'white'
      }}>
        <TablaCategorias 
          categories={categoriasFiltradas}
          manejarEliminar={manejarEliminar}
        />
      </div>

      {/* MODALES */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      <ModalEliminacionCategoria
        mostrarModalEliminar={mostrarModalEliminar}
        setMostrarModalEliminar={setMostrarModalEliminar}
        categoriaAEliminar={categoriaAEliminar}
        eliminarCategoria={eliminarCategoria}
      />
    </div>
  );
};

export default Categorias;