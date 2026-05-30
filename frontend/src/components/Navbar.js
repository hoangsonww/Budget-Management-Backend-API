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
  Menu,
  MenuItem,
  Divider,
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
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { isLoggedIn as checkLoggedIn, getTokenExpiry, logout, onAuthChange } from '../services/auth';

function Navbar({ mode, setMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => checkLoggedIn());
  const [accountAnchor, setAccountAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileNav = useMediaQuery('(max-width:1350px)');

  const openAccountMenu = e => setAccountAnchor(e.currentTarget);
  const closeAccountMenu = () => setAccountAnchor(null);

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
    closeAccountMenu();
    logout();
    navigate('/login');
  };

  const goToPasskeys = () => {
    closeAccountMenu();
    navigate('/passkeys');
  };

  const baseNavLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/budgets', label: 'Budgets', icon: <AttachMoneyIcon /> },
    { to: '/expenses', label: 'Expenses', icon: <ReceiptLongIcon /> },
    { to: '/profile', label: 'Profile', icon: <AccountCircleIcon /> },
    { to: '/users', label: 'Users', icon: <GroupIcon /> },
  ];

  // When signed in, account actions (Passkeys, Log Out) live in a dropdown
  // instead of as flat nav buttons; guests get Login/Register instead.
  let navLinks = [...baseNavLinks];
  if (!isLoggedIn) {
    navLinks.push({ to: '/login', label: 'Login', icon: <LoginIcon /> });
    navLinks.push({ to: '/register', label: 'Register', icon: <PersonAddIcon /> });
  }

  const accountActive = location.pathname === '/passkeys';

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

          <Box sx={{ display: isMobileNav ? 'none' : 'flex', gap: 1, alignItems: 'center' }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              const buttonStyle = {
                px: 2,
                borderRadius: 999,
                bgcolor: isActive ? 'rgba(31, 122, 99, 0.14)' : 'transparent',
                color: 'text.primary',
                border: isActive ? '1px solid rgba(31, 122, 99, 0.3)' : '1px solid transparent',
                '&:hover': { bgcolor: 'rgba(31, 122, 99, 0.12)' },
              };
              return (
                <Button key={link.to} component={Link} to={link.to} color="inherit" startIcon={link.icon} sx={buttonStyle}>
                  {link.label}
                </Button>
              );
            })}

            {isLoggedIn && (
              <Button
                color="inherit"
                onClick={openAccountMenu}
                startIcon={<AccountCircleIcon />}
                endIcon={<KeyboardArrowDownIcon />}
                aria-haspopup="true"
                aria-expanded={Boolean(accountAnchor)}
                sx={{
                  px: 2,
                  borderRadius: 999,
                  color: 'text.primary',
                  bgcolor: accountActive || accountAnchor ? 'rgba(31, 122, 99, 0.14)' : 'transparent',
                  border: accountActive || accountAnchor ? '1px solid rgba(31, 122, 99, 0.3)' : '1px solid transparent',
                  '&:hover': { bgcolor: 'rgba(31, 122, 99, 0.12)' },
                }}
              >
                Account
              </Button>
            )}
          </Box>

          <Menu
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={closeAccountMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { mt: 1, minWidth: 200, borderRadius: 2, overflow: 'visible' } } }}
          >
            <MenuItem onClick={goToPasskeys} selected={accountActive} sx={{ py: 1.25 }}>
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <FingerprintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Passkeys" />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </MenuItem>
          </Menu>

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
              return (
                <ListItemButton
                  key={link.to}
                  component={Link}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: isActive ? 'rgba(31, 122, 99, 0.14)' : 'transparent',
                    color: 'text.primary',
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              );
            })}

            {isLoggedIn && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItemButton
                  component={Link}
                  to="/passkeys"
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: accountActive ? 'rgba(31, 122, 99, 0.14)' : 'transparent',
                    color: 'text.primary',
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <FingerprintIcon />
                  </ListItemIcon>
                  <ListItemText primary="Passkeys" />
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                  sx={{ borderRadius: 2, mb: 0.5, color: 'error.main' }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log Out" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
