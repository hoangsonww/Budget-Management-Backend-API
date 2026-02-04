import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingOverlay({ loading }) {
  if (!loading) return null;
  return (
    <Box
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
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="body2" sx={{ color: '#f7f6f2' }}>
        Loading data…
      </Typography>
    </Box>
  );
}

export default LoadingOverlay;
