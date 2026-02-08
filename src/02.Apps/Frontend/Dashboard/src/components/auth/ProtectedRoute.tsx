// ============================================================================
// PROTECTED ROUTE - Route Guard for Authentication (OPTIMIZED)
// ============================================================================
// ✅ Optimizado con React.memo para evitar re-renders innecesarios
// ✅ Usa selectores granulares de Zustand
// ✅ Sin logs en producción (Zustand DevTools es mejor)
// ✅ LoadingScreen memoizado
// ✅ Early return pattern

import { Navigate, useLocation } from 'react-router-dom';
import { GlobalLoader } from '@/components/farutech/GlobalLoader';
import { memo } from 'react';
import {
  useIsAuthenticated,
  useIsInitialized,
  useRequiresContextSelection,
  useAuthStore,
} from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOrchestrator?: boolean;
}

// ============================================================================
// Loading Screen (Memoizado para evitar re-creación)
// ============================================================================

const LoadingScreen = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
    <GlobalLoader fullScreen={false} />
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

// ============================================================================
// ProtectedRoute Component (Memoizado)
// ============================================================================

export const ProtectedRoute = memo(({ children, requiresOrchestrator = false }: ProtectedRouteProps) => {
  // ✅ Selectores granulares - solo re-render si cambian
  const isAuthenticated = useIsAuthenticated();
  const isInitialized = useIsInitialized();
  const requiresContextSelection = useRequiresContextSelection();
  const isOrchestrator = useAuthStore(state => state.isOrchestrator);
  const location = useLocation();

  // ============================================================================
  // Early return: No inicializado
  // ============================================================================
  
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // ============================================================================
  // Early return: No autenticado
  // ============================================================================
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ============================================================================
  // Rutas exentas de selección de contexto
  // ============================================================================
  
  const isExemptRoute =
    location.pathname === '/profile' ||
    location.pathname === '/settings' ||
    location.pathname === '/launcher' ||
    location.pathname === '/';

  // ============================================================================
  // Redirección por selección de contexto
  // ============================================================================
  
  if (requiresContextSelection && !isExemptRoute) {
    return <Navigate to="/launcher" state={{ from: location }} replace />;
  }

  // ============================================================================
  // Validación de rol de orquestador
  // ============================================================================
  
  if (requiresOrchestrator && !isOrchestrator()) {
    return <Navigate to="/launcher" replace />;
  }

  // ============================================================================
  // Render children
  // ============================================================================
  
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';
