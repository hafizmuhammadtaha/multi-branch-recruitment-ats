import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// ProtectedRoute component: Guards routes based on authentication and user roles
// This component ensures only authorized users can access specific pages
// It handles loading states, authentication checks, and role-based redirects
const ProtectedRoute = ({ children, roles }) => {
  // Access authentication state from the AuthContext
  const { user, loading } = useAuth();

  // While authentication state is being determined, show loading indicator
  if (loading) return <div>Loading...</div>;

  // If user is not authenticated, redirect to login page
  if (!user) return <Navigate to="/login" />;

  // If specific roles are required and user's role doesn't match, redirect to appropriate dashboard
  if (roles && !roles.includes(user.role)) {
    // Role-based redirection: Send users to their designated dashboard based on their role
    if (user.role === 'candidate') return <Navigate to="/dashboard" />;
    if (user.role === 'hr') return <Navigate to="/hr/dashboard" />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  }

  // If all checks pass, render the protected content
  return children;
};

// Export the ProtectedRoute component for use in routing configuration
export default ProtectedRoute;