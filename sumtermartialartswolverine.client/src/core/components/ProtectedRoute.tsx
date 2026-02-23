import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
    requirePasswordChanged?: boolean;
}

function ProtectedRoute({
    children,
    requireAuth = false,
    requireAdmin = false,
    requirePasswordChanged = false
}: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin, needsPasswordChange, isTokenExpired } = useAuth();
    const location = useLocation();

    // Check authentication
    if (requireAuth) {
        if (!isAuthenticated || isTokenExpired()) {
            // Redirect to login with return URL
            return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
        }
    }

    // Check password change requirement
    if (requirePasswordChanged && needsPasswordChange) {
        return <Navigate to="/change-password" replace />;
    }

    // Check admin requirement
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;