import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenManager } from '@/lib/api-client';
import { authService } from '@/services/auth.service';
import { useAvailableTenants } from '@/hooks/useApi';
import type { TenantOptionDto, InstanceDto, LoginRequest, SelectContextRequest } from '@/types/api';
import { toast } from 'sonner';
import { useSession } from './SessionContext';

// ============================================================================
// Types
// ============================================================================

export interface AppContextUserMixin {
  tenantId?: string;
  companyName?: string;
  instanceId?: string;
  instanceName?: string;
  instanceType?: string;
  instanceUrl?: string;
}

export interface AppContextType {
  // State
  requiresContextSelection: boolean;
  requiresInstanceSelection: boolean;
  availableTenants: TenantOptionDto[];
  availableInstances: InstanceDto[];
  selectedTenant: TenantOptionDto | null;
  currentModule: string; // 'erp', 'pos', etc.

  // Actions
  loginWithFlow: (credentials: LoginRequest) => Promise<void>; // Orchestrates login + context checks
  selectContext: (tenantId: string, redirectPath?: string) => Promise<void>;
  selectInstance: (instanceId: string) => Promise<void>;
  refreshAvailableTenants: () => Promise<void>;
  
  // Utilities
  isOrchestrator: () => boolean;
}

// ============================================================================
// Context Creation
// ============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, login: sessionLogin, setUser, logout: sessionLogout } = useSession();
  const navigate = useNavigate();
  
  // State initialization
  const [requiresContextSelection, setRequiresContextSelection] = useState(false);
  const [requiresInstanceSelection, setRequiresInstanceSelection] = useState(false);
  
  // Persisted state for restoration
  const [availableTenants, setAvailableTenants] = useState<TenantOptionDto[]>(() => {
    try {
      const stored = sessionStorage.getItem('farutech_available_tenants');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  
  const [availableInstances, setAvailableInstances] = useState<InstanceDto[]>(() => {
    try {
      const stored = sessionStorage.getItem('farutech_available_instances');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  
  const [selectedTenant, setSelectedTenant] = useState<TenantOptionDto | null>(() => {
    try {
      const stored = sessionStorage.getItem('farutech_selected_tenant');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [currentModule, setCurrentModule] = useState(() => {
     return localStorage.getItem('farutech_current_module') || 'pos';
  });

  const { refetch: refetchTenants } = useAvailableTenants({ enabled: false });

  // Update HTML attribute for styling when module changes
  useEffect(() => {
    document.documentElement.setAttribute('data-module', currentModule);
  }, [currentModule]);

  // ============================================================================
  // Initialization Logic (Restoring Context State)
  // ============================================================================
  useEffect(() => {
    const initializeAppContext = () => {
      const token = TokenManager.getAccessToken();
      const intermediateToken = TokenManager.getIntermediateToken();

      if (token) {
        // We have a full session, no selection needed usually
        setRequiresContextSelection(false);
        // Clear temp storage if any left over
        if (intermediateToken) {
           // Cleanup residual intermediate state
           TokenManager.clearIntermediateToken();
           resetSelectionState();
        }
      } else if (intermediateToken) {
        // We are in the middle of selection
        setRequiresContextSelection(true);
        // Ensure tenants are loaded (from sessionStorage init above)
        if (availableTenants.length === 0) {
            // If we have token but no tenants, something is wrong or refreshed.
            // Attempt to refresh or logout? For safety, let's keep as is, user might need to re-login if storage cleared.
        }
      } else {
        // No tokens
        setRequiresContextSelection(false);
        resetSelectionState();
      }
    };

    initializeAppContext();
  }, [availableTenants.length]);

  const resetSelectionState = () => {
      setAvailableTenants([]);
      setAvailableInstances([]);
      setSelectedTenant(null);
      sessionStorage.removeItem('farutech_available_tenants');
      sessionStorage.removeItem('farutech_available_instances');
      sessionStorage.removeItem('farutech_selected_tenant');
  };

  // ============================================================================
  // Login Flow Orchestration
  // ============================================================================
  const loginWithFlow = async (credentials: LoginRequest) => {
    // 1. Perform Session Login
    const response = await sessionLogin(credentials);

    // 2. Handle Context Logic
    if (response.requiresContextSelection) {
        // Store intermediate state
        if (response.intermediateToken) {
            TokenManager.setIntermediateToken(response.intermediateToken);
        }
        
        const tenants = response.availableTenants || [];
        setAvailableTenants(tenants);
        sessionStorage.setItem('farutech_available_tenants', JSON.stringify(tenants));
        setRequiresContextSelection(true);
        
        navigate('/home'); // Corrected from /launcher
        toast.info('Por favor, selecciona tu organización');
        return;
    } 
    
    // Direct Access
    if (response.accessToken) {
        TokenManager.setAccessToken(response.accessToken);
        
        if (response.selectedTenantId) {
             TokenManager.setTenantContext({
                tenantId: response.selectedTenantId,
                companyName: response.companyName,
                role: response.role,
             });
        }
        
        // Update User in Session with Context Details
        setUser({
            ...user!, // Existing session info
            role: response.role, // Update role
            // Add mixin properties (SessionContext types might need extending or we cast)
            ...({
                tenantId: response.selectedTenantId,
                companyName: response.companyName
            } as any)
        });

        toast.success(`¡Bienvenido${response.companyName ? ' a ' + response.companyName : ''}!`);
        navigate('/home');
    }
  };

  // ============================================================================
  // Select Context Action
  // ============================================================================
  const selectContext = async (tenantId: string, redirectPath: string = '/home') => {
      const intermediateToken = TokenManager.getIntermediateToken();
      if (!intermediateToken) {
          toast.error('Sesión expirada.');
          sessionLogout();
          return;
      }

      const tenant = availableTenants.find(t => t.tenantId === tenantId);
      if (!tenant) throw new Error('Tenant no encontrado');

      setSelectedTenant(tenant);
      sessionStorage.setItem('farutech_selected_tenant', JSON.stringify(tenant));

      // Multi-instance check
      if (tenant.instances && tenant.instances.length > 1) {
          setAvailableInstances(tenant.instances);
          sessionStorage.setItem('farutech_available_instances', JSON.stringify(tenant.instances));
          setRequiresInstanceSelection(true);
          setRequiresContextSelection(false);
          toast.info('Selecciona la aplicación');
          navigate('/select-instance'); // Warning: We wanted to remove this route? 
          // Actually, Phase 1 said remove /select-instance logic, but here we might still need it 
          // OR better: use the new HomePage logic for it.
          // For now, let's stick to existing flow until strictly replaced.
          return;
      }

      // Single instance
      if (tenant.instances && tenant.instances.length === 1) {
          await selectInstanceInternal(tenantId, tenant.instances[0], intermediateToken);
          return;
      }

      // No instances (Tenant Only)
      const request: SelectContextRequest = { intermediateToken, tenantId };
      const response = await authService.selectContext(request);

      if (!response.accessToken) throw new Error('No access token received');

      TokenManager.setAccessToken(response.accessToken);
      
      // Cleanup Intermediate
      TokenManager.clearIntermediateToken();
      resetSelectionState(); // Clear selection lists
      setRequiresContextSelection(false);

      TokenManager.setTenantContext({
          tenantId: response.tenantId,
          companyName: response.companyName,
          role: response.role
      });

      // Update User
      setUser({
          email: user?.email || '', // Keep email
          fullName: response.companyName, // Update name to context
          role: response.role,
           ...({
                tenantId: response.tenantId,
                companyName: response.companyName
            } as any)
      });

      navigate(redirectPath);
  };

  // ============================================================================
  // Select Instance Action
  // ============================================================================
  const selectInstance = async (instanceId: string) => {
      const intermediateToken = TokenManager.getIntermediateToken();
      if (!intermediateToken || !selectedTenant) return;

      const instance = availableInstances.find(i => i.instanceId === instanceId);
      if (!instance) throw new Error('Instancia no encontrada');

      await selectInstanceInternal(selectedTenant.tenantId, instance, intermediateToken);
  };

  const selectInstanceInternal = async (tenantId: string, instance: InstanceDto, intermediateToken: string) => {
      const request: SelectContextRequest = { intermediateToken, tenantId }; // Note: API might need instanceId if it supports direct instance selection? 
      // Current API seems to perform SelectContext on Tenant, then we assume instance context implies using that tenant token + knowing the instance ID.
      // Wait, original AuthContext Logic:
      // It calls authService.selectContext just with TenantID!
      // And then manually sets the user object with instance details.
      
      const response = await authService.selectContext(request);
      if (!response.accessToken) throw new Error('No access token');

      TokenManager.setAccessToken(response.accessToken);
      TokenManager.clearIntermediateToken();
      resetSelectionState();
      
      setRequiresContextSelection(false);
      setRequiresInstanceSelection(false);

      TokenManager.setTenantContext({
          tenantId: response.tenantId,
          companyName: response.companyName,
          role: response.role,
      });

      // Update Module
      const appTypeToModule: Record<string, string> = {
        'FARUPOS': 'pos',
        'FARUINV': 'erp',
        'FARUSEG': 'erp',
      };
      const moduleType = appTypeToModule[instance.type] || 'pos';
      setCurrentModule(moduleType);
      localStorage.setItem('farutech_current_module', moduleType);

      // Update User
       setUser({
          email: user?.email || '',
          fullName: response.companyName,
          role: response.role,
           ...({
                tenantId: response.tenantId,
                companyName: response.companyName,
                instanceId: instance.instanceId,
                instanceName: instance.name,
                instanceType: instance.type,
                instanceUrl: instance.url
            } as any)
      });

      toast.success(`Accediendo a ${instance.name}`);
      
      if (instance.url) {
        const isExternal = instance.url.startsWith('http') && !instance.url.includes(window.location.hostname);
        if (isExternal) window.location.href = instance.url;
        else navigate('/dashboard'); // Normalized path
      } else {
        navigate('/dashboard');
      }
  };

  // ============================================================================
  // Utilities
  // ============================================================================
  const refreshAvailableTenants = async () => {
       const result = await refetchTenants();
       if (result.data) {
           setAvailableTenants(result.data);
           sessionStorage.setItem('farutech_available_tenants', JSON.stringify(result.data));
       }
  };

  const isOrchestrator = () => {
      return user?.role?.toLowerCase() === 'superadmin' || user?.role?.toLowerCase() === 'admin';
  };

  return (
    <AppContext.Provider value={{
        requiresContextSelection,
        requiresInstanceSelection,
        availableTenants,
        availableInstances,
        selectedTenant,
        currentModule,
        loginWithFlow,
        selectContext,
        selectInstance,
        refreshAvailableTenants,
        isOrchestrator
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
