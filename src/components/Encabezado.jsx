import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ← Agregar Link aquí
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  return (
    <Navbar expand="md" fixed="top" className="bg-dark">
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion("/inicio")}
          className="text-white fw-bold"
          style={{ cursor: "pointer" }}
        >
          Ferretería
        </Navbar.Brand>
        
        <Navbar.Toggle
          aria-controls="menu-offcanvas"
          onClick={manejarToggle}
          className="bg-light"
        />
        
        <Navbar.Offcanvas
          id="menu-offcanvas"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú principal</Offcanvas.Title>
          </Offcanvas.Header>
          
          <Offcanvas.Body>
            <Nav className="flex-grow-1 pe-3">
              <Nav.Link onClick={() => manejarNavegacion("/inicio")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/categorias")}>Categorías</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/productos")}>Productos</Nav.Link> {/* ← Solo uno */}
              <Nav.Link onClick={() => manejarNavegacion("/catalogo")}>Catálogo</Nav.Link>
              {/* Elimina esta línea duplicada: <Nav.Link as={Link} to="/productos">Productos</Nav.Link> */}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;