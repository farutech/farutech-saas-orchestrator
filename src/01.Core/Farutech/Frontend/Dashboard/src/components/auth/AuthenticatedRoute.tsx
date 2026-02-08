// ============================================================================
// AUTHENTICATED ROUTE - Guard for routes that only require authentication
// (No context selection required - for management pages like organizations)
// ============================================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalLoader } from '@/components/farutech/GlobalLoader';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

/**
 * AuthenticatedRoute - Para páginas que solo requieren autenticación básica
 * 
 * Casos de uso:
 * - Gestión de organizaciones (/organizations, /dashboard)
 * - Perfil de usuario (/profile)
 * - Configuración (/settings)
 * 
 * NO requiere:
 * - Contexto de tenant seleccionado
 * - Permisos especiales
 * 
 * Solo valida que el usuario tenga un token válido (intermediate o access)
 */
export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('[AuthenticatedRoute] Checking access to:', location.pathname);
  console.log('[AuthenticatedRoute] isAuthenticated:', isAuthenticated);
  console.log('[AuthenticatedRoute] isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <GlobalLoader fullScreen={false} />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[AuthenticatedRoute] User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('[AuthenticatedRoute] Access granted to:', location.pathname);
  return <>{children}</>;
}
