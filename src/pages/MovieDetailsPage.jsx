import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Skeleton,
  Alert,
  Divider,
  Stack,
  CardMedia,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShareIcon from '@mui/icons-material/Share';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HistoryIcon from '@mui/icons-material/History';

import {
  fetchMovieDetails,
  getImageUrl,
  getBackdropUrl,
  getTrailerKey,
} from '../api/tmdb';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useMovies } from '../context/MovieContext';
import CastList from '../components/movies/CastList';
import MovieCard from '../components/movies/MovieCard';
import TrailerModal from '../components/movies/TrailerModal';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { lastSearchedMovie, handleSearchSubmit } = useMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const data = await fetchMovieDetails(id);
        if (isMounted) {
          setMovie(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load movie details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Undisclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 4, mb: 4 }} />
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !movie) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error || 'Movie not found.'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Movies
        </Button>
      </Container>
    );
  }

  const {
    title,
    tagline,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
    genres = [],
    credits = {},
    videos = {},
    similar = {},
    budget,
    revenue,
    spoken_languages = [],
  } = movie;

  const trailerKey = getTrailerKey(videos?.results || []);
  const favorited = isFavorite(movie.id);
  const releaseYear = release_date ? release_date.split('-')[0] : '';
  const backdropUrl = getBackdropUrl(backdrop_path);
  const similarMovies = (similar?.results?.length ? similar.results : movie.recommendations?.results || []).slice(0, 10);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Backdrop Header with Backdrop Image */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 260, sm: 360, md: 440 },
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(to bottom, rgba(11, 15, 25, 0.4) 0%, rgba(11, 15, 25, 0.9) 70%, #0b0f19 100%)'
                : 'linear-gradient(to bottom, rgba(248, 250, 252, 0.4) 0%, rgba(248, 250, 252, 0.9) 70%, #f8fafc 100%)',
          }}
        />

        {/* Back Button Navigation and User Latest Search */}
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 2,
            pt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="contained"
            color="inherit"
            size="small"
            sx={{
              borderRadius: 3,
              bgcolor: 'background.paper',
              color: 'text.primary',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontWeight: 600,
            }}
          >
            Back
          </Button>

          {/* User's Latest Search on Movie Details page */}
          {isAuthenticated && lastSearchedMovie && (
            <Tooltip title={`Search again for "${lastSearchedMovie}"`}>
              <Chip
                icon={<HistoryIcon sx={{ fontSize: 16 }} />}
                label={`Latest Search: ${lastSearchedMovie}`}
                clickable
                onClick={() => {
                  handleSearchSubmit(lastSearchedMovie);
                  navigate('/');
                }}
                color="primary"
                variant="filled"
                sx={{
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
          )}
        </Container>
      </Box>


      {/* Main Content Info Container */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, mt: { xs: -12, md: -20 } }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* Left Column: Poster & Actions */}
          <Grid size={{ xs: 12, sm: 4, md: 3.5 }}>
            <Box
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 16px 40px rgba(0, 0, 0, 0.8)'
                    : '0 16px 35px rgba(0, 0, 0, 0.15)',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <CardMedia
                component="img"
                image={getImageUrl(poster_path, 'w500')}
                alt={title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </Box>

            {/* Quick Action Buttons */}
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => setTrailerOpen(true)}
                fullWidth
                sx={{ py: 1.2, fontWeight: 700, borderRadius: 3 }}
              >
                {trailerKey ? 'Watch Official Trailer' : 'Search Trailer'}
              </Button>

              <Button
                variant={favorited ? 'outlined' : 'contained'}
                color={favorited ? 'error' : 'secondary'}
                size="large"
                startIcon={favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => toggleFavorite(movie)}
                fullWidth
                sx={{ py: 1.2, fontWeight: 700, borderRadius: 3 }}
              >
                {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </Stack>

            {/* Movie Quick Stats Card */}
            <Paper
              sx={{
                p: 2.5,
                mt: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Movie Facts
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Budget
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(budget)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Revenue
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(revenue)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {movie.status || 'Released'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Language
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {spoken_languages[0]?.english_name || movie.original_language?.toUpperCase() || 'English'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column: Title, Metadata, Overview, Cast */}
          <Grid size={{ xs: 12, sm: 8, md: 8.5 }}>
            {/* Title & Tagline */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.15,
                  mb: 1,
                }}
              >
                {title} {releaseYear && <span style={{ opacity: 0.6 }}>({releaseYear})</span>}
              </Typography>

              {tagline && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', mb: 2 }}
                >
                  "{tagline}"
                </Typography>
              )}

              {/* Genre Chips */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
                {genres.map((g) => (
                  <Chip
                    key={g.id}
                    label={g.name}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Stack>

              {/* Badges: Rating, Release Date, Runtime */}
              <Stack
                direction="row"
                spacing={2.5}
                alignItems="center"
                flexWrap="wrap"
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <StarIcon sx={{ color: '#fbbf24', fontSize: 24 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} lineHeight={1}>
                      {vote_average ? Number(vote_average).toFixed(1) : 'NR'} / 10
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vote_count ? `${vote_count.toLocaleString()} votes` : 'No votes'}
                    </Typography>
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>
                    {formatRuntime(runtime)}
                  </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>
                    {release_date || 'Release date unknown'}
                  </Typography>
                </Box>

                <Box sx={{ ml: 'auto !important' }}>
                  <Tooltip title={copiedLink ? 'Link copied to clipboard!' : 'Share movie'}>
                    <IconButton onClick={handleShare} size="small" color="inherit">
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </Box>

            {/* Overview / Plot */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Synopsis
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, fontSize: '1rem' }}
              >
                {overview || 'No synopsis is available for this movie.'}
              </Typography>
            </Box>

            {/* Cast Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Top Cast
              </Typography>
              <CastList cast={credits?.cast} />
            </Box>
          </Grid>
        </Grid>

        {/* Similar / Recommended Movies */}
        {similarMovies.length > 0 && (
          <Box sx={{ mt: 7, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AutoAwesomeIcon color="primary" />
              <Typography variant="h5" component="h2" fontWeight={800}>
                You Might Also Like
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Similar titles)
              </Typography>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
              {similarMovies.map((similarMovie) => (
                <Grid key={similarMovie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} sx={{ display: 'flex' }}>
                  <MovieCard movie={similarMovie} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

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

export default MovieDetailsPage;
