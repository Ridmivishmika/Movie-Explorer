import React, { useEffect, useRef } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import MovieCard from './MovieCard';
import LoadingSkeleton from '../common/LoadingSkeleton';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MovieGrid = ({
  movies = [],
  loading = false,
  error = null,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  infiniteScroll = false,
  onToggleInfiniteScroll,
  onRetry,
  emptyMessage = 'No movies found.',
  onClearFilters,
}) => {
  const observerRef = useRef(null);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (!infiniteScroll || !hasMore || loadingMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          if (onLoadMore) onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [infiniteScroll, hasMore, loadingMore, loading, onLoadMore]);

  // Initial Loading state
  if (loading && (!movies || movies.length === 0)) {
    return <LoadingSkeleton count={10} />;
  }

  // Error state
  if (error && (!movies || movies.length === 0)) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
                Retry
              </Button>
            )
          }
          sx={{ borderRadius: 3 }}
        >
          <AlertTitle>Unable to load movies</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  // Empty state
  if (!loading && (!movies || movies.length === 0)) {
    return (
      <Box
        sx={{
          py: 8,
          px: 2,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 4,
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
        <Typography variant="h6" fontWeight={700} gutterBottom>
          No Movies Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mb: 2 }}>
          {emptyMessage}
        </Typography>
        {onClearFilters && (
          <Button variant="outlined" color="primary" onClick={onClearFilters}>
            Clear Search & Filters
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
        {movies.map((movie) => (
          <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} sx={{ display: 'flex' }}>
            <MovieCard movie={movie} />
          </Grid>
        ))}

      </Grid>

      {/* Pagination & Load More Controls */}
      {movies.length > 0 && (
        <Box sx={{ mt: 5, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Action Button */}
          {hasMore ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onLoadMore}
              disabled={loadingMore}
              startIcon={loadingMore ? <CircularProgress size={20} color="inherit" /> : <ExpandMoreIcon />}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 3,
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              }}
            >
              {loadingMore ? 'Loading More Movies...' : 'Load More Movies'}
            </Button>
          ) : (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                No more movies to load
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;
