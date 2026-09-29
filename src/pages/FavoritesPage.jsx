import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Card,
  Tooltip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ExploreIcon from '@mui/icons-material/Explore';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HistoryIcon from '@mui/icons-material/History';

import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/movies/MovieCard';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favorites, favoritesCount, clearAllFavorites } = useFavorites();
  const { lastSearchedMovie, handleSearchSubmit } = useMovies();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleConfirmClear = () => {
    clearAllFavorites();
    setClearDialogOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Card
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              bgcolor: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#ef4444', fontSize: 36 }} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.6 }}>
            Please sign in to your account to view your saved favorite movies.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/login"
            state={{ from: '/favorites', message: 'Please sign in to view your favorite movies.' }}
            size="large"
            sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 700 }}
          >
            Sign In Now
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FavoriteIcon sx={{ color: '#ef4444', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={800}>
              My Favorite Movies
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saved for your personal watchlist
            </Typography>
          </Box>
          <Chip
            label={`${favoritesCount} saved`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />

          {/* Latest searched movie in top of Favorites page */}
          {lastSearchedMovie && (
            <Tooltip title={`Search again for "${lastSearchedMovie}"`}>
              <Chip
                icon={<HistoryIcon sx={{ fontSize: 16 }} />}
                label={`Latest Search: ${lastSearchedMovie}`}
                clickable
                onClick={() => {
                  handleSearchSubmit(lastSearchedMovie);
                  navigate('/');
                }}
                color="secondary"
                variant="outlined"
                sx={{ fontWeight: 700, cursor: 'pointer', ml: { sm: 1 } }}
              />
            </Tooltip>
          )}
        </Box>

        {favoritesCount > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={() => setClearDialogOpen(true)}
            size="small"
            sx={{ borderRadius: 2.5 }}
          >
            Clear All
          </Button>
        )}
      </Box>


      {/* Favorites Content or Empty State */}
      {favoritesCount === 0 ? (
        <Box
          sx={{
            py: 10,
            px: 3,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 4,
            border: '1px dashed',
            borderColor: 'divider',
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          <FavoriteIcon
            sx={{
              fontSize: 72,
              color: 'text.secondary',
              opacity: 0.3,
              mb: 2,
            }}
          />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Your Favorites List is Empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ExploreIcon />}
            component={RouterLink}
            to="/"
            size="large"
            sx={{ mt: 1, borderRadius: 3, px: 3.5 }}
          >
            Explore Movies
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          {favorites.map((movie) => (
            <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} sx={{ display: 'flex' }}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>

      )}

      {/* Clear Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Clear all favorites?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This remove all {favoritesCount} movies from your favorites.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setClearDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmClear} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FavoritesPage;
