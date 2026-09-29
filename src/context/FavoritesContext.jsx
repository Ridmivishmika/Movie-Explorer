import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Helper to load favorites from localStorage for a specific user
  const loadUserFavorites = (username) => {
    if (!username) return [];
    try {
      const userKey = `movie_explorer_favorites_${username}`;
      const saved = localStorage.getItem(userKey);
      if (saved) return JSON.parse(saved);

      // Fallback/migration from previous generic storage if exists
      const oldGeneric = localStorage.getItem('movie_explorer_favorites');
      if (oldGeneric) {
        const parsed = JSON.parse(oldGeneric);
        localStorage.setItem(userKey, oldGeneric);
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  };

  const [favorites, setFavorites] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('movie_explorer_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      if (!savedUser?.username) return [];
      return loadUserFavorites(savedUser.username);
    } catch {
      return [];
    }
  });

  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [pendingMovie, setPendingMovie] = useState(() => {
    try {
      const saved = localStorage.getItem('movie_explorer_pending_favorite');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [notification, setNotification] = useState(null);

  // Sync favorites when user auth state changes (login / logout / switch account)
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      try {
        let userFavorites = loadUserFavorites(user.username);

        // Check if a movie was pending to be added when user clicked before logging in
        let pending = pendingMovie;
        if (!pending) {
          const pendingStr = localStorage.getItem('movie_explorer_pending_favorite');
          if (pendingStr) {
            try {
              pending = JSON.parse(pendingStr);
            } catch {
              pending = null;
            }
          }
        }

        if (pending && pending.id) {
          const alreadyExists = userFavorites.some((m) => m.id === pending.id);
          if (!alreadyExists) {
            const formatted = {
              id: pending.id,
              title: pending.title,
              poster_path: pending.poster_path,
              backdrop_path: pending.backdrop_path,
              release_date: pending.release_date,
              vote_average: pending.vote_average,
              overview: pending.overview,
              genre_ids: pending.genre_ids || pending.genres?.map((g) => g.id) || [],
              savedAt: new Date().toISOString(),
            };
            userFavorites = [formatted, ...userFavorites];
            localStorage.setItem(
              `movie_explorer_favorites_${user.username}`,
              JSON.stringify(userFavorites)
            );
            setNotification({
              message: `"${pending.title}" added to your favorites!`,
              severity: 'success',
            });
          }
          // Clear pending favorite once processed
          setPendingMovie(null);
          localStorage.removeItem('movie_explorer_pending_favorite');
        }

        setFavorites(userFavorites);
      } catch {
        setFavorites([]);
      }
    } else {
      // Guests have no favorites shown
      setFavorites([]);
    }
  }, [isAuthenticated, user?.username]);

  const isFavorite = useCallback(
    (movieId) => {
      if (!isAuthenticated || !movieId) return false;
      return favorites.some((movie) => movie.id === Number(movieId));
    },
    [favorites, isAuthenticated]
  );

  const toggleFavorite = (movie) => {
    if (!isAuthenticated) {
      if (movie && movie.id) {
        setPendingMovie(movie);
        try {
          localStorage.setItem('movie_explorer_pending_favorite', JSON.stringify(movie));
        } catch {
          // ignore
        }
      }
      setLoginPromptOpen(true);
      return;
    }

    if (!movie || !movie.id) return;

    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      let updated;
      if (exists) {
        setNotification({
          message: `"${movie.title}" removed from favorites`,
          severity: 'info',
        });
        updated = prev.filter((m) => m.id !== movie.id);
      } else {
        setNotification({
          message: `"${movie.title}" added to favorites!`,
          severity: 'success',
        });
        const formatted = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview,
          genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id) || [],
          savedAt: new Date().toISOString(),
        };
        updated = [formatted, ...prev];
      }
      if (user?.username) {
        localStorage.setItem(`movie_explorer_favorites_${user.username}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeFavorite = (movieId) => {
    if (!isAuthenticated) return;
    setFavorites((prev) => {
      const updated = prev.filter((m) => m.id !== Number(movieId));
      if (user?.username) {
        localStorage.setItem(`movie_explorer_favorites_${user.username}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearAllFavorites = () => {
    if (!isAuthenticated) return;
    setFavorites([]);
    if (user?.username) {
      localStorage.setItem(`movie_explorer_favorites_${user.username}`, JSON.stringify([]));
    }
    setNotification({
      message: 'All favorites cleared',
      severity: 'info',
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const closeLoginPrompt = () => {
    setLoginPromptOpen(false);
  };

  const openLoginPrompt = () => {
    setLoginPromptOpen(true);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: isAuthenticated ? favorites.length : 0,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearAllFavorites,
        notification,
        closeNotification,
        loginPromptOpen,
        closeLoginPrompt,
        openLoginPrompt,
        pendingMovie,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};


