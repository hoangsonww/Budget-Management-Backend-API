import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Box, Stack, Chip, Divider } from '@mui/material';
import LoadingOverlay from '../components/LoadingOverlay';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import { Bar, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bRes, eRes, uRes, oRes, tRes, trRes] = await Promise.all([
          api.get('/api/budgets'),
          api.get('/api/expenses'),
          api.get('/api/users'),
          api.get('/api/orders'),
          api.get('/api/tasks'),
          api.get('/api/transactions'),
        ]);
        setBudgets(bRes.data || []);
        setExpenses(eRes.data.expenses || []);
        setUsers(uRes.data || []);
        setOrders(oRes.data || []);
        setTasks(tRes.data.tasks || []);
        setTransactions(trRes.data.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBudgets = budgets.length;
  const totalExpenses = expenses.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalTasks = tasks.length;
  const totalTransactions = transactions.length;

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);

  const budgetMap = {};
  budgets.forEach(b => {
    budgetMap[b._id] = b.name;
  });

  const expensesByBudget = {};
  expenses.forEach(e => {
    expensesByBudget[e.budgetId] = (expensesByBudget[e.budgetId] || 0) + e.amount;
  });

  const ordersByStatus = {};
  orders.forEach(o => {
    const s = o.status || 'unknown';
    ordersByStatus[s] = (ordersByStatus[s] || 0) + 1;
  });

  const tasksByStatus = {};
  tasks.forEach(t => {
    const s = t.status || 'pending';
    tasksByStatus[s] = (tasksByStatus[s] || 0) + 1;
  });

  const avgExpensePerUser = totalExpenses > 0 && totalUsers > 0 ? (expenses.reduce((sum, e) => sum + e.amount, 0) / totalUsers).toFixed(2) : 0;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyExpenses = new Array(12).fill(0);
  expenses.forEach(e => {
    const m = new Date(e.createdAt).getMonth();
    monthlyExpenses[m] = (monthlyExpenses[m] || 0) + e.amount;
  });

  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? '#f5f1e7' : '#1b1b1b';

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      title: {
        display: false,
        color: textColor,
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        title: { color: textColor },
      },
      y: {
        ticks: { color: textColor },
        title: { color: textColor },
      },
    },
  };

  const topBudgets = [...budgets].sort((a, b) => b.limit - a.limit).slice(0, 5);
  const barData = {
    labels: topBudgets.map(b => b.name),
    datasets: [
      {
        label: 'Budget Limit',
        data: topBudgets.map(b => b.limit),
        backgroundColor: 'rgba(31, 122, 99, 0.7)',
      },
    ],
  };

  const expenseLabels = Object.keys(expensesByBudget).map(id => budgetMap[id] || id);
  const pieData = {
    labels: expenseLabels,
    datasets: [
      {
        label: 'Expenses',
        data: Object.values(expensesByBudget),
        backgroundColor: ['#f2b35a', '#e7c085', '#93cbb7', '#5b9a83', '#3c7a64', '#c9a06a'],
      },
    ],
  };

  const orderStatuses = Object.keys(ordersByStatus);
  const doughnutData = {
    labels: orderStatuses,
    datasets: [
      {
        label: 'Orders by Status',
        data: orderStatuses.map(s => ordersByStatus[s]),
        backgroundColor: ['#1f7a63', '#4e9f86', '#7fbfa8', '#f2b35a', '#e19a47'],
      },
    ],
  };

  const radarData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyExpenses,
        borderColor: 'rgba(31, 122, 99, 0.9)',
        backgroundColor: 'rgba(31, 122, 99, 0.2)',
      },
    ],
  };

  const taskStatuses = Object.keys(tasksByStatus);
  const polarData = {
    labels: taskStatuses,
    datasets: [
      {
        data: taskStatuses.map(s => tasksByStatus[s]),
        backgroundColor: ['#1f7a63', '#4e9f86', '#7fbfa8', '#f2b35a', '#e19a47'],
      },
    ],
  };

  const hBarData = {
    labels: ['Avg Expense/User', 'Total Budget Limit'],
    datasets: [
      {
        label: 'Value',
        data: [parseFloat(avgExpensePerUser), totalBudgetLimit],
        backgroundColor: ['#1f7a63', '#f2b35a'],
      },
    ],
  };

  const summaryBarData = {
    labels: ['Users', 'Budgets', 'Expenses', 'Orders', 'Tasks', 'Transactions'],
    datasets: [
      {
        label: 'Count',
        data: [totalUsers, totalBudgets, totalExpenses, totalOrders, totalTasks, totalTransactions],
        backgroundColor: 'rgba(31, 122, 99, 0.7)',
      },
    ],
  };

  const tasksRatioDoughnut = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#2b9b77', '#f05f4e'],
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: 'Expenses Amount vs #Days Since Joined (Mock)',
        data: Array.from({ length: 20 }, () => ({ x: Math.random() * 100, y: Math.random() * 1000 })),
        backgroundColor: 'rgba(31, 122, 99, 0.7)',
      },
    ],
  };

  const bubbleData = {
    datasets: [
      {
        label: 'User Activity (Mock)',
        data: Array.from({ length: 10 }, () => ({
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          r: Math.floor(Math.random() * 20) + 5,
        })),
        backgroundColor: 'rgba(31, 122, 99, 0.5)',
      },
    ],
  };

  const stats = [
    { title: 'Total Budgets', value: totalBudgets },
    { title: 'Total Expenses', value: totalExpenses },
    { title: 'Total Users', value: totalUsers },
    { title: 'Total Orders', value: totalOrders },
    { title: 'Total Tasks', value: totalTasks },
    { title: 'Total Transactions', value: totalTransactions },
    { title: 'Budget Limit Total', value: totalBudgetLimit },
    { title: 'Avg Expense/User', value: avgExpensePerUser },
  ];

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Budgets', to: '/budgets' },
    { label: 'Expenses', to: '/expenses' },
    { label: 'Users', to: '/users' },
    { label: 'Profile', to: '/profile' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
  ];

  const chartCardHeight = { height: '350px', display: 'flex', flexDirection: 'column' };

  const ordersByCustomer = {};
  orders.forEach(o => {
    const cname = o.customerId ? o.customerId.name : 'Unknown Customer';
    ordersByCustomer[cname] = (ordersByCustomer[cname] || 0) + o.amount;
  });
  const topCustomers = Object.keys(ordersByCustomer)
    .sort((a, b) => ordersByCustomer[b] - ordersByCustomer[a])
    .slice(0, 5);
  const ordersBarData = {
    labels: topCustomers,
    datasets: [
      {
        label: 'Total Order Amount',
        data: topCustomers.map(c => ordersByCustomer[c]),
        backgroundColor: 'rgba(31, 122, 99, 0.7)',
      },
    ],
  };

  const transactionsByBudget = {};
  transactions.forEach(tr => {
    const budgetId = tr.budget_id || 'Unknown Budget';
    const amt = parseFloat(tr.amount) || 0;
    transactionsByBudget[budgetId] = (transactionsByBudget[budgetId] || 0) + amt;
  });
  const budgetIds = Object.keys(transactionsByBudget).sort((a, b) => transactionsByBudget[b] - transactionsByBudget[a]);
  const transactionsDoughnut = {
    labels: budgetIds,
    datasets: [
      {
        label: 'Total Transaction Amount by Budget',
        data: budgetIds.map(b => transactionsByBudget[b]),
        backgroundColor: ['#1f7a63', '#4e9f86', '#7fbfa8', '#f2b35a', '#e19a47', '#c9a06a', '#7a9f8c'],
      },
    ],
  };

  return (
    <Container sx={{ mt: 4, pb: 6 }}>
      <LoadingOverlay loading={loading} />
      <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Executive Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A consolidated overview of budgets, expenses, users, and operational activity.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`${totalUsers} users`} />
            <Chip label={`${totalBudgets} budgets`} color="secondary" />
            <Chip label={`${totalTransactions} transactions`} />
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2} mb={4}>
        {stats.map((s, i) => (
          <Grid item xs={6} sm={4} md={3} key={i}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" mt={6} mb={2} sx={{ fontWeight: 700 }}>
        Charts & Insights
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Top 5 Budgets by Limit
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Bar data={barData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Expense Distribution by Budget
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Pie data={pieData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Top Customers by Total Order Amount
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Bar data={ordersBarData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Orders by Status
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Doughnut data={doughnutData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Monthly Expenses
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Radar data={radarData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Tasks by Status
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <PolarArea data={polarData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Avg Expense/User vs Total Budget Limit
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Bar data={hBarData} options={{ ...chartOptions, indexAxis: 'y' }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Transaction Amount Distribution by Budget
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Doughnut data={transactionsDoughnut} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Overall Entities Count
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Bar data={summaryBarData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Completed vs Pending Tasks Ratio
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Doughnut data={tasksRatioDoughnut} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Scatter: Expenses vs Days (Mock)
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Scatter data={scatterData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.5, ...chartCardHeight }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Bubble: User Activity (Mock)
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Bubble data={bubbleData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h4" mt={6} mb={2} sx={{ fontWeight: 700 }}>
        Quick Links
      </Typography>
      <Grid container spacing={2}>
        {links.map(l => (
          <Grid item xs={6} sm={4} md={3} key={l.label}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  <Link to={l.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {l.label}
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;
