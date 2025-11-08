// src/components/estadisticas/GraficoProductos.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoProductos = ({ nombres = [], precios = [] }) => {
  // Configuración tamaño PERFECTO
  const data = {
    labels: nombres.length > 0 ? nombres : ['¿Cabezas?', '¿Cabezas?', '¿Cabezas?', '¿Cabezas?', '¿Cabezas?'],
    datasets: [
      {
        label: 'Precios de Productos',
        data: precios.length > 0 ? precios : [80, 60, 40, 20, 10],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        barThickness: 45, // ← PERFECTO: bien visible pero no exagerado
        borderRadius: 4, // ← Esquinas redondeadas
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ← Control manual del tamaño
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 16, // ← Bien legible
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Gráfico Productos',
        font: {
          size: 20, // ← Título prominente
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
          font: {
            size: 14 // ← Números bien visibles
          },
          padding: 10
        },
        title: {
          display: true,
          text: 'Precios de Productos',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 15
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        }
      },
      x: {
        ticks: {
          font: {
            size: 14, // ← Texto bien legible
            weight: 'bold'
          },
          padding: 10
        },
        title: {
          display: true,
          text: 'Productos',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 15
        },
        grid: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 15,
        right: 15
      }
    }
  };

  return (
    <Card style={{ 
      border: '2px solid #dee2e6', 
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      height: '450px' // ← Altura perfecta
    }}>
      <Card.Body style={{ 
        padding: '25px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ flex: 1 }}>
          <Bar data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default GraficoProductos;