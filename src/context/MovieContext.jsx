import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchTrendingMovies,
  searchMovies,
  discoverFilteredMovies,
  fetchGenres,
} from '../api/tmdb';
import { useAuth } from './AuthContext';

const MovieContext = createContext(null);

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Mode: 'trending' | 'search' | 'filter'
  const [activeMode, setActiveMode] = useState('trending');

  // Genres
  const [genres, setGenres] = useState([]);

  // Trending Movies
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTimeWindow, setTrendingTimeWindow] = useState('day');
  const [trendingPage, setTrendingPage] = useState(1);
  const [trendingTotalPages, setTrendingTotalPages] = useState(1);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Last searched movie stored in localStorage (per user if authenticated)
  const [lastSearchedMovie, setLastSearchedMovie] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('movie_explorer_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      if (savedUser?.username) {
        const userSearch = localStorage.getItem(`movie_explorer_last_search_${savedUser.username}`);
        if (userSearch) return userSearch;
      }
      return localStorage.getItem('movie_explorer_last_search') || '';
    } catch {
      return '';
    }
  });

  // Keep lastSearchedMovie in sync with user state
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      const userKey = `movie_explorer_last_search_${user.username}`;
      const savedUserSearch = localStorage.getItem(userKey);
      if (savedUserSearch) {
        setLastSearchedMovie(savedUserSearch);
      } else {
        const genericSearch = localStorage.getItem('movie_explorer_last_search') || '';
        if (genericSearch) {
          localStorage.setItem(userKey, genericSearch);
          setLastSearchedMovie(genericSearch);
        }
      }
    } else {
      const genericSearch = localStorage.getItem('movie_explorer_last_search') || '';
      setLastSearchedMovie(genericSearch);
    }
  }, [isAuthenticated, user?.username]);

  // Filters (Bonus requirement)
  const [filters, setFilters] = useState({
    genreId: 'all',
    year: 'all',
    minRating: 0,
    sortBy: 'popularity.desc',
  });
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filterPage, setFilterPage] = useState(1);
  const [filterTotalPages, setFilterTotalPages] = useState(1);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  // Infinite Scroll toggle (Bonus requirement allows Load More or Infinite Scroll)
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(() => {
    return localStorage.getItem('movie_explorer_infinite_scroll') === 'true';
  });

  const [loadingMore, setLoadingMore] = useState(false);

  // Keep track of search debounce
  const searchTimeoutRef = useRef(null);

  // Load genres on mount
  useEffect(() => {
    let isMounted = true;
    const loadGenres = async () => {
      try {
        const list = await fetchGenres();
        if (isMounted) setGenres(list);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    loadGenres();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch trending movies
  const loadTrending = useCallback(async (timeWindow = 'day', page = 1, append = false) => {
    if (!append) {
      setTrendingLoading(true);
    } else {
      setLoadingMore(true);
    }
    setTrendingError(null);
    try {
      const data = await fetchTrendingMovies(timeWindow, page);
      setTrendingTotalPages(data.total_pages || 1);
      setTrendingPage(page);

      if (append) {
        setTrendingMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newUnique = (data.results || []).filter((m) => !existingIds.has(m.id));
          return [...prev, ...newUnique];
        });
      } else {
        setTrendingMovies(data.results || []);
      }
    } catch (err) {
      setTrendingError(err.message || 'Failed to load trending movies');
    } finally {
      setTrendingLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTrending(trendingTimeWindow, 1, false);
  }, [loadTrending, trendingTimeWindow]);

  // Execute Search
  const executeSearch = useCallback(
    async (query, page = 1, append = false) => {
      if (!query || !query.trim()) {
        setSearchResults([]);
        setActiveMode('trending');
        return;
      }

      const trimmedQuery = query.trim();
      setActiveMode('search');
      if (!append) {
        setSearchLoading(true);
      } else {
        setLoadingMore(true);
      }
      setSearchError(null);

      try {
        const data = await searchMovies(trimmedQuery, page);
        setSearchTotalPages(data.total_pages || 1);
        setSearchPage(page);

        if (append) {
          setSearchResults((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newUnique = (data.results || []).filter((m) => !existingIds.has(m.id));
            return [...prev, ...newUnique];
          });
        } else {
          setSearchResults(data.results || []);
          // Save last searched movie to local storage
          if (isAuthenticated && user?.username) {
            localStorage.setItem(`movie_explorer_last_search_${user.username}`, trimmedQuery);
          }
          localStorage.setItem('movie_explorer_last_search', trimmedQuery);
          setLastSearchedMovie(trimmedQuery);
        }
      } catch (err) {
        setSearchError(err.message || 'Error occurred while searching.');
      } finally {
        setSearchLoading(false);
        setLoadingMore(false);
      }
    },
    [isAuthenticated, user]
  );


  // Execute Filter Discover
  const executeFilter = useCallback(
    async (currentFilters, page = 1, append = false) => {
      const isFilterActive =
        currentFilters.genreId !== 'all' ||
        currentFilters.year !== 'all' ||
        currentFilters.minRating > 0 ||
        currentFilters.sortBy !== 'popularity.desc';

      if (!isFilterActive) {
        setActiveMode('trending');
        return;
      }

      setActiveMode('filter');
      if (!append) {
        setFilterLoading(true);
      } else {
        setLoadingMore(true);
      }
      setFilterError(null);

      try {
        const data = await discoverFilteredMovies({
          genreId: currentFilters.genreId,
          year: currentFilters.year,
          minRating: currentFilters.minRating,
          sortBy: currentFilters.sortBy,
          page,
        });

        setFilterTotalPages(data.total_pages || 1);
        setFilterPage(page);

        if (append) {
          setFilteredMovies((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newUnique = (data.results || []).filter((m) => !existingIds.has(m.id));
            return [...prev, ...newUnique];
          });
        } else {
          setFilteredMovies(data.results || []);
        }
      } catch (err) {
        setFilterError(err.message || 'Error discovering movies with filters.');
      } finally {
        setFilterLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Trigger search with debounce
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      if (
        filters.genreId !== 'all' ||
        filters.year !== 'all' ||
        filters.minRating > 0
      ) {
        setActiveMode('filter');
      } else {
        setActiveMode('trending');
      }
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      executeSearch(query, 1, false);
    }, 450);
  };

  // Immediate search submit
  const handleSearchSubmit = (query) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    const q = query !== undefined ? query : searchQuery;
    setSearchQuery(q);
    executeSearch(q, 1, false);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      genreId: 'all',
      year: 'all',
      minRating: 0,
      sortBy: 'popularity.desc',
    };
    setFilters(defaultFilters);
    if (searchQuery.trim()) {
      setActiveMode('search');
    } else {
      setActiveMode('trending');
    }
  };

  // Update a single filter or multiple
  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    executeFilter(updated, 1, false);
  };

  // Switch trending window
  const changeTrendingTimeWindow = (window) => {
    setTrendingTimeWindow(window);
    setTrendingPage(1);
    loadTrending(window, 1, false);
  };

  // Load More (Button or Infinite Scroll)
  const loadMore = () => {
    if (loadingMore) return;

    if (activeMode === 'search') {
      if (searchPage < searchTotalPages) {
        executeSearch(searchQuery, searchPage + 1, true);
      }
    } else if (activeMode === 'filter') {
      if (filterPage < filterTotalPages) {
        executeFilter(filters, filterPage + 1, true);
      }
    } else if (activeMode === 'trending') {
      if (trendingPage < trendingTotalPages) {
        loadTrending(trendingTimeWindow, trendingPage + 1, true);
      }
    }
  };

  // Determine current active movies list
  let currentMovies = [];
  let currentLoading = false;
  let currentError = null;
  let hasMore = false;

  if (activeMode === 'search') {
    currentMovies = searchResults;
    currentLoading = searchLoading;
    currentError = searchError;
    hasMore = searchPage < searchTotalPages;
  } else if (activeMode === 'filter') {
    currentMovies = filteredMovies;
    currentLoading = filterLoading;
    currentError = filterError;
    hasMore = filterPage < filterTotalPages;
  } else {
    currentMovies = trendingMovies;
    currentLoading = trendingLoading;
    currentError = trendingError;
    hasMore = trendingPage < trendingTotalPages;
  }

  // Toggle infinite scroll vs load more button
  const toggleInfiniteScroll = () => {
    setInfiniteScrollEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('movie_explorer_infinite_scroll', String(next));
      return next;
    });
  };

  return (
    <MovieContext.Provider
      value={{
        activeMode,
        setActiveMode,
        genres,
        // Trending
        trendingMovies,
        trendingTimeWindow,
        changeTrendingTimeWindow,
        loadTrending,
        // Search
        searchQuery,
        handleSearchChange,
        handleSearchSubmit,
        lastSearchedMovie,
        searchResults,
        // Filters
        filters,
        updateFilters,
        resetFilters,
        // Unified display
        currentMovies,
        currentLoading,
        currentError,
        loadingMore,
        hasMore,
        loadMore,
        // Infinite scroll setting
        infiniteScrollEnabled,
        toggleInfiniteScroll,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
