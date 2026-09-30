import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, setError, isAuthenticated, user } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Destination after successful login
  const from = location.state?.from?.pathname || location.state?.from || '/';


  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!username.trim()) {
      setValidationError('Please enter your username.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }
    if (password.length < 4) {
      setValidationError('Password must be at least 4 characters long.');
      return;
    }

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 6, sm: 10 } }}>
      <Card
        sx={{
          borderRadius: 4,
          p: { xs: 2, sm: 3 },
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.15)'
              : '0 20px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: '16px !important' }}>
          {/* Brand & Icon */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              <MovieFilterIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" component="h1" fontWeight={800} gutterBottom>
              {isAuthenticated ? 'Already Signed In' : 'Welcome Back'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isAuthenticated
                ? `You are logged in as ${user?.username}`
                : 'Sign in to access your Movie Explorer profile'}
            </Typography>
          </Box>

          {isAuthenticated ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                You are signed in!
              </Alert>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/')}
                sx={{ borderRadius: 3 }}
              >
                Go to Home Page
              </Button>
            </Box>
          ) : (
            <>


              {location.state?.message && !isAuthenticated && (
                <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2.5, fontWeight: 600 }}>
                  {location.state.message}
                </Alert>
              )}

              {(validationError || error) && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
                  {validationError || error}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.3,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  For sign in use any username and 4+ character password will work.
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
