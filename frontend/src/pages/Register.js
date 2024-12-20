import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
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
    <Container
      sx={{ mt: 4, maxWidth: '400px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
    >
      <LoadingOverlay loading={loading} />
      <Paper sx={{ p: 4, width: '100%' }} elevation={3}>
        <Typography variant="h4" mb={2} sx={{ fontWeight: 600 }}>
          Register
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
        <Button variant="contained" fullWidth onClick={handleRegister}>
          Register
        </Button>
        {/* Horizontal divider */}
        <hr style={{ margin: '20px 0' }} />
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <a href="/login" style={{ textDecoration: 'underline' }}>
            Login
          </a>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;
