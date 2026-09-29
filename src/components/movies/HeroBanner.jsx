import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WhatshotIcon from '@mui/icons-material/Whatshot';

import { getBackdropUrl, fetchMovieDetails, getTrailerKey } from '../../api/tmdb';
import { useFavorites } from '../../context/FavoritesContext';
import TrailerModal from './TrailerModal';

const HeroBanner = ({
  movie,
  timeWindow = 'day',
  onTimeWindowChange,
}) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  if (!movie) return null;

  const { id, title, backdrop_path, overview, release_date, vote_average } = movie;
  const year = release_date ? release_date.split('-')[0] : '';
  const rating = vote_average ? Number(vote_average).toFixed(1) : 'NR';
  const backdropUrl = getBackdropUrl(backdrop_path);
  const favorited = isFavorite(id);

  const handleWatchTrailer = async () => {
    setLoadingTrailer(true);
    try {
      const details = await fetchMovieDetails(id);
      const key = getTrailerKey(details.videos?.results || []);
      setTrailerKey(key);
      setTrailerOpen(true);
    } catch (err) {
      console.error('Error fetching trailer for hero movie:', err);
      setTrailerOpen(true);
    } finally {
      setLoadingTrailer(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        minHeight: { xs: 360, sm: 440, md: 500 },
        display: 'flex',
        alignItems: 'flex-end',
        mb: 4,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 16px 40px rgba(0, 0, 0, 0.6)'
            : '0 16px 30px rgba(0, 0, 0, 0.1)',
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Cinematic Gradient Overlays */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(to top, rgba(11, 15, 25, 0.98) 0%, rgba(11, 15, 25, 0.75) 45%, rgba(11, 15, 25, 0.3) 100%)'
              : 'linear-gradient(to top, rgba(248, 250, 252, 0.98) 0%, rgba(248, 250, 252, 0.8) 45%, rgba(248, 250, 252, 0.35) 100%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(to right, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.5) 60%, transparent 100%)'
              : 'linear-gradient(to right, rgba(248, 250, 252, 0.95) 0%, rgba(248, 250, 252, 0.5) 60%, transparent 100%)',
        }}
      />

      {/* Top Bar inside Banner: Trending Switcher */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 20 },
          right: { xs: 16, sm: 24 },
          zIndex: 2,
        }}
      >
        <ToggleButtonGroup
          value={timeWindow}
          exclusive
          onChange={(e, val) => val && onTimeWindowChange && onTimeWindowChange(val)}
          size="small"
          sx={{
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <ToggleButton value="day" sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
            Today
          </ToggleButton>
          <ToggleButton value="week" sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
            This Week
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Hero Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          p: { xs: 3, sm: 4, md: 5 },
          maxWidth: { xs: '100%', md: '75%', lg: '65%' },
        }}
      >
        {/* Featured Tag & Rating */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            icon={<WhatshotIcon sx={{ color: '#ef4444 !important', fontSize: 16 }} />}
            label="Trending #1 Spotlight"
            size="small"
            sx={{
              bgcolor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: '0.75rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          />
          <Chip
            icon={<StarIcon sx={{ color: '#fbbf24 !important', fontSize: 16 }} />}
            label={`${rating} Rating`}
            size="small"
            sx={{
              bgcolor: 'rgba(251, 191, 36, 0.15)',
              color: 'warning.main',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
          {year && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {year}
            </Typography>
          )}
        </Stack>

        {/* Title */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            lineHeight: 1.15,
            mb: 1.5,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>

        {/* Overview Excerpt */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.88rem', sm: '0.98rem' },
            lineHeight: 1.6,
            mb: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, sm: 3 },
            WebkitBoxOrient: 'vertical',
          }}
        >
          {overview}
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleWatchTrailer}
            disabled={loadingTrailer}
            sx={{
              px: 3,
              py: 1.1,
              borderRadius: 3,
              fontWeight: 700,
            }}
          >
            {loadingTrailer ? 'Loading...' : 'Watch Trailer'}
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<InfoOutlinedIcon />}
            onClick={() => navigate(`/movie/${id}`)}
            sx={{
              px: 2.5,
              py: 1.1,
              borderRadius: 3,
              fontWeight: 600,
              borderColor: 'divider',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            View Details
          </Button>

          <Tooltip title={favorited ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              onClick={() => toggleFavorite(movie)}
              sx={{
                p: 1.2,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                color: favorited ? '#ef4444' : 'text.secondary',
                '&:hover': {
                  color: '#ef4444',
                  transform: 'scale(1.08)',
                },
              }}
            >
              {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Trailer Dialog Modal */}
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerKey={trailerKey}
        movieTitle={title}
      />
    </Box>
  );
};

export default HeroBanner;
