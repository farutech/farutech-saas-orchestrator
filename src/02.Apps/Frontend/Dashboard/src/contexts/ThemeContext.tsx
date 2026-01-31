// ============================================================================
// THEME CONTEXT - Dynamic theme and app-type management
// ============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export type AppTheme = 
  | 'default' 
  | 'erp' 
  | 'pos' 
  | 'crm' 
  | 'medical' 
  | 'vet' 
  | 'marketing' 
  | 'production'
  | 'custom';

export type ColorMode = 'light' | 'dark' | 'system';

interface TenantCustomization {
  primaryColor?: string; // HSL values like "250 89% 60%"
  logo?: string;
  fontFamily?: string;
  companyName?: string;
}

interface ThemeContextType {
  // App theme (by application type)
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
  
  // Color mode (light/dark)
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  isDark: boolean;
  
  // Tenant customization
  tenantCustomization: TenantCustomization | null;
  setTenantCustomization: (customization: TenantCustomization | null) => void;
  
  // Theme info
  getThemeInfo: (theme: AppTheme) => ThemeInfo;
  availableThemes: ThemeInfo[];
}

interface ThemeInfo {
  id: AppTheme;
  name: string;
  description: string;
  primaryColor: string;
  icon: string;
}

// ============================================================================
// Theme Definitions
// ============================================================================

const themeDefinitions: Record<AppTheme, ThemeInfo> = {
  default: {
    id: 'default',
    name: 'Farutech',
    description: 'Tema principal de la plataforma',
    primaryColor: 'hsl(250 89% 60%)',
    icon: 'Sparkles',
  },
  erp: {
    id: 'erp',
    name: 'ERP',
    description: 'Gestión empresarial corporativa',
    primaryColor: 'hsl(221 83% 53%)',
    icon: 'Building2',
  },
  pos: {
    id: 'pos',
    name: 'POS',
    description: 'Punto de venta dinámico',
    primaryColor: 'hsl(280 87% 57%)',
    icon: 'ShoppingCart',
  },
  crm: {
    id: 'crm',
    name: 'CRM',
    description: 'Gestión de relaciones con clientes',
    primaryColor: 'hsl(25 95% 53%)',
    icon: 'Users',
  },
  medical: {
    id: 'medical',
    name: 'Médico',
    description: 'Gestión de clínicas y salud',
    primaryColor: 'hsl(174 72% 46%)',
    icon: 'Stethoscope',
  },
  vet: {
    id: 'vet',
    name: 'Veterinaria',
    description: 'Cuidado animal y servicios',
    primaryColor: 'hsl(142 69% 45%)',
    icon: 'PawPrint',
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    description: 'Campañas y análisis',
    primaryColor: 'hsl(340 82% 52%)',
    icon: 'Megaphone',
  },
  production: {
    id: 'production',
    name: 'Producción',
    description: 'Gestión industrial',
    primaryColor: 'hsl(215 25% 45%)',
    icon: 'Factory',
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    description: 'Tema personalizado del cliente',
    primaryColor: 'hsl(250 89% 60%)',
    icon: 'Palette',
  },
};

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: AppTheme;
  defaultColorMode?: ColorMode;
}

export function ThemeProvider({
  children,
  defaultTheme = 'default',
  defaultColorMode = 'system',
}: ThemeProviderProps) {
  // Initialize from localStorage or URL params
  const [appTheme, setAppThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      // Check URL params first
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get('theme') as AppTheme;
      if (urlTheme && themeDefinitions[urlTheme]) return urlTheme;
      
      // Then check localStorage
      const stored = localStorage.getItem('farutech_app_theme') as AppTheme;
      if (stored && themeDefinitions[stored]) return stored;
    }
    return defaultTheme;
  });

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('farutech_color_mode') as ColorMode;
      if (stored) return stored;
    }
    return defaultColorMode;
  });

  const [tenantCustomization, setTenantCustomization] = useState<TenantCustomization | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Apply color mode
  useEffect(() => {
    const updateDarkMode = () => {
      let dark = false;
      
      if (colorMode === 'dark') {
        dark = true;
      } else if (colorMode === 'system') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    };

    updateDarkMode();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateDarkMode);
    
    return () => mediaQuery.removeEventListener('change', updateDarkMode);
  }, [colorMode]);

  // Apply app theme
  useEffect(() => {
    document.documentElement.setAttribute('data-app-theme', appTheme);
    localStorage.setItem('farutech_app_theme', appTheme);
  }, [appTheme]);

  // Apply tenant customization
  useEffect(() => {
    if (tenantCustomization?.primaryColor) {
      document.documentElement.style.setProperty('--tenant-primary', tenantCustomization.primaryColor);
    }
    if (tenantCustomization?.fontFamily) {
      document.documentElement.style.setProperty('--font-sans', tenantCustomization.fontFamily);
    }
  }, [tenantCustomization]);

  const setAppTheme = useCallback((theme: AppTheme) => {
    setAppThemeState(theme);
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('farutech_color_mode', mode);
  }, []);

  const getThemeInfo = useCallback((theme: AppTheme): ThemeInfo => {
    return themeDefinitions[theme] || themeDefinitions.default;
  }, []);

  const availableThemes = Object.values(themeDefinitions).filter(t => t.id !== 'custom');

  return (
    <ThemeContext.Provider
      value={{
        appTheme,
        setAppTheme,
        colorMode,
        setColorMode,
        isDark,
        tenantCustomization,
        setTenantCustomization,
        getThemeInfo,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
