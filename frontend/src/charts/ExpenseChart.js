import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function ExpenseChart({ expenses, budgetMap }) {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  // Sort expenses by date
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Create a numeric index for each expense
  const dataPoints = sortedExpenses.map((e, i) => ({
    x: i + 1,
    y: e.amount,
  }));

  const scatterData = {
    datasets: [
      {
        label: 'Expenses over time (Scatter)',
        data: dataPoints,
        backgroundColor: 'rgba(139,69,19,0.7)',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: 'Expenses plotted as points over time',
        color: textColor,
      },
      tooltip: {
        titleColor: textColor,
        bodyColor: textColor,
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Expense Index (Chronological)',
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Expense Amount',
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  return (
    <div style={{ height: '250px' }}>
      <Scatter data={scatterData} options={options} />
    </div>
  );
}

export default ExpenseChart;
