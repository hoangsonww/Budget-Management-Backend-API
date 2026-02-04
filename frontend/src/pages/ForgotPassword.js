import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Divider } from '@mui/material';
import api from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const [step, setStep] = useState('verifyEmail');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/verify-email', { email });
      if (res.data && res.data.exists) {
        setStep('resetPassword');
        setError(null);
      } else {
        setError('Email not found. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/auth/reset-password', { email, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <LoadingOverlay loading={loading} />
      <Container sx={{ maxWidth: '520px !important' }}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          {step === 'verifyEmail' && (
            <>
              <Typography variant="h4" mb={1} sx={{ fontWeight: 700 }}>
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Verify your email address to reset your password.
              </Typography>
              {error && (
                <Typography color="error" mb={2}>
                  {error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Enter your email"
                sx={{ mb: 2 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleVerifyEmail()}
              />
              <Button variant="contained" fullWidth onClick={handleVerifyEmail} size="large">
                Verify Email
              </Button>
            </>
          )}

          {step === 'resetPassword' && (
            <>
              <Typography variant="h4" mb={1} sx={{ fontWeight: 700 }}>
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Set a new password to secure your account.
              </Typography>
              {error && (
                <Typography color="error" mb={2}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="primary" mb={2}>
                  Password reset successful. Redirecting...
                </Typography>
              )}
              {!success && (
                <>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleResetPassword()}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    sx={{ mb: 2 }}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleResetPassword()}
                  />
                  <Button variant="contained" fullWidth onClick={handleResetPassword} size="large">
                    Reset Password
                  </Button>
                </>
              )}
            </>
          )}
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ textDecoration: 'underline' }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
