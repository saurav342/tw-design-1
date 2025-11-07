import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const ProtectedRoute = ({ roles, children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Show nothing while loading (prevents flash of redirect)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    console.log('[ProtectedRoute] 🔒 Not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role authorization
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    console.log('[ProtectedRoute] ⚠️ Role mismatch. Required:', roles, 'User has:', user.role);
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] ✅ Access granted to:', location.pathname);
  return children;
};

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
};

ProtectedRoute.defaultProps = {
  roles: undefined,
};

export default ProtectedRoute;
