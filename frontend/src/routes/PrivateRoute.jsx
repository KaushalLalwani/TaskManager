import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};
