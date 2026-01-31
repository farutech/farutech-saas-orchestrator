import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ModuleType, moduleConfigs, User, Notification } from '@/types/farutech';

interface FarutechContextType {
  // Module state
  currentModule: ModuleType | null;
  setCurrentModule: (module: ModuleType | null)
        => void;
  isTransitioning: boolean;
  
  // Auth state (simulated)
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string)
        => Promise<boolean>;
  logout: ()
        => void;
  
  // Theme
  isDark: boolean;
  toggleTheme: ()
        => void;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string)
        => void;
  
  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean)
        => void;
}

const FarutechContext = createContext<FarutechContextType | undefined>(undefined);

// Mock user for demo
const mockUser: User = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@farutech.com',
  role: 'admin',
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nueva cita programada',
    message: 'Paciente María García - 10:00 AM',
    type: 'info',
    read: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Alerta de inventario',
    message: 'Stock bajo en medicamentos',
    type: 'warning',
    read: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Pago recibido',
    message: 'Factura #1234 pagada exitosamente',
    type: 'success',
    read: true,
    createdAt: new Date(),
  },
];

export function FarutechProvider({ children }: { children: ReactNode }) {
  // Inicializar desde localStorage si existe
  const initialModule = (localStorage.getItem('farutech_current_module') as ModuleType) || null;
  const [currentModule, setCurrentModuleState] = useState<ModuleType | null>(initialModule);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState<User | null>(mockUser); // Auto-logged for demo
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);

  const setCurrentModule = (module: ModuleType | null)
        => {
    if (module !== currentModule) {
      setIsTransitioning(true);
      setIsLoading(true);
      
      // Guardar en localStorage
      if (module) {
        localStorage.setItem('farutech_current_module', module);
      } else {
        localStorage.removeItem('farutech_current_module');
      }
      
      setTimeout(()
        => {
        setCurrentModuleState(module);
        
        // Update document attribute for CSS theming
        if (module) {
          document.documentElement.setAttribute('data-module', module);
        } else {
          document.documentElement.removeAttribute('data-module');
        }
        
        setTimeout(()
        => {
          setIsTransitioning(false);
          setIsLoading(false);
        }, 300);
      }, 400);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      setUser(mockUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = ()
        => {
    setUser(null);
    setCurrentModule(null);
    document.documentElement.removeAttribute('data-module');
  };

  const toggleTheme = ()
        => {
    setIsDark(!isDark);
  };

  const markAsRead = (id: string)
        => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(()
        => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <FarutechContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        isTransitioning,
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isDark,
        toggleTheme,
        notifications,
        unreadCount,
        markAsRead,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </FarutechContext.Provider>
  );
}

export function useFarutech() {
  const context = useContext(FarutechContext);
  if (context === undefined) {
    throw new Error('useFarutech must be used within a FarutechProvider');
  }
  return context;
}
