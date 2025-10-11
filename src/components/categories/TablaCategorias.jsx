import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaCategorias = ({ categories, manejarEliminar }) => {
  return (
    <Table striped hover className="mb-0">
      <thead className="bg-light">
        <tr>
          <th className="py-2 border-0">Nombre</th>
          <th className="py-2 border-0">Descripción</th>
          <th className="py-2 border-0 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((categoria) => (
          <tr key={categoria.id}>
            <td className="py-2 align-middle border-0">
              {categoria.nombre}
            </td>
            <td className="py-2 align-middle border-0">{categoria.descripcion}</td>
            <td className="py-2 align-middle border-0 text-center">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => manejarEliminar(categoria)}
                className="px-3"
              >
                🗑️
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCategorias;