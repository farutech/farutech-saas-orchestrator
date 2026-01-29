import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenManager } from '@/lib/api-client';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types/api';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface SessionUser {
  email: string;
  fullName?: string;
  role?: string;
  // Global user properties only - context specific props go to AppContext
}

export interface SessionContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<any>; // Returns full response for AppContext to handle flow
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: SessionUser | null) => void; // Allow AppContext to update user details if needed
}

// ============================================================================
// Context Creation
// ============================================================================

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(() => {
    try {
      const stored = localStorage.getItem('farutech_session_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize session from tokens
  useEffect(() => {
    const initializeSession = () => {
      const token = TokenManager.getAccessToken();
      const intermediateToken = TokenManager.getIntermediateToken();

      if (!token && !intermediateToken) {
        setUser(null);
        localStorage.removeItem('farutech_session_user');
      } 
      // Note: We blindly trust the stored user if tokens exist for now, 
      // or we could decode the token. Sticking to localStorage for persistence consistency.
      
      setIsLoading(false);
    };

    initializeSession();
  }, []);

  // Update storage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('farutech_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('farutech_session_user');
    }
  }, [user]);

  // Login Action
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
      // We don't set user here fully yet, because we might not know the context.
      // However, we can set the basic identity if available.
      if (response.accessToken || response.intermediateToken) {
        // Basic identity established
        const baseUser: SessionUser = {
          email: credentials.email || '',
          fullName: response.companyName || credentials.email || '', // Fallback to provided credentials since response lacks email/name
          role: response.role,
        };
        // Only set user if we have a full token OR if we want to show identity during selection
        // For now, let's allow it.
        setUser(baseUser);
      }
      
      return response; // Pass to consumer (AppContext) to handle routing/tokens
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register Action
  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success('Registro exitoso. Por favor, inicia sesión.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Error en el registro');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Action
  const logout = useCallback(() => {
    TokenManager.clearAllTokens();
    setUser(null);
    localStorage.removeItem('farutech_session_user');
    // We expect AppContext to listen or be cleared separately
    toast.info('Sesión cerrada');
    navigate('/login');
  }, [navigate]);

  return (
    <SessionContext.Provider value={{
      user,
      isAuthenticated: !!user || !!TokenManager.getAccessToken() || !!TokenManager.getIntermediateToken(),
      isLoading,
      login,
      register,
      logout,
      setUser
    }}>
      {children}
    </SessionContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
