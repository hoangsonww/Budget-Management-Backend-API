import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardActionArea, Slide, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApiIcon from '@mui/icons-material/Api';

function Home() {
  const pages = [
    { title: 'Home', description: 'Welcome to Budget Management System.', link: '/', icon: <HomeIcon fontSize="large" /> },
    { title: 'Dashboard', description: 'View and analyze your overall financial data.', link: '/dashboard', icon: <DashboardIcon fontSize="large" /> },
    { title: 'Budgets', description: 'Create and manage all your budgets in one place.', link: '/budgets', icon: <AttachMoneyIcon fontSize="large" /> },
    { title: 'Expenses', description: 'Track and modify expenses with ease.', link: '/expenses', icon: <ReceiptLongIcon fontSize="large" /> },
    { title: 'Users', description: 'View and search users on the platform.', link: '/users', icon: <GroupIcon fontSize="large" /> },
    { title: 'Profile', description: 'View and edit your personal profile.', link: '/profile', icon: <AccountCircleIcon fontSize="large" /> },
    { title: 'Login', description: 'Access your account and manage your finances.', link: '/login', icon: <LoginIcon fontSize="large" /> },
    { title: 'Register', description: 'Create a new account to get started.', link: '/register', icon: <PersonAddIcon fontSize="large" /> },
    {
      title: 'API',
      description: 'View the API documentation.',
      link: 'https://budget-management-backend-api.onrender.com/',
      icon: <ApiIcon fontSize="large" />,
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Slide direction="down" in mountOnEnter unmountOnExit>
        <Box>
          <Typography variant="h3" mb={2} sx={{ fontWeight: 700 }}>
            Welcome to Budget Management System
          </Typography>
          <Typography variant="body1" mb={4} sx={{ fontSize: '1.1rem', maxWidth: 600, textAlign: 'left' }}>
            Keep track of your budgets, manage expenses, and interact with other users. Our platform helps you stay on top of your finances effortlessly. Use
            the navigation links to explore different sections.
          </Typography>
          <Grid container spacing={3}>
            {pages.map((p, index) => (
              <Grid item xs={12} sm={6} md={4} key={p.title}>
                <Card
                  sx={{
                    ':hover': { transform: 'scale(1.03)' },
                    transition: 'transform 0.2s ease-in-out',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <CardActionArea component={Link} to={p.link} sx={{ height: '100%' }}>
                    <CardContent>
                      {p.icon}
                      <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                        {p.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                        {p.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Slide>
      <div style={{ borderBottom: '1px solid #ccc', margin: '20px' }}></div>
      <Typography variant="body2" mt={4} sx={{ textAlign: 'center', opacity: 0.8 }}>
        Ensure that you're logged in to access all features. Thank you for using our platform today! 🚀
      </Typography>
    </Container>
  );
}

export default Home;
