import React from 'react';
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useMovies } from '../context/MovieContext';
import HeroBanner from '../components/movies/HeroBanner';
import SearchBar from '../components/movies/SearchBar';
import FilterBar from '../components/movies/FilterBar';
import MovieGrid from '../components/movies/MovieGrid';

const HomePage = () => {
  const {
    activeMode,
    trendingMovies,
    trendingTimeWindow,
    changeTrendingTimeWindow,
    searchQuery,
    searchResults,
    currentMovies,
    currentLoading,
    currentError,
    hasMore,
    loadingMore,
    loadMore,
    infiniteScrollEnabled,
    toggleInfiniteScroll,
    resetFilters,
    loadTrending,
    handleSearchSubmit,
  } = useMovies();

  // Top trending movie for the Hero spotlight
  const spotlightMovie = trendingMovies && trendingMovies.length > 0 ? trendingMovies[0] : null;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      {/* Hero Banner (Shown when not actively searching or filtering) */}
      {activeMode === 'trending' && spotlightMovie && (
        <HeroBanner
          movie={spotlightMovie}
          timeWindow={trendingTimeWindow}
          onTimeWindowChange={changeTrendingTimeWindow}
        />
      )}

      {/* Search Input Section */}
      <Box sx={{ mb: 2 }}>
        <SearchBar />
      </Box>

      {/* Filter and Discovery Controls */}
      <FilterBar />

      {/* Section Header with Context Information */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {activeMode === 'search' && (
            <>
              <SearchIcon color="primary" />
              <Typography variant="h5" component="h2" fontWeight={800}>
                Search Results
              </Typography>
              <Chip
                label={`"${searchQuery}"`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">
                ({searchResults.length} loaded)
              </Typography>
            </>
          )}

          {activeMode === 'filter' && (
            <>
              <FilterListIcon color="primary" />
              <Typography variant="h5" component="h2" fontWeight={800}>
                Filtered Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({currentMovies.length} movies)
              </Typography>
            </>
          )}

          {activeMode === 'trending' && (
            <>
              <WhatshotIcon sx={{ color: '#ef4444' }} />
              <Typography variant="h5" component="h2" fontWeight={800}>
                {trendingTimeWindow === 'day' ? 'Trending Today' : 'Trending This Week'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Popular picks)
              </Typography>
            </>
          )}
        </Box>

        {activeMode !== 'trending' && (
          <Button
            size="small"
            variant="text"
            color="primary"
            onClick={resetFilters}
            sx={{ fontWeight: 600 }}
          >
            ← Back to Trending
          </Button>
        )}
      </Box>

      {/* Main Movies Grid */}
      <MovieGrid
        movies={currentMovies}
        loading={currentLoading}
        error={currentError}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
        infiniteScroll={infiniteScrollEnabled}
        onToggleInfiniteScroll={toggleInfiniteScroll}
        onRetry={() => {
          if (activeMode === 'search') {
            handleSearchSubmit(searchQuery);
          } else {
            loadTrending(trendingTimeWindow);
          }
        }}
        emptyMessage={
          activeMode === 'search'
            ? `No movies matched your search for "${searchQuery}". Please try another title or keyword.`
            : 'No movies match the selected filters. '
        }
        onClearFilters={resetFilters}
      />
    </Container>
  );
};

export default HomePage;
