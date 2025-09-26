import React, { useState } from 'react';

const Login = () => {
  const [usuario, setUsuario] = useState({
    email: "",
    password: ""
  });

  const manejarCambio = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log("Usuario:", usuario);
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={manejarEnvio} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input 
            type="email" 
            name="email"
            value={usuario.email}
            onChange={manejarCambio}
            className="form-control"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
          <input 
            type="password" 
            name="password"
            value={usuario.password}
            onChange={manejarCambio}
            className="form-control"
            placeholder="Contraseña"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Iniciar Sesión
        </button>
      </form>
      <div className="mt-3">
        <p><strong>Datos ingresados:</strong></p>
        <p>Email: {usuario.email}</p>
        <p>Contraseña: {usuario.password}</p>
      </div>
    </div>
  );
}

export default Login;