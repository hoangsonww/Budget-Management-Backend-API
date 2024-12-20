import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../services/api';
import { setToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      navigate('/budgets');
    } catch(err) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt:4, maxWidth:'400px !important' }}>
      <LoadingOverlay loading={loading} />
      <Paper sx={{ p:4 }} elevation={3}>
        <Typography variant="h4" mb={2} sx={{ fontWeight:600 }}>
          Login
        </Typography>
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        <TextField fullWidth label="Email" sx={{ mb:2 }} value={email} onChange={e=>setEmail(e.target.value)}/>
        <TextField fullWidth label="Password" type="password" sx={{ mb:2 }} value={password} onChange={e=>setPassword(e.target.value)}/>
        <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
      </Paper>
    </Container>
  );
}

export default Login;
