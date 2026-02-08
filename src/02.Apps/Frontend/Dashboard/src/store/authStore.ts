// ============================================================================
// AUTH STORE - Zustand State Management (Performance Optimized)
// ============================================================================
// Reemplaza AuthContext con:
// - Inicialización SÍNCRONA (no más isLoading inicial)
// - Selectores optimizados (solo re-render cuando cambia lo necesario)
// - DevTools integration
// - Persist automático
// ============================================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TokenManager } from '@/lib/api-client';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import type {
  LoginRequest,
  SecureLoginResponse,
  SelectContextRequest,
  SelectContextResponse,
  RegisterRequest,
  TenantOptionDto,
} from '@/types/api';

// ============================================================================
// Types
// ============================================================================

export interface AuthUser {
  email: string;
  fullName?: string;
  role?: string;
  tenantId?: string;
  companyName?: string;
}

interface AuthState {
  // ============================================================================
  // State
  // ============================================================================
  user: AuthUser | null;
  isInitialized: boolean; // ✅ Reemplaza isLoading - siempre true después del mount
  requiresContextSelection: boolean;
  availableTenants: TenantOptionDto[];
  isLoggingIn: boolean; // Loading específico para login
  isSelectingContext: boolean; // Loading específico para select-context
  isRegistering: boolean; // Loading específico para registro

  // ============================================================================
  // Computed (memoizados internamente por Zustand)
  // ============================================================================
  isAuthenticated: boolean;

  // ============================================================================
  // Actions
  // ============================================================================
  initialize: () => void;
  login: (credentials: LoginRequest) => Promise<void>;
  selectContext: (tenantId: string, redirectPath?: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: (navigate: (path: string) => void) => void;

  // ============================================================================
  // Utilities
  // ============================================================================
  hasRole: (role: string) => boolean;
  isOrchestrator: () => boolean;
}

// ============================================================================
// Helper: Load user from localStorage
// ============================================================================

const loadUserFromStorage = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem('farutech_user_info');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// ============================================================================
// Helper: Load tenants from sessionStorage
// ============================================================================

const loadTenantsFromStorage = (): TenantOptionDto[] => {
  try {
    const stored = sessionStorage.getItem('farutech_available_tenants');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// ============================================================================
// Helper: Check if requires context selection
// ============================================================================

const checkRequiresContextSelection = (): boolean => {
  const hasIntermediate = !!TokenManager.getIntermediateToken();
  const hasAccess = !!TokenManager.getAccessToken();
  return hasIntermediate && !hasAccess;
};

// ============================================================================
// Store Creation
// ============================================================================

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // ============================================================================
      // Initial State (SÍNCRONO - NO async)
      // ============================================================================
      user: loadUserFromStorage(),
      isInitialized: true, // ✅ Siempre true (no hay loading inicial)
      requiresContextSelection: checkRequiresContextSelection(),
      availableTenants: loadTenantsFromStorage(),
      isLoggingIn: false,
      isSelectingContext: false,
      isRegistering: false,
      isAuthenticated: (() => {
        const token = TokenManager.getAccessToken();
        const intermediateToken = TokenManager.getIntermediateToken();
        return !!token || !!intermediateToken;
      })(),

      // ============================================================================
      // Initialize - Cleanup logic (SÍNCRONO)
      // ============================================================================
      initialize: () => {
        const state = get();
        
        // Cleanup: Si requiere contexto pero no hay tenants, limpiar
        if (state.requiresContextSelection && state.availableTenants.length === 0) {
          TokenManager.clearIntermediateToken();
          set({ requiresContextSelection: false });
        }

        // Cleanup: Si hay intermediate token residual con access token, limpiar
        const hasAccess = !!TokenManager.getAccessToken();
        const hasIntermediate = !!TokenManager.getIntermediateToken();
        if (hasAccess && hasIntermediate) {
          TokenManager.clearIntermediateToken();
          sessionStorage.removeItem('farutech_available_tenants');
          set({
            requiresContextSelection: false,
            availableTenants: [],
          });
        }
      },

      // ============================================================================
      // Login - Paso 1: Autenticación inicial
      // ============================================================================
      login: async (credentials: LoginRequest) => {
        set({ isLoggingIn: true });
        try {
          const response = await authService.login(credentials);

          // Caso 1: Usuario tiene múltiples organizaciones
          if (response.requiresContextSelection) {
            if (response.intermediateToken) {
              TokenManager.setIntermediateToken(response.intermediateToken);
            }

            const tenants = response.availableTenants || [];
            sessionStorage.setItem('farutech_available_tenants', JSON.stringify(tenants));
            
            set({
              requiresContextSelection: true,
              availableTenants: tenants,
              isAuthenticated: true, // Con intermediate token
            });

            toast.info('Por favor, selecciona tu organización');
            return;
          }

          // Caso 2: Usuario tiene una sola organización (acceso directo)
          if (response.accessToken) {
            TokenManager.setAccessToken(response.accessToken);

            // Guardar contexto del tenant
            if (response.selectedTenantId) {
              TokenManager.setTenantContext({
                tenantId: response.selectedTenantId,
                companyName: response.companyName,
                role: response.role,
              });
            }

            // Establecer usuario
            const authUser: AuthUser = {
              email: credentials.email || '',
              fullName: response.companyName,
              role: response.role,
              tenantId: response.selectedTenantId,
              companyName: response.companyName,
            };

            localStorage.setItem('farutech_user_info', JSON.stringify(authUser));

            set({
              user: authUser,
              isAuthenticated: true,
              requiresContextSelection: false,
            });

            toast.success(`¡Bienvenido${response.companyName ? ' a ' + response.companyName : ''}!`);
            return;
          }

          // Caso 3: Usuario autenticado pero sin organizaciones
          const authUser: AuthUser = {
            email: credentials.email || '',
            fullName: response.companyName || credentials.email || '',
            role: response.role,
            tenantId: undefined,
            companyName: undefined,
          };

          localStorage.setItem('farutech_user_info', JSON.stringify(authUser));

          set({
            user: authUser,
            isAuthenticated: true,
            requiresContextSelection: false,
            availableTenants: [],
          });

          toast.success('¡Bienvenido!');
        } catch (error: unknown) {
          const err = error as { message?: string };
          toast.error(err.message || 'Error al iniciar sesión');
          throw error;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      // ============================================================================
      // Select Context - Paso 2: Selección de organización
      // ============================================================================
      selectContext: async (tenantId: string, redirectPath: string = '/launcher') => {
        set({ isSelectingContext: true });
        try {
          const intermediateToken = TokenManager.getIntermediateToken();

          if (!intermediateToken) {
            toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            throw new Error('No intermediate token found');
          }

          const request: SelectContextRequest = {
            intermediateToken,
            tenantId,
          };

          const response = await authService.selectContext(request);

          if (!response.accessToken) {
            throw new Error('No access token received from server');
          }

          // Guardar el token final
          TokenManager.setAccessToken(response.accessToken);

          // IMPORTANTE: Limpiar intermediate token y tenants INMEDIATAMENTE
          TokenManager.clearIntermediateToken();
          sessionStorage.removeItem('farutech_available_tenants');

          // Guardar contexto del tenant
          TokenManager.setTenantContext({
            tenantId: response.tenantId,
            companyName: response.companyName,
            role: response.role,
          });

          // Establecer usuario
          const authUser: AuthUser = {
            email: '', // Email no viene en la respuesta de select-context
            fullName: response.companyName,
            role: response.role,
            tenantId: response.tenantId,
            companyName: response.companyName,
          };

          localStorage.setItem('farutech_user_info', JSON.stringify(authUser));

          set({
            user: authUser,
            isAuthenticated: true,
            requiresContextSelection: false,
            availableTenants: [],
          });

          toast.success(`Accediendo a ${response.companyName || 'tu organización'}`);
        } catch (error: unknown) {
          const err = error as { message?: string };
          toast.error(err.message || 'Error al seleccionar contexto');
          throw error;
        } finally {
          set({ isSelectingContext: false });
        }
      },

      // ============================================================================
      // Register
      // ============================================================================
      register: async (data: RegisterRequest) => {
        set({ isRegistering: true });
        try {
          await authService.register(data);
          toast.success('Registro exitoso. Por favor, inicia sesión.');
        } catch (error: unknown) {
          const err = error as { message?: string };
          toast.error(err.message || 'Error en el registro');
          throw error;
        } finally {
          set({ isRegistering: false });
        }
      },

      // ============================================================================
      // Logout
      // ============================================================================
      logout: (navigate: (path: string) => void) => {
        TokenManager.clearAllTokens();
        localStorage.removeItem('farutech_user_info');
        sessionStorage.removeItem('farutech_available_tenants');

        set({
          user: null,
          isAuthenticated: false,
          requiresContextSelection: false,
          availableTenants: [],
        });

        toast.info('Sesión cerrada');
        navigate('/auth/login');
      },

      // ============================================================================
      // Utilities
      // ============================================================================
      hasRole: (role: string): boolean => {
        const state = get();
        return state.user?.role?.toLowerCase() === role.toLowerCase();
      },

      isOrchestrator: (): boolean => {
        const { hasRole } = get();
        return hasRole('SuperAdmin') || hasRole('Admin');
      },
    }),
    {
      name: 'auth-store', // DevTools name
      enabled: import.meta.env.DEV, // Solo en desarrollo
    }
  )
);

// ============================================================================
// Selectores Optimizados (Helpers)
// ============================================================================

/**
 * Selector para verificar si el usuario está autenticado
 * Solo re-renderiza cuando cambia isAuthenticated
 */
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);

/**
 * Selector para verificar si requiere selección de contexto
 * Solo re-renderiza cuando cambia requiresContextSelection
 */
export const useRequiresContextSelection = () => useAuthStore(state => state.requiresContextSelection);

/**
 * Selector para obtener el usuario actual
 * Solo re-renderiza cuando cambia user
 */
export const useCurrentUser = () => useAuthStore(state => state.user);

/**
 * Selector para verificar si está inicializado
 * Solo re-renderiza cuando cambia isInitialized
 */
export const useIsInitialized = () => useAuthStore(state => state.isInitialized);

/**
 * Selector para obtener tenants disponibles
 * Solo re-renderiza cuando cambia availableTenants
 */
export const useAvailableTenants = () => useAuthStore(state => state.availableTenants);
