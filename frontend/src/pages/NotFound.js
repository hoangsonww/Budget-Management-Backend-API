import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const wobbleAnimation = {
  '@keyframes wobble': {
    '0%': { transform: 'translateX(0%)' },
    '25%': { transform: 'translateX(-4%)' },
    '50%': { transform: 'translateX(4%)' },
    '75%': { transform: 'translateX(-4%)' },
    '100%': { transform: 'translateX(0%)' },
  },
};

function NotFound() {
  return (
    <Container
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          fontSize: '6rem',
          fontWeight: 'bold',
          mb: 2,
          animation: 'wobble 1s ease-in-out infinite',
          ...wobbleAnimation,
        }}
      >
        404
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
        The page you are trying to reach does not exist. Return to the main workspace or head back to the dashboard.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="contained" component={Link} to="/" sx={{ textTransform: 'none' }}>
          Go Back Home
        </Button>
        <Button variant="outlined" component={Link} to="/dashboard" sx={{ textTransform: 'none' }}>
          Go to Dashboard
        </Button>
      </Stack>
    </Container>
  );
}

export default NotFound;
