/**
 * Color Tokens - Farutech Design System
 * Unified color system derived from Golden Source (resource/webapp)
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: {
      hsl: '215 90% 52%',
      hex: '#1E88E5',
      rgb: 'rgb(30, 136, 229)',
    },
    secondary: {
      hsl: '222 47% 11%',
      hex: '#1A2332',
      rgb: 'rgb(26, 35, 50)',
    },
    accent: {
      hsl: '170 80% 45%',
      hex: '#16A085',
      rgb: 'rgb(22, 160, 133)',
    },
  },

  // Semantic Colors
  semantic: {
    success: {
      hsl: '142 76% 36%',
      hex: '#2E7D32',
      light: '#E8F5E9',
    },
    warning: {
      hsl: '38 92% 50%',
      hex: '#F9A825',
      light: '#FFF9C4',
    },
    error: {
      hsl: '0 84% 60%',
      hex: '#EF5350',
      light: '#FFEBEE',
    },
    info: {
      hsl: '199 89% 48%',
      hex: '#0288D1',
      light: '#E1F5FE',
    },
  },

  // Neutral Scale (Gray)
  neutral: {
    50: '#F5F6FA',
    100: '#E0E0E0',
    200: '#BDBDBD',
    300: '#9E9E9E',
    400: '#757575',
    500: '#616161',
    600: '#424242',
    700: '#303030',
    800: '#212121',
    900: '#121212',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
  },

  // Module-Specific Colors
  modules: {
    medical: {
      primary: { hsl: '174 72% 46%', hex: '#2BBBAD' },
      secondary: { hsl: '168 76% 42%', hex: '#26A69A' },
      accent: { hsl: '180 68% 52%', hex: '#4DD0E1' },
      gradient: {
        from: '174 72% 46%',
        to: '168 76% 42%',
      },
    },
    vet: {
      primary: { hsl: '25 95% 53%', hex: '#FF8A00' },
      secondary: { hsl: '21 90% 48%', hex: '#E97E00' },
      accent: { hsl: '142 69% 45%', hex: '#4CAF50' },
      gradient: {
        from: '25 95% 53%',
        to: '142 69% 45%',
      },
    },
    erp: {
      primary: { hsl: '215 90% 52%', hex: '#1E88E5' },
      secondary: { hsl: '222 47% 11%', hex: '#1A2332' },
      accent: { hsl: '170 80% 45%', hex: '#16A085' },
      gradient: {
        from: '215 90% 52%',
        to: '222 47% 11%',
      },
    },
    pos: {
      primary: { hsl: '280 87% 57%', hex: '#9C27B0' },
      secondary: { hsl: '292 84% 52%', hex: '#BA68C8' },
      accent: { hsl: '267 83% 60%', hex: '#7E57C2' },
      gradient: {
        from: '280 87% 57%',
        to: '292 84% 52%',
      },
    },
  },
} as const

export type ColorToken = typeof colors
export type ModuleName = keyof typeof colors.modules
