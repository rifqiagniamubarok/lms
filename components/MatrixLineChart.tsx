import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface MatrixLineChartProps {
  matrix: Array<{
    levelId: number;
    levelName: string;
    data: Array<{
      classId: number;
      className: string;
      count: number;
    }>;
  }>;
}

const MatrixLineChart: React.FC<MatrixLineChartProps> = ({ matrix }) => {
  if (!matrix || matrix.length === 0) return <div>Tidak ada data matriks</div>;

  // X: Level, Y: Count, Multiple lines: Class
  const classNames = matrix[0].data.map((c) => c.className);
  // Dashboard-matching color palette (blue, green, purple)
  const palette = [
    '#2563eb', // blue-600
    '#22c55e', // green-500
    '#a21caf', // purple-700
    '#f59e42', // orange-400
    '#e11d48', // rose-600
    '#0ea5e9', // sky-500
  ];
  const datasets = classNames.map((className, idx) => ({
    label: className,
    data: matrix.map((level) => level.data[idx]?.count ?? 0),
    fill: false,
    borderColor: palette[idx % palette.length],
    backgroundColor: palette[idx % palette.length],
    pointBackgroundColor: '#fff',
    pointBorderColor: palette[idx % palette.length],
    pointRadius: 5,
    pointHoverRadius: 7,
    borderWidth: 3,
    tension: 0.4,
  }));

  const data = {
    labels: matrix.map((level) => level.levelName),
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#334155', // slate-700
          font: { size: 13, family: 'inherit', weight: 'bold' as const },
          boxWidth: 18,
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        caretSize: 7,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Jumlah Penyelesaian', color: '#64748b', font: { size: 13 } },
        ticks: { color: '#64748b', font: { size: 12 } },
        grid: { color: '#e5e7eb' },
      },
      x: {
        title: { display: true, text: 'Level', color: '#64748b', font: { size: 13 } },
        ticks: { color: '#64748b', font: { size: 12 } },
        grid: { color: '#f1f5f9' },
      },
    },
    layout: { padding: 16 },
  };

  return <Line data={data} options={options} />;
};

export default MatrixLineChart;
