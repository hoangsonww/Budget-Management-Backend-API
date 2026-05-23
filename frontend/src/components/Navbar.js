import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Stack,
  useMediaQuery,
} from '@mui/material';
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
import { isLoggedIn as checkLoggedIn, getTokenExpiry, logout, onAuthChange } from '../services/auth';

function Navbar({ mode, setMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => checkLoggedIn());
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileNav = useMediaQuery('(max-width:1350px)');

  const handleToggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth state is event-driven: we listen for login/logout in this tab,
  // storage changes from other tabs, and a single timer that fires exactly
  // when the JWT's exp claim is reached. No per-navigation network calls,
  // no polling — the server's 401 response (handled in api.js) is the
  // source of truth for server-side revocation.
  useEffect(() => {
    const sync = () => setIsLoggedIn(checkLoggedIn());

    const unsubscribe = onAuthChange(sync);

    let expiryTimer;
    const expiryMs = getTokenExpiry();
    if (expiryMs) {
      const delay = Math.max(0, expiryMs - Date.now());
      expiryTimer = setTimeout(sync, delay + 250);
    }

    return () => {
      unsubscribe();
      if (expiryTimer) clearTimeout(expiryTimer);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ py: 1, gap: 2 }}>
          <IconButton
            sx={{
              display: isMobileNav ? 'block' : 'none',
              '&:hover': { backgroundColor: 'transparent' },
            }}
            color="inherit"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 700,
                boxShadow: '0 10px 18px rgba(25, 90, 72, 0.35)',
              }}
            >
              BM
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                Budget Management
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Multi-store finance ops
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: isMobileNav ? 'none' : 'flex', gap: 1 }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              const isLogout = link.label === 'Logout';
              const buttonStyle = {
                px: 2,
                borderRadius: 999,
                bgcolor: isActive ? 'rgba(31, 122, 99, 0.14)' : 'transparent',
                color: isLogout ? 'error.main' : 'text.primary',
                border: isActive ? '1px solid rgba(31, 122, 99, 0.3)' : '1px solid transparent',
                '&:hover': {
                  bgcolor: isLogout ? 'rgba(216, 74, 74, 0.1)' : 'rgba(31, 122, 99, 0.12)',
                },
              };

              if (link.action) {
                return (
                  <Button key={link.label} color="inherit" startIcon={link.icon} onClick={link.action} sx={buttonStyle}>
                    {link.label}
                  </Button>
                );
              }
              return (
                <Button key={link.to} component={Link} to={link.to} color="inherit" startIcon={link.icon} sx={buttonStyle}>
                  {link.label}
                </Button>
              );
            })}
          </Box>

          <IconButton color="inherit" onClick={handleToggleMode} sx={{ ml: 1 }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 270, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
            Navigation
          </Typography>
          <List sx={{ width: '100%' }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              const isLogout = link.label === 'Logout';
              const listItemStyles = {
                borderRadius: 2,
                mb: 0.5,
                bgcolor: isActive ? 'rgba(31, 122, 99, 0.14)' : 'transparent',
                color: isLogout ? 'error.main' : 'text.primary',
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
                    <ListItemIcon sx={{ color: 'inherit' }}>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                );
              }
              return (
                <ListItemButton key={link.to} component={Link} to={link.to} onClick={() => setDrawerOpen(false)} sx={listItemStyles}>
                  <ListItemIcon sx={{ color: 'inherit' }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
