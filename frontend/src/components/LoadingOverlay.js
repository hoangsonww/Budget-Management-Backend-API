import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Tooltip, Fade, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Render free-tier specs — surface a friendly note when a request hangs long
// enough that the user might think the app is broken. Numbers come from
// Render's published free-instance limits (see README "Live API" section).
const FREE_TIER_INFO = "We're on Render's free tier (0.1 CPU / 512 MB RAM). When the service has been idle, the first request triggers a cold start that usually takes 30–60 seconds. Subsequent requests are fast.";

const LONG_LOAD_MS = 4000;
const COLD_START_MS = 10000;

function LoadingOverlay({ loading, longLoadMs = LONG_LOAD_MS, coldStartMs = COLD_START_MS }) {
  const [stage, setStage] = useState('initial');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!loading) {
      setStage('initial');
      setElapsed(0);
      return;
    }

    const startedAt = Date.now();
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    const longTimer = setTimeout(() => setStage(prev => (prev === 'initial' ? 'slow' : prev)), longLoadMs);
    const coldTimer = setTimeout(() => setStage('cold'), coldStartMs);

    return () => {
      clearInterval(tick);
      clearTimeout(longTimer);
      clearTimeout(coldTimer);
    };
  }, [loading, longLoadMs, coldStartMs]);

  if (!loading) return null;

  const message =
    stage === 'cold'
      ? 'Still waking up the server…'
      : stage === 'slow'
        ? 'Render is taking a while to load up…'
        : 'Loading data…';

  return (
    <Box
      role="alert"
      aria-live="polite"
      aria-busy="true"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 20, 18, 0.35)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        zIndex: 9999,
        px: 2,
        textAlign: 'center',
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="body2" sx={{ color: '#f7f6f2' }}>
        {message}
      </Typography>

      <Fade in={stage !== 'initial'} timeout={400} unmountOnExit>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mt: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            maxWidth: 460,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#f7f6f2', lineHeight: 1.4 }}>
            {stage === 'cold'
              ? `Hang tight — the backend may be cold-starting (${elapsed}s elapsed).`
              : 'First request after idle can be slow.'}
          </Typography>
          <Tooltip
            arrow
            enterTouchDelay={0}
            leaveTouchDelay={6000}
            title={FREE_TIER_INFO}
            componentsProps={{
              tooltip: {
                sx: { fontSize: 12, maxWidth: 320, lineHeight: 1.5, p: 1.25 },
              },
            }}
          >
            <InfoOutlinedIcon
              fontSize="small"
              aria-label="Why is this slow?"
              sx={{ color: '#f7f6f2', cursor: 'help', flexShrink: 0 }}
            />
          </Tooltip>
        </Stack>
      </Fade>
    </Box>
  );
}

export default LoadingOverlay;
