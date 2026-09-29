import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '6rem', sm: '8rem' },
          fontWeight: 900,
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
        The movie or page you are looking for doesn't exist or has been relocated.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<HomeIcon />}
        component={RouterLink}
        to="/"
        sx={{ borderRadius: 3, px: 3.5, py: 1.2 }}
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
