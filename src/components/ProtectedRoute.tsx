
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de spinner/loading
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
