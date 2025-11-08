import { useEffect, useState } from 'react';
import { authApi } from '../services/api';
import { AuthContext } from './AuthContextBase.js';

const STORAGE_KEY = 'launchandlift_auth_state';

const readPersistedState = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to parse auth state from storage', error);
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuthState] = useState(readPersistedState);
  const [status, setStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  }, [token, user]);

  const setError = (error) => setStatus((prev) => ({ ...prev, error }));

  const authenticate = async (action, payload) => {
    setStatus({ loading: true, error: null });

    try {
      const response = await action(payload);
      console.log('[AuthContext] ✅ API Response received');
      
      if (!response || typeof response !== 'object' || !response.token || !response.user) {
        console.error('[AuthContext] ❌ Invalid response structure:', response);
        throw new Error('Invalid server response. Please try again.');
      }
      
      const { token, user } = response;
      console.log('[AuthContext] 📝 Setting auth state for:', user.email, 'Role:', user.role);
      
      // Update state synchronously
      setAuthState({ token, user });
      setStatus({ loading: false, error: null });
      
      console.log('[AuthContext] ✅ Authentication complete');
      return response;
    } catch (error) {
      console.error('[AuthContext] ❌ Authentication error:', error);
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setStatus({ loading: false, error: message });
      setAuthState({ token: null, user: null });
      throw error;
    }
  };

  const login = (credentials) => authenticate(authApi.login, credentials);
  const signup = (payload) => authenticate(authApi.signup, payload);

  const establishSession = ({ user: nextUser, token: nextToken }) => {
    if (!nextToken) {
      throw new Error('Token is required to establish a session');
    }
    setAuthState({ token: nextToken, user: nextUser });
    setStatus({ loading: false, error: null });
  };

  const logout = () => {
    setAuthState({ token: null, user: null });
    setStatus({ loading: false, error: null });
  };

  const refreshProfile = async () => {
    if (!token) return null;

    try {
      const profile = await authApi.fetchProfile(token);
      setAuthState({ token, user: profile });
      return profile;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading: status.loading,
    error: status.error,
    login,
    signup,
    establishSession,
    logout,
    refreshProfile,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
