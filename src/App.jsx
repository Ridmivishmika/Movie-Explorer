import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Snackbar, Alert } from '@mui/material';

import { ThemeModeProvider } from './context/ThemeModeContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { MovieProvider } from './context/MovieContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoginPromptDialog from './components/common/LoginPromptDialog';

import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Inner component to access FavoritesContext for global toast notifications
const AppContent = () => {
  const { notification, closeNotification, loginPromptOpen, closeLoginPrompt } = useFavorites();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>

      <Footer />

      {/* Global Login Prompt Dialog */}
      <LoginPromptDialog open={loginPromptOpen} onClose={closeLoginPrompt} />

      {/* Global Snackbar for toast notifications */}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification ? (
          <Alert
            onClose={closeNotification}
            severity={notification.severity || 'info'}
            variant="filled"
            sx={{ width: '100%', borderRadius: 3, fontWeight: 600 }}
          >
            {notification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

function App() {
  return (
    <Router>
      <ThemeModeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <MovieProvider>
              <AppContent />
            </MovieProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeModeProvider>
    </Router>
  );
}

export default App;
