import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import KeyIcon from '@mui/icons-material/VpnKey';
import LaptopIcon from '@mui/icons-material/Laptop';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import UsbIcon from '@mui/icons-material/Usb';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import LoadingOverlay from '../components/LoadingOverlay';
import {
  isPasskeySupported,
  isPlatformAuthenticatorAvailable,
  registerPasskey,
  listPasskeys,
  renamePasskey,
  deletePasskey,
  describePasskeyError,
} from '../services/passkeys';

const transportIcon = (transports = []) => {
  const t = new Set(transports);
  if (t.has('internal')) return <LaptopIcon />;
  if (t.has('hybrid')) return <SmartphoneIcon />;
  if (t.has('usb') || t.has('nfc') || t.has('ble')) return <UsbIcon />;
  return <KeyIcon />;
};

const formatDate = value => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
};

const formatLastUsed = value => {
  if (!value) return 'Never used';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return 'Never used';
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'Used just now';
  if (minutes < 60) return `Used ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Used ${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `Used ${days} day${days === 1 ? '' : 's'} ago`;
  return `Last used ${formatDate(value)}`;
};

function Passkeys() {
  const [passkeys, setPasskeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [platformAvailable, setPlatformAvailable] = useState(true);
  const supported = isPasskeySupported();

  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [renaming, setRenaming] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack(prev => ({ ...prev, open: false }));

  const fetchList = useCallback(async () => {
    try {
      const data = await listPasskeys();
      setPasskeys(data);
    } catch (err) {
      showSnack(err?.response?.data?.error || 'Could not load your passkeys.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
    if (supported) {
      isPlatformAuthenticatorAvailable().then(setPlatformAvailable);
    }
  }, [fetchList, supported]);

  const handleAdd = async () => {
    setAdding(true);
    try {
      const passkey = await registerPasskey();
      await fetchList();
      showSnack(`Passkey added${passkey?.name ? ` — “${passkey.name}”. Rename it anytime below.` : '.'}`, 'success');
    } catch (err) {
      const { cancelled, message } = describePasskeyError(err);
      if (!cancelled) showSnack(message, 'error');
    } finally {
      setAdding(false);
    }
  };

  const openRename = passkey => {
    setRenameTarget(passkey);
    setRenameValue(passkey.name || '');
  };

  const submitRename = async () => {
    const name = renameValue.trim();
    if (!name || !renameTarget) return;
    setRenaming(true);
    try {
      const updated = await renamePasskey(renameTarget.id, name);
      setPasskeys(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setRenameTarget(null);
      showSnack('Passkey renamed.', 'success');
    } catch (err) {
      showSnack(err?.response?.data?.error || 'Could not rename the passkey.', 'error');
    } finally {
      setRenaming(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePasskey(deleteTarget.id);
      setPasskeys(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      showSnack('Passkey removed.', 'success');
    } catch (err) {
      showSnack(err?.response?.data?.error || 'Could not delete the passkey.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingOverlay loading />;

  return (
    <Box sx={{ py: { xs: 4, md: 7 } }}>
      <Container>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Passkeys
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
              Passkeys let you sign in with your fingerprint, face, or device PIN — no password required. Add one per device for the smoothest, most secure
              access.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={adding ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
            onClick={handleAdd}
            disabled={!supported || adding}
            sx={{ flexShrink: 0 }}
          >
            {adding ? 'Waiting for device…' : 'Add a passkey'}
          </Button>
        </Stack>

        {!supported && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            This browser doesn&apos;t support passkeys. Try a recent version of Chrome, Safari, Edge, or Firefox on a device with a screen lock.
          </Alert>
        )}
        {supported && !platformAvailable && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No built-in authenticator detected on this device. You can still register a security key or use a nearby phone.
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {passkeys.length === 0 ? (
              <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 84,
                    height: 84,
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 2,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.main',
                    bgcolor: 'rgba(31, 122, 99, 0.12)',
                  }}
                >
                  <FingerprintIcon sx={{ fontSize: 44 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  No passkeys yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: 'auto' }}>
                  Add your first passkey to enable one-tap, password-free sign-in on this device.
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={!supported || adding}>
                  {adding ? 'Waiting for device…' : 'Add your first passkey'}
                </Button>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {passkeys.map(passkey => (
                  <Paper key={passkey.id} sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2.5,
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          color: 'primary.main',
                          bgcolor: 'rgba(31, 122, 99, 0.12)',
                        }}
                      >
                        {transportIcon(passkey.transports)}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
                            {passkey.name}
                          </Typography>
                          {passkey.backedUp && <Chip size="small" color="success" icon={<CloudDoneIcon />} label="Synced" sx={{ height: 22 }} />}
                          {passkey.deviceType === 'singleDevice' && <Chip size="small" variant="outlined" label="This device only" sx={{ height: 22 }} />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Added {formatDate(passkey.createdAt)} · {formatLastUsed(passkey.lastUsedAt)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                        <Tooltip title="Rename">
                          <IconButton onClick={() => openRename(passkey)} aria-label={`Rename ${passkey.name}`}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => setDeleteTarget(passkey)} aria-label={`Delete ${passkey.name}`}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: { xs: 3, md: 3.5 },
                background: 'linear-gradient(135deg, rgba(31, 122, 99, 0.08), rgba(242, 179, 90, 0.12))',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Why passkeys?
              </Typography>
              <Stack spacing={2}>
                <InfoRow icon={<BoltIcon />} title="Faster sign-in" body="Skip passwords entirely — authenticate with a touch or glance." />
                <InfoRow icon={<ShieldIcon />} title="Phishing-resistant" body="Bound to this site, so they can't be stolen or reused elsewhere." />
                <InfoRow icon={<PhonelinkLockIcon />} title="On every device" body="Register a passkey per device, or sync them through your platform." />
              </Stack>
              <Divider sx={{ my: 2.5 }} />
              <Typography variant="caption" color="text.secondary">
                Your password still works. Passkeys are an additional, optional way to sign in and can be removed at any time.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Rename dialog */}
      <Dialog open={Boolean(renameTarget)} onClose={() => !renaming && setRenameTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Rename passkey</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Give this passkey a name you&apos;ll recognise, like “Work laptop” or “iPhone”.</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Passkey name"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            inputProps={{ maxLength: 60 }}
            onKeyDown={e => e.key === 'Enter' && submitRename()}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenameTarget(null)} disabled={renaming} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitRename} disabled={renaming || !renameValue.trim()}>
            {renaming ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => !deleting && setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove this passkey?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            “{deleteTarget?.name}” will no longer be able to sign in to your account. This can&apos;t be undone, but you can always add a new passkey later.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Removing…' : 'Remove passkey'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function InfoRow({ icon, title, body }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: 'primary.main', mt: 0.25 }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {body}
        </Typography>
      </Box>
    </Stack>
  );
}

export default Passkeys;
