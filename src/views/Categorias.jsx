import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import TablaCategorias from "../components/categories/TablaCategorias";
import ModalRegistroCategoria from "../components/categories/ModalRegistroCategoria";

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
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
      console.log("Categorías cargadas desde Firestore:", datosCategorias);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
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
    // Validar campos requeridos
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    // Cerrar modal
    setMostrarModal(false);

    try {
      // Agregar a Firestore
      await addDoc(categoriesCollection, nuevaCategoria);

      // Limpiar campos del formulario
      setNuevaCategoria({ nombre: "", descripcion: "" });

      // Recargar categorías
      cargarCategorias();
      console.log("Categoría agregada exitosamente.");
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      alert("Error al agregar la categoría: " + error.message);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Gestión de Categorías</h4>
      
      {/* Botón para agregar categoría */}
      <Row>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button 
            className="mb-3"
            onClick={() => setMostrarModal(true)}
            style={{ width: "100%" }}
          >
            Agregar categoría
          </Button>
        </Col>
      </Row>

      {/* Modal de registro */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      {/* Tabla de categorías */}
      <TablaCategorias categories={categories} />
    </Container>
  );
};

export default Categorias;