import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
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

  // Cargar categorías
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

  // Manejar cambios en la búsqueda
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

  // Manejar cambios en inputs
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agregar nueva categoría
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

  // Eliminar categoría
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

  // Manejar clic en botón eliminar
  const manejarEliminar = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminar(true);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <div className="p-4 container">
      {/* HEADER SIMPLE COMO EN LA IMAGEN */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Gestión de Categorías</h2>
          <p className="text-muted mb-0">Administra las categorías de productos</p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setMostrarModal(true)}
          className="px-4"
        >
          + Agregar categoría
        </Button>
      </div>

      {/* CUADRO DE BÚSQUEDA Y BOTÓN EN FILA */}
      <Row className="mb-3">
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={() => setMostrarModal(true)}
            style={{ width: "100%" }}
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

      {/* TABLA COMPACTA */}
      <Card className="border-0 container shadow-sm" style={{
        width: "100%"
      }}>
        <Card.Body className="p-0">
          <TablaCategorias 
            categories={categoriasFiltradas}
            manejarEliminar={manejarEliminar}
          />
        </Card.Body>
      </Card>

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