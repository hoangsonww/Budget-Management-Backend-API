import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

// Simple keyframe animation using Material-UI styled components or inline style
// Here we'll just show an inline style example for a wobble animation of the "404" text
const wobbleAnimation = {
  '@keyframes wobble': {
    '0%': { transform: 'translateX(0%)' },
    '25%': { transform: 'translateX(-5%)' },
    '50%': { transform: 'translateX(5%)' },
    '75%': { transform: 'translateX(-5%)' },
    '100%': { transform: 'translateX(0%)' },
  },
};

function NotFound() {
  return (
    <Container
      sx={{
        mt: 4,
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
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ textTransform: 'none' }}>
        Go Back Home
      </Button>
    </Container>
  );
}

export default NotFound;
