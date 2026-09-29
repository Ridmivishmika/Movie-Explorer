import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LaunchIcon from '@mui/icons-material/Launch';

const TrailerModal = ({ open, onClose, trailerKey, movieTitle }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#090d16',
          backgroundImage: 'none',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlayCircleIcon sx={{ color: 'primary.light' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {movieTitle ? `${movieTitle} - Trailer` : 'Movie Trailer'}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'grey.500',
            '&:hover': { color: '#ffffff' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: '#000000', display: 'flex', justifyContent: 'center' }}>
        {trailerKey ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 Aspect Ratio
            }}
          >
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        ) : (
          <Box
            sx={{
              py: 8,
              px: 3,
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Typography variant="body1" sx={{ color: 'grey.400', mb: 2 }}>
              No official embedded trailer was returned for this movie.
            </Typography>
            {movieTitle && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LaunchIcon />}
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${movieTitle} official trailer`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Search on YouTube
              </Button>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
