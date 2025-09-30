import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { db } from "../database/firebaseConfig";  
import { collection, getDocs } from "firebase/firestore";
import TablaCategorias from "../components/categories/TablaCategorias";

const Categorias = () => {
  const [categories, setCategories] = useState([]);

  const categoriesCollection = collection(db, "categories");

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

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Gestión de Categorías</h4>
      <TablaCategorias categories={categories} />
    </Container>
  );
};

export default Categorias;