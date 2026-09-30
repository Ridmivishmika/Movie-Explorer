import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFavorites } from '../../context/FavoritesContext';

const LoginPromptDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingMovie } = useFavorites();

  const handleLoginClick = () => {
    onClose();
    const movieNotice = pendingMovie?.title
      ? `Please login to add "${pendingMovie.title}" to your favorites.`
      : 'Please login to save movies to your favorites.';
    navigate('/login', {
      state: {
        from: '/favorites',
        message: movieNotice,
      },
    });
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(239, 68, 68, 0.2)'
              : '0 20px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="close"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: 'text.secondary',
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ textAlign: 'center', pt: 2, pb: 1 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            position: 'relative',
          }}
        >
          <FavoriteIcon sx={{ color: '#ef4444', fontSize: 32 }} />
          <Box
            sx={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 14 }} />
          </Box>
        </Box>

        <DialogTitle sx={{ p: 0, fontWeight: 800, fontSize: '1.35rem', mb: 1 }}>
          Login
        </DialogTitle>

        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ px: 1, lineHeight: 1.6 }}>
            {pendingMovie?.title ? (
              <>
                Please login to add <strong>"{pendingMovie.title}"</strong> to your favorites.
              </>
            ) : (
              'Please login to save movies to your favorites list.'
            )}
          </Typography>
        </DialogContent>


        <DialogActions sx={{ p: 0, gap: 1.5, justifyContent: 'center' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 3,
              px: 3,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLoginClick}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 3,
              px: 3.5,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            }}
          >
            Login
          </Button>
        </DialogActions>

      </Box>
    </Dialog>
  );
};

export default LoginPromptDialog;
