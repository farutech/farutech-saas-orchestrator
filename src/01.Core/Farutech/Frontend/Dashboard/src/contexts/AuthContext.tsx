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
  InstanceDto,
} from '@/types/api';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

interface AuthUser {
  email: string;
  fullName?: string;
  role?: string;
  tenantId?: string;
  companyName?: string;
  instanceId?: string;
  instanceName?: string;
  instanceType?: string;
  instanceUrl?: string;
}

interface AuthContextType {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresContextSelection: boolean;
  requiresInstanceSelection: boolean;
  availableTenants: TenantOptionDto[];
  availableInstances: InstanceDto[];
  selectedTenant: TenantOptionDto | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  selectContext: (tenantId: string, redirectPath?: string) => Promise<void>;
  selectInstance: (instanceId: string) => Promise<void>;
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
  const [availableInstances, setAvailableInstances] = useState<InstanceDto[]>(() => {
    try {
      const stored = sessionStorage.getItem('farutech_available_instances');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedTenant, setSelectedTenant] = useState<TenantOptionDto | null>(() => {
    try {
      const stored = sessionStorage.getItem('farutech_selected_tenant');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [requiresInstanceSelection, setRequiresInstanceSelection] = useState(false);

  const navigate = useNavigate();

  // ============================================================================
  // Initialize - Check existing session
  // ============================================================================

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = TokenManager.getAccessToken();
      const intermediateToken = TokenManager.getIntermediateToken();
      const tenantContext = TokenManager.getTenantContext();

      // Caso 1: Usuario tiene un token completo (ya seleccionó contexto)
      // PRIORIDAD: Si hay accessToken, ignorar intermediateToken residual
      if (token && tenantContext) {
        const userInfo = localStorage.getItem('farutech_user_info');
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }
        setRequiresContextSelection(false);
        setAvailableTenants([]);
        // Limpiar intermediate token residual si existe
        if (intermediateToken) {
          TokenManager.clearIntermediateToken();
          sessionStorage.removeItem('farutech_available_tenants');
        }
      }
      // Caso 2: Usuario tiene token intermedio (debe seleccionar contexto)
      else if (intermediateToken && !token) {
        const storedTenants = sessionStorage.getItem('farutech_available_tenants');
        if (storedTenants) {
          setAvailableTenants(JSON.parse(storedTenants));
          setRequiresContextSelection(true);
        } else {
          // Intermediate token sin tenants = estado corrupto, limpiar
          TokenManager.clearIntermediateToken();
          setRequiresContextSelection(false);
        }
      }
      // Caso 3: No hay tokens, limpiar todo
      else {
        setRequiresContextSelection(false);
        setAvailableTenants([]);
      }
    } catch (error) {
      console.error('[AuthContext] Failed to initialize auth:', error);
      TokenManager.clearAllTokens();
      sessionStorage.removeItem('farutech_available_tenants');
      setRequiresContextSelection(false);
      setAvailableTenants([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // Login - Paso 1: Autenticación inicial
  // ============================================================================

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);

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
      else if (response.userId && !response.requiresContextSelection) {
        // Establecer usuario sin contexto de tenant
        const authUser: AuthUser = {
          email: credentials.email || '',
          fullName: response.fullName || response.email || '',
          role: response.role,
          tenantId: undefined,
          companyName: undefined,
        };

        setUser(authUser);
        localStorage.setItem('farutech_user_info', JSON.stringify(authUser));
        setRequiresContextSelection(false);
        setAvailableTenants([]);

        toast.success(`¡Bienvenido${response.fullName ? ', ' + response.fullName.split(' ')[0] : ''}!`);

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
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      // Buscar el tenant seleccionado en availableTenants
      const tenant = availableTenants.find(t => t.tenantId === tenantId);
      if (!tenant) {
        throw new Error('Tenant no encontrado');
      }

      // Guardar tenant seleccionado
      setSelectedTenant(tenant);
      sessionStorage.setItem('farutech_selected_tenant', JSON.stringify(tenant));

      // Si el tenant tiene múltiples instancias, mostrar selector
      if (tenant.instances && tenant.instances.length > 1) {
        setAvailableInstances(tenant.instances);
        sessionStorage.setItem('farutech_available_instances', JSON.stringify(tenant.instances));
        setRequiresInstanceSelection(true);
        setRequiresContextSelection(false);
        
        toast.info('Selecciona la aplicación a la que deseas ingresar');
        navigate('/select-instance');
        return;
      }

      // Si solo hay una instancia, seleccionarla automáticamente
      if (tenant.instances && tenant.instances.length === 1) {
        const instance = tenant.instances[0];
        await selectInstanceInternal(tenantId, instance, intermediateToken);
        return;
      }

      // Si no hay instancias, continuar sin selección de instancia
      const request: SelectContextRequest = {
        intermediateToken,
        tenantId,
      };

      const response = await authService.selectContext(request);

      // Validate token presence
      if (!response.accessToken) {
        throw new Error('No access token received from server');
      }

      // Guardar el token final
      TokenManager.setAccessToken(response.accessToken);

      // IMPORTANTE: Limpiar intermediate token y tenants INMEDIATAMENTE
      TokenManager.clearIntermediateToken();
      sessionStorage.removeItem('farutech_available_tenants');
      sessionStorage.removeItem('farutech_selected_tenant');

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
  // Select Instance - Paso 3: Selección de aplicación/instancia
  // ============================================================================

  const selectInstance = async (instanceId: string) => {
    setIsLoading(true);
    try {
      const intermediateToken = TokenManager.getIntermediateToken();

      if (!intermediateToken) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      if (!selectedTenant) {
        throw new Error('No hay tenant seleccionado');
      }

      const instance = availableInstances.find(i => i.instanceId === instanceId);
      if (!instance) {
        throw new Error('Instancia no encontrada');
      }

      await selectInstanceInternal(selectedTenant.tenantId, instance, intermediateToken);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al seleccionar aplicación');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función interna para seleccionar instancia
  const selectInstanceInternal = async (
    tenantId: string,
    instance: InstanceDto,
    intermediateToken: string
  ) => {
    const request: SelectContextRequest = {
      intermediateToken,
      tenantId,
    };

    const response = await authService.selectContext(request);

    // Validate token presence
    if (!response.accessToken) {
      throw new Error('No access token received from server');
    }

    // Guardar el token final
    TokenManager.setAccessToken(response.accessToken);

    // IMPORTANTE: Limpiar intermediate token y datos de selección
    TokenManager.clearIntermediateToken();
    sessionStorage.removeItem('farutech_available_tenants');
    sessionStorage.removeItem('farutech_available_instances');
    sessionStorage.removeItem('farutech_selected_tenant');

    // Guardar contexto del tenant con la instancia
    TokenManager.setTenantContext({
      tenantId: response.tenantId,
      companyName: response.companyName,
      role: response.role,
    });

    // Establecer usuario con información de la instancia
    const authUser: AuthUser = {
      email: '',
      fullName: response.companyName,
      role: response.role,
      tenantId: response.tenantId,
      companyName: response.companyName,
      instanceId: instance.instanceId,
      instanceName: instance.name,
      instanceType: instance.type,
      instanceUrl: instance.url,
    };

    setUser(authUser);
    localStorage.setItem('farutech_user_info', JSON.stringify(authUser));

    // Actualizar estados
    setRequiresContextSelection(false);
    setRequiresInstanceSelection(false);
    setAvailableTenants([]);
    setAvailableInstances([]);
    setSelectedTenant(null);

    toast.success(`Accediendo a ${instance.name}`);
    
    // Establecer módulo según tipo de aplicación (guardar en localStorage para FarutechContext)
    const appTypeToModule: Record<string, string> = {
      'FARUPOS': 'pos',
      'FARUINV': 'erp',
      'FARUSEG': 'erp',
    };
    const moduleType = appTypeToModule[instance.type] || 'pos';
    localStorage.setItem('farutech_current_module', moduleType);
    
    // Redirigir al dashboard de la aplicación
    if (instance.url) {
      // Check if URL is external (different domain) or localhost
      const isExternalUrl = instance.url.startsWith('http') && 
                           !instance.url.includes('localhost') &&
                           !instance.url.includes('127.0.0.1') &&
                           !instance.url.includes(window.location.hostname);
      
      if (isExternalUrl) {
        // External URL: Full page redirect (production subdomain)
        window.location.href = instance.url;
      } else {
        // Local/same-domain URL: Navigate to /dashboard within this app
        // In development, the instance.url is localhost:port but we stay in this frontend
        navigate('/dashboard');
      }
    } else {
      navigate('/launcher');
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
      navigate('/login');
      
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
    setRequiresInstanceSelection(false);
    setAvailableTenants([]);
    setAvailableInstances([]);
    setSelectedTenant(null);
    localStorage.removeItem('farutech_user_info');
    sessionStorage.removeItem('farutech_available_tenants');
    sessionStorage.removeItem('farutech_available_instances');
    sessionStorage.removeItem('farutech_selected_tenant');
    
    toast.info('Sesión cerrada');
    navigate('/login');
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

  const value: AuthContextType = {
    user,
    // User is authenticated if they have an access token OR if they have an intermediate token (for launcher access)
    isAuthenticated: !!user || !!accessToken || !!intermediateToken,
    isLoading,
    // requiresContextSelection is TRUE only if there's an intermediate token but NO access token
    requiresContextSelection: calculatedRequiresContextSelection,
    requiresInstanceSelection,
    availableTenants,
    availableInstances,
    selectedTenant,
    login,
    selectContext,
    selectInstance,
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
