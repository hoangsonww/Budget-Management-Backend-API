import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

function Register() {
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);
  const [success,setSuccess] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', { username, email, password });
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch(err) {
      console.error(err);
      setError('Registration failed. Maybe email already in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt:4, maxWidth:'400px !important' }}>
      <LoadingOverlay loading={loading} />
      <Paper sx={{ p:4 }} elevation={3}>
        <Typography variant="h4" mb={2} sx={{ fontWeight:600 }}>Register</Typography>
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        {success && <Typography color="primary" mb={2}>Registration successful. Redirecting...</Typography>}
        <TextField fullWidth label="Username" sx={{ mb:2 }} value={username} onChange={e=>setUsername(e.target.value)}/>
        <TextField fullWidth label="Email" sx={{ mb:2 }} value={email} onChange={e=>setEmail(e.target.value)}/>
        <TextField fullWidth label="Password" type="password" sx={{ mb:2 }} value={password} onChange={e=>setPassword(e.target.value)}/>
        <Button variant="contained" fullWidth onClick={handleRegister}>Register</Button>
      </Paper>
    </Container>
  );
}

export default Register;
