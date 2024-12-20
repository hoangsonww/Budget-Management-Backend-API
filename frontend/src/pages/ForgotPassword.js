import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [step, setStep] = useState('verifyEmail'); // 'verifyEmail' or 'resetPassword'
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
    <Container sx={{ mt: 4, maxWidth: '400px !important' }}>
      <LoadingOverlay loading={loading} />
      <Paper sx={{ p: 4 }} elevation={3}>
        {step === 'verifyEmail' && (
          <>
            <Typography variant="h4" mb={2} sx={{ fontWeight: 600 }}>
              Forgot Password
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
            <Button variant="contained" fullWidth onClick={handleVerifyEmail}>
              Verify Email
            </Button>
          </>
        )}

        {step === 'resetPassword' && (
          <>
            <Typography variant="h4" mb={2} sx={{ fontWeight: 600 }}>
              Reset Password
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
                <Button variant="contained" fullWidth onClick={handleResetPassword}>
                  Reset Password
                </Button>
              </>
            )}
          </>
        )}
        {/* Horizontal divider */}
        <hr style={{ margin: '20px 0' }} />
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Remembered your password?{' '}
          <a href="/login" style={{ textDecoration: 'underline' }}>
            Login
          </a>
        </Typography>
      </Paper>
    </Container>
  );
}

export default ForgotPassword;
