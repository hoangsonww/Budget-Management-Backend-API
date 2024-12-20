import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BudgetChart({ budgets }) {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  const data = {
    labels: budgets.map(b => b.name),
    datasets: [
      {
        label: 'Budget Limit',
        data: budgets.map(b => b.limit),
        backgroundColor: 'rgba(139,69,19,0.7)',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: 'Budgets',
        color: textColor,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        title: {
          display: false,
          color: textColor,
        },
      },
      y: {
        ticks: {
          color: textColor,
        },
        title: {
          display: false,
          color: textColor,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default BudgetChart;
