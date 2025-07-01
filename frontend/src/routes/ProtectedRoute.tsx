import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProtectedRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  // Add debug logging:
  console.log('ProtectedRoute check:', { isAuthenticated, isLoading ,user});

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}