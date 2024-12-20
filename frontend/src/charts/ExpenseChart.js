import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ExpenseChart({ expenses, budgetMap }) {
  // We want a line chart showing expenses over time per budget
  // Group expenses by date and budget
  const expensesByBudgetDate = {};

  expenses.forEach(e => {
    const date = (new Date(e.createdAt)).toLocaleDateString();
    if(!expensesByBudgetDate[e.budgetId]) expensesByBudgetDate[e.budgetId] = {};
    expensesByBudgetDate[e.budgetId][date] = (expensesByBudgetDate[e.budgetId][date]||0)+e.amount;
  });

  // Get all dates sorted
  const allDatesSet = new Set();
  Object.values(expensesByBudgetDate).forEach(bMap=>{
    Object.keys(bMap).forEach(d=>allDatesSet.add(d));
  });
  const allDates = Array.from(allDatesSet).sort((a,b)=>(new Date(a)-new Date(b)));

  // Create dataset for each budget line
  const datasets = Object.keys(expensesByBudgetDate).map(bid=>{
    return {
      label: budgetMap[bid] || 'Unknown Budget',
      data: allDates.map(d=>expensesByBudgetDate[bid][d]||0),
      borderColor:`rgba(139,69,19,${Math.random()*0.5+0.5})`,
      backgroundColor:'rgba(139,69,19,0.3)',
      tension:0.3
    }
  });

  const data = {
    labels: allDates,
    datasets
  };

  return <Line data={data} />;
}

export default ExpenseChart;
