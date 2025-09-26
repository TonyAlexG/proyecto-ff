import React, { useState } from 'react';

const Inicio = () => {
  const [contador, setContador] = useState(0);

  return (
    <div className="container mt-4">
      <h2>Página de Inicio</h2>
      <div className="card p-4">
        <p className="h4">Contador: {contador}</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => setContador(contador + 1)}
        >
          Incrementar (+1)
        </button>
        <button 
          className="btn btn-danger mt-2 ms-2"
          onClick={() => setContador(0)}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}

export default Inicio;