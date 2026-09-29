import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('movie_explorer_user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      // Clean up any legacy @loonslab.com emails
      if (parsed?.email && parsed.email.endsWith('@loonslab.com')) {
        parsed.email = '';
        localStorage.setItem('movie_explorer_user', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    // Simulate authenticating against credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!username || !username.trim()) {
          const err = 'Username or email is required';
          setError(err);
          setLoading(false);
          reject(new Error(err));
          return;
        }
        if (!password || password.length < 4) {
          const err = 'Password must be at least 4 characters';
          setError(err);
          setLoading(false);
          reject(new Error(err));
          return;
        }

        const cleanUsername = username.trim();
        const isEmail = cleanUsername.includes('@');
        const userData = {
          username: cleanUsername,
          name: isEmail
            ? cleanUsername.split('@')[0]
            : cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
          email: isEmail ? cleanUsername : '',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
          token: 'mock-jwt-token-' + Date.now(),
          loginTime: new Date().toISOString(),
        };

        setUser(userData);
        localStorage.setItem('movie_explorer_user', JSON.stringify(userData));
        setLoading(false);
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('movie_explorer_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
