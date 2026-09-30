import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import ExploreIcon from '@mui/icons-material/Explore';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';

import { useThemeMode } from '../../context/ThemeModeContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useMovies } from '../../context/MovieContext';

const Navbar = () => {
  const { mode, toggleColorMode } = useThemeMode();
  const { user, isAuthenticated, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const { lastSearchedMovie, handleSearchSubmit } = useMovies();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // User menu state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const handleLatestSearchClick = () => {
    if (lastSearchedMovie) {
      handleSearchSubmit(lastSearchedMovie);
      navigate('/');
    }
  };

  const navLinks = [
    ...(isAuthenticated
      ? [
        { label: 'Explore', path: '/', icon: <ExploreIcon /> },
        { label: 'Favorites', path: '/favorites', icon: <FavoriteIcon />, badge: favoritesCount },
      ]
      : []),
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        color="default"
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.9)' : '#ffffff'),
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'),
          backdropFilter: 'blur(16px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 20px 0 rgba(0, 0, 0, 0.5)'
              : '0 2px 14px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          {/* Logo & Brand */}
          <Box
            component={RouterLink}
            to="/"
            disableRipple
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              }}
            >
              <MovieFilterIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Movie Explorer
              </Typography>

            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    startIcon={
                      item.badge !== undefined ? (
                        <Badge badgeContent={item.badge} color="error" max={99}>
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )
                    }
                    variant={isActive ? 'contained' : 'text'}
                    color={isActive ? 'primary' : 'inherit'}
                    sx={{
                      borderRadius: 3,
                      px: 2,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Latest Searched Movie - Shown in Top Bar across all pages after login */}
          {isAuthenticated && lastSearchedMovie && (
            <Tooltip title={`Search again for "${lastSearchedMovie}"`}>
              <Button
                onClick={handleLatestSearchClick}
                size="small"
                variant="outlined"
                startIcon={<HistoryIcon sx={{ color: 'primary.main', fontSize: 18 }} />}
                sx={{
                  borderRadius: 4,
                  px: { xs: 1.2, sm: 1.8 },
                  py: 0.5,
                  textTransform: 'none',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.06)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.22)' : 'rgba(99, 102, 241, 0.15)',
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                  maxWidth: { xs: 130, sm: 220, md: 300 },
                }}
              >
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.6, overflow: 'hidden' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: { xs: 'none', sm: 'inline' },
                      color: 'text.secondary',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Latest Search:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lastSearchedMovie}
                  </Typography>
                </Box>
              </Button>
            </Tooltip>
          )}

          {/* Action Buttons: Theme Toggle, API Key, Auth Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            {/* Theme Toggle Button */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                }}
              >
                {mode === 'dark' ? (
                  <Brightness7Icon sx={{ color: '#fbbf24' }} />
                ) : (
                  <Brightness4Icon sx={{ color: '#475569' }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Auth Profile or Login Button */}
            {isAuthenticated ? (
              <Box>
                <Tooltip title={`Signed in as ${user.username}`}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                    <Avatar
                      src={user.avatar}
                      alt={user.username}
                      sx={{
                        width: 38,
                        height: 38,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light',
                      }}
                    >
                      {(user.username || 'U').charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 3,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {user.username}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    component={RouterLink}
                    to="/favorites"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <FavoriteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    My Favorites ({favoritesCount})
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
                startIcon={<LoginIcon />}
                size="small"
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                Login
              </Button>
            )}

            {/* Mobile Hamburger Menu */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={() => setMobileDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <MovieFilterIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Movie Explorer
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, p: 1, bgcolor: 'background.subtle', borderRadius: 2 }}>
            <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap fontWeight={700}>
                {user.username}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Latest Search in Mobile Drawer */}
        {isAuthenticated && lastSearchedMovie && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8, fontWeight: 600 }}>
              <HistoryIcon sx={{ fontSize: 16, color: 'primary.main' }} /> Latest Searched Movie:
            </Typography>
            <Chip
              label={lastSearchedMovie}
              size="small"
              color="primary"
              variant="filled"
              clickable
              onClick={() => {
                setMobileDrawerOpen(false);
                handleLatestSearchClick();
              }}
              sx={{ fontWeight: 700, cursor: 'pointer' }}
            />
          </Box>
        )}

        <List>
          {navLinks.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                selected={location.pathname === item.path}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge badgeContent={item.badge} color="error" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          {isAuthenticated ? (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => {
                setMobileDrawerOpen(false);
                handleLogout();
              }}
              sx={{ borderRadius: 2 }}
            >
              Logout
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
