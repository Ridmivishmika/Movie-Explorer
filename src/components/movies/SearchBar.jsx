import React, { useState, useEffect } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import { useMovies } from '../../context/MovieContext';

const SearchBar = () => {
  const {
    searchQuery,
    handleSearchChange,
    handleSearchSubmit,
    lastSearchedMovie,
  } = useMovies();

  const [localInput, setLocalInput] = useState(searchQuery || '');

  // Keep localInput synced with context
  useEffect(() => {
    setLocalInput(searchQuery || '');
  }, [searchQuery]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalInput(val);
    handleSearchChange(val);
  };

  const handleClear = () => {
    setLocalInput('');
    handleSearchChange('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchSubmit(localInput);
  };

  const handleLastSearchClick = () => {
    if (lastSearchedMovie) {
      setLocalInput(lastSearchedMovie);
      handleSearchSubmit(lastSearchedMovie);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 4,
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.75)' : '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(10px)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
          },
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 24 }} />
        <InputBase
          sx={{ ml: 0.5, flex: 1, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
          placeholder="Search movies by title (e.g. Inception, Avatar, Batman)..."
          inputProps={{ 'aria-label': 'search movies by title' }}
          value={localInput}
          onChange={handleChange}
        />
        {localInput && (
          <Tooltip title="Clear search">
            <IconButton size="small" onClick={handleClear} sx={{ p: 0.8, color: 'text.secondary' }}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          type="submit"
          sx={{
            p: 1,
            ml: 0.5,
            bgcolor: 'primary.main',
            color: '#ffffff',
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
          aria-label="search"
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Paper>

      {/* Last Searched Movie persistence indicator (Assignment Requirement) */}
      {lastSearchedMovie && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1.2,
            px: 0.5,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Last searched:
            </Typography>
          </Box>
          <Chip
            label={lastSearchedMovie}
            size="small"
            clickable
            onClick={handleLastSearchClick}
            variant="outlined"
            color="primary"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
