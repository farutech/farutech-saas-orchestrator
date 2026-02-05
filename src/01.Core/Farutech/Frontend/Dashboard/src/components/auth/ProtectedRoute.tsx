// ============================================================================
// PROTECTED ROUTE - Guard component for authenticated routes
// ============================================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalLoader } from '@/components/farutech/GlobalLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOrchestrator?: boolean;
}

export function ProtectedRoute({ children, requiresOrchestrator = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isOrchestrator, requiresContextSelection } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] Checking access to:', location.pathname);
  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated);
  console.log('[ProtectedRoute] requiresContextSelection:', requiresContextSelection);
  console.log('[ProtectedRoute] isLoading:', isLoading);

  // For debugging: temporarily disable loading check
  if (isLoading) {
    console.log('[ProtectedRoute] Still loading, showing loader');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <GlobalLoader fullScreen={false} />
      </div>
    );
  }
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
  //       <GlobalLoader fullScreen={false} />
  //     </div>
  //   );
  // }

  if (!isAuthenticated) {
    // Redirect to login and save the intended destination
    console.log('[ProtectedRoute] User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access to profile, settings, and organizations pages even with just intermediate token
  // These are management pages that don't require a selected tenant context
  // Allow access to profile, settings, and organizations pages even with just intermediate token
  // These are management pages that don't require a selected tenant context
  const isManagementPage = ['/profile', '/settings'].includes(location.pathname) || 
                          location.pathname.startsWith('/organizations');
  
  // If user needs to select context (has intermediate token) but is trying to access protected routes other than home/management
  if (requiresContextSelection && !isManagementPage) {
    // Allow access to home to complete context selection
    if (location.pathname !== '/home') {
      console.warn('[ProtectedRoute] User needs to select context, redirecting to home');
      return <Navigate to="/home" state={{ from: location }} replace />;
    }
  }

  if (requiresOrchestrator && !isOrchestrator()) {
    // Redirect to home if user doesn't have orchestrator access
    console.log('[ProtectedRoute] User does not have orchestrator access');
    return <Navigate to="/home" replace />;
  }

  console.log('[ProtectedRoute] Access granted to:', location.pathname);
  return <>{children}</>;
}
