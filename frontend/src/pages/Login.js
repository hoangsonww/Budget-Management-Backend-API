import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Grid, Divider } from '@mui/material';
import api from '../services/api';
import { setToken } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      navigate('/budgets');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password, or an error has occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <LoadingOverlay loading={loading} />
      <Container>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h4" mb={1} sx={{ fontWeight: 700 }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Sign in to manage budgets, review expenses, and track performance metrics.
              </Typography>
              {error && (
                <Typography color="error" mb={2}>
                  {error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Email"
                sx={{ mb: 2 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleLogin()}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                sx={{ mb: 2 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleLogin()}
              />
              <Button variant="contained" fullWidth onClick={handleLogin} size="large">
                Login
              </Button>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
                Don&apos;t have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'underline' }}>
                  Register
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Forgot your password?{' '}
                <Link to="/forgot-password" style={{ textDecoration: 'underline' }}>
                  Reset Password
                </Link>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(135deg, rgba(31, 122, 99, 0.08), rgba(242, 179, 90, 0.12))',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Secure access, polished workflows.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use the login portal to access dashboards, manage expenses, and monitor system performance.
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <Typography variant="body2">• JWT-secured API sessions</Typography>
                <Typography variant="body2">• Unified dashboards and reports</Typography>
                <Typography variant="body2">• Search-ready expense history</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Login;
