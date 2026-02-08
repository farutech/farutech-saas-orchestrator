// ============================================================================
// MP LOADER - Dynamic Mini-Program Loader
// ============================================================================

import React, { lazy, Suspense, ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { MpExport } from '../types/mp.types';
import { Spinner } from '@farutech/design-system';

interface MpLoaderProps {
  mpId: string;
}

// Registry de MPs disponibles
const MP_REGISTRY: Record<string, () => Promise<any>> = {
  customers: () => import('../mps/customers'),
  // Add more MPs here as they are created
  // products: () => import('../mps/products'),
  // orders: () => import('../mps/orders'),
};

/**
 * Fallback UI mientras carga el MP
 */
const MpLoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="text-center space-y-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Cargando aplicación...
      </p>
    </div>
  </div>
);

/**
 * Error boundary para MPs
 */
class MpErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MP Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-red-600 dark:text-red-400">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Error al cargar la aplicación
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {this.state.error?.message || 'Ha ocurrido un error inesperado'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loader dinámico de MP
 */
export const MpLoader: React.FC<MpLoaderProps> = ({ mpId }) => {
  // Obtener el loader del MP
  const mpLoader = MP_REGISTRY[mpId];

  if (!mpLoader) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-yellow-600 dark:text-yellow-400">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Aplicación no encontrada
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            El módulo "{mpId}" no está disponible
          </p>
        </div>
      </div>
    );
  }

  // Lazy load del MP
  const MpComponent = lazy(async () => {
    const mp = await mpLoader();
    
    // Crear componente que renderiza las rutas del MP
    const MpRoutes: ComponentType = () => (
      <Routes>
        {mp.default.routes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    );

    return { default: MpRoutes };
  });

  return (
    <MpErrorBoundary>
      <Suspense fallback={<MpLoadingFallback />}>
        <MpComponent />
      </Suspense>
    </MpErrorBoundary>
  );
};

/**
 * Registrar un nuevo MP en runtime
 */
export function registerMp(
  mpId: string,
  loader: () => Promise<{ default: MpExport }>
) {
  MP_REGISTRY[mpId] = loader;
}

/**
 * Obtener lista de MPs disponibles
 */
export function getAvailableMps(): string[] {
  return Object.keys(MP_REGISTRY);
}
