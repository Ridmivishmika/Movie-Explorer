import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getImageUrl } from '../../api/tmdb';
import { useFavorites } from '../../context/FavoritesContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!movie) return null;

  const { id, title, poster_path, release_date, vote_average } = movie;
  const year = release_date ? release_date.split('-')[0] : 'N/A';
  const rating = vote_average ? Number(vote_average).toFixed(1) : 'NR';
  const favorited = isFavorite(id);

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 12px 28px rgba(0, 0, 0, 0.7), 0 0 16px rgba(99, 102, 241, 0.25)'
              : '0 12px 28px rgba(0, 0, 0, 0.12)',
          borderColor: 'primary.main',
          '& .movie-poster': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Poster Image Container */}
      <Box sx={{ position: 'relative', paddingTop: '150%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={getImageUrl(poster_path, 'w500')}
          alt={title}
          className="movie-poster"
          loading="lazy"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
          }}
        />

        {/* Gradient Overlay at Bottom of Image */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Favorite Heart Button */}
        <Tooltip title={favorited ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(6px)',
              color: favorited ? '#ef4444' : '#ffffff',
              transition: 'all 0.2s ease',
              p: 0.9,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                transform: 'scale(1.15)',
              },
            }}
          >
            {favorited ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {/* Rating Badge */}
        <Chip
          icon={<StarIcon sx={{ color: '#fbbf24 !important', fontSize: '15px !important' }} />}
          label={rating}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            color: '#f8fafc',
            fontWeight: 700,
            fontSize: '0.78rem',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            px: 0.3,
          }}
        />
      </Box>

      {/* Card Content: Title & Year */}
      <CardContent sx={{ p: 1.5, pb: '12px !important', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography
          variant="subtitle2"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: '0.92rem',
            lineHeight: 1.3,
            minHeight: '2.6em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 0.5,
          }}
          title={title}
        >
          {title}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {year}
        </Typography>
      </CardContent>
    </Card>

  );
};

export default MovieCard;
