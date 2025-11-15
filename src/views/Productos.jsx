import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseConfig";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

// ✅ NUEVAS IMPORTACIONES PARA REPORTES
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    imagen: "",
  });

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  // ✅ MÉTODO PARA GENERAR PDF
  const generarPDFProductos = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');

    // Título del documento
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Reporte de Productos", 105, 18, { align: 'center' });

    // Información de la empresa
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Ferretería Más Cargada Poderosa", 14, 40);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 48);

    // Encabezados de la tabla
    const headers = [['ID', 'Nombre', 'Categoría', 'Precio ($)', 'Stock', 'Descripción']];

    // Datos de la tabla - usar productosFiltrados si hay búsqueda, sino todos los productos
    const datosParaReporte = productosFiltrados.length > 0 ? productosFiltrados : productos;
    
    const data = datosParaReporte.map(producto => [
      producto.id?.substring(0, 8) || 'N/A',
      producto.nombre || 'Sin nombre',
      categorias.find(cat => cat.id === producto.categoria)?.nombre || 'Sin categoría',
      `$${parseFloat(producto.precio || 0).toFixed(2)}`,
      producto.stock || 0,
      producto.descripcion?.substring(0, 30) + (producto.descripcion?.length > 30 ? '...' : '') || 'Sin descripción'
    ]);

    // Generar tabla
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 55,
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 55 }
    });

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Guardar el documento
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Productos_${fecha}.pdf`;
    doc.save(nombreArchivo);
  };

  // ✅ MÉTODO PARA GENERAR EXCEL
  const exportarExcelProductos = () => {
    // Usar productos filtrados si hay búsqueda, sino todos los productos
    const datosParaReporte = productosFiltrados.length > 0 ? productosFiltrados : productos;
    
    // Estructura de los datos
    const datosExcel = datosParaReporte.map(producto => ({
      'ID': producto.id?.substring(0, 8) || 'N/A',
      'Nombre': producto.nombre || 'Sin nombre',
      'Categoría': categorias.find(cat => cat.id === producto.categoria)?.nombre || 'Sin categoría',
      'Precio': parseFloat(producto.precio || 0),
      'Stock': producto.stock || 0,
      'Descripción': producto.descripcion || 'Sin descripción'
    }));

    // Crear hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    
    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    // Configurar anchos de columnas
    const columnWidths = [
      { wch: 12 }, // ID
      { wch: 25 }, // Nombre
      { wch: 20 }, // Categoría
      { wch: 12 }, // Precio
      { wch: 8 },  // Stock
      { wch: 40 }  // Descripción
    ];
    worksheet['!cols'] = columnWidths;

    // Generar archivo binario
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Crear blob y guardar
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Productos_${fecha}.xlsx`;
    saveAs(data, nombreArchivo);
  };

  // El resto de tu código permanece igual...
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
        imagen: productoEditado.imagen
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
        imagen: "",
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
      
      {/* ✅ BOTONES ACTUALIZADOS CON REPORTES */}
      <Row style={{ marginBottom: '2rem', width: '100%' }}>
        <Col lg={2} md={4} sm={6} xs={12} className="mb-2">
          <Button
            onClick={() => setMostrarModal(true)}
            variant="primary"
            style={{ width: "100%", padding: '10px' }}
          >
            ➕ Agregar
          </Button>
        </Col>

        {/* ✅ NUEVO BOTÓN PDF */}
        <Col lg={2} md={4} sm={6} xs={12} className="mb-2">
          <Button
            onClick={generarPDFProductos}
            variant="danger"
            style={{ width: "100%", padding: '10px' }}
          >
            📊 Generar PDF
          </Button>
        </Col>

        {/* ✅ NUEVO BOTÓN EXCEL */}
        <Col lg={2} md={4} sm={6} xs={12} className="mb-2">
          <Button
            onClick={exportarExcelProductos}
            variant="success"
            style={{ width: "100%", padding: '10px' }}
          >
            📈 Generar Excel
          </Button>
        </Col>

        {/* BÚSQUEDA */}
        <Col lg={6} md={12} sm={12} xs={12} className="mb-2">
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      {/* TABLA */}
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