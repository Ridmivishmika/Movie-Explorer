import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Default backup key if none is set in env
const DEFAULT_KEY = '4e44d9029b1270a757cddc766a1bcb63';

export const getApiKey = () => {
  return import.meta.env.VITE_TMDB_API_KEY || DEFAULT_KEY;
};

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor to always attach the active API key
tmdbApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: getApiKey(),
  };
  return config;
});

// Utility to generate poster and backdrop URLs
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://placehold.co/500x750/1e293b/cbd5e1?text=No+Poster+Available';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (path) => {
  if (!path) return 'https://placehold.co/300x450/334155/94a3b8?text=No+Photo';
  return `${IMAGE_BASE_URL}/w185${path}`;
};

// Find YouTube trailer key from videos array
export const getTrailerKey = (videos = []) => {
  if (!videos || !videos.length) return null;
  // First look for official trailer on YouTube
  const officialTrailer = videos.find(
    (v) =>
      v.site === 'YouTube' &&
      v.type === 'Trailer' &&
      v.official === true
  );
  if (officialTrailer) return officialTrailer.key;

  // Fallback to any YouTube trailer
  const anyTrailer = videos.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  if (anyTrailer) return anyTrailer.key;

  // Fallback to any YouTube video (teaser/clip)
  const anyVideo = videos.find((v) => v.site === 'YouTube');
  return anyVideo ? anyVideo.key : null;
};

// API Methods

/**
 * Fetch trending movies (day or week)
 */
export const fetchTrendingMovies = async (timeWindow = 'day', page = 1) => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to load trending movies.');
  }
};

/**
 * Search movies by keyword
 */
export const searchMovies = async (query, page = 1) => {
  if (!query || !query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: query.trim(),
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to search movies. Please check your network or API key.');
  }
};

/**
 * Fetch detailed movie information, cast, videos, and recommendations
 */
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    throw new Error(error.response?.data?.status_message || 'Failed to fetch movie details.');
  }
};

/**
 * Fetch list of official genres
 */
export const fetchGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data?.genres || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

/**
 * Discover movies with filter options (genre, release year, minimum rating, sorting)
 */
export const discoverFilteredMovies = async ({
  genreId,
  year,
  minRating,
  sortBy = 'popularity.desc',
  page = 1,
}) => {
  try {
    const params = {
      page,
      sort_by: sortBy,
      include_adult: false,
    };

    if (genreId && genreId !== 'all') {
      params.with_genres = genreId;
    }
    if (year && year !== 'all') {
      params.primary_release_year = year;
    }
    if (minRating && Number(minRating) > 0) {
      params['vote_average.gte'] = minRating;
      params['vote_count.gte'] = 20; // Filter out movies with only 1 vote
    }

    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    console.error('Error discovering filtered movies:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to discover movies with selected filters.');
  }
};

export default tmdbApi;
