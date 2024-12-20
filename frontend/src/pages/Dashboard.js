import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
import api from '../services/api';

import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const fetchData = async() => {
      setLoading(true);
      try {
        const [bRes, eRes, uRes] = await Promise.all([
          api.get('/api/budgets'),
          api.get('/api/expenses'),
          api.get('/api/users'),
        ]);
        setBudgets(bRes.data);
        setExpenses(eRes.data.expenses || []);
        setUsers(uRes.data || []);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[]);

  const totalBudgets = budgets.length;
  const totalUsers = users.length;
  const totalExpenses = expenses.length;
  const totalBudgetLimit = budgets.reduce((sum,b)=>sum+b.limit,0);

  // Map budgets
  const budgetMap = {};
  budgets.forEach(b=>{ budgetMap[b._id]=b.name; });

  // Expenses by budget
  const expensesByBudget = expenses.reduce((acc,e)=>{
    acc[e.budgetId] = (acc[e.budgetId]||0)+e.amount;
    return acc;
  },{});

  // Chart: Top 5 budgets by limit (Bar)
  const topBudgets = [...budgets].sort((a,b)=>b.limit - a.limit).slice(0,5);
  const barData = {
    labels: topBudgets.map(b=>b.name),
    datasets: [
      {
        label:'Budget Limit',
        data: topBudgets.map(b=>b.limit),
        backgroundColor:'rgba(139,69,19,0.7)'
      }
    ]
  };

  // Expense Distribution by Budget (Pie)
  const expenseLabels = Object.keys(expensesByBudget).map(id=>budgetMap[id]||id);
  const pieData = {
    labels: expenseLabels,
    datasets: [
      {
        label:'Expenses',
        data:Object.values(expensesByBudget),
        backgroundColor:['#D2B48C', '#DEB887', '#F4A460', '#CD853F', '#A0522D', '#8B4513']
      }
    ]
  };

  // Line Chart: Expenses over time (assuming expenses have createdAt)
  // Group by date
  const expensesByDate = {};
  expenses.forEach(e=>{
    const d = (new Date(e.createdAt)).toLocaleDateString() || 'Unknown Date';
    expensesByDate[d] = (expensesByDate[d]||0)+ e.amount;
  });
  const sortedDates = Object.keys(expensesByDate).sort((a,b)=>(new Date(a)-new Date(b)));
  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label:'Daily Expense Total',
        data: sortedDates.map(d=>expensesByDate[d]),
        borderColor:'rgba(139,69,19,0.9)',
        backgroundColor:'rgba(139,69,19,0.3)',
        tension:0.3,
      }
    ]
  };

  // Another chart: Donut of top budgets by expense
  const topExpenseBudgets = Object.keys(expensesByBudget).sort((a,b)=>expensesByBudget[b]-expensesByBudget[a]).slice(0,5);
  const donutData = {
    labels: topExpenseBudgets.map(id=>budgetMap[id]||id),
    datasets: [
      {
        data: topExpenseBudgets.map(id=>expensesByBudget[id]),
        backgroundColor:['#8B4513','#A0522D','#CD853F','#F4A460','#DEB887']
      }
    ]
  };

  // Quick links as cards
  const links = [
    { label:'Budgets', to:'/budgets' },
    { label:'Expenses', to:'/expenses' },
    { label:'Users', to:'/users' },
    { label:'Profile', to:'/profile' },
  ];

  return (
    <Container sx={{ mt:4 }}>
      <LoadingOverlay loading={loading} />
      <Typography variant="h3" mb={4} sx={{ fontWeight:700 }}>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign:'center' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight:600 }}>{totalBudgets}</Typography>
              <Typography variant="body1">Total Budgets</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign:'center' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight:600 }}>{totalExpenses}</Typography>
              <Typography variant="body1">Total Expenses</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign:'center' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight:600 }}>{totalUsers}</Typography>
              <Typography variant="body1">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign:'center' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight:600 }}>{totalBudgetLimit}</Typography>
              <Typography variant="body1">Sum of All Budget Limits</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h4" mt={4} mb={2} sx={{ fontWeight:600 }}>Insights</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" sx={{ fontWeight:600, mb:2 }}>Top 5 Budgets by Limit</Typography>
            <Bar data={barData}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" sx={{ fontWeight:600, mb:2 }}>Expense Distribution by Budget</Typography>
            <Pie data={pieData}/>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" sx={{ fontWeight:600, mb:2 }}>Expenses Over Time</Typography>
            <Line data={lineData}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" sx={{ fontWeight:600, mb:2 }}>Top Expense Budgets (Donut)</Typography>
            <Doughnut data={donutData}/>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" mt={4} mb={2}>Quick Links</Typography>
      <Grid container spacing={2}>
        {links.map((l)=>(
          <Grid item xs={6} sm={3} key={l.label}>
            <Card>
              <CardActionArea component={Link} to={l.to}>
                <CardContent sx={{ textAlign:'center' }}>
                  <Typography variant="h6" sx={{ fontWeight:600 }}>{l.label}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;
