import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import TuneIcon from '@mui/icons-material/Tune';
import { useMovies } from '../../context/MovieContext';

const currentYear = new Date().getFullYear();
const yearsList = ['all', ...Array.from({ length: 25 }, (_, i) => String(currentYear - i))];

const FilterBar = () => {
  const {
    genres,
    filters,
    updateFilters,
    resetFilters,
  } = useMovies();

  const handleGenreChange = (e) => {
    updateFilters({ genreId: e.target.value });
  };

  const handleYearChange = (e) => {
    updateFilters({ year: e.target.value });
  };

  const handleRatingChange = (e) => {
    updateFilters({ minRating: Number(e.target.value) });
  };

  const handleSortChange = (e) => {
    updateFilters({ sortBy: e.target.value });
  };

  const isFiltered =
    filters.genreId !== 'all' ||
    filters.year !== 'all' ||
    filters.minRating > 0 ||
    filters.sortBy !== 'popularity.desc';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        borderRadius: 3.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 15px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TuneIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" fontWeight={700}>
            Filter & Discover
          </Typography>
          {isFiltered && (
            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
              (Active Filters)
            </Typography>
          )}
        </Box>


      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        flexWrap="wrap"
      >
        {/* Genre Selector */}
        <FormControl size="small" sx={{ minWidth: 140, flex: { xs: 1, sm: 'initial' } }}>
          <InputLabel id="genre-select-label">Genre</InputLabel>
          <Select
            labelId="genre-select-label"
            value={filters.genreId}
            label="Genre"
            onChange={handleGenreChange}
          >
            <MenuItem value="all">All Genres</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Release Year Selector */}
        <FormControl size="small" sx={{ minWidth: 120, flex: { xs: 1, sm: 'initial' } }}>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={filters.year}
            label="Year"
            onChange={handleYearChange}
          >
            <MenuItem value="all">All Years</MenuItem>
            {yearsList.slice(1).map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Rating Selector */}
        <FormControl size="small" sx={{ minWidth: 130, flex: { xs: 1, sm: 'initial' } }}>
          <InputLabel id="rating-select-label">Min Rating</InputLabel>
          <Select
            labelId="rating-select-label"
            value={filters.minRating}
            label="Min Rating"
            onChange={handleRatingChange}
          >
            <MenuItem value={0}>All Ratings</MenuItem>
            <MenuItem value={8}>8+ ★ Exceptional</MenuItem>
            <MenuItem value={7}>7+ ★ Great</MenuItem>
            <MenuItem value={6}>6+ ★ Good</MenuItem>
            <MenuItem value={5}>5+ ★ Average</MenuItem>
          </Select>
        </FormControl>

        {/* Sort By Selector */}
        <FormControl size="small" sx={{ minWidth: 160, flex: { xs: 1, sm: 'initial' } }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={filters.sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="popularity.desc">Most Popular</MenuItem>
            <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
            <MenuItem value="primary_release_date.desc">Release Date (Newest)</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filters Button */}
        {isFiltered && (
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<FilterAltOffIcon />}
            onClick={resetFilters}
            sx={{ borderRadius: 2.5, whiteSpace: 'nowrap' }}
          >
            Reset
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default FilterBar;
