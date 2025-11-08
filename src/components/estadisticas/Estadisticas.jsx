// src/components/estadisticas/Estadisticas.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../database/firebaseConfig';
import GraficoProductos from './GraficoProductos';

const Estadisticas = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productosCollection = collection(db, 'productos');
    
    const unsubscribe = onSnapshot(
      productosCollection,
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(fetchedProducts);
        setLoading(false);
      },
      (error) => {
        console.error('Error al cargar productos:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Preparar datos
  const nombres = productos.map(producto => producto.nombre);
  const precios = productos.map(producto => parseFloat(producto.precio));

  // Datos de ejemplo como en el documento
  const datosFinales = nombres.length > 0 ? { nombres, precios } : {
    nombres: ['¿Cabezas?', '¿Cabezas?', '¿Cabezas?', '¿Cabezas?', '¿Cabezas?'],
    precios: [80, 60, 40, 20, 10]
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '1400px' }}>
      {/* Encabezado con tamaño PERFECTO */}
      <div className="text-center mb-5">
        <h4 className="mb-4" style={{ 
          fontSize: '32px', // ← Título grande y prominente
          fontWeight: 'bold',
          color: '#2c3e50',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          📊 Estadísticas
        </h4>
        
        <div className="bg-light p-4 rounded border" style={{
          border: '2px solid #ced4da',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h5 className="mb-0" style={{ 
            color: '#495057',
            fontSize: '20px', // ← Texto bien legible
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            Ferretería Más Cargada Poderosa Cabeza Lleva Gran Presentación Estadística Completiva
          </h5>
        </div>
      </div>

      {/* Gráfico con tamaño PERFECTO */}
      <Row className="justify-content-center">
        <Col xs={12} lg={9} xl={8}> {/* ← Ancho perfecto: 75% en desktop */}
          <GraficoProductos 
            nombres={datosFinales.nombres} 
            precios={datosFinales.precios} 
          />
        </Col>
      </Row>

      {/* Pie de página con tamaño PERFECTO */}
      <div className="mt-5 p-3 bg-light rounded text-center border" style={{
        border: '2px solid #ced4da'
      }}>
        <p className="mb-0 fst-italic" style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#495057'
        }}>
          Tony Gomez
        </p>
      </div>
    </Container>
  );
};

export default Estadisticas;