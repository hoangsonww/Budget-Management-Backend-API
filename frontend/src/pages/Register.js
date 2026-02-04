import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Grid, Divider } from '@mui/material';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/register', { username, email, password });
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Registration failed. Maybe email is already in use, or an error has occurred.');
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
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start tracking budgets and expenses with a secure, production-ready workspace.
              </Typography>
              {error && (
                <Typography color="error" mb={2}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="primary" mb={2}>
                  Registration successful. Redirecting...
                </Typography>
              )}
              <TextField
                fullWidth
                label="Username"
                sx={{ mb: 2 }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <TextField
                fullWidth
                label="Email"
                sx={{ mb: 2 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                sx={{ mb: 2 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                sx={{ mb: 2 }}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />
              <Button variant="contained" fullWidth onClick={handleRegister} size="large">
                Register
              </Button>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'underline' }}>
                  Login
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
                What you unlock
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Build a complete financial profile with budgets, expenses, and searchable transactions.
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <Typography variant="body2">• Dashboard analytics</Typography>
                <Typography variant="body2">• Budget alerts and history</Typography>
                <Typography variant="body2">• Expense search and insights</Typography>
                <Typography variant="body2">• Team-ready user workflows</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Register;
