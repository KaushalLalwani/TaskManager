import { useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { getToken, setToken, setUser, getUser, clearAuth } from '../utils/token';
import { getApiErrorMessage } from '../utils/apiError';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => (getToken() ? getUser() : null));
  const [loading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (email, username, password) => {
    try {
      setError(null);
      const response = await authApi.register({
        email,
        username,
        password,
      });
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Registration failed');
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login({
        email,
        password,
      });
      
      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      setUserState(userData);
      
      return userData;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Login failed');
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
    setError(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [error, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
