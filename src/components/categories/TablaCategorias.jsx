import React from "react";
import { Table } from "react-bootstrap";

const TablaCategorias = ({ categories, manejarEliminar }) => {
  // ✅ Si NO hay categorías, mostrar mensaje
  if (!categories || categories.length === 0) {
    return <p>No hay categorías disponibles. Crea algunas categorías primero.</p>;
  }

  // ✅ Si HAY categorías, mostrar la tabla
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((categoria) => (
          <tr key={categoria.id}>
            <td>{categoria.nombre}</td>
            <td>{categoria.descripcion}</td>
            <td>
              <button 
                onClick={() => manejarEliminar(categoria)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCategorias;