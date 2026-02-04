import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardActionArea, Box, Stack, Button, Chip, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApiIcon from '@mui/icons-material/Api';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShieldIcon from '@mui/icons-material/Shield';
import StorageIcon from '@mui/icons-material/Storage';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function Home() {
  const pages = [
    { title: 'Dashboard', description: 'Analyze budgets, expenses, and system metrics.', link: '/dashboard', icon: <DashboardIcon fontSize="large" /> },
    { title: 'Budgets', description: 'Create and manage budgets with full history.', link: '/budgets', icon: <AttachMoneyIcon fontSize="large" /> },
    { title: 'Expenses', description: 'Track, search, and audit expenses effortlessly.', link: '/expenses', icon: <ReceiptLongIcon fontSize="large" /> },
    { title: 'Users', description: 'View user activity and access profiles.', link: '/users', icon: <GroupIcon fontSize="large" /> },
    { title: 'Profile', description: 'Update your account details and preferences.', link: '/profile', icon: <AccountCircleIcon fontSize="large" /> },
    { title: 'Login', description: 'Securely access your workspace.', link: '/login', icon: <LoginIcon fontSize="large" /> },
    { title: 'Register', description: 'Create a new account to get started.', link: '/register', icon: <PersonAddIcon fontSize="large" /> },
    {
      title: 'API Portal',
      description: 'Browse the backend API docs and endpoints.',
      link: 'https://budget-management-backend-api.onrender.com/',
      icon: <ApiIcon fontSize="large" />,
      external: true,
    },
  ];

  const highlights = [
    {
      title: 'Unified finance operations',
      copy: 'Centralize budgets, expenses, transactions, and user activity in one platform with consistent audit trails.',
      icon: <TimelineIcon />,
    },
    {
      title: 'Production-grade access',
      copy: 'JWT-based authentication, role-aware actions, and secure API workflows built into every surface.',
      icon: <ShieldIcon />,
    },
    {
      title: 'Multi-store architecture',
      copy: 'MongoDB for domain entities, PostgreSQL for ledgers, Redis for caching, and Elasticsearch for search.',
      icon: <StorageIcon />,
    },
    {
      title: 'Analytics-ready dashboards',
      copy: 'Prebuilt charts, rollups, and insights help teams spot budget drift and expense anomalies quickly.',
      icon: <AutoGraphIcon />,
    },
  ];

  const workflowSteps = [
    {
      title: 'Authenticate',
      detail: 'Login or register to receive a JWT for protected endpoints.',
    },
    {
      title: 'Define budgets',
      detail: 'Set limits and categories to establish guardrails.',
    },
    {
      title: 'Track expenses',
      detail: 'Log spending, then search it instantly in Elasticsearch.',
    },
    {
      title: 'Monitor outcomes',
      detail: 'Use the dashboard to view trends and performance signals.',
    },
  ];

  const stats = [
    { label: 'Integrated services', value: '6' },
    { label: 'Core domains', value: '5' },
    { label: 'Dashboards', value: '10+' },
    { label: 'API endpoints', value: '40+' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      <Box
        sx={{
          pt: { xs: 6, md: 8 },
          pb: { xs: 6, md: 10 },
          background: 'linear-gradient(135deg, rgba(31, 122, 99, 0.08), rgba(242, 179, 90, 0.18))',
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Chip label="Budget Management System" sx={{ alignSelf: 'flex-start', fontWeight: 600 }} />
                <Typography variant="h2">Operate budgets with clarity, scale, and precision.</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                  A production-ready finance platform that connects budgets, expenses, transactions, and task automation. Monitor everything from a single
                  dashboard with searchable history and real-time operational insight.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" size="large" component={Link} to="/dashboard" startIcon={<RocketLaunchIcon />}>
                    Launch Dashboard
                  </Button>
                  <Button variant="outlined" size="large" component={Link} to="/budgets">
                    Explore Budgets
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip label="JWT auth" size="small" />
                  <Chip label="PostgreSQL ledger" size="small" />
                  <Chip label="Elasticsearch search" size="small" />
                  <Chip label="Kafka + RabbitMQ" size="small" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {stats.map(stat => (
                  <Grid item xs={6} key={stat.label}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        System snapshot
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Track budgets in MongoDB, transaction logs in PostgreSQL, cached status in Redis, and searchable expenses in Elasticsearch. The platform
                        is wired for growth and operational readiness.
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip label="MongoDB" />
                        <Chip label="PostgreSQL" />
                        <Chip label="Redis" />
                        <Chip label="Elasticsearch" />
                        <Chip label="Kafka" />
                        <Chip label="RabbitMQ" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          {highlights.map(item => (
            <Grid item xs={12} md={6} key={item.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6">{item.title}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {item.copy}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ mt: 6 }}>
        <Card sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                From sign-in to insight in minutes.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Follow the core workflow to set budgets, log expenses, and analyze outcomes without leaving the platform.
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {workflowSteps.map(step => (
                  <Grid item xs={12} sm={6} key={step.title}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.detail}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <Container sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Explore the workspace
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 700 }}>
          Jump directly to the tools you need. Every page keeps the same data logic, now wrapped in a refined, production-ready layout.
        </Typography>
        <Grid container spacing={3}>
          {pages.map(p => (
            <Grid item xs={12} sm={6} md={4} key={p.title}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea
                  component={p.external ? 'a' : Link}
                  href={p.external ? p.link : undefined}
                  to={p.external ? undefined : p.link}
                  target={p.external ? '_blank' : undefined}
                  rel={p.external ? 'noreferrer' : undefined}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(31, 122, 99, 0.12)',
                        color: 'primary.main',
                      }}
                    >
                      {p.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                      {p.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                      {p.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ mt: 6 }}>
        <Card sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Production-ready by default
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The demo UI mirrors real production requirements: accessible tables, robust filters, clear hierarchy, and a consistent design system that
                scales.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" component={Link} to="/login">
                  Sign in
                </Button>
                <Button variant="outlined" component={Link} to="/register">
                  Create account
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack spacing={1.5}>
                <Box sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2">Audit-ready records</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clean tables and consistent metadata across every list view.
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2">Secure access flow</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dedicated auth screens and token-aware navigation.
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2">Insightful dashboards</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Charts and metrics for fast operational clarity.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}

export default Home;
