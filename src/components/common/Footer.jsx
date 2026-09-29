import React from 'react';
import { Box, Container, Typography, Stack, Divider, Chip } from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link as RouterLink } from 'react-router-dom';

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, sm: 5 },
        px: 2,
        mt: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          textAlign={{ xs: 'center', md: 'left' }}
        >
          {/* Brand & Creator section */}
          <Box sx={{ maxWidth: 380 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.2,
                mb: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                }}
              >
                <MovieFilterIcon sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                Movie Explorer
              </Typography>
            </Box>

            <Chip
              label="Designed & Developed by Ridmi Abeysiri"
              size="small"
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: 600,
                fontSize: '0.78rem',
                borderRadius: 2,
                py: 0.4,
              }}
            />
          </Box>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={{ xs: 2.5, sm: 3.5 }}
            alignItems="center"
            sx={{ pt: { xs: 1, md: 1.5 } }}
          >
            <Typography
              component={RouterLink}
              to="/"
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                transition: 'color 0.2s ease',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <HomeIcon sx={{ fontSize: 17 }} /> Home
            </Typography>

            <Typography
              component={RouterLink}
              to="/"
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                transition: 'color 0.2s ease',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 17 }} /> Trending
            </Typography>

            <Typography
              component={RouterLink}
              to="/favorites"
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                transition: 'color 0.2s ease',
                '&:hover': { color: 'error.main' },
              }}
            >
              <FavoriteIcon sx={{ fontSize: 16, color: '#ef4444' }} /> Favorites
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, opacity: 0.6 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {currentYear} Movie Explorer. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
