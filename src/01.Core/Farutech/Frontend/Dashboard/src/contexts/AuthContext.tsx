import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from './SessionContext';
import { useAppContext } from './AppContext';
import { LoginRequest, RegisterRequest, TenantOptionDto, InstanceDto } from '@/types/api';

// ============================================================================
// Types (Re-exporting for compatibility)
// ============================================================================

export interface AuthContextType {
  user: any; // Using any or the intersection type since we merge SessionUser and Context Details
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresContextSelection: boolean;
  requiresInstanceSelection: boolean;
  availableTenants: TenantOptionDto[];
  availableInstances: InstanceDto[];
  selectedTenant: TenantOptionDto | null;

  login: (credentials: LoginRequest)
        => Promise<void>;
  selectContext: (tenantId: string, redirectPath?: string)
        => Promise<void>;
  selectInstance: (instanceId: string)
        => Promise<void>;
  register: (data: RegisterRequest)
        => Promise<void>;
  logout: ()
        => void;
  refreshAvailableTenants: ()
        => Promise<void>;

  hasRole: (role: string)
        => boolean;
  isOrchestrator: ()
        => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @deprecated AuthProvider is deprecated. Please use SessionProvider and AppProvider in App.tsx.
 * This component now acts as a bridge for backwards compatibility.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children })
        => {
  const session = useSession();
  const app = useAppContext();

  // Combine actions and state
  const value: AuthContextType = {
    // State
    user: session.user,
    isAuthenticated: session.isAuthenticated,
    isLoading: session.isLoading,
    
    requiresContextSelection: app.requiresContextSelection,
    requiresInstanceSelection: app.requiresInstanceSelection,
    availableTenants: app.availableTenants,
    availableInstances: app.availableInstances,
    selectedTenant: app.selectedTenant,

    // Actions
    login: app.loginWithFlow, // Main divergence: AppContext handles the flow optimization
    selectContext: app.selectContext,
    selectInstance: app.selectInstance,
    register: session.register,
    logout: session.logout,
    refreshAvailableTenants: app.refreshAvailableTenants,
    
    // Utilities
    hasRole: (role: string)
        => session.user?.role?.toLowerCase() === role.toLowerCase(),
    isOrchestrator: app.isOrchestrator
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider (or SessionProvider+AppProvider via bridge)');
  }
  return context;
};
