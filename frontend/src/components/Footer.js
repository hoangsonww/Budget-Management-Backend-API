import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Typography, IconButton, Stack, Grid, Link as MuiLink, useTheme, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 3,
        px: 2,
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        textAlign: 'center',
      }}
    >
      {/* Top Section: Budget Manager info */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Budget Manager
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Manage your budgets and expenses efficiently.
      </Typography>

      {/* Horizontal divider */}
      <Box sx={{ borderBottom: '1px solid #fff', mb: 2 }}></Box>

      {/* Links horizontally below */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
        <FooterLink to="/">Home</FooterLink>
        <FooterLink to="/dashboard">Dashboard</FooterLink>
        <FooterLink to="/budgets">Budgets</FooterLink>
        <FooterLink to="/expenses">Expenses</FooterLink>
        <FooterLink to="/users">Users</FooterLink>
        <FooterLink to="/profile">Profile</FooterLink>
        <FooterLink to="/login">Login</FooterLink>
        <FooterLink to="/register">Register</FooterLink>
      </Stack>

      {/* Social Icons */}
      <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
        <IconButtonLink href="https://github.com/yourgithub" icon={<GitHubIcon />} />
        <IconButtonLink href="https://yourwebsite.com" icon={<LanguageIcon />} />
        <IconButtonLink href="https://linkedin.com/in/yourlinkedin" icon={<LinkedInIcon />} />
        <IconButtonLink href="mailto:youremail@example.com" icon={<EmailIcon />} />
      </Stack>

      <Typography variant="body2" sx={{ mt: 3 }}>
        © {new Date().getFullYear()} Budget Manager. All rights reserved.
      </Typography>
    </Box>
  );
}

function FooterLink({ to, children }) {
  return (
    <Typography
      component={Link}
      to={to}
      sx={{
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 500,
        ':hover': { textDecoration: 'underline' },
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Typography>
  );
}

function IconButtonLink({ href, icon }) {
  return (
    <IconButton component="a" href={href} target="_blank" rel="noopener noreferrer" sx={{ color: '#fff' }}>
      {icon}
    </IconButton>
  );
}

export default Footer;
