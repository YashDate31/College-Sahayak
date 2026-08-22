import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem('auth_token');
      return <Navigate to="/login" replace />;
    }

    // Check admin rights
    if (adminOnly && decoded.role !== 'admin') {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    localStorage.removeItem('auth_token');
    return <Navigate to="/login" replace />;
  }
}
