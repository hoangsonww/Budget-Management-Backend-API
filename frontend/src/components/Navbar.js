import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../services/api';

function Navbar({ mode, setMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Check token validity on location change and on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const res = await api.post(
          '/api/auth/verify-token',
          { token },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data.valid) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          navigate('/login');
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
      }
    };
    checkToken();
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Define nav links
  const baseNavLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/budgets', label: 'Budgets', icon: <AttachMoneyIcon /> },
    { to: '/expenses', label: 'Expenses', icon: <ReceiptLongIcon /> },
    { to: '/profile', label: 'Profile', icon: <AccountCircleIcon /> },
    { to: '/users', label: 'Users', icon: <GroupIcon /> },
  ];

  let navLinks = [...baseNavLinks];
  if (isLoggedIn) {
    navLinks.push({ to: '#', label: 'Logout', icon: <LogoutIcon />, action: handleLogout });
  } else {
    navLinks.push({ to: '/login', label: 'Login', icon: <LoginIcon /> });
    navLinks.push({ to: '/register', label: 'Register', icon: <PersonAddIcon /> });
  }

  const activeColor = '#8B4513'; // Brownish color for mobile active link

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton sx={{ mr: 2, display: { xs: 'block', md: 'none' } }} color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, display: { xs: 'none', md: 'block' } }}>
            Budget Management System
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, display: { xs: 'block', md: 'none' } }}>
            Budget Management
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              const isLogout = link.label === 'Logout';
              const buttonStyle = {
                mr: 1,
                borderRadius: 0,
                borderBottom: isActive ? '2px solid white' : 'none',
                ...(isLogout && { color: 'red' }), // Apply red color if it's the logout button
              };

              if (link.action) {
                // For logout
                return (
                  <Button key={link.label} color="inherit" startIcon={link.icon} onClick={link.action} sx={buttonStyle}>
                    {link.label}
                  </Button>
                );
              } else {
                return (
                  <Button key={link.to} component={Link} to={link.to} color="inherit" startIcon={link.icon} sx={buttonStyle}>
                    {link.label}
                  </Button>
                );
              }
            })}
          </Box>
          <IconButton color="inherit" onClick={handleToggleMode} sx={{ mr: { xs: 0, md: 2 } }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            const isLogout = link.label === 'Logout';
            const listItemStyles = {
              color: isActive ? activeColor : 'inherit',
              ...(isLogout && { color: 'red' }),
            };

            if (link.action) {
              return (
                <ListItemButton
                  key={link.label}
                  onClick={() => {
                    setDrawerOpen(false);
                    link.action();
                  }}
                  sx={listItemStyles}
                >
                  <ListItemIcon sx={listItemStyles}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              );
            } else {
              return (
                <ListItemButton key={link.to} component={Link} to={link.to} onClick={() => setDrawerOpen(false)} sx={listItemStyles}>
                  <ListItemIcon sx={listItemStyles}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              );
            }
          })}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
