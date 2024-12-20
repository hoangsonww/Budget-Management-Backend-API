import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link } from 'react-router-dom';
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

const navLinks = [
  { to: '/', label: 'Home', icon:<HomeIcon/> },
  { to: '/dashboard', label: 'Dashboard', icon:<DashboardIcon/> },
  { to: '/login', label: 'Login', icon:<LoginIcon/> },
  { to: '/register', label: 'Register', icon:<PersonAddIcon/> },
  { to: '/profile', label: 'Profile', icon:<AccountCircleIcon/> },
  { to: '/budgets', label: 'Budgets', icon:<AttachMoneyIcon/> },
  { to: '/expenses', label: 'Expenses', icon:<ReceiptLongIcon/> },
  { to: '/users', label: 'Users', icon:<GroupIcon/> },
];

function Navbar({ mode, setMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton sx={{ mr:2, display:{xs:'block', md:'none'} }} color="inherit" onClick={()=>setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight:600, display:{xs:'none', md:'block'} }}>
            Budget Manager
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight:600, display:{xs:'block', md:'none'} }}>
            BM
          </Typography>
          <IconButton color="inherit" onClick={handleToggleMode} sx={{ mr:{xs:0, md:2} }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Box sx={{ display:{xs:'none', md:'flex'} }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                color="inherit"
                startIcon={link.icon}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={()=>setDrawerOpen(false)}>
        <List sx={{ width:250 }}>
          {navLinks.map((link) => (
            <ListItemButton key={link.to} component={Link} to={link.to} onClick={()=>setDrawerOpen(false)}>
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
