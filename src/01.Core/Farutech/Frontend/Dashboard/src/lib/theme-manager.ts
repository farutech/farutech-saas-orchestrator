// ============================================================================
// THEME SYSTEM - Dynamic Theming Engine
// ============================================================================

export type ThemeMode = 'orchestrator' | 'medical' | 'veterinary' | 'erp' | 'pos';

export interface ThemeConfig {
  mode: ThemeMode;
  name: string;
  primaryColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  description: string;
}

export const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  orchestrator: {
    mode: 'orchestrator',
    name: 'Orchestrator',
    primaryColor: 'hsl(222, 47%, 11%)', // Deep Blue/Slate
    gradientFrom: 'from-slate-950',
    gradientTo: 'to-blue-950',
    icon: '⚙️',
    description: 'Panel de administración',
  },
  medical: {
    mode: 'medical',
    name: 'Medical',
    primaryColor: 'hsl(183, 66%, 48%)', // Turquoise/Cyan
    gradientFrom: 'from-cyan-950',
    gradientTo: 'to-teal-900',
    icon: '🏥',
    description: 'Sistema hospitalario',
  },
  veterinary: {
    mode: 'veterinary',
    name: 'Veterinary',
    primaryColor: 'hsl(25, 95%, 53%)', // Orange/Earth
    gradientFrom: 'from-orange-950',
    gradientTo: 'to-amber-900',
    icon: '🐾',
    description: 'Clínica veterinaria',
  },
  erp: {
    mode: 'erp',
    name: 'ERP',
    primaryColor: 'hsl(263, 70%, 50%)', // Violet/Indigo
    gradientFrom: 'from-violet-950',
    gradientTo: 'to-purple-900',
    icon: '📊',
    description: 'Gestión empresarial',
  },
  pos: {
    mode: 'pos',
    name: 'POS',
    primaryColor: 'hsl(263, 70%, 50%)', // Violet/Indigo
    gradientFrom: 'from-indigo-950',
    gradientTo: 'to-blue-900',
    icon: '🛒',
    description: 'Punto de venta',
  },
};

// ============================================================================
// Theme Manager
// ============================================================================

export class ThemeManager {
  private static currentTheme: ThemeMode = 'orchestrator';

  /**
   * Apply theme to document root
   */
  static applyTheme(mode: ThemeMode): void {
    const config = THEME_CONFIGS[mode];
    const root = document.documentElement;

    // Set CSS custom properties
    root.style.setProperty('--theme-primary', config.primaryColor);
    
    // Store current theme
    this.currentTheme = mode;
    localStorage.setItem('farutech_theme_mode', mode);

    // Add theme class to body
    document.body.className = document.body.className.replace(
      /theme-\w+/g,
      ''
    );
    document.body.classList.add(`theme-${mode}`);
  }

  /**
   * Get current theme
   */
  static getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }

  /**
   * Initialize theme from storage
   */
  static initializeTheme(): void {
    const stored = localStorage.getItem('farutech_theme_mode') as ThemeMode;
    if (stored && THEME_CONFIGS[stored]) {
      this.applyTheme(stored);
    }
  }

  /**
   * Get theme config
   */
  static getThemeConfig(mode: ThemeMode): ThemeConfig {
    return THEME_CONFIGS[mode];
  }

  /**
   * Detect theme from product type
   */
  static detectThemeFromProduct(productName: string): ThemeMode {
    const name = productName.toLowerCase();
    
    if (name.includes('medical') || name.includes('hospital') || name.includes('health')) {
      return 'medical';
    }
    if (name.includes('vet') || name.includes('animal')) {
      return 'veterinary';
    }
    if (name.includes('erp') || name.includes('enterprise')) {
      return 'erp';
    }
    if (name.includes('pos') || name.includes('point of sale')) {
      return 'pos';
    }
    
    return 'orchestrator';
  }
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  ThemeManager.initializeTheme();
}
