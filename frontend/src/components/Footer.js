import React from 'react';
import { Box, Typography, Stack, Grid, Link as MuiLink, useTheme, Chip } from '@mui/material';
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
        mt: 6,
        px: { xs: 3, md: 6 },
        py: 5,
        background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #101a17, #0f1512)' : 'linear-gradient(135deg, #ffffff, #f3ede2)',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
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
                }}
              >
                BM
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Budget Manager
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analytics-ready finance operations.
                </Typography>
              </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Manage budgets, track expenses, and monitor transactions with clean UX and enterprise-ready data flows.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {['MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch'].map(label => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    height: 26,
                  }}
                />
              ))}
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FooterGroup title="Product">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/dashboard">Dashboard</FooterLink>
                <FooterLink to="/budgets">Budgets</FooterLink>
                <FooterLink to="/expenses">Expenses</FooterLink>
              </FooterGroup>
            </Grid>
            <Grid item xs={6}>
              <FooterGroup title="Account">
                <FooterLink to="/profile">Profile</FooterLink>
                <FooterLink to="/users">Users</FooterLink>
                <FooterLink to="/login">Login</FooterLink>
                <FooterLink to="/register">Register</FooterLink>
              </FooterGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <FooterGroup title="Connect">
            <MuiLink href="https://github.com/hoangsonww" target="_blank" rel="noopener" sx={linkStyle}>
              <GitHubIcon fontSize="small" /> GitHub
            </MuiLink>
            <MuiLink href="https://sonnguyenhoang.com" target="_blank" rel="noopener" sx={linkStyle}>
              <LanguageIcon fontSize="small" /> Website
            </MuiLink>
            <MuiLink href="https://www.linkedin.com/in/hoangsonw/" target="_blank" rel="noopener" sx={linkStyle}>
              <LinkedInIcon fontSize="small" /> LinkedIn
            </MuiLink>
            <MuiLink href="mailto:hoangson091104@gmail.com" sx={linkStyle}>
              <EmailIcon fontSize="small" /> Email
            </MuiLink>
          </FooterGroup>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Budget Manager. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Built for production readiness with observability-first workflows.
        </Typography>
      </Box>
    </Box>
  );
}

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  color: 'text.secondary',
  textDecoration: 'none',
  fontSize: 14,
  '&:hover': { color: 'primary.main' },
};

function FooterGroup({ title, children }) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </Typography>
      <Stack spacing={0.8}>{children}</Stack>
    </Stack>
  );
}

function FooterLink({ to, children }) {
  return (
    <Typography
      component={Link}
      to={to}
      sx={{
        color: 'text.secondary',
        textDecoration: 'none',
        fontWeight: 500,
        ':hover': { color: 'primary.main' },
      }}
    >
      {children}
    </Typography>
  );
}

export default Footer;
