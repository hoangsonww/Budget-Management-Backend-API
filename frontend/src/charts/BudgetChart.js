import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BudgetChart({ budgets }) {
  const data = {
    labels: budgets.map(b => b.name),
    datasets: [
      {
        label: 'Budget Limit',
        data: budgets.map(b => b.limit),
        backgroundColor: 'rgba(139,69,19,0.7)'
      }
    ]
  };

  return <Bar data={data} />;
}

export default BudgetChart;
