// ============================================================================
// AUTHENTICATION CONTEXT - Gestión centralizada de autenticación
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenManager } from '@/lib/api-client';
import type {
  LoginRequest,
  SecureLoginResponse,
  SelectContextRequest,
  SelectContextResponse,
  RegisterRequest,
  RegisterResponse,
  TenantOptionDto,
} from '@/types/api';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { resolveTenantFromHostname, callResolveApi } from '@/utils/tenantResolver';

// ============================================================================
// Types
// ============================================================================

interface AuthUser {
  email: string;
  fullName?: string;
  role?: string;
  tenantId?: string;
  companyName?: string;
}

interface AuthContextType {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresContextSelection: boolean;
  availableTenants: TenantOptionDto[];

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  selectContext: (tenantId: string, redirectPath?: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;

  // Utilities
  hasRole: (role: string) => boolean;
  isOrchestrator: () => boolean;
}

// ============================================================================
// Context Creation
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Fix: Lazy initialization to prevent null state flicker
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('farutech_user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [requiresContextSelection, setRequiresContextSelection] = useState(false);
  const [availableTenants, setAvailableTenants] = useState<TenantOptionDto[]>(() => {
    try {
      const stored = sessionStorage.getItem('farutech_available_tenants');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  // ============================================================================
  // Initialize - Check existing session
  // ============================================================================

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('[AuthContext] === INITIALIZING AUTH ===');
      
      // PASO 1: Resolver tenant desde URL
      const tenantResolution = resolveTenantFromHostname();
      console.log('[AuthContext] Tenant resolution:', tenantResolution);
      
      if (tenantResolution.isValid) {
        // Validar que el tenant existe llamando al API
        const tenantInfo = await callResolveApi(window.location.hostname);
        if (!tenantInfo) {
          console.warn('[AuthContext] Tenant not found for hostname:', window.location.hostname);
          toast.error('Instancia no encontrada');
          navigate('/error/tenant-not-found');
          setIsLoading(false);
          return;
        }
        console.log('[AuthContext] Tenant validated:', tenantInfo);
        
        // Guardar información del tenant en sessionStorage para usarla en login
        sessionStorage.setItem('farutech_resolved_tenant', JSON.stringify(tenantResolution));
      }
      
      // PASO 2: Verificar tokens existentes
      const token = TokenManager.getAccessToken();
      const intermediateToken = TokenManager.getIntermediateToken();
      const tenantContext = TokenManager.getTenantContext();
      
      console.log('[AuthContext] AccessToken exists:', !!token);
      console.log('[AuthContext] IntermediateToken exists:', !!intermediateToken);
      console.log('[AuthContext] TenantContext exists:', !!tenantContext);

      // Caso 1: Usuario tiene un token completo (ya seleccionó contexto)
      // PRIORIDAD: Si hay accessToken, ignorar intermediateToken residual
      if (token && tenantContext) {
        console.log('[AuthContext] User has full access token, loading user info...');
        const userInfo = localStorage.getItem('farutech_user_info');
        if (userInfo) {
          setUser(JSON.parse(userInfo));
          console.log('[AuthContext] User loaded from localStorage');
        }
        setRequiresContextSelection(false);
        setAvailableTenants([]);
        // Limpiar intermediate token residual si existe
        if (intermediateToken) {
          console.warn('[AuthContext] Cleaning up residual intermediate token');
          TokenManager.clearIntermediateToken();
          sessionStorage.removeItem('farutech_available_tenants');
        }
        console.log('[AuthContext] requiresContextSelection set to FALSE');
      }
      // Caso 2: Usuario tiene token intermedio (debe seleccionar contexto)
      else if (intermediateToken && !token) {
        console.log('[AuthContext] User has intermediate token, needs to select context');
        const storedTenants = sessionStorage.getItem('farutech_available_tenants');
        if (storedTenants) {
          setAvailableTenants(JSON.parse(storedTenants));
          setRequiresContextSelection(true);
          console.log('[AuthContext] requiresContextSelection set to TRUE');
        } else {
          // Intermediate token sin tenants = estado corrupto, limpiar
          console.warn('[AuthContext] Intermediate token without tenants, cleaning up');
          TokenManager.clearIntermediateToken();
          setRequiresContextSelection(false);
        }
      }
      // Caso 3: No hay tokens, limpiar todo
      else {
        console.log('[AuthContext] No valid tokens found, user not authenticated');
        setRequiresContextSelection(false);
        setAvailableTenants([]);
      }
    } catch (error) {
      console.error('[AuthContext] Failed to initialize auth:', error);
      TokenManager.clearAllTokens();
      sessionStorage.removeItem('farutech_available_tenants');
      sessionStorage.removeItem('farutech_resolved_tenant');
      setRequiresContextSelection(false);
      setAvailableTenants([]);
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] === INITIALIZATION COMPLETE ===');
    }
  };

  // ============================================================================
  // Login - Paso 1: Autenticación inicial
  // ============================================================================

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      // Obtener tenant resuelto desde sessionStorage si existe
      const resolvedTenantStr = sessionStorage.getItem('farutech_resolved_tenant');
      let enhancedCredentials = { ...credentials };
      
      if (resolvedTenantStr) {
        const resolvedTenant = JSON.parse(resolvedTenantStr);
        console.log('[AuthContext] Using resolved tenant for login:', resolvedTenant);
        enhancedCredentials = {
          ...credentials,
          instanceCode: resolvedTenant.instanceCode,
          organizationCode: resolvedTenant.organizationCode
        };
      }
      
      const response = await authService.login(enhancedCredentials);

      // Caso 1: Usuario tiene múltiples organizaciones (requiresContextSelection = true)
      if (response.requiresContextSelection) {
        if (response.intermediateToken) {
          TokenManager.setIntermediateToken(response.intermediateToken);
        }

        const tenants = response.availableTenants || [];
        setAvailableTenants(tenants);
        sessionStorage.setItem('farutech_available_tenants', JSON.stringify(tenants));
        setRequiresContextSelection(true);

        // Redirigir al launcher (que manejará la selección de contexto)
        navigate('/launcher');

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

        setUser(authUser);
        localStorage.setItem('farutech_user_info', JSON.stringify(authUser));

        toast.success(`¡Bienvenido${response.companyName ? ' a ' + response.companyName : ''}!`);

        // Redirigir al launcher
        navigate('/launcher');
      }
      // Caso 3: Usuario autenticado pero sin organizaciones asignadas
      else if (!response.requiresContextSelection) {
        // Establecer usuario sin contexto de tenant
        const authUser: AuthUser = {
          email: credentials.email || '',
          fullName: response.companyName || credentials.email || '',
          role: response.role,
          tenantId: undefined,
          companyName: undefined,
        };

        setUser(authUser);
        localStorage.setItem('farutech_user_info', JSON.stringify(authUser));
        setRequiresContextSelection(false);
        setAvailableTenants([]);

        toast.success(`¡Bienvenido!`);

        // Redirigir al launcher (mostrará estado vacío)
        navigate('/launcher');
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Select Context - Paso 2: Selección de organización
  // ============================================================================

  const selectContext = async (tenantId: string, redirectPath: string = '/launcher') => {
    setIsLoading(true);
    try {
      const intermediateToken = TokenManager.getIntermediateToken();

      if (!intermediateToken) {
        console.error('No intermediate token found in TokenManager');
        console.log('Available tenants in state:', availableTenants);
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        navigate('/auth/login');
        return;
      }

      const request: SelectContextRequest = {
        intermediateToken,
        tenantId,
      };

      const response = await authService.selectContext(request);

      // Validate token presence
      if (!response.accessToken) {
        throw new Error('No access token received from server');
      }

      console.log('[AuthContext] select-context successful, setting up user session...');
      
      // Guardar el token final
      TokenManager.setAccessToken(response.accessToken);
      
      // IMPORTANTE: Limpiar intermediate token y tenants INMEDIATAMENTE
      TokenManager.clearIntermediateToken();
      sessionStorage.removeItem('farutech_available_tenants');
      console.log('[AuthContext] Intermediate token and tenants cleared');

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

      setUser(authUser);
      localStorage.setItem('farutech_user_info', JSON.stringify(authUser));

      // Actualizar estados de contexto
      setRequiresContextSelection(false);
      setAvailableTenants([]);
      console.log('[AuthContext] requiresContextSelection set to FALSE after select-context');

      toast.success(`Accediendo a ${response.companyName || 'tu organización'}`);
      
      // Redirigir al destino solicitado
      navigate(redirectPath);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al seleccionar contexto');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Register
  // ============================================================================

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      
      toast.success('Registro exitoso. Por favor, inicia sesión.');
      navigate('/auth/login');
      
      return;
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Error en el registro');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Logout
  // ============================================================================

  const logout = () => {
    TokenManager.clearAllTokens();
    setUser(null);
    setRequiresContextSelection(false);
    setAvailableTenants([]);
    localStorage.removeItem('farutech_user_info');
    sessionStorage.removeItem('farutech_available_tenants');
    
    toast.info('Sesión cerrada');
    navigate('/auth/login');
  };

  // ============================================================================
  // Utilities
  // ============================================================================

  const hasRole = (role: string): boolean => {
    return user?.role?.toLowerCase() === role.toLowerCase();
  };

  const isOrchestrator = (): boolean => {
    return hasRole('SuperAdmin') || hasRole('Admin');
  };

  // ============================================================================
  // Context Value
  // ============================================================================

  const accessToken = TokenManager.getAccessToken();
  const intermediateToken = TokenManager.getIntermediateToken();
  const calculatedRequiresContextSelection = !!intermediateToken && !accessToken;
  
  console.log('[AuthContext] Context value calculation:');
  console.log('[AuthContext]   - accessToken exists:', !!accessToken);
  console.log('[AuthContext]   - intermediateToken exists:', !!intermediateToken);
  console.log('[AuthContext]   - requiresContextSelection:', calculatedRequiresContextSelection);

  const value: AuthContextType = {
    user,
    // User is authenticated if they have an access token OR if they have an intermediate token (for launcher access)
    isAuthenticated: !!user || !!accessToken || !!intermediateToken,
    isLoading,
    // requiresContextSelection is TRUE only if there's an intermediate token but NO access token
    requiresContextSelection: calculatedRequiresContextSelection,
    availableTenants,
    login,
    selectContext,
    register,
    logout,
    hasRole,
    isOrchestrator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// Hook
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
