import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) {
    // redirect to their own dashboard
    if (user.role === 'candidate') return <Navigate to="/dashboard" />;
    if (user.role === 'hr') return <Navigate to="/hr/dashboard" />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  }
  return children;
};

export default ProtectedRoute;