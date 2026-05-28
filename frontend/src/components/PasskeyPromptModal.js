import React, { useState } from 'react';
import { Dialog, Box, Typography, Button, Stack, Alert, CircularProgress, Fade } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldIcon from '@mui/icons-material/Shield';
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import { registerPasskey, describePasskeyError } from '../services/passkeys';

const benefits = [
  { icon: <BoltIcon fontSize="small" />, text: 'Sign in instantly — no password to type' },
  { icon: <ShieldIcon fontSize="small" />, text: 'Phishing-resistant and unique to this site' },
  { icon: <PhonelinkLockIcon fontSize="small" />, text: 'Unlocked by your face, fingerprint or device PIN' },
];

/**
 * Friendly modal shown right after sign-up (and re-usable elsewhere) inviting
 * the user to enrol a passkey. Runs the registration ceremony in place and
 * reports success/failure without ever falling back to a browser alert.
 */
function PasskeyPromptModal({
  open,
  onClose,
  onCreated,
  title = 'Set up a passkey?',
  subtitle = 'Add a passkey for faster, password-free sign-in next time.',
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const reset = () => {
    setLoading(false);
    setError('');
    setDone(false);
  };

  const handleClose = (created = false) => {
    if (loading) return;
    reset();
    onClose?.(created);
  };

  const handleCreate = async () => {
    setError('');
    setLoading(true);
    try {
      const passkey = await registerPasskey();
      setDone(true);
      onCreated?.(passkey);
      setTimeout(() => handleClose(true), 1100);
    } catch (err) {
      const { cancelled, message } = describePasskeyError(err);
      setError(cancelled ? 'No passkey was created. You can add one anytime from the Account menu.' : message);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 4, overflow: 'hidden' } } }}>
      <Box
        sx={{
          px: 3,
          pt: 4,
          pb: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(31, 122, 99, 0.16), rgba(242, 179, 90, 0.18))',
        }}
      >
        <Box
          sx={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            mx: 'auto',
            mb: 2,
            display: 'grid',
            placeItems: 'center',
            color: 'primary.contrastText',
            background: 'linear-gradient(135deg, #1f7a63, #2aa88a)',
            boxShadow: '0 12px 26px rgba(25, 90, 72, 0.4)',
          }}
        >
          {done ? <CheckCircleIcon sx={{ fontSize: 40 }} /> : <FingerprintIcon sx={{ fontSize: 40 }} />}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {done ? 'Passkey created' : title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {done ? "You're all set — use it to sign in next time." : subtitle}
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Fade in={!done} unmountOnExit>
          <Stack spacing={1.5} sx={{ mb: error ? 2 : 3 }}>
            {benefits.map(b => (
              <Stack key={b.text} direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{b.icon}</Box>
                <Typography variant="body2">{b.text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Fade>

        {error && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!done && (
          <Stack spacing={1.25}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCreate}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FingerprintIcon />}
            >
              {loading ? 'Waiting for your device…' : 'Create a passkey'}
            </Button>
            <Button variant="text" fullWidth onClick={() => handleClose(false)} disabled={loading} sx={{ color: 'text.secondary' }}>
              Maybe later
            </Button>
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}

export default PasskeyPromptModal;
