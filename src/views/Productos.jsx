import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseConfig";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categories");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: null,
    stock: null,
    categoria: "",
    imagen: "", // ✅ CAMPO IMAGEN AGREGADO
  });

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  // DIAGNÓSTICO: Agregar console.log para ver el estado
  console.log("🎯 RENDER - Estado de categorías:", categorias);
  console.log("🎯 RENDER - Número de categorías:", categorias.length);

  const manejoCambioInputEditar = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" ? Number(value) || 0 : value,
    }));
  };

  const manejarEditar = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEditar(true);
  };

  const editarProducto = async () => {
    if (
      !productoEditado?.nombre ||
      !productoEditado?.descripcion ||
      !productoEditado?.precio ||
      !productoEditado?.stock ||
      !productoEditado?.categoria
    ) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }
    setMostrarModalEditar(false);
    try {
      const productoRef = doc(db, "productos", productoEditado.id);
      await updateDoc(productoRef, {
        nombre: productoEditado.nombre,
        descripcion: productoEditado.descripcion,
        precio: productoEditado.precio,
        stock: productoEditado.stock,
        categoria: productoEditado.categoria,
        imagen: productoEditado.imagen // ✅ IMAGEN INCLUIDA EN ACTUALIZACIÓN
      });
      cargarProductos();
      setProductoEditado(null);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al actualizar el producto: " + error.message);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" ? Number(value) || 0 : value,
    }));
  };

  const agregarProducto = async () => {
    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.descripcion ||
      !nuevoProducto.precio ||
      !nuevoProducto.stock ||
      !nuevoProducto.categoria
    ) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
    setMostrarModal(false);
    try {
      await addDoc(productosCollection, nuevoProducto);
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: null,
        stock: null,
        categoria: "",
        imagen: "", // ✅ IMAGEN INCLUIDA EN RESET
      });
      cargarProductos();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Error al agregar el producto: " + error.message);
    }
  };

  const cargarProductos = async () => {
    try {
      const consulta = await getDocs(productosCollection);
      const datosProductos = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(datosProductos);
      setProductosFiltrados(datosProductos);
      console.log("✅ Productos cargados:", datosProductos.length);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const consulta = await getDocs(categoriasCollection);
      const datosCategorias = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(datosCategorias);
      console.log("✅ Categorías cargadas:", datosCategorias);
      console.log("📊 Número de categorías:", datosCategorias.length);
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
    }
  };

  const manejarEliminar = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      const productoRef = doc(db, "productos", productoAEliminar.id);
      await deleteDoc(productoRef);
      cargarProductos();
      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Error al eliminar el producto: " + error.message);
    }
  };

  useEffect(() => {
    console.log("🚀 INICIANDO CARGA DE DATOS...");
    cargarProductos();
    cargarCategorias();
  }, []);

  // DIAGNÓSTICO: Monitorear cambios en categorías
  useEffect(() => {
    console.log("🔄 CATEGORÍAS ACTUALIZADAS:", categorias);
  }, [categorias]);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = productos.filter((producto) => {
      const nombreCat =
        categorias.find((c) => c.id === producto.categoria)?.nombre || "";
      return (
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto) ||
        nombreCat.toLowerCase().includes(texto) ||
        producto.precio.toString().includes(texto) ||
        producto.stock.toString().includes(texto)
      );
    });
    setProductosFiltrados(filtrados);
  };

  return (
    <div style={{ 
      width: '95vw', 
      minHeight: '100vh',
      padding: '2rem',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      {/* TÍTULO */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontWeight: 'bold', margin: 0, fontSize: '1.5rem' }}>Gestión de Productos</h4>
      </div>
      
      {/* BOTÓN Y BÚSQUEDA */}
      <Row style={{ marginBottom: '2rem', width: '100%' }}>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            onClick={() => setMostrarModal(true)}
            style={{ width: "100%", padding: '10px' }}
          >
            Agregar Producto
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
        width: '100%', 
        overflowX: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: 'white'
      }}>
        <TablaProductos
          productos={productosFiltrados}
          categorias={categorias}
          manejarEliminar={manejarEliminar}
          manejarEditar={manejarEditar}
        />
      </div>

      {/* MODALES */}
      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEliminacionProducto
        mostrarModalEliminar={mostrarModalEliminar}
        setMostrarModalEliminar={setMostrarModalEliminar}
        productoAEliminar={productoAEliminar}
        eliminarProducto={eliminarProducto}
      />

      <ModalEdicionProducto
        mostrarModalEditar={mostrarModalEditar}
        setMostrarModalEditar={setMostrarModalEditar}
        productoEditado={productoEditado}
        manejoCambioInputEditar={manejoCambioInputEditar}
        editarProducto={editarProducto}
        categorias={categorias}
      />
    </div>
  );
};

export default Productos;