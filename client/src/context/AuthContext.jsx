import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import api from '../utils/api';

// Create the context
export const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
};

// Reducer function to manage state
const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        isAuthenticated: !!action.payload.token,
      };
    case 'SIGN_IN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        isAuthenticated: true,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token and user from localStorage on mount
  useEffect(() => {
    const bootAsync = async () => {
      let token = null;
      let user = null;

      try {
        // Get stored token and user
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          token = storedToken;
          user = JSON.parse(storedUser);

          // Verify token is still valid by calling /api/users/me
          const res = await api.get('/users/me');

          if (res.status === 200) {
            const freshUser = res.data;
            user = freshUser;
            localStorage.setItem('user', JSON.stringify(freshUser));
          } else {
            // Token is invalid, clear it
            token = null;
            user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Error restoring auth state:', err);
        token = null;
        user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      dispatch({
        type: 'RESTORE_TOKEN',
        payload: { token, user },
      });
    };

    bootAsync();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/users/login', { email, password });

      const data = res.data;

      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'SIGN_IN',
        payload: { token: data.token, user: data.user },
      });

      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: err.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return state.isAuthenticated;
  }, [state.isAuthenticated]);

  const value = {
    ...state,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
